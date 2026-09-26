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

**Subtitle** (30 chars): `Hear every country's voice`

**Promotional text** (170 chars — editable anytime, no review):
```
Take a spoken tour of any of 195 countries in its own language, with English translation. Spin a 3D globe of flags and collect a passport stamp for every visit.
```

**Description** (4,000 chars max):
```
Explore all 195 countries of the world and hear them in their own languages.

Myatlastic is a world atlas you can listen to. Spin a 3D globe covered in flags, pick any country, and take a spoken tour led by a natural, human-sounding voice in the country's own language, with a small English translation as it plays. It's made for curious kids, families, students and travellers.

LISTEN TO THE WORLD
• Play the tour: a 2–3 minute spoken visit to every country, in the local language, with English translation.
• Photos of the places being described change as the story unfolds.
• Phrasebook: pick a phrase such as hello, thank you or how much? and hear it said by a local voice.

A LIVING 3D GLOBE
• A photorealistic Earth that keeps turning, with every country's flag on it.
• Tap a country to fly to it. When a tour starts, its flag rises from the globe while the rest of the world fades to grey.
• A soft background sound while you explore, which you can switch off at any time.

EVERY COUNTRY AT A GLANCE
• Flag, capital, currency, languages, local time, culture, history and food for all 195 countries.
• Compare countries side by side, convert currencies and practise spelling country names.
• Mystery Country: follow the clues and guess where you are.

PASSPORTS OF THE WORLD
• See the real passport cover of every country.
• Every visit earns an immigration-style entry stamp. The more you explore, the fuller your passport gets.

QUIZ & PUZZLE
• Quiz: flags, capitals and world facts, such as how many continents there are or how many countries speak Spanish, each with a short explanation.
• Puzzle: drag each country's name onto its flag.

MADE FOR KIDS AND FAMILIES
• A bright, playful Kids mode.
• Designed for iPhone and iPad.
• No ads, no account, no tracking.

SIMPLE PRICING
Exploring, tours, the phrasebook, passports and the globe are free.
Quiz and Puzzle unlock with one single purchase of $29.99. It's yours forever, with no subscription. Restore it any time on your other devices.

Voices and photos need an internet connection.

Questions or ideas? Visit myatlastic.com
```

**Keywords** (100 chars max):
```
geography,languages,phrasebook,passport,flags,globe,atlas,capitals,quiz,culture,learn,kids,travel
```

**Support URL**: `https://myatlastic.com`
**Privacy Policy URL**: `https://myatlastic.com/privacy`
**Marketing URL**: `https://myatlastic.com`

---

### Step 6: Screenshots

The app ships for iPhone and iPad, so both sets are required. App Store Connect currently asks for the **iPhone 6.5"** slot; Apple scales screenshots down for smaller devices.

| Slot | Portrait size |
|---|---|
| iPhone 6.5" | 1284 × 2778 (1242 × 2688 also accepted) |
| iPhone 6.9" (if asked) | 1320 × 2868 |
| iPad 13" | 2064 × 2752 |

The 2.0 set is six framed screenshots per device, each a real app screen under a headline, in this order:
1. Hear every country (a spoken tour, in the local language with English translation)
2. A living 3D globe (every country's flag)
3. Say it like a local (the phrasebook)
4. Passports of the world (a real cover with entry stamps)
5. Quiz the whole world (a world-facts question and its explanation)
6. Made for curious kids (Kids mode)

They were generated from the app with headless Chrome at each device's real screen size; the files are in "Myatlastic 2.0 App Store Screenshots" on the release Mac's Desktop, one folder per slot.

---

### Step 7: In-App Purchases

In App Store Connect → My Apps → Myatlastic → create these (IDs **must match** `BILLING_CONFIG` in `web/index.html`):

| Product ID | Type | Price | Status |
|---|---|---|---|
| `io.vertotech.atlastic.pro.lifetime` | Non-consumable | **$29.99 one-time** | On sale: the only thing the app sells (unlocks Quiz & Puzzle) |
| `io.vertotech.atlastic.pro.monthly` | Auto-renewable subscription | $4.99 / month | Removed from sale (existing subscribers keep access until they cancel) |
| `io.vertotech.atlastic.pro.annual` | Auto-renewable subscription | $29.99 / year | Removed from sale (same) |

- Change the Lifetime price in **In-App Purchases → Lifetime → Price Schedule** (no review needed for a price change).
- Don't set the subscriptions to $0 (Apple doesn't allow it): set their **Availability** to remove them from sale in all countries. Keep the products; deleting them would break restores for past subscribers.
- In RevenueCat, the **current offering** only needs the Lifetime package; the entitlement stays `Myatlastic Pro`.
- Family Sharing is optional. The app and website don't advertise it, so leave it off unless you want to offer it.

RevenueCat is **already integrated** in the app (`@revenuecat/purchases-capacitor`, gated behind `BILLING_CONFIG`; entitlement `pro`). Once the products + RevenueCat project exist, paste the `appl_…` key into `BILLING_CONFIG.revenueCatApiKey` and rebuild — no other code change. Full steps: `mobile_setup/REVENUECAT_SETUP.md`.

---

### Step 8: App Review Notes

In the "Review Notes" field on App Store Connect:
```
Myatlastic is an educational geography app covering 195 countries.
Everything is free except Quiz and Puzzle, which unlock with one
non-consumable in-app purchase (io.vertotech.atlastic.pro.lifetime,
$29.99). "Restore purchases" is in Settings and on the unlock screen,
which also links to the Terms of Use and Privacy Policy.
No login or account is needed.
Spoken tours and phrases use computer-generated voices (xAI, Microsoft
Azure) reading the app's own text, and need an internet connection.
The globe uses NASA Blue Marble public-domain imagery; landmark photos
and passport covers come from Wikimedia Commons.
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
Explore all 197 countries on a 3D globe. Geography for all ages.
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
| `io.vertotech.atlastic.pro.lifetime` | Myatlastic Quiz & Puzzle | $29.99 one-time |

---

### Step 6: Upload AAB and release

1. Play Console → Testing → Internal testing → Create new release
2. Upload the `.aab` file from Android Studio
3. Add release notes: `First release. Explore 197 countries with a 3D globe, daily challenges, and quiz modes.`
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
