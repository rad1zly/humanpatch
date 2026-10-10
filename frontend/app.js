/* HumanPatch UI — mockup design + live engine (FastAPI backend + LLM adversary) */

const API = "/api";

const ACTION_LABEL = {
  verify: "Memeriksa sumber resmi",
  ask: "Bertanya kepada pengirim",
  click: "Membuka tautan simulasi",
  report: "Melaporkan pesan",
  fill: "Mengisi data di halaman simulasi",
  leave: "Keluar tanpa mengisi data",
};

const ICONS = {
  mahasiswa: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 10 12 5 2 10l10 5 10-5Z"/><path d="M6 12v5c0 1 2.5 3 6 3s6-2 6-3v-5"/></svg>',
  umkm: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7"/><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><path d="M15 22v-4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4"/><path d="M2 7h20"/></svg>',
  karyawan: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="20" height="14" x="2" y="7" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>',
  orangtua: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>',
  pensiunan: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="3" x2="21" y1="22" y2="22"/><line x1="6" x2="6" y1="18" y2="11"/><line x1="10" x2="10" y1="18" y2="11"/><line x1="14" x2="14" y1="18" y2="11"/><line x1="18" x2="18" y1="18" y2="11"/><polygon points="12 2 20 7 4 7"/></svg>',
  umum: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="8" r="4"/><path d="M20 21a8 8 0 0 0-16 0"/></svg>',
};

const STATUS = { teramati: "Teramati", belum: "Belum teramati", perlu: "Perlu diuji" };

/* ---------------- live engine state ---------------- */
const state = {
  screen: "intro",
  profile: 0,
  personas: [],
  session: null,      // {session_id, persona}
  mission: null,      // current mission payload from API
  lines: [],          // chat log: {role: them|you|note|typing, text}
  tactic: "Pembukaan sesuai profil",
  reason: "Profil hanya memilih skenario awal. Jalur berikutnya ditentukan tindakan, bukan pekerjaan.",
  events: [],
  busy: false,
  debrief: null,
  sandbox: false,
  lastTyped: Date.now(),
};

async function j(url, opts) {
  const r = await fetch(API + url, opts);
  return r.json();
}
async function post(url, body) {
  return j(url, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body || {}) });
}

function line(role, text) { state.lines.push({ role, text }); }
function busyNote(on) {
  if (on) line("typing", "");
  else state.lines = state.lines.filter((l) => l.role !== "typing");
  render();
}

async function boot() {
  state.personas = await j("/personas");
  render();
}

async function beginSession() {
  const persona = state.personas[state.profile];
  const s = await post("/session", { persona_id: persona.id });
  state.session = s;
  await nextMission();
}

async function nextMission() {
  const r = await post(`/session/${state.session.session_id}/mission/start`);
  if (r.paywall) { state.screen = "paywall"; render(); return; }
  state.mission = r;
  state.lines = [];
  state.events = [];
  state.sandbox = false;
  state.debrief = null;
  state.tactic = "Pembukaan sesuai profil";
  state.reason = "Skenario dibuka sesuai profil. Tindakan pertamamu menentukan taktik lawan.";
  line("them", r.message);
  state.screen = "sim";
  render();
}

const ACTION_API = {
  verify: "verify_sender",
  click: "open_link",
  report: "report",
  fill: "fill",
  leave: "leave",
};

async function act(action) {
  if (state.busy || !state.mission) return;
  state.busy = true;
  const label = ACTION_LABEL[action] || action;
  line("you", label);
  const r = await post(`/mission/${state.mission.mission_id}/action`, { action: ACTION_API[action] || action });
  applyEngineResult(r, true);
  state.busy = false;
}

async function sendText() {
  const input = document.getElementById("freechat");
  const text = input.value.trim();
  if (!text || state.busy || !state.mission) return;
  state.busy = true;
  const delay = Date.now() - state.lastTyped;
  input.value = "";
  line("you", text);
  state.lastTyped = Date.now();
  busyNote(true);
  const r = await post(`/mission/${state.mission.mission_id}/reply`, { text, delay_ms: delay });
  busyNote(false);
  applyEngineResult(r, false);
  state.busy = false;
}

function applyEngineResult(r, fromAction) {
  if (r.message && !fromAction) line("them", r.message);
  if (r.note && fromAction) line("note", r.note);
  if (r.tactic_reason) { state.reason = r.tactic_reason; state.tactic = TACTIC_LABEL[r.tactic] || r.tactic; }
  if (r.signals) r.signals.forEach((s) => { if (!state.events.includes(s)) state.events.push(s); });
  if (r.sandbox) {
    state.sandbox = true;
    line("note", "Tautan hanya membuka halaman sandbox di dalam latihan. Tidak ada situs luar.");
  }
  if (r.finished || r.outcome) {
    line("note", "Simulasi dihentikan. Tidak ada pesan yang dikirim ke orang sungguhan.");
    finishMission();
  } else {
    render();
  }
}

const TACTIC_LABEL = {
  pressure: "Tekanan & urgensi",
  good_cop: "Menenangkan untuk membangun kepercayaan",
  last_ditch: "Desakan terakhir",
  give_up: "Lawan menyerah",
  success: "Lawan mendapat yang ia mau",
};

async function finishMission() {
  const d = await j(`/mission/${state.mission.mission_id}/debrief`);
  state.debrief = d;
  state.screen = "report";
  render();
}

/* ---------------- views ---------------- */

function esc(value) {
  const amp = String.fromCharCode(38);
  return String(value).split(amp).join(amp + "amp;").split("<").join(amp + "lt;").split(">").join(amp + "gt;").split('"').join(amp + "quot;");
}

function mark() {
  return '<span class="mark" aria-hidden="true"><i><b class="on"></b><b></b><b></b><b class="on"></b></i></span>';
}

function steps() {
  const items = [["profile", "Profil"], ["sim", "Lawan"], ["report", "Patch"]];
  return `<nav class="steps" aria-label="Layar">${items
    .map(([id, label], index) => `<button type="button" data-go="${id}" class="${state.screen === id ? "on" : ""}"><em>${index + 1}</em><span class="lbl">${label}</span></button>`)
    .join("")}</nav>`;
}

function shell(body) {
  return `<header class="bar wrap"><button type="button" class="brand" data-go="intro">${mark()}<span><strong>HumanPatch</strong><span>Adversary live</span></span></button>${steps()}</header><main class="wrap">${body}</main>`;
}

function intro() {
  return `<section class="hero"><div><p class="kicker">Adaptive adversary</p><h1>Lawan yang berubah mengikuti keputusanmu.</h1><p class="lead">Bukan kuis. Bukan template yang sama untuk semua orang. Pilih profil, lalu AI menyerang di sandbox dan menyesuaikan taktik — bicara lewat teks seperti chat sungguhan.</p><div class="row"><button class="cta" type="button" data-go="profile">Mulai simulasi</button><p class="note">Semua identitas, tautan, dan transaksi fiktif. Adversary dijalankan LLM di AMD GPU.</p></div></div><aside class="card"><div class="card-head"><p class="tiny">Contoh jalur</p><span class="pill">State berubah</span></div><ol class="path"><li><b>01</b><div><strong>Profil mahasiswa</strong><span>Skenario pembuka: beasiswa fiktif.</span></div></li><li><b>02</b><div><strong>User memverifikasi</strong><span>Lawan menaikkan urgensi, bukan mengulang pesan.</span></div></li><li><b>03</b><div><strong>Patch perilaku</strong><span>Coaching merujuk tindakan yang benar-benar terjadi.</span></div></li></ol></aside></section>`;
}

function profileScreen() {
  const persona = state.personas[state.profile] || { name: "?", context: "" };
  const cards = state.personas
    .map((item, index) => `<button type="button" class="profile${index === state.profile ? " on" : ""}" data-pick="${index}" style="color:${index === state.profile ? "var(--amber)" : "var(--muted)"}">${ICONS[item.id] || ICONS.umum}<strong style="color:var(--fg)">${esc(item.name)}</strong><span>${esc(item.context)}</span></button>`)
    .join("");
  return `<section><p class="kicker">Langkah 1</p><h1 style="margin-top:0.75rem">Latihan sebagai siapa?</h1><p class="lead">Profil hanya mengatur serangan pembuka. Jalur setelah itu mengikuti apa yang kamu lakukan — dan kamu bebas membalas dengan kata-katamu sendiri.</p><div class="profiles">${cards}</div><div class="row"><button class="cta" type="button" data-begin>Hadapi lawan</button><p class="note">Skenario: ${esc(persona.context.toLowerCase())}.</p></div></section>`;
}

function bubbles() {
  return state.lines
    .map((item) => {
      if (item.role === "note") return `<p class="sys">${esc(item.text)}</p>`;
      if (item.role === "typing") return `<p class="sys typing-note">• • •</p>`;
      return `<p class="bubble ${item.role === "you" ? "you" : "them"}">${esc(item.text)}</p>`;
    })
    .join("");
}

function fakePage() {
  const page = (state.mission && state.mission.scenario.page) || { title: "Halaman tiruan", hint: "", fields: [] };
  return `<div class="fake"><p class="warn">Halaman tiruan · tidak terhubung</p><strong>${esc(page.title)}</strong><p>${esc(page.hint)}</p>${(page.fields || []).map((f) => `<div class="field"><span style="position:relative;top:50%;transform:translateY(-50%);padding:0 .7rem;color:var(--muted);font-size:.8rem">${esc(f)}</span></div>`).join("")}</div>`;
}

function chatActions() {
  if (state.sandbox) return ["leave", "fill", "report"];
  if (!state.mission || state.debrief) return [];
  return ["verify", "click", "report"];
}

function actionButtons(actions) {
  return actions
    .map((action) => {
      const risk = action === "click" || action === "fill";
      const wide = action === "report" ? " wide" : "";
      return `<button type="button" class="act${risk ? " risk" : ""}${wide}" data-act="${action}"><span style="color:${risk ? "var(--risk)" : "var(--amber)"}">●</span>${esc(ACTION_LABEL[action])}</button>`;
    })
    .join("");
}

function sim() {
  const sc = state.mission.scenario;
  const actions = chatActions();
  const log = state.events.length === 0 ? "<li>Belum ada tindakan. Pilihan pertama akan mengubah state.</li>" : state.events.map((e, i) => `<li>${i + 1}. ${esc(e)}</li>`).join("");
  const chatbox = state.sandbox ? "" : `<div class="chatbox"><input id="freechat" placeholder="Balas dengan katamu sendiri…" autocomplete="off" /><button type="button" id="sendbtn" aria-label="Kirim">➤</button></div>`;
  return `<section class="sim"><div class="phone"><div class="phone-h"><div><p>${esc(sc.sender)}</p><span>${esc(sc.channel)} · simulasi</span></div><span class="tag">Sandbox</span></div><div class="thread">${bubbles()}${state.sandbox ? fakePage() : ""}</div>${chatbox}</div><div class="side"><div class="panel"><p class="tiny">Taktik aktif</p><h2>${esc(state.tactic)}</h2><p class="why">${esc(state.reason)}</p></div>${actions.length ? `<div class="actions">${actionButtons(actions)}</div>` : ""}<button type="button" class="linkish" data-go="profile">Ganti profil</button><details><summary>Mesin keputusan</summary><ol>${log}</ol></details></div></section>`;
}

function report() {
  const d = state.debrief;
  const s = d.summary;
  const IND = {
    verify_source: "Verifikasi sumber",
    under_pressure: "Ketahanan terhadap urgensi",
    protect_data: "Perlindungan data",
    report_threat: "Pelaporan ancaman",
  };
  const STMAP = { "Teramati": "teramati", "Belum teramati": "belum", "Perlu diuji": "perlu" };
  const rows = Object.entries(s.indicators || {})
    .map(([k, v]) => `<li><div class="ind-top"><strong>${esc(IND[k] || k)}</strong><span class="st ${STMAP[v] || "belum"}">${esc(v)}</span></div></li>`)
    .join("");
  const mission = s.next_exercise ? { title: "Misi berikut: " + esc(s.next_exercise.indicator), body: esc(s.next_exercise.label) } : { title: "Misi berikut", body: "Ulangi dengan keputusan berbeda untuk melihat taktik lawan berubah." };
  const log = state.events.map((e, i) => `<li><b>${i + 1}</b>${esc(e)}</li>`).join("");
  const verdict = s.outcome === "compromised" ? "Kamu tertipu di latihan ini — dan itu normal." : "Kamu bertahan di latihan ini.";
  return `<section class="report"><div><p class="kicker">Behavioral patch</p><h1 style="margin-top:0.75rem">${esc(verdict)}</h1><p class="coach">${esc(d.coach)}</p><ul class="inds">${rows}</ul></div><div class="side"><div class="panel mission"><p class="tiny" style="color:var(--amber)">Misi berikutnya</p><h2>${mission.title}</h2><p class="why">${mission.body}</p></div><div class="panel"><p class="tiny">Jejak tindakan</p><ol class="log">${log}</ol></div><div class="row"><button class="cta" type="button" data-nextmission>Episode berikutnya</button><button class="ghost" type="button" data-go="profile">Ganti profil</button></div></div></section>`;
}

function paywall() {
  return `<section class="report"><div><p class="kicker">Free tier</p><h1 style="margin-top:0.75rem">Episode gratis hari ini habis.</h1><p class="coach">Free tier: 2 episode per hari. Upgrade untuk episode tanpa batas dan semua domain — atau kembali besok.</p></div><div class="side"><div class="panel mission"><p class="tiny" style="color:var(--amber)">Premium — Rp29.000/bln</p><h2>Episode tanpa batas</h2><p class="why">Semua 7 domain, retest personal, laporan perkembangan.</p><button class="cta" type="button" data-upgrade>Upgrade (demo)</button></div></div></section>`;
}

function render() {
  let body = intro();
  if (state.screen === "profile") body = profileScreen();
  if (state.screen === "sim" && state.mission) body = sim();
  if (state.screen === "report" && state.debrief) body = report();
  if (state.screen === "paywall") body = paywall();
  document.getElementById("app").innerHTML = shell(body);
  const input = document.getElementById("freechat");
  if (input) {
    input.addEventListener("keydown", (e) => { if (e.key === "Enter") sendText(); });
    input.focus();
  }
  const btn = document.getElementById("sendbtn");
  if (btn) btn.addEventListener("click", sendText);
}

async function go(target) {
  if (target === "intro" || target === "profile") { state.screen = target; render(); return; }
  if (target === "report" && state.mission && !state.debrief) { await act("report"); return; }
  if (target === "sim" && !state.mission) { await beginSession(); return; }
  state.screen = target; render();
}

document.getElementById("app").addEventListener("click", async (event) => {
  const node = event.target.closest("[data-go],[data-pick],[data-begin],[data-act],[data-nextmission],[data-upgrade]");
  if (!node) return;
  if (node.dataset.go) await go(node.dataset.go);
  else if (node.dataset.pick != null) { state.profile = Number(node.dataset.pick); render(); }
  else if (node.hasAttribute("data-begin")) await beginSession();
  else if (node.dataset.act) await act(node.dataset.act);
  else if (node.hasAttribute("data-nextmission")) await nextMission();
  else if (node.hasAttribute("data-upgrade")) {
    await post(`/session/${state.session.session_id}/premium`, { plan: "monthly" });
    await nextMission();
  }
});

boot();
