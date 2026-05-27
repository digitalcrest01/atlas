# RevenueCat + In-App Purchase setup

The app's purchase code is already wired (see `Billing` + `BILLING_CONFIG` in `web/index.html`).
Until a RevenueCat key is set it runs in **demo mode** (unlocks locally, no charge). Follow this
to go live. The three products and the entitlement name must match across App Store Connect,
RevenueCat, and `BILLING_CONFIG`.

## Product IDs (already in BILLING_CONFIG)
| Plan | Product ID | Type | Price | Trial |
|---|---|---|---|---|
| Monthly | `io.vertotech.atlastic.pro.monthly` | Auto-renewable sub | $9.99 / month | 1-week free |
| Annual | `io.vertotech.atlastic.pro.annual` | Auto-renewable sub | $69.99 / year | 1-week free |
| Lifetime | `io.vertotech.atlastic.pro.lifetime` | Non-consumable | $149 one-time | — |

Entitlement id: **`pro`**

> Note: Apple does not offer a 5-day free-trial duration. Valid options are 3 days or 1 week —
> we use **1 week**. Change in App Store Connect + the StoreKit file + paywall copy if you prefer 3 days.

## 1. App Store Connect (needs the paid Apple Developer account)
1. Create the app (bundle id `io.vertotech.atlastic`).
2. Create a **subscription group** "Myatlastic Pro" with the two auto-renewable subs above; add a
   **1-week free Introductory Offer** to each.
3. Create the **non-consumable** `io.vertotech.atlastic.pro.lifetime`.
4. Agreements, Tax, and Banking → sign the **Paid Applications Agreement** and add bank + tax info.
5. Users → generate an **App Store Connect API key** (for RevenueCat) and a **Sandbox test account**.

## 2. RevenueCat (free)
1. Create a project → add an **App Store** app with the bundle id.
2. Paste the App Store Connect API key (so RevenueCat can validate receipts).
3. Create an **Entitlement** called `pro`.
4. Add the 3 products (same IDs as above) and attach them to `pro`.
5. Create an **Offering** (e.g. "default") with a package per product.
6. Copy the **public SDK key** (starts with `appl_`).

## 3. Drop it in
In `web/index.html`, set:
```js
const BILLING_CONFIG = { revenueCatApiKey: 'appl_xxxxxxxxxxxx', entitlementId: 'pro', products: { ... } };
```
Then: `cd mobile_setup && npx cap sync ios`, rebuild in Xcode. The paywall now does real purchases.

## Test the purchase flow NOW (no Apple account needed)
A StoreKit Configuration file is included at `mobile_setup/ios/App/Myatlastic.storekit`.
1. In Xcode: **Product → Scheme → Edit Scheme → Run → Options**.
2. Set **StoreKit Configuration** to `Myatlastic.storekit`.
3. Run. The native purchase sheet now shows the 3 products with the 1-week trial, and you can
   buy/restore locally in the simulator.
   - Pure StoreKit testing exercises the native sheet. RevenueCat's `getOfferings()` still needs the
     RevenueCat dashboard configured, so leave `revenueCatApiKey` empty (demo) until step 3 above is done,
     or use this file to validate the products/pricing/trial render correctly.

## Family Sharing
Turn on **Family Sharing** for each product in App Store Connect (a toggle on the non-consumable and
on the subscription group). Once enabled, a single purchase covers the buyer's whole Apple Family.
No extra app code is needed: RevenueCat reports family-shared access as an active `pro` entitlement
(`ownershipType: FAMILY_SHARED`), which the existing entitlement check already unlocks. The app also
re-checks entitlement on every foreground, so a family member's access appears seamlessly. The bundled
`Myatlastic.storekit` already marks all products `familyShareable` for local testing.

## Android (later)
Add the products in Google Play Console, add a Play service-account key + the Android public SDK key
in RevenueCat, then set the Android key in `BILLING_CONFIG` (split per-platform when you get there).
