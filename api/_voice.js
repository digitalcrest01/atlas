/* Neural speech for every spoken line in Myatlastic.

   GET /api/voice?text=...&locale=fr-FR&v=1   -> audio/mpeg, streamed
   GET /api/voice?status=1                    -> which providers are configured

   Keys never leave the server. The locale decides the provider and voice
   (web/voice/locales.js). Responses are deterministic, so the CDN and the
   browser cache them for a year; the same phrase is generated once. */
const Locales = require('../web/voice/locales.js');

const MAX_CHARS = 520;
const WINDOW_MS = 10 * 60 * 1000;
const WINDOW_LIMIT = 240;
const hits = new Map();

function keys(env) {
  return {
    xai: String(env.XAI_API_KEY || '').trim(),
    azureKey: String(env.AZURE_SPEECH_KEY || '').trim(),
    azureRegion: String(env.AZURE_SPEECH_REGION || '').trim()
  };
}

function configured(k) {
  return { xai: !!k.xai, azure: !!(k.azureKey && k.azureRegion) };
}

function allowedOrigin(origin, env) {
  if (!origin) return true;
  const list = [
    'https://myatlastic.com',
    'https://www.myatlastic.com',
    'capacitor://localhost',
    'ionic://localhost',
    'https://localhost',
    'http://localhost'
  ];
  if (env.VERCEL_URL) list.push('https://' + env.VERCEL_URL);
  if (env.VERCEL_BRANCH_URL) list.push('https://' + env.VERCEL_BRANCH_URL);
  String(env.VOICE_ALLOWED_ORIGINS || '').split(',').map(s => s.trim()).filter(Boolean).forEach(o => list.push(o));
  if (list.indexOf(origin) !== -1) return true;
  return /^http:\/\/(localhost|127\.0\.0\.1|\[::1\])(:\d+)?$/.test(origin);
}

function limited(ip) {
  const now = Date.now();
  const rec = hits.get(ip);
  if (!rec || rec.reset < now) {
    hits.set(ip, { count: 1, reset: now + WINDOW_MS });
    if (hits.size > 5000) hits.clear();
    return false;
  }
  rec.count++;
  return rec.count > WINDOW_LIMIT;
}

// Plain text only: provider speech tags and markup are not ours to pass on.
function cleanText(raw) {
  return String(raw || '')
    .replace(/[\u0000-\u001F\u007F]/g, ' ')
    .replace(/<[^>]*>/g, ' ')
    .replace(/\[[^\]]*\]/g, ' ')
    .replace(/\s{2,}/g, ' ')
    .trim();
}

function cleanLocale(raw) {
  const tag = String(raw || '').trim();
  return /^[A-Za-z]{2,3}(-[A-Za-z0-9]{2,8}){0,2}$/.test(tag) ? tag : '';
}

function escapeXml(s) {
  return s.replace(/[<>&'"]/g, c => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', "'": '&apos;', '"': '&quot;' })[c]);
}

async function fromXai(text, voice, k, signal) {
  return fetch('https://api.x.ai/v1/tts', {
    method: 'POST',
    signal: signal,
    headers: { Authorization: 'Bearer ' + k.xai, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      text: text,
      voice_id: 'eve',
      language: voice.xai,
      text_normalization: true,
      optimize_streaming_latency: 1,
      output_format: { codec: 'mp3', sample_rate: 24000, bit_rate: 64000 }
    })
  });
}

async function fromAzure(text, voice, k, signal) {
  const name = voice.azure;
  const lang = name.split('-').slice(0, name.split('-').length - 1).join('-');
  const ssml = '<speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xml:lang="' + lang + '">' +
    '<voice name="' + name + '">' + escapeXml(text) + '</voice></speak>';
  return fetch('https://' + encodeURIComponent(k.azureRegion) + '.tts.speech.microsoft.com/cognitiveservices/v1', {
    method: 'POST',
    signal: signal,
    headers: {
      'Ocp-Apim-Subscription-Key': k.azureKey,
      'Content-Type': 'application/ssml+xml',
      'X-Microsoft-OutputFormat': 'audio-24khz-48kbitrate-mono-mp3',
      'User-Agent': 'myatlastic-voice'
    },
    body: ssml
  });
}

function send(res, status, headers, body) {
  res.statusCode = status;
  Object.keys(headers).forEach(h => res.setHeader(h, headers[h]));
  res.end(body);
}

function sendJson(res, status, payload, extra) {
  send(res, status, Object.assign({
    'Content-Type': 'application/json',
    'Cache-Control': 'no-store'
  }, extra || {}), JSON.stringify(payload));
}

async function handleVoice(req, res, env) {
  const url = new URL(req.url, 'http://local');
  const q = url.searchParams;
  const origin = req.headers.origin || '';
  const cors = { 'Access-Control-Allow-Origin': '*' };
  const k = keys(env || process.env);

  if (req.method === 'OPTIONS') {
    send(res, 204, Object.assign({ 'Access-Control-Allow-Methods': 'GET', 'Access-Control-Max-Age': '86400' }, cors), '');
    return;
  }
  if (req.method !== 'GET') { sendJson(res, 405, { error: 'method' }, cors); return; }

  if (q.get('status')) {
    sendJson(res, 200, { providers: configured(k), v: 1 }, Object.assign({ 'Cache-Control': 'public, max-age=300' }, cors));
    return;
  }

  if (!allowedOrigin(origin, env || process.env)) { sendJson(res, 403, { error: 'origin' }); return; }

  const text = cleanText(q.get('text')).slice(0, MAX_CHARS);
  const locale = cleanLocale(q.get('locale'));
  if (!text || !locale) { sendJson(res, 400, { error: 'text and locale are required' }, cors); return; }

  const voice = Locales.voicesFor(locale);
  const order = Locales.providersFor(locale, configured(k));
  if (!voice || !order.length) {
    const none = !configured(k).xai && !configured(k).azure;
    sendJson(res, none ? 503 : 422, { error: none ? 'voice is not configured' : 'no voice for this language', locale: locale }, cors);
    return;
  }

  const ip = String(req.headers['x-forwarded-for'] || (req.socket && req.socket.remoteAddress) || '').split(',')[0].trim();
  if (limited(ip)) { sendJson(res, 429, { error: 'slow down' }, cors); return; }

  const ctrl = new AbortController();
  const onClose = () => { if (!res.writableEnded) ctrl.abort(); };
  req.on('close', onClose);

  let upstream = null;
  for (let i = 0; i < order.length && !upstream; i++) {
    try {
      const r = order[i] === 'xai' ? await fromXai(text, voice, k, ctrl.signal) : await fromAzure(text, voice, k, ctrl.signal);
      if (r.ok && r.body) upstream = r;
      else {
        // Status only: never log the text or a key.
        console.error('voice: ' + order[i] + ' answered ' + r.status + ' for ' + locale);
        if (r.body) await r.body.cancel().catch(() => {});
      }
    } catch (e) {
      if (ctrl.signal.aborted) return;
    }
  }
  if (!upstream) { sendJson(res, 502, { error: 'voice failed' }, cors); return; }

  res.statusCode = 200;
  res.setHeader('Content-Type', 'audio/mpeg');
  res.setHeader('Cache-Control', 'public, max-age=31536000, s-maxage=31536000, immutable');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  try {
    for await (const chunk of upstream.body) {
      if (ctrl.signal.aborted) break;
      res.write(chunk);
    }
  } catch (e) {
    // Client went away mid-stream; nothing to report.
  }
  res.end();
}

module.exports = { handleVoice, cleanText, cleanLocale, allowedOrigin, configured, keys };
