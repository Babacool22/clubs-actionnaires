"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  createBeehiivPost,
  createNextNewsletterIssue,
  deleteNewsletterIssue,
  parisTimeToUtcDate,
  scheduleBeehiivPost,
  updateNewsletterIssue,
  updateNewsletterIssueStatus,
  type NewsletterIssueUpdateInput,
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

function adminNewsletterUrlWithFeedback(
  token: string,
  issueId: number,
  feedback: Record<string, string>,
) {
  const params = new URLSearchParams();
  if (token) params.set("token", token);
  if (issueId > 0) params.set("issue", String(issueId));
  for (const [key, value] of Object.entries(feedback)) {
    params.set(key, value);
  }
  return `/admin/newsletter?${params.toString()}`;
}

function parseIssueUpdateInput(formData: FormData): NewsletterIssueUpdateInput {
  const sendDate = parseParisDateTime(formData.get("sendDate"));
  const title = String(formData.get("title") ?? "").trim();
  const subject = String(formData.get("subject") ?? "").trim();
  const previewText = String(formData.get("previewText") ?? "").trim();
  const html = String(formData.get("html") ?? "").trim();
  const segment = String(formData.get("segment") ?? "").trim() || null;

  if (!title || !subject || !previewText || !html) {
    throw new Error("Titre, sujet, preview text et HTML sont requis.");
  }

  return {
    sendDate,
    title,
    subject,
    previewText,
    html,
    segment,
  };
}

function compactFeedbackMessage(message: string) {
  return message.length > 600 ? `${message.slice(0, 597)}...` : message;
}

function beehiivActionError(error: unknown, fallback: string) {
  const message = error instanceof Error ? error.message : fallback;
  if (message.includes("SEND_API_NOT_ENTERPRISE_PLAN")) {
    return "Le plan beehiiv actuel ne permet pas l'envoi automatique par API. Utilisez l'import HTML manuel du cockpit, puis programmez l'edition dans beehiiv.";
  }
  return compactFeedbackMessage(message);
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
  const input = parseIssueUpdateInput(formData);

  await updateNewsletterIssue(issueId, input);

  revalidatePath("/admin/newsletter");
  redirect(adminNewsletterUrl(token, issueId));
}

export async function sendNewsletterToBeehiivAction(formData: FormData) {
  const token = assertAdminToken(formData);
  const issueId = parseIssueId(formData);
  const input = parseIssueUpdateInput(formData);

  await updateNewsletterIssue(issueId, input);

  try {
    await createBeehiivPost(issueId, { confirm: false });
  } catch (error) {
    const message = beehiivActionError(
      error,
      "beehiiv a refuse la creation du brouillon.",
    );

    revalidatePath("/admin/newsletter");
    redirect(
      adminNewsletterUrlWithFeedback(token, issueId, {
        beehiivError: message,
      }),
    );
  }

  revalidatePath("/admin/newsletter");
  redirect(
    adminNewsletterUrlWithFeedback(token, issueId, {
      beehiivSuccess: "Brouillon cree dans beehiiv.",
    }),
  );
}

export async function scheduleNewsletterInBeehiivAction(formData: FormData) {
  const token = assertAdminToken(formData);
  const issueId = parseIssueId(formData);
  const input = parseIssueUpdateInput(formData);

  await updateNewsletterIssue(issueId, input);

  try {
    await scheduleBeehiivPost(issueId);
  } catch (error) {
    const message = beehiivActionError(
      error,
      "beehiiv a refuse la programmation.",
    );

    revalidatePath("/admin/newsletter");
    redirect(
      adminNewsletterUrlWithFeedback(token, issueId, {
        beehiivError: message,
      }),
    );
  }

  revalidatePath("/admin/newsletter");
  redirect(
    adminNewsletterUrlWithFeedback(token, issueId, {
      beehiivSuccess: "Envoi programme dans beehiiv.",
    }),
  );
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

export async function deleteNewsletterIssueAction(formData: FormData) {
  const token = assertAdminToken(formData);
  const issueId = parseIssueId(formData);

  await deleteNewsletterIssue(issueId);

  revalidatePath("/admin/newsletter");
  redirect(
    adminNewsletterUrlWithFeedback(token, 0, {
      deleted: "Le brouillon a ete supprime definitivement.",
    }),
  );
}
