/* ============================================================
   CHAPTER ENGINE — runs MD_CHAPTERS as a 10-chapter campaign.
   No "days": chapter 1..10 sequential. Each chapter:
   notif → channel screen → choice (MD verbs) → outcome screen
   → (EXPOSED: recovery steps RECOVERED) → next chapter.
   Cross-chapter state per §4.C drives ch6 urgency + ch9 content.
   ============================================================ */

const MD = {
  chapter: 0,          // 0 = not started, 1..10
  choice: null,        // chosen verb object
  outcome: null,       // EXPOSED | SURVIVED | REPORTED | IGNORED | RECOVERED
  exposed: false,      // did the risky path hit in this chapter
  recoveryDone: [],    // completed recovery step ids
  seenNotif: false,
  explored: false,
  log: [],             // per-chapter action log
};

function mdProfile() { return state.mdRun || null; }
function mdSave() { saveLocal(); }

function mdStart() {
  state.mdRun = {
    chapter: 1, state: {}, indicators: { verify_source: 0, under_pressure: 0, protect_data: 0, report_threat: 0 },
    outcomes: [], recoveryDone: {}, log: {},
  };
  mdGoChapter(1);
}
function mdGoChapter(n) {
  const run = state.mdRun;
  run.chapter = n;
  MD.choice = null; MD.outcome = null; MD.exposed = false;
  MD.recoveryDone = []; MD.seenNotif = false; MD.explored = false; MD.log = [];
  state.screen = "md-notif";
  render();
}
function mdCur() { return MD_CHAPTERS[(state.mdRun?.chapter || 1) - 1]; }

/* ---------- indicators & state ---------- */
function mdTrack(inds) {
  const run = state.mdRun;
  (inds || []).forEach(i => { if (run.indicators[i] != null) run.indicators[i]++; });
  mdSave();
}
function mdLog(text) { MD.log.push(text); mdSave(); }
function mdSetState(flag) {
  if (!flag) return;
  state.mdRun.state[flag] = true;
  mdSave();
}

/* ---------- chapter flow ---------- */
function mdOpenChannel() {
  MD.seenNotif = true;
  state.screen = "md-channel";
  render();
}
/* verify button in channel header (all chapters) */
function mdVerify() {
  mdTrack(["verify_source"]);
  mdLog("🔍 Memeriksa detail pengirim/konten");
  state.mdSheet = true;
  render();
}
function mdCloseSheet() { state.mdSheet = false; render(); }

function mdChoose(verb) {
  const ch = mdCur();
  const c = ch.choices.find(x => x.verb === verb);
  if (!c) return;
  MD.choice = c;
  MD.outcome = c.outcome;
  MD.exposed = c.outcome === "EXPOSED";
  mdTrack(c.ind);
  mdLog((c.kind === "risky" ? "⚠️ " : "🛡 ") + verb + " → " + c.outcome);
  // §4.C state
  if (c.state) mdSetState(c.state);
  if (MD_STATE_RULES[c.outcome]) mdSetState(MD_STATE_RULES[c.outcome]);
  // ch4 share → data public; ch9 verify → tested claim
  state.screen = "md-outcome";
  render();
}

/* recovery step (only after EXPOSED) */
function mdRecover(stepId) {
  const ch = mdCur();
  if (!MD.recoveryDone.includes(stepId)) MD.recoveryDone.push(stepId);
  mdLog("🛠 " + stepId);
  mdSave();
  render();
}
function mdRecoveryComplete() {
  MD.outcome = "RECOVERED";
  mdLog("✅ Pemulihan selesai → RECOVERED");
  mdSave();
  render();
}

function mdNext() {
  const run = state.mdRun;
  run.outcomes[run.chapter - 1] = MD.outcome;
  run.recoveryDone[run.chapter - 1] = [...MD.recoveryDone];
  run.log[run.chapter - 1] = [...MD.log];
  mdSave();
  if (run.chapter >= 10) { state.screen = "md-finale"; render(); return; }
  mdGoChapter(run.chapter + 1);
}

/* ---------- state-aware bits ---------- */
/* ch6 urgency: sharper when earlier leaks happened */
function mdCh6Urgent() {
  const s = state.mdRun?.state || {};
  return !!(s.credentials_leaked || s.wifi_leaked || s.spyware_installed);
}
/* ch9 threat message varies with personal_data_public */
function mdCh9Message() {
  const ch = mdCur();
  const s = state.mdRun?.state || {};
  if (ch.key === "threat" && s.personal_data_public) return ch.messageReal;
  return ch.message;
}

/* ============================================================
   VIEWS
   ============================================================ */
function vMdHome() {
  const run = state.mdRun;
  const started = !!run;
  const done = run ? run.outcomes.filter(Boolean).length : 0;
  return `
  <div class="md-wrap">
    <div class="md-langbar">
      ${LANGS.map(l => `<button class="md-lang ${LANG === l.id ? "on" : ""}" onclick="mdSetLang('${l.id}')">${l.flag} ${l.label}</button>`).join("")}
    </div>
    <h1 class="md-title">🛡️ HumanPatch <span class="md-sub">— Sepuluh Chapter Menuju Aman Digital</span></h1>
    <p class="dim">${L({id:"Sepuluh chapter. Sepuluh domain. Setiap keputusanmu membentuk chapter berikutnya.", en:"Ten chapters. Ten domains. Every decision shapes the next one."})}</p>
    <div class="md-chapter-grid">
      ${MD_CHAPTERS.map(ch => {
        const o = run?.outcomes[ch.n - 1];
        const cur = run?.chapter === ch.n && !o;
        const locked = !run || ch.n > (run.outcomes.filter(Boolean).length + 1);
        const pill = o ? `<span class="pill ${o === "EXPOSED" ? "no" : (o === "RECOVERED" ? "todo" : "ok")}">${o}</span>` : (cur ? `<span class="pill todo">${L({id:"BERJALAN", en:"CURRENT"})}</span>` : `<span class="pill dim">${L({id:"terkunci", en:"locked"})}</span>`);
        return `<div class="md-ch ${cur ? "cur" : ""} ${locked ? "locked" : ""}" ${!locked ? `onclick="mdGoChapter(${ch.n})"` : ""}>
          <div class="md-ch-n">${ch.n}</div>
          <div class="md-ch-b">
            <strong>${L(ch.title)}</strong>
            <p class="dim small">${L(ch.domain)}</p>
          </div>
          ${pill}
        </div>`;
      }).join("")}
    </div>
    <div class="md-actions">
      ${started ? `<button class="btn btn-ghost" onclick="mdResetConfirm()">${L({id:"↺ Mulai ulang", en:"↺ Restart"})}</button>` : ""}
      ${!started ? `<button class="btn btn-primary" onclick="mdStart()">${L({id:"Mulai Chapter 1 →", en:"Start Chapter 1 →"})}</button>` : ""}
    </div>
  </div>`;
}
function mdResetConfirm() {
  if (confirm(L({id:"Hapus progres 10-chapter dan mulai dari awal?", en:"Erase the 10-chapter progress and restart?"}))) {
    state.mdRun = null; render();
  }
}
function mdSetLang(l) { LANG = l; try { localStorage.setItem("hp_lang", l); } catch(e){} render(); }

/* --- notification screen --- */
function vMdNotif() {
  const ch = mdCur();
  const run = state.mdRun;
  const isUrgent = ch.key === "takeover" && mdCh6Urgent();
  // chapter loading splash — no "day" vocabulary anywhere
  if (!MD.seenNotif) {
    return `
    <div class="md-phone">
      <div class="md-statusbar"><span>${L({id:"Chapter", en:"Chapter"})} ${ch.n}/10</span><span>📶 🔋</span></div>
      <div class="md-loading">
        <div class="md-loading-ring"></div>
        <h4>${L({id:"Menyiapkan Chapter " + ch.n, en:"Preparing Chapter " + ch.n})}</h4>
        <p class="dim">${L(ch.title)} · ${L(ch.domain)}</p>
        <p class="dim small">${L({id:"Membangun skenario · menghubungkan notifikasi…", en:"Building the scenario · connecting the notification…"})}</p>
      </div>
      <div class="md-notif-actions">
        <button class="btn btn-primary btn-block" onclick="mdOpenChannel()">${L({id:"Buka notifikasi", en:"Open notification"})}</button>
      </div>
    </div>`;
  }
  return `
  <div class="md-phone">
    <div class="md-statusbar"><span>${L({id:"Chapter", en:"Chapter"})} ${ch.n}/10</span><span>📶 🔋</span></div>
    <div class="md-notif ${isUrgent ? "urgent" : ""}">
      <div class="md-notif-icon">${({browser:"🌐", chat:"💬", wifi:"📶", call:"📞", family:"👨‍👩‍👧"})[ch.channel]}</div>
      <div>
        <strong>${L(ch.from)}</strong>
        <p>${esc(L(ch.notif))}</p>
        ${isUrgent ? `<p class="md-urgent-line">⚡ ${L({id:"Konteks: kebocoran sebelumnya membuat ini lebih mendesak", en:"Context: the earlier leak makes this more urgent"})}</p>` : ""}
        <time>sekarang</time>
      </div>
    </div>
    <div class="md-notif-actions">
      <button class="btn btn-primary btn-block" onclick="mdOpenChannel()">${L({id:"Buka", en:"Open"})}</button>
    </div>
  </div>`;
}

/* --- channel screens --- */
function vMdChannel() {
  const ch = mdCur();
  const head = `
    <div class="md-statusbar"><span>◀ ${L({id:"Chapter", en:"Chapter"})} ${ch.n}/10</span><span>📶 🔋</span></div>
    <div class="md-appbar">
      <strong>${L(ch.title)}</strong>
      <button class="md-verify" onclick="mdVerify()">🔍 ${L({id:"Periksa dulu", en:"Check first"})}</button>
    </div>`;
  const body = {
    browser: mdVBrowser,
    chat: mdVChat,
    wifi: mdVWifi,
    call: mdVCall,
    family: mdVFamily,
  }[ch.channel](ch);
  return `<div class="md-phone md-chan-${ch.channel}">${head}${body}
    ${state.mdSheet ? mdVSheet(ch) : ""}
    ${MD.choice ? "" : ""}
  </div>`;
}

function mdVSheet(ch) {
  const d = ch.detail;
  return `
  <div class="sheet-backdrop" onclick="mdCloseSheet()"></div>
  <div class="sheet">
    <h4>${esc(L(d.label))}</h4>
    <div class="md-sheet-row"><span>❌</span><div><strong>${esc(L(d.fake))}</strong><p class="dim small">${L({id:"Yang kamu lihat sekarang", en:"What you're looking at now"})}</p></div></div>
    <div class="md-sheet-row"><span>✅</span><div><strong>${esc(L(d.real))}</strong><p class="dim small">${L({id:"Seperti apa bentuk yang resmi", en:"What the legitimate version looks like"})}</p></div></div>
    <button class="btn btn-primary btn-block" onclick="mdCloseSheet()">${L({id:"Mengerti", en:"Got it"})}</button>
  </div>`;
}

function mdVBrowser(ch) {
  return `
  <div class="md-browser">
    <div class="md-urlbar">🔒 ${esc(ch.detail.fake)}</div>
    <div class="md-loginbox">
      <h5>${esc(L(ch.from))}</h5>
      <div class="md-field">📧 email</div>
      <div class="md-field">●●●●●● kata sandi</div>
      <button class="md-fakebtn">Masuk</button>
    </div>
    ${ch.otpSms ? `<div class="md-sms"><span>📩</span><p>${esc(L(ch.otpSms))}</p></div>` : ""}
  </div>
  ${mdChoices(ch)}`;
}
function mdVChat(ch) {
  const msg = ch.key === "threat" ? mdCh9Message() : (ch.key === "takeover" && mdCh6Urgent() && ch.messageUrgent ? ch.messageUrgent : ch.message);
  return `
  <div class="md-chat">
    <div class="md-bubble them">
      <p>${esc(L(msg)).replace(/\n/g, "<br>")}</p>
      <time>09:0${ch.n}</time>
    </div>
    ${ch.otpSms ? `<div class="md-sms"><span>📩</span><p>${esc(L(ch.otpSms))}</p></div>` : ""}
  </div>
  ${mdChoices(ch)}`;
}
function mdVWifi(ch) {
  return `
  <div class="md-wifi">
    <div class="md-wifi-net"><span>📶</span><div><strong>${ch.detail.fake.split(" · ")[0]}</strong><p class="dim small">Terhubung — portal login menunggu</p></div></div>
    <div class="md-wifi-net dim"><span>📶</span><div><strong>${ch.detail.fake.split(" · ")[1] || "..."}</strong><p class="dim small">${L({id:"SSID kembar — cek ke staf", en:"Twin SSID — confirm with staff"})}</p></div></div>
    <div class="md-loginbox">
      <h5>${L({id:"Portal Wi-Fi Gratis", en:"Free Wi-Fi Portal"})}</h5>
      <div class="md-field">📧 alamat email</div>
      <div class="md-field">●●●●●● kata sandi email</div>
      <button class="md-fakebtn">Hubungkan</button>
    </div>
  </div>
  ${mdChoices(ch)}`;
}
function mdVCall(ch) {
  return `
  <div class="md-call">
    <div class="md-call-avatar">📞</div>
    <h4>${esc(L(ch.from))}</h4>
    <p class="dim">${L({id:"Panggilan masuk…", en:"Incoming call…"})}</p>
    <p class="md-call-script">“${esc(L(ch.message))}”</p>
    ${ch.otpSms ? `<div class="md-sms"><span>📩</span><p>${esc(L(ch.otpSms))}</p></div>` : ""}
  </div>
  ${mdChoices(ch)}`;
}
function mdVFamily(ch) {
  return `
  <div class="md-chat md-family">
    <div class="md-bubble them"><strong>👩 Ibu</strong><p>${esc(L(ch.message)).split("\n")[0].replace(/^IBU: ?/, "")}</p></div>
    <div class="md-bubble them"><strong>🧒 Adik</strong><p>${esc(L(ch.message)).split("\n")[1] || ""}</p></div>
  </div>
  ${mdChoices(ch)}`;
}

function mdChoices(ch) {
  return `
  <div class="md-choices">
    <p class="md-choices-h">${L({id:"Keputusanmu:", en:"Your decision:"})}</p>
    ${ch.choices.map(c => `
      <button class="md-choice ${c.kind}" onclick="mdChoose('${c.verb}')">
        ${c.kind === "risky" ? "⚠️" : c.kind === "recovering" ? "🛑" : c.kind === "neutral" ? "🙈" : "🛡"} ${L(c.label)}
      </button>`).join("")}
  </div>`;
}

/* --- outcome screen --- */
function vMdOutcome() {
  const ch = mdCur();
  const run = state.mdRun;
  const o = MD.outcome;
  const exposed = o === "EXPOSED";
  const map = {
    EXPOSED: { icon: "💥", cls: "bad", },
    SURVIVED: { icon: "🛡", cls: "good", },
    REPORTED: { icon: "🚩", cls: "good", },
    IGNORED: { icon: "🙈", cls: "mid", },
    RECOVERED: { icon: "🛠", cls: "mid", },
  }[o] || { icon: "❓", cls: "mid" };
  return `
  <div class="md-outcome ${map.cls}">
    <div class="md-statusbar"><span>Chapter ${ch.n}/10</span><span>📶 🔋</span></div>
    <div class="md-outcome-head">
      <div class="md-outcome-icon">${map.icon}</div>
      <h2>${o}</h2>
      <p class="dim">${L(ch.title)} · ${L(ch.domain)}</p>
    </div>
    ${exposed && ch.recovery ? mdVRecovery(ch) : mdVDebriefMini(ch)}
    <div class="md-outcome-actions">
      <button class="btn btn-primary btn-block" onclick="mdNext()">${run.chapter < 10
        ? L({id:"Lanjut ke Chapter " + (ch.n + 1) + " →", en:"Continue to Chapter " + (ch.n + 1) + " →"})
        : L({id:"Lihat hasil akhir →", en:"See the finale →"})}</button>
    </div>
  </div>`;
}

function mdVDebriefMini(ch) {
  return `
  <div class="md-debrief">
    <div class="md-card"><h5>🚩 ${L({id:"Red flags", en:"Red flags"})}</h5>
      <ul>${ch.redFlags.map(f => `<li>${esc(L(f))}</li>`).join("")}</ul></div>
    <div class="md-card"><h5>🛡 ${L({id:"Respons aman", en:"Safe response"})}</h5><p>${esc(L(ch.safeResponse))}</p></div>
    <div class="md-card"><h5>🎓 ${L({id:"Pelajaran", en:"Lesson"})}</h5><p>${esc(L(ch.lesson))}</p></div>
    ${ch.emotion ? `<div class="md-card"><h5>💭 ${L({id:"Refleksi", en:"Reflection"})}</h5><p>${esc(L(ch.emotion))}</p></div>` : ""}
  </div>`;
}

function mdVRecovery(ch) {
  const rec = ch.recovery;
  const all = rec.steps.map(s => s.id);
  const doneAll = all.every(id => MD.recoveryDone.includes(id));
  return `
  <div class="md-recovery">
    <p class="md-rec-note">💥 ${L({id:"Dampak terjadi. Jalankan langkah pemulihan agar statusmu naik ke RECOVERED:", en:"Impact happened. Run the recovery steps to raise your status to RECOVERED:"})}</p>
    ${rec.steps.map(s => {
      const done = MD.recoveryDone.includes(s.id);
      return `<button class="md-rec-step ${done ? "done" : ""}" ${done ? "disabled" : `onclick="mdRecover('${s.id}')"`}>
        ${done ? "✅" : "🛠"} ${L(s.label)}</button>`;
    }).join("")}
    ${rec.note && doneAll ? `<p class="dim small">${esc(L(rec.note))}</p>` : ""}
    ${doneAll && !rec.trigger ? `<button class="btn btn-primary btn-block" onclick="mdRecoveryComplete()">${L({id:"Selesaikan pemulihan → RECOVERED", en:"Finish recovery → RECOVERED"})}</button>` : ""}
    ${doneAll && rec.trigger ? `<button class="btn btn-primary btn-block" onclick="mdRecoveryComplete()">${L({id:"Batasi paparan → RECOVERED", en:"Contain exposure → RECOVERED"})}</button>` : ""}
  </div>`;
}

/* --- finale --- */
function vMdFinale() {
  const run = state.mdRun;
  const outs = run.outcomes;
  const counts = outs.reduce((a, o) => { a[o] = (a[o] || 0) + 1; return a; }, {});
  const exposed = outs.filter(o => o === "EXPOSED").length;
  const recovered = outs.filter(o => o === "RECOVERED").length;
  const survived = outs.filter(o => o === "SURVIVED" || o === "REPORTED").length;
  const grade = exposed === 0 ? "A" : exposed <= 2 ? "B" : exposed <= 4 ? "C" : "D";
  const st = run.state;
  return `
  <div class="md-finale">
    <h1>${L({id:"Awal Baru, Masa Depan yang Lebih Aman", en:"A New Beginning, A Safer Future"})}</h1>
    <p class="dim">${L({id:"Sepuluh chapter selesai. Menjadi pengguna digital yang aman bukan berarti tidak pernah salah — yang penting mengenali risiko, bertindak tepat, dan membantu orang lain.", en:"Ten chapters done. Being digitally safe isn't never erring — it's recognizing risk, acting right, and helping others do the same."})}</p>
    <div class="md-score">
      <div class="md-grade">${grade}</div>
      <div>
        <p>🛡 SURVIVED/REPORTED: <b>${survived}</b> · 💥 EXPOSED: <b>${exposed}</b> · 🛠 RECOVERED: <b>${recovered}</b> · 🙈 IGNORED: <b>${counts.IGNORED || 0}</b></p>
        <p class="dim small">${L({id:"Indikator: verifikasi sumber", en:"Indicators: verify source"})} ${run.indicators.verify_source} · under pressure ${run.indicators.under_pressure} · protect data ${run.indicators.protect_data} · report threat ${run.indicators.report_threat}</p>
      </div>
    </div>
    <div class="md-storystate">
      <h4>${L({id:"Jejak keputusanmu", en:"Your decision trail"})}</h4>
      <ul>
        ${st.credentials_leaked ? `<li>🔓 ${L({id:"Kredensial bocor (Ch1/2)", en:"Credentials leaked (Ch1/2)"})}</li>` : ""}
        ${st.wifi_leaked ? `<li>📶 ${L({id:"Wi-Fi portal palsu terisi (Ch3)", en:"Fake Wi-Fi portal filled (Ch3)"})}</li>` : ""}
        ${st.personal_data_public ? `<li>📸 ${L({id:"Data pribadi pernah publik (Ch4)", en:"Personal data went public (Ch4)"})}</li>` : ""}
        ${st.spyware_installed ? `<li>📱 ${L({id:"APK berbahaya terpasang (Ch5)", en:"Malicious APK installed (Ch5)"})}</li>` : ""}
        ${st.account_breached ? `<li>🔐 ${L({id:"Akun sempat dibajak (Ch6)", en:"Account briefly hijacked (Ch6)"})}</li>` : ""}
        ${st.wallet_damaged ? `<li>💰 ${L({id:"Dompet sempat terkuras (Ch7/8/9)", en:"Wallet took damage (Ch7/8/9)"})}</li>` : ""}
        ${st.family_safe ? `<li>🏡 ${L({id:"Keluarga aman (Ch10)", en:"Family protected (Ch10)"})}</li>` : ""}
        ${st.family_exposed ? `<li>🏚 ${L({id:"Keluarga terdampak (Ch10)", en:"Family impacted (Ch10)"})}</li>` : ""}
        ${st.knows_scam_pattern ? `<li>🧠 ${L({id:"Pola penipuan dikenali", en:"Scam patterns recognized"})}</li>` : ""}
      </ul>
      <p class="dim small">${L({id:"Ancaman Ch9 ", en:"Ch9 threat "})}${st.personal_data_public ? L({id:"memakai data NADIA yang benar-benar bocor di Ch4 — intimidasi lebih tajam.", en:"used Nadia's REAL leaked data from Ch4 — sharper intimidation."}) : L({id:"hanya rekayasa/tebakan — dan bisa kamu uji.", en:"was fabricated/guesswork — and you could test it."})}</p>
    </div>
    <div class="md-actions">
      <button class="btn btn-primary" onclick="state.screen='md-home';render()">${L({id:"Peta chapter", en:"Chapter map"})}</button>
      <button class="btn btn-ghost" onclick="mdResetConfirm()">${L({id:"↺ Main lagi", en:"↺ Play again"})}</button>
    </div>
  </div>`;
}
