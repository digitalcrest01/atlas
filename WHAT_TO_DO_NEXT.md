# Myatlastic — what to do next

Start here. Three things to know, in order.

---

## 1. Test the web app first (60 seconds)

The most important thing right now is confirming the web app renders end-to-end. Everything else builds on this.

**On your Mac:**

```bash
cd web
python3 -m http.server 8000
```

Then open `http://localhost:8000` on your Mac browser. If it works locally, it'll work everywhere.

**On your phone:**

Find your Mac's local IP (in System Settings → Network, or run `ipconfig getifaddr en0`). On the same WiFi, open `http://YOUR-MAC-IP:8000` on your phone browser.

**What to test (90 seconds):**

| Step | Tap | Should see |
|---|---|---|
| 1 | App loads | Header + tabs + country list (Afghanistan top) |
| 2 | Afghanistan | Details with flag, "Pronounced: af-GAN-i-stan", food, sport, attire |
| 3 | 🔊 button | Voice says "Afghanistan. Capital: Kabul." |
| 4 | Daily tab | A country card with same 🔊 button |
| 5 | Brazil (locked) | Details with 🔒 Pro overlay on locked sections |

If any step fails, **triple-tap the Myatlastic logo** to bring up the green debug HUD. Send me the values it shows.

---

## 2. Push to your GitHub repo

```bash
# In the unzipped folder root:
git init
git remote add origin https://github.com/digitalcrest01/atlas.git
git add .
git commit -m "Myatlastic v6 — expanded FACTS, voice, debug HUD"
git branch -M main
git push -f origin main
```

The `-f` overwrites your existing atlas content. If you want history preserved, replace the last line with `git pull --allow-unrelated-histories origin main` to merge first.

After pushing, enable GitHub Pages: repo Settings → Pages → Source: deploy from branch `main`, folder `/` (root). Then your app is live at `https://digitalcrest01.github.io/atlas/web/` within ~2 minutes.

---

## 3. Build the iOS app

You have Mac + Xcode + Apple Developer account. The Capacitor wrap is one script:

```bash
chmod +x setup_mobile.sh
./setup_mobile.sh
cd mobile_setup
npx cap open ios
```

That opens the project in Xcode. Build to Simulator first (fast), then to your real iPhone (slower but only real test).

**Don't ship to App Store yet.** Before submission you need: real subscriptions (RevenueCat or StoreKit), screenshots, privacy manifest, app icon. See `LAUNCH_PLAN.md` for the day-by-day.

---

## What's in this repo

```
myatlastic/
├── web/                   The app (single file, ~243 KB)
│   ├── index.html         Open this in any browser to run
│   └── countries_data.js  Standalone copy of country data
├── site/                  Marketing site (landing + privacy + terms)
├── mobile_setup/          Capacitor config for iOS + Android
├── docs/
│   ├── BUSINESS_PLAN.md
│   └── financial_model.xlsx
├── LAUNCH_PLAN.md         14-day day-by-day plan
├── setup_mobile.sh        One-command iOS/Android setup
├── README.md              Full repo overview
└── WHAT_TO_DO_NEXT.md     (this file)
```

---

## Honest status

- Web app: feature-complete, renders on most devices. Mobile rendering bug reported on one phone — debug HUD added to catch it
- iOS app: not yet built. The `setup_mobile.sh` script does the Capacitor wrap, but you need to run it on your Mac (sandbox cannot)
- Subscriptions: paywall is a UI simulation only. Production needs RevenueCat or native StoreKit/Play Billing
- Globe texture: loads from CDN. For mobile production, bundle locally (see `mobile_setup/README.md`)
- FACTS data: 197 countries × 13 fields. Reasonable accuracy; needs content review before launch

## What I (Claude) cannot do

- Push to GitHub (no credentials, no network access to github.com)
- Build/test iOS apps (no macOS in this sandbox)
- Accept secrets pasted in chat (they'd persist in history)

You handle those. I handle code and data.
