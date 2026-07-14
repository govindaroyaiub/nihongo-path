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

-- Admin account --------------------------------------------------------------
-- Creates govinda@admin.com / password directly (skips the Register page and
-- any email confirmation) and grants it admin immediately.
--
-- ⚠️ Inserting straight into auth.users/auth.identities is not an officially
-- supported Supabase API — it relies on their current internal schema and
-- could break on a future Supabase upgrade. It's a fine one-time convenience
-- for a personal project, just don't build automation around it. Also:
-- "password" is a placeholder-strength password and this file will likely
-- end up in your git history — change it (via the app, once there's a
-- profile/password-change flow, or `Authentication → Users → Reset password`
-- in the dashboard) if this repo is or ever becomes public.
do $$
declare
  admin_user_id uuid;
begin
  if exists (select 1 from auth.users where email = 'govinda@admin.com') then
    raise notice 'govinda@admin.com already exists, skipping creation.';
    return;
  end if;

  admin_user_id := gen_random_uuid();

  insert into auth.users (
    instance_id, id, aud, role, email, encrypted_password,
    email_confirmed_at, created_at, updated_at,
    raw_app_meta_data, raw_user_meta_data, is_super_admin,
    confirmation_token, recovery_token, email_change_token_new, email_change
  ) values (
    '00000000-0000-0000-0000-000000000000',
    admin_user_id,
    'authenticated',
    'authenticated',
    'govinda@admin.com',
    extensions.crypt('password', extensions.gen_salt('bf')),
    now(), now(), now(),
    '{"provider":"email","providers":["email"]}',
    '{}',
    false,
    '', '', '', ''
  );

  insert into auth.identities (
    id, user_id, provider_id, identity_data, provider, last_sign_in_at, created_at, updated_at
  ) values (
    gen_random_uuid(),
    admin_user_id,
    admin_user_id::text,
    jsonb_build_object('sub', admin_user_id::text, 'email', 'govinda@admin.com'),
    'email',
    now(), now(), now()
  );

  -- the on_auth_user_created trigger above already created their profiles row
  update public.profiles set is_admin = true where user_id = admin_user_id;
end $$;

-- One-time bootstrap for any OTHER admin (someone who registered normally
-- through the app) — run separately, replacing the email:
--
--   update profiles set is_admin = true
--   where user_id = (select id from auth.users where email = 'THEIR-EMAIL-HERE');
