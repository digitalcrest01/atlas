#!/bin/sh

# Xcode Cloud post-clone — Capacitor app. Pods/ and the generated *.xcconfig are
# gitignored, so Cloud must install JS deps and run pod install itself, or the
# build fails: "Unable to open … Pods-App.release.xcconfig".

set -e
set -x
echo "▶ ci_post_clone: preparing the Capacitor iOS build"

# Xcode Cloud images don't ship Node or CocoaPods — install via Homebrew if missing.
command -v node >/dev/null 2>&1 || HOMEBREW_NO_AUTO_UPDATE=1 brew install node
command -v pod  >/dev/null 2>&1 || HOMEBREW_NO_AUTO_UPDATE=1 brew install cocoapods

cd "$CI_PRIMARY_REPOSITORY_PATH/mobile_setup"
npm ci
npx cap sync ios

echo "✓ ci_post_clone: done — Pods installed, xcconfig generated"
