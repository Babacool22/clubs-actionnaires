import type { Metadata } from "next";
import Link from "next/link";
import NewsletterDeleteButton from "@/components/NewsletterDeleteButton";
import NewsletterAdminWorkbench from "@/components/NewsletterAdminWorkbench";
import NewsletterGrokAssistant from "@/components/NewsletterGrokAssistant";
import NewsletterTemplateButton from "@/components/NewsletterTemplateButton";
import {
  getNewsletterIssue,
  issueStatusLabel,
  listNewsletterIssues,
  type NewsletterIssue,
} from "@/lib/newsletter";
import { CLUBS_ACTIONNAIRES_WEEKLY_TEMPLATE } from "@/lib/newsletter-template";
import {
  generateNewsletterDraftAction,
  deleteNewsletterIssueAction,
  sendNewsletterToBeehiivAction,
  scheduleNewsletterInBeehiivAction,
  updateNewsletterIssueAction,
  updateNewsletterStatusAction,
} from "./actions";

export const metadata: Metadata = {
  title: "Admin newsletter - Clubs Actionnaires",
  robots: {
    index: false,
    follow: false,
  },
};

export const dynamic = "force-dynamic";

type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

function firstParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function configuredAdminToken() {
  return process.env.NEWSLETTER_ADMIN_TOKEN?.trim() ?? "";
}

function hasAdminAccess(token: string | undefined) {
  const configured = configuredAdminToken();
  if (!configured) return process.env.NODE_ENV !== "production";
  return token === configured;
}

function formatParisDateTime(date: Date) {
  return new Intl.DateTimeFormat("fr-FR", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Europe/Paris",
  }).format(date);
}

function toParisDateTimeInput(date: Date) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "Europe/Paris",
    hourCycle: "h23",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).formatToParts(date);
  const values = Object.fromEntries(parts.map((part) => [part.type, part.value]));

  return `${values.year}-${values.month}-${values.day}T${values.hour}:${values.minute}`;
}

function tokenHref(token: string, issueId?: number) {
  const params = new URLSearchParams();
  if (token) params.set("token", token);
  if (issueId && issueId > 0) params.set("issue", String(issueId));
  const query = params.toString();
  return `/admin/newsletter${query ? `?${query}` : ""}`;
}

function StatusPill({ status }: { status: string }) {
  const tone =
    status === "validated"
      ? "border-success text-success"
      : status === "archived"
        ? "border-text-disabled text-text-disabled"
        : "border-warning text-warning";

  return (
    <span
      className={`inline-flex min-h-7 items-center border px-[var(--space-sm)] font-[family-name:var(--font-data)] text-[10px] uppercase ${tone}`}
    >
      {issueStatusLabel(status)}
    </span>
  );
}

function FeedbackBanner({
  error,
  success,
}: {
  error?: string;
  success?: string;
}) {
  if (!error && !success) return null;

  const isError = Boolean(error);
  return (
    <div
      className={`mb-[var(--space-lg)] border p-[var(--space-md)] text-[14px] leading-[1.5] ${
        isError
          ? "border-accent bg-black text-accent"
          : "border-success bg-black text-success"
      }`}
    >
      {error ?? success}
    </div>
  );
}

function EmptyState({ token }: { token: string }) {
  return (
    <section className="border border-border bg-surface p-[var(--space-xl)]">
      <p className="mb-[var(--space-sm)] font-[family-name:var(--font-data)] text-[11px] uppercase text-accent">
        Aucun brouillon
      </p>
      <h2 className="mb-[var(--space-md)] text-[24px] font-medium leading-[1.2] text-text-display">
        Cree une premiere newsletter.
      </h2>
      <form action={generateNewsletterDraftAction}>
        <input type="hidden" name="adminToken" value={token} />
        <button className="min-h-11 bg-accent px-[var(--space-lg)] font-[family-name:var(--font-data)] text-[11px] uppercase text-text-display transition-opacity hover:opacity-90">
          Generer un brouillon
        </button>
      </form>
    </section>
  );
}

function AccessGate() {
  const tokenIsConfigured = Boolean(configuredAdminToken());

  return (
    <div className="mx-auto max-w-xl px-[var(--space-md)] py-[var(--space-4xl)]">
      <section className="border border-border bg-surface p-[var(--space-xl)]">
        <p className="mb-[var(--space-sm)] font-[family-name:var(--font-data)] text-[11px] uppercase text-accent">
          Admin
        </p>
        <h1 className="mb-[var(--space-md)] text-[28px] font-medium leading-[1.15] text-text-display">
          Acces newsletter
        </h1>
        {tokenIsConfigured ? (
          <form className="grid gap-[var(--space-md)]" method="get">
            <label
              htmlFor="admin-token"
              className="font-[family-name:var(--font-data)] text-[11px] uppercase text-text-disabled"
            >
              Token admin
            </label>
            <input
              id="admin-token"
              name="token"
              type="password"
              autoComplete="off"
              className="min-h-12 border border-border-visible bg-black px-[var(--space-md)] text-text-display outline-none focus:border-text-secondary"
            />
            <button className="min-h-11 bg-accent px-[var(--space-lg)] font-[family-name:var(--font-data)] text-[11px] uppercase text-text-display transition-opacity hover:opacity-90">
              Ouvrir
            </button>
          </form>
        ) : (
          <p className="text-[15px] leading-[1.6] text-text-secondary">
            Configure NEWSLETTER_ADMIN_TOKEN pour activer cette page en
            production.
          </p>
        )}
      </section>
    </div>
  );
}

function IssueList({
  issues,
  selectedIssueId,
  token,
}: {
  issues: NewsletterIssue[];
  selectedIssueId: number;
  token: string;
}) {
  return (
    <aside className="min-w-0 lg:sticky lg:top-20 lg:self-start">
      <details open className="group border border-border bg-surface">
        <summary className="cursor-pointer border-b border-border p-[var(--space-md)] font-[family-name:var(--font-data)] text-[11px] uppercase text-text-disabled marker:text-accent">
          Brouillons ({issues.length})
        </summary>
        <div className="max-h-[32rem] divide-y divide-border overflow-y-auto overscroll-contain">
          {issues.map((issue) => {
            const active = issue.id === selectedIssueId;

            return (
              <Link
                key={issue.id}
                href={tokenHref(token, issue.id)}
                className={`block p-[var(--space-md)] transition-colors ${
                  active ? "bg-black" : "hover:bg-surface-raised"
                }`}
              >
                <div className="mb-[var(--space-sm)] flex items-center justify-between gap-[var(--space-sm)]">
                  <span className="font-[family-name:var(--font-data)] text-[11px] text-text-disabled">
                    #{issue.id}
                  </span>
                  <StatusPill status={issue.status} />
                </div>
                <h2 className="mb-[var(--space-xs)] line-clamp-2 text-[14px] font-medium leading-[1.25] text-text-display">
                  {issue.subject}
                </h2>
                <p className="font-[family-name:var(--font-data)] text-[10px] uppercase text-text-disabled">
                  {formatParisDateTime(issue.sendDate)}
                </p>
              </Link>
            );
          })}
        </div>
      </details>
    </aside>
  );
}

function IssueEditor({ issue, token }: { issue: NewsletterIssue; token: string }) {
  const htmlTextareaId = `newsletter-html-${issue.id}`;
  const titleInputId = `newsletter-title-${issue.id}`;
  const subjectInputId = `newsletter-subject-${issue.id}`;
  const previewTextInputId = `newsletter-preview-${issue.id}`;
  const canScheduleInBeehiiv =
    issue.status === "validated" || issue.status === "synced";
  const alreadyScheduled = issue.status === "scheduled";

  return (
    <div className="grid min-w-0 gap-[var(--space-lg)]">
      <section className="border border-border bg-surface">
        <div className="grid gap-[var(--space-md)] border-b border-border p-[var(--space-md)] lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
          <div className="min-w-0">
            <div className="mb-[var(--space-sm)] flex flex-wrap items-center gap-[var(--space-sm)]">
              <StatusPill status={issue.status} />
              <span className="font-[family-name:var(--font-data)] text-[11px] uppercase text-text-disabled">
                Envoi {formatParisDateTime(issue.sendDate)}
              </span>
              {issue.beehiivPostId ? (
                <span className="font-[family-name:var(--font-data)] text-[11px] uppercase text-text-disabled">
                  beehiiv {issue.beehiivPostId}
                </span>
              ) : null}
            </div>
            <h1 className="break-words text-[26px] font-medium leading-[1.15] text-text-display sm:text-[32px]">
              {issue.subject}
            </h1>
          </div>

          <div className="flex flex-wrap gap-[var(--space-sm)]">
            <form action={updateNewsletterStatusAction}>
              <input type="hidden" name="adminToken" value={token} />
              <input type="hidden" name="issueId" value={issue.id} />
              <input type="hidden" name="status" value="validated" />
              <button className="min-h-10 bg-success px-[var(--space-md)] font-[family-name:var(--font-data)] text-[11px] uppercase text-white transition-opacity hover:opacity-90">
                Valider
              </button>
            </form>
            <NewsletterDeleteButton
              action={deleteNewsletterIssueAction}
              adminToken={token}
              issueId={issue.id}
            />
            <form action={updateNewsletterStatusAction}>
              <input type="hidden" name="adminToken" value={token} />
              <input type="hidden" name="issueId" value={issue.id} />
              <input type="hidden" name="status" value="draft" />
              <button className="min-h-10 border border-border-visible px-[var(--space-md)] font-[family-name:var(--font-data)] text-[11px] uppercase text-text-display transition-colors hover:bg-surface-raised">
                Brouillon
              </button>
            </form>
          </div>
        </div>

        <form action={updateNewsletterIssueAction} className="grid gap-px bg-border">
          <input type="hidden" name="adminToken" value={token} />
          <input type="hidden" name="issueId" value={issue.id} />

          <div className="grid gap-[var(--space-md)] bg-surface p-[var(--space-md)] lg:grid-cols-2">
            <label className="grid gap-[var(--space-xs)]">
              <span className="font-[family-name:var(--font-data)] text-[11px] uppercase text-text-disabled">
                Nom du brouillon (interne)
              </span>
              <input
                id={titleInputId}
                name="title"
                defaultValue={issue.title}
                className="min-h-11 border border-border-visible bg-black px-[var(--space-md)] text-text-display outline-none focus:border-text-secondary"
              />
            </label>

            <label className="grid gap-[var(--space-xs)]">
              <span className="font-[family-name:var(--font-data)] text-[11px] uppercase text-text-disabled">
                Date et heure souhaitees d&apos;envoi (heure de Paris)
              </span>
              <input
                name="sendDate"
                type="datetime-local"
                defaultValue={toParisDateTimeInput(issue.sendDate)}
                className="min-h-11 border border-border-visible bg-black px-[var(--space-md)] text-text-display outline-none focus:border-text-secondary"
              />
            </label>

            <label className="grid gap-[var(--space-xs)] lg:col-span-2">
              <span className="font-[family-name:var(--font-data)] text-[11px] uppercase text-text-disabled">
                Objet de l&apos;e-mail (visible dans la boite de reception)
              </span>
              <input
                id={subjectInputId}
                name="subject"
                defaultValue={issue.subject}
                className="min-h-11 border border-border-visible bg-black px-[var(--space-md)] text-text-display outline-none focus:border-text-secondary"
              />
            </label>

            <label className="grid gap-[var(--space-xs)] lg:col-span-2">
              <span className="font-[family-name:var(--font-data)] text-[11px] uppercase text-text-disabled">
                Texte d&apos;aperçu (affiche apres l&apos;objet dans la boite de reception)
              </span>
              <input
                id={previewTextInputId}
                name="previewText"
                defaultValue={issue.previewText}
                className="min-h-11 border border-border-visible bg-black px-[var(--space-md)] text-text-display outline-none focus:border-text-secondary"
              />
            </label>

            <label className="grid gap-[var(--space-xs)] lg:col-span-2">
              <span className="font-[family-name:var(--font-data)] text-[11px] uppercase text-text-disabled">
                Segment beehiiv (optionnel : laisser vide pour tous les abonnes)
              </span>
              <input
                name="segment"
                defaultValue={issue.segment ?? ""}
                placeholder="Optionnel"
                className="min-h-11 border border-border-visible bg-black px-[var(--space-md)] text-text-display outline-none placeholder:text-text-disabled focus:border-text-secondary"
              />
            </label>

            <label className="grid gap-[var(--space-xs)] lg:col-span-2">
              <span className="font-[family-name:var(--font-data)] text-[11px] uppercase text-text-disabled">
                Contenu HTML de l&apos;e-mail
              </span>
              <NewsletterTemplateButton
                templateHtml={CLUBS_ACTIONNAIRES_WEEKLY_TEMPLATE}
                targetTextareaId={htmlTextareaId}
              />
              <textarea
                id={htmlTextareaId}
                name="html"
                defaultValue={issue.html}
                spellCheck={false}
                className="min-h-[28rem] resize-y border border-border-visible bg-black p-[var(--space-md)] font-[family-name:var(--font-data)] text-[12px] leading-[1.6] text-text-display outline-none focus:border-text-secondary"
              />
            </label>
          </div>

          <div className="flex flex-col gap-[var(--space-sm)] bg-surface p-[var(--space-md)] sm:flex-row sm:items-center sm:justify-between">
            <p className="text-[12px] text-text-disabled">
              Derniere mise a jour : {formatParisDateTime(issue.updatedAt)}
            </p>
            <div className="flex flex-wrap gap-[var(--space-sm)]">
              <button
                formAction={sendNewsletterToBeehiivAction}
                className="min-h-11 border border-border-visible px-[var(--space-lg)] font-[family-name:var(--font-data)] text-[11px] uppercase text-text-display transition-colors hover:bg-surface-raised"
              >
                {issue.beehiivPostId
                  ? "Renvoyer vers beehiiv"
                  : "Envoyer vers beehiiv"}
              </button>
              <button
                formAction={scheduleNewsletterInBeehiivAction}
                disabled={!canScheduleInBeehiiv}
                title={
                  alreadyScheduled
                    ? "Cette newsletter est deja programmee."
                    : canScheduleInBeehiiv
                      ? "Programmer l'envoi dans beehiiv a la date indiquee."
                      : "Validez d'abord cette newsletter avant de la programmer."
                }
                className={`min-h-11 border px-[var(--space-lg)] font-[family-name:var(--font-data)] text-[11px] uppercase transition-colors ${
                  canScheduleInBeehiiv
                    ? "border-success bg-success text-white hover:opacity-90"
                    : "cursor-not-allowed border-border-visible text-text-disabled"
                }`}
              >
                {alreadyScheduled
                  ? "Programmée dans beehiiv"
                  : "Programmer dans beehiiv"}
              </button>
              <button className="min-h-11 bg-accent px-[var(--space-lg)] font-[family-name:var(--font-data)] text-[11px] uppercase text-text-display transition-opacity hover:opacity-90">
                Enregistrer
              </button>
            </div>
          </div>
        </form>
      </section>

      <NewsletterAdminWorkbench
        html={issue.html}
        sourceTextareaId={htmlTextareaId}
      />
    </div>
  );
}

export default async function NewsletterAdminPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const token = firstParam(params.token) ?? "";
  const beehiivError = firstParam(params.beehiivError);
  const beehiivSuccess = firstParam(params.beehiivSuccess);
  const deleted = firstParam(params.deleted);

  if (!hasAdminAccess(token)) {
    return <AccessGate />;
  }

  const issues = await listNewsletterIssues();
  const requestedIssueId = Number(firstParam(params.issue));
  const selectedIssue =
    issues.find((issue) => issue.id === requestedIssueId) ?? issues[0];
  const hydratedIssue = selectedIssue
    ? await getNewsletterIssue(selectedIssue.id)
    : null;

  return (
    <div className="mx-auto max-w-[1600px] px-[var(--space-md)] py-[var(--space-2xl)] sm:px-[var(--space-lg)] lg:px-[var(--space-xl)]">
      <div className="mb-[var(--space-xl)] flex flex-col gap-[var(--space-md)] border-b border-border pb-[var(--space-lg)] lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="mb-[var(--space-sm)] font-[family-name:var(--font-data)] text-[11px] uppercase text-accent">
            Admin newsletter
          </p>
          <h1 className="text-[36px] font-medium leading-none text-text-display sm:text-[48px]">
            Beehiiv cockpit
          </h1>
        </div>
        <form action={generateNewsletterDraftAction}>
          <input type="hidden" name="adminToken" value={token} />
          <button className="min-h-11 bg-accent px-[var(--space-lg)] font-[family-name:var(--font-data)] text-[11px] uppercase text-text-display transition-opacity hover:opacity-90">
            Nouveau brouillon
          </button>
        </form>
      </div>

      <FeedbackBanner error={beehiivError} success={beehiivSuccess ?? deleted} />

      {hydratedIssue ? (
        <div className="grid items-start gap-[var(--space-lg)] lg:grid-cols-[14rem_minmax(0,1fr)] xl:grid-cols-[14rem_minmax(0,1fr)_22rem]">
          <IssueList
            issues={issues}
            selectedIssueId={hydratedIssue.id}
            token={token}
          />
          <IssueEditor issue={hydratedIssue} token={token} />
          <div className="min-w-0 lg:col-start-2 xl:sticky xl:top-20 xl:col-start-3 xl:row-start-1 xl:self-start">
            <NewsletterGrokAssistant
              issueId={hydratedIssue.id}
              adminToken={token}
              targetIds={{
                title: `newsletter-title-${hydratedIssue.id}`,
                subject: `newsletter-subject-${hydratedIssue.id}`,
                previewText: `newsletter-preview-${hydratedIssue.id}`,
                html: `newsletter-html-${hydratedIssue.id}`,
              }}
            />
          </div>
        </div>
      ) : (
        <EmptyState token={token} />
      )}
    </div>
  );
}
