create table if not exists public.newsletter_issues (
  id bigserial primary key,
  send_date timestamptz not null unique,
  title text not null,
  subject text not null,
  preview_text text not null,
  html text not null,
  status text not null default 'draft',
  beehiiv_post_id text,
  segment text,
  scheduled_at timestamptz,
  validated_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint newsletter_issues_status_check
    check (status in ('draft', 'validated', 'synced', 'scheduled', 'sent', 'archived'))
);

create index if not exists newsletter_issues_status_send_date_idx
  on public.newsletter_issues (status, send_date);

create or replace function public.set_newsletter_issues_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists newsletter_issues_set_updated_at on public.newsletter_issues;
create trigger newsletter_issues_set_updated_at
before update on public.newsletter_issues
for each row
execute function public.set_newsletter_issues_updated_at();

alter table public.newsletter_issues enable row level security;

revoke all on public.newsletter_issues from anon, authenticated;
revoke all on sequence public.newsletter_issues_id_seq from anon, authenticated;
