# Bank Ide & Variasi Konten PonpesGo

Keputusan 17 Okt 2026: isi akun **tidak boleh 100% berita**. Berita membangun kepercayaan; konten
edukasi/praktis yang **disimpan dan dikirim ke grup WA** yang membuat akun cepat tumbuh dan
membawa calon pengguna PonpesGo (pembeli utama: pengurus pesantren/yayasan).

## Pembagian slot harian

| Slot | Pilar | Label sampul (contoh) | Untuk siapa |
|---|---|---|---|
| 07.00 | **Berita** (kabar terbaru) | KABAR TERKINI · KABAR KEMENAG · HARI SANTRI 2026 | Semua |
| 13.00 | **Edukasi Pengurus** (manajemen pesantren) | PANDUAN PENGURUS · REGULASI PESANTREN · TIPS ADMINISTRASI | Pengasuh, pengurus, bendahara, operator |
| 19.00 | **Wali & Santri** (praktis, relate, inspirasi) | TIPS WALI SANTRI · EDUKASI SANTRI · KISAH ULAMA | Wali santri, santri, alumni |
| Sabtu 13.00 | **Fitur PonpesGo** (promosi lembut) | FITUR PONPESGO | Pengurus (calon pengguna) |

- Berita mendesak/besar (kebijakan baru, bantuan dengan tenggat, momen nasional) **boleh mengambil
  slot mana pun**; pilar slot itu digeser ke hari berikutnya.
- Semua pilar tetap gaya News (`berita-newsroom.mjs`); yang berubah hanya `label`, isi, dan sudut.
- Konten edukasi juga **wajib bersumber** (regulasi, situs resmi, pakar). Jangan mengarang angka,
  ayat, hadis, atau ketentuan hukum. Tulis "Sumber:" seperti berita.
- Catat pilar di `konten/data/label.json`: `Berita` · `Edukasi Pengurus` · `Wali & Santri` · `Fitur PonpesGo` · `Momen`.
- Cek `konten/riwayat-topik.md`: jangan mengulang topik. Seri boleh berlanjut (judul jelas "Bagian 2").

## Edukasi Pengurus (13.00) — ide evergreen

1. Isi UU No. 18/2019 tentang Pesantren yang wajib dipahami pengurus (arkanul ma'had, fungsi pesantren)
2. Syarat & alur izin operasional pesantren (ijop) dan perpanjangannya
3. Cara mendaftar dan memperbarui data di EMIS Kemenag; kenapa data santri harus rapi
4. Jenis bantuan Kemenag untuk pesantren (BOP/BOS pesantren, sarpras, inkubasi bisnis) dan syarat umumnya
5. Pesantren Ramah Anak: kewajiban, satgas, kanal pengaduan (Telepontren), langkah pencegahan
6. Checklist dokumen administrasi pesantren (akta yayasan, SK, data santri, keuangan, aset)
7. Cara menyusun laporan keuangan sederhana & transparan untuk wali santri
8. Menghitung dan menagih syahriah/SPP dengan rapi tanpa membebani wali
9. Tata kelola asrama: data kamar, piket, perizinan pulang, kunjungan wali
10. Kesehatan santri: cek kesehatan, poskestren, penanganan penyakit menular di asrama
11. Keamanan & mitigasi bencana di pesantren (kebakaran, banjir, evakuasi)
12. Ijazah & penyetaraan: Pendidikan Diniyah Formal, Muadalah, Satuan Pendidikan Mu'adalah, PKPPS
13. Digitalisasi administrasi: apa yang perlu didigitalkan dulu (data santri → keuangan → akademik)
14. Membangun kanal komunikasi resmi dengan wali (grup, aplikasi, jadwal informasi)
15. Kemandirian ekonomi pesantren: koperasi, unit usaha, sertifikasi halal produk santri

## Wali & Santri (19.00) — ide evergreen

1. Tips memilih pesantren untuk anak (kurikulum, asrama, keamanan, biaya, legalitas)
2. Barang wajib dibawa santri baru (checklist)
3. Cara menyiapkan mental anak sebelum mondok & menghadapi rindu rumah
4. Adab menjenguk/menelepon santri; aturan kunjungan yang umum
5. Tips hafalan Al-Qur'an untuk santri (metode yang lazim di pesantren, dari sumber jelas)
6. Kitab kuning dasar yang biasa dipelajari santri pemula (urutan umum)
7. Istilah-istilah pesantren dan artinya (ro'an, sorogan, bandongan, syahriah, ndalem, dll.)
8. "Tanda kamu pernah mondok" / kehidupan pondok yang relate (sopan, tanpa merendahkan)
9. Kisah singkat ulama/pendiri pesantren (wajib dari sumber tepercaya; tanpa riwayat palsu)
10. Beasiswa untuk santri & alumni pesantren (PBSB, LPDP afirmasi, beasiswa daerah) — cek musimnya
11. Kesehatan & gizi santri; menjaga kebersihan asrama
12. Cara wali memantau perkembangan anak tanpa mengganggu kegiatan pondok
13. Kuis: "Seberapa paham kamu sejarah Hari Santri?" (jawaban di slide terakhir)
14. Karier alumni pesantren & jalur kuliah (PTKIN, Ma'had Aly)
15. Doa/amalan harian santri — hanya dengan rujukan jelas; minta pemilik cek ke ustadz bila ragu

## Fitur PonpesGo (Sabtu 13.00)

Hanya fitur yang sudah dikonfirmasi di `identitas-visual.md`: data santri & asrama (pendaftaran,
biodata, kamar, perizinan pulang), keuangan & SPP/syahriah (tagihan, pembayaran, laporan), akademik &
hafalan (absensi, nilai, setoran hafalan, rapor diniyah), aplikasi wali santri.
Format: masalah nyata pengurus → cara lama yang ribet → cara PonpesGo → ajakan "Komentar DEMO" /
"link di bio". Jangan menyebut harga, jumlah pengguna, atau testimoni yang belum diberikan pemilik.

## Pola hook yang sedang diuji (catat di label.json `hook`)

Berita+dampak · Celah pengetahuan ("Banyak pengurus belum tahu…") · Daftar/angka ("5 dokumen…") ·
Pertanyaan · Hitung mundur · Identitas ("Tanda kamu…"). Lihat `konten/data/pelajaran.md` untuk yang terbukti.
