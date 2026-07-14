-- Run this in Supabase's SQL editor (Project → SQL Editor → New query).

create table if not exists progress (
  id uuid primary key default gen_random_uuid(),
  user_id text not null default 'local-user',
  card_id text not null,
  module text not null,
  status text not null default 'new',        -- new | learning | review | mastered
  ease_factor numeric not null default 2.5,
  interval_days numeric not null default 0,
  repetitions int not null default 0,
  next_review_date date not null default current_date,
  correct_count int not null default 0,
  incorrect_count int not null default 0,
  last_reviewed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, card_id)
);

create table if not exists study_log (
  user_id text not null default 'local-user',
  log_date date not null default current_date,
  cards_reviewed int not null default 0,
  primary key (user_id, log_date)
);

alter table progress enable row level security;
alter table study_log enable row level security;

-- Single-user app, no login screen — the anon key itself is the only gate.
-- These policies allow any holder of the anon key full read/write access.
-- That's an acceptable tradeoff for a private personal tool, but don't
-- reuse this schema/policy setup for anything multi-tenant.
drop policy if exists "allow all for anon" on progress;
create policy "allow all for anon" on progress for all using (true) with check (true);

drop policy if exists "allow all for anon" on study_log;
create policy "allow all for anon" on study_log for all using (true) with check (true);
