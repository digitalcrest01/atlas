# Web Billing + Accounts (cross-platform Pro sync)

How Atlastic Pro is sold and how a purchase syncs across iOS, iPad and web.

## The model (and the rules behind it)

| Platform | How they pay | Why |
|---|---|---|
| **iOS / iPad (in app)** | Apple **StoreKit IAP** via RevenueCat | Apple *requires* IAP for in-app digital subscriptions. Stripe/PayPal/Apple-Pay-web are **not allowed** in-app and get the app rejected. Already wired and live. |
| **Web (browser)** | **RevenueCat Web Billing** hosted checkout (card, Apple Pay, Google Pay, PayPal) | On your own website Apple's rule doesn't apply, so we can take real global payments. |

**Cross-platform sync requires accounts.** Pro is granted to a RevenueCat *customer* identified by an `app_user_id`. For a web purchase to appear on someone's iPhone, the **same `app_user_id`** must be used on both — which means the user signs in on each device. Without sign-in there is no way to know web-buyer = iPhone-user. This is unavoidable, not a shortcut we skipped.

The client code is already wired for all of this. What's left is **config you paste in** and **credentials/dashboard work only you can do**.

---

## Step 1 — RevenueCat Web Billing

1. RevenueCat dashboard → enable **Web Billing**.
2. Make sure your entitlement is `pro` (matches `BILLING_CONFIG.entitlementId`) and create the web products/prices (monthly / annual / lifetime).
3. Create a **Web Billing paywall link** and copy the **Web Billing public API key** (`rcb_…`).
4. Paste into `BILLING_CONFIG` (in `app/index.html`, then re-sync to `web/`):

```js
webBilling: {
  paywallLink: 'https://pay.rev.cat/XXXXXXXX',   // your paywall link
  publicApiKey: 'rcb_XXXXXXXXXXXX',
},
```

The app appends `?app_user_id=<id>` to the paywall link automatically, so RevenueCat grants the purchase to the right customer.

> Prefer Stripe Payment Links instead? Leave `webBilling.paywallLink` empty and fill the per-plan `webCheckout` URLs — but then you must reconcile entitlements into RevenueCat via Stripe webhooks yourself, and sync still needs Step 2.

## Step 2 — Accounts (sign-in)

### Google (works on web, simplest)
1. Google Cloud Console → OAuth consent screen + **Web** OAuth client.
2. Add your domains to *Authorized JavaScript origins* (e.g. `https://myatlastic.com`, `http://localhost:8765` for testing).
3. Paste the client id:

```js
auth: { googleClientId: 'XXXX.apps.googleusercontent.com', appleEnabled: false },
```

### Sign in with Apple
- **Native iOS:** add the `@capacitor-community/apple-sign-in` plugin and enable the *Sign in with Apple* capability in Xcode. Set `auth.appleEnabled: true`. The app calls the plugin directly — works out of the box on device.
- **Web Apple:** requires an Apple **Services ID**, return URLs, **and a server endpoint** to verify the identity token (Apple does not allow trustworthy client-only verification). If you don't want a backend, use **Google on web + Apple on native**.

## How sync works once configured

1. User signs in → app stores `{ provider, id }` and sets that `id` as the RevenueCat `app_user_id`.
2. On iOS, `Billing.identify()` calls `Purchases.logIn(id)`; on web, the paywall link carries `app_user_id=id`.
3. Whoever pays (web or iOS), RevenueCat grants `pro` to that one customer.
4. Any signed-in device calls `getCustomerInfo()` and sees `pro` active → Pro unlocks everywhere.

## Security note

The client decodes the Google/Apple JWT to read the user id only. For production, verify the identity token **server-side** (or use RevenueCat's recommended auth flow) before trusting it — otherwise a determined user could claim another `app_user_id`. Low stakes for a kids' app, but do it before scaling.

## Config reference (`BILLING_CONFIG` in `app/index.html`)

| Key | Purpose |
|---|---|
| `revenueCatApiKey` | iOS public SDK key (already set) |
| `entitlementId` | RevenueCat entitlement, `pro` |
| `products` | App Store product ids per plan |
| `webBilling.paywallLink` | RevenueCat Web Billing checkout link |
| `webBilling.publicApiKey` | Web Billing public key (`rcb_…`) |
| `webCheckout.{plan}` | Optional Stripe Payment Link fallback |
| `auth.googleClientId` | Google Identity Services web client id |
| `auth.appleEnabled` | Turn on Sign in with Apple |
| `devMode` | `true` lets web Upgrade unlock locally for testing (keep `false` in production) |

## Testing checklist

- [ ] `devMode: true` → web Upgrade unlocks locally (verify Pro features).
- [ ] Paste `webBilling.paywallLink`, set `devMode: false` → Upgrade redirects to RevenueCat checkout.
- [ ] Add `googleClientId` → Settings ⚙️ shows "Continue with Google"; signing in stores the account.
- [ ] Buy on web while signed in, then sign in with the same account on iOS → Pro is already active (no repurchase).
- [ ] Remember to re-sync `app/index.html` → `web/index.html` after editing config.
