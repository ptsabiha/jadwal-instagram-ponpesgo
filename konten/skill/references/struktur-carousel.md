# Struktur Carousel PonpesGo

## Gaya baku: carousel BERSAMBUNG (seamless)

Pemilik meminta setiap carousel **bersambung**: satu kanvas panjang yang dipotong menjadi
beberapa slide, sehingga gambar terasa menyambung saat digeser. Ini juga menaikkan
"geser sampai habis" karena setiap slide menyisakan potongan elemen di tepi kanan.

- Kanvas: **(N × 1080) × 1440**. Untuk 5 slide: 5400×1440. Garis potong di x = 1080, 2160, 3240, 4320.
- **Elemen penyambung wajib menyeberang setiap garis potong**: pita merah-biru yang mengalir di
  seluruh kanvas, plus satu ornamen di tiap sambungan (siluet masjid, bintang 8 sudut, bulan
  sabit, lentera, kubah). Taruh di pita bawah (y ≥ 1150) atau tergantung dari atas.
- **Teks dan kartu tidak boleh melintasi garis potong**. Jarak ≥ 60 px dari garis potong.
- Isi teks berada di zona y 160–1120; pita bawah y 1150–1440 untuk ornamen dan garis.
- Indikator posisi (titik progres) di kanan atas setiap slide.
- Generator: `scripts/berita-newsroom.mjs` (gaya News navy, satu-satunya gaya). Query `v=1..N`
  merender satu slide (panorama digeser), `v=0` panorama utuh (lebar N×1080) untuk pratinjau.
  `assets/carousel-template.html` (latar putih) hanya arsip.

## Gaya baku: FEED BERSAMBUNG (antar-postingan, selamanya)

Pemilik juga meminta **semua postingan menyambung di grid profil**, dari postingan pertama
sampai seterusnya. Instagram menggeser seluruh grid setiap ada postingan baru, jadi desain
puzzle 3×3 akan rusak. Solusinya: **setiap sampul (slide 1) memakai penyambung baku di
tepinya**, sehingga sampul mana pun selalu cocok dengan tetangganya dalam urutan apa pun.

Penyambung baku slide 1 (JANGAN diubah, posisinya harus persis sama di setiap postingan):

| Penyambung | Posisi | Spesifikasi |
|---|---|---|
| Pita merah | tepi kiri x=0 dan tepi kanan x=1080 di **y=1250** | tebal 10 px, gradasi merah, arah datar di tepi |
| Pita biru | tepi kiri dan kanan di **y=1300** | tebal 6 px `#1E4FD8`, arah datar di tepi |
| Benang biru vertikal | **x=45**: y=0→60 (ujung titik merah r=9) dan y=1300→1440 | tebal 4 px `#1E4FD8` |
| Latar | seluruh slide 1 | navy `#0A1330` + kisi halus periode 60 px mulai dari (0,0) (sebelum 18 Okt 2026: putih) |

Aturan tambahan untuk sampul:
- Selain penyambung baku, **tidak ada elemen yang menyentuh tepi** slide 1 (jarak ≥ 40 px).
  Ornamen yang menyeberang (masjid, bintang, sabit, lentera) hanya di sambungan slide 2 dst.
- Di dalam slide 1 pita boleh berkelok bebas, asal kembali ke y=1250/1300 dengan arah datar
  di x=0 dan x=1080 (pakai titik kendali kurva yang mendatar di kedua ujung).
- Teks sampul di zona y 160–1120 dan x ≥ 90 agar tidak menabrak benang di x=45.
- Sebelum menyerahkan, render `assets/simulasi-feed.html` (grid 3 kolom, celah 3 px) dengan
  sampul baru di samping sampul lama untuk membuktikan sambungannya rapi.

## Urutan slide (5 slide, bisa 5–8)

| Slide | Fungsi | Isi |
|---|---|---|
| 1 | **Hook** | Angka/momen besar, judul ≤ 10 kata, tanggal, janji "N hal penting", ajakan geser |
| 2–4 | **Informatif** | Satu subtopik per slide, bernomor (01, 02, 03): sejarah/konteks → inti berita/tema → panduan/agenda praktis. Fakta bersumber, tulis "Sumber:" kecil di bawah |
| Terakhir | **Ajakan** | Follow akun + unduh aplikasi PonpesGo (link di bio), maks. 2 poin manfaat. JANGAN pasang kotak "Besok: …", poin hitung mundur, atau pil H-x di mockup HP (dihapus pemilik 16 Okt 2026). Rencana seri cukup di caption/Story |

Pola isi slide informatif yang paling sering disimpan: timeline, daftar bernomor, kartu
2×2, dan jadwal bertanggal.

## Ukuran teks (agar terbaca di HP)

| Elemen | Ukuran |
|---|---|
| Judul slide | 72–84 px, tebal 800 |
| Subjudul/label | 26–34 px |
| Isi | ≥ 28 px, maks. ±40 kata per slide |
| Sumber | 20–22 px |
