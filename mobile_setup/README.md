# Mobile build — Capacitor

Wrap the `/web` PWA as native iOS and Android apps.

## Prerequisites

| Need | For |
|---|---|
| Node.js 18+ | Capacitor CLI |
| Xcode 15+ on macOS | iOS build |
| Android Studio Hedgehog+ | Android build |
| Apple Developer account ($99/yr) | App Store submission |
| Google Play Console account ($25 one-off) | Play Store submission |
| CocoaPods (`brew install cocoapods`) | iOS dependency install |

## One-time setup

From the repo root:

```bash
cd mobile_setup
npm install
npx cap add ios
npx cap add android
```

That creates `/mobile_setup/ios/` and `/mobile_setup/android/` — these are the native projects. Commit them, but the build outputs are gitignored.

## Iterating

After any change to `/web`:

```bash
cd mobile_setup
npx cap sync
```

Then open the native project:

```bash
npx cap open ios       # launches Xcode
npx cap open android   # launches Android Studio
```

Build and run from the IDE.

## Before you ship — checklist

### Bundle the globe texture locally

The web build loads NASA Blue Marble from a CDN. On mobile this causes a 1–3s blank globe on first launch. Fix:

1. Download `earth-blue-marble.jpg` (~2 MB) from <https://unpkg.com/three-globe/example/img/earth-blue-marble.jpg>
2. Save to `/web/assets/earth-blue-marble.jpg`
3. Edit `web/index.html` and change the first entry of `TEXTURE_URLS` to `'./assets/earth-blue-marble.jpg'`
4. `npx cap sync`

### Wire up real subscriptions

The `localStorage.myatlastic_pro` simulation must be replaced with real billing. Recommended path:

- Install **RevenueCat** SDK (`@revenuecat/purchases-capacitor`) — handles StoreKit + Play Billing + receipt verification across both stores
- Configure two products: `myatlastic_pro_monthly` ($3.99) and `myatlastic_pro_annual` ($24.99)
- Replace the `Upgrade` button handler in `index.html` with `Purchases.purchaseProduct(...)`
- On purchase success/restore, set `isPro = true` from the entitlement state

Alternative without RevenueCat: native StoreKit 2 (iOS) + Play Billing Library 6 (Android) with a server-side verification endpoint. More work, lower runtime cost.

### App Store assets needed

- App icon (1024×1024 + auto-generated sizes via `npx capacitor-assets generate`)
- Screenshots (6.7", 6.5", 5.5" for iPhone; 12.9" for iPad)
- App preview video (optional, increases conversion)
- App Store description, keywords, support URL, privacy URL
- Apple Privacy Manifest declaring no tracking

### Google Play assets needed

- Feature graphic (1024×500)
- Screenshots (phone + tablet)
- Short description (80 chars), long description
- Content rating questionnaire (likely PEGI 3 / ESRB E)
- Designed for Families opt-in if targeting kids

### Compliance flags

- **iOS Kids category**: stricter review, no SDK that tracks, no third-party ads, parental gate on IAP. Myatlastic is built compliant by design.
- **Google Play Designed for Families**: parallel restrictions, manual review.
- **COPPA**: no data collection from under-13. Already compliant.
- **GDPR-K**: parental consent for under-13/16 depending on jurisdiction. Apple/Google handle the IAP consent. Required: privacy policy linked from App Store listing (already at `site/privacy.html`).

## Folder map after `cap add`

```
mobile_setup/
├── package.json
├── capacitor.config.json
├── node_modules/                  (gitignored)
├── ios/
│   └── App/
│       ├── App.xcworkspace        ← open this in Xcode
│       ├── App/
│       │   ├── Info.plist
│       │   └── public/            ← `/web` content synced here
│       └── Podfile
└── android/
    ├── app/
    │   ├── build.gradle
    │   └── src/main/
    │       ├── AndroidManifest.xml
    │       └── assets/public/     ← `/web` content synced here
    └── build.gradle               ← open in Android Studio
```

## Common gotchas

- **WebGL fails on iOS Simulator** — only test the globe on a real device. Simulator falls back to software rendering and is unusably slow.
- **CORS errors on local network** — Capacitor serves over `capacitor://localhost` (iOS) and `https://localhost` (Android). The Wikimedia and unpkg CDNs are CORS-permissive, so no proxy needed.
- **Pinch-zoom hijacks page zoom** — the meta viewport already pins user-scalable to default; on Android, `captureInput: true` in capacitor.config.json keeps gestures inside the canvas.
- **Status bar overlap** — the StatusBar plugin sets the colour to match `--bg`. If you change the theme, update `capacitor.config.json` too.

## App icon

The master 1024×1024 icon SVG is at `../assets/icon.svg`. To generate all required iOS and Android sizes:

```bash
# Install @capacitor/assets globally
npm install -g @capacitor/assets

# Generate iOS + Android icons from the master SVG
npx @capacitor/assets generate --iconBackgroundColor '#0b0e13' --iconBackgroundColorDark '#0b0e13' --icon-source ../assets/icon.svg
```

This creates all 19 iOS PNG sizes and the Android adaptive icon foreground/background.
