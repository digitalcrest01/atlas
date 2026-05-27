# Myatlastic — iOS Simulator Testing Guide

**Project Atlastic · For your Mac**

---

## Quick path — test the live web app in Mobile Safari (5 minutes)

This requires no Xcode build. The app is live at https://myatlastic.com/app — test it as a real iPhone would see it.

### 1. Open iOS Simulator

```bash
open -a Simulator
```

If you want a specific device:

```bash
# List available simulators
xcrun simctl list devices available

# Boot a specific one (iPhone 15 Pro recommended for screenshots)
xcrun simctl boot "iPhone 15 Pro"
open -a Simulator
```

### 2. Open Safari inside the Simulator

1. On the simulated iPhone, tap **Safari**
2. Type in the address bar: `myatlastic.com/app`
3. Press Return

### 3. What to verify (10-point checklist)

| # | Action | Expected |
|---|---|---|
| 1 | App loads | Header with Myatlastic logo + tabs: Explore / Quiz / Daily / Compare |
| 2 | Country list | Afghanistan at top, alphabetically sorted |
| 3 | Tap Afghanistan | Details panel slides/appears: flag, capital Kabul, pronunciation guide |
| 4 | Tap the speaker button | Voice says "Afghanistan. Capital: Kabul." |
| 5 | Tap the star ☆ button | Turns gold ★ (favourite saved) |
| 6 | Tap Share | Share sheet appears (iOS native) or "Link copied" toast |
| 7 | Tap Globe (bottom bar) | 3D globe renders with NASA Blue Marble texture and country pins |
| 8 | Drag the globe | Rotates smoothly; no jank |
| 9 | Tap Quiz tab | Quiz question appears (flag / capital / culture hint) |
| 10 | Tap Compare tab | Two search boxes appear; type "France" → France appears in results |

### 4. Add to Home Screen (PWA test)

In Safari: tap the **Share** icon → **Add to Home Screen** → Tap **Add**.

The Myatlastic icon should appear on the home screen. Tapping it should open in full-screen (no browser chrome) — this confirms the PWA manifest is working.

---

## Full Capacitor build path — native iOS app (for App Store)

This produces the actual `.ipa` that goes to App Store Connect. Requires Xcode 15+.

### 1. First-time setup

```bash
# In the repo root
cd mobile_setup
npm install
npx cap add ios
npx cap sync
```

### 2. Open in Xcode

```bash
npx cap open ios
```

### 3. Configure Xcode

In Xcode, select the `App` target:

- **General → Bundle Identifier**: `io.vertotech.atlastic`
- **General → Version**: `1.0.0` / **Build**: `1`
- **General → Deployment Info → Minimum iOS**: `16.0`
- **Signing & Capabilities → Team**: select your Apple Developer account
- Ensure Automatic signing is on

### 4. Run in Simulator

1. In the Xcode toolbar, select a simulator: **iPhone 15 Pro (iOS 17.x)**
2. Click the ▶ Play button
3. Wait 20-40 seconds for build
4. App launches in Simulator

### 5. Run on a real iPhone (recommended before App Store submission)

1. Connect iPhone via USB
2. Trust the computer on your iPhone if prompted
3. In Xcode toolbar: select your iPhone from the device dropdown
4. Click ▶ Play
5. First run: go to iPhone Settings → General → VPN & Device Management → Trust [your Developer account]

---

## Known Simulator limitations

| Issue | Impact | Workaround |
|---|---|---|
| WebGL slower than real device | Globe may be sluggish | Test on real iPhone before concluding it's a bug |
| No in-app purchases in Simulator | Can't test RevenueCat | Use Sandbox tester account on real device |
| Speech synthesis uses Mac's voices | May differ from iPhone | Test voice on real iPhone |
| No Face ID biometrics | N/A for Myatlastic | Not applicable |

---

## Useful Simulator keyboard shortcuts

| Shortcut | Action |
|---|---|
| `Cmd + ←` / `Cmd + →` | Rotate device |
| `Cmd + Shift + H` | Home button |
| `Cmd + L` | Lock screen |
| `Cmd + S` | Screenshot (saves to Desktop) |
| `Cmd + 1/2/3` | Device scale 100% / 75% / 50% |

---

## Checking the PWA manifest is correct

Open Safari on the Simulator → navigate to `myatlastic.com/manifest.json`

Should return:
```json
{
  "name": "Myatlastic",
  "short_name": "Myatlastic",
  "display": "standalone",
  "background_color": "#0b0e13",
  "theme_color": "#0b0e13",
  "start_url": "/app",
  ...
}
```

---

## Checking the service worker is active

In Safari on your Mac (not Simulator — Safari Simulator debugging requires Mac Safari):

1. On your Mac, open Safari → Preferences → Advanced → Show Develop menu
2. Open `myatlastic.com/app` in Mac Safari
3. Develop menu → [Your device / localhost] → Service Workers
4. Should show `sw.js` as active for `myatlastic.com`

Alternatively, use Chrome DevTools on any device:
- Application tab → Service Workers → should show `sw.js` as active

---

## What the Capacitor build adds over the web version

| Feature | Web (Safari) | Capacitor (native) |
|---|---|---|
| Offline globe | CDN required | Bundle earth-blue-marble.jpg locally |
| In-app purchases | Simulated | Real StoreKit / RevenueCat |
| Status bar colour | Default | Configured (#0b0e13 dark) |
| Splash screen | None | 1.5s gold star on dark bg |
| Home screen icon | PWA icon | Native app icon (all DPI sizes) |
| App Store listing | No | Yes |

---

## Next step after Simulator testing

1. Archive the app: Product → Archive (in Xcode)
2. Distribute: Organiser → Distribute App → App Store Connect
3. Add screenshots from Simulator (Cmd + S during testing)
4. Submit from App Store Connect (see `docs/APP_STORE_SUBMISSION.md`)
