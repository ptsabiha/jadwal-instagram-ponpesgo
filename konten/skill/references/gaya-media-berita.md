# Gaya Media Informasi Profesional (carousel berita)

Dipakai untuk konten **Berita** (pilar "apa yang terjadi"): kabar terbaru dunia pendidikan
pesantren dari media/sumber resmi, dikemas seperti media berita profesional. Ditambahkan 17 Okt
2026 atas permintaan pemilik. Template: `assets/template-berita.html` (3 konsep, 2 contoh slide
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
isi berita (tanpa clickbait). Tidak memakai foto dari media (hak cipta); visual cukup tipografi,
ikon, dan diagram.

## Tiga konsep tampilan

| Konsep | Ciri | Cocok untuk |
|---|---|---|
| **A · Newsroom** | Latar navy gelap bergaris halus, judul Oswald kapital besar, label merah "KABAR TERKINI" + tanggal, pita "SUMBER" seperti TV | Berita mendesak, pengumuman resmi |
| **B · Editorial** | Kertas putih hangat `#FBFAF6`, judul DM Serif Display, deck Source Serif italic, kutipan dengan tanda petik merah besar, daftar bernomor | Kebijakan, opini tokoh, analisis |
| **C · Explainer Infografis** | Blok biru gradasi di atas, judul Plus Jakarta 800 putih + kuning `#FFD36B`, kartu angka besar, diagram alur | Data, angka, "kenapa/bagaimana" |

Semua konsep tetap memakai: logo resmi (data URI `{{LOGO}}` diganti saat build dengan
`assets/logo/ponpesgo-logo-resmi-320.png`), tagline `MANAJEMEN PESANTREN DIGITAL` (konsep A
memakai `KABAR PESANTREN`), titik progres kanan atas, dan **penyambung feed baku** di sampul
(`struktur-carousel.md`). Konsep pilihan pemilik dicatat di sini setelah dipilih.

## Render

Template memakai query `v=A1`, `A2`, `B1`, … . Ganti `{{LOGO}}` dulu:
```bash
node -e 'const fs=require("fs");const u="data:image/png;base64,"+fs.readFileSync("assets/logo/ponpesgo-logo-resmi-320.png").toString("base64");fs.writeFileSync("berita.html",fs.readFileSync("assets/template-berita.html","utf8").replace(/\{\{LOGO\}\}/g,u))'
sh scripts/render-html.sh berita.html slide-1.png 1080 1440 "v=A1"
```
