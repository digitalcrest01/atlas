#!/usr/bin/env node
/* Checks the phrasebooks and country narrations against their contracts.
   node scripts/check-voice-data.js            -> everything
   node scripts/check-voice-data.js france th  -> just those narration slugs / books */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const WEB = path.join(ROOT, 'web');
const L = require(path.join(WEB, 'voice', 'locales.js'));
const P = require(path.join(WEB, 'voice', 'phrases.js'));

function roster() {
  const html = fs.readFileSync(path.join(WEB, 'index.html'), 'utf8');
  const a = html.indexOf('const COUNTRIES = [');
  const b = html.indexOf('\n];', a);
  const names = [];
  const re = /^\s*\{n:"([^"]+)"/gm; // top-level entries only, not nested states
  const src = html.slice(a, b);
  let m;
  while ((m = re.exec(src))) names.push(m[1]);
  return names;
}

const only = process.argv.slice(2);
const want = (key) => !only.length || only.indexOf(key) !== -1;
const errors = [];
const warn = [];
const fail = (where, msg) => errors.push(where + ': ' + msg);

const NON_LATIN = /[^\u0000-ɏḀ-ỿ -⁯ -ÿ'’‘“”«»¿¡…–—·]/;
const words = (s) => String(s || '').trim().split(/\s+/).filter(Boolean).length;

// ---------- phrasebooks ----------
const books = new Set();
Object.keys(L.COUNTRY_LOCALES).forEach((n) => L.COUNTRY_LOCALES[n].forEach((loc) => {
  const b = L.bookFor(loc);
  if (b !== 'en') books.add(b);
}));
books.forEach((book) => {
  if (!want(book)) return;
  const file = path.join(WEB, 'voice', 'phrasebook', book + '.json');
  if (!fs.existsSync(file)) { fail('phrasebook/' + book, 'missing file'); return; }
  let data;
  try { data = JSON.parse(fs.readFileSync(file, 'utf8')); } catch (e) { fail('phrasebook/' + book, 'bad JSON ' + e.message); return; }
  if (data.book !== book) fail('phrasebook/' + book, 'book field is ' + data.book);
  const latin = P.LATIN_BOOKS.indexOf(book) !== -1;
  const phrases = data.phrases || {};
  P.PHRASES.forEach((p) => {
    const e = phrases[p.id];
    const where = 'phrasebook/' + book + '#' + p.id;
    if (!e) { fail(where, 'missing'); return; }
    if (!e.text || !String(e.text).trim()) fail(where, 'empty text');
    if (!e.say || !String(e.say).trim()) fail(where, 'missing say (English-reader pronunciation)');
    if (!latin && (!e.roman || !String(e.roman).trim())) fail(where, 'missing roman');
    if (!latin && e.text && !NON_LATIN.test(e.text)) fail(where, 'text looks romanized; use the native script');
    if (String(e.text || '').length > 120) fail(where, 'text too long');
  });
  Object.keys(phrases).forEach((id) => {
    if (!P.PHRASES.find((p) => p.id === id)) fail('phrasebook/' + book, 'unknown id ' + id);
  });
});

// ---------- narrations ----------
const names = roster();
const nameSet = new Set(names);
names.forEach((country) => {
  const slug = L.slugOf(country);
  if (!want(slug)) return;
  const where = 'narration/' + slug;
  const file = path.join(WEB, 'voice', 'narration', slug + '.json');
  if (!fs.existsSync(file)) { fail(where, 'missing file'); return; }
  let data;
  try { data = JSON.parse(fs.readFileSync(file, 'utf8')); } catch (e) { fail(where, 'bad JSON ' + e.message); return; }
  if (data.country !== country) fail(where, 'country field is ' + JSON.stringify(data.country));
  const expect = L.narrationBooks(country);
  const langs = data.languages || [];
  if (JSON.stringify(langs) !== JSON.stringify(expect)) fail(where, 'languages ' + JSON.stringify(langs) + ' should be ' + JSON.stringify(expect));
  const segs = data.segments || [];
  if (segs.length < 10 || segs.length > 18) fail(where, segs.length + ' segments (want 10-18)');
  let enWords = 0;
  segs.forEach((s, i) => {
    expect.forEach((b) => {
      const t = s && s[b];
      if (!t || !String(t).trim()) { fail(where, 'segment ' + i + ' missing ' + b); return; }
      const max = b === 'en' ? 380 : 480;
      if (String(t).length > max) fail(where, 'segment ' + i + ' ' + b + ' is ' + String(t).length + ' chars (max ' + max + ')');
      if (/[*#_`<>\[\]]|https?:/.test(t)) fail(where, 'segment ' + i + ' ' + b + ' has markup');
      if (/myatlastic/i.test(t)) fail(where, 'segment ' + i + ' mentions the app');
    });
    Object.keys(s || {}).forEach((k) => { if (k !== 'img' && expect.indexOf(k) === -1) fail(where, 'segment ' + i + ' has extra key ' + k); });
    if (s && s.img !== undefined) {
      if (!/\.jpe?g$/i.test(String(s.img))) fail(where, 'segment ' + i + ' img must be a .jpg Commons file');
      if (segs.some((o, k) => k !== i && o && o.img === s.img)) fail(where, 'segment ' + i + ' repeats photo ' + s.img);
    }
    enWords += words(s && s.en);
  });
  if (enWords < 290 || enWords > 460) fail(where, 'English is ' + enWords + ' words (want 300-450)');
  const next = data.next || [];
  if (next.length < 2 || next.length > 4) fail(where, 'next should list 2-4 countries');
  next.forEach((n) => {
    if (!nameSet.has(n)) fail(where, 'next country not in roster: ' + n);
    if (n === country) fail(where, 'next lists itself');
  });
  if (segs.length && next.length) {
    const last = String(segs[segs.length - 1].en || '');
    if (!next.some((n) => last.indexOf(n) !== -1)) warn.push(where + ': closing line does not name a next country');
  }
});

warn.forEach((w) => console.warn('warn  ' + w));
errors.forEach((e) => console.error('error ' + e));
console.log(errors.length ? errors.length + ' problem(s)' : 'voice data OK');
process.exit(errors.length ? 1 : 0);
