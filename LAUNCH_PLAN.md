# Myatlastic — 14-day launch plan

Hard target: 14 days from today to "App in the App Store and Play Store".

## Critical-path reality

Apple App Store review averages 24-48 hours but can take up to 7 days for new apps. **Plan to submit no later than day 7.** Any later and you're gambling on Apple.

## Day-by-day

### Days 1-2 — Environment and content lock

- [ ] Push this repo to `https://github.com/digitalcrest01/atlas` (commands below)
- [ ] Test the web app on your phone via GitHub Pages — confirm it renders end-to-end
- [ ] Decide finally on free vs paid split (the current code is tight-free, 10 free countries; can be flipped in 5 minutes if you change your mind)
- [ ] Buy `myatlastic.com` domain (or accept `myatlastic.com` is taken and use a different one)
- [ ] Apple Developer account: confirm active ($99/year)
- [ ] Google Play Console: register if not already ($25 one-off)

### Days 3-4 — Mobile build

- [ ] Clone repo to your Mac
- [ ] Run `./setup_mobile.sh` — adds iOS + Android Capacitor projects
- [ ] `cd mobile_setup && npx cap open ios` — opens in Xcode
- [ ] In Xcode: set bundle identifier to `io.vertotech.atlastic` (or your own), set Team to your Apple Developer account, set Version 1.0
- [ ] Build to iOS Simulator first — confirm everything renders
- [ ] Build to a real iPhone via Xcode — confirm again. Real device is the only thing that matters.
- [ ] Same for Android in Android Studio

### Days 5-6 — Paywall and store assets

- [ ] **Choose paywall strategy** (this is the biggest remaining technical work):
  - Option A: **RevenueCat** (recommended) — `npm install @revenuecat/purchases-capacitor`. Configure two products in App Store Connect + Google Play. Wire to existing paywall UI. ~1 day of work.
  - Option B: Native StoreKit 2 + Play Billing 6 — more code, more testing, no third-party dependency.
- [ ] Create products in App Store Connect:
  - `myatlastic_pro_monthly` — $3.99/month auto-renewing
  - `myatlastic_pro_annual` — $24.99/year auto-renewing
  - `myatlastic_pro_family` — $39.99/year family share group
- [ ] Same in Google Play Console
- [ ] Generate app icons: square 1024x1024 + adaptive Android icon. Tools: `npx capacitor-assets generate` once you have a square PNG
- [ ] Take 5-8 screenshots per device family (iPhone 6.7", 6.5", 5.5"; iPad 12.9"; Android phone + tablet) — Simulator can do this
- [ ] Write App Store description (4000 char), short description (170 char), keywords (100 char)
- [ ] Write Google Play short description (80 char) and long description (4000 char)

### Day 7 — Compliance and submission

- [ ] **Privacy manifest** for iOS: required since May 2024. Tells Apple what data your app collects. Easy: it's empty for us (we collect nothing). Add `PrivacyInfo.xcprivacy` file in Xcode with empty arrays.
- [ ] Privacy policy URL: point to `myatlastic.com/privacy.html` (already written, hosted via GitHub Pages or wherever you put the site)
- [ ] Support URL: `myatlastic.com/#support` or a Tally form
- [ ] Marketing URL: `myatlastic.com`
- [ ] Apple App Review notes: explain "this app uses a 3D globe with public-domain NASA imagery and Wikimedia photos. Subscription unlocks all 195 countries' data."
- [ ] Submit to App Store
- [ ] Submit to Google Play (Play review is typically same-day)

### Days 8-13 — Review wait + Android beta + bug fixes

- [ ] Monitor App Store Connect for review status. Common rejection reasons for this kind of app:
  - **Apple's "guideline 4.2 - Minimum Functionality"** — make sure the app feels substantial, not a wrapper. Our app is substantial enough.
  - **"Children Category" issues** if you select it — we're best in Education with appropriate age rating (4+ or 9+)
  - **Subscription terms missing** — required text in app: "Subscription auto-renews unless cancelled 24h before period ends. Manage subscription in Settings."
- [ ] If rejected, fix immediately and resubmit (next review starts fresh — could take another 24h)
- [ ] Set up a TestFlight beta with 10-20 testers (parents, teachers from your network)
- [ ] Collect beta feedback on a Notion or Google Form
- [ ] Fix any blocking bugs

### Day 14 — Launch

- [ ] Manual release the app in App Store Connect (don't use auto-release — you want control)
- [ ] Publish on Google Play
- [ ] Soft announce to your network on day 14; hold any press push to day 21 to let early reviews accumulate

## What can be produced next, in order of value

1. **RevenueCat integration code** (replaces the `localStorage.myatlastic_pro` simulation). ~1 hour of work.
2. **PrivacyInfo.xcprivacy template** for Apple submission. ~10 minutes.
3. **App Store description and keywords**. ~30 minutes.
4. **Bundle identifier + icon generation script**. ~20 minutes.

## What I can't produce

- Running Xcode, building to Simulator, simulating iOS. Not in this sandbox.
- Apple Developer account interactions, submission.
- Real-device testing.
- Push to your GitHub repo (no credentials).

## Pushing this repo to your GitHub

From your Mac:

```bash
# In the unzipped myatlastic_product/ directory:
git init
git remote add origin https://github.com/digitalcrest01/atlas.git
git add .
git commit -m "Myatlastic v6 — expanded FACTS, mobile fixes, diagnostic mode"
git branch -M main
git push -f origin main
```

Use `-f` because your remote has the older atlas content. If you want to preserve history instead, drop `-f` and:

```bash
git pull --allow-unrelated-histories origin main
# Resolve any conflicts in your editor
git push origin main
```

You can rename the repo from `atlas` to `myatlastic` in GitHub Settings → Rename. Old URLs auto-redirect.
