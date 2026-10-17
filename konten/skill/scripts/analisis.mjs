// analisis.mjs [--simpan <laporan.md>]
// Membaca konten/data/performa.json (diisi otomatis alat/insight.mjs di GitHub Actions), antrean
// antrian/*/post.json, dan label opsional konten/data/label.json, lalu mencetak laporan Markdown:
// angka akun, peringkat postingan berdasarkan Skor FYP, pola per jam/hari/pilar/jenis hook, dan
// sinyal otomatis. Kesimpulan akhirnya tetap ditulis Claude (lihat references/analisis-konten.md).
//
// Skor FYP  = (3×kirim + 2×simpan + 2×follow + 1×komentar + 0,5×suka) ÷ jangkauan × 100
// Indeks jangkauan = jangkauan postingan ÷ median jangkauan akun (1,0 = biasa; ≥1,5 = melesat)
//
// label.json (opsional, diisi routine saat menjadwalkan): { "<id antrean>": { "pilar": "Berita",
//   "hook": "Berita+dampak", "topik": "…" } }. Tanpa label, pilar dan hook ditebak dari judul.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const AKAR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../..');
const baca = (j, baku) => (fs.existsSync(path.join(AKAR, j)) ? JSON.parse(fs.readFileSync(path.join(AKAR, j), 'utf8')) : baku);
const iSimpan = process.argv.indexOf('--simpan');
const simpanKe = iSimpan > 0 ? process.argv[iSimpan + 1] : null;

const performa = baca('konten/data/performa.json', null);
const label = baca('konten/data/label.json', {});
const keluaran = [];
const tulis = (s = '') => keluaran.push(s);

const HARI = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
const wib = (iso) => new Date(new Date(iso).getTime() + 7 * 3600000);
const median = (xs) => {
  const a = xs.filter((x) => Number.isFinite(x)).sort((p, q) => p - q);
  if (!a.length) return null;
  const t = Math.floor(a.length / 2);
  return a.length % 2 ? a[t] : (a[t - 1] + a[t]) / 2;
};
const pct = (x) => (x == null ? '–' : `${x.toFixed(1).replace('.', ',')}%`);
const ang = (x, d = 0) => (x == null ? '–' : x.toFixed(d).replace('.', ','));

function tebakPilar(judul) {
  if (/^berita/i.test(judul)) return 'Berita';
  if (/hari santri|maulid|muharram|ramadan|hut ri|hari guru|idul/i.test(judul)) return 'Momen';
  return 'Edukasi';
}
function tebakHook(judul) {
  const j = judul.replace(/^berita:\s*/i, '');
  if (/hari lagi|^h-\d|hitung mundur/i.test(j)) return 'Hitung mundur';
  if (/\?\s*(\(.*\))?$/.test(j)) return 'Pertanyaan';
  if (/^\d+\s/.test(j)) return 'Daftar/angka';
  if (/tanda|kamu|relate/i.test(j)) return 'Identitas';
  if (/belum tahu|ternyata|rahasia|kenapa/i.test(j)) return 'Celah pengetahuan';
  return 'Berita+dampak';
}

if (!performa || !Object.keys(performa.postingan || {}).length) {
  tulis('# Analisis Konten PonpesGo');
  tulis();
  tulis('Belum ada data performa. `konten/data/performa.json` diisi otomatis oleh workflow');
  tulis('"Insight Instagram" (tiap ±3 jam) setelah ada postingan yang tayang.');
  if (performa?.galat?.length) performa.galat.forEach((g) => tulis(`- ⚠️ ${g}`));
  selesai();
}

// ---------- Baris per postingan ----------
const antrean = {};
const dirAntrian = path.join(AKAR, 'antrian');
if (fs.existsSync(dirAntrian)) {
  for (const id of fs.readdirSync(dirAntrian)) {
    const f = path.join(dirAntrian, id, 'post.json');
    if (fs.existsSync(f)) antrean[id] = JSON.parse(fs.readFileSync(f, 'utf8'));
  }
}

const baris = Object.entries(performa.postingan).map(([id, p]) => {
  const basis = p.snapshot?.['48j'] ? '48j' : p.snapshot?.['24j'] ? '24j' : 'terbaru';
  const s = basis === 'terbaru' ? p.terbaru : p.snapshot[basis];
  const m = s?.metrik || {};
  const r = m.reach || null;
  const lb = label[id] || {};
  const t = wib(p.terbit_pada);
  const per = (x) => (r && x != null ? (x / r) * 100 : null);
  const interaksi = ['likes', 'comments', 'saved', 'shares'].reduce((a, k) => a + (m[k] || 0), 0);
  return {
    id, judul: p.judul.replace(/^berita:\s*/i, '').replace(/\s*\(v\d+\)$/i, ''), permalink: p.permalink, basis, umur: s?.umur_jam ?? null,
    jam: `${String(t.getUTCHours()).padStart(2, '0')}.00`, hari: HARI[t.getUTCDay()],
    jenis: p.jenis === 'reels' ? 'Reels' : 'Carousel',
    pilar: lb.pilar || tebakPilar(p.judul), hook: lb.hook || tebakHook(p.judul),
    panjang: ((n) => (n <= 6 ? '≤6 kata' : n <= 10 ? '7–10 kata' : '>10 kata'))((antrean[id]?.judul || p.judul).replace(/^berita:\s*/i, '').split(/\s+/).length),
    m, r,
    er: per(interaksi), simpan: per(m.saved), kirim: per(m.shares), follow: per(m.follows),
    tayangPerOrang: r && m.views != null ? m.views / r : null,
    skor: r ? ((3 * (m.shares || 0) + 2 * (m.saved || 0) + 2 * (m.follows || 0) + (m.comments || 0) + 0.5 * (m.likes || 0)) / r) * 100 : null,
  };
});
const adaJangkauan = baris.some((b) => b.r);
const medR = median(baris.map((b) => b.r));
for (const b of baris) b.indeks = b.r && medR ? b.r / medR : null;
baris.sort((a, b) => (b.skor ?? -1) - (a.skor ?? -1) || (b.m.likes ?? 0) - (a.m.likes ?? 0));

// ---------- Laporan ----------
tulis('# Analisis Konten PonpesGo');
tulis();
tulis(`Data insight terakhir: ${performa.diperbarui || '?'} · ${baris.length} postingan dianalisis.`);
tulis();

tulis('## Akun');
const a = performa.akun || {};
const fh = a.follower_harian || [];
const f7 = fh.length > 1 ? fh[Math.max(0, fh.length - 8)] : null;
tulis(`- Follower: **${a.follower ?? '?'}**${f7 && a.follower != null ? ` (${a.follower - f7.follower >= 0 ? '+' : ''}${a.follower - f7.follower} sejak ${f7.tanggal})` : ''}`);
const j7 = a.jangkauan_7h;
if (j7?.total) {
  const luar = j7.non_follower != null ? (j7.non_follower / j7.total) * 100 : null;
  tulis(`- Jangkauan 7 hari: ${j7.total} akun, non-follower ${pct(luar)} ${luar == null ? '' : luar >= 50 ? '(✅ sudah banyak menjangkau orang baru / Explore)' : '(masih didominasi follower)'}`);
}
if (a.follower_online) tulis('- Data jam online follower tersedia (`akun.follower_online`, jam Pasifik: tambah 14 jam untuk WIB, atau 15 jam saat musim panas AS).');
tulis();

tulis('## Peringkat postingan');
if (!adaJangkauan) tulis('> ⚠️ Jangkauan belum tersedia (izin insight belum ada), jadi rasio dan Skor FYP belum bisa dihitung. Urutan memakai jumlah suka.');
tulis();
tulis('| # | Postingan | Basis | Jangkauan | Indeks | Suka | Komen | Simpan | Kirim | Follow | ER | Simpan% | Kirim% | Skor FYP |');
tulis('|---|---|---|---|---|---|---|---|---|---|---|---|---|---|');
baris.forEach((b, i) => {
  const nama = b.permalink ? `[${b.judul}](${b.permalink})` : b.judul;
  tulis(`| ${i + 1} | ${nama} (${b.hari} ${b.jam}) | ${b.basis}${b.basis === 'terbaru' && b.umur != null ? ` ${Math.round(b.umur)} jam` : ''} | ${b.r ?? '–'} | ${ang(b.indeks, 2)} | ${b.m.likes ?? '–'} | ${b.m.comments ?? '–'} | ${b.m.saved ?? '–'} | ${b.m.shares ?? '–'} | ${b.m.follows ?? '–'} | ${pct(b.er)} | ${pct(b.simpan)} | ${pct(b.kirim)} | ${ang(b.skor, 2)} |`);
});
tulis();
tulis(`Median akun: jangkauan ${ang(medR)}, ER ${pct(median(baris.map((b) => b.er)))}, simpan ${pct(median(baris.map((b) => b.simpan)))}, kirim ${pct(median(baris.map((b) => b.kirim)))}, Skor FYP ${ang(median(baris.map((b) => b.skor)), 2)}.`);
tulis();

tulis('## Pola per kelompok');
tulis('Kelompok dengan kurang dari 5 postingan ditandai *belum cukup data*; jangan ubah strategi karenanya.');
const medSkor = median(baris.map((b) => b.skor));
const sinyal = [];
for (const [dim, nama] of [['jenis', 'Format (Carousel/Reels)'], ['jam', 'Jam tayang'], ['hari', 'Hari'], ['pilar', 'Pilar'], ['hook', 'Jenis hook'], ['panjang', 'Panjang judul']]) {
  const grup = {};
  for (const b of baris) (grup[b[dim]] ||= []).push(b);
  tulis();
  tulis(`**${nama}**`);
  tulis();
  tulis('| Kelompok | n | Median Skor FYP | Median indeks jangkauan | Catatan |');
  tulis('|---|---|---|---|---|');
  for (const [k, bs] of Object.entries(grup).sort((x, y) => (median(y[1].map((b) => b.skor)) ?? -1) - (median(x[1].map((b) => b.skor)) ?? -1))) {
    const ms = median(bs.map((b) => b.skor));
    let cat = bs.length < 5 ? 'belum cukup data' : '';
    if (bs.length >= 5 && ms != null && medSkor) {
      if (ms >= 1.2 * medSkor) { cat = '⬆️ di atas median akun'; sinyal.push(`Ulangi: ${nama.toLowerCase()} "${k}" (median Skor FYP ${ang(ms, 2)} vs akun ${ang(medSkor, 2)}, n=${bs.length}).`); }
      if (ms <= 0.8 * medSkor) { cat = '⬇️ di bawah median akun'; sinyal.push(`Kurangi/ubah: ${nama.toLowerCase()} "${k}" (median Skor FYP ${ang(ms, 2)}, n=${bs.length}).`); }
    }
    tulis(`| ${k} | ${bs.length} | ${ang(ms, 2)} | ${ang(median(bs.map((b) => b.indeks)), 2)} | ${cat} |`);
  }
}
tulis();

tulis('## Sinyal otomatis');
const medKirim = median(baris.map((b) => b.kirim));
for (const b of baris) {
  if (b.indeks >= 1.5 && b.basis !== 'terbaru') sinyal.push(`Melesat: "${b.judul}" menjangkau ${ang(b.indeks, 1)}× median. Buat turunan/sekuel topik ini dalam 72 jam.`);
  if (b.kirim != null && b.kirim >= 1 && b.kirim >= 1.3 * (medKirim || 0)) sinyal.push(`Banyak dikirim: "${b.judul}" (kirim ${pct(b.kirim)}). Formatnya layak diulang.`);
  if (b.indeks >= 1.2 && b.follow != null && b.follow < 0.3) sinyal.push(`Jangkauan tinggi tapi follow rendah: "${b.judul}". Perkuat slide terakhir dan alasan follow.`);
}
const bertumbuh = baris.filter((b) => b.basis === 'terbaru' && b.umur != null && b.umur < 24);
if (bertumbuh.length) sinyal.push(`${bertumbuh.length} postingan belum berumur 24 jam; angkanya masih bergerak, jangan disimpulkan dulu.`);
if (baris.length < 10) sinyal.push(`Baru ${baris.length} postingan. Patokan memakai angka awal di references/metrik-evaluasi.md sampai ada 10+ postingan.`);
for (const g of performa.galat || []) sinyal.push(`⚠️ ${g}`);
if (!sinyal.length) tulis('- Belum ada sinyal kuat.');
for (const s of [...new Set(sinyal)]) tulis(`- ${s}`);
selesai();

function selesai() {
  const teks = keluaran.join('\n') + '\n';
  if (simpanKe) {
    fs.mkdirSync(path.dirname(path.resolve(simpanKe)), { recursive: true });
    fs.writeFileSync(simpanKe, teks);
  }
  process.stdout.write(teks);
  process.exit(0);
}
