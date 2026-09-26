#!/usr/bin/env node
/* Download a small PNG of every country's flag into web/flags/<code>.png,
   for the globe (flag emoji do not draw on Windows and some Android phones).
   node scripts/fetch-flags.js
   Codes come from each country's flag emoji; images from flagcdn.com
   (public-domain flag artwork). */
const fs = require('fs');
const path = require('path');

const html = fs.readFileSync(path.join(__dirname, '..', 'web', 'index.html'), 'utf8');
const codes = new Set();
const re = /flag:\s*["']((?:\uD83C[\uDDE6-\uDDFF]){2})["']/g;
let m;
while ((m = re.exec(html))) {
  const cps = Array.from(m[1]).map(ch => ch.codePointAt(0) - 0x1F1E6 + 97);
  codes.add(String.fromCharCode(...cps));
}
const out = path.join(__dirname, '..', 'web', 'flags');
fs.mkdirSync(out, { recursive: true });

(async () => {
  let got = 0;
  for (const code of Array.from(codes).sort()) {
    const file = path.join(out, code + '.png');
    if (fs.existsSync(file)) { got++; continue; }
    const r = await fetch('https://flagcdn.com/w80/' + code + '.png');
    if (!r.ok) { console.error('no flag for ' + code + ' (' + r.status + ')'); continue; }
    fs.writeFileSync(file, Buffer.from(await r.arrayBuffer()));
    got++;
  }
  console.log(got + ' of ' + codes.size + ' flags in web/flags');
})();
