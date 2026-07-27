import "dotenv/config";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { google } from "googleapis";
import {
  getGoogleAuthClient,
  requireEnv,
  WEBMASTERS_READONLY_SCOPE,
} from "./gsc-auth.mjs";

const MAX_ROW_LIMIT = 25_000;

function parseArgs(argv) {
  const args = {};
  for (let i = 0; i < argv.length; i += 1) {
    const item = argv[i];
    if (!item.startsWith("--")) continue;
    const key = item.slice(2);
    const next = argv[i + 1];
    if (!next || next.startsWith("--")) {
      args[key] = "true";
    } else {
      args[key] = next;
      i += 1;
    }
  }
  return args;
}

function isoDateDaysAgo(days) {
  const date = new Date();
  date.setUTCDate(date.getUTCDate() - days);
  return date.toISOString().slice(0, 10);
}

function dimensionsFromArg(value) {
  return (value ?? "date,page,query")
    .split(",")
    .map((dimension) => dimension.trim())
    .filter(Boolean);
}

function buildFilters(args) {
  const filters = [];
  const add = (dimension, operator, expression) => {
    if (expression) filters.push({ dimension, operator, expression });
  };

  add("page", "contains", args.pageContains);
  add("query", "contains", args.queryContains);
  add("country", "equals", args.country);
  add("device", "equals", args.device?.toUpperCase());

  return filters.length
    ? [{ groupType: "and", filters }]
    : undefined;
}

function csvEscape(value) {
  const text = String(value ?? "");
  return /[",\n\r]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

function rowsToCsv(rows, dimensions) {
  const header = [...dimensions, "clicks", "impressions", "ctr", "position"];
  const lines = [header.map(csvEscape).join(",")];

  for (const row of rows) {
    const values = [
      ...(row.keys ?? []),
      row.clicks ?? 0,
      row.impressions ?? 0,
      row.ctr ?? 0,
      row.position ?? 0,
    ];
    lines.push(values.map(csvEscape).join(","));
  }

  return `${lines.join("\n")}\n`;
}

function summarize(rows, dimensions) {
  const clicks = rows.reduce((sum, row) => sum + (row.clicks ?? 0), 0);
  const impressions = rows.reduce(
    (sum, row) => sum + (row.impressions ?? 0),
    0,
  );
  const weightedPosition = rows.reduce(
    (sum, row) => sum + (row.position ?? 0) * (row.impressions ?? 0),
    0,
  );

  const aggregateBy = (dimension) => {
    const index = dimensions.indexOf(dimension);
    if (index === -1) return [];

    const groups = new Map();
    for (const row of rows) {
      const key = row.keys?.[index] ?? "(vide)";
      const current =
        groups.get(key) ?? { key, clicks: 0, impressions: 0, positionWeight: 0 };
      current.clicks += row.clicks ?? 0;
      current.impressions += row.impressions ?? 0;
      current.positionWeight += (row.position ?? 0) * (row.impressions ?? 0);
      groups.set(key, current);
    }

    return [...groups.values()]
      .map((item) => ({
        key: item.key,
        clicks: item.clicks,
        impressions: item.impressions,
        ctr: item.impressions ? item.clicks / item.impressions : 0,
        position: item.impressions
          ? item.positionWeight / item.impressions
          : 0,
      }))
      .sort((a, b) => b.clicks - a.clicks || b.impressions - a.impressions)
      .slice(0, 20);
  };

  return {
    rows: rows.length,
    clicks,
    impressions,
    ctr: impressions ? clicks / impressions : 0,
    position: impressions ? weightedPosition / impressions : 0,
    topPages: aggregateBy("page"),
    topQueries: aggregateBy("query"),
  };
}

function markdownReport({ siteUrl, startDate, endDate, dimensions, dataState, summary }) {
  const pct = (value) => `${(value * 100).toFixed(2)}%`;
  const pos = (value) => value.toFixed(2);
  const table = (items, label) => {
    if (items.length === 0) return "";
    return [
      `\n## Top ${label}`,
      "| Item | Clicks | Impressions | CTR | Position |",
      "| --- | ---: | ---: | ---: | ---: |",
      ...items.map(
        (item) =>
          `| ${String(item.key).replace(/\|/g, "\\|")} | ${item.clicks.toFixed(
            0,
          )} | ${item.impressions.toFixed(0)} | ${pct(item.ctr)} | ${pos(
            item.position,
          )} |`,
      ),
    ].join("\n");
  };

  return [
    "# Rapport Google Search Console",
    "",
    `- Site: ${siteUrl}`,
    `- Période: ${startDate} -> ${endDate}`,
    `- Dimensions: ${dimensions.join(", ")}`,
    `- Data state: ${dataState}`,
    `- Lignes: ${summary.rows}`,
    `- Clics: ${summary.clicks.toFixed(0)}`,
    `- Impressions: ${summary.impressions.toFixed(0)}`,
    `- CTR: ${pct(summary.ctr)}`,
    `- Position moyenne: ${pos(summary.position)}`,
    table(summary.topPages, "pages"),
    table(summary.topQueries, "requêtes"),
    "",
  ].join("\n");
}

async function queryAllRows(webmasters, siteUrl, requestBody, maxRows) {
  const rows = [];
  let startRow = 0;
  const rowLimit = Math.min(requestBody.rowLimit, MAX_ROW_LIMIT);

  while (rows.length < maxRows) {
    const response = await webmasters.searchanalytics.query({
      siteUrl,
      requestBody: {
        ...requestBody,
        rowLimit: Math.min(rowLimit, maxRows - rows.length),
        startRow,
      },
    });

    const batch = response.data.rows ?? [];
    rows.push(...batch);
    if (batch.length < rowLimit) break;
    startRow += batch.length;
  }

  return rows;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const siteUrl =
    args.siteUrl ?? process.env.GSC_SITE_URL ?? "sc-domain:clubsactionnaires.fr";
  const startDate = args.start ?? isoDateDaysAgo(9);
  const endDate = args.end ?? isoDateDaysAgo(2);
  const dimensions = dimensionsFromArg(args.dimensions);
  const dataState = args.dataState ?? process.env.GSC_DATA_STATE ?? "all";
  const rowLimit = Math.min(Number(args.rowLimit ?? MAX_ROW_LIMIT), MAX_ROW_LIMIT);
  const maxRows = Number(args.maxRows ?? 100_000);
  const outputDir = path.resolve(args.output ?? "data/gsc");

  if (!siteUrl) requireEnv("GSC_SITE_URL");

  const auth = await getGoogleAuthClient([WEBMASTERS_READONLY_SCOPE]);
  const webmasters = google.webmasters({ version: "v3", auth });

  const requestBody = {
    startDate,
    endDate,
    dimensions,
    type: args.type ?? "web",
    aggregationType: args.aggregationType ?? "auto",
    dataState,
    rowLimit,
    dimensionFilterGroups: buildFilters(args),
  };

  const rows = await queryAllRows(webmasters, siteUrl, requestBody, maxRows);
  const summary = summarize(rows, dimensions);
  const stamp = new Date().toISOString().replace(/[:.]/g, "-");
  const baseName = `search-analytics-${startDate}_${endDate}-${stamp}`;
  const payload = {
    siteUrl,
    startDate,
    endDate,
    dimensions,
    dataState,
    requestBody,
    summary,
    rows,
  };

  await mkdir(outputDir, { recursive: true });
  await writeFile(
    path.join(outputDir, `${baseName}.json`),
    JSON.stringify(payload, null, 2),
  );
  await writeFile(path.join(outputDir, `${baseName}.csv`), rowsToCsv(rows, dimensions));
  await writeFile(
    path.join(outputDir, `${baseName}.md`),
    markdownReport({ siteUrl, startDate, endDate, dimensions, dataState, summary }),
  );

  console.log(`GSC export terminé: ${rows.length} lignes`);
  console.log(`Période: ${startDate} -> ${endDate}`);
  console.log(`Clics: ${summary.clicks.toFixed(0)}`);
  console.log(`Impressions: ${summary.impressions.toFixed(0)}`);
  console.log(`CTR: ${(summary.ctr * 100).toFixed(2)}%`);
  console.log(`Position moyenne: ${summary.position.toFixed(2)}`);
  console.log(`Sortie: ${path.join(outputDir, baseName)}.{json,csv,md}`);
}

main().catch((error) => {
  console.error(`Erreur GSC: ${error.message}`);
  process.exit(1);
});
