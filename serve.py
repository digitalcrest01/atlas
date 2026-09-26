#!/usr/bin/env python3
"""Serve the site and speak tour lines with Grok's voice.

The key stays on this machine. Set XAI_API_KEY, or sign in with the grok CLI.
"""
import json
import os
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from urllib import request as urlrequest
from urllib.error import HTTPError, URLError

HOST = "127.0.0.1"
PORT = int(os.environ.get("PORT", "8772"))


def xai_key():
    env = os.environ.get("XAI_API_KEY", "").strip()
    if env:
        return env
    path = os.path.expanduser("~/.grok/auth.json")
    try:
        with open(path, encoding="utf-8") as handle:
            data = json.load(handle)
    except (OSError, ValueError):
        return ""
    if isinstance(data, dict):
        for rec in data.values():
            if isinstance(rec, dict) and rec.get("key"):
                return rec["key"]
    return ""


class Handler(SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header("Cache-Control", "no-store")
        super().end_headers()

    def do_GET(self):
        if self.path.split("?", 1)[0] == "/api/grok-voice":
            self._voice_status()
            return
        super().do_GET()

    def do_POST(self):
        if self.path.split("?", 1)[0] != "/api/grok-voice":
            self.send_error(404)
            return
        if self.client_address[0] not in ("127.0.0.1", "::1"):
            self.send_error(403)
            return
        key = xai_key()
        if not key:
            self._json(503, {"error": "Grok voice is not configured"})
            return
        length = int(self.headers.get("Content-Length", "0") or "0")
        raw = self.rfile.read(min(length, 20000)) if length else b""
        try:
            body = json.loads(raw.decode("utf-8") or "{}")
        except ValueError:
            self._json(400, {"error": "bad json"})
            return
        text = str(body.get("text") or "").strip()[:4000]
        if not text:
            self._json(400, {"error": "empty"})
            return
        language = str(body.get("language") or "auto").strip()
        allowed = {
            "auto", "en", "fr", "de", "it", "ja", "ko", "zh", "hi", "id", "ru", "tr", "vi", "bn",
            "es-MX", "es-ES", "pt-BR", "pt-PT", "ar-SA", "ar-EG", "ar-AE",
        }
        if language not in allowed:
            language = "auto"
        payload = json.dumps({
            "text": text,
            "voice_id": "eve",
            "language": language,
            "speed": 1,
            "text_normalization": True,
        }).encode("utf-8")
        req = urlrequest.Request(
            "https://api.x.ai/v1/tts",
            data=payload,
            headers={
                "Authorization": "Bearer " + key,
                "Content-Type": "application/json",
            },
            method="POST",
        )
        try:
            with urlrequest.urlopen(req, timeout=60) as upstream:
                audio = upstream.read()
                mime = upstream.headers.get("Content-Type", "audio/mpeg")
        except HTTPError as err:
            if err.code == 403:
                self._json(402, {"error": "credits"})
            else:
                self._json(502, {"error": "Grok voice failed"})
            return
        except URLError:
            self._json(502, {"error": "Grok voice failed"})
            return
        self.send_response(200)
        self.send_header("Content-Type", mime.split(";")[0] or "audio/mpeg")
        self.send_header("Content-Length", str(len(audio)))
        self.end_headers()
        self.wfile.write(audio)

    def _voice_status(self):
        self._json(200 if xai_key() else 503, {"ok": bool(xai_key()), "voice": "eve"})

    def _json(self, status, payload):
        raw = json.dumps(payload).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json")
        self.send_header("Content-Length", str(len(raw)))
        self.end_headers()
        self.wfile.write(raw)


if __name__ == "__main__":
    server = ThreadingHTTPServer((HOST, PORT), Handler)
    print(f"Myatlastic on http://{HOST}:{PORT}/web/")
    server.serve_forever()
