// buat-reels.mjs "<folder hasil>"
// Membuat Reels SATU GAMBAR ukuran 9:16 (1080×1920) gaya News yang memuat seluruh isi berita carousel:
// foto, label + tanggal, judul, ringkasan, 3–4 poin penting, ajakan follow, dan sumber (keputusan
// pemilik 17 Okt 2026). Instagram hanya menerima Reels berupa video, jadi gambar itu dijadikan video diam
// ±15 detik (cukup untuk dibaca).
//
// Masukan: <folder>/_sumber/data.json (format berita-newsroom.mjs) dan _sumber/foto.jpg bila ada.
// Poin diambil dari "reels": { "poin": ["<b>…</b> …", …] } di data.json kalau ada (disarankan, tulis
// ringkas ≤ 120 karakter per poin); kalau tidak, diambil otomatis dari slide isi.
// Keluaran: <folder>/reels.png, <folder>/reels.mp4, dan <folder>/caption-reels.txt kalau belum ada
// (sengaja berbeda dari caption carousel supaya pengaman dobel penerbit tidak tertukar).
// Musik: berkas bebas royalti di assets/musik/ (mp3/m4a/aac/wav) dipilih bergilir; kalau kosong, senyap.
//
//   FFMPEG  jalur ffmpeg (baku: /tmp/ff/node_modules/ffmpeg-static/ffmpeg, lalu "ffmpeg")
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const W = 1080, H = 1920, DURASI = 15, FPS = 30;

const folder = process.argv[2] && path.resolve(process.argv[2]);
if (!folder || !fs.existsSync(path.join(folder, '_sumber', 'data.json'))) {
  console.error('Pakai: node buat-reels.mjs "<folder hasil berisi _sumber/data.json>"');
  process.exit(1);
}
const dirSkill = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const render = path.resolve(dirSkill, '../alat/render.sh');
const src = path.join(folder, '_sumber');
const d = JSON.parse(fs.readFileSync(path.join(src, 'data.json'), 'utf8'));

function jalankan(cmd, args) {
  const r = spawnSync(cmd, args, { encoding: 'utf8' });
  if (r.status !== 0) throw new Error(`${path.basename(cmd)} gagal: ${(r.stderr || r.stdout || '').trim().slice(-600)}`);
  return r.stdout;
}
const ff = [process.env.FFMPEG, '/tmp/ff/node_modules/ffmpeg-static/ffmpeg'].find((f) => f && fs.existsSync(f)) || 'ffmpeg';
const uri = (f, tipe) => `data:${tipe};base64,${fs.readFileSync(f).toString('base64')}`;
const LOGO = uri(path.join(dirSkill, 'assets/logo/ponpesgo-logo-resmi-320.png'), 'image/png');
const fotoBerkas = d.foto && path.resolve(src, d.foto);
const FOTO = fotoBerkas && fs.existsSync(fotoBerkas) ? uri(fotoBerkas, /\.png$/i.test(fotoBerkas) ? 'image/png' : 'image/jpeg') : null;
const esc = (s) => String(s ?? '');
const polos = (s) => esc(s).replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();

// Poin ringkas: dari data.reels.poin, atau satu poin per slide isi (judul slide + kalimat pertama).
function ringkas(teks, maks = 120) {
  const t = polos(teks);
  if (t.length <= maks) return t;
  const kalimat = t.match(/^.{30,}?[.!?](\s|$)/);
  if (kalimat && kalimat[0].length <= maks) return kalimat[0].trim();
  return `${t.slice(0, maks).replace(/\s+\S*$/, '')}…`;
}
const poin = d.reels?.poin?.length ? d.reels.poin : d.slide.map((s) => {
  const isi = s.poin?.[0] || s.isi || (s.kartu || []).map(([a, b]) => `${a}: ${b}`).join(' · ');
  return `<b>${polos(s.judul).replace(/\?$/, '')}:</b> ${ringkas(isi)}`;
});

const html = `<!doctype html><html lang="id"><head><meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Oswald:wght@500;600;700&display=swap" rel="stylesheet">
<style>:root{--s:1;--merah:#E02B2B;--biru:#1E4FD8}
*{margin:0;padding:0;box-sizing:border-box}
html,body{width:${W}px;height:${H}px;overflow:hidden;background:#0A1330;color:#fff;font-family:'Plus Jakarta Sans',sans-serif}
.grid{position:absolute;inset:0;background-image:linear-gradient(rgba(255,255,255,.035) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.035) 1px,transparent 1px);background-size:60px 60px}
.glow{position:absolute;border-radius:50%;background:radial-gradient(circle,rgba(30,79,216,.5),transparent 65%)}
.foto{position:absolute;left:0;right:0;top:0;height:900px;background:url(${FOTO || ''}) ${d.posisiFoto || '50% 35%'}/cover;-webkit-mask-image:linear-gradient(#000 55%,transparent);mask-image:linear-gradient(#000 55%,transparent)}
.foto:after{content:"";position:absolute;inset:0;background:linear-gradient(180deg,rgba(10,19,48,.9) 0%,rgba(10,19,48,.35) 18%,rgba(10,19,48,.1) 35%,rgba(10,19,48,.55) 75%,rgba(10,19,48,.9) 100%)}
.top{position:absolute;left:70px;right:70px;top:96px;display:flex;align-items:center;gap:14px;z-index:2}
.logo{width:64px;height:65px;background:url(${LOGO}) center/contain no-repeat;flex:none}
.top b{display:block;font-size:32px;font-weight:800;line-height:1}.top small{display:block;font-size:14px;font-weight:700;letter-spacing:1.8px;margin-top:6px;color:#8FB1FF}
.kredit{position:absolute;right:70px;top:600px;font-size:19px;color:rgba(255,255,255,.8);font-weight:600}
.isi{position:absolute;left:70px;right:110px;top:${FOTO ? 640 : 300}px;bottom:330px;display:flex;flex-direction:column;justify-content:flex-start}
.label{display:flex;font-family:Oswald;font-weight:600;font-size:calc(30px*var(--s));letter-spacing:3px}
.label span{background:var(--merah);padding:8px 18px}.label em{font-style:normal;background:#fff;color:#0F1B3D;padding:8px 18px}
h1{font-family:Oswald;font-weight:700;font-size:calc(88px*var(--s));line-height:1.02;text-transform:uppercase;margin-top:22px}
h1 mark{background:none;color:#FF5A5A}
.deck{font-size:calc(31px*var(--s));line-height:1.38;color:#C9D6FF;font-weight:500;border-left:8px solid var(--merah);padding-left:24px;margin-top:26px}
.kp{margin-top:34px;font-family:Oswald;font-weight:600;font-size:calc(26px*var(--s));letter-spacing:3px;color:#FF5A5A}
.poin{margin-top:16px;background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.12);border-radius:22px;padding:calc(26px*var(--s)) 28px}
.poin div{display:flex;gap:20px;align-items:flex-start}.poin div+div{margin-top:calc(20px*var(--s))}
.poin i{flex:none;width:44px;height:44px;border-radius:50%;background:var(--merah);font-style:normal;font-family:Oswald;font-weight:700;font-size:25px;display:grid;place-items:center;margin-top:2px}
.poin p{font-size:calc(29px*var(--s));line-height:1.36;color:#D5DEFA}.poin p b{color:#fff}
.cta{position:absolute;left:70px;right:110px;bottom:226px;display:flex;gap:16px}
.cta div{flex:1;height:84px;border-radius:18px;display:flex;align-items:center;justify-content:center;font-weight:800;font-size:27px}
.cta .m{background:var(--merah)}.cta .p{border:3px solid #fff;font-size:24px}
.src{position:absolute;left:70px;right:110px;bottom:178px;font-size:20px;color:#7F8DB5}
svg{position:absolute;left:0;bottom:0}</style></head><body>
<div class="grid"></div><div class="glow" style="right:-260px;top:${FOTO ? 760 : 120}px;width:820px;height:820px"></div><div class="glow" style="left:-300px;bottom:120px;width:760px;height:760px"></div>
${FOTO ? `<div class="foto"></div><div class="kredit">${esc(d.kredit || '')}</div>` : ''}
<div class="top"><div class="logo"></div><div><b>PonpesGo</b><small>PLATFORM MANAJEMEN PESANTREN DIGITAL</small></div></div>
<div class="isi" id="isi">
  <div class="label"><span>${esc(d.label || 'KABAR TERKINI')}</span><em>${esc(d.tanggal)}</em></div>
  <h1>${esc(d.judul).replace(/\*(.+?)\*/g, '<mark>$1</mark>')}</h1>
  ${d.deck ? `<div class="deck">${esc(d.deck)}</div>` : ''}
  <div class="kp">POIN PENTING</div>
  <div class="poin">${poin.map((p, k) => `<div><i>${k + 1}</i><p>${p}</p></div>`).join('')}</div>
</div>
<div class="cta"><div class="m">Follow @ponpesgo +</div><div class="p">Coba PonpesGo · link di bio</div></div>
<div class="src">${esc(d.sumber)}</div>
<svg width="${W}" height="170" viewBox="0 0 ${W} 170"><defs><linearGradient id="gM" x1="0" x2="1"><stop offset="0" stop-color="#C81E25"/><stop offset=".5" stop-color="#FF4B4B"/><stop offset="1" stop-color="#E02B2B"/></linearGradient></defs>
  <path d="M-10 92 C260 92,360 150,540 132 S820 92,1090 92" fill="none" stroke="#1E4FD8" stroke-width="6"/>
  <path d="M-10 52 C260 52,360 0,540 16 S820 52,1090 52" fill="none" stroke="url(#gM)" stroke-width="10"/></svg>
<script>
// Muat semua isi: kecilkan huruf bertahap sampai poin terakhir tidak melewati batas bawah area isi.
const isi=document.getElementById('isi');let s=1;
function muat(){while(isi.scrollHeight>isi.clientHeight+1&&s>0.7){s-=0.03;document.documentElement.style.setProperty('--s',s);}}
document.fonts.ready.then(muat);muat();
</script></body></html>`;

const reelsHtml = path.join(src, 'reels.html');
const reelsPng = path.join(folder, 'reels.png');
fs.writeFileSync(reelsHtml, html);
jalankan('sh', [render, reelsHtml, reelsPng, String(W), String(H)]);

// Video diam dari gambar tunggal (+ musik opsional)
const dirMusik = path.join(dirSkill, 'assets', 'musik');
const musik = fs.existsSync(dirMusik) ? fs.readdirSync(dirMusik).filter((f) => /\.(mp3|m4a|aac|wav)$/i.test(f)).sort() : [];
const pilihMusik = musik.length ? path.join(dirMusik, musik[[...path.basename(folder)].reduce((a, c) => a + c.charCodeAt(0), 0) % musik.length]) : null;
const daftarKredit = fs.existsSync(path.join(dirMusik, 'kredit.json')) ? JSON.parse(fs.readFileSync(path.join(dirMusik, 'kredit.json'), 'utf8')) : {};
const kreditMusik = pilihMusik ? daftarKredit[path.basename(pilihMusik)] || '' : '';
const keluar = path.join(folder, 'reels.mp4');
jalankan(ff, [
  '-y', '-loglevel', 'error',
  '-loop', '1', '-framerate', String(FPS), '-t', String(DURASI), '-i', reelsPng,
  ...(pilihMusik ? ['-stream_loop', '-1', '-i', pilihMusik] : ['-f', 'lavfi', '-i', 'anullsrc=r=48000:cl=stereo']),
  '-filter_complex', `[0:v]scale=${W}:${H},format=yuv420p[v]${pilihMusik ? `;[1:a]volume=0.7,afade=t=in:d=0.8,afade=t=out:st=${DURASI - 1.5}:d=1.5[a]` : ''}`,
  '-map', '[v]', '-map', pilihMusik ? '[a]' : '1:a',
  '-t', String(DURASI), '-r', String(FPS),
  '-c:v', 'libx264', '-preset', 'medium', '-crf', '20', '-tune', 'stillimage', '-profile:v', 'high', '-pix_fmt', 'yuv420p',
  '-c:a', 'aac', '-b:a', '128k', '-ar', '48000', '-movflags', '+faststart', keluar,
]);

// Caption Reels (sekali; boleh disunting sesudahnya)
const capReels = path.join(folder, 'caption-reels.txt');
const capCarousel = path.join(folder, 'caption.txt');
if (!fs.existsSync(capReels) && fs.existsSync(capCarousel)) {
  const baris = fs.readFileSync(capCarousel, 'utf8').replace(/\r\n/g, '\n').trim().split('\n');
  const tagar = baris.filter((b) => /^#/.test(b.trim())).pop() || '#santri #pesantren #PonpesGo';
  const sumber = baris.find((b) => /^Sumber/i.test(b.trim())) || '';
  fs.writeFileSync(capReels, [
    baris[0],
    '',
    'Penjelasan lengkapnya ada di postingan carousel kami. Cek profil @ponpesgo, lalu simpan dan kirim ke grup pesantrenmu 📌',
    '',
    'Follow untuk kabar pesantren setiap hari.',
    ...(sumber ? ['', sumber] : []),
    ...(kreditMusik ? [kreditMusik] : []),
    '',
    `${tagar} #reels`,
  ].join('\n').trim() + '\n');
}

if (kreditMusik && fs.existsSync(capReels) && !fs.readFileSync(capReels, 'utf8').includes(kreditMusik)) {
  const c = fs.readFileSync(capReels, 'utf8').trim().split('\n');
  const i = c.findIndex((b) => /^#/.test(b.trim()));
  c.splice(i < 0 ? c.length : i, 0, kreditMusik, '');
  fs.writeFileSync(capReels, c.join('\n').replace(/\n{3,}/g, '\n\n').trim() + '\n');
}
const mb = (fs.statSync(keluar).size / 1048576).toFixed(1);
console.log(`ok: ${reelsPng} + reels.mp4 (${DURASI} dtk, ${mb} MB${pilihMusik ? `, musik ${path.basename(pilihMusik)}` : ', senyap'})`);
