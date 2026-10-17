// Pengambil insight Instagram. Dijalankan workflow insight.yml (tiap ±3 jam) di GitHub Actions.
// Hasilnya ditulis ke konten/data/performa.json, lalu dibaca skrip analisis skill
// (konten/skill/scripts/analisis.mjs) dan routine Claude untuk menyimpulkan konten mana yang berhasil.
//
// Yang diambil:
//   - per postingan berstatus "terbit" (punya media_id): jangkauan, tayangan, suka, komentar, simpan,
//     kirim, follow, kunjungan profil. Snapshot dikunci di umur 24 jam, 48 jam, dan 7 hari supaya
//     postingan bisa dibandingkan pada umur yang sama.
//   - akun: jumlah follower (satu catatan per hari WIB), jangkauan 7 hari follower vs non-follower,
//     dan jam online follower (kalau Instagram menyediakannya; butuh ±100 follower).
//
// Insight butuh izin token instagram_business_manage_insights. Kalau belum ada, suka & komentar
// tetap dicatat dari data dasar postingan dan galatnya ditulis di performa.json (tidak membuat
// workflow merah, supaya tidak membanjiri email).
//
//   IG_API_BASE  ganti host API untuk uji dengan server tiruan
import fs from 'node:fs';
import path from 'node:path';
import { buatKlien, jelaskanGalat } from './ig.mjs';
import { bacaBerkasToken, kunciPrivatDariEnv, bukaSandi } from './rahasia.mjs';
import { AKAR, bacaSemua, bacaPengaturan, commitDanPush, tarikTerbaru, isoZona, formatWIB } from './umum.mjs';

export const JALUR_PERFORMA = 'konten/data/performa.json';
const BERKAS = path.join(AKAR, JALUR_PERFORMA);
const JAM = 3600000;
const MAKS_UMUR_JAM = 8 * 24; // setelah ini angka postingan nyaris tidak berubah lagi
const PATOKAN = [['24j', 24], ['48j', 48], ['7h', 168]];
const METRIK = {
  feed: ['reach', 'views', 'likes', 'comments', 'saved', 'shares', 'total_interactions', 'follows', 'profile_visits'],
  reels: ['reach', 'views', 'likes', 'comments', 'saved', 'shares', 'total_interactions', 'ig_reels_avg_watch_time', 'ig_reels_video_view_total_time'],
};

const ringkasan = [];
function catat(baris) {
  console.log(baris);
  ringkasan.push(baris);
}

utama().then((kode) => selesai(kode), (e) => {
  catat(`❌ ${e.message}`);
  selesai(1);
});

function selesai(kode) {
  if (process.env.GITHUB_STEP_SUMMARY) {
    fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY, `### Insight Instagram\n\n${ringkasan.map((b) => `- ${b}`).join('\n')}\n`);
  }
  process.exitCode = kode;
}

function bacaPerforma() {
  const data = { akun: {}, postingan: {}, ...(fs.existsSync(BERKAS) ? JSON.parse(fs.readFileSync(BERKAS, 'utf8')) : {}) };
  // Metrik yang ditolak Instagram dicatat per jenis media (dulu satu daftar untuk feed saja).
  if (!data.metrik_ditolak || Array.isArray(data.metrik_ditolak)) data.metrik_ditolak = { feed: data.metrik_ditolak || [], reels: [] };
  return data;
}

async function utama() {
  tarikTerbaru();
  const pengaturan = bacaPengaturan();
  const berkas = bacaBerkasToken();
  if (!berkas) throw new Error('Token Instagram belum dipasang. Jalankan "Pasang Token Instagram.bat".');
  const ig = buatKlien(bukaSandi(berkas, kunciPrivatDariEnv()));

  let saya;
  try {
    saya = await ig.get('/me', { fields: 'user_id,username,followers_count,media_count' });
  } catch (e) {
    throw new Error(jelaskanGalat(e));
  }
  if (pengaturan.akun && String(saya.username).toLowerCase() !== pengaturan.akun.toLowerCase()) {
    throw new Error(`Token ini milik @${saya.username}, bukan @${pengaturan.akun}. Insight tidak diambil.`);
  }
  const igId = saya.user_id || saya.id;
  const sekarang = new Date();
  const data = bacaPerforma();
  const galat = [];

  // ---------- Akun ----------
  const tanggal = isoZona(sekarang).slice(0, 10);
  const riwayat = (data.akun.follower_harian || []).filter((r) => r.tanggal !== tanggal);
  if (saya.followers_count != null) riwayat.push({ tanggal, follower: saya.followers_count });
  data.akun = {
    ...data.akun,
    username: saya.username,
    follower: saya.followers_count ?? null,
    jumlah_postingan: saya.media_count ?? null,
    follower_harian: riwayat.slice(-120),
  };
  catat(`Akun @${saya.username}: ${saya.followers_count ?? '?'} follower, ${saya.media_count ?? '?'} postingan.`);

  try {
    const r = await ig.get(`/${igId}/insights`, {
      metric: 'reach', period: 'day', metric_type: 'total_value', breakdown: 'follow_type',
      since: String(Math.floor((sekarang - 7 * 24 * JAM) / 1000)), until: String(Math.floor(sekarang / 1000)),
    });
    const tv = r.data?.[0]?.total_value;
    const bagian = {};
    for (const b of tv?.breakdowns?.[0]?.results || []) bagian[String(b.dimension_values?.[0]).toUpperCase()] = b.value;
    data.akun.jangkauan_7h = {
      pada: isoZona(sekarang),
      total: tv?.value ?? null,
      follower: bagian.FOLLOWER ?? null,
      non_follower: bagian.NON_FOLLOWER ?? null,
    };
  } catch (e) {
    galat.push(`Jangkauan akun 7 hari: ${jelaskanGalat(e)}`);
  }

  try {
    const r = await ig.get(`/${igId}/insights`, { metric: 'online_followers', period: 'lifetime' });
    // Nilai: { "0": n, ..., "23": n } dalam jam Pasifik (America/Los_Angeles). Disimpan apa adanya.
    const nilai = r.data?.[0]?.values?.filter((v) => v.value && Object.keys(v.value).length) || [];
    if (nilai.length) data.akun.follower_online = { pada: isoZona(sekarang), zona: 'America/Los_Angeles', per_hari: nilai };
  } catch {
    // Wajar untuk akun di bawah ±100 follower; tidak dicatat sebagai galat.
  }

  // ---------- Postingan ----------
  const terbit = bacaSemua().filter((p) => p.status === 'terbit' && p.media_id && p.terbit_pada);
  let diambil = 0;
  for (const p of terbit) {
    const lama = data.postingan[p.id] || {};
    const umurJam = (sekarang - new Date(p.terbit_pada)) / JAM;
    if (umurJam > MAKS_UMUR_JAM && lama.snapshot?.['7h']) continue;

    const metrik = {};
    try {
      const dasar = await ig.get(`/${p.media_id}`, { fields: 'like_count,comments_count,media_type' });
      metrik.likes = dasar.like_count ?? null;
      metrik.comments = dasar.comments_count ?? null;
    } catch (e) {
      galat.push(`${p.judul}: ${jelaskanGalat(e)}`);
      continue;
    }
    Object.assign(metrik, await ambilInsightMedia(ig, p, data, galat));
    diambil++;

    const potret = { pada: isoZona(sekarang), umur_jam: Math.round(umurJam * 10) / 10, metrik };
    const snapshot = { ...lama.snapshot };
    PATOKAN.forEach(([nama, jam], i) => {
      const berikut = PATOKAN[i + 1]?.[1];
      if (snapshot[nama] || umurJam < jam) return;
      // Patokan yang sudah lewat jauh (mis. data baru mulai diambil di umur 3 hari) tidak diisi,
      // supaya angka 24 jam tidak tercampur angka hari ketiga. Patokan terakhir selalu diisi.
      if (berikut && umurJam >= berikut) return;
      snapshot[nama] = potret;
    });
    data.postingan[p.id] = {
      judul: p.judul,
      media_id: p.media_id,
      permalink: p.permalink || null,
      terbit_pada: p.terbit_pada,
      jenis: p.jenis === 'reels' ? 'reels' : 'carousel',
      jumlah_slide: p.slide?.length ?? null,
      terbaru: potret,
      snapshot,
    };
  }

  data.diperbarui = isoZona(sekarang);
  data.galat = [...new Set(galat)];
  fs.mkdirSync(path.dirname(BERKAS), { recursive: true });
  fs.writeFileSync(BERKAS, JSON.stringify(data, null, 2) + '\n');
  catat(`📊 Insight ${diambil} postingan diperbarui (${formatWIB(data.diperbarui)}).`);
  for (const g of data.galat) catat(`⚠️ ${g}`);
  commitDanPush(`📊 Insight: ${diambil} postingan, ${saya.followers_count ?? '?'} follower`, [JALUR_PERFORMA]);
  return 0;
}

// Minta semua metrik sekaligus. Kalau Instagram menolak salah satunya (kode 100), coba satu per satu
// dan ingat metrik yang ditolak supaya putaran berikutnya tidak memintanya lagi.
async function ambilInsightMedia(ig, p, data, galat) {
  const jenis = p.jenis === 'reels' ? 'reels' : 'feed';
  const ditolak = (data.metrik_ditolak[jenis] ||= []);
  const diminta = METRIK[jenis].filter((m) => !ditolak.includes(m));
  const hasil = {};
  const baca = (r) => {
    for (const d of r.data || []) hasil[d.name] = d.total_value?.value ?? d.values?.[0]?.value ?? null;
  };
  try {
    baca(await ig.get(`/${p.media_id}/insights`, { metric: diminta.join(',') }));
    return hasil;
  } catch (e) {
    if (e.kode === 10 || e.kode === 200 || /permission/i.test(e.message || '')) {
      galat.push(`Insight belum bisa dibaca (izin instagram_business_manage_insights belum ada di token). Hanya suka & komentar yang tercatat. Buat token baru yang mencentang izin itu, lalu jalankan "Pasang Token Instagram.bat". (${e.message})`);
      return hasil;
    }
    if (e.kode !== 100) {
      galat.push(`${p.judul}: ${jelaskanGalat(e)}`);
      return hasil;
    }
  }
  for (const m of diminta) {
    try {
      baca(await ig.get(`/${p.media_id}/insights`, { metric: m }));
    } catch (e) {
      if (e.kode === 100 && /metric/i.test(e.message || '') && !ditolak.includes(m)) ditolak.push(m);
    }
  }
  return hasil;
}
