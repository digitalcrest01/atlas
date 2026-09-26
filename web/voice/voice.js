/* MyatlasticVoice — the one way anything in the app speaks.

   Callers hand over what to say and in which locale:
     MyatlasticVoice.play([{ text: 'Merci', locale: 'fr-FR' }], { onState })
   and never learn which provider made the sound. Speech comes from
   /api/voice (neural voices, keys server-side). There is no device-voice
   fallback: when neural speech is unavailable the caller is told, and
   shows that, rather than hearing a robotic voice.

   One clip plays at a time. Starting anything stops whatever was playing,
   so narrations, phrases and conversation lines never overlap. */
(function (root) {
  const VOICE_VERSION = '1';
  const MAX_CACHE = 48;
  const Locales = root.MyatlasticLocales;

  const isNative = () => !!(root.Capacitor && typeof root.Capacitor.isNativePlatform === 'function' && root.Capacitor.isNativePlatform());

  // Native builds have no server of their own: speech comes from the site.
  let apiBase = root.MYATLASTIC_VOICE_API || (isNative() ? 'https://myatlastic.com' : '');

  const audio = typeof Audio !== 'undefined' ? new Audio() : null;
  if (audio) audio.preload = 'auto';

  // iOS only lets an audio element play on its own (a tour starting after a
  // download, the next narration line) once a tap has played it. The first
  // tap anywhere plays 50 ms of silence to earn that.
  function silence() {
    const n = 400;
    const b = new Uint8Array(44 + n);
    const v = new DataView(b.buffer);
    const tag = (at, s) => { for (let i = 0; i < 4; i++) b[at + i] = s.charCodeAt(i); };
    tag(0, 'RIFF'); v.setUint32(4, 36 + n, true); tag(8, 'WAVE'); tag(12, 'fmt ');
    v.setUint32(16, 16, true); v.setUint16(20, 1, true); v.setUint16(22, 1, true);
    v.setUint32(24, 8000, true); v.setUint32(28, 8000, true); v.setUint16(32, 1, true); v.setUint16(34, 8, true);
    tag(36, 'data'); v.setUint32(40, n, true);
    b.fill(0x80, 44);
    return URL.createObjectURL(new Blob([b], { type: 'audio/wav' }));
  }
  let unlocked = false;
  function unlock() {
    if (unlocked || !audio || current) return;
    unlocked = true;
    audio.src = silence();
    const p = audio.play();
    if (p && p.catch) p.catch(() => { unlocked = false; });
  }
  if (audio && root.document) {
    ['touchend', 'click', 'keydown'].forEach(t => root.document.addEventListener(t, unlock, { capture: true, passive: true }));
  }

  const cache = new Map();      // url -> object URL (least recently used first)
  const inflight = new Map();   // url -> Promise<object URL>
  let providers = null;         // { xai, azure } once known
  let statusPromise = null;
  let current = null;           // the playback in progress
  let seq = 0;

  function englishLocale() {
    const nav = String((root.navigator && root.navigator.language) || 'en-US');
    return /^en-(GB|AU|IE|NZ|CA|IN|ZA|SG)/i.test(nav) ? nav.slice(0, 5) : 'en-US';
  }

  function status() {
    if (statusPromise) return statusPromise;
    statusPromise = fetch(apiBase + '/api/voice?status=1', { cache: 'no-cache' })
      .then(r => (r.ok ? r.json() : null))
      .then(j => { providers = (j && j.providers) || { xai: false, azure: false }; return providers; })
      .catch(() => { statusPromise = null; providers = null; return null; });
    return statusPromise;
  }

  // true / false once the server has said what it can voice; null before then.
  function canSpeak(locale) {
    if (!providers || !Locales) return null;
    return Locales.providersFor(locale, providers).length > 0;
  }

  function urlFor(text, locale) {
    return apiBase + '/api/voice?v=' + VOICE_VERSION +
      '&locale=' + encodeURIComponent(locale) +
      '&text=' + encodeURIComponent(String(text || '').trim());
  }

  function remember(url, objUrl) {
    cache.delete(url);
    cache.set(url, objUrl);
    while (cache.size > MAX_CACHE) {
      const oldest = cache.keys().next().value;
      URL.revokeObjectURL(cache.get(oldest));
      cache.delete(oldest);
    }
  }

  // Fetch a clip once, however many callers ask for it.
  function clip(url, signal) {
    if (cache.has(url)) {
      const hit = cache.get(url);
      remember(url, hit);
      return Promise.resolve(hit);
    }
    if (inflight.has(url)) return inflight.get(url);
    const job = fetch(url, { signal: signal }).then(r => {
      if (!r.ok) {
        const err = new Error('voice ' + r.status);
        err.status = r.status;
        throw err;
      }
      return r.blob();
    }).then(blob => {
      const objUrl = URL.createObjectURL(blob);
      remember(url, objUrl);
      return objUrl;
    }).finally(() => inflight.delete(url));
    inflight.set(url, job);
    return job;
  }

  function normalise(parts) {
    const list = Array.isArray(parts) ? parts : [parts];
    return list.map(p => (typeof p === 'string' ? { text: p, locale: englishLocale() } : p))
      .map(p => ({ text: String((p && p.text) || '').replace(/\s+/g, ' ').trim(), locale: (p && p.locale) || englishLocale() }))
      .filter(p => p.text);
  }

  function emit(pb, state, extra) {
    pb.state = state;
    if (pb.onState) {
      try { pb.onState(state, Object.assign({ index: pb.index, total: pb.parts.length }, extra || {})); } catch (e) {}
    }
  }

  function detach() {
    if (!audio) return;
    audio.onended = null;
    audio.onerror = null;
    audio.onplaying = null;
    try { audio.pause(); } catch (e) {}
    audio.removeAttribute('src');
    try { audio.load(); } catch (e) {}
  }

  function finish(pb, state, extra) {
    if (pb.done) return;
    pb.done = true;
    if (pb.ctrl) pb.ctrl.abort();
    if (current === pb) { current = null; detach(); }
    emit(pb, state, extra);
    pb.resolve(state);
  }

  function playPart(pb) {
    if (pb.done || current !== pb) return;
    if (pb.index >= pb.parts.length) { finish(pb, 'ended'); return; }
    const part = pb.parts[pb.index];
    if (canSpeak(part.locale) === false) { finish(pb, 'error', { reason: 'unsupported', locale: part.locale }); return; }
    const url = urlFor(part.text, part.locale);
    const next = pb.parts[pb.index + 1];
    if (pb.onPart) { try { pb.onPart(pb.index, part); } catch (e) {} }
    emit(pb, 'loading');

    const start = (src) => {
      if (pb.done || current !== pb) return;
      audio.onplaying = () => {
        if (current !== pb) return;
        emit(pb, 'playing');
        // Warm the next line while this one plays, so there is no gap.
        if (next && canSpeak(next.locale) !== false) clip(urlFor(next.text, next.locale), pb.ctrl.signal).catch(() => {});
      };
      audio.onended = () => { if (current === pb) { pb.index++; playPart(pb); } };
      audio.onerror = () => { if (current === pb) finish(pb, 'error', { reason: 'network' }); };
      audio.src = src;
      const p = audio.play();
      if (p && p.catch) p.catch(err => {
        if (current !== pb) return;
        finish(pb, 'error', { reason: err && err.name === 'NotAllowedError' ? 'blocked' : 'network' });
      });
    };

    if (cache.has(url)) { start(cache.get(url)); return; }
    if (pb.index === 0 && !inflight.has(url)) {
      // First line: stream straight from the network for the quickest start.
      start(url);
      return;
    }
    clip(url, pb.ctrl.signal).then(start, err => {
      if (pb.done || (err && err.name === 'AbortError')) return;
      finish(pb, 'error', { reason: err && err.status === 422 ? 'unsupported' : 'network', locale: part.locale });
    });
  }

  /* Speak parts in order. Resolves 'ended' | 'stopped' | 'error'.
     opts.onState(state, info): loading | playing | paused | ended | stopped | error
     opts.onPart(index, part): a new part is starting (captions follow this). */
  function play(parts, opts) {
    const o = opts || {};
    stop();
    const list = normalise(parts);
    return new Promise(resolve => {
      const pb = {
        id: ++seq, parts: list, index: o.startAt || 0, state: 'idle', done: false,
        onState: o.onState, onPart: o.onPart, owner: o.owner || null,
        ctrl: new AbortController(), resolve: resolve
      };
      if (!audio || !list.length) { resolve('ended'); return; }
      current = pb;
      playPart(pb);
    });
  }

  function stop() {
    if (current) finish(current, 'stopped');
  }

  function pause() {
    if (!current || current.state !== 'playing') return;
    try { audio.pause(); } catch (e) {}
    emit(current, 'paused');
  }

  function resume() {
    if (!current || current.state !== 'paused') return;
    const pb = current;
    const p = audio.play();
    emit(pb, 'playing');
    if (p && p.catch) p.catch(() => finish(pb, 'error', { reason: 'blocked' }));
  }

  function prefetch(parts) {
    normalise(parts).slice(0, 4).forEach(p => {
      if (canSpeak(p.locale) === false) return;
      clip(urlFor(p.text, p.locale)).catch(() => {});
    });
  }

  function playing(owner) {
    if (!current) return false;
    return owner ? current.owner === owner : true;
  }

  root.MyatlasticVoice = {
    configure(opts) { if (opts && typeof opts.apiBase === 'string') { apiBase = opts.apiBase; statusPromise = null; providers = null; } },
    status: status,
    canSpeak: canSpeak,
    play: play,
    stop: stop,
    pause: pause,
    resume: resume,
    prefetch: prefetch,
    playing: playing,
    owner() { return current ? current.owner : null; },
    englishLocale: englishLocale
  };

  status();
})(typeof window !== 'undefined' ? window : this);
