#!/usr/bin/env python3
"""Local preview server for the es-MX EDI tracking prototype export."""

from __future__ import annotations

import argparse
import http.server
import socketserver
import sys
import webbrowser
from pathlib import Path

DEFAULT_PORT = 5183
EXPORT_ROOT = Path(__file__).resolve().parent
PROTO_DIR = EXPORT_ROOT / "es-mx"


class NoCacheHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(PROTO_DIR), **kwargs)

    def end_headers(self) -> None:
        self.send_header("Cache-Control", "no-store")
        super().end_headers()


def main() -> int:
    parser = argparse.ArgumentParser(description="Serve the es-MX EDI prototype export.")
    parser.add_argument("--port", type=int, default=DEFAULT_PORT)
    parser.add_argument("--no-open", action="store_true")
    args = parser.parse_args()

    if not PROTO_DIR.is_dir():
        print(f"Missing build output: {PROTO_DIR}", file=sys.stderr)
        print("From web/V4-es-mx run: npm install && npm run build", file=sys.stderr)
        return 1

    url = f"http://127.0.0.1:{args.port}/"
    print(f"Serving {PROTO_DIR}")
    print(f"Open: {url}")
    print("Press Ctrl+C to stop.")

    if not args.no_open:
        webbrowser.open(url)

    with socketserver.TCPServer(("127.0.0.1", args.port), NoCacheHandler) as httpd:
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nStopped.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
