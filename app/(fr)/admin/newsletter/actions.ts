"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  createNextNewsletterIssue,
  parisTimeToUtcDate,
  updateNewsletterIssue,
  updateNewsletterIssueStatus,
  type NewsletterIssueStatus,
} from "@/lib/newsletter";

function configuredAdminToken() {
  return process.env.NEWSLETTER_ADMIN_TOKEN?.trim() ?? "";
}

function assertAdminToken(formData: FormData) {
  const configured = configuredAdminToken();
  const provided = String(formData.get("adminToken") ?? "");

  if (configured && provided !== configured) {
    throw new Error("Token admin invalide.");
  }

  return provided;
}

function parseIssueId(formData: FormData) {
  const id = Number(formData.get("issueId"));
  if (!Number.isInteger(id) || id <= 0) {
    throw new Error("Identifiant newsletter invalide.");
  }
  return id;
}

function parseParisDateTime(value: FormDataEntryValue | null) {
  const raw = String(value ?? "");
  const match = raw.match(/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})$/);
  if (!match) {
    throw new Error("Date d'envoi invalide.");
  }

  return parisTimeToUtcDate(
    Number(match[1]),
    Number(match[2]),
    Number(match[3]),
    Number(match[4]),
    Number(match[5]),
  );
}

function adminNewsletterUrl(token: string, issueId?: number) {
  const params = new URLSearchParams();
  if (token) params.set("token", token);
  if (issueId) params.set("issue", String(issueId));
  const query = params.toString();
  return `/admin/newsletter${query ? `?${query}` : ""}`;
}

export async function generateNewsletterDraftAction(formData: FormData) {
  const token = assertAdminToken(formData);
  const issue = await createNextNewsletterIssue();

  revalidatePath("/admin/newsletter");
  redirect(adminNewsletterUrl(token, issue.id));
}

export async function updateNewsletterIssueAction(formData: FormData) {
  const token = assertAdminToken(formData);
  const issueId = parseIssueId(formData);
  const sendDate = parseParisDateTime(formData.get("sendDate"));
  const title = String(formData.get("title") ?? "").trim();
  const subject = String(formData.get("subject") ?? "").trim();
  const previewText = String(formData.get("previewText") ?? "").trim();
  const html = String(formData.get("html") ?? "").trim();
  const segment = String(formData.get("segment") ?? "").trim() || null;

  if (!title || !subject || !previewText || !html) {
    throw new Error("Titre, sujet, preview text et HTML sont requis.");
  }

  await updateNewsletterIssue(issueId, {
    sendDate,
    title,
    subject,
    previewText,
    html,
    segment,
  });

  revalidatePath("/admin/newsletter");
  redirect(adminNewsletterUrl(token, issueId));
}

export async function updateNewsletterStatusAction(formData: FormData) {
  const token = assertAdminToken(formData);
  const issueId = parseIssueId(formData);
  const status = String(formData.get("status") ?? "") as NewsletterIssueStatus;
  const allowed: NewsletterIssueStatus[] = [
    "draft",
    "validated",
    "archived",
  ];

  if (!allowed.includes(status)) {
    throw new Error("Statut newsletter invalide.");
  }

  await updateNewsletterIssueStatus(issueId, status);

  revalidatePath("/admin/newsletter");
  redirect(adminNewsletterUrl(token, issueId));
}
