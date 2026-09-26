#!/usr/bin/env node
/* Tests for the voice endpoint and locale routing. No network: fetch is mocked.
   node scripts/test-voice.js */
const assert = require('assert');
const { EventEmitter } = require('events');
const path = require('path');
const V = require(path.join(__dirname, '..', 'api', '_voice.js'));
const L = require(path.join(__dirname, '..', 'web', 'voice', 'locales.js'));

let passed = 0;
const tests = [];
const test = (name, fn) => tests.push([name, fn]);

function call(url, opts) {
  const o = opts || {};
  const req = new EventEmitter();
  req.url = url;
  req.method = o.method || 'GET';
  req.headers = o.headers || {};
  req.socket = { remoteAddress: o.ip || '10.0.0.' + Math.floor(Math.random() * 250) };
  const chunks = [];
  const res = {
    statusCode: 200, headers: {}, writableEnded: false, headersSent: false,
    setHeader(k, v) { this.headers[k.toLowerCase()] = v; },
    write(c) { chunks.push(Buffer.from(c)); this.headersSent = true; },
    end(c) { if (c) chunks.push(Buffer.from(c)); this.writableEnded = true; }
  };
  return V.handleVoice(req, res, o.env || { XAI_API_KEY: 'x', AZURE_SPEECH_KEY: 'a', AZURE_SPEECH_REGION: 'westeurope' })
    .then(() => ({ status: res.statusCode, headers: res.headers, body: Buffer.concat(chunks) }));
}

function mockFetch(handler) {
  const calls = [];
  global.fetch = async (url, init) => {
    calls.push({ url: String(url), init: init });
    return handler(String(url), init);
  };
  return calls;
}

function audioResponse(bytes) {
  const body = new ReadableStream({ start(c) { c.enqueue(new Uint8Array(bytes)); c.close(); } });
  return new Response(body, { status: 200, headers: { 'Content-Type': 'audio/mpeg' } });
}

const q = (text, locale) => '/api/voice?v=1&locale=' + encodeURIComponent(locale) + '&text=' + encodeURIComponent(text);

// ---------- locale routing ----------
test('France speaks French, Brazil Brazilian Portuguese, Mexico Mexican Spanish', () => {
  assert.strictEqual(L.COUNTRY_LOCALES.France[0], 'fr-FR');
  assert.strictEqual(L.COUNTRY_LOCALES.Brazil[0], 'pt-BR');
  assert.strictEqual(L.COUNTRY_LOCALES.Mexico[0], 'es-MX');
  assert.strictEqual(L.COUNTRY_LOCALES.Thailand[0], 'th-TH');
  assert.strictEqual(L.COUNTRY_LOCALES['South Korea'][0], 'ko-KR');
});
test('multilingual countries offer every language', () => {
  assert.deepStrictEqual(L.COUNTRY_LOCALES.Switzerland, ['de-CH', 'fr-CH', 'it-CH']);
  assert.deepStrictEqual(L.languagesFor('Belgium').map(l => l.lang), ['nl', 'fr', 'de']);
});
test('script decides the book: Taiwan Traditional, Montenegro Latin', () => {
  assert.strictEqual(L.bookFor('zh-TW'), 'zh-Hant');
  assert.strictEqual(L.bookFor('zh-CN'), 'zh-Hans');
  assert.strictEqual(L.bookFor('sr-Latn-ME'), 'sr-Latn');
  assert.strictEqual(L.bookFor('es-AR'), 'es-419');
  assert.strictEqual(L.bookFor('pt-AO'), 'pt-PT');
});
test('xAI first where it speaks the language, Azure otherwise', () => {
  assert.deepStrictEqual(L.providersFor('ja-JP', { xai: true, azure: true }), ['xai', 'azure']);
  assert.deepStrictEqual(L.providersFor('th-TH', { xai: true, azure: true }), ['azure']);
  assert.deepStrictEqual(L.providersFor('th-TH', { xai: true, azure: false }), []);
  assert.strictEqual(L.voicesFor('es-AR').xai, 'es-MX');
  assert.strictEqual(L.voicesFor('ar-EG').xai, 'ar-EG');
});
test('narration languages: English plus local, extra for multilingual countries', () => {
  assert.deepStrictEqual(L.narrationBooks('Japan'), ['en', 'ja']);
  assert.deepStrictEqual(L.narrationBooks('Switzerland'), ['en', 'de', 'fr', 'it']);
  assert.deepStrictEqual(L.narrationBooks('United Kingdom'), ['en']);
  assert.deepStrictEqual(L.narrationBooks('Canada'), ['en', 'fr']);
});

// ---------- input handling ----------
test('provider tags and markup are stripped', () => {
  assert.strictEqual(V.cleanText('Hi [laugh] <whisper>there</whisper>'), 'Hi there');
  assert.strictEqual(V.cleanLocale('fr-FR'), 'fr-FR');
  assert.strictEqual(V.cleanLocale('sr-Latn-ME'), 'sr-Latn-ME');
  assert.strictEqual(V.cleanLocale('fr"><script>'), '');
});
test('origins: site, app and localhost allowed; others refused', () => {
  const env = {};
  assert.ok(V.allowedOrigin('https://myatlastic.com', env));
  assert.ok(V.allowedOrigin('capacitor://localhost', env));
  assert.ok(V.allowedOrigin('http://127.0.0.1:8772', env));
  assert.ok(V.allowedOrigin('', env));
  assert.ok(!V.allowedOrigin('https://evil.example', env));
  assert.ok(V.allowedOrigin('https://preview.example', { VOICE_ALLOWED_ORIGINS: 'https://preview.example' }));
});

// ---------- endpoint ----------
test('status reports configured providers without spending anything', async () => {
  const calls = mockFetch(() => { throw new Error('no network'); });
  const r = await call('/api/voice?status=1', { env: { XAI_API_KEY: 'x' } });
  assert.strictEqual(r.status, 200);
  assert.deepStrictEqual(JSON.parse(r.body).providers, { xai: true, azure: false });
  assert.strictEqual(calls.length, 0);
});
test('missing text or locale is a 400', async () => {
  mockFetch(() => audioResponse([1]));
  assert.strictEqual((await call('/api/voice?locale=fr-FR')).status, 400);
  assert.strictEqual((await call('/api/voice?text=hi')).status, 400);
});
test('foreign origin is refused before any provider call', async () => {
  const calls = mockFetch(() => audioResponse([1]));
  const r = await call(q('Bonjour', 'fr-FR'), { headers: { origin: 'https://evil.example' } });
  assert.strictEqual(r.status, 403);
  assert.strictEqual(calls.length, 0);
});
test('a language no configured provider speaks is a 422, not a robotic fallback', async () => {
  const calls = mockFetch(() => audioResponse([1]));
  const r = await call(q('สวัสดี', 'th-TH'), { env: { XAI_API_KEY: 'x' } });
  assert.strictEqual(r.status, 422);
  assert.strictEqual(calls.length, 0);
});
test('no keys at all is a 503', async () => {
  mockFetch(() => audioResponse([1]));
  assert.strictEqual((await call(q('Hello', 'en-US'), { env: {} })).status, 503);
});
test('French goes to xAI with the right language and streams audio, cacheable', async () => {
  const calls = mockFetch(() => audioResponse([9, 8, 7]));
  const r = await call(q('Bonjour', 'fr-FR'));
  assert.strictEqual(r.status, 200);
  assert.strictEqual(r.headers['content-type'], 'audio/mpeg');
  assert.ok(/immutable/.test(r.headers['cache-control']));
  assert.deepStrictEqual([...r.body], [9, 8, 7]);
  assert.ok(calls[0].url.indexOf('api.x.ai/v1/tts') !== -1);
  const body = JSON.parse(calls[0].init.body);
  assert.strictEqual(body.language, 'fr');
  assert.strictEqual(body.text, 'Bonjour');
  assert.strictEqual(calls[0].init.headers.Authorization, 'Bearer x');
});
test('Thai goes to Azure with a Thai neural voice in SSML', async () => {
  const calls = mockFetch(() => audioResponse([1]));
  const r = await call(q('สวัสดีค่ะ', 'th-TH'));
  assert.strictEqual(r.status, 200);
  assert.ok(calls[0].url.indexOf('westeurope.tts.speech.microsoft.com') !== -1);
  assert.ok(/<voice name="th-TH-PremwadeeNeural">สวัสดีค่ะ<\/voice>/.test(calls[0].init.body));
  assert.ok(/xml:lang="th-TH"/.test(calls[0].init.body));
});
test('if xAI fails, the same line is tried on Azure', async () => {
  const calls = mockFetch((url) => (url.indexOf('x.ai') !== -1 ? new Response('no', { status: 403 }) : audioResponse([5])));
  const errors = console.error; console.error = () => {};
  const r = await call(q('Hola', 'es-MX'));
  console.error = errors;
  assert.strictEqual(r.status, 200);
  assert.strictEqual(calls.length, 2);
  assert.ok(/es-MX-DaliaNeural/.test(calls[1].init.body));
});
test('when every provider fails the client gets a 502', async () => {
  mockFetch(() => new Response('no', { status: 500 }));
  const errors = console.error; console.error = () => {};
  const r = await call(q('Ciao', 'it-IT'));
  console.error = errors;
  assert.strictEqual(r.status, 502);
});
test('SSML special characters are escaped', async () => {
  const calls = mockFetch(() => audioResponse([1]));
  await call(q('Tom & Jerry', 'nl-NL'));
  assert.ok(/Tom &amp; Jerry/.test(calls[0].init.body));
});

(async () => {
  for (const [name, fn] of tests) {
    try { await fn(); passed++; console.log('ok   ' + name); }
    catch (e) { console.log('FAIL ' + name + '\n     ' + e.message); process.exitCode = 1; }
  }
  console.log(passed + '/' + tests.length + ' passed');
})();
