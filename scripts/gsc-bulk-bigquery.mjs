import "dotenv/config";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { google } from "googleapis";
import {
  BIGQUERY_READONLY_SCOPE,
  getGoogleAuthClient,
  requireEnv,
} from "./gsc-auth.mjs";

function parseArgs(argv) {
  const args = {};
  for (let i = 0; i < argv.length; i += 1) {
    const item = argv[i];
    if (!item.startsWith("--")) continue;
    const key = item.slice(2);
    const next = argv[i + 1];
    args[key] = next && !next.startsWith("--") ? next : "true";
    if (args[key] === next) i += 1;
  }
  return args;
}

function isoDateDaysAgo(days) {
  const date = new Date();
  date.setUTCDate(date.getUTCDate() - days);
  return date.toISOString().slice(0, 10);
}

function csvEscape(value) {
  const text = String(value ?? "");
  return /[",\n\r]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

function tableRef(projectId, dataset, table) {
  return `\`${projectId}.${dataset}.${table}\``;
}

function buildQuery({ projectId, dataset, table, startDate, endDate, limit }) {
  const ref = tableRef(projectId, dataset, table);
  const isUrlTable = table.includes("url");
  const pageColumn = isUrlTable ? "url" : "site_url";

  return `
SELECT
  data_date,
  ${pageColumn} AS page,
  query,
  country,
  device,
  search_type,
  SUM(clicks) AS clicks,
  SUM(impressions) AS impressions,
  SAFE_DIVIDE(SUM(clicks), SUM(impressions)) AS ctr,
  SAFE_DIVIDE(SUM(sum_top_position), SUM(impressions)) + 1 AS position
FROM ${ref}
WHERE data_date BETWEEN DATE("${startDate}") AND DATE("${endDate}")
GROUP BY data_date, page, query, country, device, search_type
ORDER BY clicks DESC, impressions DESC
LIMIT ${Number(limit)}
`.trim();
}

function rowsToCsv(rows) {
  if (rows.length === 0) return "";
  const header = Object.keys(rows[0]);
  return [
    header.map(csvEscape).join(","),
    ...rows.map((row) => header.map((key) => csvEscape(row[key])).join(",")),
    "",
  ].join("\n");
}

function normalizeBigQueryRow(row) {
  const result = {};
  for (const [key, value] of Object.entries(row.f ?? {})) {
    result[key] = value?.v;
  }
  return result;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const projectId =
    args.projectId ?? process.env.GSC_BQ_PROJECT_ID ?? requireEnv("GSC_BQ_PROJECT_ID");
  const dataset = args.dataset ?? process.env.GSC_BQ_DATASET ?? requireEnv("GSC_BQ_DATASET");
  const table = args.table ?? process.env.GSC_BQ_TABLE ?? "searchdata_url_impression";
  const startDate = args.start ?? isoDateDaysAgo(9);
  const endDate = args.end ?? isoDateDaysAgo(2);
  const limit = Number(args.limit ?? 10_000);
  const outputDir = path.resolve(args.output ?? "data/gsc/bigquery");

  const auth = await getGoogleAuthClient([BIGQUERY_READONLY_SCOPE]);
  const bigquery = google.bigquery({ version: "v2", auth });
  const query = buildQuery({ projectId, dataset, table, startDate, endDate, limit });

  const response = await bigquery.jobs.query({
    projectId,
    requestBody: {
      query,
      useLegacySql: false,
    },
  });

  const rows = (response.data.rows ?? []).map((row) => {
    const schema = response.data.schema?.fields ?? [];
    const normalized = {};
    schema.forEach((field, index) => {
      normalized[field.name] = row.f?.[index]?.v;
    });
    return Object.keys(normalized).length ? normalized : normalizeBigQueryRow(row);
  });

  const stamp = new Date().toISOString().replace(/[:.]/g, "-");
  const baseName = `bulk-bigquery-${startDate}_${endDate}-${stamp}`;

  await mkdir(outputDir, { recursive: true });
  await writeFile(
    path.join(outputDir, `${baseName}.json`),
    JSON.stringify({ projectId, dataset, table, startDate, endDate, query, rows }, null, 2),
  );
  await writeFile(path.join(outputDir, `${baseName}.csv`), rowsToCsv(rows));

  console.log(`GSC BigQuery bulk export terminé: ${rows.length} lignes`);
  console.log(`Table: ${projectId}.${dataset}.${table}`);
  console.log(`Sortie: ${path.join(outputDir, baseName)}.{json,csv}`);
}

main().catch((error) => {
  console.error(`Erreur GSC BigQuery: ${error.message}`);
  process.exit(1);
});
