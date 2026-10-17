# Jadwal Instagram PonpesGo

Penjadwal postingan Instagram PonpesGo (platform manajemen pesantren digital).
Setiap 5 menit, GitHub Actions memeriksa folder `antrian/` dan menerbitkan postingan
yang waktunya sudah tiba lewat Instagram API resmi.

Repo ini dikelola Claude lewat skill `ponpesgo-content-strategist` (alat penjadwal sama dengan `kurir-atk-instagram-scheduler`). Jangan mengubah berkasnya
dengan tangan. Minta Claude untuk menambah, mengubah, atau membatalkan jadwal.

## Untuk pemilik

| Berkas | Fungsi |
|---|---|
| `Lihat Jadwal Instagram.bat` | Melihat antrean dan hasil penerbitan terakhir |
| `Pasang Token Instagram.bat` | Memasang token Instagram baru (pertama kali, atau kalau token mati) |

Kalau ada postingan yang gagal terbit, GitHub mengirim email ke akun GitHub pemilik repo.

## Isi repo

| Jalur | Isi |
|---|---|
| `antrian/<id>/post.json` | Jadwal, caption, dan status satu postingan (draf, menunggu, terbit, gagal, batal) |
| `antrian/<id>/1.jpg ...` | Slide carousel. Repo ini publik supaya Instagram bisa mengambil gambarnya. |
| `rahasia/token-ig.json` | Token Instagram **terenkripsi**. Hanya penerbit di GitHub yang bisa membukanya (`KUNCI_PRIVAT` di GitHub Secrets). |
| `rahasia/kunci-publik.pem` | Gembok publik untuk mengunci token. Aman untuk publik, karena gembok ini hanya bisa mengunci, tidak bisa membuka. |
| `pengaturan.json` | Akun tujuan, zona waktu, dan batas keterlambatan |
| `konten/data/performa.json` | Angka performa postingan & akun, diambil otomatis tiap ±3 jam (workflow "Insight Instagram") |
| `konten/data/pelajaran.md` | Kesimpulan konten mana yang berhasil, dipakai Claude setiap membuat konten |
| `konten/data/kirim/` | Laporan untuk Telegram. Workflow "Laporan Telegram" mengirimnya ke @ponpesgoBot lalu memindahkannya ke `terkirim/` |
| `rahasia/telegram.json` | Token bot Telegram **terenkripsi** (gembok yang sama dengan token Instagram) |
| `alat/` | Skrip penerbit (`terbitkan.mjs`) dan alat antrean (`jadwal.mjs`) |
