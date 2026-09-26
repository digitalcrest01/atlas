#!/usr/bin/env node
/* Local preview: serves the site and the same /api/voice the deployment uses.
   node serve.js   ->   http://127.0.0.1:8772/app/

   Keys stay on this machine: XAI_API_KEY in the environment or .env.local
   (git-ignored), else a signed-in grok CLI;
   AZURE_SPEECH_KEY + AZURE_SPEECH_REGION for the languages xAI does not speak.
   Without an Azure key, speech is fetched from the live site instead, so every
   language (Filipino, Swahili, Amharic...) sounds here as it does in production. */
const http = require('http');
const fs = require('fs');
const os = require('os');
const path = require('path');
const { handleVoice } = require('./api/_voice.js');

const ROOT = __dirname;
const HOST = '127.0.0.1';
const LIVE = 'https://www.myatlastic.com';
const PORT = Number(process.env.PORT || 8772);

// KEY=value lines from .env.local (git-ignored) fill in anything not already set.
function fileEnv() {
  const out = {};
  try {
    fs.readFileSync(path.join(ROOT, '.env.local'), 'utf8').split(/\r?\n/).forEach(line => {
      const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*?)\s*$/);
      if (m) out[m[1]] = m[2].replace(/^['"]|['"]$/g, '');
    });
  } catch (e) {}
  return out;
}

function localEnv() {
  const env = Object.assign(fileEnv(), process.env);
  if (!env.XAI_API_KEY) {
    try {
      const auth = JSON.parse(fs.readFileSync(path.join(os.homedir(), '.grok', 'auth.json'), 'utf8'));
      Object.values(auth || {}).some(rec => {
        if (rec && typeof rec === 'object' && rec.key) { env.XAI_API_KEY = rec.key; return true; }
        return false;
      });
    } catch (e) {}
  }
  return env;
}

const TYPES = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.json': 'application/json',
  '.css': 'text/css', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg',
  '.webp': 'image/webp', '.ico': 'image/x-icon', '.woff2': 'font/woff2', '.mp3': 'audio/mpeg', '.txt': 'text/plain'
};

function serveFile(req, res) {
  let rel = decodeURIComponent(new URL(req.url, 'http://local').pathname);
  // Same rewrites as vercel.json: /app shares the web build's voice data and vendor files.
  if (rel.indexOf('/app/voice/') === 0) rel = '/web/voice/' + rel.slice('/app/voice/'.length);
  if (rel.indexOf('/app/vendor/') === 0) rel = '/web/vendor/' + rel.slice('/app/vendor/'.length);
  let file = path.normalize(path.join(ROOT, rel));
  if (!file.startsWith(ROOT)) { res.statusCode = 403; res.end(); return; }
  if (fs.existsSync(file) && fs.statSync(file).isDirectory()) file = path.join(file, 'index.html');
  else if (!fs.existsSync(file) && fs.existsSync(file + '.html')) file += '.html';
  fs.readFile(file, (err, data) => {
    if (err) { res.statusCode = 404; res.end('Not found'); return; }
    res.setHeader('Content-Type', TYPES[path.extname(file).toLowerCase()] || 'application/octet-stream');
    res.setHeader('Cache-Control', 'no-store');
    res.end(data);
  });
}

// VOICE_FAKE=1: a stand-in voice for testing playback flow without spending
// credits. Each line becomes a quiet tone about as long as saying it would take.
function fakeVoice(req, res) {
  const q = new URL(req.url, 'http://local').searchParams;
  if (q.get('status')) {
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ providers: { xai: true, azure: true }, v: 1, fake: true }));
    return;
  }
  const text = q.get('text') || '';
  const seconds = Math.min(6, 0.4 + text.length / 40);
  const rate = 8000;
  const n = Math.round(seconds * rate);
  const b = Buffer.alloc(44 + n);
  b.write('RIFF', 0); b.writeUInt32LE(36 + n, 4); b.write('WAVE', 8); b.write('fmt ', 12);
  b.writeUInt32LE(16, 16); b.writeUInt16LE(1, 20); b.writeUInt16LE(1, 22); b.writeUInt32LE(rate, 24);
  b.writeUInt32LE(rate, 28); b.writeUInt16LE(1, 32); b.writeUInt16LE(8, 34); b.write('data', 36); b.writeUInt32LE(n, 40);
  for (let i = 0; i < n; i++) b[44 + i] = 128 + Math.round(6 * Math.sin(i / 8));
  res.setHeader('Content-Type', 'audio/wav');
  res.setHeader('Access-Control-Allow-Origin', '*');
  setTimeout(() => res.end(b), 150);
}

// Relay a voice request to the live site (no Origin header, so it is accepted).
function fromLive(req, res) {
  fetch(LIVE + req.url).then(async r => {
    res.statusCode = r.status;
    ['content-type', 'cache-control'].forEach(h => { if (r.headers.get(h)) res.setHeader(h, r.headers.get(h)); });
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.end(Buffer.from(await r.arrayBuffer()));
  }).catch(() => { res.statusCode = 502; res.end(); });
}

http.createServer((req, res) => {
  const route = new URL(req.url, 'http://local').pathname;
  if (route === '/api/voice' && process.env.VOICE_FAKE === '1') { fakeVoice(req, res); return; }
  if (route === '/api/voice' && !localEnv().AZURE_SPEECH_KEY) { fromLive(req, res); return; }
  if (route === '/api/voice') {
    handleVoice(req, res, localEnv()).catch(() => { if (!res.headersSent) { res.statusCode = 500; } res.end(); });
    return;
  }
  serveFile(req, res);
}).listen(PORT, HOST, () => {
  console.log('Myatlastic on http://' + HOST + ':' + PORT + '/app/');
});
