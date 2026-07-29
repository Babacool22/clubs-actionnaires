create table if not exists public.newsletter_ai_runs (
  id bigserial primary key,
  issue_id bigint references public.newsletter_issues(id) on delete set null,
  model text not null,
  mode text not null,
  instruction text not null,
  summary text not null,
  covered_topics text[] not null default '{}',
  future_topics text[] not null default '{}',
  draft jsonb not null,
  input_tokens bigint not null default 0,
  cached_input_tokens bigint not null default 0,
  output_tokens bigint not null default 0,
  created_at timestamptz not null default now(),
  constraint newsletter_ai_runs_mode_check
    check (mode in ('draft', 'improve'))
);

create index if not exists newsletter_ai_runs_issue_created_idx
  on public.newsletter_ai_runs (issue_id, created_at desc);

create index if not exists newsletter_ai_runs_created_idx
  on public.newsletter_ai_runs (created_at desc);

alter table public.newsletter_ai_runs enable row level security;

revoke all on public.newsletter_ai_runs from anon, authenticated;
revoke all on sequence public.newsletter_ai_runs_id_seq from anon, authenticated;

grant select, insert, update, delete on public.newsletter_ai_runs to service_role;
grant usage, select on sequence public.newsletter_ai_runs_id_seq to service_role;
