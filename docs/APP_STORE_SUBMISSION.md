# Myatlastic — App Store & Google Play Submission Guide

**Project Atlastic · Pre-launch checklist**

---

## PART 1 — Apple App Store

### Prerequisites you already have
- Mac with Xcode 15+
- Apple Developer account ($99/yr)
- Bundle ID reserved: `io.vertotech.atlastic`

---

### Step 1: Build the iOS Capacitor project (on your Mac)

```bash
# From repo root
cd mobile_setup
npm install
npx cap add ios          # only first time
npx cap sync             # copy web/ into ios project
npx cap open ios         # opens Xcode
```

In Xcode:
- Select the `App` target → General → set **Bundle Identifier**: `io.vertotech.atlastic`
- Set **Version**: `1.0.0`  **Build**: `1`
- Set **Team**: your Apple Developer account
- Minimum iOS: **16.0** (covers 98% of active iPhones as of 2025)

---

### Step 2: App icon

Master SVG is at `assets/icon.svg`. Generate all sizes:

```bash
cd mobile_setup
npm install -g @capacitor/assets
npx capacitor-assets generate \
  --iconBackgroundColor '#0b0e13' \
  --iconBackgroundColorDark '#0b0e13' \
  --ios true \
  --android false
```

This creates all 19 required iOS icon sizes automatically.

---

### Step 3: Privacy Manifest (required) — already created

`PrivacyInfo.xcprivacy` already exists at `mobile_setup/ios/App/App/PrivacyInfo.xcprivacy`
(no tracking, no data collected, `UserDefaults` reason `CA92.1`). One-time step in Xcode:
right-click the **App** group → **Add Files to "App"…** → select `PrivacyInfo.xcprivacy` →
tick the **App** target so it ships in the build. RevenueCat and the Capacitor plugins
include their own privacy manifests, so their declarations are already covered.

Matching App Store Connect **App Privacy** answers: **"Data Not Collected"** for every category.

---

### Step 4: Build archive

In Xcode:
1. Select **Any iOS Device (arm64)** as the destination
2. Product → **Archive**
3. Wait for the archive to complete (~3-5 minutes)
4. In the Organiser: click **Distribute App** → App Store Connect → Upload

---

### Step 5: App Store Connect listing

Go to https://appstoreconnect.apple.com → My Apps → `+` → New App.

| Field | Value |
|---|---|
| Platform | iOS |
| Name | Myatlastic |
| Primary Language | English (US) |
| Bundle ID | io.vertotech.atlastic |
| SKU | myatlastic-ios-v1 |

**Age Rating**: Fill questionnaire. Select:
- No cartoon/fantasy violence
- No mature themes
- Gambling: No
→ Result: **4+** (suitable for all ages)

**Category**: Primary = **Education** · Secondary = **Reference**

**App Name** (30 chars): `Myatlastic: World Geography`  *(alt: `Myatlastic`)*

**Subtitle** (30 chars): `Explore all 195 countries`

**Promotional text** (170 chars — editable anytime, no review):
```
Spin a 3D globe and discover all 195 countries — flags, capitals, cultures, quizzes, a daily challenge, and a relaxed spelling game. No ads, no tracking.
```

**Description** (4,000 chars max):
```
Discover the whole world — all 195 countries — with Myatlastic, an interactive geography app for kids and curious minds of all ages.

Spin a photorealistic 3D globe and tap any country to instantly explore its flag, capital, currency, language, culture, history, notable figures, religion, national food, sport, and traditional dress.

WHAT YOU CAN DO
• Spin a 3D globe — drag to rotate, pinch to zoom, tap a pin to dive in
• Explore all 195 countries with rich, readable detail and a landmark photo for each
• Hear each country's name read aloud
• Take a Daily Challenge and build a streak
• Test yourself with quizzes — flags, capitals, culture, food and more
• Compare any two countries side by side
• Convert currencies with live exchange rates
• Play Spell-the-Country, a relaxed word game for learning country names

MADE FOR FAMILIES
• Kids mode with a brighter, simpler interface
• No ads. No tracking. No account required.
• Collects zero personal data — COPPA and GDPR-K compliant
• Family Sharing — one purchase covers your whole Apple Family

FREE
• 10 countries fully unlocked
• 3 quizzes per day
• A daily challenge

MYATLASTIC PRO — unlock everything
• All 195 countries in full depth
• A landmark photo for every country
• Compare mode + currency converter
• The Spell-the-Country game
• Unlimited quizzes
• Full Daily Challenge with streak history

PRICING
• Monthly — $9.99 / month
• Annual — $69.99 / year (save 42%)
• Lifetime — $149 one-time, includes all future updates
Subscriptions start with a 1-week free trial.

Payment is charged to your Apple ID. Subscriptions auto-renew unless turned off at least 24 hours before the end of the period; manage or cancel anytime in Settings. The Lifetime option is a one-time purchase and does not renew.

Privacy Policy: https://myatlastic.com/privacy
Terms of Use: https://myatlastic.com/terms

Questions? support@myatlastic.com
```

**Keywords** (100 chars max):
```
capitals,flags,globe,atlas,maps,quiz,nations,culture,currency,spelling,learn,education,travel,kids
```

**Support URL**: `https://myatlastic.com`
**Privacy Policy URL**: `https://myatlastic.com/privacy`
**Marketing URL**: `https://myatlastic.com`

---

### Step 6: Screenshots

Apple needs **iPhone 6.9"** screenshots (it scales them down for smaller phones, so this one set covers every iPhone). Add **iPad 13"** only if you ship an iPad build.

| Device (Simulator) | Portrait size | Required? |
|---|---|---|
| iPhone 16 Pro Max — 6.9" | 1320 × 2868 | ✅ required |
| iPad Pro 13" (M4) | 2064 × 2752 | only if iPad-supported |

Capture in the iOS Simulator: open the device, load the app, **Cmd + S** saves to Desktop. **Unlock Pro via the demo paywall first** so the Pro screens are populated. You may upload 3–10 per device; aim for 5–8.

Suggested order (lead with the most striking):
1. The 3D globe — rotated to a region, a country pin/tooltip showing
2. A country detail with its landmark photo (e.g. Brazil, Japan, or France)
3. Compare — two countries side by side
4. Currency converter — a live conversion
5. Spell-the-Country game — mid-round with the letter tiles
6. A quiz question
7. Daily Challenge with a streak
8. The "Myatlastic Pro" plans screen

Tip: a short caption across the top of each shot (e.g. "Spin the globe", "Compare any two countries") noticeably lifts conversion — optional but recommended.

---

### Step 7: In-App Purchases

In App Store Connect → My Apps → Myatlastic → create these (IDs **must match** `BILLING_CONFIG` in `web/index.html`):

| Product ID | Type | Price | Free trial |
|---|---|---|---|
| `io.vertotech.atlastic.pro.monthly` | Auto-renewable subscription | $9.99 / month | 1 week |
| `io.vertotech.atlastic.pro.annual` | Auto-renewable subscription | $69.99 / year | 1 week |
| `io.vertotech.atlastic.pro.lifetime` | Non-consumable | $149 one-time | — |

- Put the two subscriptions in one **Subscription Group** ("Myatlastic Pro"); add a **1-week free Introductory Offer** to each.
- The Lifetime tier is a **Non-consumable** (not in the group).
- Turn on **Family Sharing** for all three.

RevenueCat is **already integrated** in the app (`@revenuecat/purchases-capacitor`, gated behind `BILLING_CONFIG`; entitlement `pro`). Once the products + RevenueCat project exist, paste the `appl_…` key into `BILLING_CONFIG.revenueCatApiKey` and rebuild — no other code change. Full steps: `mobile_setup/REVENUECAT_SETUP.md`.

---

### Step 8: App Review Notes

In the "Review Notes" field on App Store Connect:
```
This is an educational geography reference app covering 195 countries.
It uses a 3D globe with NASA Blue Marble public domain imagery.
Landmark images link to Wikimedia Commons (Creative Commons / Public Domain).
The paywall (Myatlastic Pro) uses auto-renewing subscriptions.
No user login required for the free tier.
Test the app freely — all features accessible via the Upgrade button
which runs in demo mode (no real payment taken in demo builds).
```

**Demo credentials**: Not required (no login needed).

---

### Step 9: Submit

1. App Store Connect → Myatlastic → Pricing and Availability → set **Free** (with IAP)
2. Add the build you uploaded in Step 4
3. Click **Submit for Review**
4. Review takes 24-48 hours typically, up to 7 days for new apps

---

## PART 2 — Google Play Store

### Prerequisites
- Google Play Console account ($25 one-off)
- Android Studio installed
- Java 17+

---

### Step 1: Build Android project

```bash
cd mobile_setup
npm install
npx cap add android       # first time only
npx cap sync
npx cap open android      # opens Android Studio
```

In Android Studio:
- `Build → Generate Signed Bundle / APK`
- Select **Android App Bundle** (AAB — required by Play Store)
- Create a **new keystore** (keep it safe — losing it = can never update the app)
  - Store in a password manager
  - Key alias: `myatlastic-release`
- Build variant: **release**

---

### Step 2: App icon

```bash
npx capacitor-assets generate \
  --iconBackgroundColor '#0b0e13' \
  --android true \
  --ios false
```

---

### Step 3: Play Console listing

https://play.google.com/console → All apps → Create app

| Field | Value |
|---|---|
| App name | Myatlastic |
| Default language | English (US) |
| App or game | App |
| Free or paid | Free |

**Short description** (80 chars):
```
Explore all 195 countries on a 3D globe. Geography for all ages.
```

**Full description** (4,000 chars): Same as App Store description above.

**Category**: Education

**Tags**: Geography, World, Atlas, Quiz, Kids

**Content rating**: Complete the questionnaire → Result: **Everyone / PEGI 3**

**Privacy Policy URL**: `https://myatlastic.com/privacy`

---

### Step 4: Designed for Families (optional but recommended)

Google Play → Policy → Families → Opt in.
Requirements: no ads, COPPA compliant, age-appropriate content. Myatlastic qualifies.
This gives you placement in "Apps for Kids" section.

---

### Step 5: In-App Products

Play Console → Myatlastic → Monetise → In-app products → Subscriptions → Create

| Product ID | Name | Price |
|---|---|---|
| `io.vertotech.atlastic.pro.monthly` | Myatlastic Pro Monthly | $9.99/month |
| `io.vertotech.atlastic.pro.annual` | Myatlastic Pro Annual | $69.99/year |
| `io.vertotech.atlastic.pro.lifetime` | Myatlastic Pro Lifetime | $149 one-time |

---

### Step 6: Upload AAB and release

1. Play Console → Testing → Internal testing → Create new release
2. Upload the `.aab` file from Android Studio
3. Add release notes: `First release. Explore 195 countries with a 3D globe, daily challenges, and quiz modes.`
4. Roll out to internal testing first (your own Google account)
5. After passing internal testing: Production → Create release

Play Store review is typically same-day or next-day.

---

## PART 3 — Subscription terms (required in both stores)

The following text **must appear in the app** near the upgrade button:

```
Subscription automatically renews unless cancelled at least 24 hours
before the end of the current period. Manage your subscription in
Settings → [Your Name] → Subscriptions (iOS) or Google Play →
Subscriptions (Android).
```

Add this to the paywall card in `web/index.html` inside the `.legal-note` div.

---

## PART 4 — Post-launch checklist

- [ ] Monitor App Store Connect → TestFlight for crash reports
- [ ] Set up App Store reviews notification (daily digest)
- [ ] Apple Search Ads: start at $10/day, target "geography" and "world atlas"
- [ ] Google UAC: start at $5/day
- [ ] Submit to Common Sense Media for editorial review
- [ ] Post first TikTok/Instagram reel showing the globe spinning

---

## Timeline estimate

| Task | Duration |
|---|---|
| iOS build + icon generation | 1 day |
| RevenueCat integration | 1 day |
| Screenshots | 2 hours |
| App Store Connect form filling | 2 hours |
| App Review wait | 1-7 days |
| Play Store build + upload | 4 hours |
| Play Review | 1 day |
| **Total** | **4-10 days** |
