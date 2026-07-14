-- Adds an admin role + a global "registration open/closed" switch.
-- Additive — safe to run on the existing project regardless of whether
-- migrate-to-auth.sql has been run yet. Run this whole script once.

-- profiles ------------------------------------------------------------------
create table if not exists profiles (
  user_id uuid primary key references auth.users (id) on delete cascade,
  is_admin boolean not null default false,
  created_at timestamptz not null default now()
);

alter table profiles enable row level security;

drop policy if exists "users read own profile" on profiles;
create policy "users read own profile" on profiles
  for select using (auth.uid() = user_id);
-- Deliberately no insert/update policy for regular users — is_admin can only
-- be granted by running SQL directly in the Supabase dashboard (see bootstrap
-- step at the bottom of this file).

create or replace function handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (user_id) values (new.id);
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();

-- Backfill profiles for accounts that existed before this migration.
insert into profiles (user_id)
select id from auth.users
where id not in (select user_id from profiles);

-- app_settings ----------------------------------------------------------------
create table if not exists app_settings (
  id boolean primary key default true,
  registration_enabled boolean not null default true,
  constraint app_settings_singleton check (id)
);

insert into app_settings (id, registration_enabled)
values (true, true)
on conflict (id) do nothing;

alter table app_settings enable row level security;

drop policy if exists "anyone can read settings" on app_settings;
create policy "anyone can read settings" on app_settings
  for select using (true);

drop policy if exists "admins can update settings" on app_settings;
create policy "admins can update settings" on app_settings
  for update
  using (exists (select 1 from profiles where profiles.user_id = auth.uid() and profiles.is_admin))
  with check (exists (select 1 from profiles where profiles.user_id = auth.uid() and profiles.is_admin));

-- Server-side enforcement: block new signups when registration is closed.
-- (The app's Register page also checks the flag before showing the form —
-- this trigger is just the real backstop in case someone calls the API
-- directly. Its error message will likely come through generic rather than
-- our nice copy, which is fine since it's not the primary UX path.)
create or replace function check_registration_enabled()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if not (select registration_enabled from app_settings where id = true) then
    raise exception 'Registration is currently closed.';
  end if;
  return new;
end;
$$;

drop trigger if exists on_auth_user_before_insert on auth.users;
create trigger on_auth_user_before_insert
  before insert on auth.users
  for each row execute function check_registration_enabled();

-- One-time bootstrap ----------------------------------------------------------
-- After you've registered your own account, run this separately (replace the
-- email) to make yourself admin:
--
--   update profiles set is_admin = true
--   where user_id = (select id from auth.users where email = 'YOUR-EMAIL-HERE');
