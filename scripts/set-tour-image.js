#!/usr/bin/env node
/* Set (or clear) the photo for one narration line, touching nothing else.
   node scripts/set-tour-image.js thailand 3 "Wat_Arun_Bangkok.jpg"
   node scripts/set-tour-image.js thailand 3 --clear */
const fs = require('fs');
const path = require('path');
const [slug, index, file] = process.argv.slice(2);
const p = path.join(__dirname, '..', 'web', 'voice', 'narration', slug + '.json');
const data = JSON.parse(fs.readFileSync(p, 'utf8'));
const i = Number(index);
if (!Number.isInteger(i) || !data.segments[i]) { console.error('no segment ' + index + ' in ' + slug); process.exit(1); }
if (file === '--clear') delete data.segments[i].img;
else {
  if (!/\.jpe?g$/i.test(file || '')) { console.error('photo must be a .jpg/.jpeg Commons file name'); process.exit(1); }
  const dup = data.segments.findIndex((s, k) => k !== i && s.img === file);
  if (dup !== -1) { console.error('already used on line ' + dup + '; pick a different photo'); process.exit(1); }
  data.segments[i].img = file;
}
fs.writeFileSync(p, JSON.stringify(data, null, 2) + '\n');
console.log(slug + ' line ' + i + ': ' + (data.segments[i].img || '(no photo)'));
