# Analisis Konten & FYP Konsisten (peran Data Analyst)

Tujuannya bukan sekali viral, tetapi **FYP yang berulang**: setiap minggu tahu format, hook, topik,
dan jam mana yang membuat orang berhenti, menggeser, menyimpan, mengirim, dan follow, lalu
memperbanyak yang berhasil dan membuang yang tidak.

## Alur data (otomatis, tanpa laptop)

```
Penerbit (jaga.yml) menayangkan postingan, mencatat media_id di antrian/<id>/post.json
        │
Workflow "Insight Instagram" (insight.yml, tiap ±3 jam) → alat/insight.mjs
        │  menulis konten/data/performa.json: angka per postingan (snapshot 24j / 48j / 7h)
        │  + follower harian + jangkauan 7 hari follower vs non-follower
        │
node konten/skill/scripts/analisis.mjs   → laporan Markdown: peringkat, pola, sinyal
        │
Claude menyimpulkan → konten/data/pelajaran.md (pegangan yang dipakai setiap routine)
        │
Routine berikutnya memilih topik, hook, dan format berdasarkan pelajaran.md
```

Insight butuh token dengan izin **`instagram_business_manage_insights`**. Kalau belum ada,
`performa.json` hanya berisi suka & komentar dan kolom `galat` menjelaskannya. Laporkan ke pemilik:
buat token baru dengan izin itu dicentang, lalu jalankan `Pasang Token Instagram.bat`.

## Berkas

| Jalur | Isi | Siapa yang menulis |
|---|---|---|
| `konten/data/performa.json` | Angka mentah dari Instagram | Workflow insight (jangan diedit tangan) |
| `konten/data/label.json` | Label per postingan: `pilar`, `hook`, `format`, `topik`, `catatan` | Routine, saat menjadwalkan |
| `konten/data/pelajaran.md` | Kesimpulan yang sedang berlaku + eksperimen berjalan | Claude, dari hasil analisis |
| `konten/data/laporan/<tanggal>.md` | Laporan mingguan | Claude, setiap Senin |

Nilai label yang dipakai (supaya kelompoknya bisa dibandingkan):
- `pilar`: Berita · Edukasi · Momen · Komunitas · Promosi
- `hook`: Berita+dampak · Hitung mundur · Celah pengetahuan · Daftar/angka · Pertanyaan · Identitas
- `format`: Newsroom 5 slide · Explainer · Checklist · Kutipan · lainnya (tulis singkat)

## Metrik dan artinya

| Metrik | Dari mana | Arti untuk FYP |
|---|---|---|
| Jangkauan (reach) | `reach` | Berapa akun yang melihat. Dasar semua rasio |
| Indeks jangkauan | jangkauan ÷ median akun | 1,0 biasa · ≥1,5 melesat · <0,7 tertahan |
| Rasio kirim | `shares` ÷ reach | **Sinyal terkuat** ke non-follower. ≥1% bagus |
| Rasio simpan | `saved` ÷ reach | Konten bernilai / akan dicari lagi. ≥2% bagus |
| Rasio follow | `follows` ÷ reach | Apakah konten mengubah penonton jadi pengikut. ≥0,5% bagus |
| ER | (suka+komentar+simpan+kirim) ÷ reach | Gambaran umum keterlibatan. ≥5% bagus |
| Tayangan per orang | `views` ÷ reach | Indikasi orang menggeser beberapa slide / melihat ulang (bukan angka pasti per slide) |
| Non-follower 7 hari | jangkauan akun, breakdown follow_type | ≥50% artinya akun sudah sering masuk Explore/FYP |

**Skor FYP** (satu angka untuk peringkat) =
(3×kirim + 2×simpan + 2×follow + 1×komentar + 0,5×suka) ÷ jangkauan × 100.
Bobotnya mengikuti urutan sinyal di `strategi-fyp.md`. Pakai Skor FYP untuk *kualitas* dan indeks
jangkauan untuk *distribusi*; keduanya dibaca bersama.

Patokan di atas berlaku sampai ada 10+ postingan. Setelah itu yang dipakai **median akun sendiri**
(skrip sudah menghitungnya).

## Membandingkan dengan adil

- Bandingkan di **umur yang sama**: skrip memakai snapshot 48 jam, lalu 24 jam. Postingan di bawah
  24 jam belum boleh disimpulkan.
- Postingan **momen** (Hari Santri, Maulid) dibandingkan dengan momen lain, bukan dengan harian.
- **Minimal 5 postingan per kelompok** sebelum menyebut sesuatu "terbukti". Di bawah itu tulis
  sebagai dugaan.
- Ubah **satu variabel** per eksperimen (hook *atau* jam *atau* format), jangan sekaligus.

## Diagnosa cepat

| Gejala | Kemungkinan penyebab | Tindakan |
|---|---|---|
| Jangkauan rendah, rasio simpan/kirim tetap bagus | Distribusi: hook slide 1 kurang menghentikan jempol, atau jam | Uji hook lain dengan topik sejenis; cek jam di tabel pola |
| Jangkauan tinggi, simpan rendah | Judul menarik tapi isi kurang bernilai disimpan | Tambah ringkasan/daftar/tanggal penting yang layak disimpan |
| Tayangan per orang rendah | Orang berhenti di sampul | Slide 2 harus jadi hook kedua; janji di sampul ditepati di slide 2 |
| Jangkauan tinggi, follow rendah | Penonton tidak punya alasan follow | Slide terakhir: manfaat follow yang spesifik + identitas media |
| Komentar sangat sedikit | Tidak ada pancingan yang mudah dijawab | Pertanyaan ringan satu kata di caption/slide akhir |
| Non-follower 7 hari < 30% | Konten hanya beredar di follower | Perbanyak topik "harus diteruskan" (jadwal, panduan, info resmi) dan ajakan kirim ke grup |
| Satu postingan melesat ≥1,5× | Topik/format sedang dicari | Sekuel atau sudut baru topik yang sama dalam 72 jam |

## Mesin FYP konsisten (aturan main mingguan)

1. **70% formula pemenang**: format + jenis hook + panjang judul yang Skor FYP-nya di atas median
   (dari `pelajaran.md` bagian "Terbukti").
2. **20% variasi**: topik baru dengan formula pemenang.
3. **10% eksperimen**: satu variabel baru yang sedang diuji (bagian "Eksperimen berjalan").
4. **Gelombang topik**: postingan yang melesat diikuti sekuel dalam 72 jam selama topiknya masih hangat.
5. **Ritme tetap**: 3 slot sehari (07.00 · 13.00 · 19.00 WIB), gaya visual sama, seri untuk momen.
   Algoritma menghargai akun yang konsisten; jangan menghilang lalu memborong postingan.
6. **Hentikan** kelompok yang 2 minggu berturut-turut di bawah 0,8× median akun (n ≥ 5).
7. **Tindakan pemilik** yang tidak bisa diotomatiskan, sebutkan di laporan bila relevan: balas
   komentar di jam pertama, bagikan postingan ke Story dengan stiker polling, kirim ke grup WA
   pesantren/wali santri.

## Menulis kesimpulan di `pelajaran.md`

Setiap butir wajib punya **bukti dan status**:

```
- [Terbukti 2026-11-02] Hook "Daftar/angka" median Skor FYP 4,1 vs akun 2,9 (n=7). → pakai untuk edukasi.
- [Dugaan 2026-10-25] Slot 19.00 jangkauan lebih tinggi (indeks 1,3, n=3). Tunggu n≥5.
- [Eksperimen s/d 2026-11-08] Judul ≤6 kata vs 7–10 kata, topik berita. Ukur Skor FYP 48 jam.
- [Dihentikan 2026-11-09] Hook "Pertanyaan" untuk berita: 0,7× median (n=6).
```

Aturan: jangan menghapus riwayat, ubah statusnya. Maksimal ±15 butir aktif supaya routine
membacanya dengan cepat; pindahkan yang lama ke bagian "Arsip".

## Laporan

Semua laporan dikirim ke Telegram pemilik lewat `konten/data/kirim/*.txt` (lihat `konten/ROUTINE.md`).

**Harian** (routine slot 07.00, cukup 3–5 baris di laporan ke HP pemilik): postingan terbaik
kemarin + angkanya, satu hal yang berubah di `pelajaran.md`, dan peringatan data (mis. izin insight).

**Mingguan** (Senin, `konten/data/laporan/<YYYY-MM-DD>.md`), mengikuti format di
`metrik-evaluasi.md`: ringkasan 3 baris, tabel postingan minggu itu, pola, lalu **3 keputusan**
(ulangi · ubah · hentikan) dan eksperimen minggu depan. Grafik bila diminta pemilik (skill `dataviz`).

## Yang tidak tersedia lewat API

Drop-off per slide, non-follower per postingan, dan sumber tayangan (Beranda/Explore/Profil) hanya
terlihat di aplikasi Instagram. Kalau perlu untuk keputusan penting, minta tangkapan layar Insight
postingan ke pemilik, baca angkanya, lalu catat di `label.json` kolom `catatan`.
