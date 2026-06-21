# Launch-Day Checklist — when Apple approves v1.0

Do these the moment the app is **Approved** (or right before you hit "Release" if you chose Manual release).

## 1. Flip the app to "live"
In `app/index.html`:
```js
let APP_LIVE = true;   // was false
```
This auto-switches every in-app CTA: "Coming soon to iPhone & iPad" → "Download on iPhone & iPad", and the web get-the-app bar "📱 Coming soon" → "📱 Get the app". One flag does all of them.

## 2. Update the marketing landing (hardcoded — does NOT read APP_LIVE)
In `index.html` (and mirror `site/index.html`), change the hero button:
```html
<!-- before -->
<a href="https://apps.apple.com/app/id6773543267" class="btn">📱 Coming soon — iPhone & iPad</a>
<!-- after -->
<a href="https://apps.apple.com/app/id6773543267" class="btn">📱 Download on the App Store</a>
```

## 3. Keep the two app copies in sync, then sync iOS
- `app/index.html` and `web/index.html` must stay byte-identical → copy app → web.
- Then: `cd mobile_setup && npx cap sync ios` (only needed if you also ship a web/app update; the App Store build is already uploaded).

## 4. Deploy & verify
- Redeploy the web (`index.html` + `app/` + `site/`).
- Hard-refresh and confirm: landing says "Download on the App Store", app CTAs say "Download on iPhone & iPad".
- In App Store Connect, if you picked **Manual release**, click **Release this version**.

## 5. Order matters
Web first (steps 1–4), **then** release the App Store version — so the site isn't saying "Coming soon" while the app is already downloadable.

---

## Roadmap (post-launch, not for v1.0)
- **Web purchasing** — set up RevenueCat Web Billing → paste `BILLING_CONFIG.webBilling.paywallLink` + `publicApiKey` → switch the web paywall wall back to the 3 buy plans. Apple-compliant; do after traction.
- RevenueCat App Store Server Notifications URL (non-blocking; improves subscription state accuracy).
- Optional 6.9" screenshots if Apple ever requires them.
