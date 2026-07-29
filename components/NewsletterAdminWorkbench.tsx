"use client";

import { useEffect, useState } from "react";

type NewsletterAdminWorkbenchProps = {
  html: string;
  copyLabel?: string;
  sourceTextareaId?: string;
};

export default function NewsletterAdminWorkbench({
  html,
  copyLabel = "Copier le HTML",
  sourceTextareaId,
}: NewsletterAdminWorkbenchProps) {
  const [mode, setMode] = useState<"preview" | "code">("preview");
  const [viewport, setViewport] = useState<"desktop" | "mobile">("desktop");
  const [copyStatus, setCopyStatus] = useState("");
  const [currentHtml, setCurrentHtml] = useState(html);

  useEffect(() => {
    setCurrentHtml(html);
  }, [html]);

  useEffect(() => {
    if (!sourceTextareaId) return;
    const textarea = document.getElementById(sourceTextareaId);
    if (!(textarea instanceof HTMLTextAreaElement)) return;

    const syncHtml = () => setCurrentHtml(textarea.value);
    syncHtml();
    textarea.addEventListener("input", syncHtml);

    return () => textarea.removeEventListener("input", syncHtml);
  }, [sourceTextareaId]);

  async function copyHtml() {
    try {
      await navigator.clipboard.writeText(currentHtml);
      setCopyStatus("HTML copie.");
      window.setTimeout(() => setCopyStatus(""), 1800);
    } catch {
      setCopyStatus("Copie impossible.");
    }
  }

  function downloadHtml() {
    const blob = new Blob([currentHtml], { type: "text/html;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "clubs-actionnaires-newsletter.html";
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    URL.revokeObjectURL(url);
    setCopyStatus("Fichier HTML telecharge.");
    window.setTimeout(() => setCopyStatus(""), 1800);
  }

  return (
    <div className="min-w-0 border border-border bg-black">
      <div className="flex justify-end border-b border-border bg-surface p-[var(--space-md)]">
        <a
          href="https://app.beehiiv.com/"
          target="_blank"
          rel="noreferrer"
          className="shrink-0 font-[family-name:var(--font-data)] text-[11px] uppercase text-accent hover:underline"
        >
          Ouvrir beehiiv
        </a>
      </div>
      <div className="flex flex-col gap-[var(--space-sm)] border-b border-border p-[var(--space-md)] sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-[var(--space-sm)]">
          <div className="inline-grid grid-cols-2 border border-border-visible bg-surface">
            <button
              type="button"
              onClick={() => setMode("preview")}
              className={`min-h-10 px-[var(--space-md)] font-[family-name:var(--font-data)] text-[11px] uppercase transition-colors ${
                mode === "preview"
                  ? "bg-text-display text-black"
                  : "text-text-secondary hover:text-text-display"
              }`}
            >
              Apercu
            </button>
            <button
              type="button"
              onClick={() => setMode("code")}
              className={`min-h-10 px-[var(--space-md)] font-[family-name:var(--font-data)] text-[11px] uppercase transition-colors ${
                mode === "code"
                  ? "bg-text-display text-black"
                  : "text-text-secondary hover:text-text-display"
              }`}
            >
              HTML
            </button>
          </div>
          {mode === "preview" ? (
            <div className="inline-grid grid-cols-2 border border-border-visible bg-surface">
              <button
                type="button"
                onClick={() => setViewport("desktop")}
                className={`min-h-10 px-[var(--space-md)] font-[family-name:var(--font-data)] text-[11px] uppercase transition-colors ${
                  viewport === "desktop"
                    ? "bg-text-display text-black"
                    : "text-text-secondary hover:text-text-display"
                }`}
              >
                Ordinateur
              </button>
              <button
                type="button"
                onClick={() => setViewport("mobile")}
                className={`min-h-10 px-[var(--space-md)] font-[family-name:var(--font-data)] text-[11px] uppercase transition-colors ${
                  viewport === "mobile"
                    ? "bg-text-display text-black"
                    : "text-text-secondary hover:text-text-display"
                }`}
              >
                Mobile
              </button>
            </div>
          ) : null}
        </div>

        <div className="flex items-center gap-[var(--space-sm)]">
          {copyStatus && (
            <span className="font-[family-name:var(--font-data)] text-[11px] uppercase text-text-disabled">
              {copyStatus}
            </span>
          )}
          <div className="flex flex-wrap gap-[var(--space-xs)]">
            <button
              type="button"
              onClick={copyHtml}
              className="min-h-10 border border-border-visible px-[var(--space-md)] font-[family-name:var(--font-data)] text-[11px] uppercase text-text-display transition-colors hover:bg-surface-raised"
            >
              {copyLabel}
            </button>
            <button
              type="button"
              onClick={downloadHtml}
              className="min-h-10 border border-border-visible px-[var(--space-md)] font-[family-name:var(--font-data)] text-[11px] uppercase text-text-display transition-colors hover:bg-surface-raised"
            >
              Telecharger HTML
            </button>
          </div>
        </div>
      </div>

      {mode === "preview" ? (
        <div className="overflow-auto bg-surface-raised p-[var(--space-md)]">
          <div
            className={`mx-auto overflow-hidden border border-border-visible bg-white shadow-2xl transition-[width] ${
              viewport === "mobile" ? "w-[375px] max-w-full" : "w-full"
            }`}
          >
            <iframe
              title={`Apercu newsletter beehiiv ${viewport}`}
              srcDoc={currentHtml}
              sandbox=""
              className="h-[42rem] w-full bg-white"
            />
          </div>
          <p className="mx-auto mt-[var(--space-sm)] max-w-[680px] text-center font-[family-name:var(--font-data)] text-[10px] uppercase text-text-disabled">
            {viewport === "mobile"
              ? "Apercu a 375 px de large"
              : "Apercu sur ordinateur"}
          </p>
        </div>
      ) : (
        <pre className="max-h-[42rem] overflow-auto whitespace-pre-wrap break-words p-[var(--space-md)] font-[family-name:var(--font-data)] text-[12px] leading-[1.6] text-text-secondary">
          {currentHtml}
        </pre>
      )}
    </div>
  );
}
