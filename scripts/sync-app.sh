#!/bin/sh
# /app on the website is a copy of the Capacitor web build (web/).
# Voice data is not copied: vercel.json rewrites /app/voice/* to /web/voice/*.
set -e
cd "$(dirname "$0")/.."
cp web/index.html web/room-talk.js web/attractions.js web/puzzle-shapes.js app/
echo "app/ matches web/"
