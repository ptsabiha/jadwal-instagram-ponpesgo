#!/bin/sh
# render.sh <halaman.html> <keluaran.png> [lebar=1080] [tinggi=1440] [query]
# Versi Linux (routine cloud) dari scripts/render-html.sh. Memakai Chromium/Chrome yang ada,
# atau mengunduh chrome-headless-shell ke /tmp/chrome bila belum ada.
H="$1"; O="$2"; W="${3:-1080}"; T="${4:-1440}"; Q="$5"
[ -f "$H" ] || { echo "Tidak ada: $H"; exit 1; }
CH="${CHROME:-$(command -v chromium || command -v chromium-browser || command -v google-chrome || command -v google-chrome-stable)}"
if [ -z "$CH" ]; then
  CH="$(find /tmp/chrome -type f -name chrome-headless-shell 2>/dev/null | head -1)"
  if [ -z "$CH" ]; then
    npx -y @puppeteer/browsers install chrome-headless-shell@stable --path /tmp/chrome >/dev/null 2>&1
    CH="$(find /tmp/chrome -type f -name chrome-headless-shell 2>/dev/null | head -1)"
  fi
fi
[ -n "$CH" ] || { echo "GAGAL: Chrome tidak tersedia"; exit 1; }
URL="file://$(cd "$(dirname "$H")" && pwd)/$(basename "$H")"
[ -n "$Q" ] && URL="$URL?$Q"
mkdir -p "$(dirname "$O")"
OUT="$(cd "$(dirname "$O")" && pwd)/$(basename "$O")"
rm -f "$OUT"
"$CH" --headless --no-sandbox --disable-gpu --hide-scrollbars --allow-file-access-from-files \
  --force-device-scale-factor=1 --window-size="$W,$T" --virtual-time-budget=15000 \
  --screenshot="$OUT" "$URL" >/tmp/render.log 2>&1
if [ -s "$OUT" ]; then echo "ok: $O"; else echo "GAGAL render $H"; tail -5 /tmp/render.log; exit 1; fi
