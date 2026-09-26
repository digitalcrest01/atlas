// Same-origin proxy so the tour can use Grok's voice without putting a key in the browser.
module.exports = async function handler(req, res) {
  const key = String(process.env.XAI_API_KEY || '').trim();
  if (req.method === 'GET') {
    res.status(key ? 200 : 503).json({ ok: !!key, voice: 'eve' });
    return;
  }
  if (req.method !== 'POST') {
    res.status(405).end();
    return;
  }
  if (!key) {
    res.status(503).json({ error: 'Grok voice is not configured' });
    return;
  }
  const text = String((req.body && req.body.text) || '').trim().slice(0, 4000);
  if (!text) {
    res.status(400).json({ error: 'empty' });
    return;
  }
  const allowed = new Set(['auto', 'en', 'fr', 'de', 'it', 'ja', 'ko', 'zh', 'hi', 'id', 'ru', 'tr', 'vi', 'bn', 'es-MX', 'es-ES', 'pt-BR', 'pt-PT', 'ar-SA', 'ar-EG', 'ar-AE']);
  const language = allowed.has(String((req.body && req.body.language) || 'auto')) ? String(req.body.language || 'auto') : 'auto';
  const upstream = await fetch('https://api.x.ai/v1/tts', {
    method: 'POST',
    headers: {
      Authorization: 'Bearer ' + key,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      text: text,
      voice_id: 'eve',
      language: language,
      speed: 1,
      text_normalization: true
    })
  });
  if (!upstream.ok) {
    res.status(502).json({ error: 'Grok voice failed' });
    return;
  }
  const buf = Buffer.from(await upstream.arrayBuffer());
  res.setHeader('Content-Type', upstream.headers.get('content-type') || 'audio/mpeg');
  res.setHeader('Cache-Control', 'no-store');
  res.send(buf);
};
