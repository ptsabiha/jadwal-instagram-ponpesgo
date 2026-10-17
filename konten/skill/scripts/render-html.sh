#!/bin/sh
# render-html.sh <halaman.html> <keluaran.png> [lebar=1080] [tinggi=1440] [query]
# Render halaman HTML lokal ke PNG dengan Chrome/Edge headless. Waktu virtual 15 dtk
# memberi kesempatan Google Fonts dan gambar dimuat. Contoh slide carousel:
#   sh render-html.sh carousel.html slide2.png 1080 1440 "s=k1"
H="$1"; O="$2"; W="${3:-1080}"; T="${4:-1440}"; Q="$5"
[ -f "$H" ] || { echo "Tidak ada: $H"; exit 1; }
for c in "/c/Program Files/Google/Chrome/Application/chrome.exe" \
         "/c/Program Files (x86)/Microsoft/Edge/Application/msedge.exe"; do
  [ -f "$c" ] && CH="$c" && break
done
mkdir -p "$(dirname "$O")"
URL="file:///$(cygpath -m "$(cd "$(dirname "$H")" && pwd)/$(basename "$H")")"
[ -n "$Q" ] && URL="$URL?$Q"
OUT="$(cygpath -w "$(cd "$(dirname "$O")" && pwd)/$(basename "$O")")"
if "$CH" --headless=new --hide-scrollbars --allow-file-access-from-files --force-device-scale-factor=1 \
  --window-size="$W,$T" --virtual-time-budget=15000 --screenshot="$OUT" "$URL" 2>&1 | grep -q "bytes written"; then
  echo "ok: $O"
else
  echo "GAGAL render $H"; exit 1
fi
