/* ============================================================
   HumanPatch — app (phone-simulator experience)
   Flow: landing → auth(demo) → profiles → wizard → world prep →
         dashboard → day splash → phone sim → encounter → debrief
   ============================================================ */
"use strict";

const API = "/api";
const $ = (s) => document.querySelector(s);

/* ---------------- state ---------------- */
const state = {
  screen: "landing",           // landing|auth|profiles|wizard|prep|dashboard|splash|phone|debrief
  authMode: "login",
  user: null,                  // {name} demo account
  profiles: [],                // [{id,name,archetype,avatar,day,xp,level,done[]}]
  activeProfileId: null,
  wizard: { step: 1, archetype: null, avatar: "🙂", wallpaper: 0, apps: [], pref: "new" },
  world: null,                 // built world
  session: null,               // backend session (mission queue)
  mission: null,               // active encounter mission
  notifOpen: false,
  openApp: null,               // app currently open in phone
  encounterChat: [],           // chat lines during encounter
  sheet: null,                 // bottom sheet: sender details, link preview
  toast: null,
  debrief: null,
  events: [],                  // observed actions this day
};

/* ---------------- persistence (demo, local) ---------------- */
function saveLocal() {
  try {
    localStorage.setItem("hp2_user", JSON.stringify(state.user));
    localStorage.setItem("hp2_profiles", JSON.stringify(state.profiles));
    localStorage.setItem("hp2_active", JSON.stringify(state.activeProfileId));
  } catch (e) { /* private mode */ }
}
function loadLocal() {
  try {
    state.user = JSON.parse(localStorage.getItem("hp2_user") || "null");
    state.profiles = JSON.parse(localStorage.getItem("hp2_profiles") || "[]");
    state.activeProfileId = JSON.parse(localStorage.getItem("hp2_active") || "null");
  } catch (e) { /* ignore */ }
}

/* ---------------- tiny helpers ---------------- */
const esc = (s) => String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const icons = {
  shield: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/></svg>`,
  check: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>`,
  back: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>`,
  send: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M3.4 20.4 21 12 3.4 3.6l.1 6.6L15 12l-11.5 1.8z"/></svg>`,
  x: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M18 6 6 18M6 6l12 12"/></svg>`,
};
let _toastTimer = null;
function toast(msg) {
  state.toast = msg; render();
  clearTimeout(_toastTimer);
  _toastTimer = setTimeout(() => { state.toast = null; render(); }, 2600);
}

/* ---------------- routing-ish ---------------- */
function go(screen) { state.screen = screen; render(); window.scrollTo(0, 0); }

/* ============================================================
   LANDING
   ============================================================ */
function vLanding() {
  const domains = [
    ["🔐", "Kata Sandi & Akun", "Password unik, 2FA, recovery"],
    ["🎣", "Phishing & Pesan", "Kenali pesan dan tautan janggal"],
    ["🌐", "Browsing Aman", "HTTPS, domain palsu, WiFi umum"],
    ["📸", "Privasi Sosmed", "Apa yang aman dibagikan"],
    ["📱", "Keamanan HP", "Izin aplikasi, APK liar"],
    ["🚨", "Lapor & Pulihkan", "Ke mana melapor saat kena"],
  ];
  return `
  <header class="topbar"><div class="wrap topbar-inner">
    <div class="brand"><div class="brand-mark">${icons.shield}</div><span>HumanPatch<small>Digital life simulator</small></span></div>
    <button class="btn btn-ghost" style="min-height:38px;padding:0 14px;font-size:13px" onclick="go('auth')">Masuk</button>
  </div></header>
  <main class="wrap">
    <section class="hero">
      <p class="kicker" style="color:var(--teal);font-weight:800;font-size:11px;letter-spacing:.14em">SIMULATOR KEHIDUPAN DIGITAL</p>
      <h1>Kehidupan digitalmu, <em>jadi permainannya</em>.</h1>
      <p class="lead">Masuki dunia digital yang dibangun dari hidupmu sehari-hari. Temukan pesan mencurigakan, lindungi akunmu, dan belajar mengenali ancaman digital lewat pengalaman HP pintar yang menyesuaikan diri dengan keputusanmu.</p>
      <div class="ctas">
        <button class="btn btn-primary" onclick="go('auth')">Buat Profil Digitalku</button>
        <button class="btn btn-ghost" onclick="scrollToSec()">Lihat Caranya</button>
      </div>
      <p class="note">Semua aplikasi, pesan, dan akun di dalamnya fiktif. Tanpa akses data aslimu.</p>
    </section>

    <section class="section" id="how">
      <h2>Cara kerjanya</h2>
      <p class="sub">Tiga langkah, tanpa kursus, tanpa kuis.</p>
      <div class="cards">
        <div class="card"><div class="icon-tile" style="background:var(--mint)">🪪</div><h3>1. Buat identitas digital</h3><p>Pilih konteks hidupmu — pelajar, pedagang, pekerja, orang tua. Dunia fiktifmu dibangun dari situ.</p></div>
        <div class="card"><div class="icon-tile" style="background:#FEF3C7">📱</div><h3>2. Hidupi harimu</h3><p>Pesan, notifikasi, dan aplikasi datang seperti biasa. Sebagian normal. Sebagian... janggal.</p></div>
        <div class="card"><div class="icon-tile" style="background:#FFE4E6">🧠</div><h3>3. Belajar dari keputusanmu</h3><p>Setiap keputusan tercatat. Konsekuensinya muncul di hari berikutnya. Coach AI memandu tanpa menghakimi.</p></div>
      </div>
    </section>

    <section class="section">
      <h2>Apa yang kamu pelajari</h2>
      <p class="sub">10 domain keamanan siber — lewat pengalaman, bukan hafalan.</p>
      <div class="domain-grid">
        ${domains.map(d => `<div class="domain-item"><div class="di" style="background:var(--mint)">${d[0]}</div><div><strong>${d[1]}</strong><span>${d[2]}</span></div></div>`).join("")}
      </div>
    </section>

    <section class="section">
      <h2>Satu pelajaran, dunia berbeda</h2>
      <p class="sub">Tujuan belajar yang sama, pengalaman yang berbeda untuk setiap orang.</p>
      <div class="persona-demo">
        <div class="persona-card"><span class="tag">Mahasiswa</span><h4>Rani, 21</h4><ul><li>ChatLoop: grup kelas & beasiswa</li><li>PocketPay + CampusHub</li><li>Ancaman: beasiswa palsu, akun kampus</li></ul></div>
        <div class="persona-card"><span class="tag">Pedagang Online</span><h4>Mbak Sari, 34</h4><ul><li>ChatLoop: pelanggan & supplier</li><li>DailyMart + PocketPay QR</li><li>Ancaman: refund QRIS palsu, toko dibekukan</li></ul></div>
      </div>
    </section>

    <section class="section">
      <h2>Progres yang bermakna</h2>
      <p class="sub">5 hari cerita, XP, pencapaian, dan dunia yang bereaksi.</p>
      <div class="card"><p style="margin:0">Selesaikan hari demi hari. Keputusanmu menentukan bagaimana cerita bercabang — akun yang terselamatkan, atau yang harus dipulihkan. Setiap profil punya progres terpisah.</p></div>
    </section>

    <section class="section">
      <div class="trust-box"><strong>🔒 Privasi by design</strong><p>HumanPatch sepenuhnya simulasi. Kami tidak meminta akses SMS, WhatsApp, kontak, atau aplikasi bank aslimu. Semua pesan dan transaksi di dalamnya fiktif.</p></div>
    </section>

    <section class="section center">
      <h2>Siap memperbaiki kebiasaan digitalmu?</h2>
      <button class="btn btn-primary btn-block mt16" onclick="go('auth')">Buat Profil Digitalku</button>
    </section>
  </main>
  <footer class="site"><div class="wrap">
    <div class="links"><span>Tentang</span><span>Privasi</span><span>Aksesibilitas</span><span>Kontak</span><span>Ketentuan</span></div>
    <p class="fine">HumanPatch — prototype hackathon AMD ACT III. Halaman legal adalah draf.</p>
  </div></footer>`;
}
function scrollToSec() { document.getElementById("how")?.scrollIntoView({ behavior: "smooth" }); }

/* ============================================================
   AUTH (demo)
   ============================================================ */
function vAuth() {
  const isLogin = state.authMode === "login";
  return `
  <div class="auth-wrap"><div class="wrap auth-main">
    <div class="auth-card">
      <div class="brand" style="margin-bottom:14px"><div class="brand-mark">${icons.shield}</div><span>HumanPatch</span></div>
      <h1>${isLogin ? "Selamat datang kembali" : "Buat akun demo"}</h1>
      <p class="sub">${isLogin ? "Masuk untuk melanjutkan dunia digitalmu." : "Prototype ini menyimpan akun secara lokal di browser ini saja."}</p>
      ${isLogin ? "" : `
      <div class="field"><label for="a-name">Nama tampilan</label><input id="a-name" autocomplete="nickname" placeholder="mis. Rani"></div>`}
      <div class="field"><label for="a-pass">Kata sandi demo</label>
        <div style="position:relative">
          <input id="a-pass" type="password" placeholder="minimal 6 karakter" autocomplete="off">
          <button class="pw-toggle" type="button" onclick="togglePw()" aria-label="Tampilkan kata sandi">👁</button>
        </div>
        <p class="err">Kata sandi minimal 6 karakter.</p>
      </div>
      <button class="btn btn-primary btn-block" onclick="doAuth()">${isLogin ? "Masuk" : "Buat Akun Demo"}</button>
      <p class="auth-alt">${isLogin ? "Belum punya akun? <a href='#' onclick=\"setAuth('signup');return false\">Daftar</a>" : "Sudah punya akun? <a href='#' onclick=\"setAuth('login');return false\">Masuk</a>"}</p>
      <div class="demo-note">⚙️ Mode demo: autentikasi tiruan (mock). Tidak ada keamanan sungguhan — jangan pakai sandi asli.</div>
    </div>
  </div></div>`;
}
function setAuth(m) { state.authMode = m; render(); }
function togglePw() { const i = $("#a-pass"); i.type = i.type === "password" ? "text" : "password"; }
function doAuth() {
  const name = $("#a-name")?.value.trim();
  const pass = $("#a-pass")?.value || "";
  if (state.authMode === "signup") {
    if (!name) return toast("Isi nama dulu ya");
    if (pass.length < 6) { $("#a-pass").closest(".field").classList.add("invalid"); return; }
    state.user = { name };
  } else {
    if (pass.length < 6) { $("#a-pass").closest(".field").classList.add("invalid"); return; }
    state.user = { name: state.user?.name || "Pemain" };
  }
  saveLocal(); go("profiles");
}

/* ============================================================
   PROFILES
   ============================================================ */
const ARCHETYPES = [
  { id: "student",  icon: "🎓", name: "Pelajar / Mahasiswa", desc: "Kampus, kosan, beasiswa, sosmed" },
  { id: "merchant", icon: "🛒", name: "Pedagang Online", desc: "Toko online, pelanggan, QRIS" },
  { id: "worker",   icon: "💼", name: "Pekerja Kantoran", desc: "Kantor, HR, slip gaji, deadline" },
  { id: "parent",   icon: "🏠", name: "Orang Tua / Rumah", desc: "Keluarga, SPP, grup WA, belanja" },
  { id: "general",  icon: "🙂", name: "Pengguna Umum", desc: "Keseharian digital pada umumnya" },
];
function vProfiles() {
  const ps = state.profiles;
  return `
  <header class="topbar"><div class="wrap topbar-inner">
    <div class="brand"><div class="brand-mark">${icons.shield}</div><span>HumanPatch</span></div>
    <button class="btn btn-ghost" style="min-height:38px;padding:0 14px;font-size:13px" onclick="go('landing')">Keluar</button>
  </div></header>
  <main class="wrap" style="padding-bottom:40px">
    <section style="padding:22px 0 8px">
      <p class="dim small" style="font-weight:700;letter-spacing:.1em">HAI, ${esc((state.user?.name || "PEMAIN").toUpperCase())}</p>
      <h1 style="font-size:24px;letter-spacing:-.02em">Pilih dunia digitalmu</h1>
      <p class="dim small">Tiap profil punya dunia, kontak, dan cerita sendiri. Progresnya terpisah.</p>
    </section>
    <div class="cards">
      ${ps.map(p => `
        <div class="card" style="display:flex;gap:12px;align-items:center">
          <div class="avatar-xl" style="width:46px;height:46px;font-size:22px">${p.avatar}</div>
          <div style="flex:1">
            <strong style="font-size:15px">${esc(p.name)}</strong>
            <p style="margin:0">${ARCHETYPES.find(a => a.id === p.archetype)?.name || ""} · Hari ${p.day} · Lv ${p.level}</p>
          </div>
          <button class="btn btn-primary" style="min-height:40px;padding:0 16px;font-size:13px" onclick="playProfile('${p.id}')">Main ▸</button>
        </div>`).join("")}
      ${ps.length === 0 ? `<div class="card center"><p>Belum ada profil. Buat dunia digital pertamamu 👇</p></div>` : ""}
    </div>
    <button class="btn btn-dark btn-block mt16" onclick="go('wizard')">＋ Buat Profil Baru</button>
  </main>`;
}
function playProfile(id) {
  state.activeProfileId = id;
  saveLocal();
  go("dashboard");
}

/* ============================================================
   WIZARD
   ============================================================ */
const AVATARS = ["🙂", "😎", "👩‍🎓", "🧑‍🏫", "👩‍💼", "🧑‍🌾", "👨‍🔧", "👩‍💻", "🧕", "👨‍🦱"];
const WALLS = [
  { id: 0, name: "Tetap Teal", css: "linear-gradient(160deg,#0F172A,#134E4A)" },
  { id: 1, name: "Senja", css: "linear-gradient(160deg,#1F2937,#7C2D12)" },
  { id: 2, name: "Lembayung", css: "linear-gradient(160deg,#0F172A,#86198F)" },
  { id: 3, name: "Kelam", css: "linear-gradient(160deg,#0F172A,#3F3F46)" },
];
function vWizard() {
  const w = state.wizard;
  const step = w.step;
  let body = "";
  if (step === 1) {
    body = `<h1>Siapa kamu di dunia digital?</h1><p class="sub">Konteks ini menentukan aplikasi, kontak, dan cerita di dunia fiktifmu.</p>
    <div class="choice-grid">
      ${ARCHETYPES.map(a => `
        <button class="choice ${w.archetype === a.id ? "sel" : ""}" onclick="wizSet('archetype','${a.id}')">
          <span class="ci" style="background:var(--mint)">${a.icon}</span>
          <span><strong>${a.name}</strong><span>${a.desc}</span></span>
        </button>`).join("")}
    </div>`;
  } else if (step === 2) {
    body = `<h1>Kustomisasi HP-mu</h1><p class="sub">Ringan saja — ini dunia fiktifmu.</p>
    <p class="small dim" style="margin-bottom:8px;font-weight:700">AVATAR</p>
    <div class="chips">${AVATARS.map(a => `<button class="chip2 ${w.avatar === a ? "sel" : ""}" onclick="wizSet('avatar','${a}')">${a}</button>`).join("")}</div>
    <p class="small dim" style="margin:16px 0 8px;font-weight:700">WALLPAPER</p>
    <div class="chips">${WALLS.map(x => `<button class="chip2 ${w.wallpaper === x.id ? "sel" : ""}" onclick="wizSet('wallpaper',${x.id})">${x.name}</button>`).join("")}</div>`;
  } else if (step === 3) {
    body = `<h1>Pengalaman belajar</h1><p class="sub">Ini mengatur seberapa sering bantuan muncul — bukan penilaian kemampuanmu.</p>
    <div class="choice-grid">
      ${[["new", "🌱", "Baru kenal keamanan digital", "Penjelasan lebih detail, bimbingan lebih sering"],
         ["basic", "🌿", "Tahu dasar-dasarnya", "Bimbingan seperlunya"],
         ["pro", "🌳", "Rutin online & paham risiko", "Minimal bimbingan, tantangan lebih"]].map(o => `
        <button class="choice ${w.pref === o[0] ? "sel" : ""}" onclick="wizSet('pref','${o[0]}')">
          <span class="ci" style="background:var(--mint)">${o[1]}</span>
          <span><strong>${o[2]}</strong><span>${o[3]}</span></span>
        </button>`).join("")}
    </div>`;
  } else if (step === 4) {
    const a = ARCHETYPES.find(x => x.id === w.archetype);
    body = `<h1>Satu kali cek</h1><p class="sub">Pastikan dunia yang akan dibangun sudah sesuai.</p>
    <div class="card" style="display:flex;gap:14px;align-items:center">
      <div class="avatar-xl">${w.avatar}</div>
      <div><strong style="font-size:16px">Profil ${a ? a.name : ""}</strong>
      <p class="small dim" style="margin:0">${a ? a.desc : ""}</p></div>
    </div>
    <div class="card mt8"><strong class="small">Wallpaper</strong><p class="small dim">${WALLS.find(x => x.id === w.wallpaper)?.name}</p></div>
    <div class="card mt8"><strong class="small">Level bimbingan</strong><p class="small dim">${w.pref === "new" ? "Baru kenal keamanan digital" : w.pref === "basic" ? "Tahu dasar-dasar" : "Rutin online"}</p></div>
    <button class="btn btn-primary btn-block mt16" onclick="createProfile()">Buat Duniaku ▸</button>`;
  }
  return `
  <header class="topbar"><div class="wrap topbar-inner">
    <button class="brand" onclick="go('profiles')"><div class="brand-mark">${icons.shield}</div><span>HumanPatch</span></button>
    <span class="dim small">Langkah ${step}/4</span>
  </div></header>
  <main class="wrap" style="padding-bottom:40px">
    <div class="wizard-progress">${[1,2,3,4].map(i => `<span class="${i < step ? "done" : i === step ? "cur" : ""}"></span>`).join("")}</div>
    ${body}
    ${step > 1 ? `<button class="btn btn-ghost mt16" onclick="wizBack()">◂ Kembali</button>` : `<button class="btn btn-ghost mt16" onclick="go('profiles')">Batal</button>`}
  </main>`;
}
function wizSet(k, v) { state.wizard[k] = v; render(); }
function wizBack() { state.wizard.step--; render(); }
function wizNextAvail() { return state.wizard.step === 1 ? !!state.wizard.archetype : true; }

/* patch: step1 -> auto-advance to 2 on select */
const _origWizSet = wizSet;
wizSet = function(k, v) {
  state.wizard[k] = v;
  if (k === "archetype") { setTimeout(() => { state.wizard.step = 2; render(); }, 220); }
  render();
};

function createProfile() {
  const w = state.wizard;
  const p = {
    id: "p" + Date.now().toString(36),
    name: ARCHETYPES.find(a => a.id === w.archetype).name,
    archetype: w.archetype,
    avatar: w.avatar,
    wallpaper: w.wallpaper,
    pref: w.pref,
    day: 1, xp: 0, level: 1,
    done: [], history: [],
  };
  state.profiles.push(p);
  state.activeProfileId = p.id;
  saveLocal();
  go("prep");
  runPrep();
}

/* ============================================================
   WORLD PREP (loading transition)
   ============================================================ */
function vPrep() {
  return `
  <div class="prep-screen"><div class="wrap prep-inner">
    <div class="prep-phone-mock"></div>
    <h1 style="font-size:22px">Menyiapkan kehidupan digitalmu…</h1>
    <p class="dim small" style="margin-top:6px">Dunia fiktif dibangun dari profilmu.</p>
    <div class="prep-steps">
      ${["Menyiapkan aplikasimu", "Membuat kontak fiktif", "Menyusun aktivitas harian", "Menyiapkan cerita hari pertama"].map((s, i) => `
        <div class="prep-step" id="ps-${i}"><div class="spin"></div><p>${s}</p></div>`).join("")}
    </div>
  </div></div>`;
}
function runPrep() {
  const steps = [0, 1, 2, 3].map(i => $(`#ps-${i}`));
  let i = 0;
  const tick = () => {
    if (i > 0) steps[i - 1]?.classList.replace("on", "done");
    steps[i]?.classList.add("on");
    i++;
    if (i < steps.length) setTimeout(tick, 700);
    else setTimeout(() => { steps[3]?.classList.replace("on", "done"); go("dashboard"); }, 650);
  };
  setTimeout(tick, 300);
}

/* ============================================================
   DASHBOARD
   ============================================================ */
function activeProfile() { return state.profiles.find(p => p.id === state.activeProfileId); }
function vDashboard() {
  const p = activeProfile();
  if (!p) return vProfiles();
  const story = STORY_DAYS[p.day - 1] || STORY_DAYS[4];
  const xpNeed = 100 * p.level;
  const xpPct = Math.min(100, Math.round((p.xp / xpNeed) * 100));
  return `
  <header class="topbar"><div class="wrap topbar-inner">
    <div class="brand"><div class="brand-mark">${icons.shield}</div><span>HumanPatch</span></div>
    <div style="display:flex;gap:8px">
      <button class="btn btn-ghost" style="min-height:36px;padding:0 12px;font-size:12.5px" onclick="go('profiles')">Profil</button>
      <button class="btn btn-ghost" style="min-height:36px;padding:0 12px;font-size:12.5px" onclick="toast('Jurnal segera hadir')">Jurnal</button>
    </div>
  </div></header>
  <main class="wrap" style="padding-bottom:44px">
    <section class="dash-hero">
      <div class="avatar-xl">${p.avatar}</div>
      <div style="flex:1">
        <h1>${esc(p.name)}</h1>
        <div class="lvl-line"><span class="lvl-badge">★ LEVEL ${p.level}</span> <span>${p.xp} / ${xpNeed} XP</span></div>
        <div class="xp-bar"><i style="width:${xpPct}%"></i></div>
      </div>
    </section>

    <div class="dash-cta">
      <div class="play-card">
        <p class="kicker">BAB 1 · HARI ${p.day} DARI 5</p>
        <h2>${story.title}</h2>
        <p>${story.objective}</p>
        <button class="btn" onclick="startDay()">Lanjutkan Cerita ▸</button>
      </div>
    </div>

    <section class="section" style="border-top:none;padding-top:6px">
      <h2 style="font-size:16px">Perjalananmu</h2>
      <p class="sub" style="margin-bottom:12px">Selesaikan hari untuk membuka berikutnya.</p>
      <div class="journey">
        ${STORY_DAYS.map((d, i) => {
          const done = p.done.includes(d.day);
          const cur = d.day === p.day;
          return `<div class="jday ${done ? "done" : ""} ${cur ? "cur" : ""}">
            <div class="jdot">${done ? "✓" : d.day}</div><span>${d.title.split(" ")[0]}</span>
          </div>`;
        }).join("")}
      </div>
    </section>

    <section class="section" style="padding-top:0">
      <h2 style="font-size:16px">Dunia ${esc(p.name)}</h2>
      <p class="sub" style="margin-bottom:10px">Kontak fiktif yang tinggal di HP-mu.</p>
      <div class="cards">
        ${(WORLD_TEMPLATES[p.archetype]?.contacts || []).slice(0, 4).map(c => `
          <div class="card" style="display:flex;gap:10px;align-items:center;padding:12px">
            <div style="width:36px;height:36px;border-radius:50%;background:${c.color};display:grid;place-items:center;font-size:17px">${c.avatar}</div>
            <div><strong class="small">${esc(c.name)}</strong><p style="margin:0" class="small dim">${esc(c.rel)}</p></div>
          </div>`).join("")}
      </div>
    </section>
  </main>`;
}
function startDay() {
  const p = activeProfile();
  state.world = buildWorld(p, p.day);
  go("splash");
}

/* ============================================================
   DAY SPLASH
   ============================================================ */
function vSplash() {
  const w = state.world;
  const story = STORY_DAYS[w.day - 1];
  return `
  <div class="day-splash">
    <p class="daynum">BAB 1 · HARI ${w.day}</p>
    <h1>${story.title}</h1>
    <p>${story.engTitle}</p>
    <div class="obj">🎯 ${story.objective}</div>
    <button class="btn btn-primary" onclick="enterPhone()">Hidupkan HP-mu ▸</button>
    <button class="btn btn-ghost" style="color:#94A3B8;border-color:#334155;margin-top:10px" onclick="go('dashboard')">Kembali</button>
  </div>`;
}

/* ============================================================
   THE SIMULATED PHONE
   ============================================================ */
function vPhone() {
  const w = state.world;
  const p = activeProfile();
  const story = STORY_DAYS[w.day - 1];
  const unread = w.notifs.filter(n => !n.read).length;
  return `
  <div class="phone-stage">
    <div class="phone-topbar">
      <button class="exit" onclick="exitPhone()">◂ Keluar</button>
      <span>Hari ${w.day} · ${story.title}</span>
      <span class="demo-flag">DEMO · AI tiruan</span>
    </div>
    <div class="phone-frame">
      <div class="statusbar">
        <span>${w.phoneTime}</span>
        <span class="sicons"><span class="sbatt">🔋${w.battery}%</span><span>▮▮▮</span></span>
      </div>
      ${state.openApp ? vAppWindow() : vHomeScreen()}
      ${state.notifOpen ? vNotifPanel() : ""}
      ${state.sheet ? vSheet() : ""}
    </div>
    ${state.toast ? `<div class="toast">${esc(state.toast)}</div>` : ""}
  </div>`;
}

function vHomeScreen() {
  const w = state.world;
  const p = activeProfile();
  const wall = WALLS[p.wallpaper]?.css || w.wallpaper;
  const unread = w.notifs.filter(n => !n.read).length;
  const atkApp = w.attack?.app;
  return `
  <div class="homescreen" style="background:${wall}">
    <div class="widget">
      <p class="day-label">Hari ${w.day} — ${STORY_DAYS[w.day - 1].title}</p>
      <h3>Selamat pagi, ${esc(p.name.split(" ")[0] || "Pemain")}</h3>
      <p>${w.day === 1 ? `Jelajahi HP-mu. Coba buka pesan, cek kontak. (Ada ${unread} notifikasi)` : `Ada ${unread} notifikasi baru. Beberapa mungkin penting.`}</p>
    </div>
    <div class="app-grid">
      ${w.apps.map(a => {
        const isAtk = a.id === atkApp && w.attack;
        const badge = a.id === "journal" ? w.day : (isAtk ? "!" : 0);
        return `<button class="app-icon" onclick="openApp('${a.id}')">
          <span class="ai" style="background:${a.bg}">${a.icon}${badge ? `<span class="badge">${badge}</span>` : ""}</span>
          <span class="label">${a.name}</span>
        </button>`;
      }).join("")}
    </div>
    <div class="dock">
      ${["chatloop", "messagebox", "safebrowse", "settings"].map(id => {
        const a = w.apps.find(x => x.id === id) || w.apps[0];
        return `<button class="app-icon" onclick="openApp('${a.id}')">
          <span class="ai" style="background:${a.bg};width:46px;height:46px;font-size:20px">${a.icon}${a.id === atkApp && w.attack ? `<span class="badge">!</span>` : ""}</span>
        </button>`;
      }).join("")}
    </div>
  </div>`;
}

/* ---------- app windows ---------- */
function vAppWindow() {
  const w = state.world;
  const app = state.openApp;
  const meta = w.apps.find(a => a.id === app) || { name: app, icon: "📱", bg: "#64748B" };
  let body = "";
  if (app === "chatloop") body = vChatLoop();
  else if (app === "messagebox") body = vMessageBox();
  else if (app === "journal") body = vJournalApp();
  else if (app === "security") body = vSecurityApp();
  else if (app === "settings") body = vSettingsApp();
  else body = vGenericApp(meta);
  return `
  <div class="appwin">
    <div class="appbar">
      <button class="back" onclick="closeApp()" aria-label="Kembali">${icons.back}</button>
      <h5>${meta.icon} ${meta.name}</h5>
    </div>
    <div class="appbody">${body}</div>
  </div>`;
}
function openApp(id) {
  state.openApp = id;
  if (id === "journal") { /* opens journal view */ }
  render();
  /* attack surfaces: entering the attack app triggers encounter */
  const w = state.world;
  if (w.attack && w.attack.app === id && !w.attack.done) {
    setTimeout(() => startEncounter(), 400);
  }
}
function closeApp() { state.openApp = null; render(); }

/* ChatLoop — list of conversations */
function vChatLoop() {
  const w = state.world;
  const contacts = w.contacts;
  const atk = w.attack;
  const atkThread = atk && atk.app === "chatloop" && !atk.done ? atk : null;
  return `
    ${atkThread ? `
    <div class="chat-list-item unread" onclick="startEncounter()">
      <div class="cav" style="background:#FEE2E2">🤖</div>
      <div class="cb">
        <div class="ct"><strong>${esc(atkThread.from)}</strong><time>09:02</time></div>
        <p>${esc(atkThread.notifText)}</p>
      </div>
      <span class="dot-un"></span>
    </div>` : ""}
    ${contacts.map(c => {
      const msg = chatPreview(c.id, w);
      return `
      <div class="chat-list-item" onclick="toast('Pesan normal. ${esc(c.name)}: &quot;${esc(msg)}&quot;')">
        <div class="cav" style="background:${c.color}">${c.avatar}</div>
        <div class="cb">
          <div class="ct"><strong>${esc(c.name)}</strong><time>08:${String(30 + (c.name.length % 20)).padStart(2, "0")}</time></div>
          <p>${esc(msg)}</p>
        </div>
      </div>`;
    }).join("")}`;
}
function chatPreview(cid, w) {
  const map = {
    ibu: "Jangan lupa makan ya, Nak.",
    bimo: "Bsk gas nonton konser kampus?",
    dosen: "Progress skripsimu bagaimana?",
    kelas: "Bimo: udah pada isi absen belum?",
    kos: "Dek, kerja bakti besok jam 7 ya.",
    supplier: "Stok baru datang besok subuh.",
    pelanggan: "Mbak, stok yang kemarin ada lagi?",
    kurir: "Paket sudah ditinggal di pos ronda, Mbak.",
    grupdagang: "Pak Jaya: harga naik dikit minggu ini.",
    suami: "Tadi transfer jatah bulanan, cek ya.",
    boss: "Deck-ku kirim sebelum siang ya.",
    hrd: "Slip gaji sudah bisa diunduh.",
    temankantor: "Mau ikut lunch nanti?",
    grupkantor: "Meeting 10 pindah ke ruang 3.",
    bendahara: "Reimburse-ku sudah masuk?",
    anak: "Mi, nanti diambil jam 4 ya.",
    walikelas: "Study tour pembayaran sampai Jumat.",
    gruportu: "Bu Guru: cek announcement ya bu.",
    arisan: "Arisan bulan ini di rumah Bu Nani.",
    temen: "Bro, nonton bareng Sabtu?",
    bank: "Transaksi BNVSA berhasi…",
    gruprt: "Pak RT: kerja bakti Minggu pagi.",
    keluarga: "Minggu reuni di rumah Om Sam.",
  };
  return map[cid] || "👍";
}

/* MessageBox (SMS) */
function vMessageBox() {
  const w = state.world;
  const atk = w.attack;
  const atkThread = atk && atk.app === "messagebox" && !atk.done ? atk : null;
  const smsList = [
    { from: "PocketPay", text: "Top-up Rp100.000 berhasil. Saldo Rp384.210.", time: "08:12" },
    { from: "DailyMart", text: "Pesanan #DM-2214 diambil kurir. Sampai besok.", time: "Kemarin" },
  ];
  return `
    ${atkThread ? `
    <div class="chat-list-item unread" onclick="startEncounter()">
      <div class="cav" style="background:#FEE2E2">📩</div>
      <div class="cb">
        <div class="ct"><strong>${esc(atkThread.from)}</strong><time>09:02</time></div>
        <p>${esc(atkThread.notifText)}</p>
      </div><span class="dot-un"></span>
    </div>` : ""}
    ${smsList.map(s => `
      <div class="chat-list-item" onclick="toast('SMS normal: &quot;${esc(s.text)}&quot;')">
        <div class="cav" style="background:#DBEAFE">💬</div>
        <div class="cb"><div class="ct"><strong>${esc(s.from)}</strong><time>${s.time}</time></div><p>${esc(s.text)}</p></div>
      </div>`).join("")}`;
}

/* Journal app (in-phone) */
function vJournalApp() {
  const p = activeProfile();
  const w = state.world;
  return `
    <div class="card"><strong>Hari ${w.day}: ${STORY_DAYS[w.day - 1].title}</strong><p class="small dim">🎯 ${STORY_DAYS[w.day - 1].objective}</p></div>
    <div class="card"><strong class="small">Tindakan tercatat hari ini</strong>
      ${state.events.length ? `<ol class="log-list" style="margin-top:8px">${state.events.map((e, i) => `<li><b>${i + 1}</b><span>${esc(e)}</span></li>`).join("")}</ol>` : `<p class="small dim">Belum ada. Tindakanmu tercatat di sini.</p>`}
    </div>
    <div class="card"><strong class="small">Progres</strong><p class="small dim">Level ${p.level} · ${p.xp} XP · ${p.done.length}/5 hari selesai</p></div>`;
}

/* Security app */
function vSecurityApp() {
  const perms = [
    ["SenterPro", "🔦", "SMS, Kontak, Mikrofon", true],
    ["SocialSquare", "📸", "Kamera, Lokasi", false],
    ["PocketPay", "👛", "Kamera (scan QR)", false],
    ["SafeBrowse", "🌐", "Lokasi (opsional)", true],
  ];
  return `
    <div class="card"><strong>Pemindaian keamanan</strong><p class="small dim">Terakhir dipindai: hari ini 08:00</p></div>
    ${perms.map(x => `
      <div class="card" style="padding:12px">
        <div style="display:flex;gap:10px;align-items:center">
          <span style="font-size:20px">${x[1]}</span>
          <div style="flex:1"><strong class="small">${x[0]}</strong><p class="small dim" style="margin:0">Izin: ${x[2]}</p></div>
          ${x[3] ? `<span class="pill no">PERIKSA</span>` : `<span class="pill ok">OK</span>`}
        </div>
      </div>`).join("")}
    <p class="small dim center">Izin aplikasi di dunia fiktif ini untuk latihan.</p>`;
}

/* Settings app */
function vSettingsApp() {
  const rows = [
    ["📶", "Jaringan & WiFi", "WiFi tersambung: RumahKita_5G"],
    ["🔔", "Notifikasi", "42 notifikasi aktif"],
    ["🔐", "Kunci layar & keamanan", "PIN 6 digit aktif"],
    ["👤", "Akun", "1 akun fiktif tersambung"],
    ["🧩", "Manajemen aplikasi", "10 aplikasi terpasang"],
  ];
  return rows.map(r => `
    <div class="card" style="padding:12px;display:flex;gap:10px;align-items:center" onclick="toast('Pengaturan dunia fiktif — cukup untuk latihan hari ini.')">
      <span style="font-size:18px">${r[0]}</span>
      <div style="flex:1"><strong class="small">${r[1]}</strong><p class="small dim" style="margin:0">${r[2]}</p></div>
      <span class="dim">›</span>
    </div>`).join("");
}

/* generic app */
function vGenericApp(meta) {
  const w = state.world;
  const atk = w.attack;
  if (atk && atk.app === meta.id && !atk.done) {
    return `
      <div class="card center">
        <span style="font-size:34px">${meta.icon}</span>
        <h3 style="margin:6px 0">${esc(atk.from)}</h3>
        <p class="small dim">${esc(atk.notifText)}</p>
        <button class="btn btn-primary btn-block mt8" onclick="startEncounter()">Buka ▸</button>
      </div>`;
  }
  return `<div class="card center"><span style="font-size:34px">${meta.icon}</span><h3 style="margin:6px 0">${esc(meta.name)}</h3><p class="small dim">Beranda ${esc(meta.name)} — dunia fiktif.</p></div>`;
}

/* ---------- notification panel ---------- */
function vNotifPanel() {
  const w = state.world;
  return `
  <div class="notif-panel" onclick="if(event.target===this) toggleNotif(false)">
    <div class="notif-sheet">
      <h4><span>Notifikasi · ${w.notifs.filter(n => !n.read).length} baru</span><button class="dim small" style="font-weight:700" onclick="clearNotifs()">Kosongkan</button></h4>
      ${w.notifs.map(n => `
        <div class="ncard ${n.read ? "read" : ""}">
          <div class="ni" style="background:${(APP_CATALOG[n.app] || {}).bg || "#64748B"}">${(APP_CATALOG[n.app] || {}).icon || "🔔"}</div>
          <div class="nb">
            <div class="nt"><strong>${esc(n.from)}</strong><time>09:0${n.id.slice(-1)}</time></div>
            <p>${esc(n.text)}</p>
            ${n.attack ? `<div class="actions"><button class="pri" onclick="startEncounter()">Buka</button><button onclick="actDismiss('${n.id}')">Abaikan</button></div>` : `<div class="actions"><button onclick="readNotif('${n.id}')">Tandai dibaca</button></div>`}
          </div>
        </div>`).join("")}
    </div>
  </div>`;
}
function toggleNotif(open) { state.notifOpen = open ?? !state.notifOpen; render(); }
function clearNotifs() { state.world.notifs.forEach(n => n.read = true); render(); }
function readNotif(id) { const n = state.world.notifs.find(x => x.id === id); if (n) { n.read = true; trackEvent(`Membuka notifikasi "${n.from}"`); } render(); }
function actDismiss(id) {
  const n = state.world.notifs.find(x => x.id === id);
  if (n) { n.read = true; trackEvent(`Mengabaikan pesan dari "${n.from}"`); }
  render();
  toast("Pesan diabaikan. Kadang itu pilihan tepat — kadang tidak. Hari berikutnya akan menunjukkan.");
}

/* ---------- bottom sheets ---------- */
function vSheet() {
  const s = state.sheet;
  if (s.type === "sender") {
    return `
    <div class="sheet-backdrop" onclick="closeSheet()"></div>
    <div class="sheet">
      <div style="display:flex;gap:12px;align-items:center;margin-bottom:10px">
        <div style="width:48px;height:48px;border-radius:50%;background:${s.color || "#E2E8F0"};display:grid;place-items:center;font-size:22px">${s.avatar || "👤"}</div>
        <div><h3>${esc(s.name)}</h3><p class="sub">${esc(s.sub || "")}</p></div>
      </div>
      <div class="row"><b>Nomor / ID</b><span>${esc(s.number || "0812-••••-•••")}</span></div>
      <div class="row"><b>Terverifikasi?</b><span>${s.verified ? "✔ Ya — badge resmi" : "✖ Tidak ada centang"}</span></div>
      <div class="row"><b>Kontak tersimpan</b><span>${s.saved ? "Ya" : "Tidak — nomor asing"}</span></div>
      <div class="row"><b>Riwayat chat</b><span>${s.history ? "Ada percakapan sebelumnya" : "Baru pertama kali menghubungi"}</div>
      <div class="actions">
        <button class="btn btn-ghost btn-block" onclick="closeSheet(); trackEvent('Memeriksa detail pengirim: ${esc(s.name)}'); toast('Detail pengirim diperiksa ✔'); ">Selesai Memeriksa</button>
      </div>
      <p class="note">Detail dunia fiktif. Kebiasaan memeriksa pengirim = perilaku pelindung.</p>
    </div>`;
  }
  return "";
}
function closeSheet() { state.sheet = null; render(); }

/* ============================================================
   ENCOUNTER (bridges to backend adversary engine)
   ============================================================ */
async function startEncounter() {
  const w = state.world;
  const atk = w.attack;
  if (!atk || atk.done) { toast("Tidak ada kejadian aktif."); return; }
  state.openApp = null;
  state.notifOpen = false;
  state.encounterChat = [];
  state.screen = "encounter";
  render();

  try {
    /* create backend session with archetype persona mapping */
    const personaMap = { student: "mahasiswa", merchant: "umkm", worker: "karyawan", parent: "orangtua", general: "umum" };
    const s = await fetch(`${API}/session`, { method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ persona_id: personaMap[w.profile.archetype] || "umum", lang: "id" }) }).then(r => r.json());
    state.session = s;
    const m = await fetch(`${API}/session/${s.session_id}/mission/start`, { method: "POST" }).then(r => r.json());
    if (m.paywall) { toast(m.msg); state.screen = "phone"; render(); return; }
    state.mission = m;
    state.encounterChat = [{ role: "them", text: m.message, time: nowT() }];
    trackEvent(`Pesan dari "${atk.from}" dibuka`);
    render();
  } catch (e) {
    toast("Koneksi engine gagal: " + e.message);
    state.screen = "phone";
    render();
  }
}
function nowT() { const d = new Date(); return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`; }

function vEncounter() {
  const w = state.world;
  const atk = w.attack;
  const sc = state.mission?.scenario;
  const done = !!state.debrief;
  return `
  <div class="phone-stage">
    <div class="phone-topbar">
      <button class="exit" onclick="exitEncounter()">◂ Kembali ke rumah</button>
      <span>${sc ? esc(sc.title) : "Percakapan"}</span>
      <span class="demo-flag">Lv ${state.mission?.level || 1}</span>
    </div>
    <div class="phone-frame">
      <div class="statusbar"><span>${nowT()}</span><span class="sicons"><span class="sbatt">🔋${w.battery - 2}%</span><span>▮▮▮</span></span></div>
      <div class="appwin">
        <div class="appbar">
          <button class="back" onclick="showSenderSheet()" aria-label="Info pengirim">${atk ? (APP_CATALOG[atk.app] || {}).icon || "💬" : "💬"}</button>
          <h5 onclick="showSenderSheet()" style="cursor:pointer">${esc(atk?.from || "Pengirim")} <span class="dim" style="font-size:11px">· ketuk untuk detail pengirim</span></h5>
          <button class="back" onclick="reportMsg()" aria-label="Laporkan" title="Laporkan">🚩</button>
        </div>
        <div class="appbody" id="chat-scroll">
          ${state.encounterChat.map(l => `
            <div class="bubble-row ${l.role}">
              <div class="bubble">${esc(l.text)}${l.time ? `<time>${l.time}</time>` : ""}</div>
            </div>`).join("")}
          ${state.busy ? `<div class="typing"><i></i><i></i><i></i></div>` : ""}
        </div>
        <div class="chat-input-row">
          <input id="chat-in" placeholder="Balas dengan katamu sendiri…" autocomplete="off" onkeydown="if(event.key==='Enter')sendChat()">
          <button onclick="sendChat()" aria-label="Kirim">${icons.send}</button>
        </div>
      </div>
      ${state.sheet ? vSheet() : ""}
    </div>
    ${state.toast ? `<div class="toast">${esc(state.toast)}</div>` : ""}
  </div>`;
}

async function sendChat() {
  if (state.busy || !state.mission) return;
  const input = $("#chat-in");
  const text = input.value.trim();
  if (!text) return;
  input.value = "";
  state.encounterChat.push({ role: "me", text, time: nowT() });
  state.busy = true;
  render();
  scrollChat();
  try {
    const r = await fetch(`${API}/mission/${state.mission.mission_id}/reply`, { method: "POST",
      headers: { "Content-Type": "application/json" }, body: JSON.stringify({ text }) }).then(r => r.json());
    state.busy = false;
    state.encounterChat.push({ role: "them", text: r.message, time: nowT() });
    if (r.tactic_reason) state.encounterChat.push({ role: "sys", text: "⚙ " + r.tactic_reason });
    render();
    scrollChat();
    if (r.outcome) finishEncounter(r.outcome);
  } catch (e) {
    state.busy = false;
    toast("Gagal: " + e.message);
    render();
  }
}
function scrollChat() { const el = $("#chat-scroll"); if (el) el.scrollTop = el.scrollHeight; }

function showSenderSheet() {
  const atk = state.world?.attack;
  if (!atk) return;
  state.sheet = { type: "sender", name: atk.from, sub: `Pesan via ${(APP_CATALOG[atk.app] || {}).name || "aplikasi"}`,
    number: "0813-" + String(1000 + (atk.seed % 8999)) + "-•••", verified: false, saved: false, history: false, color: "#FEE2E2", avatar: "👤" };
  render();
}

async function reportMsg() {
  if (!state.mission) { toast("Buka percakapan dulu."); return; }
  trackEvent("Menekan lapor (🚩)");
  try {
    const r = await fetch(`${API}/mission/${state.mission.mission_id}/action`, { method: "POST",
      headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "report" }) }).then(r => r.json());
    if (r.outcome) finishEncounter(r.outcome);
    else toast("Laporan tercatat.");
  } catch (e) { toast("Gagal: " + e.message); }
}

async function finishEncounter(outcome) {
  try {
    const d = await fetch(`${API}/mission/${state.mission.mission_id}/debrief`).then(r => r.json());
    state.debrief = { ...d, outcome };
  } catch (e) {
    state.debrief = { summary: { outcome }, coach: "Debrief singkat: " + outcome, indicators: {} };
  }
  state.world.attack.done = true;
  state.screen = "debrief";
  render();
}
function exitEncounter() { state.screen = "phone"; render(); }

/* ============================================================
   DEBRIEF
   ============================================================ */
function vDebrief() {
  const d = state.debrief;
  const p = activeProfile();
  const s = d?.summary || {};
  const ST = { "Teramati": ["ok", "✔ Teramati"], "Belum teramati": ["no", "✖ Belum teramati"], "Perlu diuji": ["todo", "? Perlu diuji"] };
  const inds = Object.entries(s.indicators || {});
  const xpEarn = (s.outcome === "survived" ? 100 : 60) + (s.risky_actions === 0 ? 20 : 0);
  return `
  <div class="debrief-wrap"><div class="wrap">
    <p class="kicker">BEHAVIORAL PATCH · HARI ${state.world.day}</p>
    <h1>${s.outcome === "survived" ? "Kamu bertahan hari ini." : "Kamu terpapar hari ini — dan itu bagian belajar."}</h1>
    <p class="xp-note">+${xpEarn} XP · Coach AI merangkum tindakanmu yang tercatat:</p>
    <div class="deb-cards">
      <div class="deb-card"><h3>🧠 Coach AI</h3><p class="coach">${esc(d?.coach || "-")}</p></div>
      <div class="deb-card"><h3>📊 Indikator perilaku</h3>
        <ul class="ind-list">
          ${inds.map(([k, v]) => `<li><span>${esc(v === "Teramati" ? indLabel(k) : indLabel(k))}</span><span class="pill ${(ST[v] || [])[0] || "todo"}">${(ST[v] || [])[1] || esc(v)}</span></li>`).join("") || "<li><span>Tidak ada data</span></li>"}
        </ul>
      </div>
      <div class="deb-card"><h3>👣 Jejak tindakan</h3>
        <ol class="log-list">${state.events.map((e, i) => `<li><b>${i + 1}</b><span>${esc(e)}</span></li>`).join("") || "<li>—</li>"}</ol>
      </div>
      <div class="deb-card"><h3>🛡️ Prinsip hari ini</h3><p>${esc(principleOfDay(state.world.day))}</p></div>
    </div>
    <div class="deb-actions">
      <button class="btn btn-primary btn-block" onclick="nextDay(${xpEarn})">Lanjut ke Hari ${state.world.day + 1} ▸</button>
      ${state.world.day < 5 ? `<button class="btn btn-ghost btn-block" style="color:#CBD5E1;border-color:#334155" onclick="go('dashboard')">Kembali ke dasbor</button>` : `<button class="btn btn-ghost btn-block" style="color:#CBD5E1;border-color:#334155" onclick="finishChapter()">Selesaikan Bab 1 🎉</button>`}
    </div>
  </div></div>`;
}
function indLabel(k) {
  return { verify_source: "Verifikasi sumber", under_pressure: "Ketahanan terhadap urgensi", protect_data: "Perlindungan data", report_threat: "Pelaporan ancaman" }[k] || k;
}
function principleOfDay(day) {
  return [
    "Kenali 'normal' milikmu — itu baseline untuk mendeteksi kejanggalan.",
    "Tekanan waktu adalah tanda bahaya, bukan alasan buru-buru.",
    "Kontrol akses: izin aplikasi dan pemulihan akun adalah benteng terakhirmu.",
    "Konsekuensi digital datang dari keputusan kecil yang ditunda.",
    "Tahu ke mana melapor sama penting dengan tahu cara mencegah.",
  ][day - 1] || "";
}
function nextDay(xpEarn) {
  const p = activeProfile();
  p.xp += xpEarn;
  if (p.xp >= 100 * p.level) { p.level += 1; toast("Naik level! ⭐"); }
  if (!p.done.includes(p.day)) p.done.push(p.day);
  p.day = Math.min(5, p.day + 1);
  state.debrief = null;
  state.events = [];
  saveLocal();
  go("dashboard");
}
function finishChapter() {
  const p = activeProfile();
  p.xp += 50;
  if (!p.done.includes(5)) p.done.push(5);
  saveLocal();
  toast("Bab 1 selesai! 🎉 +50 XP");
  go("dashboard");
}

/* ============================================================
   PHONE top-level
   ============================================================ */
function enterPhone() { state.screen = "phone"; state.notifOpen = false; render(); }
function exitPhone() {
  if (state.events.length && state.screen === "phone") {
    if (!confirm("Keluar dari simulasi hari ini? Tindakanmu sudah tersimpan.")) return;
  }
  go("dashboard");
}
function trackEvent(text) { state.events.push(text); }

/* ============================================================
   RENDER
   ============================================================ */
function render() {
  const root = $("#root");
  const views = {
    landing: vLanding, auth: vAuth, profiles: vProfiles, wizard: vWizard,
    prep: vPrep, dashboard: vDashboard, splash: vSplash, phone: vPhone,
    encounter: vEncounter, debrief: vDebrief,
  };
  const v = views[state.screen] || vLanding;
  root.innerHTML = v();
}

/* boot */
loadLocal();
if (state.user && state.profiles.length) state.screen = "profiles";
else if (state.user) state.screen = "profiles";
render();
