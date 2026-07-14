-- Run this in Supabase's SQL editor (Project → SQL Editor → New query).
-- For a brand-new project only. If you already ran the old single-user
-- version of this schema, use migrate-to-auth.sql instead.

create table if not exists progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
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
  user_id uuid not null references auth.users (id) on delete cascade,
  log_date date not null default current_date,
  cards_reviewed int not null default 0,
  primary key (user_id, log_date)
);

alter table progress enable row level security;
alter table study_log enable row level security;

-- Each row is only visible to / writable by the user it belongs to.
drop policy if exists "allow all for anon" on progress;
drop policy if exists "users manage own progress" on progress;
create policy "users manage own progress" on progress
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "allow all for anon" on study_log;
drop policy if exists "users manage own study_log" on study_log;
create policy "users manage own study_log" on study_log
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
