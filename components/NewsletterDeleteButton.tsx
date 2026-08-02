"use client";

type NewsletterDeleteButtonProps = {
  action: (formData: FormData) => void | Promise<void>;
  adminToken: string;
  issueId: number;
};

export default function NewsletterDeleteButton({
  action,
  adminToken,
  issueId,
}: NewsletterDeleteButtonProps) {
  return (
    <form
      action={action}
      onSubmit={(event) => {
        if (!window.confirm("Supprimer definitivement ce brouillon ? Cette action est irreversible.")) {
          event.preventDefault();
        }
      }}
    >
      <input type="hidden" name="adminToken" value={adminToken} />
      <input type="hidden" name="issueId" value={issueId} />
      <button className="min-h-10 border border-accent px-[var(--space-md)] font-[family-name:var(--font-data)] text-[11px] uppercase text-accent transition-colors hover:bg-accent hover:text-text-display">
        Supprimer
      </button>
    </form>
  );
}
