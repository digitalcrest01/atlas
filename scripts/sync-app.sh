#!/bin/sh
# /app on the website is a copy of the Capacitor web build (web/).
# Vercel serves it at /app (no trailing slash), so relative URLs would resolve
# from the site root; a <base href="/app/"> keeps them under /app/.
# Voice data and vendor files are not copied: vercel.json rewrites
# /app/voice/* and /app/vendor/* to /web/.
set -e
cd "$(dirname "$0")/.."
cp web/room-talk.js web/attractions.js web/puzzle-shapes.js app/
sed 's#^<head>$#<head>\
<base href="/app/" />#' web/index.html > app/index.html
grep -q '<base href="/app/" />' app/index.html || { echo "base tag not added" >&2; exit 1; }
echo "app/ matches web/ (plus <base href=\"/app/\">)"
