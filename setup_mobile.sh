#!/usr/bin/env bash
# Myatlastic mobile setup — run from repo root on your Mac
# After this completes you can open the project in Xcode

set -euo pipefail

echo "==> Myatlastic mobile setup"
echo "==> Checking prerequisites..."

command -v node >/dev/null 2>&1 || { echo "ERROR: Node.js not installed. brew install node"; exit 1; }
command -v npx >/dev/null 2>&1 || { echo "ERROR: npx missing"; exit 1; }
command -v xcodebuild >/dev/null 2>&1 || { echo "WARNING: Xcode not detected (xcodebuild missing). You'll need it to build iOS."; }
command -v pod >/dev/null 2>&1 || { echo "WARNING: CocoaPods not installed. sudo gem install cocoapods (or: brew install cocoapods)"; }

NODE_MAJOR=$(node -v | sed 's/v//' | cut -d. -f1)
if [ "$NODE_MAJOR" -lt 18 ]; then
  echo "ERROR: Node.js 18+ required. Current: $(node -v)"
  exit 1
fi

echo "==> Installing Capacitor dependencies..."
cd mobile_setup
npm install

echo "==> Adding iOS platform..."
if [ ! -d ios ]; then
  npx cap add ios
else
  echo "  iOS platform already added — skipping"
fi

echo "==> Adding Android platform..."
if [ ! -d android ]; then
  npx cap add android
else
  echo "  Android platform already added — skipping"
fi

echo "==> Syncing web content into native projects..."
npx cap sync

echo ""
echo "==> Done."
echo ""
echo "Next steps:"
echo "  1. To open iOS project in Xcode:    cd mobile_setup && npx cap open ios"
echo "  2. To open Android project:         cd mobile_setup && npx cap open android"
echo ""
echo "  After any change to /web:"
echo "  3. Re-sync to mobile projects:      cd mobile_setup && npx cap sync"
echo ""
echo "Before submitting to App Store:"
echo "  - Bundle earth-blue-marble.jpg locally (see mobile_setup/README.md)"
echo "  - Replace localStorage paywall simulation with RevenueCat or native StoreKit"
echo "  - Set bundle identifier and version in Xcode (currently app.myatlastic.myatlastic)"
echo "  - Add Privacy Manifest"
