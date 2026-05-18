# Day 1 — Supabase setup walkthrough

This is the only manual work you do on Day 1. ~10 minutes total.

## Prerequisites — accounts to create (5 min)

| Service | URL | Card needed? |
|---|---|---|
| Supabase | https://supabase.com | No (free tier covers everything for now) |
| Resend | https://resend.com | No |

You'll create RevenueCat later (Day 4). Apple Developer + Google Play Console you said you already have.

## Step 1 — Create the Supabase project (2 min)

1. Log in at https://supabase.com
2. Click **"New project"**
3. Settings:
   - Name: `myatlastic`
   - Database password: **generate a strong one, save it somewhere safe** (1Password, password manager — you'll need this for direct database access later, NOT for normal app use)
   - Region: pick closest to your users (Europe (London) for UK, US East for North America)
   - Pricing plan: **Free**
4. Click **"Create new project"**
5. Wait ~2 minutes for provisioning

## Step 2 — Run the schema (1 min)

Once your project shows "Healthy":

1. In the left sidebar, click **SQL Editor** (the `</>` icon)
2. Click **"New query"**
3. Copy the entire contents of `backend/schema.sql` from this repo
4. Paste into the SQL editor
5. Click **"Run"** (or press Cmd+Enter)
6. Wait for the green "Success" message

If you see any errors, paste them back to me and I'll fix.

## Step 3 — Verify the schema landed (30 sec)

In the left sidebar:

1. Click **Table Editor**
2. You should see 5 tables: `profiles`, `subscriptions`, `family_members`, `progress`, `otp_codes`
3. Click on `profiles` — should show the columns (id, email, display_name, birth_year, etc.)

If all 5 tables exist → Day 1 schema is done.

## Step 4 — Configure email auth (1 min)

1. Left sidebar → **Authentication** → **Providers**
2. **Email** provider should already be enabled by default — confirm it is
3. Click the gear icon next to Email to edit settings:
   - **Enable email confirmations**: ON (required for OTP flow)
   - **Confirm email change**: ON
   - **Secure email change**: ON
   - **Mailer OTP Expiration**: 600 seconds (10 minutes)
   - **Mailer OTP Length**: 6 digits
4. Save

## Step 5 — Configure Apple Sign-In (3 min)

Hold off on this until later in Day 1 unless you want to do it now. Requires Apple Developer Console access. I'll write a separate walkthrough when we wire it in.

## Step 6 — Configure Google Sign-In (2 min)

Same — wait for the integration step. Needs Google Cloud Console.

## Step 7 — Grab your project credentials (1 min)

These three values are how the backend connects to Supabase:

1. Left sidebar → **Project Settings** (gear at bottom) → **API**
2. Copy these three values to a safe place (NOT in the repo, NOT in chat):
   - **Project URL** (looks like `https://xxxxx.supabase.co`)
   - **anon / public API key** (this is OK to be in the frontend)
   - **service_role / secret key** (NEVER expose this — backend only)
3. Also from **Project Settings → Database**:
   - **Database password** (the one you set in Step 1)

## Step 8 — Send me confirmation

Reply with:

```
Supabase setup done. URL ends in [the last 6 chars of your project URL]
```

Don't paste the full URL or keys here — chat history persists. The 6 chars is enough for me to know you're set up. From there I'll give you the next file to push (the backend serverless functions for Day 2).

## What I'm building while you do this

While Supabase provisions, I'm writing:

- Vercel serverless API endpoints (`/api/auth/*`, `/api/user/*`)
- Email template for OTP codes
- Frontend hooks to connect to Supabase
- Sign-up and sign-in screens

These won't go into your zip until tomorrow (Day 2) — they need your Supabase URL to know where to point.

## Trouble?

- Supabase project stuck "Creating" for >5 min? Refresh the page, it usually finishes in background
- SQL error like "permission denied for schema auth"? You're not the project owner. Make sure you're logged in as the account that created the project
- Email auth not appearing in Authentication tab? Click "Save" on the settings page once to initialise it

Anything else, send me the error message and I'll diagnose.
