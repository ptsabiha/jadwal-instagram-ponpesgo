// berita-newsroom.mjs <data.json> <keluaran.html>
// Membuat HTML carousel berita 5 slide gaya Newsroom (konsep A) dari satu berkas data.
// Render tiap slide dengan query v=1..5 (1080x1440). Contoh data: lihat references/gaya-media-berita.md.
//
// data.json:
// { "label": "KABAR TERKINI", "tanggal": "JUMAT, 16 OKT 2026",
//   "judul": "PELATIHAN AI *GRATIS* UNTUK PENDIDIK PESANTREN",   (*kata* = merah)
//   "deck": "…", "ticker": "kemenag.go.id · …", "foto": "foto.jpg", "posisiFoto": "40% 30%",
//   "kredit": "Foto: Kemenag", "sumber": "Sumber: kemenag.go.id, 16 Okt 2026",
//   "slide": [ { "judul": "…", "isi": "… <b>tebal</b> …", "kartu": [["LABEL","teks"],…],
//                "poin": ["…"], "kutip": ["teks kutipan", "NAMA PENUTUR"] }, … 3 slide ],
//   "catatan": { "judul": "Apa artinya untuk pesantren?", "poin": ["<b>…</b> …"], "fitur": "…" } }
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const [, , masuk, keluar] = process.argv;
if (!masuk || !keluar) { console.error('Pakai: node berita-newsroom.mjs data.json keluaran.html'); process.exit(1); }
const d = JSON.parse(fs.readFileSync(masuk, 'utf8'));
const dirData = path.dirname(path.resolve(masuk));
const dirSkill = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const uri = (f, tipe) => `data:${tipe};base64,${fs.readFileSync(f).toString('base64')}`;
const LOGO = uri(path.join(dirSkill, 'assets/logo/ponpesgo-logo-resmi-320.png'), 'image/png');
const FOTO = d.foto ? uri(path.resolve(dirData, d.foto), /\.png$/i.test(d.foto) ? 'image/png' : 'image/jpeg') : null;
const esc = (s) => String(s ?? '');
const merah = (s) => esc(s).replace(/\*(.+?)\*/g, '<mark>$1</mark>');
const n = 2 + d.slide.length;
const top = (i) => `<div class="top"><div class="brand"><div class="logo"></div><div><b>PonpesGo</b><small>KABAR PESANTREN</small></div></div><div class="dots">${Array.from({ length: n }, (_, k) => `<i${k + 1 === i ? ' class="on"' : ''}></i>`).join('')}</div></div>`;

function slideIsi(s, i) {
  let y = 430; // posisi judul
  const judulBaris = Math.ceil(esc(s.judul).length / 19);
  let isi = '';
  let ytxt = y + judulBaris * 92 + 40;
  if (s.isi) { isi += `<div class="isi" style="top:${ytxt}px">${s.isi}</div>`; ytxt += Math.ceil(esc(s.isi).replace(/<[^>]+>/g, '').length / 46) * 51 + 40; }
  if (s.kartu) { isi += `<div class="daf" style="top:${ytxt}px">${s.kartu.map(([b, t]) => `<div><b>${b}</b><span>${t}</span></div>`).join('')}</div>`; ytxt += Math.ceil(s.kartu.length / 2) * 168 + 30; }
  if (s.poin) { isi += `<div class="poin" style="top:${ytxt}px">${s.poin.map((p, k) => `<div><i>${k + 1}</i><p>${p}</p></div>`).join('')}</div>`; ytxt += s.poin.reduce((a, p) => a + Math.ceil(esc(p).replace(/<[^>]+>/g, '').length / 46) * 45 + 26, 0) + 10; }
  if (s.kutip) isi += `<div class="kutip" style="top:${Math.max(ytxt, 900)}px">“${s.kutip[0]}”<small>${s.kutip[1]}</small></div>`;
  return `<section class="s A" id="s${i}"><div class="grid"></div><div class="glow"></div>${top(i)}
  <div class="no">${String(i - 1).padStart(2, '0')}</div><h2>${esc(s.judul)}</h2>${isi}
  <div class="src">${esc(s.sumber || d.sumber)}</div></section>`;
}

const sampul = `<section class="s A A1b" id="s1"><div class="grid"></div>${FOTO ? '<div class="foto"></div>' : '<div class="glow"></div>'}
  ${top(1)}${FOTO ? `<div class="kredit">${esc(d.kredit || 'Foto: Kemenag')}</div>` : ''}
  <div class="label"><span>${esc(d.label || 'KABAR TERKINI')}</span><em>${esc(d.tanggal)}</em></div>
  <h1>${merah(d.judul)}</h1>
  <div class="deck">${esc(d.deck)}</div>
  <div class="ticker"><b>SUMBER</b>${esc(d.ticker)}</div>
  <svg class="sambung" viewBox="0 0 1080 1440"><defs><linearGradient id="gM" x1="0" x2="1"><stop offset="0" stop-color="#C81E25"/><stop offset=".5" stop-color="#FF4B4B"/><stop offset="1" stop-color="#E02B2B"/></linearGradient></defs>
  <line x1="45" y1="0" x2="45" y2="60" stroke="#1E4FD8" stroke-width="4"/><circle cx="45" cy="64" r="9" fill="#E02B2B"/>
  <line x1="45" y1="1300" x2="45" y2="1440" stroke="#1E4FD8" stroke-width="4"/>
  <path d="M-10 1300 H0 C260 1300,360 1370,540 1350 S820 1300,1080 1300 H1090" fill="none" stroke="#1E4FD8" stroke-width="6"/>
  <path d="M-10 1250 H0 C260 1250,360 1170,540 1190 S820 1250,1080 1250 H1090" fill="none" stroke="url(#gM)" stroke-width="10"/>
  <circle cx="45" cy="1300" r="9" fill="#1E4FD8"/></svg></section>`;

const c = d.catatan;
const penutup = `<section class="s A" id="s${n}"><div class="grid"></div><div class="glow"></div>${top(n)}
  <div class="tagc">CATATAN PONPESGO</div><h2 style="top:340px">${esc(c.judul)}</h2>
  <div class="poin" style="top:585px">${c.poin.map((p, k) => `<div><i>${k + 1}</i><p>${p}</p></div>`).join('')}</div>
  <div class="fitur">${esc(c.fitur || 'PonpesGo membantu pesantren mengelola <b>data santri</b>, <b>akademik</b>, dan <b>keuangan</b> secara digital.')}</div>
  <div class="cta"><div class="m">Follow akun ini +</div><div class="p">Coba PonpesGo · link di bio</div></div>
  <div class="src">Saran redaksi PonpesGo, bukan ketentuan resmi.</div></section>`;

const css = `:root{--navy:#0F1B3D;--biru:#1E4FD8;--merah:#E02B2B}
*{margin:0;padding:0;box-sizing:border-box}
html,body{width:1080px;height:1440px;overflow:hidden;background:#0A1330;font-family:'Plus Jakarta Sans',sans-serif}
.s{position:absolute;inset:0;display:none;overflow:hidden}.s.on{display:block}
.logo{width:62px;height:63px;background:url(${LOGO}) center/contain no-repeat;filter:drop-shadow(0 6px 10px rgba(10,79,216,.25));flex:none}
.brand{display:flex;align-items:center;gap:14px}.brand b{display:block;font-size:31px;font-weight:800;letter-spacing:-.4px;line-height:1}
.brand small{display:block;font-size:15px;font-weight:700;letter-spacing:2.6px;margin-top:6px;color:#8FB1FF}
.dots{display:flex;gap:9px}.dots i{width:13px;height:13px;border-radius:7px;background:rgba(255,255,255,.22)}.dots i.on{width:42px;background:var(--merah)}
.sambung{position:absolute;left:0;top:0;width:1080px;height:1440px;pointer-events:none}
.A{background:#0A1330;color:#fff}
.A .grid{position:absolute;inset:0;background-image:linear-gradient(rgba(255,255,255,.035) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.035) 1px,transparent 1px);background-size:60px 60px}
.A .glow{position:absolute;right:-220px;top:-160px;width:760px;height:760px;border-radius:50%;background:radial-gradient(circle,rgba(30,79,216,.55),transparent 65%)}
.A .top{position:absolute;left:90px;right:90px;top:96px;display:flex;justify-content:space-between;align-items:center;z-index:2}
.A .foto{position:absolute;left:0;right:0;top:0;height:780px;background:url(${FOTO || ''}) ${d.posisiFoto || '40% 30%'}/cover}
.A .foto:after{content:"";position:absolute;inset:0;background:linear-gradient(180deg,rgba(10,19,48,.92) 0%,rgba(10,19,48,.55) 16%,rgba(10,19,48,.12) 30%,rgba(10,19,48,.25) 55%,#0A1330 100%)}
.A .kredit{position:absolute;right:90px;top:410px;font-size:19px;color:rgba(255,255,255,.8);font-weight:600}
.A .label{position:absolute;left:90px;top:468px;display:flex;font-family:'Oswald';font-weight:600;font-size:30px;letter-spacing:3px}
.A .label span{background:var(--merah);color:#fff;padding:10px 20px}.A .label em{font-style:normal;background:#fff;color:var(--navy);padding:10px 20px}
.A h1{position:absolute;left:90px;right:80px;top:548px;font-family:'Oswald';font-weight:700;font-size:92px;line-height:1.02;text-transform:uppercase}
.A h1 mark{background:none;color:#FF5A5A}
.A .deck{position:absolute;left:90px;right:120px;top:962px;font-size:34px;line-height:1.35;color:#C9D6FF;font-weight:500;border-left:8px solid var(--merah);padding-left:26px}
.A .ticker{position:absolute;left:0;right:0;top:1100px;height:78px;display:flex;align-items:center;background:#fff;font-weight:700;font-size:24px;color:var(--navy)}
.A .ticker b{height:100%;display:flex;align-items:center;background:var(--merah);color:#fff;font-family:'Oswald';letter-spacing:3px;padding:0 26px 0 90px;font-size:27px;margin-right:24px}
.A .no{position:absolute;left:90px;top:250px;font-family:'Oswald';font-weight:700;font-size:150px;color:var(--merah);line-height:1}
.A h2{position:absolute;left:90px;right:90px;top:430px;font-family:'Oswald';font-weight:700;font-size:86px;line-height:1.05;text-transform:uppercase}
.A .isi{position:absolute;left:90px;right:110px;font-size:33px;line-height:1.5;color:#D5DEFA}.A .isi b{color:#fff}
.A .daf{position:absolute;left:90px;right:90px;display:grid;grid-template-columns:1fr 1fr;gap:18px}
.A .daf div{background:rgba(255,255,255,.07);border:1px solid rgba(255,255,255,.12);border-radius:18px;padding:22px 24px;height:150px}
.A .daf b{display:block;font-family:'Oswald';font-weight:600;font-size:22px;letter-spacing:2px;color:#FF5A5A}
.A .daf span{display:block;font-size:28px;font-weight:700;color:#fff;margin-top:6px;line-height:1.2}
.A .kutip{position:absolute;left:90px;right:90px;background:rgba(255,255,255,.07);border-left:10px solid var(--merah);padding:28px 34px;font-size:33px;line-height:1.4;font-weight:600}
.A .kutip small{display:block;font-size:22px;color:#8FB1FF;margin-top:12px;font-weight:600;letter-spacing:.5px}
.A .tagc{position:absolute;left:90px;top:262px;font-family:'Oswald';font-weight:600;font-size:28px;letter-spacing:3px;background:#FFD36B;color:#0A1330;padding:8px 18px}
.A .poin{position:absolute;left:90px;right:90px}
.A .poin div{display:flex;gap:22px;align-items:flex-start;margin-bottom:26px}
.A .poin i{flex:none;width:46px;height:46px;border-radius:50%;background:var(--merah);color:#fff;font-style:normal;font-family:'Oswald';font-weight:700;font-size:26px;display:grid;place-items:center;margin-top:2px}
.A .poin p{font-size:31px;line-height:1.38;color:#D5DEFA}.A .poin p b{color:#fff}
.A .fitur{position:absolute;left:90px;right:90px;top:960px;font-size:27px;line-height:1.4;color:#AFC3F5}.A .fitur b{color:#fff}
.A .cta{position:absolute;left:90px;right:90px;top:1060px;display:flex;gap:18px}
.A .cta div{flex:1;height:96px;border-radius:20px;display:flex;align-items:center;justify-content:center;font-weight:800;font-size:29px}
.A .cta .m{background:var(--merah)}.A .cta .p{border:3px solid #fff;font-size:26px}
.A .src{position:absolute;left:90px;bottom:70px;font-size:21px;color:#7F8DB5}`;

const html = `<!doctype html><html lang="id"><head><meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Oswald:wght@500;600;700&display=swap" rel="stylesheet">
<style>${css}</style></head><body>
${sampul}
${d.slide.map((s, k) => slideIsi(s, k + 2)).join('\n')}
${penutup}
<script>const v=new URLSearchParams(location.search).get('v')||'1';document.getElementById('s'+v).classList.add('on');</script>
</body></html>`;
fs.writeFileSync(keluar, html);
console.log(`ok: ${keluar} (${n} slide; render dengan v=1..${n})`);
