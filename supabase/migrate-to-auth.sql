-- One-time migration: run this ONLY if your `progress`/`study_log` tables
-- already exist from the old single-user schema (text user_id = 'local-user').
-- If you're setting up a brand-new project, use schema.sql instead — don't
-- run both.
--
-- Steps:
--   1. Have a real account to reassign this data to — either register one
--      through the app (Register page), or run add-admin-and-settings.sql
--      first, which creates govinda@admin.com for you.
--   2. Find its UUID: run `select id, email from auth.users;` in the SQL
--      editor and copy the `id` for your account.
--   3. Replace 'YOUR-USER-UUID-HERE' below (two occurrences) with that UUID.
--   4. Run this whole script once.

begin;

-- progress -----------------------------------------------------------------
alter table progress add column if not exists user_id_new uuid;
update progress set user_id_new = 'YOUR-USER-UUID-HERE'::uuid;

alter table progress drop constraint if exists progress_user_id_card_id_key;
drop policy if exists "allow all for anon" on progress;
drop policy if exists "users manage own progress" on progress;

alter table progress drop column user_id;
alter table progress rename column user_id_new to user_id;
alter table progress
  alter column user_id set not null,
  add constraint progress_user_id_fkey foreign key (user_id) references auth.users (id) on delete cascade,
  add constraint progress_user_id_card_id_key unique (user_id, card_id);

-- study_log ------------------------------------------------------------------
alter table study_log add column if not exists user_id_new uuid;
update study_log set user_id_new = 'YOUR-USER-UUID-HERE'::uuid;

alter table study_log drop constraint if exists study_log_pkey;
drop policy if exists "allow all for anon" on study_log;
drop policy if exists "users manage own study_log" on study_log;

alter table study_log drop column user_id;
alter table study_log rename column user_id_new to user_id;
alter table study_log
  alter column user_id set not null,
  add constraint study_log_user_id_fkey foreign key (user_id) references auth.users (id) on delete cascade,
  add primary key (user_id, log_date);

-- RLS ------------------------------------------------------------------------
alter table progress enable row level security;
alter table study_log enable row level security;

create policy "users manage own progress" on progress
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "users manage own study_log" on study_log
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

commit;
