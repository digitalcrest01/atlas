-- =====================================================================
-- Myatlastic — Supabase database schema
-- Run this once in Supabase SQL Editor after creating the project
-- =====================================================================

-- ---------------------------------------------------------------------
-- 1. PROFILES
-- Extends Supabase's auth.users with app-specific fields.
-- One row per registered user, created automatically on signup.
-- ---------------------------------------------------------------------
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text unique not null,
  display_name text,
  birth_year smallint check (birth_year is null or (birth_year >= 1900 and birth_year <= 2030)),
  is_minor boolean not null default false,           -- true if birth_year implies age < 13
  parent_email text,                                 -- required for under-13 accounts
  parent_consent_at timestamptz,                     -- COPPA: timestamp of parental verification
  theme text not null default 'classic'
    check (theme in ('classic', 'forest', 'ocean', 'sunset', 'contrast')),
  kids_mode boolean not null default false,
  voice_enabled boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.profiles is 'User profile extension — one row per registered user';
comment on column public.profiles.is_minor is 'Auto-computed: birth_year implies age < 13';
comment on column public.profiles.parent_consent_at is 'COPPA: when parent verified consent';

-- Trigger to auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email)
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Auto-update updated_at on row changes
create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists touch_profiles_updated_at on public.profiles;
create trigger touch_profiles_updated_at
  before update on public.profiles
  for each row execute function public.touch_updated_at();

-- ---------------------------------------------------------------------
-- 2. SUBSCRIPTIONS
-- Mirrors RevenueCat subscription state. One row per user.
-- Source of truth for "is this user Pro?"
-- ---------------------------------------------------------------------
create table public.subscriptions (
  user_id uuid primary key references public.profiles(id) on delete cascade,
  status text not null default 'free'
    check (status in ('free', 'active', 'in_grace', 'expired', 'cancelled', 'billing_issue')),
  product_id text,                                   -- myatlastic_pro_monthly | _annual | _family
  platform text,                                     -- ios | android | web | stripe
  expires_at timestamptz,
  is_family_admin boolean not null default false,
  revenuecat_customer_id text,
  original_purchase_at timestamptz,
  updated_at timestamptz not null default now()
);

comment on table public.subscriptions is 'Subscription state, synced from RevenueCat webhooks';

drop trigger if exists touch_subscriptions_updated_at on public.subscriptions;
create trigger touch_subscriptions_updated_at
  before update on public.subscriptions
  for each row execute function public.touch_updated_at();

-- ---------------------------------------------------------------------
-- 3. FAMILY MEMBERS
-- Maps family admin → up to 5 invited members (admin is the 6th).
-- ---------------------------------------------------------------------
create table public.family_members (
  family_admin_id uuid not null references public.profiles(id) on delete cascade,
  member_id uuid not null references public.profiles(id) on delete cascade,
  added_at timestamptz not null default now(),
  primary key (family_admin_id, member_id),
  check (family_admin_id <> member_id)
);

comment on table public.family_members is 'Family bundle membership — admin + up to 5 members';

-- Cap at 5 invited members per admin (admin themselves = 6th)
create or replace function public.check_family_size()
returns trigger
language plpgsql
as $$
declare
  member_count int;
begin
  select count(*) into member_count
  from public.family_members
  where family_admin_id = new.family_admin_id;
  if member_count >= 5 then
    raise exception 'Family is full (max 5 invited members)';
  end if;
  return new;
end;
$$;

drop trigger if exists check_family_size_before_insert on public.family_members;
create trigger check_family_size_before_insert
  before insert on public.family_members
  for each row execute function public.check_family_size();

-- ---------------------------------------------------------------------
-- 4. PROGRESS
-- Per-user game state (streak, quiz history, favourites).
-- Synced across devices on sign-in.
-- ---------------------------------------------------------------------
create table public.progress (
  user_id uuid primary key references public.profiles(id) on delete cascade,
  streak_count int not null default 0,
  last_daily_date date,
  total_quizzes_completed int not null default 0,
  favourites text[] not null default '{}',
  updated_at timestamptz not null default now()
);

comment on table public.progress is 'Per-user game state for cross-device sync';

drop trigger if exists touch_progress_updated_at on public.progress;
create trigger touch_progress_updated_at
  before update on public.progress
  for each row execute function public.touch_updated_at();

-- ---------------------------------------------------------------------
-- 5. OTP CODES
-- Short-lived verification codes for email signup.
-- Stored hashed for security.
-- ---------------------------------------------------------------------
create table public.otp_codes (
  email text not null,
  code_hash text not null,                           -- bcrypt or argon2 hash
  purpose text not null check (purpose in ('signup', 'reset', 'parent_consent')),
  expires_at timestamptz not null,
  attempts int not null default 0,
  created_at timestamptz not null default now(),
  primary key (email, purpose)
);

comment on table public.otp_codes is 'Email OTP codes — single-use, 10 min expiry';

-- Auto-delete expired codes (run nightly via cron or pg_cron extension)
-- Manual cleanup query: delete from otp_codes where expires_at < now();

-- =====================================================================
-- ROW LEVEL SECURITY (RLS)
-- Every table is RLS-locked by default. Users see only their own data.
-- =====================================================================
alter table public.profiles enable row level security;
alter table public.subscriptions enable row level security;
alter table public.family_members enable row level security;
alter table public.progress enable row level security;
alter table public.otp_codes enable row level security;

-- Profiles: users can read + update their own profile only
create policy "Users read own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users update own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- Subscriptions: users read only their own. Writes only by service role (server-side via webhook)
create policy "Users read own subscription"
  on public.subscriptions for select
  using (auth.uid() = user_id);

-- Family: members can see their own family. Admin can manage.
create policy "Users read own family"
  on public.family_members for select
  using (auth.uid() = family_admin_id or auth.uid() = member_id);

create policy "Admins manage family"
  on public.family_members for all
  using (auth.uid() = family_admin_id);

-- Progress: users read + write their own only
create policy "Users read own progress"
  on public.progress for select
  using (auth.uid() = user_id);

create policy "Users write own progress"
  on public.progress for all
  using (auth.uid() = user_id);

-- OTP codes: NO direct user access. Only the service role (via backend functions) can read/write.
-- No policies = default deny for authenticated users.

-- =====================================================================
-- HELPFUL INDEXES
-- =====================================================================
create index if not exists idx_profiles_email on public.profiles(email);
create index if not exists idx_subscriptions_status on public.subscriptions(status);
create index if not exists idx_family_admin on public.family_members(family_admin_id);
create index if not exists idx_otp_expires on public.otp_codes(expires_at);

-- =====================================================================
-- SEED FUNCTION
-- Called after profile creation to set up subscription + progress rows
-- =====================================================================
create or replace function public.seed_user_records()
returns trigger
language plpgsql
security definer
as $$
begin
  insert into public.subscriptions (user_id, status) values (new.id, 'free')
  on conflict (user_id) do nothing;

  insert into public.progress (user_id) values (new.id)
  on conflict (user_id) do nothing;

  return new;
end;
$$;

drop trigger if exists seed_after_profile_insert on public.profiles;
create trigger seed_after_profile_insert
  after insert on public.profiles
  for each row execute function public.seed_user_records();

-- =====================================================================
-- DONE
-- After running this, your Supabase project has:
--   - profiles, subscriptions, family_members, progress, otp_codes tables
--   - RLS policies (users only see their own data)
--   - Auto-create profile on signup
--   - Auto-seed subscription + progress rows
--   - Family bundle size cap (max 6 including admin)
-- =====================================================================
