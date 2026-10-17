// Pengirim pesan Telegram ke pemilik lewat @ponpesgoBot. Hanya jalan di GitHub Actions
// (container Claude tidak bisa menjangkau api.telegram.org).
//
//   node alat/telegram.mjs "teks"        kirim satu pesan
//   node alat/telegram.mjs --kotak-keluar kirim semua konten/data/kirim/*.txt (ditulis routine Claude),
//                                         lalu pindahkan ke konten/data/kirim/terkirim/
//   node alat/telegram.mjs --uji         kirim pesan uji (sekalian mencari ID chat)
//
// Token bot: GitHub Secret TELEGRAM_TOKEN kalau ada, kalau tidak rahasia/telegram.json (terkunci
// dengan gembok yang sama seperti token Instagram, dibuka dengan KUNCI_PRIVAT).
// ID chat: pengaturan.json "telegram_chat_id". Kalau kosong, dicari dari pesan terakhir yang
// dikirim pemilik ke bot (getUpdates), lalu disimpan.
//
// Pengiriman tidak pernah membuat proses gagal: kalau Telegram bermasalah, cukup peringatan di log.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { bukaSandi } from './rahasia.mjs';
import { AKAR, bacaPengaturan, tulisPengaturan, commitDanPush, tarikTerbaru } from './umum.mjs';

const BERKAS_TOKEN = path.join(AKAR, 'rahasia', 'telegram.json');
const DIR_KELUAR = 'konten/data/kirim';
const BATAS = 3900; // batas Telegram 4096 karakter per pesan

function tokenBot() {
  if (process.env.TELEGRAM_TOKEN) return process.env.TELEGRAM_TOKEN.trim();
  if (!fs.existsSync(BERKAS_TOKEN) || !process.env.KUNCI_PRIVAT) return null;
  try {
    return bukaSandi(JSON.parse(fs.readFileSync(BERKAS_TOKEN, 'utf8')), process.env.KUNCI_PRIVAT.trim());
  } catch (e) {
    console.log(`⚠️ Token Telegram tidak bisa dibuka: ${e.message}`);
    return null;
  }
}

async function api(token, metode, param) {
  const basis = (process.env.TELEGRAM_API_BASE || 'https://api.telegram.org').replace(/\/$/, '');
  const res = await fetch(`${basis}/bot${token}/${metode}`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(param || {}),
    signal: AbortSignal.timeout(30000),
  });
  const json = await res.json().catch(() => ({ ok: false, description: `HTTP ${res.status}` }));
  if (!json.ok) throw new Error(String(json.description || `HTTP ${res.status}`).split(token).join('***'));
  return json.result;
}

async function idChat(token) {
  const pengaturan = bacaPengaturan();
  if (pengaturan.telegram_chat_id) return pengaturan.telegram_chat_id;
  const pembaruan = await api(token, 'getUpdates', { allowed_updates: ['message'] });
  const chat = pembaruan.map((u) => u.message?.chat).filter((c) => c?.type === 'private').pop();
  if (!chat) {
    console.log('⚠️ ID chat Telegram belum diketahui. Buka t.me/ponpesgoBot, tekan Start atau kirim pesan apa saja, lalu jalankan workflow "Laporan Telegram" lagi.');
    return null;
  }
  pengaturan.telegram_chat_id = chat.id;
  tulisPengaturan(pengaturan);
  try {
    commitDanPush('📨 Telegram terhubung', ['pengaturan.json']);
  } catch (e) {
    console.log(`⚠️ ID chat belum tersimpan di repo: ${e.message}`);
  }
  return chat.id;
}

function potong(teks) {
  const bagian = [];
  let sisa = String(teks).trim();
  while (sisa.length > BATAS) {
    let i = sisa.lastIndexOf('\n', BATAS);
    if (i < BATAS / 2) i = BATAS;
    bagian.push(sisa.slice(0, i));
    sisa = sisa.slice(i).trim();
  }
  if (sisa) bagian.push(sisa);
  return bagian;
}

export async function kirimTelegram(teks) {
  if (!String(teks || '').trim()) return false;
  const token = tokenBot();
  if (!token) return false;
  try {
    const chat = await idChat(token);
    if (!chat) return false;
    for (const b of potong(teks)) await api(token, 'sendMessage', { chat_id: chat, text: b, disable_web_page_preview: true });
    return true;
  } catch (e) {
    console.log(`⚠️ Pesan Telegram gagal dikirim: ${e.cause?.code || e.message}`);
    return false;
  }
}

async function kotakKeluar() {
  tarikTerbaru();
  const dir = path.join(AKAR, DIR_KELUAR);
  const berkas = fs.existsSync(dir) ? fs.readdirSync(dir).filter((f) => f.endsWith('.txt')).sort() : [];
  if (!berkas.length) return console.log('Kotak keluar kosong.');
  fs.mkdirSync(path.join(dir, 'terkirim'), { recursive: true });
  let terkirim = 0;
  for (const f of berkas) {
    if (!(await kirimTelegram(fs.readFileSync(path.join(dir, f), 'utf8')))) break; // sisanya dicoba lagi nanti
    fs.renameSync(path.join(dir, f), path.join(dir, 'terkirim', f));
    terkirim++;
  }
  console.log(`📨 ${terkirim} dari ${berkas.length} laporan terkirim ke Telegram.`);
  if (terkirim) commitDanPush(`📨 Terkirim ke Telegram: ${terkirim} laporan`, [DIR_KELUAR]);
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const arg = process.argv.slice(2);
  if (arg[0] === '--kotak-keluar') await kotakKeluar();
  else if (arg[0] === '--uji') {
    const ok = await kirimTelegram('✅ @ponpesgoBot terhubung. Laporan PonpesGo (jadwal tayang, performa, dan peringatan) akan masuk ke sini.');
    console.log(ok ? '📨 Pesan uji terkirim.' : 'Pesan uji tidak terkirim (lihat peringatan di atas).');
  } else await kirimTelegram(arg.join(' '));
}
