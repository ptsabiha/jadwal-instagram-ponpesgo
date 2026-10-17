# Metrik & Evaluasi (peran Data Analyst)

## Data yang diminta dari pemilik

Per postingan (Instagram: Insight postingan; TikTok: Analitik), 48 jam & 7 hari setelah tayang:
jangkauan (reach), % non-follower, tayangan, suka, komentar, **simpan**, **kirim/share**,
follow dari postingan, kunjungan profil, klik tautan, dan (IG) drop-off per slide bila ada.
Pemilik boleh mengirim tangkapan layar; baca angkanya lalu ketik ulang ke tabel.

Simpan riwayat di `D:\PT SABIHA-Ammar\Website\Konten Carousel PonpesGo\data-performa.csv`
(atau folder kerja sesi) dengan kolom:

```
tanggal,jam,pilar,topik,hook,jumlah_slide,reach,non_follower_pct,simpan,share,komentar,follow,klik_link
```

## Rumus inti

| Metrik | Rumus | Patokan awal akun baru |
|---|---|---|
| Rasio simpan | simpan ÷ reach | ≥ 2% bagus |
| Rasio share | share ÷ reach | ≥ 1% bagus (sinyal FYP terkuat) |
| Rasio follow | follow ÷ reach | ≥ 0,5% bagus |
| Jangkauan luar | non-follower ÷ reach | ≥ 50% berarti masuk Explore/FYP |
| Engagement | (suka+komentar+simpan+share) ÷ reach | ≥ 5% bagus |

Patokan ini titik awal; setelah 10+ postingan, gunakan **median akun sendiri** sebagai patokan.

## Evaluasi mingguan (format laporan)

1. **Ringkasan 3 baris**: total reach, follower bertambah, postingan terbaik.
2. **Tabel 7 postingan** diurutkan dari rasio share tertinggi.
3. **Pola**: pilar, jenis hook, jam, dan jumlah slide mana yang di atas median.
4. **3 keputusan minggu depan**: ulangi (format pemenang), ubah (hook/jam), hentikan.
5. Grafik sederhana bila diminta (pakai skill `dataviz`).

## Aturan membaca data

- Jangan menyimpulkan dari 1–2 postingan. Minimal 5 postingan per jenis sebelum mengubah strategi.
- Postingan momen (Hari Santri) biasanya melonjak; bandingkan dengan momen sejenis, bukan dengan konten harian.
- Kalau reach turun tetapi rasio simpan/share tetap, masalahnya distribusi (jam/hook slide 1), bukan isi.
- Kalau reach naik tetapi follow rendah, perkuat slide terakhir & "Besok: …".
