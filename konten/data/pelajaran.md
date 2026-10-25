# Pelajaran Konten PonpesGo (dipakai setiap routine)

Diperbarui dari `node konten/skill/scripts/analisis.mjs` mengikuti
`konten/skill/references/analisis-konten.md`. Setiap butir punya status dan bukti.
Jangan menghapus butir; ubah statusnya atau pindahkan ke Arsip.

## Status data

- [2026-10-17] Pengambilan insight otomatis baru dipasang. Belum ada angka; semua di bawah masih
  pegangan awal dari `strategi-fyp.md`, bukan hasil akun ini.

## Terbukti (n ≥ 5)

- [2026-10-26] **Reels menjangkau jauh lebih banyak akun daripada carousel.** Median indeks jangkauan
  Reels 3,71 (n=24) vs carousel 0,71 (n=25), sekitar 5×. Jangkauan 7 hari 647 akun, 99,4% non-follower.
  Pertahankan Reels untuk setiap carousel. Catatan: suka/simpan/kirim/follow masih hampir nol, jadi
  distribusi sudah ada tetapi belum menghasilkan keterlibatan.

## Dugaan sementara

- [2026-10-26] Hook "Daftar/angka" median indeks jangkauan 3,93 dan "Kutipan tokoh" 3,71, tertinggi, tetapi
  n masing-masing 4 dan 2 (< 5). Lanjutkan eksperimen hook, jangan simpulkan.
- [2026-10-26] Peringkat Skor FYP tertinggi (Satgas Antikekerasan, Pelatihan AI, Data Pesantren & Ijazah)
  hanya berdasar 3–5 suka dari jangkauan 6–24 akun: terlalu kecil untuk pola. Follower 5 (+2 sepekan).
- [Pegangan awal] Info yang "harus diteruskan" (jadwal, panduan resmi, tanggal penting) memancing
  kirim/share, sinyal terkuat ke non-follower.
- [Pegangan awal] Judul sampul 8–10 kata, terbaca dalam 1 detik, kata kunci di baris 1 caption.

## Eksperimen berjalan

- [Eksperimen s/d 2026-10-31] **Jenis hook untuk berita**: gilir Berita+dampak, Celah pengetahuan,
  dan Daftar/angka (catat di `label.json`). Ukur median Skor FYP 48 jam per jenis.
- [Eksperimen s/d 2026-10-31] **Slot tayang**: bandingkan 07.00 · 13.00 · 19.00 dari tabel "Jam tayang"
  (otomatis terkumpul karena 3 slot tetap).

## Dihentikan

_Belum ada._

## Arsip

_Belum ada._
