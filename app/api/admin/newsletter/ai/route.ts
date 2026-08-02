import { NextResponse } from "next/server";
import {
  generateNewsletterWithGrok,
  type NewsletterAiMode,
} from "@/lib/newsletter-ai";

export const runtime = "nodejs";
export const maxDuration = 60;

type RequestBody = {
  adminToken?: unknown;
  issueId?: unknown;
  mode?: unknown;
  instruction?: unknown;
  currentDraft?: {
    title?: unknown;
    subject?: unknown;
    previewText?: unknown;
    html?: unknown;
  };
};

function hasAdminAccess(provided: string) {
  const configured = process.env.NEWSLETTER_ADMIN_TOKEN?.trim() ?? "";
  if (!configured) return process.env.NODE_ENV !== "production";
  return provided === configured;
}

function limitedString(value: unknown, maxLength: number) {
  return typeof value === "string" ? value.slice(0, maxLength) : "";
}

export async function POST(request: Request) {
  const origin = request.headers.get("origin");
  if (origin && new URL(origin).host !== new URL(request.url).host) {
    return NextResponse.json({ error: "Origine non autorisee." }, { status: 403 });
  }

  let body: RequestBody;
  try {
    body = (await request.json()) as RequestBody;
  } catch {
    return NextResponse.json({ error: "Requete invalide." }, { status: 400 });
  }

  const adminToken = limitedString(body.adminToken, 512);
  if (!hasAdminAccess(adminToken)) {
    return NextResponse.json({ error: "Acces refuse." }, { status: 403 });
  }

  const issueId = Number(body.issueId);
  if (!Number.isInteger(issueId) || issueId <= 0) {
    return NextResponse.json(
      { error: "Identifiant newsletter invalide." },
      { status: 400 },
    );
  }

  const mode: NewsletterAiMode = body.mode === "improve" ? "improve" : "draft";
  const instruction = limitedString(body.instruction, 6_000).trim();
  if (instruction.length < 10) {
    return NextResponse.json(
      { error: "Donnez a Grok une consigne d'au moins 10 caracteres." },
      { status: 400 },
    );
  }

  try {
    const result = await generateNewsletterWithGrok({
      issueId,
      mode,
      instruction,
      currentDraft: {
        title: limitedString(body.currentDraft?.title, 300),
        subject: limitedString(body.currentDraft?.subject, 300),
        previewText: limitedString(body.currentDraft?.previewText, 500),
        html: limitedString(body.currentDraft?.html, 80_000),
      },
    });

    return NextResponse.json({ ok: true, result });
  } catch (error) {
    console.error("Newsletter Grok generation failed", error);
    const message =
      error instanceof Error && error.message.includes("XAI_API_KEY")
        ? "La cle xAI n'est pas configuree sur le serveur."
        : "Grok n'a pas pu produire cette edition. Reessayez dans quelques instants.";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
