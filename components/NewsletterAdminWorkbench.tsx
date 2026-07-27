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

  return (
    <div className="min-w-0 border border-border bg-black">
      <div className="flex flex-col gap-[var(--space-sm)] border-b border-border p-[var(--space-md)] sm:flex-row sm:items-center sm:justify-between">
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

        <div className="flex items-center gap-[var(--space-sm)]">
          {copyStatus && (
            <span className="font-[family-name:var(--font-data)] text-[11px] uppercase text-text-disabled">
              {copyStatus}
            </span>
          )}
          <button
            type="button"
            onClick={copyHtml}
            className="min-h-10 border border-border-visible px-[var(--space-md)] font-[family-name:var(--font-data)] text-[11px] uppercase text-text-display transition-colors hover:bg-surface-raised"
          >
            {copyLabel}
          </button>
        </div>
      </div>

      {mode === "preview" ? (
        <iframe
          title="Apercu newsletter beehiiv"
          srcDoc={currentHtml}
          sandbox=""
          className="h-[42rem] w-full bg-white"
        />
      ) : (
        <pre className="max-h-[42rem] overflow-auto whitespace-pre-wrap break-words p-[var(--space-md)] font-[family-name:var(--font-data)] text-[12px] leading-[1.6] text-text-secondary">
          {currentHtml}
        </pre>
      )}
    </div>
  );
}
