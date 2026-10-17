# Routine Harian PonpesGo (cloud)

Panduan untuk routine cloud Claude yang berjalan setiap hari pukul 19.30 WIB, walaupun laptop
pemilik mati. Tugasnya: riset, membuat 3 carousel untuk BESOK, mengantrekannya sebagai draf,
lalu menunggu persetujuan pemilik. Tulis semua pesan ke pemilik dalam Bahasa Indonesia yang
hangat dan lugas. Pemilik bukan orang teknis dan membaca dari HP.

## Bahan

| Jalur | Isi |
|---|---|
| `konten/skill/SKILL.md` | Aturan konten PonpesGo. **Baca dulu**, lalu `references/` sesuai kebutuhan |
| `konten/skill/assets/carousel-template.html` | Template carousel 5 slide (logo resmi sudah tertanam) |
| `konten/alat/render.sh` | Render HTML ke PNG di Linux: `sh konten/alat/render.sh <html> <png> 1080 1440 "s=1"` |
| `konten/hasil/` | Hasil carousel (publik) |
| `alat/jadwal.mjs` | Alat antrean penerbit (sama dengan di laptop) |

Abaikan `konten/skill/scripts/render-html.sh` (khusus Windows) dan jalur `D:\…` di dokumen skill;
di cloud semuanya ada di repo ini.

## Langkah

1. **Persiapan.** `node -v`; pasang pengubah gambar:
   `npm i --prefix /tmp/ff ffmpeg-static >/dev/null 2>&1; export FFMPEG=/tmp/ff/node_modules/ffmpeg-static/ffmpeg`.
   Uji render satu slide template. Kalau render gagal, laporkan galatnya ke pemilik lalu berhenti.
2. **Tanggal.** Tentukan BESOK dalam WIB (`TZ=Asia/Jakarta date -d tomorrow +%F`). Hitung jarak ke
   momen terdekat dari tanggal TAYANG. Lihat antrean: `node alat/jadwal.mjs daftar`. Kalau slot
   besok 07.00/13.00/19.00 sudah terisi, jangan membuat duplikat.
3. **Riset** dengan WebSearch di sumber kredibel (kemenag.go.id, nu.or.id, muhammadiyah.or.id,
   mui.or.id, antaranews, detik, kompas, republika); catat tanggal terbit. Pilih 3 topik yang
   tidak mengulang judul di `konten/hasil/` dan antrean:
   07.00 berita/info penting, 13.00 edukasi praktis (santri/wali/pengurus), 19.00 momen/komunitas.
   Fakta wajib bersumber. Jangan mengarang kutipan, ayat, atau hadis.
4. **Buat** tiap carousel dari template (5 slide 1080×1440, bersambung, penyambung feed baku,
   tagline `MANAJEMEN PESANTREN DIGITAL`). Render, lalu **lihat sendiri setiap PNG** (Read) dan
   perbaiki teks terpotong atau tabrakan. Simpan di
   `konten/hasil/<YYYY-MM-DD> <HH.MM> <judul singkat>/`: `1.png`…`5.png`, `caption.txt` (caption +
   hashtag + "Sumber: …"), `_sumber/carousel.html`, `CAPTION & PANDUAN.md`.
5. **Kirim pratinjau.** `git add konten/hasil && git commit -m "Konten <tanggal>" && git pull --rebase origin main && git push origin HEAD:main`.
6. **Antrekan sebagai draf** hanya kalau `node alat/jadwal.mjs status` menunjukkan akun dan token
   terpasang (akun PonpesGo, bukan @kuriratk):
   `node alat/jadwal.mjs tambah "konten/hasil/<folder>" --judul "<judul>" --waktu "<YYYY-MM-DD> 07:00"`
   (13:00 dan 19:00 untuk dua lainnya). Kalau token belum terpasang, lewati langkah ini dan
   sampaikan bahwa pemilik perlu menjalankan `Pasang Token Instagram.bat` di laptop.
7. **Minta persetujuan.** Tulis ringkasan: tabel jam · judul · jumlah slide · awal caption ·
   sumber · catatan fakta yang perlu dicek, dengan tautan pratinjau
   `https://github.com/ptsabiha/jadwal-instagram-ponpesgo/tree/main/konten/hasil/<folder>`
   (spasi ditulis `%20`). Tutup dengan: "Jadwalkan 3 postingan ini? Balas **ya** untuk menjadwalkan."
   Lalu **berhenti dan tunggu**.
8. **Setelah pemilik membalas "ya"** di sesi ini: `node alat/jadwal.mjs setujui --draf --tanpa-uji`,
   lalu `node alat/jadwal.mjs daftar`, dan laporkan jam tayang masing-masing. Tanpa "ya" yang
   jelas, jangan menyetujui apa pun.

## Batasan

- Hanya repo ini. Jangan menyentuh repo Kurir ATK.
- Jangan membaca, membuka, atau meminta token (`rahasia/`).
- `uji` membutuhkan login `gh` yang tidak ada di cloud; uji pertama dilakukan dari laptop.
- Kalau `git push` ke `main` ditolak, laporkan pesan galatnya apa adanya kepada pemilik.
