# Go-Live runbook — App Store Connect + RevenueCat (iOS IAP)

Exact steps to take Atlastic Pro live on iOS. The app code is already wired; this
is the dashboard/account work. Values below are pulled from the actual project.

## Project values (use these verbatim)

| Thing | Value |
|---|---|
| App name | Myatlastic |
| Bundle ID / Capacitor appId | `io.vertotech.atlastic` |
| Version / build | 1.0 (1) |
| Entitlement id (RevenueCat) | `pro` |
| Monthly product id | `io.vertotech.atlastic.pro.monthly` ($9.99/mo, 1-wk free trial) |
| Annual product id | `io.vertotech.atlastic.pro.annual` ($69.99/yr, 1-wk free trial) |
| Lifetime product id | `io.vertotech.atlastic.pro.lifetime` ($149 one-time) |
| RevenueCat iOS public key (in `BILLING_CONFIG`) | `appl_BBgGwCAFEEOZYRRZWQPcdVCYVCu` — verify it matches your RC project |
| Plugin (already installed) | `@revenuecat/purchases-capacitor` ^8 |

> Confirm `BILLING_CONFIG.devMode` is `false` before shipping (it is).

## Step 0 — Prerequisites (gating; nothing below works without these)

- [ ] **Apple Developer Program membership ACTIVE** for Vertotech LLC. (Enrollment was *pending* — confirm it completed; App Store Connect is inaccessible until then.)
- [ ] **Paid Applications Agreement** signed in App Store Connect → *Business* → Agreements, Tax, and Banking complete. (No paid IAP can go live without this.)

## Step 1 — App Store Connect: create the app

1. App Store Connect → *Apps* → **+** → New App.
2. Platform iOS, Name **Myatlastic**, Primary Language, Bundle ID **io.vertotech.atlastic** (must already exist in *Certificates, IDs & Profiles* → Identifiers; create it there first if needed, with the **In-App Purchase** capability — it's on by default).
3. Set SKU (e.g. `myatlastic-ios`).

## Step 2 — Create the In-App Purchases

In the app → *Monetization* → In-App Purchases / Subscriptions:

1. **Subscription group** named e.g. `Atlastic Pro`. Add two auto-renewables:
   - `io.vertotech.atlastic.pro.monthly` — price $9.99/month, **Introductory Offer: 1 week free trial**.
   - `io.vertotech.atlastic.pro.annual` — price $69.99/year, **Introductory Offer: 1 week free trial**.
2. **Non-consumable**: `io.vertotech.atlastic.pro.lifetime` — price $149.
3. For each: add a localized **display name + description**, a **review screenshot** (a paywall screenshot — `assets/paywall_review_screenshot.png` exists), and enable **Family Sharing**.
4. Leave them in "Ready to Submit" — they're submitted *with* the app's first version.

## Step 3 — Keys Apple gives, RevenueCat needs

1. **App-Specific Shared Secret**: App → *App Information* → App-Specific Shared Secret → Generate. Copy it.
2. **App Store Connect API key**: *Users and Access* → Integrations → App Store Connect API → generate an **In-App Purchase** key. Download the `.p8` and note **Issuer ID** + **Key ID**.

## Step 4 — RevenueCat dashboard

1. Create a **Project** (or use existing) → add an **App** → platform **App Store**, bundle id `io.vertotech.atlastic`.
2. Paste the **App-Specific Shared Secret**; upload the **App Store Connect API key** (`.p8` + Issuer ID + Key ID). This lets RC validate receipts and receive server notifications.
3. RC gives you a **Server Notification URL** → paste it back in App Store Connect → App Information → App Store Server Notifications (V2, Production + Sandbox).
4. **Entitlements** → create one with identifier **`pro`** (must match `BILLING_CONFIG.entitlementId`).
5. **Products** → add the three product ids exactly as above.
6. Attach **all three products** to the `pro` entitlement.
7. **Offerings** → create `default` with packages: Monthly → monthly product, Annual → annual product, (custom) Lifetime → lifetime product. The app reads the current Offering; it also falls back to fetching products directly, so this is recommended but not strictly required.
8. **API keys** → copy the **Apple public SDK key** (`appl_…`). Verify it equals the one in `BILLING_CONFIG.revenueCatApiKey`; if different, update the code and re-sync `app/` → `web/`.

## Step 5 — Build, then sandbox-test on a device

```bash
cd mobile_setup
npm install
npx cap sync ios
cd ios/App && pod install
```
- Open `mobile_setup/ios/App/App.xcworkspace` in Xcode, set the **Signing Team** to Vertotech LLC, confirm **In-App Purchase** capability is present.
- Create a **Sandbox tester** (App Store Connect → Users and Access → Sandbox) and sign in to it on a real device (Settings → App Store → Sandbox Account).
- Run the app, open the paywall, **buy each product** in sandbox → Pro must unlock, **Restore** must work, and the purchase must appear in the RevenueCat dashboard (Customer view) with the `pro` entitlement active.
- Tip: a local StoreKit Configuration file lets you test without sandbox during development.

## Step 6 — Submit for review

1. Archive in Xcode → upload to App Store Connect (or via Transporter).
2. On the app version: attach the three IAPs, add **App Review notes** explaining how to reach the paywall, set screenshots, age rating, privacy (privacy manifest already added).
3. Submit. Apple reviews the app **and** the IAPs together on first submission.

## After iOS is live — web payments (separate)

Web Billing + cross-platform sync is its own runbook: see
[WEB_BILLING_AND_ACCOUNTS.md](WEB_BILLING_AND_ACCOUNTS.md). Do iOS first.

## What's already done in the app (no action needed)

- RevenueCat plugin installed; `Billing` configures it, listens for entitlement
  changes, refreshes on foreground, and reads the `pro` entitlement.
- Product ids, bundle id, entitlement all consistent across code + iOS project.
- Privacy manifest + privacy policy in place. Demo/dev unlock is off in production.
