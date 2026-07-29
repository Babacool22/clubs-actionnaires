"use client";

import { useState } from "react";

type AssistantResult = {
  runId: number;
  model: string;
  title: string;
  subject: string;
  previewText: string;
  html: string;
  summary: string;
  coveredTopics: string[];
  futureTopics: string[];
  usage: {
    inputTokens: number;
    cachedInputTokens: number;
    outputTokens: number;
    estimatedCostUsd: number;
  };
  memory: {
    previousIssues: number;
    savedIdeas: number;
  };
};

type NewsletterGrokAssistantProps = {
  issueId: number;
  adminToken: string;
  targetIds: {
    title: string;
    subject: string;
    previewText: string;
    html: string;
  };
};

function fieldValue(id: string) {
  const field = document.getElementById(id);
  if (field instanceof HTMLInputElement || field instanceof HTMLTextAreaElement) {
    return field.value;
  }
  return "";
}

function setFieldValue(id: string, value: string) {
  const field = document.getElementById(id);
  if (!(field instanceof HTMLInputElement || field instanceof HTMLTextAreaElement)) {
    return;
  }
  field.value = value;
  field.dispatchEvent(new Event("input", { bubbles: true }));
  field.dispatchEvent(new Event("change", { bubbles: true }));
}

export default function NewsletterGrokAssistant({
  issueId,
  adminToken,
  targetIds,
}: NewsletterGrokAssistantProps) {
  const [mode, setMode] = useState<"draft" | "improve">("draft");
  const [instruction, setInstruction] = useState("");
  const [result, setResult] = useState<AssistantResult | null>(null);
  const [status, setStatus] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function generate() {
    setIsLoading(true);
    setStatus("Grok prepare l'edition...");

    try {
      const response = await fetch("/api/admin/newsletter/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          adminToken,
          issueId,
          mode,
          instruction,
          currentDraft: {
            title: fieldValue(targetIds.title),
            subject: fieldValue(targetIds.subject),
            previewText: fieldValue(targetIds.previewText),
            html: fieldValue(targetIds.html),
          },
        }),
      });
      const payload = (await response.json().catch(() => ({}))) as {
        error?: string;
        result?: AssistantResult;
      };

      if (!response.ok || !payload.result) {
        setStatus(payload.error || "Generation impossible.");
        return;
      }

      setResult(payload.result);
      setStatus("Edition prete a relire.");
    } catch {
      setStatus("Connexion a Grok impossible.");
    } finally {
      setIsLoading(false);
    }
  }

  function applyResult() {
    if (!result) return;
    setFieldValue(targetIds.title, result.title);
    setFieldValue(targetIds.subject, result.subject);
    setFieldValue(targetIds.previewText, result.previewText);
    setFieldValue(targetIds.html, result.html);
    setStatus("Contenu applique au brouillon. Enregistrez pour le conserver.");
  }

  return (
    <section className="border border-border bg-black">
      <div className="flex flex-col gap-[var(--space-sm)] border-b border-border bg-surface p-[var(--space-md)] sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="mb-[var(--space-xs)] font-[family-name:var(--font-data)] text-[10px] uppercase text-accent">
            Agent editorial
          </p>
          <h2 className="text-[20px] font-medium text-text-display">
            Grok 4.5
          </h2>
        </div>
        <div className="inline-grid grid-cols-2 border border-border-visible">
          <button
            type="button"
            onClick={() => setMode("draft")}
            className={`min-h-10 px-[var(--space-md)] font-[family-name:var(--font-data)] text-[11px] uppercase ${
              mode === "draft"
                ? "bg-text-display text-black"
                : "text-text-secondary hover:text-text-display"
            }`}
          >
            Rediger
          </button>
          <button
            type="button"
            onClick={() => setMode("improve")}
            className={`min-h-10 px-[var(--space-md)] font-[family-name:var(--font-data)] text-[11px] uppercase ${
              mode === "improve"
                ? "bg-text-display text-black"
                : "text-text-secondary hover:text-text-display"
            }`}
          >
            Ameliorer
          </button>
        </div>
      </div>

      <div className="grid gap-[var(--space-md)] p-[var(--space-md)]">
        <div className="grid gap-[var(--space-sm)]">
          <label
            htmlFor={`newsletter-grok-instruction-${issueId}`}
            className="font-[family-name:var(--font-data)] text-[11px] uppercase text-text-disabled"
          >
            Brief editorial et sources
          </label>
          <textarea
            id={`newsletter-grok-instruction-${issueId}`}
            value={instruction}
            onChange={(event) => setInstruction(event.target.value)}
            placeholder="Exemple : une edition sur les avantages actionnaires de LVMH, AXA et Orange. Inclure les liens officiels a utiliser et les points a verifier."
            className="min-h-36 resize-y border border-border-visible bg-black p-[var(--space-md)] text-[14px] leading-[1.6] text-text-display outline-none placeholder:text-text-disabled focus:border-text-secondary"
          />
          <div className="flex flex-wrap items-center gap-[var(--space-sm)]">
            <button
              type="button"
              onClick={generate}
              disabled={isLoading || instruction.trim().length < 10}
              className={`min-h-11 px-[var(--space-lg)] font-[family-name:var(--font-data)] text-[11px] uppercase text-white ${
                isLoading || instruction.trim().length < 10
                  ? "cursor-not-allowed bg-text-disabled"
                  : "bg-accent hover:opacity-90"
              }`}
            >
              {isLoading ? "Generation..." : "Lancer Grok"}
            </button>
            {status ? (
              <p aria-live="polite" className="text-[12px] text-text-secondary">
                {status}
              </p>
            ) : null}
          </div>
        </div>

        <div className="border border-border-visible bg-surface p-[var(--space-md)]">
          {result ? (
            <div className="grid gap-[var(--space-sm)]">
              <p className="font-[family-name:var(--font-data)] text-[10px] uppercase text-success">
                Generation #{result.runId}
              </p>
              <p className="text-[13px] leading-[1.55] text-text-secondary">
                {result.summary}
              </p>
              <dl className="grid gap-[var(--space-xs)] border-t border-border pt-[var(--space-sm)] font-[family-name:var(--font-data)] text-[10px] uppercase text-text-disabled">
                <div className="flex justify-between gap-3">
                  <dt>Memoire</dt>
                  <dd>{result.memory.previousIssues} editions</dd>
                </div>
                <div className="flex justify-between gap-3">
                  <dt>Idees gardees</dt>
                  <dd>{result.memory.savedIdeas}</dd>
                </div>
                <div className="flex justify-between gap-3">
                  <dt>Tokens</dt>
                  <dd>
                    {result.usage.inputTokens + result.usage.outputTokens}
                  </dd>
                </div>
                <div className="flex justify-between gap-3">
                  <dt>Cout estime</dt>
                  <dd>${result.usage.estimatedCostUsd.toFixed(4)}</dd>
                </div>
              </dl>
              <button
                type="button"
                onClick={applyResult}
                className="min-h-10 border border-success px-[var(--space-md)] font-[family-name:var(--font-data)] text-[10px] uppercase text-success hover:bg-success hover:text-white"
              >
                Appliquer au brouillon
              </button>
            </div>
          ) : (
            <p className="text-[12px] leading-[1.6] text-text-disabled">
              La memoire compare les editions precedentes et conserve les
              prochaines pistes editoriales.
            </p>
          )}
        </div>
      </div>

      {result ? (
        <div className="grid gap-[var(--space-md)] border-t border-border p-[var(--space-md)]">
          <div>
            <p className="mb-[var(--space-xs)] font-[family-name:var(--font-data)] text-[10px] uppercase text-text-disabled">
              Sujets couverts
            </p>
            <p className="text-[12px] leading-[1.6] text-text-secondary">
              {result.coveredTopics.join(" | ")}
            </p>
          </div>
          <div>
            <p className="mb-[var(--space-xs)] font-[family-name:var(--font-data)] text-[10px] uppercase text-text-disabled">
              Pistes pour les prochaines editions
            </p>
            <p className="text-[12px] leading-[1.6] text-text-secondary">
              {result.futureTopics.join(" | ")}
            </p>
          </div>
        </div>
      ) : null}
    </section>
  );
}
