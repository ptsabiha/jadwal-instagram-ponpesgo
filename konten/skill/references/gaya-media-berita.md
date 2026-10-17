# Gaya Media Informasi Profesional (carousel berita)

> **Keputusan pemilik 17 Okt 2026: hanya konsep A · Newsroom, untuk SEMUA konten** (berita, edukasi,
> momen, promosi). Konsep B dan C di bawah hanya arsip, jangan dipakai. Untuk konten non-berita cukup
> ganti `label` (mis. "EDUKASI SANTRI", "HARI SANTRI 2026", "TIPS WALI SANTRI").

Dipakai untuk konten **Berita** (pilar "apa yang terjadi"): kabar terbaru dunia pendidikan
pesantren dari media/sumber resmi, dikemas seperti media berita profesional. Ditambahkan 17 Okt
2026 atas permintaan pemilik. Template: `assets/template-berita.html` (3 konsep dengan slot foto `{{FOTO}}`, 2 contoh slide
per konsep). Contoh pertama: berita "Menag minta data pesantren & madrasah dirapikan" (13 Okt 2026).

## Alur riset berita

1. WebSearch mode `extended` (2–3 kueri paralel): "berita pendidikan pesantren terbaru <bulan
   tahun>", "Ditjen Pesantren Kemenag <bulan tahun>", topik spesifik (ijazah, data, beasiswa,
   kurikulum, perlindungan santri).
2. Pilih berita yang **≤ 7 hari**, relevan untuk pengurus/wali/santri, dan sebisa mungkin
   bersinggungan dengan pengelolaan pesantren (data, administrasi, keuangan, akademik), karena
   PonpesGo adalah platform manajemen pesantren.
3. Buka artikelnya (WebFetch) untuk fakta persis: tanggal terbit, siapa, di mana, angka, dan
   kutipan **kata per kata**. Kalau artikel tidak bisa dibuka, pakai minimal 2 sumber yang
   sepakat dan tandai fakta yang perlu dicek pemilik.
4. Hindari berita kasus kriminal/kekerasan sebagai sensasi. Kalau dibahas, sudut edukasi dan
   perlindungan santri, tanpa nama atau foto korban.

## Struktur 5 slide berita

| Slide | Isi |
|---|---|
| 1 Sampul | Label (KABAR TERKINI / PENDIDIKAN PESANTREN / INFO PESANTREN), tanggal berita, judul ≤ 10 kata gaya headline, deck 1 kalimat, sumber |
| 2 | Apa yang terjadi (siapa, kapan, di forum apa) + kutipan langsung bila ada |
| 3 | Poin-poin inti bernomor (maks. 4) |
| 4 | Penjelasan/konteks: kenapa penting, angka, diagram sederhana |
| 5 | "Apa artinya untuk pesantren?" (diberi label *Catatan PonpesGo*, bukan klaim pemerintah) + ajakan follow & PonpesGo |

Setiap slide mencantumkan "Sumber: <media>, <tanggal> (mengutip …)". Judul tidak boleh melebihi
isi berita (tanpa clickbait).

## Foto dokumentasi kejadian (pemilik minta, 17 Okt 2026)

Sampul berita sebaiknya memakai **foto dokumentasi asli kejadian**, dengan aturan:
- Ambil **dari sumber resmi lembaganya** (kemenag.go.id, nu.or.id, muhammadiyah.or.id, situs
  pesantren/kanwil). Cari artikel aslinya di situs itu (kotak pencarian kemenag.go.id bekerja di
  browser), lalu ambil gambar utamanya. Jangan memakai foto milik media berita (detik, kompas,
  antara, medcom, dll.) atau foto kantor berita, kecuali pemilik punya izin.
- Minta izin pemilik sebelum mengunduh (sebut nama berkas, sumber, ukuran).
- Wajib kredit di gambar: **"Foto: Kemenag"** (sesuai lembaga) + keterangan siapa di foto bila
  ada di sumber. Jangan memotong foto sampai mengubah makna, jangan diedit wajahnya.
- Jangan pernah foto korban, anak di bawah umur dalam kasus, atau foto yang tidak terkait langsung
  dengan beritanya. Kalau tidak ada foto resmi, pakai versi tanpa foto (tipografi + diagram).
- Di template: `{{FOTO}}` diganti data URI JPEG saat build (sama seperti `{{LOGO}}`).
  Konsep A: foto penuh di atas dengan gradasi navy; B: foto berbingkai + keterangan italic;
  C: foto di bawah lapisan biru.

Contoh pertama: foto rapat Menag 13 Okt 2026 dari
https://kemenag.go.id/nasional/menag-minta-tata-kelola-pesantren-diperkuat-dari-data-hingga-legalitas-ijazah-QEOEN

## Tiga konsep tampilan

| Konsep | Ciri | Cocok untuk |
|---|---|---|
| **A · Newsroom** | Latar navy gelap bergaris halus, judul Oswald kapital besar, label merah "KABAR TERKINI" + tanggal, pita "SUMBER" seperti TV | Berita mendesak, pengumuman resmi |
| ~~B · Editorial~~ (arsip) | Kertas putih hangat `#FBFAF6`, judul DM Serif Display, deck Source Serif italic, kutipan dengan tanda petik merah besar, daftar bernomor | Kebijakan, opini tokoh, analisis |
| ~~C · Explainer Infografis~~ (arsip) | Blok biru gradasi di atas, judul Plus Jakarta 800 putih + kuning `#FFD36B`, kartu angka besar, diagram alur | Data, angka, "kenapa/bagaimana" |

Semua konsep tetap memakai: logo resmi (data URI `{{LOGO}}` diganti saat build dengan
`assets/logo/ponpesgo-logo-resmi-320.png`), tagline `PLATFORM MANAJEMEN PESANTREN DIGITAL` (semua konsep), titik progres kanan atas, dan **penyambung feed baku** di sampul
(`struktur-carousel.md`). Konsep pilihan pemilik dicatat di sini setelah dipilih.

**Newsroom wajib bersambung antar-slide** (permintaan pemilik, 17 Okt 2026). `scripts/berita-newsroom.mjs`
sudah membuatnya otomatis: satu panorama N×1080 dibagi per slide, pita merah-biru mengalir melewati
setiap sambungan, ornamen di sambungan 2|3 (masjid), 3|4 (bintang 8), 4|5 (bulan sabit + bintang),
5|6 (lentera), dan cahaya biru latar menyeberang sambungan. Jangan menaruh teks di bawah y 1150
(baris sumber ada di y 1172, pita & ornamen di bawahnya). Kutipan yang kepanjangan otomatis dinaikkan.
Cek sambungan dengan merender `v=0` (panorama utuh, lebar N×1080):
`sh konten/alat/render.sh carousel.html panorama.png 5400 1440 "v=0"`.

## Render

Template memakai query `v=A1`, `A2`, `B1`, … . Ganti `{{LOGO}}` dulu:
```bash
node -e 'const fs=require("fs");const u="data:image/png;base64,"+fs.readFileSync("assets/logo/ponpesgo-logo-resmi-320.png").toString("base64");fs.writeFileSync("berita.html",fs.readFileSync("assets/template-berita.html","utf8").replace(/\{\{LOGO\}\}/g,u))'
sh scripts/render-html.sh berita.html slide-1.png 1080 1440 "v=A1"
```
