"use client";

import { useState } from "react";

type NewsletterTemplateButtonProps = {
  templateHtml: string;
  targetTextareaId: string;
};

export default function NewsletterTemplateButton({
  templateHtml,
  targetTextareaId,
}: NewsletterTemplateButtonProps) {
  const [status, setStatus] = useState("");

  function insertTemplate() {
    const textarea = document.getElementById(targetTextareaId);
    if (!(textarea instanceof HTMLTextAreaElement)) {
      setStatus("Zone HTML introuvable.");
      return;
    }

    if (
      textarea.value.trim() &&
      !window.confirm(
        "Remplacer le contenu HTML actuel par le modele Clubs Actionnaires ? Cette action ne peut pas etre annulee sans recharger la page.",
      )
    ) {
      return;
    }

    textarea.value = templateHtml;
    textarea.dispatchEvent(new Event("input", { bubbles: true }));
    textarea.focus();
    setStatus("Modele insere. Remplace les textes entre [[...]] puis enregistre.");
  }

  return (
    <div className="flex flex-wrap items-center gap-[var(--space-sm)]">
      <button
        type="button"
        onClick={insertTemplate}
        className="min-h-10 border border-border-visible px-[var(--space-md)] font-[family-name:var(--font-data)] text-[11px] uppercase text-text-display transition-colors hover:bg-surface-raised"
      >
        Inserer le modele 4 articles
      </button>
      {status ? <p className="text-[12px] text-text-disabled">{status}</p> : null}
    </div>
  );
}
