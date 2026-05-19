# Myatlastic

Interactive geography app for kids 7-12 and Gen Z. Photorealistic 3D globe with all 197 countries, native-language pronunciation, paywall-gated depth content, four game modes. Single web codebase, shipped as iOS, Android, and PWA.

**Live**: [myatlastic.com](https://myatlastic.com) (once deployed to Vercel)
**Repo**: this one
**Status**: web app feature-complete, mobile wrap pending, App Store submission pending

## What's in here

```
myatlastic/
├── web/                       The app (one file, ~243 KB, runs anywhere)
│   ├── index.html             Shell, UI, 3D globe, voice, paywall, all modes
│   └── countries_data.js      197 countries × 19 fields
├── site/                      Marketing site
│   ├── index.html             Landing page
│   ├── privacy.html           Privacy policy (COPPA, GDPR-K)
│   └── terms.html             Terms of service
├── mobile_setup/              Capacitor scaffold for iOS + Android
│   ├── capacitor.config.json
│   ├── package.json
│   └── README.md              Build instructions
├── docs/
│   ├── BUSINESS_PLAN.md       11 sections, USD
│   └── financial_model.xlsx   1,429 formulas, Bear/Base/Bull scenarios
├── assets/                    Reserved for icons, screenshots, store listings
├── vercel.json                Hosting config (handles routing + headers)
├── setup_mobile.sh            One-command iOS/Android setup
├── LAUNCH_PLAN.md             14-day day-by-day plan
├── WHAT_TO_DO_NEXT.md         Concise next-steps guide
├── LICENSE                    Proprietary, all rights reserved
├── README.md                  This file
└── .gitignore
```

## Run it locally

```bash
cd web
python3 -m http.server 8000
# Open http://localhost:8000 on Mac
# Open http://<your-mac-local-ip>:8000 on your phone (same WiFi)
```

No build step. The app is a single static HTML file with inlined country data.

## Hosting on Vercel

The repo deploys to Vercel out of the box. `vercel.json` is already configured.

```
1. Push this repo to GitHub
2. Go to https://vercel.com/new
3. Import the repo
4. Click Deploy (no settings to change)
5. Get a free *.vercel.app URL immediately
6. Add myatlastic.com in Vercel → Settings → Domains
7. Paste the DNS records Vercel gives you into your registrar
```

URL structure after deploy:

| Path | Serves |
|---|---|
| `/` | Marketing landing page |
| `/app` | The actual geography app |
| `/privacy` | Privacy policy |
| `/terms` | Terms of service |

Vercel auto-provisions HTTPS, runs on a CDN, gives you preview URLs per branch.

## Features (web app v6+)

| Capability | Detail |
|---|---|
| 197 countries | All sovereign states + Vatican + Palestine + Kosovo + Taiwan |
| Photorealistic 3D globe | Three.js with NASA Blue Marble texture, raycaster pin picking |
| SVG flat-map fallback | If WebGL fails (older devices), app degrades to a flat world map |
| Voice pronunciation | Web Speech API, ~60 countries get native locale voice (ja-JP for Japan, fr-FR for France, etc) |
| Expanded country data | Each country has: capital, currency, language, history, religion, culture, notable figures, food, sport, traditional attire, population, independence date, pronunciation guide |
| Four modes | Explore (globe + facts), Quiz (6 question types), Daily challenge with streak, Compare two countries |
| Paywall | 10 free countries (alphabetical: Afghanistan-Australia). Pro unlocks all 195+ and deep sections |
| Kids mode toggle | Brighter colour palette, simpler UI |
| Debug HUD | Triple-tap the Myatlastic logo to expose state info for diagnosing render issues |
| Offline-friendly | No backend. All state in localStorage |

## Architecture

Static HTML + ES modules. Three.js loaded via import-map from `unpkg`. Earth texture from CDN with fallback chain. Country pins on the globe are raycaster-pickable (hover on desktop, tap on mobile). State (Pro status, streak, daily quiz count) lives entirely in `localStorage`. No backend. No analytics.

The paywall is a UI simulation — production wiring to RevenueCat or native StoreKit/Play Billing is the biggest remaining technical task before App Store submission.

## Monetisation

Tight-free model: 10 countries fully unlocked, hard paywall on the other 187.

| Plan | Price (USD) |
|---|---|
| Free | $0 — 10 countries, 3 quizzes/day, 1 daily challenge |
| Pro Monthly | $7.99/mo |
| Pro Annual | $29.99/yr (saves 69%) |
| Family Annual | $49.99/yr — 6 profiles |
| School Classroom | $199/yr |

See `docs/BUSINESS_PLAN.md` §1 for pricing rationale and §8 for the strategy risk analysis. The financial model on the `Cover` sheet has a Bear/Base/Bull selector that recalculates the full forecast.

**Honest finding from the model**: Base scenario does NOT reach cash-positive in 36 months. Minimum funding need: $150k. Recommended raise: $200k. Document this clearly before fundraising.

## App Store + Play Store path

You have a Mac, Xcode, and Apple Developer account. The Capacitor wrap is one command:

```bash
chmod +x setup_mobile.sh
./setup_mobile.sh
cd mobile_setup
npx cap open ios
```

That opens the project in Xcode. Build to Simulator first, then to your real iPhone.

Before App Store submission, you need:
1. RevenueCat or native StoreKit integration (replaces the localStorage paywall simulation)
2. App icon at 1024×1024 + all derived sizes
3. Screenshots for iPhone 6.7", 6.5", 5.5", iPad 12.9"
4. App Store listing copy (description, keywords, support URL, privacy URL)
5. Privacy manifest (`PrivacyInfo.xcprivacy`) — required since May 2024
6. Globe texture bundled locally instead of from CDN (eliminate first-launch network dependency)

See `LAUNCH_PLAN.md` for a 14-day day-by-day plan.

## Status

| Area | State |
|---|---|
| Web app | Done — voice, expanded facts, all 197 countries, paywall, mobile-responsive |
| Marketing site | Done — landing + privacy + terms |
| Financial model | Done — 1,429 formulas, no errors |
| Business plan | Done |
| Vercel deploy config | Ready |
| Domain | `myatlastic.com` owned |
| Trademark | Searched USPTO/EU/UK — clean |
| Capacitor scaffold | Files in place; needs `npx cap add ios` on your Mac |
| iOS build | Not started |
| Subscription wiring | Not started (paywall is currently localStorage simulation) |
| App Store listing | Not started |
| Real-device testing | Not done |

## Known caveats — flagged so nothing surprises you later

- **Globe texture loads from CDN.** Works in browser. On the mobile Capacitor build, bundle `earth-blue-marble.jpg` locally before submission to avoid first-launch network dependency.
- **Wikimedia landmark image URLs are unverified at scale.** ~30-50 of 195 may 404. An `onerror` handler degrades gracefully. Pre-launch task: HEAD-check all 195.
- **Paywall is a UI simulation.** Clicking Upgrade sets `localStorage.myatlastic_pro = '1'`. Production needs RevenueCat (recommended) or native StoreKit + Play Billing + verification backend.
- **No analytics.** Deliberate privacy choice. No funnel data. If needed post-launch, add Plausible (self-hosted). Do not add Google Analytics or Mixpanel.
- **Tight-free monetisation is aggressive.** Base scenario doesn't cash-positive in 36 months. Re-read `BUSINESS_PLAN.md` §8 before raising.
- **Voice pronunciation depends on the browser's installed voices.** Older Android devices may have lower-quality TTS. About 60 countries get locale-specific voices; the rest fall back to English.

## Licence

All rights reserved. Proprietary. See `LICENSE`.

## Contact

Built by Digital Crest.

- **General + support**: [support@myatlastic.com](mailto:support@myatlastic.com)
- **Schools + enquiries**: [schools@myatlastic.com](mailto:schools@myatlastic.com)
- **Bugs + feature requests**: GitHub Issues on this repo
