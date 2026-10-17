# Routine Otomatis PonpesGo (cloud) · Konten per slot + Reels, langsung tayang

Routine cloud Claude ini berjalan **3 kali sehari, 1 jam sebelum setiap slot tayang**:
06.00 → tayang 07.00, 12.00 → tayang 13.00, 18.00 → tayang 19.00 WIB. Ia jalan walaupun
laptop pemilik mati.

**Aturan pemilik (17 Okt 2026):** "otomatis buat dan otomatis upload". Tidak ada draf dan tidak
menunggu persetujuan. Setiap putaran: riset berita pesantren **terbaru**, buat 1 carousel, lalu
langsung jadwalkan di slot itu. **Jangan mengulang topik atau berita yang sama.** Pemilik melihat
hasilnya di Instagram.

**Variasi konten (17 Okt 2026):** 07.00 Berita · 13.00 Edukasi Pengurus · 19.00 Wali & Santri ·
Sabtu 13.00 Fitur PonpesGo (lihat `konten/skill/references/bank-ide-konten.md`). **Setiap carousel
juga dibuatkan Reels** satu gambar 9:16 yang tayang 2 jam kemudian (09.00 / 15.00 / 21.00).

## Bahan

| Jalur | Isi |
|---|---|
| `konten/skill/SKILL.md` + `references/gaya-media-berita.md` | Aturan konten & gaya berita. **Baca dulu.** |
| `konten/skill/scripts/berita-newsroom.mjs` | Pembuat carousel berita 5 slide gaya Newsroom dari `data.json` |
| `konten/alat/render.sh` | Render HTML ke PNG: `sh konten/alat/render.sh <html> <png> 1080 1440 "v=1"` |
| `konten/riwayat-topik.md` | **Daftar topik yang sudah dipakai.** Wajib dicek dan ditambah. |
| `konten/data/pelajaran.md` | **Kesimpulan performa yang berlaku** (formula pemenang, eksperimen). Wajib dibaca. |
| `konten/skill/scripts/analisis.mjs` + `konten/skill/references/analisis-konten.md` | Laporan performa dari `konten/data/performa.json` (diisi otomatis workflow insight) dan cara menyimpulkannya |
| `konten/data/label.json` | Label tiap postingan (pilar, hook, format, topik) untuk analisis |
| `konten/hasil/` | Hasil carousel |
| `alat/jadwal.mjs` | Alat antrean penerbit |

Abaikan `konten/skill/scripts/render-html.sh` (khusus Windows) dan jalur `D:\…` di dokumen skill.

## Langkah setiap putaran

1. **Slot.** `TZ=Asia/Jakarta date "+%F %H:%M"`. Slot target = 07:00, 13:00, atau 19:00 berikutnya
   (yang ±1 jam lagi). Jalankan `node alat/jadwal.mjs daftar`. Kalau slot itu **sudah terisi**
   (menunggu/terbit): jangan membuat konten. **Kalau slotnya 07:00**, tetap kerjakan langkah 2 (analisis &
   `pelajaran.md`), tulis laporan pagi ke Telegram (langkah 10, isinya performa + kesimpulan + jadwal tayang
   hari ini), commit & push (langkah 11), lalu berhenti. Slot lain: berhenti dan laporkan singkat "slot sudah terisi".
2. **Belajar dari data.** Jalankan `node konten/skill/scripts/analisis.mjs` dan baca
   `konten/data/pelajaran.md`. Pakai saat memilih topik, jenis hook, dan format di langkah 4–8:
   utamakan formula "Terbukti", jalankan "Eksperimen berjalan" (gilir variannya), hindari yang
   "Dihentikan". Kalau ada postingan "Melesat", pertimbangkan sekuelnya (tetap jangan mengulang berita yang sama).
   - **Hanya di putaran slot 07.00:** perbarui `konten/data/pelajaran.md` dari laporan itu, mengikuti
     `references/analisis-konten.md` (bukti + status, jangan simpulkan dari n < 5 atau umur < 24 jam).
     **Senin** di slot 07.00: tulis juga laporan mingguan ke `konten/data/laporan/<YYYY-MM-DD>.md`.
     Kalau datanya belum ada atau tidak berubah, jangan ubah apa-apa.
3. **Persiapan.** `npm i --prefix /tmp/ff ffmpeg-static >/dev/null 2>&1; export FFMPEG=/tmp/ff/node_modules/ffmpeg-static/ffmpeg`.
4. **Tentukan pilar slot, lalu riset.** 07.00 = Berita; 13.00 = Edukasi Pengurus; 19.00 = Wali & Santri;
   Sabtu 13.00 = Fitur PonpesGo (ide & aturan di `konten/skill/references/bank-ide-konten.md`). Berita yang
   besar/mendesak (kebijakan baru, bantuan bertenggat, momen nasional) boleh mengambil slot mana pun.
   Untuk pilar edukasi: pilih ide yang belum ada di riwayat, cocokkan dengan momen/berita pekan ini, dan
   riset faktanya dari sumber A/B (regulasi, situs resmi). Untuk berita: (WebSearch mode extended,
   2–3 kueri paralel), utamakan terbit **hari ini atau kemarin**: berita pesantren/santri/Ditjen Pesantren/pendidikan keagamaan. Sumber resmi
   (kemenag.go.id, nu.or.id, muhammadiyah.or.id, mui.or.id) lalu media kredibel (antaranews, detik,
   kompas, republika, medcom), lalu sisir sumber lain di `konten/skill/references/sumber-referensi.md`
   (Kanwil/Kankemenag daerah, ormas, situs pesantren, media Islam & daerah; WebSearch dengan
   `allowed_domains`). Media sosial hanya untuk ide, fakta tetap dari situs. Baca `konten/riwayat-topik.md` dan **buang** semua kandidat yang
   topik atau URL-nya sudah ada di sana. Pilih 1 yang paling penting dan baru.
   - Kalau tidak ada berita baru yang layak: buat konten **edukasi praktis** (wali/pengurus/santri)
     yang juga belum ada di riwayat. Jangan mengulang.
   - Hindari sensasi kasus kriminal; kalau perlu dibahas, sudut perlindungan santri tanpa nama/foto korban.
5. **Fakta & kutipan.** Buka artikel sumber (WebFetch) untuk tanggal, angka, dan kutipan kata per kata.
   Jangan mengarang kutipan, ayat, atau hadis. Kalau dua sumber berbeda, pakai yang resmi atau jangan
   cantumkan angkanya.
6. **Foto (WAJIB setiap postingan).** Pemilik mengizinkan penuh membuka web untuk mencari foto, tanpa
   bertanya lagi (17 Okt 2026). Cari dengan WebSearch/WebFetch, lalu unduh ke `_sumber/foto.jpg`
   (`curl -sSL -o foto.jpg <url gambar>`), urut prioritas:
   1. Foto resmi lembaga sumber berita (kemenag.go.id, pesantren.kemenag.go.id, nu.or.id,
      muhammadiyah.or.id, mui.or.id, situs pemda/pesantren). Kredit "Foto: <Lembaga>".
   2. Foto berlisensi bebas yang relevan (Wikimedia Commons, Unsplash, Pexels): suasana pesantren,
      santri mengaji, masjid, kitab, upacara. Kredit "Foto: <Pemotret>/Wikimedia Commons" atau "Foto: Unsplash".
   Jangan memakai foto milik media berita (detik, kompas, antara, dll.), foto korban, atau wajah anak
   dalam berita sensitif (pakai foto suasana/gedung). Lihat fotonya (Read) sebelum dipakai: tajam,
   minimal ±1000 px lebar, cocok dengan isi. Atur `"posisiFoto"` agar wajah/objek utama tidak tertutup judul.
   Cara cepat mengambil foto utama artikel (`og:image`) ada di `konten/skill/references/sumber-referensi.md`.
   Kalau semua unduhan gagal (mis. jaringan menolak host), tetap terbitkan tanpa foto dan **tulis di laporan
   Telegram** host yang gagal, supaya pemilik bisa membuka aksesnya.
7. **Buat carousel.** Folder `konten/hasil/<YYYY-MM-DD> <HH.MM> <Pilar> - <judul singkat>/`. Tulis
   `_sumber/data.json` (format di kepala `berita-newsroom.mjs`; 3 slide isi + catatan PonpesGo; `label`
   sesuai pilar, mis. "PANDUAN PENGURUS", "TIPS WALI SANTRI"), **plus** `"reels": { "poin": [3–4 poin] }`
   untuk Reels (tiap poin ≤ 120 karakter, kalimat utuh, fakta terpenting: kapan, di mana, siapa, apa artinya), lalu:
   `node konten/skill/scripts/berita-newsroom.mjs "<folder>/_sumber/data.json" "<folder>/_sumber/carousel.html"`
   dan render `v=1..5` ke `<folder>/1.png … 5.png`. **Lihat setiap PNG** (Read); perbaiki teks yang
   terpotong/menumpuk (pendekkan teks) lalu render ulang. Slide-slidenya otomatis **bersambung**
   (pita & ornamen menyeberang sambungan); render juga `v=0` lebar 5400 ke `_sumber/panorama.png` dan
   pastikan tidak ada teks yang menabrak pita atau ornamen di bawah y 1150.
8. **Caption** di `<folder>/caption.txt`: hook 1 baris, 3–6 baris inti, ajakan simpan/komentar,
   "Follow akun ini … coba PonpesGo (link di bio) …", "Sumber: … (tanggal)", 5–6 hashtag
   (#KabarPesantren #santri #pesantren #PonpesGo + 1–2 topik).
9. **Jadwalkan & setujui langsung:**
   ```
   node alat/jadwal.mjs tambah "<folder>" --judul "Berita: <judul>" --waktu "<YYYY-MM-DD> <slot>"
   node alat/jadwal.mjs setujui <id dari keluaran tambah> --tanpa-uji
   ```
   (Format 1080×1440 sudah lolos uji di @ponpesgo pada 17 Okt 2026.) Abaikan galat "gh" dari
   langkah menyalakan penjaga; penjaga GitHub tetap jalan sendiri.
   Lalu tambahkan label postingan itu ke `konten/data/label.json` dengan id dari keluaran tambah:
   `"<id>": { "pilar": "…", "hook": "…", "format": "…", "topik": "…" }` (nilai baku di `analisis-konten.md`).
   **Reels (wajib):**
   ```
   node konten/skill/scripts/buat-reels.mjs "<folder>"
   ```
   Lihat `<folder>/reels.png` (Read): semua poin terbaca, tidak terpotong "…", tidak menabrak tombol.
   Perbaiki `reels.poin` bila perlu lalu jalankan ulang. Caption `<folder>/caption-reels.txt` dibuat
   otomatis (berbeda dari caption carousel, berisi kredit musik CC BY: jangan dihapus). Lalu:
   ```
   node alat/jadwal.mjs reels "<folder>"
   node alat/jadwal.mjs setujui <id reels> --tanpa-uji
   ```
   Waktunya otomatis 2 jam setelah carousel. Tambahkan juga labelnya di `label.json` (format "Reels 1 gambar").
10. **Tulis laporan untuk Telegram.** Susun laporan singkat (Bahasa Indonesia, untuk HP, teks biasa
    tanpa Markdown tabel) dan simpan di `konten/data/kirim/<YYYYMMDD-HHMM>.txt` (waktu WIB sekarang).
    Isi: jam tayang carousel & Reels, pilar, judul, sumber, dan tautan
    `https://github.com/ptsabiha/jadwal-instagram-ponpesgo/tree/main/konten/hasil/<folder>` (spasi = `%20`).
    Tambah 1–3 baris performa: postingan terbaik sejauh ini (Skor FYP / jangkauan), dan di slot 07.00
    apa yang berubah di `pelajaran.md` (Senin: ringkasan mingguan 3–5 baris). Kalau `performa.json` mencatat
    galat izin insight, sampaikan apa adanya beserta langkahnya (token baru dengan izin
    `instagram_business_manage_insights`). Workflow "Laporan Telegram" mengirimnya ke HP pemilik begitu di-push.
    Kalau putaran gagal di tengah jalan tapi repo masih bisa di-push, tulis laporan galatnya di berkas yang sama.
    Kalau slot sudah terisi (langkah 1), jangan menulis laporan, kecuali laporan pagi slot 07:00.
11. **Catat riwayat & push.** Tambah 1 baris di `konten/riwayat-topik.md` (tayang, judul, URL sumber), lalu
   `git add -A konten && git commit -m "Riwayat: <judul>" && git pull --rebase origin main && git push origin HEAD:main`.
12. **Jawaban akhir** routine = isi laporan yang sama.

## Batasan

- Hanya repo ini dan akun @ponpesgo. Jangan menyentuh repo Kurir ATK.
- Jangan membaca, membuka, atau meminta token (`rahasia/`).
- Satu putaran = satu postingan untuk satu slot. Jangan menjadwalkan slot lain.
- Kalau ada langkah yang gagal (render, push, alat jadwal), jangan memaksa: laporkan galatnya apa adanya.
