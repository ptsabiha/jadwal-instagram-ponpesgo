# Posting Otomatis Instagram PonpesGo

PonpesGo memakai alat penjadwal yang **sama persis** dengan Kurir ATK (skill
`kurir-atk-instagram-scheduler`), tetapi dengan repo, token, dan akun sendiri. Aturan umum,
perintah, dan cara mengatasi masalah ada di skill itu (`SKILL.md`, `references/api-dan-masalah.md`,
`references/pasang-sekali.md`). Bedanya ada di bawah ini.

## Lokasi

| Hal | PonpesGo |
|---|---|
| Repo lokal | `D:\PT SABIHA-Ammar\Website\Jadwal Instagram PonpesGo\` |
| Repo GitHub (publik) | `ptsabiha/jadwal-instagram-ponpesgo` (dibuat 17 Okt 2026, KUNCI_PRIVAT sudah di Secrets) |
| Folder konten | `D:\PT SABIHA-Ammar\Website\Konten Instagram PonpesGo\` |
| Akun | `pengaturan.json` → `akun` (terisi otomatis saat pemilik memasang token) |
| Perintah | `node "D:/PT SABIHA-Ammar/Website/Jadwal Instagram PonpesGo/alat/jadwal.mjs" <perintah>` |

**Jangan tertukar dengan repo Kurir ATK.** Selalu pakai jalur PonpesGo di atas dan cek baris
`Akun:` dari `jadwal.mjs status` sebelum menyetujui apa pun.

## Aturan jadwal (pemilik, 17 Okt 2026)

- **3 postingan per hari: 07.00, 13.00, 19.00 WIB.** `pengaturan.json` → `jarak_jadwal_jam: 6`
  dengan jam tenang 22.00–07.00 menghasilkan slot otomatis tepat di tiga jam itu.
- Konten berita mendesak boleh di luar slot (`--waktu`), tetap dengan persetujuan pemilik.

## Alur harian (persetujuan pemilik setiap hari)

1. **Malam sebelumnya** (tugas terjadwal, atau saat pemilik meminta): riset berita/momen untuk
   besok (`riset-tren.md`), pilih 3 topik (pagi: berita/info penting, siang: edukasi, malam:
   konten momen/komunitas), lalu buat 3 carousel dengan template.
2. Simpan tiap carousel di folder konten:
   `Konten Instagram PonpesGo/<YYYY-MM-DD> <HH.MM> <judul singkat>/` berisi `1.png` … `N.png`
   (1080×1440) dan `caption.txt` (caption + hashtag siap tayang). Sertakan juga `_sumber/` dan
   `CAPTION & PANDUAN.md` seperti biasa.
3. Antrekan sebagai **draf** dengan jam pasti:
   `jadwal.mjs tambah "<folder>" --judul "<judul>" --waktu "YYYY-MM-DD HH:MM"`.
4. Kirim pratinjau (SendUserFile) + tabel jadwal ke pemilik, termasuk catatan fakta yang perlu
   dicek. Tanyakan: "Jadwalkan 3 postingan ini di @<akun>?"
5. Setelah pemilik menjawab **ya** di chat: `jadwal.mjs setujui <id…>`, lalu `daftar`.
   Tanpa "ya" yang jelas, biarkan tetap draf.

- **Uji (`uji <id>`) hanya untuk postingan pertama** di akun ini dan saat format slide berubah.
  Jangan uji massal (kuota wadah 24 jam). Setelah satu carousel 1080×1440 lolos di akun
  PonpesGo, catat di sini dan setujui berikutnya dengan `--tanpa-uji` bila pemilik mengizinkan.
- Hitung mundur (H-x) dihitung dari **tanggal tayang**, bukan tanggal pembuatan.

## Status

- 17 Okt 2026: repo, gembok publik, dan KUNCI_PRIVAT siap; penerbit uji jalan dengan antrean kosong.
  Tugas terjadwal `ponpesgo-carousel-harian` (setiap hari 19.30 WIB, jalan saat aplikasi Claude
  terbuka) membuat 3 carousel untuk besok dan meminta persetujuan.
  **Belum:** token akun PonpesGo dipasang (pemilik, lewat aplikasi Meta "Penjadwal Kurir ATK" yang
  sama: tambah akun PonpesGo sebagai Instagram Tester), uji rasio 3:4 pertama.
