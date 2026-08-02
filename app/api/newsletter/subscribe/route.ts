import { NextResponse } from "next/server";
import { createBeehiivSubscription } from "@/lib/beehiiv-subscriptions";

export const runtime = "nodejs";

function isEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export async function POST(request: Request) {
  let body: { email?: unknown; placement?: unknown; website?: unknown };

  try {
    body = (await request.json()) as typeof body;
  } catch {
    return NextResponse.json({ error: "Requête invalide." }, { status: 400 });
  }

  // Honeypot discret pour limiter les soumissions automatiques.
  if (typeof body.website === "string" && body.website.trim()) {
    return new Response(null, { status: 204 });
  }

  const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  const placement = typeof body.placement === "string" ? body.placement : undefined;

  if (!isEmail(email)) {
    return NextResponse.json(
      { error: "Saisissez une adresse e-mail valide." },
      { status: 400 },
    );
  }

  try {
    const subscription = await createBeehiivSubscription({ email, placement });

    return NextResponse.json({
      ok: true,
      status: subscription.status,
      message: "Inscription enregistrée. Vérifiez votre boîte mail pour confirmer ou accueillir votre inscription.",
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Inscription impossible.";
    const [statusCode] = message.split(":", 1);
    const numericStatus = Number(statusCode);

    if (numericStatus === 409) {
      return NextResponse.json(
        { error: "Cette adresse est déjà inscrite à la newsletter." },
        { status: 409 },
      );
    }

    console.error("Beehiiv subscription failed", error);
    return NextResponse.json(
      { error: "L'inscription est momentanément indisponible. Réessayez dans quelques instants." },
      { status: 502 },
    );
  }
}
