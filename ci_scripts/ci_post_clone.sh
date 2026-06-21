#!/bin/sh

# Xcode Cloud custom build script — runs after the repo is cloned, before the build.
# This is a Capacitor app: the Pods/ folder and the generated *.xcconfig files are
# gitignored, so Xcode Cloud must install JS deps and run `pod install` itself.
# Without this, the build fails with: "Unable to open base configuration reference
# file … Pods-App.release.xcconfig".

set -e
echo "▶ ci_post_clone: preparing the Capacitor iOS build"

# Xcode Cloud images don't ship Node or CocoaPods — install via Homebrew if missing.
if ! command -v node >/dev/null 2>&1; then
  echo "  installing Node…"
  HOMEBREW_NO_AUTO_UPDATE=1 brew install node
fi
if ! command -v pod >/dev/null 2>&1; then
  echo "  installing CocoaPods…"
  HOMEBREW_NO_AUTO_UPDATE=1 brew install cocoapods
fi

# Install JS deps, copy web/ into the iOS app, and run pod install (cap sync does both).
cd "$CI_PRIMARY_REPOSITORY_PATH/mobile_setup"
echo "  npm ci…"
npm ci
echo "  npx cap sync ios… (copies web assets + pod install)"
npx cap sync ios

echo "✓ ci_post_clone: done — Pods installed, xcconfig generated"
