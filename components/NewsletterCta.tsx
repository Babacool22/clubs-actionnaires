"use client";

import { track } from "@vercel/analytics";
import { useId, useState } from "react";
import type { FormEvent } from "react";

type NewsletterCtaVariant = "full" | "compact" | "footer";

type NewsletterCtaProps = {
  variant?: NewsletterCtaVariant;
  placement?: string;
  locale?: "fr" | "en";
};

const copy = {
  fr: {
    eyebrow: "NEWSLETTER",
    title: "Le Club Actionnaire",
    description:
      "Chaque semaine, une analyse d'action reliee a son club actionnaire, avec des reperes concrets pour mieux comprendre l'entreprise, ses avantages et la vie d'actionnaire.",
    footnote:
      "AG, inscription aux clubs, fiscalite simple et reflexes patrimoniaux : l'essentiel pour devenir un actionnaire plus actif.",
    emailLabel: "Adresse email",
    placeholder: "vous@email.com",
    join: "Rejoindre",
    loading: "Inscription en cours...",
    success: "Inscription enregistree.",
    failure: "Inscription impossible. Reessayez.",
    connectionFailure: "Connexion impossible. Reessayez dans quelques instants.",
  },
  en: {
    eyebrow: "NEWSLETTER IN FRENCH",
    title: "Le Club Actionnaire (FR)",
    description:
      "A weekly company analysis linked to its shareholder programme. The newsletter is currently written and delivered in French.",
    footnote:
      "Shareholder meetings, club enrolment, practical tax basics and long-term ownership habits, every Sunday at 9:00 Paris time.",
    emailLabel: "Email address",
    placeholder: "you@email.com",
    join: "Subscribe",
    loading: "Subscribing...",
    success: "Subscription confirmed.",
    failure: "Subscription failed. Please try again.",
    connectionFailure: "Connection failed. Please try again in a moment.",
  },
};

export default function NewsletterCta({
  variant = "full",
  placement = "global_before_footer",
  locale = "fr",
}: NewsletterCtaProps) {
  const emailInputId = useId();
  const [status, setStatus] = useState("");
  const isCompact = variant === "compact";
  const isFooter = variant === "footer";
  const content = copy[locale];

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email") ?? "");

    track("Newsletter CTA Submit", {
      placement,
      hasEmail: email.trim().length > 0,
      configured: true,
    });

    setStatus(content.loading);

    try {
      const response = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          placement,
          website: String(formData.get("website") ?? ""),
        }),
      });
      const result = (await response.json().catch(() => ({}))) as {
        message?: string;
        error?: string;
      };

      if (!response.ok) {
        setStatus(locale === "fr" ? result.error ?? content.failure : content.failure);
        return;
      }

      setStatus(locale === "fr" ? result.message ?? content.success : content.success);
      event.currentTarget.reset();
    } catch {
      setStatus(content.connectionFailure);
    }
  }

  const hiddenField = (
    <input
      name="website"
      tabIndex={-1}
      autoComplete="off"
      aria-hidden="true"
      className="absolute -left-[9999px] h-px w-px opacity-0"
    />
  );

  if (isFooter) {
    return (
      <div className="max-w-xs border border-border-visible bg-black p-[var(--space-md)]">
        <p className="mb-[var(--space-sm)] font-[family-name:var(--font-data)] text-[11px] uppercase text-accent">
          {content.eyebrow}
        </p>
        <h2 className="mb-[var(--space-sm)] break-words text-[18px] font-medium leading-[1.2] text-text-display">
          {content.title}
        </h2>
        <p className="mb-[var(--space-md)] text-[12px] leading-[1.5] text-text-secondary">
          {content.description}
        </p>
        <form className="grid gap-[var(--space-xs)]" onSubmit={handleSubmit}>
          <label htmlFor={emailInputId} className="sr-only">
            {content.emailLabel}
          </label>
          {hiddenField}
          <div className="grid grid-cols-[minmax(0,1fr)_auto] border border-border-visible">
            <input
              id={emailInputId}
              name="email"
              type="email"
              required
              inputMode="email"
              autoComplete="email"
              placeholder="email"
              className="min-h-10 min-w-0 border-l-2 border-accent bg-black px-[var(--space-sm)] font-[family-name:var(--font-body)] text-[13px] text-text-display outline-none placeholder:text-text-disabled focus:bg-surface-raised"
            />
            <button
              type="submit"
              className="min-h-10 bg-accent px-[var(--space-sm)] font-[family-name:var(--font-data)] text-[10px] uppercase text-text-display transition-opacity duration-[var(--duration-micro)] hover:opacity-90 focus:opacity-90"
            >
              OK
            </button>
          </div>
          {status && (
            <p aria-live="polite" className="text-[11px] text-text-disabled">
              {status}
            </p>
          )}
        </form>
      </div>
    );
  }

  return (
    <section
      id={isCompact ? undefined : "newsletter"}
      className={
        isCompact
          ? "border-y border-border bg-black"
          : "border-t border-border bg-surface"
      }
    >
      <div
        className={`mx-auto grid max-w-7xl grid-cols-1 gap-[var(--space-lg)] px-[var(--space-md)] sm:px-[var(--space-lg)] lg:grid-cols-[minmax(0,1fr)_minmax(20rem,28rem)] lg:px-[var(--space-xl)] ${
          isCompact ? "py-[var(--space-lg)]" : "py-[var(--space-2xl)]"
        }`}
      >
        <div className="min-w-0">
          <p className="mb-[var(--space-sm)] font-[family-name:var(--font-data)] text-[11px] uppercase text-accent">
            {content.eyebrow}
          </p>
          <h2
            className={`mb-[var(--space-sm)] break-words font-[family-name:var(--font-display)] font-bold leading-none text-text-display ${
              isCompact
                ? "text-[24px] sm:text-[30px]"
                : "text-[34px] sm:text-[44px]"
            }`}
          >
            {content.title}
          </h2>
          <p
            className={`max-w-2xl break-words leading-[1.6] text-text-secondary ${
              isCompact
                ? "text-[14px] sm:text-[15px]"
                : "text-[15px] sm:text-[17px]"
            }`}
          >
            {content.description}
          </p>
        </div>

        <form
          className="grid min-w-0 content-start gap-[var(--space-sm)]"
          onSubmit={handleSubmit}
        >
          <label
            htmlFor={emailInputId}
            className="font-[family-name:var(--font-data)] text-[11px] uppercase text-text-disabled"
          >
            {content.emailLabel}
          </label>
          {hiddenField}
          <div className="grid grid-cols-1 gap-px bg-border sm:grid-cols-[minmax(0,1fr)_auto]">
            <input
              id={emailInputId}
              name="email"
              type="email"
              required
              inputMode="email"
              autoComplete="email"
              placeholder={content.placeholder}
              className="min-h-12 min-w-0 border-l-2 border-accent bg-black px-[var(--space-md)] font-[family-name:var(--font-body)] text-[15px] text-text-display outline-none placeholder:text-text-disabled focus:bg-surface-raised"
            />
            <button
              type="submit"
              className="min-h-12 bg-accent px-[var(--space-lg)] font-[family-name:var(--font-data)] text-[11px] uppercase text-text-display transition-opacity duration-[var(--duration-micro)] hover:opacity-90 focus:opacity-90"
            >
              {content.join}
            </button>
          </div>
          <p className="text-[12px] leading-[1.5] text-text-disabled">
            {content.footnote}
          </p>
          {status && (
            <p aria-live="polite" className="text-[12px] text-text-disabled">
              {status}
            </p>
          )}
        </form>
      </div>
    </section>
  );
}
