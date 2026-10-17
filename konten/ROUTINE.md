# Routine Otomatis PonpesGo (cloud) · Berita per slot, langsung tayang

Routine cloud Claude ini berjalan **3 kali sehari, 1 jam sebelum setiap slot tayang**:
06.00 → tayang 07.00, 12.00 → tayang 13.00, 18.00 → tayang 19.00 WIB. Ia jalan walaupun
laptop pemilik mati.

**Aturan pemilik (17 Okt 2026):** "otomatis buat dan otomatis upload". Tidak ada draf dan tidak
menunggu persetujuan. Setiap putaran: riset berita pesantren **terbaru**, buat 1 carousel, lalu
langsung jadwalkan di slot itu. **Jangan mengulang topik atau berita yang sama.** Pemilik melihat
hasilnya di Instagram.

## Bahan

| Jalur | Isi |
|---|---|
| `konten/skill/SKILL.md` + `references/gaya-media-berita.md` | Aturan konten & gaya berita. **Baca dulu.** |
| `konten/skill/scripts/berita-newsroom.mjs` | Pembuat carousel berita 5 slide gaya Newsroom dari `data.json` |
| `konten/alat/render.sh` | Render HTML ke PNG: `sh konten/alat/render.sh <html> <png> 1080 1440 "v=1"` |
| `konten/riwayat-topik.md` | **Daftar topik yang sudah dipakai.** Wajib dicek dan ditambah. |
| `konten/hasil/` | Hasil carousel |
| `alat/jadwal.mjs` | Alat antrean penerbit |

Abaikan `konten/skill/scripts/render-html.sh` (khusus Windows) dan jalur `D:\…` di dokumen skill.

## Langkah setiap putaran

1. **Slot.** `TZ=Asia/Jakarta date "+%F %H:%M"`. Slot target = 07:00, 13:00, atau 19:00 berikutnya
   (yang ±1 jam lagi). Jalankan `node alat/jadwal.mjs daftar`. Kalau slot itu **sudah terisi**
   (menunggu/terbit), berhenti dan laporkan singkat "slot sudah terisi".
2. **Persiapan.** `npm i --prefix /tmp/ff ffmpeg-static >/dev/null 2>&1; export FFMPEG=/tmp/ff/node_modules/ffmpeg-static/ffmpeg`.
3. **Riset berita terbaru** (WebSearch mode extended, 2–3 kueri paralel), utamakan terbit **hari ini
   atau kemarin**: berita pesantren/santri/Ditjen Pesantren/pendidikan keagamaan. Sumber resmi
   (kemenag.go.id, nu.or.id, muhammadiyah.or.id, mui.or.id) lalu media kredibel (antaranews, detik,
   kompas, republika, medcom). Baca `konten/riwayat-topik.md` dan **buang** semua kandidat yang
   topik atau URL-nya sudah ada di sana. Pilih 1 yang paling penting dan baru.
   - Kalau tidak ada berita baru yang layak: buat konten **edukasi praktis** (wali/pengurus/santri)
     yang juga belum ada di riwayat. Jangan mengulang.
   - Hindari sensasi kasus kriminal; kalau perlu dibahas, sudut perlindungan santri tanpa nama/foto korban.
4. **Fakta & kutipan.** Buka artikel sumber (WebFetch) untuk tanggal, angka, dan kutipan kata per kata.
   Jangan mengarang kutipan, ayat, atau hadis. Kalau dua sumber berbeda, pakai yang resmi atau jangan
   cantumkan angkanya.
5. **Foto.** Kalau beritanya dari situs resmi lembaga, coba unduh foto utamanya
   (`curl -sSL -o foto.jpg <url gambar>`), kredit "Foto: <Lembaga>". Jangan memakai foto milik media
   berita. Kalau tidak ada atau unduhan gagal, hapus `"foto"` dari data (sampul tanpa foto tetap jadi).
6. **Buat carousel.** Folder `konten/hasil/<YYYY-MM-DD> <HH.MM> Berita - <judul singkat>/`. Tulis
   `_sumber/data.json` (format di kepala `berita-newsroom.mjs`; 3 slide isi + catatan PonpesGo), lalu:
   `node konten/skill/scripts/berita-newsroom.mjs "<folder>/_sumber/data.json" "<folder>/_sumber/carousel.html"`
   dan render `v=1..5` ke `<folder>/1.png … 5.png`. **Lihat setiap PNG** (Read); perbaiki teks yang
   terpotong/menumpuk (pendekkan teks) lalu render ulang.
7. **Caption** di `<folder>/caption.txt`: hook 1 baris, 3–6 baris inti, ajakan simpan/komentar,
   "Follow akun ini … coba PonpesGo (link di bio) …", "Sumber: … (tanggal)", 5–6 hashtag
   (#KabarPesantren #santri #pesantren #PonpesGo + 1–2 topik).
8. **Jadwalkan & setujui langsung:**
   ```
   node alat/jadwal.mjs tambah "<folder>" --judul "Berita: <judul>" --waktu "<YYYY-MM-DD> <slot>"
   node alat/jadwal.mjs setujui <id dari keluaran tambah> --tanpa-uji
   ```
   (Format 1080×1440 sudah lolos uji di @ponpesgo pada 17 Okt 2026.) Abaikan galat "gh" dari
   langkah menyalakan penjaga; penjaga GitHub tetap jalan sendiri.
9. **Catat riwayat.** Tambah 1 baris di `konten/riwayat-topik.md` (tayang, judul, URL sumber), lalu
   `git add -A konten && git commit -m "Riwayat: <judul>" && git pull --rebase origin main && git push origin HEAD:main`.
10. **Laporan singkat** (Bahasa Indonesia, untuk HP): jam tayang, judul, sumber, dan tautan
    `https://github.com/ptsabiha/jadwal-instagram-ponpesgo/tree/main/konten/hasil/<folder>` (spasi = `%20`).

## Batasan

- Hanya repo ini dan akun @ponpesgo. Jangan menyentuh repo Kurir ATK.
- Jangan membaca, membuka, atau meminta token (`rahasia/`).
- Satu putaran = satu postingan untuk satu slot. Jangan menjadwalkan slot lain.
- Kalau ada langkah yang gagal (render, push, alat jadwal), jangan memaksa: laporkan galatnya apa adanya.
