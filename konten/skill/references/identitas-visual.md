# Identitas Visual PonpesGo

## Palet tetap (ditetapkan pemilik, 16 Okt 2026): latar PUTIH, pendukung MERAH dan BIRU

| Nama | Hex | Pakai untuk |
|---|---|---|
| Putih | `#FFFFFF` | Latar semua slide (polos, tanpa gradasi, supaya sampul menyambung di feed) |
| Merah | `#E02B2B` (gradasi `#C81E25`→`#FF4B4B`) | Angka besar, kata aksen, tombol utama, pita penyambung merah, baris sorotan |
| Biru | `#1E4FD8` | Judul serif, label, pil tanggal, pita & benang penyambung biru, ikon cek |
| Biru muda | `#EAF0FF` | Latar kartu sekunder, kotak tanggal, siluet ornamen |
| Navy | `#0F1B3D` | Teks utama |

Jangan ganti warna latar per momen; konsistensi putih-merah-biru membuat feed rapi dan dikenali.

## Huruf

- **Plus Jakarta Sans** (400–800): semua teks.
- **Playfair Display Italic** (700–800): kata aksen/kutipan (nama momen, tema).
- Dimuat dari Google Fonts; perlu internet saat render.

## Ornamen khas

Pita ganda merah + biru yang mengalir antar-slide dan antar-postingan, benang biru vertikal
dengan titik merah, siluet masjid biru muda, bintang 8 sudut, bulan sabit biru, lentera merah,
pola bintang tipis biru (opasitas 5%, periode 120 px).

## Logo & Fakta PonpesGo

- **LOGO RESMI = berkas dari pemilik** (diserahkan 17 Okt 2026; semua konsep buatan Claude
  sebelumnya diarsipkan di `assets/logo/arsip-lentera/` dan `arsip-kubah/`, jangan dipakai lagi).
  Bentuk: ikon aplikasi kotak bersudut bulat bergradasi biru (biru langit `#1FA2FF` di kiri atas
  → biru tua `#0A4FD8`), lengkung mihrab putih, masjid putih (kubah, dua menara, bulan sabit) di
  atas kitab terbuka, tulisan **Ponpes** putih + **GO** biru di dalam pil putih. Jangan digambar
  ulang atau diubah; pakai berkasnya apa adanya. Berkas di `assets/logo/`:
  `ponpesgo-logo-resmi.webp` (asli dari pemilik, ada latar putih), `ponpesgo-logo-resmi.png`
  (latar putih DIHAPUS sesuai permintaan pemilik: hanya kotak biru sesuai bentuknya, sekeliling
  transparan; 1129×1144 px), `ponpesgo-logo-resmi-320.png` (versi kecil untuk disematkan) dan
  `ponpesgo-foto-profil-1080.png` (aman dipotong bulat oleh IG). Selalu pakai versi PNG
  transparan, bukan webp berlatar putih. Di carousel, `.logo` di template memuat versi 320 px
  sebagai data URI supaya HTML tetap bisa dipindah ke folder mana pun. Palet slide tetap
  putih-merah-biru; biru logo boleh dipakai sebagai aksen.
- **PonpesGo sebenarnya adalah platform manajemen pesantren** (dikonfirmasi pemilik 17 Okt 2026).
  Akun media (berita + edukasi santri) adalah corong audiens; tujuan akhirnya pesantren/pengurus
  memakai platform ini. Pembeli utama: pengurus pesantren/yayasan; wali santri dan santri
  adalah pengguna pendukung. Logo dan tagline sebaiknya mencerminkan "pesantren + pengelolaan
  digital", bukan sekadar "media santri". Logo final masih dipilih ulang dengan konteks ini.
- **Tagline resmi: `MANAJEMEN PESANTREN DIGITAL`** (dipilih pemilik 17 Okt 2026), menggantikan
  "Media Santri" di bawah nama PonpesGo.
- **Fitur yang sudah ada** (dikonfirmasi pemilik 17 Okt 2026, "semuanya"): data santri & asrama
  (pendaftaran, biodata, kamar, perizinan pulang), keuangan & SPP/syahriah (tagihan, pembayaran,
  laporan), akademik & hafalan (absensi, nilai, setoran hafalan, rapor diniyah), dan aplikasi
  wali santri (memantau tagihan, nilai, kabar santri dari HP). Fitur ini boleh disebut di slide
  ajakan dan caption; fitur lain di luar daftar ini tetap jangan diklaim.
- Handle Instagram/TikTok dan tautan unduh/demo: **belum dicatat.** Sampai diisi, ajakan memakai
  "Follow akun ini" dan "Coba PonpesGo · link di bio".
