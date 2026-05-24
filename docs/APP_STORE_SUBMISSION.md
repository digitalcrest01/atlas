# Myatlastic — App Store & Google Play Submission Guide

**Project Atlastic · Pre-launch checklist**

---

## PART 1 — Apple App Store

### Prerequisites you already have
- Mac with Xcode 15+
- Apple Developer account ($99/yr)
- Bundle ID reserved: `app.myatlastic.myatlastic`

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
- Select the `App` target → General → set **Bundle Identifier**: `app.myatlastic.myatlastic`
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

### Step 3: Privacy Manifest (required since May 2024)

In Xcode: File → New → File → Resource → **Privacy Manifest**.
Name it `PrivacyInfo.xcprivacy`.

Paste this (Myatlastic collects nothing):

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN"
  "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
  <key>NSPrivacyTracking</key>
  <false/>
  <key>NSPrivacyTrackingDomains</key>
  <array/>
  <key>NSPrivacyCollectedDataTypes</key>
  <array/>
  <key>NSPrivacyAccessedAPITypes</key>
  <array/>
</dict>
</plist>
```

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
| Bundle ID | app.myatlastic.myatlastic |
| SKU | myatlastic-ios-v1 |

**Age Rating**: Fill questionnaire. Select:
- No cartoon/fantasy violence
- No mature themes
- Gambling: No
→ Result: **4+** (suitable for all ages)

**Category**: Primary = **Education** · Secondary = **Reference**

**Subtitle** (30 chars): `Explore Every Country`

**Description** (4,000 chars max):
```
Discover the world — all 195 countries — with Myatlastic.

Spin a photorealistic 3D globe with NASA Blue Marble imagery. Tap any country to instantly see its flag, capital, currency, language, culture, history, notable figures, religion, national food, sport, and traditional attire.

FEATURES
• Photorealistic 3D globe — drag to rotate, pinch to zoom, tap to explore
• All 195 countries: detailed facts, landmark images, and pronunciation guide
• Daily Challenge — one new country every day, build a streak
• Four quiz types: flag recognition, capitals, culture hints, and food/sport
• Compare Mode — place any two countries side-by-side
• Kids Mode — brighter UI and simplified language for ages 7-12
• Native pronunciation in 60+ country-specific voices (Japanese, French, Arabic, and more)
• Offline friendly — no account required, no ads, no tracking
• Privacy-first: COPPA and GDPR-K compliant. Zero data collection.

FREE TIER
• 10 countries fully unlocked
• 3 quiz rounds per day
• One daily challenge

MYATLASTIC PRO
• All 195 countries with full depth
• Landmark images
• Unlimited quizzes
• Compare mode
• Full daily challenge with streak history

Subscription terms: Auto-renews unless cancelled 24 hours before the renewal date. Manage subscriptions in Settings.

Questions? support@myatlastic.com
```

**Keywords** (100 chars max):
```
geography,world,countries,capitals,globe,kids,education,flags,quiz,atlas,map,culture,history
```

**Support URL**: `https://myatlastic.com`
**Privacy Policy URL**: `https://myatlastic.com/privacy`
**Marketing URL**: `https://myatlastic.com`

---

### Step 6: Screenshots

Required sizes:
| Device | Size |
|---|---|
| iPhone 6.7" (15 Pro Max) | 1290 × 2796 |
| iPhone 6.5" (14 Plus) | 1242 × 2688 |
| iPhone 5.5" (8 Plus) | 1242 × 2208 |
| iPad Pro 12.9" | 2048 × 2732 |

To take screenshots in Simulator:
1. Open Simulator with the correct device
2. Load the app
3. `Cmd + S` saves screenshot to Desktop

**Minimum required**: iPhone 6.7" and iPad 12.9" (5 screenshots each).

Suggested screens:
1. Globe view with a country tooltip visible
2. Country detail (Japan or France — rich data)
3. Quiz mode in progress
4. Daily challenge with streak display
5. Compare mode side-by-side

---

### Step 7: In-App Purchases

In App Store Connect → My Apps → Myatlastic → **In-App Purchases** → `+`

| Product ID | Type | Price |
|---|---|---|
| `myatlastic_pro_monthly` | Auto-Renewable Subscription | $3.99/month |
| `myatlastic_pro_annual` | Auto-Renewable Subscription | $24.99/year |
| `myatlastic_pro_family` | Auto-Renewable Subscription | $39.99/year |

Create a **Subscription Group** called "Pro". Add all three products.

**IMPORTANT**: The app currently uses `localStorage` to simulate purchases. Before shipping, replace this with RevenueCat:

```bash
cd mobile_setup
npm install @revenuecat/purchases-capacitor
```

Wire RevenueCat in `web/index.html` paywall section — replace `localStorage.setItem('myatlastic_pro', '1')` with `Purchases.purchasePackage(...)`.

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
| `myatlastic_pro_monthly` | Myatlastic Pro Monthly | $3.99/month |
| `myatlastic_pro_annual` | Myatlastic Pro Annual | $24.99/year |

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
