import { prisma } from "@/lib/prisma";
import { BASE_URL, SITE_NAME } from "@/lib/seo";
import {
  createSupabaseAdminClient,
  newsletterIssuesTableName,
} from "@/lib/supabase-admin";

type NewsletterCompany = {
  slug: string;
  name: string;
  description: string;
  sector: string;
  minShares: number | null;
  benefits: { title: string; description: string; value: string | null }[];
};

export type NewsletterIssueStatus =
  | "draft"
  | "validated"
  | "synced"
  | "scheduled"
  | "sent"
  | "archived";

type NewsletterIssueRow = {
  id: number;
  send_date: string;
  title: string;
  subject: string;
  preview_text: string;
  html: string;
  status: NewsletterIssueStatus;
  beehiiv_post_id: string | null;
  segment: string | null;
  scheduled_at: string | null;
  validated_at: string | null;
  created_at: string;
  updated_at: string;
};

export type NewsletterIssue = {
  id: number;
  sendDate: Date;
  title: string;
  subject: string;
  previewText: string;
  html: string;
  status: NewsletterIssueStatus;
  beehiivPostId: string | null;
  segment: string | null;
  scheduledAt: Date | null;
  validatedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
};

export type NewsletterIssueUpdateInput = {
  sendDate: Date;
  title: string;
  subject: string;
  previewText: string;
  html: string;
  segment: string | null;
};

const NEWSLETTER_ISSUE_SELECT =
  "id, send_date, title, subject, preview_text, html, status, beehiiv_post_id, segment, scheduled_at, validated_at, created_at, updated_at";

const BRAND_RED = "#D71921";
const INK = "#111111";
const MUTED = "#666666";
const BORDER = "#E7E7E7";
const SURFACE = "#F7F7F7";

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function stripHtml(value: string) {
  return value.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

function formatFrenchDate(date: Date) {
  return new Intl.DateTimeFormat("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Europe/Paris",
  }).format(date);
}

function getParisOffsetMinutes(date: Date) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "Europe/Paris",
    hourCycle: "h23",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }).formatToParts(date);
  const values = Object.fromEntries(parts.map((part) => [part.type, part.value]));
  const asUtc = Date.UTC(
    Number(values.year),
    Number(values.month) - 1,
    Number(values.day),
    Number(values.hour),
    Number(values.minute),
    Number(values.second),
  );

  return (asUtc - date.getTime()) / 60_000;
}

export function parisTimeToUtcDate(
  year: number,
  month: number,
  day: number,
  hour: number,
  minute = 0,
) {
  const firstGuess = new Date(Date.UTC(year, month - 1, day, hour, minute));
  const offset = getParisOffsetMinutes(firstGuess);
  const secondGuess = new Date(
    Date.UTC(year, month - 1, day, hour, minute) - offset * 60_000,
  );
  const correctedOffset = getParisOffsetMinutes(secondGuess);

  return new Date(
    Date.UTC(year, month - 1, day, hour, minute) - correctedOffset * 60_000,
  );
}

export function nextWeeklySendDateParis(from = new Date()) {
  const parisParts = new Intl.DateTimeFormat("en-US", {
    timeZone: "Europe/Paris",
    hourCycle: "h23",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    weekday: "short",
    hour: "2-digit",
  }).formatToParts(from);
  const values = Object.fromEntries(
    parisParts.map((part) => [part.type, part.value]),
  );
  const weekdayIndex = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(
    values.weekday,
  );
  const targetWeekday = 2; // mardi
  let daysUntilTarget = (targetWeekday - weekdayIndex + 7) % 7;
  if (daysUntilTarget === 0 && Number(values.hour) >= 9) daysUntilTarget = 7;

  const targetNoonUtc = new Date(
    Date.UTC(
      Number(values.year),
      Number(values.month) - 1,
      Number(values.day) + daysUntilTarget,
      12,
    ),
  );
  const targetParts = new Intl.DateTimeFormat("en-US", {
    timeZone: "Europe/Paris",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(targetNoonUtc);
  const target = Object.fromEntries(
    targetParts.map((part) => [part.type, part.value]),
  );

  return parisTimeToUtcDate(
    Number(target.year),
    Number(target.month),
    Number(target.day),
    9,
  );
}

function addParisDaysAtSameTime(date: Date, days: number) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "Europe/Paris",
    hourCycle: "h23",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).formatToParts(date);
  const values = Object.fromEntries(parts.map((part) => [part.type, part.value]));

  return parisTimeToUtcDate(
    Number(values.year),
    Number(values.month),
    Number(values.day) + days,
    Number(values.hour),
    Number(values.minute),
  );
}

function issueStatusLabel(status: string) {
  const labels: Record<string, string> = {
    draft: "Brouillon",
    validated: "Validée",
    synced: "Envoyée vers beehiiv",
    scheduled: "Programmée",
    sent: "Envoyée",
  };
  return labels[status] ?? status;
}

function toNewsletterIssue(row: NewsletterIssueRow): NewsletterIssue {
  return {
    id: row.id,
    sendDate: new Date(row.send_date),
    title: row.title,
    subject: row.subject,
    previewText: row.preview_text,
    html: row.html,
    status: row.status,
    beehiivPostId: row.beehiiv_post_id,
    segment: row.segment,
    scheduledAt: row.scheduled_at ? new Date(row.scheduled_at) : null,
    validatedAt: row.validated_at ? new Date(row.validated_at) : null,
    createdAt: new Date(row.created_at),
    updatedAt: new Date(row.updated_at),
  };
}

function benefitLine(company: NewsletterCompany) {
  const benefit = company.benefits[0];
  if (!benefit) return "Aucun avantage structuré pour le moment.";
  const value = benefit.value ? ` (${benefit.value})` : "";
  return `${benefit.title}${value}`;
}

function companyCard(company: NewsletterCompany) {
  const url = `${BASE_URL}/entreprises/${company.slug}`;
  const minShares = company.minShares
    ? `${company.minShares} action${company.minShares > 1 ? "s" : ""}`
    : "Seuil à vérifier";

  return `
    <tr>
      <td style="padding:18px 0;border-bottom:1px solid ${BORDER};">
        <p style="margin:0 0 6px 0;font:12px Arial,sans-serif;color:${BRAND_RED};text-transform:uppercase;letter-spacing:.08em;">${escapeHtml(company.sector)}</p>
        <h3 style="margin:0 0 8px 0;font:700 22px Arial,sans-serif;color:${INK};">${escapeHtml(company.name)}</h3>
        <p style="margin:0 0 10px 0;font:15px Arial,sans-serif;line-height:1.55;color:${MUTED};">${escapeHtml(company.description)}</p>
        <p style="margin:0 0 14px 0;font:14px Arial,sans-serif;line-height:1.5;color:${INK};"><strong>Accès:</strong> ${escapeHtml(minShares)} · <strong>À regarder:</strong> ${escapeHtml(benefitLine(company))}</p>
        <a href="${url}" style="display:inline-block;background:${INK};color:#ffffff;text-decoration:none;padding:11px 15px;border-radius:4px;font:700 12px Arial,sans-serif;text-transform:uppercase;letter-spacing:.08em;">Voir la fiche</a>
      </td>
    </tr>
  `;
}

export function renderNewsletterHtml(params: {
  title: string;
  previewText: string;
  sendDate: Date;
  featuredCompany: NewsletterCompany;
  updatedCompanies: NewsletterCompany[];
  topCompanies: NewsletterCompany[];
}) {
  const updatedRows = params.updatedCompanies.map(companyCard).join("");
  const topRows = params.topCompanies.map(companyCard).join("");

  return `<!doctype html>
<html lang="fr">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>${escapeHtml(params.title)}</title>
  </head>
  <body style="margin:0;padding:0;background:${SURFACE};color:${INK};">
    <div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;">${escapeHtml(params.previewText)}</div>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${SURFACE};border-collapse:collapse;">
      <tr>
        <td align="center" style="padding:28px 14px;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:680px;background:#ffffff;border-collapse:collapse;border:1px solid ${BORDER};">
            <tr>
              <td style="padding:28px 26px 20px 26px;border-bottom:1px solid ${BORDER};">
                <p style="margin:0 0 12px 0;font:700 12px Arial,sans-serif;color:${BRAND_RED};text-transform:uppercase;letter-spacing:.1em;">${escapeHtml(SITE_NAME)} · ${escapeHtml(formatFrenchDate(params.sendDate))}</p>
                <h1 style="margin:0;font:700 34px Arial,sans-serif;line-height:1.05;color:${INK};">${escapeHtml(params.title)}</h1>
                <p style="margin:14px 0 0 0;font:16px Arial,sans-serif;line-height:1.6;color:${MUTED};">${escapeHtml(params.previewText)}</p>
              </td>
            </tr>
            <tr>
              <td style="padding:24px 26px;background:#050505;color:#ffffff;">
                <p style="margin:0 0 8px 0;font:700 12px Arial,sans-serif;color:${BRAND_RED};text-transform:uppercase;letter-spacing:.1em;">Club actionnaire de la semaine</p>
                <h2 style="margin:0 0 10px 0;font:700 28px Arial,sans-serif;color:#ffffff;">${escapeHtml(params.featuredCompany.name)}</h2>
                <p style="margin:0 0 16px 0;font:15px Arial,sans-serif;line-height:1.6;color:#d8d8d8;">${escapeHtml(params.featuredCompany.description)}</p>
                <a href="${BASE_URL}/entreprises/${params.featuredCompany.slug}" style="display:inline-block;background:${BRAND_RED};color:#ffffff;text-decoration:none;padding:12px 16px;border-radius:4px;font:700 12px Arial,sans-serif;text-transform:uppercase;letter-spacing:.08em;">Découvrir</a>
              </td>
            </tr>
            <tr>
              <td style="padding:24px 26px;">
                <h2 style="margin:0 0 8px 0;font:700 24px Arial,sans-serif;color:${INK};">Fiches à vérifier cette semaine</h2>
                <p style="margin:0 0 4px 0;font:15px Arial,sans-serif;line-height:1.55;color:${MUTED};">Une sélection issue des fiches les plus récemment vérifiées ou enrichies.</p>
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">${updatedRows}</table>
              </td>
            </tr>
            <tr>
              <td style="padding:24px 26px;background:${SURFACE};">
                <h2 style="margin:0 0 8px 0;font:700 24px Arial,sans-serif;color:${INK};">Les clubs les plus riches en avantages</h2>
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">${topRows}</table>
              </td>
            </tr>
            <tr>
              <td style="padding:26px;text-align:center;">
                <h2 style="margin:0 0 10px 0;font:700 24px Arial,sans-serif;color:${INK};">Comparez vos avantages actionnaires</h2>
                <p style="margin:0 0 18px 0;font:15px Arial,sans-serif;line-height:1.55;color:${MUTED};">Retrouvez le catalogue complet, les conditions d’accès et les liens officiels.</p>
                <a href="${BASE_URL}/#catalogue" style="display:inline-block;background:${BRAND_RED};color:#ffffff;text-decoration:none;padding:13px 18px;border-radius:4px;font:700 12px Arial,sans-serif;text-transform:uppercase;letter-spacing:.08em;">Ouvrir le catalogue</a>
              </td>
            </tr>
          </table>
          <p style="margin:14px 0 0 0;font:12px Arial,sans-serif;color:${MUTED};">Données indicatives. Vérifiez toujours les conditions directement auprès des entreprises.</p>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

export async function buildNewsletterDraft(sendDate = nextWeeklySendDateParis()) {
  const companies = await prisma.company.findMany({
    include: {
      benefits: {
        take: 3,
      },
    },
    orderBy: [{ lastVerifiedAt: "desc" }, { updatedAt: "desc" }, { name: "asc" }],
    take: 12,
  });
  const withBenefits = companies
    .filter((company) => company.benefits.length > 0)
    .sort((a, b) => b.benefits.length - a.benefits.length);
  const featuredCompany = withBenefits[0] ?? companies[0];
  const updatedCompanies = companies
    .filter((company) => company.slug !== featuredCompany.slug)
    .slice(0, 3);
  const topCompanies = withBenefits
    .filter((company) => company.slug !== featuredCompany.slug)
    .slice(0, 3);
  const title = `La sélection actionnaire du ${formatFrenchDate(sendDate)}`;
  const subject = `${featuredCompany.name}, avantages actionnaires et fiches à surveiller`;
  const previewText = `Cette semaine: ${featuredCompany.name}, ${updatedCompanies
    .slice(0, 2)
    .map((company) => company.name)
    .join(", ")} et les clubs actionnaires à comparer.`;
  const html = renderNewsletterHtml({
    title,
    previewText,
    sendDate,
    featuredCompany,
    updatedCompanies,
    topCompanies,
  });

  return {
    sendDate,
    title,
    subject,
    previewText,
    html,
    text: stripHtml(html),
  };
}

export async function createOrUpdateNewsletterIssue(sendDate?: Date) {
  const draft = await buildNewsletterDraft(sendDate);
  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase
    .from(newsletterIssuesTableName())
    .upsert(
      {
        send_date: draft.sendDate.toISOString(),
        title: draft.title,
        subject: draft.subject,
        preview_text: draft.previewText,
        html: draft.html,
        status: "draft",
        segment: process.env.BEEHIIV_SEGMENT_ID || null,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "send_date" },
    )
    .select(NEWSLETTER_ISSUE_SELECT)
    .single<NewsletterIssueRow>();

  if (error) throw error;
  return toNewsletterIssue(data);
}

export async function createNextNewsletterIssue() {
  const issues = await listNewsletterIssues(200);
  const existingSendDates = new Set(
    issues.map((issue) => issue.sendDate.getTime()),
  );
  let sendDate = nextWeeklySendDateParis();

  while (existingSendDates.has(sendDate.getTime())) {
    sendDate = addParisDaysAtSameTime(sendDate, 7);
  }

  return createOrUpdateNewsletterIssue(sendDate);
}

export async function listNewsletterIssues(limit = 50) {
  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase
    .from(newsletterIssuesTableName())
    .select(NEWSLETTER_ISSUE_SELECT)
    .order("send_date", { ascending: false })
    .limit(limit)
    .returns<NewsletterIssueRow[]>();

  if (error) throw error;
  return data.map(toNewsletterIssue);
}

export async function getNewsletterIssue(id: number) {
  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase
    .from(newsletterIssuesTableName())
    .select(NEWSLETTER_ISSUE_SELECT)
    .eq("id", id)
    .single<NewsletterIssueRow>();

  if (error) throw error;
  return toNewsletterIssue(data);
}

export async function updateNewsletterIssue(
  id: number,
  input: NewsletterIssueUpdateInput,
) {
  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase
    .from(newsletterIssuesTableName())
    .update({
      send_date: input.sendDate.toISOString(),
      title: input.title,
      subject: input.subject,
      preview_text: input.previewText,
      html: input.html,
      segment: input.segment,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select(NEWSLETTER_ISSUE_SELECT)
    .single<NewsletterIssueRow>();

  if (error) throw error;
  return toNewsletterIssue(data);
}

export async function updateNewsletterIssueStatus(
  id: number,
  status: NewsletterIssueStatus,
) {
  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase
    .from(newsletterIssuesTableName())
    .update({
      status,
      validated_at: status === "validated" ? new Date().toISOString() : null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select(NEWSLETTER_ISSUE_SELECT)
    .single<NewsletterIssueRow>();

  if (error) throw error;
  return toNewsletterIssue(data);
}

export async function createBeehiivPost(issueId: number, options?: { confirm?: boolean }) {
  const apiKey = process.env.BEEHIIV_API_KEY;
  const publicationId = process.env.BEEHIIV_PUBLICATION_ID;
  if (!apiKey || !publicationId) {
    throw new Error("BEEHIIV_API_KEY et BEEHIIV_PUBLICATION_ID sont requis.");
  }

  const supabase = createSupabaseAdminClient();
  const { data: issueRow, error: issueError } = await supabase
    .from(newsletterIssuesTableName())
    .select(NEWSLETTER_ISSUE_SELECT)
    .eq("id", issueId)
    .single<NewsletterIssueRow>();

  if (issueError) throw issueError;

  const issue = toNewsletterIssue(issueRow);
  const apiBase = process.env.BEEHIIV_API_BASE_URL ?? "https://api.beehiiv.com/v2";
  const status = options?.confirm ? "confirmed" : "draft";
  const body: Record<string, unknown> = {
    title: issue.title,
      subtitle: issue.previewText,
      body_content: {
        type: "html",
        html: issue.html,
    },
    status,
    email_settings: {
      subject_line: issue.subject,
      preview_text: issue.previewText,
    },
  };

  if (options?.confirm) {
    body.scheduled_at = issue.sendDate.toISOString();
  }

  const response = await fetch(`${apiBase}/publications/${publicationId}/posts`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const details = await response.text();
    throw new Error(`beehiiv a refusé la création (${response.status}): ${details}`);
  }

  const payload = (await response.json()) as { data?: { id?: string }; id?: string };
  const beehiivPostId = payload.data?.id ?? payload.id ?? null;

  const { data: updatedIssue, error: updateError } = await supabase
    .from(newsletterIssuesTableName())
    .update({
      beehiiv_post_id: beehiivPostId,
      status: options?.confirm ? "scheduled" : "synced",
      scheduled_at: options?.confirm ? issue.sendDate.toISOString() : null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", issue.id)
    .select(NEWSLETTER_ISSUE_SELECT)
    .single<NewsletterIssueRow>();

  if (updateError) throw updateError;
  return toNewsletterIssue(updatedIssue);
}

export { issueStatusLabel };
