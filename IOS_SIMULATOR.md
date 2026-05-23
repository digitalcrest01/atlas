# Testing Myatlastic in the iOS Simulator

You have Xcode on your Mac. iOS Simulator is included. Two paths:

## Path A — Test the live web app in Mobile Safari (fastest, 30 sec)

This is what you want right now. The app is already live at the Vercel URL.

```bash
# Open the iOS Simulator
open -a Simulator
```

That launches the Simulator app. By default it boots the last iPhone you used (or the default — usually iPhone 15).

If you want a specific device:

```bash
# List installed simulators
xcrun simctl list devices available

# Pick one, e.g.:
xcrun simctl boot "iPhone 15 Pro"
open -a Simulator
```

Once Simulator is open:

1. Inside the simulated iPhone, open **Safari**
2. Tap the address bar
3. Type: `atlas-nine-bay.vercel.app/app` (or your `myatlastic.com` once DNS propagates)
4. The app loads — it behaves exactly like real Safari on a real iPhone

**Why this is useful**:
- Test how touch interactions feel (no mouse hover)
- Test the responsive breakpoints
- Test the new Compare picker on a real iPhone-sized screen
- Test the voice (Simulator has audio output — uses your Mac's speakers)
- Test the debug HUD (triple-tap the compass-star logo)

**What this won't test**:
- Native iOS subscription purchases (those need a real iPhone with TestFlight, or a sandbox account in Simulator)
- Push notifications
- Capacitor plugins (camera, geolocation, etc — not used by our app anyway)

## Path B — Native iOS build with Capacitor (later, for App Store)

When you're ready to test the actual native app shell:

```bash
# In the repo root
cd ~/Downloads/myatlastic_product

# Run the setup script (one-off)
chmod +x setup_mobile.sh
./setup_mobile.sh

# Open in Xcode
cd mobile_setup
npx cap open ios
```

Xcode opens with the Capacitor-wrapped project. Then in Xcode:

1. Top bar: pick a simulator device (e.g. "iPhone 15 Pro")
2. Click the ▶ play button
3. Wait ~30 seconds for the build
4. The app launches in Simulator as if installed from App Store

This is the version you'll actually submit to App Store.

## Useful Simulator shortcuts

| Action | Shortcut |
|---|---|
| Rotate device | Cmd + ← / Cmd + → |
| Home button | Cmd + Shift + H |
| Lock | Cmd + L |
| Screenshot | Cmd + S (saves to Desktop) |
| Slow animations | Debug menu → Slow Animations |
| Force quit | Cmd + Shift + H twice, then swipe up |
| Different device | Hardware menu → Device |
| Different iOS version | Hardware menu → Device → Manage Devices |

## Caveats with Simulator

- **Performance is faster than real device.** Simulator uses your Mac's CPU. If something is slow in Simulator, it's much slower on a real iPhone.
- **No real fingerprint/Face ID.** Simulate with Hardware → Face ID → Matching Face.
- **No camera.** Simulator can simulate camera input from your Mac's webcam.
- **App Store and in-app purchases**: Limited. Sandbox testing requires a real iPhone with a sandbox account, OR Simulator with StoreKit configuration file (advanced).

## What to test first in Simulator

In order, ~5 minutes total:

1. Open `atlas-nine-bay.vercel.app/app` in Safari
2. Country list shows Afghanistan, Albania, Algeria
3. Tap Afghanistan → details appear with food, sport, attire
4. Tap 🔊 next to Afghanistan → voice plays
5. Tap "Compare" in bottom bar
6. **NEW**: search box appears for Slot A. Type "fra" → France appears
7. Tap France → fills Slot A
8. Slot B's search now appears. Type "jap" → Japan appears
9. Tap Japan → fills Slot B
10. Both columns now show full country details side-by-side
11. Tap "Change ✕" on either side to reset that slot
12. Tap "Globe" in bottom bar → 3D globe spins
13. Triple-tap the compass star logo → debug HUD appears
14. Rotate the device (Cmd + ←) → app re-flows to landscape

If any of steps 5-11 don't work as described, the Compare fix didn't deploy. Make sure you pushed the latest commit.

## If Simulator won't open

```bash
# Reset Simulator's state if it's stuck
xcrun simctl shutdown all
xcrun simctl erase all

# Or check Xcode is installed and command line tools too
xcode-select --install
```

If Xcode itself isn't installed, get it from the Mac App Store (~10 GB download).
