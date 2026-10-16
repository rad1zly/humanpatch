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
  screen: "landing",
  authMode: "login",
  user: null,
  profiles: [],
  activeProfileId: null,
  wizard: { step: 1, archetype: null, avatar: "🙂", wallpaper: 0, apps: [], pref: "new" },
  world: null,
  session: null,
  mission: null,
  notifOpen: false,
  openApp: null,
  encounterChat: [],
  sheet: null,
  toast: null,
  debrief: null,
  events: [],
};

/* ---------------- persistence ---------------- */
function saveLocal() {
  try {
    localStorage.setItem("hp2_lang", JSON.stringify(LANG));
    if (!state.user) {
      /* TRIAL MODE: progress is in-memory only — never persisted.
         Logging in mid-trial saves the current run under the user account. */
      return;
    }
    localStorage.setItem("hp2_user", JSON.stringify(state.user));
    localStorage.setItem(userKey(state.user.name, "profiles"), JSON.stringify(state.profiles));
    localStorage.setItem(userKey(state.user.name, "active"), JSON.stringify(state.activeProfileId));
  } catch (e) { /* private mode */ }
}
function loadLocal() {
  try {
    state.user = JSON.parse(localStorage.getItem("hp2_user") || "null");
    state.guestMode = !state.user;
    /* purge legacy guest-persisted progress (trial must be ephemeral) */
    for (const k of Object.keys(localStorage)) {
      if (k.startsWith("hp2_u_guest_")) localStorage.removeItem(k);
    }
    if (!state.user) {
      /* TRIAL MODE: start clean every visit */
      state.profiles = [];
      state.activeProfileId = null;
    } else {
      state.profiles = JSON.parse(localStorage.getItem(userKey(state.user.name, "profiles")) || "[]");
      state.activeProfileId = JSON.parse(localStorage.getItem(userKey(state.user.name, "active")) || "null");
    }
    const l = JSON.parse(localStorage.getItem("hp2_lang") || '"id"');
    if (I18N[l]) LANG = l;
  } catch (e) { /* ignore */ }
}
let wizAIBadgeTicker = null;
function startWizBadgeTicker() {
  stopWizBadgeTicker();
  wizAIBadgeTicker = setInterval(() => {
    if (state.screen !== "wizard") return stopWizBadgeTicker();
    const pill = document.getElementById("wiz-ai-pill");
    if (!pill) return;
    const txt = wizAIBadge();
    const isReady = !!state.prefetchedCast;
    pill.textContent = txt;
    pill.style.background = isReady ? "rgba(52,211,153,.15)" : "rgba(148,163,184,.1)";
    pill.style.color = isReady ? "#1C82FF" : "#94A3B8";
  }, 1200);
}
function stopWizBadgeTicker() { if (wizAIBadgeTicker) { clearInterval(wizAIBadgeTicker); wizAIBadgeTicker = null; } }
function setLang(l) { LANG = l; saveLocal(); render(); }

/* ---------------- helpers ---------------- */
const esc = (s) => String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const icons = {
  shield: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/></svg>`,
  back: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>`,
  send: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M3.4 20.4 21 12 3.4 3.6l.1 6.6L15 12l-11.5 1.8z"/></svg>`,
  globe: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a15 15 0 0 1 0 18 15 15 0 0 1 0-18"/></svg>`,
};
let _toastTimer = null;
function toast(msg) {
  state.toast = typeof msg === "function" ? msg() : msg;
  render();
  clearTimeout(_toastTimer);
  _toastTimer = setTimeout(() => { state.toast = null; render(); }, 2600);
}
function go(screen) { state.screen = screen; render(); window.scrollTo(0, 0); syncBg3d(); }
function syncBg3d() {
  if (state.screen === "landing" && typeof hpStartBg3d === "function") hpStartBg3d();
  else if (typeof hpStopBg3d === "function") hpStopBg3d();
}

/* language dropdown (globe) */
function langDropdown() {
  const cur = LANGS.find(l => l.id === LANG) || LANGS[0];
  return `
  <div class="langdd" role="group">
    <button class="langdd-btn" onclick="toggleLangDD(event)" aria-haspopup="true" aria-expanded="${state.langDD ? "true" : "false"}">
      🌐 <span>${cur.label}</span> <span class="caret">▾</span>
    </button>
    ${state.langDD ? `<div class="langdd-menu">${LANGS.map(l =>
      `<button class="${l.id === LANG ? "sel" : ""}" onclick="setLang('${l.id}'); state.langDD=false;">${l.flag || ""} ${l.label}${l.id === LANG ? " ✓" : ""}</button>`).join("")}
    </div>` : ""}
  </div>`;
}
function toggleLangDD(e) { e.stopPropagation(); state.langDD = !state.langDD; render(); }
document.addEventListener("click", (e) => { if (state.langDD && !e.target.closest(".langdd")) { state.langDD = false; render(); } });

/* world paths — TryHackMe-style learning path cards */
const WORLD_PATHS = [
  { arch: "student", emoji: "🎓", color: "#FEF3C7",
    personas: [
      { id: "nadia",   flag: "🇮🇩", nk: "per_nadia",   bk: "per_nadia_d",   face: "assets/faces/nadia.png" },
      { id: "xiaoyu",  flag: "🇨🇳", nk: "per_xiaoyu",  bk: "per_xiaoyu_d",  face: "assets/faces/xiaoyu.png" },
      { id: "rizky",   flag: "🇮🇩", nk: "per_rizky",   bk: "per_rizky_d",   face: "assets/faces/rizky.png" },
      { id: "chinedu", flag: "🇳🇬", nk: "per_chinedu", bk: "per_chinedu_d", face: "assets/faces/chinedu.png" },
      { id: "ananya",  flag: "🇮🇳", nk: "per_ananya",  bk: "per_ananya_d",  face: "assets/faces/ananya.png" },
      { id: "elsa",    flag: "🇸🇪", nk: "per_elsa",    bk: "per_elsa_d",    face: "assets/faces/elsa.png" },
      { id: "maddie",  flag: "🇺🇸", nk: "per_maddie",  bk: "per_maddie_d",  face: "assets/faces/maddie.png" },
      { id: "emir",    flag: "🇹🇷", nk: "per_emir",    bk: "per_emir_d",    face: "assets/faces/emir.png" },
      { id: "diego",   flag: "🇲🇽", nk: "per_diego",   bk: "per_diego_d",   face: "assets/faces/diego.png" },
      { id: "oliver",  flag: "🇬🇧", nk: "per_oliver",  bk: "per_oliver_d",  face: "assets/faces/oliver.png" },
    ], default: "nadia" },
  // DEMO-ONLY worlds for the hackathon build: visible on the landing grid,
  // but clicking routes to a "coming soon" toast instead of the wizard.
  { arch: "merchant", emoji: "🛒", color: "#FFE4E6", personas: [], default: "", demo: true, demoPersona: { id: "merchant", flag: "🏪", nk: "arch_merchant", bk: "arch_merchant_d", face: "" } },
  { arch: "worker",   emoji: "💼", color: "#DBEAFE", personas: [], default: "", demo: true, demoPersona: { id: "worker", flag: "🏢", nk: "arch_worker", bk: "arch_worker_d", face: "" } },
  { arch: "parent",   emoji: "🏡", color: "#A6D9FF", personas: [], default: "", demo: true, demoPersona: { id: "parent", flag: "👨‍👩‍👧", nk: "arch_parent", bk: "arch_parent_d", face: "" } },
  { arch: "general",  emoji: "🌐", color: "#E0E7FF", personas: [], default: "", demo: true, demoPersona: { id: "general", flag: "🌍", nk: "arch_general", bk: "arch_general_d", face: "" } },
];
const ALL_PERSONAS = WORLD_PATHS.flatMap(w => w.personas);
function setWorldFilter(f) { state.worldFilter = f; render(); }
function demoSoon(arch) {
  // demo-gated world: full experience ships post-hackathon
  toast(t("demo_world_toast"));
}
function startWorldPath(arch, personaId) {
  state.wizard.archetype = arch;
  if (personaId) state.wizard.persona = personaId;
  state.wizard.step = 2; // archetype preselected → jump to customization
  prefetchCast(arch, personaId); // AI starts generating DURING the wizard
  go("wizard");
}

/* Kick off cast generation before the profile exists — result lands in
   state.prefetchedCast and createProfile() picks it up instantly. */
function prefetchCast(arch, personaId) {
  const facts = (typeof PERSONA_FACTS !== "undefined" && personaId) ? PERSONA_FACTS[personaId] : null;
  if (!facts) return;
  state.prefetchedCast = null;
  state.castPrefetchFailed = false;
  const story = (typeof STORYLINES !== "undefined")
    ? (STORYLINES[arch] || []).find(s => s.id === "student-01") : null;
  // single-flight: keep the promise so later stages AWAIT it instead of re-calling the API
  state.castPromise = (async () => {
    for (let attempt = 0; attempt < 3; attempt++) {
      try {
        const r = await fetch(API + "/story-context", {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ lang: state.lang, archetype: arch, persona: facts, story: story || {} }),
        });
        const d = await r.json();
        const ok = d && d.cast && Array.isArray(d.cast.npcs) && d.cast.npcs.length >= 4 &&
                   d.cast.npcs.every(n => n && n.name && n.name.length > 1) && d.cast.school && d.cast.class_group;
        if (ok) { state.prefetchedCast = d.cast; return d.cast; }
      } catch (e) { /* retry */ }
      await new Promise(res => setTimeout(res, 1200 * (attempt + 1)));
    }
    state.castPrefetchFailed = true;
    return null;
  })();
}

/* landing snap-page nav (dropdown on mobile) */
const NAV_SECTIONS = [
  ["how", "nav_how"], ["domains", "nav_learn"], ["worlds", "nav_worlds"],
];
function navLinks() {
  return NAV_SECTIONS.map(([id, key]) =>
    `<button class="navlink" onclick="snapTo('${id}')">${t(key)}</button>`).join("");
}
function snapTo(id) {
  state.navDD = false;
  const el = id === "domains" ? document.getElementById("domains-h") :
             id === "worlds" ? document.getElementById("worlds-h") :
             document.getElementById(id);
  if (el) el.closest(".snap-page").scrollIntoView({ behavior: "smooth" });
  else document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
}
function toggleNavDD(e) { e.stopPropagation(); state.navDD = !state.navDD; state.langDD = false; render(); }
document.addEventListener("click", (e) => { if (state.navDD && !e.target.closest(".navwrap")) { state.navDD = false; render(); } });

/* ============================================================
   LANDING
   ============================================================ */
function vLanding() {
  return `
  <div id="bg3d" aria-hidden="true"></div>
  <header class="topbar topbar-fixed"><div class="wrap-wide topbar-inner">
    <button class="brand" onclick="go('landing'); location.hash=''"><img class="brand-mark" src="HumanPatch_Logo.png?v=64" alt="HumanPatch — Every Choice Shapes Your Safety."></button>
    <div class="navwrap">
      <nav class="navlinks" aria-label="Sections">${navLinks()}</nav>
      <button class="navburger" onclick="toggleNavDD(event)" aria-label="Menu">☰</button>
      ${state.navDD ? `<div class="navdd-menu">${navLinks()}</div>` : ""}
    </div>
    <div style="display:flex;gap:10px;align-items:center">
      ${langDropdown()}
      <button class="btn btn-ghost nav-btn" onclick="go('auth')">${t("nav_login")}</button>
    </div>
  </div></header>
  <main class="snap-pages">
    <section class="hero snap-page">
      <div class="hero-copy">
        <p class="kicker hero-kicker">${t("hero_kicker")}</p>
        <h1>${t("hero_h1a")} <em>${t("hero_h1b")}</em></h1>
        <p class="lead">${t("hero_lead")}</p>
        <div class="ctas">
          <button class="btn btn-primary" onclick="go('auth')">${t("hero_cta")}</button>
          <button class="btn btn-ghost" onclick="scrollToSec()">${t("hero_cta2")}</button>
        </div>
        <p class="note">${t("hero_note")}</p>
        <button class="scroll-cue" onclick="document.getElementById('how').scrollIntoView({behavior:'smooth'})" aria-label="${t("hero_cta2")}">
          <span class="sc-track"><span class="sc-dot"></span></span>${t("scroll_cue")}
        </button>
      </div>
      <div class="hero-visual" aria-hidden="true">
        <div class="hv-phone">
          <div class="hv-status"><span>08:47</span><span>🔋 78%</span></div>
          <div class="hv-widget">
            <strong>${t("day2_t")}</strong>
            <span>${t("day2_hint")(3)}</span>
          </div>
          <div class="hv-apps">
            ${[["icons/chatloop.png"],["icons/messagebox.png"],["icons/mailbox.png"],["icons/safebrowse.png"],["icons/dailymart.png"],["icons/socialsquare.png"]].map(a =>
              `<img class="hv-app" src="${a[0]}" alt="">`).join("")}
          </div>
          <div class="hv-notif">
            <div class="hv-n"><span class="hv-ni"><img src="icons/dailymart.png" alt=""></span><div><strong>DailyMart</strong><p>${L(INAPP.sms[1].text).slice(0, 40)}…</p></div></div>
            <div class="hv-n"><span class="hv-ni" style="background:#64748B">👤</span><div><strong>0813-5563-•••</strong><p>${t("atk_generic")}</p></div></div>
          </div>
        </div>
      </div>
    </section>

    <section class="section snap-page" id="how">
      <h2>${t("how_h2")}</h2>
      <p class="sub">${t("how_sub")}</p>
      <div class="cards">
        <div class="card"><div class="icon-tile" style="background:var(--mint)">🪪</div><h3>${t("how1_t")}</h3><p>${t("how1_p")}</p></div>
        <div class="card"><div class="icon-tile" style="background:#FEF3C7">📱</div><h3>${t("how2_t")}</h3><p>${t("how2_p")}</p></div>
        <div class="card"><div class="icon-tile" style="background:#FFE4E6">🧠</div><h3>${t("how3_t")}</h3><p>${t("how3_p")}</p></div>
      </div>
    </section>

    <section class="section snap-page">
      <h2 id="domains-h">${t("learn_h2")}</h2>
      <p class="sub">${t("learn_sub")}</p>
      <div class="domain-grid">
        ${[["🔐","d1"],["🎣","d2"],["🌐","d3"],["📸","d4"],["📱","d5"],["🚨","d6"],["📞","d7"],["💳","d8"],["🎭","d9"],["👨‍👩‍👧","d10"]].map(d =>
          `<div class="domain-item"><div class="di" style="background:var(--mint)">${d[0]}</div><div><strong>${t(d[1]+"_t")}</strong><span>${t(d[1]+"_p")}</span></div></div>`).join("")}
      </div>
    </section>

    <section class="section snap-page" id="worlds">
      <h2 id="worlds-h">${t("worlds_h")}</h2>
      <p class="sub">${t("worlds_sub")}</p>
      <div class="wfilter" role="tablist" aria-label="Filter dunia">
        ${["all","student","merchant","worker","parent"].map(f =>
          `<button class="wtab ${(state.worldFilter||"all")===f?"on":""}" onclick="setWorldFilter('${f}')">${t("wf_"+f)}</button>`).join("")}
      </div>
      <div class="path-grid">
        ${WORLD_PATHS.filter(p => (state.worldFilter||"all")==="all" || p.arch===state.worldFilter).flatMap(p =>
          (p.personas.length ? p.personas : (p.demo ? [p.demoPersona] : [])).map(per => ({ arch: p.arch, color: p.color, emoji: p.emoji, persona: { ...per, name: t(per.nk), blurb: t(per.bk) }, demo: p.demo || false }))
        ).map(p => {
          const prof = (state.profiles||[]).find(x => x.archetype === p.arch && x.persona === p.persona.id);
          const days = prof ? (prof.day - 1) : 0;
          const pct = Math.round(days / 5 * 100);
          return `
          <article class="path-card ${prof ? "started" : ""} ${p.demo ? "demo-card" : ""}">
            <div class="pc-head">
              <div class="pc-icon" style="background:${p.color}"><img src="${p.persona.face}" alt="${p.persona.id}" loading="lazy"></div>
              <div class="pc-title">
                <span class="pc-tag">${p.persona.flag} ${t("arch_" + p.arch)}</span>
                <h3>${p.persona.name}</h3>
                <p>${p.persona.blurb}</p>
              </div>
            </div>
            <div class="pc-chips">
              <span class="chip">📅 ${t("wp_days")}</span>
              <span class="chip">🧩 ${t("wp_domains")}</span>
              <span class="chip">⭐ ${t("wp_lv")}</span>
            </div>
            <div class="pc-barwrap">
              <div class="pc-bar"><span style="width:${Math.max(pct, prof ? 8 : 0)}%"></span></div>
              <span class="pc-pct">${prof ? `${days}/5 ${t("wp_days_word")}` : t("wp_not_started")}</span>
            </div>
            <button class="btn ${prof ? "btn-primary" : "btn-ghost"} pc-cta" onclick="${prof ? `requireAuth(playProfile)('${prof.id}')` : (p.demo ? `demoSoon('${p.arch}')` : `requireAuth(startWorldPath)('${p.arch}','${p.persona.id}')`)}">
              ${prof ? t("wp_continue") : (p.demo ? t("demo_world_btn") : t("wp_start"))}
            </button>
          </article>`;
        }).join("")}
      </div>
      <p class="wstatline">${t("wstats")}</p>
    </section>

    <section class="section snap-page">
      <div class="trust-box"><strong>${t("trust_t")}</strong><p>${t("trust_p")}</p></div>
    </section>

    <section class="section snap-page center">
      <h2>${t("final_h2")}</h2>
      <button class="btn btn-primary btn-block mt16" onclick="go('auth')">${t("hero_cta")}</button>
    </section>
  </main>
  ${siteFooter()}`;
}
function scrollToSec() { document.getElementById("how")?.scrollIntoView({ behavior: "smooth" }); }

/* ============================================================
   AUTH
   ============================================================ */
function vAuth() {
  const isLogin = state.authMode === "login";
  return `
  <div class="auth-wrap"><div class="wrap auth-main">
    <div class="auth-card">
      <div class="brand" style="margin-bottom:14px"><img class="brand-mark" src="HumanPatch_Logo.png?v=64" alt="HumanPatch — Every Choice Shapes Your Safety."></div>
      ${langDropdown()}
      <h1 style="margin-top:12px">${isLogin ? t("auth_login_h") : t("auth_signup_h")}</h1>
      <p class="sub">${isLogin ? t("auth_login_sub") : t("auth_signup_sub")}</p>
      <div class="field"><label for="a-name">${t("f_name")}</label><input id="a-name" autocomplete="username" placeholder="${isLogin ? "nama akunmu" : "mis. Rani"}"></div>
      <div class="field"><label for="a-pass">${t("f_pass")}</label>
        <div style="position:relative">
          <input id="a-pass" type="password" placeholder="••••••" autocomplete="off">
          <button class="pw-toggle" type="button" onclick="togglePw()" aria-label="toggle">👁</button>
        </div>
        <p class="err">${t("pass_short")}</p>
      </div>
      <button class="btn btn-primary btn-block" onclick="doAuth()">${isLogin ? t("btn_login") : t("btn_signup")}</button>
      <p class="auth-alt">${isLogin ? `${t("alt_to_signup")} <a href="#" onclick="setAuth('signup');return false">${t("btn_signup")}</a>` : `${t("alt_to_login")} <a href="#" onclick="setAuth('login');return false">${t("btn_login")}</a>`}</p>
      <div class="demo-note">${t("demo_note")}</div>
    </div>
  </div></div>`;
}
function setAuth(m) { state.authMode = m; render(); }
function togglePw() { const i = $("#a-pass"); i.type = i.type === "password" ? "text" : "password"; }
function hashPass(p) {
  // simple deterministic hash — demo-grade (this is a training sim, not a bank)
  let h = 5381;
  for (let i = 0; i < p.length; i++) h = ((h << 5) + h + p.charCodeAt(i)) >>> 0;
  return "h" + h.toString(36);
}
function doAuth() {
  const name = $("#a-name")?.value.trim();
  const pass = $("#a-pass")?.value || "";
  const users = JSON.parse(localStorage.getItem("hp2_users") || "{}");
  if (state.authMode === "signup") {
    if (!name) return toast(t("auth_err_name"));
    if (name in users) { toast(t("auth_err_exists")); setAuth("login"); return; }
    if (pass.length < 6) { $("#a-pass").closest(".field").classList.add("invalid"); return; }
    users[name] = { hash: hashPass(pass), created: Date.now() };
    localStorage.setItem("hp2_users", JSON.stringify(users));
    state.user = { name };
    switchUserSpace(name);
  } else {
    if (!name) return toast(t("auth_err_name"));
    const u = users[name];
    if (!u || u.hash !== hashPass(pass)) { toast(t("auth_err_wrong")); $("#a-pass").closest(".field").classList.add("invalid"); return; }
    state.user = { name };
    switchUserSpace(name);
  }
  saveLocal(); go("profiles");
}
function logout() { state.user = null; state.activeProfileId = null; state.guestMode = true; saveLocal(); go("landing"); }
function requireAuth(fn) {
  return (...args) => {
    if (!state.user) {
      // trial: play allowed, data lives in hp2_guest_* namespace (wiped on logout)
      state.guestMode = true;
    }
    return fn(...args);
  };
}

/* ============ PER-USER STORAGE ============ */
function userKey(name, key) { return "hp2_u_" + (name || "guest") + "_" + key; }
function switchUserSpace(name) {
  // stash current guest/current-user data under its own key, load the target user's
  if (state.user) {
    localStorage.setItem(userKey(state.user.name, "profiles"), JSON.stringify(state.profiles));
    localStorage.setItem(userKey(state.user.name, "active"), JSON.stringify(state.activeProfileId));
  }
  const hadGuestRun = state.guestMode && state.profiles.length > 0;
  if (state.guestMode) {
    localStorage.removeItem(userKey("guest", "profiles"));
    localStorage.removeItem(userKey("guest", "active"));
  }
  const saved = hadGuestRun
    ? { profiles: state.profiles, active: state.activeProfileId } // keep the live trial run
    : { profiles: JSON.parse(localStorage.getItem(userKey(name, "profiles")) || "[]"),
        active: JSON.parse(localStorage.getItem(userKey(name, "active")) || "null") };
  if (hadGuestRun && saved.profiles.length) {
    // merge: saved account profiles + live trial profiles (trial appended)
    const existing = JSON.parse(localStorage.getItem(userKey(name, "profiles")) || "[]");
    const ids = new Set(existing.map(p => p.id));
    saved.profiles = [...existing, ...saved.profiles.filter(p => !ids.has(p.id))];
  }
  state.profiles = saved.profiles;
  state.activeProfileId = saved.active || saved.profiles[0]?.id || null;
  state.guestMode = false;
}

/* ============================================================
   PROFILES
   ============================================================ */
const ARCHETYPES = [
  { id: "student",  icon: "🎓" },
  { id: "merchant", icon: "🛒" },
  { id: "worker",   icon: "💼" },
  { id: "parent",   icon: "🏠" },
  { id: "general",  icon: "🙂" },
];
function archName(id) { return t("arch_" + id); }
function archDesc(id) { return t("arch_" + id + "_d"); }
function vProfiles() {
  const ps = state.profiles;
  return `
  <header class="topbar"><div class="wrap-wide topbar-inner">
    <div class="brand"><img class="brand-mark" src="HumanPatch_Logo.png?v=64" alt="HumanPatch — Every Choice Shapes Your Safety."></div>
    <div style="display:flex;gap:10px;align-items:center">
      ${langDropdown()}
      <button class="btn btn-ghost nav-btn" onclick="logout()">${t("nav_logout")}</button>
    </div>
  </div></header>
  <main class="wrap" style="padding-bottom:40px">
    <section style="padding:22px 0 8px">
      <p class="dim small" style="font-weight:700;letter-spacing:.1em">${t("hi")}, ${esc((state.user?.name || "").toUpperCase())}</p>
      <h1 style="font-size:24px;letter-spacing:-.02em">${t("profiles_h1")}</h1>
      <p class="dim small">${t("profiles_sub")}</p>
    </section>
    <div class="cards">
      ${ps.map(p => `
        <div class="card" style="display:flex;gap:12px;align-items:center">
          <div class="avatar-xl" style="width:46px;height:46px;font-size:22px">${p.avatar}</div>
          <div style="flex:1">
            <strong style="font-size:15px">${archName(p.archetype)}</strong>
            <p style="margin:0">Ch ${Math.min(10, p.chapterDone?.length ? p.chapterDone[p.chapterDone.length-1]+1 : 1)}/10 · Lv ${p.level}${p.persona ? " · " + (PERSONA_FACTS[p.persona]?.name || p.persona) : ""}</p>
          </div>
          <button class="btn btn-primary" style="min-height:40px;padding:0 16px;font-size:13px" onclick="requireAuth(playProfile)('${p.id}')">${t("btn_play")}</button>
          <button class="btn btn-ghost" style="min-height:40px;padding:0 12px;font-size:13px;color:#F87171;border-color:#4C1D24" title="${t("delete_profile")}" onclick="delProfile('${p.id}')">🗑</button>
        </div>`).join("")}
      ${ps.length === 0 ? `<div class="card center"><p>${t("profiles_empty")}</p></div>` : ""}
    </div>
    <button class="btn btn-dark btn-block mt16" onclick="requireAuth(go)('wizard')">${t("btn_new_profile")}</button>
  </main>` + siteFooter();
}
function playProfile(id) { state.activeProfileId = id; saveLocal(); go("dashboard"); }

/* Enter the 10-chapter campaign from the world dashboard. The run lives on
   the PROFILE (p.mdRun) so each world keeps its own chapter progress. */
function enterChapters() {
  const p = activeProfile();
  if (!p) return;
  if (!p.mdRun) {
    p.mdRun = { chapter: 1, state: {}, indicators: { verify_source: 0, under_pressure: 0, protect_data: 0, report_threat: 0 }, outcomes: [], recoveryDone: {}, log: {} };
    saveLocal();
  }
  state.mdRun = p.mdRun;
  // restore transient chapter context from the persisted run
  MD.choice = null;
  MD.outcome = null;
  MD.recoveryDone = [];
  MD.seenNotif = false;
  const doneN = (p.mdRun.outcomes || []).filter(Boolean).length;
  if (doneN >= 10) { go("md-finale"); return; }
  p.mdRun.chapter = doneN + 1;
  go("md-notif");
  render();
}
/* leaving campaign back to the world dashboard */
function mdExitToWorld() {
  const p = activeProfile();
  // persist transient context back onto the profile run
  if (p && state.mdRun) {
    p.mdRun = state.mdRun;
    if (!p.mdRun.outcomes[p.mdRun.chapter - 1] && MD.outcome) {
      // chapter not yet advanced — keep outcome visible on return
    }
    saveLocal();
  }
  go("dashboard");
}
function delProfile(id) {
  const p = state.profiles.find(x => x.id === id);
  const nm = p ? (p.persona ? (PERSONA_FACTS[p.persona]?.name || p.persona) : archName(p.archetype)) : "?";
  if (!confirm(t("confirm_del_profile")(nm))) return;
  state.profiles = state.profiles.filter(x => x.id !== id);
  if (state.activeProfileId === id) { state.activeProfileId = state.profiles[0]?.id || null; state.world = null; }
  saveLocal();
  toast("🗑 " + nm);
  render();
}

/* ============================================================
   WIZARD
   ============================================================ */
const AVATARS = ["🙂", "😎", "👩‍🎓", "🧑‍🏫", "👩‍💼", "🧑‍🌾", "👨‍🔧", "👩‍💻", "🧕", "👨‍🦱"];
const WALLS = [0, 1, 2, 3];
function wizAIBadge() {
  if (state.castPrefetchFailed) return "✕ AI pause";
  if (state.prefetchedCast) return "✓ Dunia siap";
  return "🪄 Menyiapkan duniamu…";
}
function vWizard() {
  const w = state.wizard;
  const step = w.step;
  let body = "";
  let nextEnabled = true;
  if (step === 1) {
    nextEnabled = !!w.archetype;
    body = `<h1>${t("wiz1_h")}</h1><p class="sub">${t("wiz1_sub")}</p>
    <div class="choice-grid">
      ${ARCHETYPES.map(a => `
        <button class="choice ${w.archetype === a.id ? "sel" : ""}" onclick="wizSet('archetype','${a.id}')">
          <span class="ci" style="background:var(--mint)">${a.icon}</span>
          <span><strong>${archName(a.id)}</strong><span>${archDesc(a.id)}</span></span>
        </button>`).join("")}
    </div>`;
  } else if (step === 2) {
    body = `<h1>${t("wiz2_h")}</h1><p class="sub">${t("wiz2_sub")}</p>
    <p class="small dim" style="margin-bottom:8px;font-weight:700">${t("avatar_l")}</p>
    <div class="chips">${AVATARS.map(a => `<button class="chip2 ${w.avatar === a ? "sel" : ""}" onclick="wizSet('avatar','${a}');event.stopPropagation()">${a}</button>`).join("")}</div>
    <p class="small dim" style="margin:16px 0 8px;font-weight:700">${t("wallpaper_l")}</p>
    <div class="chips">${WALLS.map(x => `<button class="chip2 ${w.wallpaper === x ? "sel" : ""}" onclick="wizSet('wallpaper',${x});event.stopPropagation()">${t("wall"+x)}</button>`).join("")}</div>`;
  } else if (step === 3) {
    body = `<h1>${t("wiz3_h")}</h1><p class="sub">${t("wiz3_sub")}</p>
    <div class="choice-grid">
      ${[["new", "🌱"], ["basic", "🌿"], ["pro", "🌳"]].map(o => `
        <button class="choice ${w.pref === o[0] ? "sel" : ""}" onclick="wizSet('pref','${o[0]}')">
          <span class="ci" style="background:var(--mint)">${o[1]}</span>
          <span><strong>${t("pref_"+o[0]+"_t")}</strong><span>${t("pref_"+o[0]+"_p")}</span></span>
        </button>`).join("")}
    </div>`;
  } else if (step === 4) {
    body = `<h1>${t("wiz4_h")}</h1><p class="sub">${t("wiz4_sub")}</p>
    <div class="card" style="display:flex;gap:14px;align-items:center">
      <div class="avatar-xl">${w.avatar}</div>
      <div><strong style="font-size:16px">${w.archetype ? archName(w.archetype) : ""}</strong>
      <p class="small dim" style="margin:0">${w.archetype ? archDesc(w.archetype) : ""}</p></div>
    </div>
    <div class="card mt8"><strong class="small">${t("review_wallpaper")}</strong><p class="small dim">${t("wall"+w.wallpaper)}</p></div>
    <div class="card mt8"><strong class="small">${t("review_pref")}</strong><p class="small dim">${t("pref_"+w.pref+"_t")}</p></div>`;
  }
  return `
  <header class="topbar"><div class="wrap-wide topbar-inner">
    <button class="brand" onclick="go('profiles')" style="background:none;border:none"><img class="brand-mark" src="HumanPatch_Logo.png?v=64" alt="HumanPatch — Every Choice Shapes Your Safety."></button>
    <span class="dim small">${t("step_of")(step)}</span>
    <span id="wiz-ai-pill" class="wiz-ai-pill" style="${state.prefetchedCast ? 'background:rgba(52,211,153,.15);color:#1C82FF' : 'background:rgba(148,163,184,.1);color:#94A3B8'}">${wizAIBadge()}</span>
  </div></header>
  <main class="wrap" style="padding-bottom:40px">
    <div class="wizard-progress">${[1,2,3,4].map(i => `<span class="${i < step ? "done" : i === step ? "cur" : ""}"></span>`).join("")}</div>
    ${body}
    <div class="wiz-nav mt16" style="display:grid;gap:8px">
      ${step < 4
        ? `<button class="btn btn-primary btn-block" ${nextEnabled ? "" : "disabled style='opacity:.4;pointer-events:none'"} onclick="wizNext()">${t("btn_next")}</button>`
        : `<button class="btn btn-primary btn-block" onclick="createProfile()">${t("btn_create_world")}</button>`}
      <button class="btn btn-ghost btn-block" onclick="wizBack()">${step > 1 ? t("btn_back") : t("btn_cancel")}</button>
    </div>
  </main>`;
}
function wizSet(k, v) { state.wizard[k] = v; render(); }
function wizNext() { if (state.wizard.step < 4) { state.wizard.step++; render(); window.scrollTo(0,0); } }
function wizBack() { if (state.wizard.step > 1) { state.wizard.step--; render(); } else go("profiles"); }

function createProfile() {
  const w = state.wizard;
  const story = (typeof pickStoryline === "function") ? pickStoryline(w.archetype) : null;
  const p = {
    id: "p" + Date.now().toString(36),
    name: archName(w.archetype),
    archetype: w.archetype,
    persona: w.persona || "",
    avatar: w.avatar,
    wallpaper: w.wallpaper,
    pref: w.pref,
    day: 1, xp: 0, level: 1,
    done: [], history: [],
    storyId: story ? story.id : null,
    cast: state.prefetchedCast || null, // from prefetch started at card click
  };
  state.prefetchedCast = null;
  state.profiles.push(p);
  state.activeProfileId = p.id;
  saveLocal();
  go("prep");
  runPrep();
}

/* ============================================================
   WORLD PREP
   ============================================================ */
function vPrep() {
  const p = activeProfile();
  const story = p?.storyId ? (STORYLINES[p.archetype] || []).find(s => s.id === p.storyId) : null;
  const stTitle = story ? (story.title[state.lang] || story.title.en) : null;
  return `
  <div class="prep-screen"><div class="wrap prep-inner">
    <div class="prep-phone-mock"></div>
    <h1 style="font-size:22px">${t("prep_h")}</h1>
    <p class="dim small" style="margin-top:6px">${t("prep_sub")}</p>
    ${stTitle ? `<div style="margin-top:10px;padding:10px 16px;border-radius:12px;background:#60B6FF;color:#0D408E;font-weight:700;font-size:13px">📖 ${state.lang === "id" ? "Storyline" : "Storyline"}: ${stTitle}</div>` : ""}
    <div class="prep-steps">
      ${[1,2,3,4].map(i => `
        <div class="prep-step" id="ps-${i-1}"><div class="spin"></div><p>${t("prep_s"+i)}</p></div>`).join("")}
    </div>
  </div></div>`;
}
async function fetchStoryContext() {
  const p = activeProfile();
  if (!p) return;
  if (p.cast) return; // already generated
  const facts = (typeof PERSONA_FACTS !== "undefined" && PERSONA_FACTS[p.persona]) || {};
  const story = p.storyId && typeof STORYLINES !== "undefined"
    ? (STORYLINES[p.archetype] || []).find(s => s.id === p.storyId) : null;
  // up to 3 attempts — NEVER fall back to generic names
  for (let attempt = 0; attempt < 3 && !p.cast; attempt++) {
    try {
      const r = await fetch(API + "/story-context", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lang: state.lang, archetype: p.archetype,
          persona: facts.name ? facts : { name: p.name, level: p.archetype },
          story: story || {},
        }),
      });
      const d = await r.json();
      const ok = d && d.cast && Array.isArray(d.cast.npcs) &&
                 d.cast.npcs.length >= 4 &&
                 d.cast.npcs.every(n => n && typeof n.name === "string" && n.name.length > 1) &&
                 d.cast.school && d.cast.class_group;
      if (ok) {
        p.cast = d.cast;
        saveLocal();
        // if we're already in the world with a stale (cast-less) build, rebuild it
        if (state.screen === "phone" || state.screen === "splash") {
          state.world = buildWorld(p, p.day);
          if (state.screen === "phone") render();
        }
        return;
      }
    } catch (e) { /* retry */ }
    await new Promise(res => setTimeout(res, 1200 * (attempt + 1)));
  }
  // all attempts failed → stay on loading screen with error, user can retry manually
  state.castFailed = true;
  render();
}

function runPrep() {
  const steps = [0, 1, 2, 3].map(i => $(`#ps-${i}`));
  const p = activeProfile();
  const castWait = (async () => {
    // world processing lives HERE (during "preparing your world"), not at start-day
    if (p?.cast) return true;
    if (state.castPromise) { const c = await state.castPromise; if (c && !p.cast) { p.cast = c; saveLocal(); } }
    else if (p) { await fetchStoryContext(); } // rare: no prefetch (e.g. old profile)
    return !!p?.cast;
  })();
  let i = 0;
  const tick = () => {
    if (i > 0) steps[i - 1]?.classList.replace("on", "done");
    steps[i]?.classList.add("on");
    i++;
    if (i < steps.length) setTimeout(tick, 700);
    else {
      // animation done — but hold on the LAST step until the AI cast is ready
      castWait.then(ok => {
        steps[3]?.classList.replace("on", "done");
        if (!ok) state.castFailed = true;
        go("dashboard");
      });
    }
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
  const xpNeed = 100 * p.level;
  const xpPct = Math.min(100, Math.round((p.xp / xpNeed) * 100));
  return `
  <header class="topbar"><div class="wrap-wide topbar-inner">
    <div class="brand"><img class="brand-mark" src="HumanPatch_Logo.png?v=64" alt="HumanPatch — Every Choice Shapes Your Safety."></div>
    <div style="display:flex;gap:10px;align-items:center">
      ${langDropdown()}
      <button class="btn btn-ghost nav-btn" onclick="go('profiles')">${t("nav_profiles")}</button>
    </div>
  </div></header>
  <main class="wrap" style="padding-bottom:44px">
    <section class="dash-hero">
      <div class="avatar-xl">${p.avatar}</div>
      <div style="flex:1">
        <h1>${archName(p.archetype)}</h1>
        <div class="lvl-line"><span class="lvl-badge">${t("dash_lvl")(p.level)}</span> <span>${p.xp} / ${xpNeed} XP</span></div>
        <div class="xp-bar"><i style="width:${xpPct}%"></i></div>
      </div>
    </section>

    <div class="dash-cta">
      <div class="play-card">
        <p class="kicker">${t("chap_day_of")(curChapter())}</p>
        <h2>${chapterTitle(curChapter())}</h2>
        <p>${chapterObjText(curChapter())}</p>
        <button class="btn" onclick="startDay()">${t("btn_continue")}</button>
      </div>
    </div>

    <section class="section" style="border-top:none;padding-top:6px">
      <h2 style="font-size:16px">${t("journey_h")}</h2>
      <p class="sub" style="margin-bottom:12px">${t("journey_sub")}</p>
      <div class="journey">
        ${Array.from({length:10}, (_, i) => {
          const n = i + 1;
          const done = p.chapterDone && p.chapterDone.includes(n);
          const cur = n === curChapter() && !done;
          return `<div class="jday ${done ? "done" : ""} ${cur ? "cur" : ""}" title="${esc(chapterTitle(n))}">
            <div class="jdot">${done ? "✓" : n}</div><span>${esc(chapterTitle(n))}</span>
          </div>`;
        }).join("")}
      </div>
    </section>

    <section class="section" style="padding-top:0">
      <h2 style="font-size:16px">${t("world_h")(archName(p.archetype))}</h2>
      <p class="sub" style="margin-bottom:10px">${t("world_sub")}</p>
      <div class="cards">
        ${(WORLD_TEMPLATES[p.archetype]?.contacts || []).slice(0, 4).map(c => `
          <div class="card" style="display:flex;gap:10px;align-items:center;padding:12px">
            <div style="width:36px;height:36px;border-radius:50%;background:${c.color};display:grid;place-items:center;font-size:17px">${c.avatar}</div>
            <div><strong class="small">${esc(L(c.name))}</strong><p style="margin:0" class="small dim">${esc(L(c.rel))}</p></div>
          </div>`).join("")}
      </div>
    </section>
  </main>`;
}
function retryCast() { state.castFailed = false; render(); fetchStoryContext().then(() => { if (activeProfile().cast) { state.world = buildWorld(activeProfile(), activeProfile().day); state.splashReady = true; render(); } }); }
function startDay() {
  const p = activeProfile();
  // world processing already happened during "preparing your world" (runPrep).
  // startDay is now ALWAYS instant — but stay safe for stale profiles:
  // snap in any late-arriving prefetch, else degrade gracefully (world builds
  // without cast; a background fetch fills contacts when it lands).
  if (!p.cast && (state.prefetchedCast || state.castPromise)) {
    const c = state.prefetchedCast; // may still be null if promise pending
    if (c) { p.cast = c; state.prefetchedCast = null; saveLocal(); }
  }
  if (!p.cast && state.castPromise) {
    // prefetch still in flight (rare fast path) — show splash, resolve when done
    go("splash");
    state.splashReady = false; state.castFailed = false; render();
    state.castPromise.then(c => {
      if (c && !p.cast) { p.cast = c; saveLocal(); }
      state.world = buildWorld(p, p.day);
      state.splashReady = true;
      render();
    });
    return;
  }
  state.splashReady = true;
  state.world = buildWorld(p, p.day);
  go("splash");
  if (!p.cast) {
    // stale profile (no prefetch ever ran): fill AI names in the background —
    // world already rendered with defaults, rebuilds itself when the cast lands
    fetchStoryContext();
  }
}

/* ============================================================
   DAY SPLASH
   ============================================================ */
/* ---- MD 10-chapter model: each incident = its own chapter ----
   world day d (1-5) x slot A/B -> chapter = (d-1)*2 + (A?1:2).
   Chapter state lives on the profile: p.chapter tracks the NEXT chapter. */
function curChapter() {
  // source of truth: p.chapterDone (chapters 1..10 resolved so far).
  // The next chapter = first gap; all done → 10.
  const p = activeProfile();
  if (!p) return 1;
  const done = p.chapterDone || [];
  for (let n = 1; n <= 10; n++) if (!done.includes(n)) return n;
  return 10;
}
function markChapterDone(n) {
  const p = activeProfile();
  if (!p) return;
  if (!p.chapterDone) p.chapterDone = [];
  if (!p.chapterDone.includes(n)) { p.chapterDone.push(n); p.chapterDone.sort((x, y) => x - y); }
  saveLocal();
}
function chapterTitle(n) { return t("chapter" + n + "_t"); }
function chapterObjText(n) { return t("chapter" + n + "_o"); }

function vSplash() {
  const w = state.world;
  const ready = state.splashReady;
  const s = storyState();
  // storyline continuity (doc §4.C): yesterday's mistakes cast a shadow
  const carry = [];
  if (s.credentials_leaked || s.wifi_leaked) carry.push(L({id:"Kredensialmu sempat bocor — akunmu rawan hari ini.", en:"Your credentials leaked — your account is at risk today.", es:"Tus credenciales se filtraron — tu cuenta está en riesgo hoy.", fr:"Vos identifiants ont fuité — votre compte est menacé aujourd'hui.", it:"Le tue credenziali sono trapelate — il tuo account è a rischio oggi.", de:"Deine Zugangsdaten sind geleakt — dein Konto ist heute gefährdet.", pt:"Suas credenciais vazaram — sua conta está em risco hoje."}));
  if (s.account_breached) carry.push(L({id:"Akunmu sempat dibajak kemarin — periksa perangkat aktif.", en:"Your account was hijacked yesterday — check active devices.", es:"Tu cuenta fue hackeada ayer — revisa los dispositivos activos.", fr:"Ton compte a été piraté hier — vérifie les appareils actifs.", it:"Il tuo account è stato violato ieri — controlla i dispositivi attivi.", de:"Dein Konto wurde gestern übernommen — prüfe aktive Geräte.", pt:"Sua conta foi invadida ontem — verifique os dispositivos ativos."}));
  if (s.spyware_installed) carry.push(L({id:"Ada aplikasi mencurigakan di HP-mu — periksa izin di Security.", en:"A suspicious app is on your phone — check permissions in Security.", es:"Hay una app sospechosa en tu teléfono — revisa permisos en Security.", fr:"Une app suspecte est sur ton téléphone — vérifie dans Security.", it:"C'è un'app sospetta sul telefono — controlla i permessi in Security.", de:"Eine verdächtige App ist auf dem Handy — prüfe die Rechte in Security.", pt:"Há um app suspeito no seu celular — revise permissões no Security."}));
  if (s.personal_data_public) carry.push(L({id:"Datamu terlihat publik — orang asing bisa menyebut identitasmu.", en:"Your data is public — strangers can cite your identity.", es:"Tus datos son públicos — extraños pueden citar tu identidad.", fr:"Tes données sont publiques — des inconnus peuvent citer ton identité.", it:"I tuoi dati sono pubblici — sconosciuti possono citare la tua identità.", de:"Deine Daten sind öffentlich — Fremde können deine Identität zitieren.", pt:"Seus dados são públicos — estranhos podem citar sua identidade."}));
  if (s.wallet_damaged) carry.push(L({id:"Dompetmu sempat terkuras — waspada permintaan uang berikutnya.", en:"Your wallet took a hit — stay alert for the next money ask.", es:"Tu cartera sufrió — alerta a la próxima petición de dinero.", fr:"Ton portefeuille a souffert — méfie-toi des prochaines demandes d'argent.", it:"Il tuo portafoglio ha sofferto — attento alla prossima richiesta di denaro.", de:"Dein Portemonnaie wurde belastet — Vorsicht bei der nächsten Geldfrage.", pt:"Sua carteira sofreu — atenção ao próximo pedido de dinheiro."}));
  return `
  <div class="day-splash">
    <p class="daynum">${t("chap_day_of")(curChapter())}</p>
    <h1>${w ? chapterTitle(curChapter()) : t("loading_world")}</h1>
    ${w ? `<p class="dim">${chapterObjText(curChapter())}</p>` : ""}
    ${carry.length ? `<div class="carry-note">${carry.map(c => `<p>⚠️ ${c}</p>`).join("")}</div>` : ""}
    ${w ? `<div class="obj">${t("obj_prefix")} ${chapterObjText(curChapter())}</div>` : ""}
    ${ready
      ? `<button class="btn btn-primary" onclick="enterPhone()">${t("btn_power")}</button>`
      : state.castFailed
        ? `<p style="color:#F87171;font-size:13px">${t("loading_world_err")}</p><button class="btn btn-primary" style="margin-top:10px" onclick="retryCast()">${t("retry")}</button>`
        : `<div class="spin" style="margin:22px auto"></div><p class="dim small">${t("loading_world_sub")}</p>`}
    <button class="btn btn-ghost" style="color:#94A3B8;border-color:#334155;margin-top:10px" onclick="requireAuth(go)('dashboard')">${t("back_dash")}</button>
  </div>`;
}

/* ============================================================
   THE SIMULATED PHONE
   ============================================================ */
function unreadTotal() { return state.world ? state.world.notifs.filter(n => !n.read).length : 0; }

function vPhone() {
  let w = state.world;
  if (!w) {
    // defensive: phone screen without a world (stale navigation) — rebuild it
    const p = activeProfile();
    if (p) { state.world = buildWorld(p, p.day || 1); }
    else { return `<div class="phone-stage center"><div class="card center"><p>${t("loading_world")}</p></div></div>`; }
  }
  w = state.world; // re-point after possible rebuild above
  const p = activeProfile();
  const showWelcome = w.day === 1 && !p?.seenWelcome;
  return `
  <div class="phone-stage">
    <div class="phone-topbar">
      <button class="exit" onclick="exitPhone()">${t("exit")}</button>
      <span>${t("chap_day_of")(curChapter())} · ${chapterTitle(curChapter())}</span>
      <span class="demo-flag">${t("demo_flag")(state.mission?.level || (state.world?.day || 1))}</span>
    </div>
    <div class="phone-frame">
      <button class="statusbar" onclick="toggleNotif(true)" aria-label="${t("notif_h")(unreadTotal())}">
        <span>${w.phoneTime}</span>
        <span class="sicons"><span class="sbatt">🔋${w.battery}%</span><span>▮▮▮</span></span>
      </button>
      ${state.openApp ? vAppWindow() : vHomeScreen()}
      ${state.notifOpen ? vNotifPanel() : ""}
      ${state.sheet ? vSheet() : ""}
    </div>
    ${showWelcome ? vWelcomeOverlay() : ""}
    ${state.toast ? `<div class="toast">${esc(typeof state.toast === "function" ? state.toast() : state.toast)}</div>` : ""}
  </div>`;
}

function unreadFor(appId) { return state.world.notifs.filter(n => n.app === appId && !n.read).length; }



function vWelcomeOverlay() {
  return `
  <div class="welcome-backdrop" onclick="dismissWelcome()">
    <div class="welcome-card" onclick="event.stopPropagation()">
      <div class="welcome-icon">📱</div>
      <h2>${t("welcome_h")}</h2>
      <p>${t("welcome_p1")}</p>
      <ul class="welcome-tips">
        <li><span>🔔</span><div><strong>${t("welcome_t1_h")}</strong><br>${t("welcome_t1_p")}</div></li>
        <li><span>💬</span><div><strong>${t("welcome_t2_h")}</strong><br>${t("welcome_t2_p")}</div></li>
        <li><span>📓</span><div><strong>${t("welcome_t3_h")}</strong><br>${t("welcome_t3_p")}</div></li>
      </ul>
      <p class="welcome-warn">${t("welcome_warn")}</p>
      <button class="btn btn-primary btn-block" onclick="dismissWelcome()">${t("welcome_cta")}</button>
    </div>
  </div>`;
}
function dismissWelcome() {
  const p = activeProfile();
  if (p) { p.seenWelcome = true; saveLocal(); }
  render();
}function vHomeScreen() {
  const w = state.world;
  const p = activeProfile();
  const wall = WALL_CSS[p.wallpaper] || w.wallpaper;
  const unread = w.notifs.filter(n => !n.read).length;
  const atkApp = w.attack?.app;
  return `
  <div class="homescreen" style="background:${wall}">
    <div class="widget">
      <p class="day-label">${t("chap_day_of")(curChapter())} · ${chapterTitle(curChapter())}</p>
      <h3>${t("morning")(archName(p.archetype).split(" ")[0])}</h3>
      <p>${w.day === 1 ? t("day1_hint")(unread) : t("day2_hint")(unread)}</p>
    </div>
    <div class="obj-card ${state.objCollapsed ? "collapsed" : ""}">
      <button class="obj-head" onclick="toggleObj()" aria-expanded="${!state.objCollapsed}">
        <strong>🎯 ${t("day_obj_h")}</strong>
        <span class="obj-count">${dayObjectives(w.day).filter(o => o.done).length}/${dayObjectives(w.day).length} ${state.objCollapsed ? "▾" : "▴"}</span>
      </button>
      ${state.objCollapsed ? "" : `
      <ul class="obj-list">
        ${dayObjectives(w.day).map(o => `<li class="${o.done ? "done" : ""}">${o.done ? "✔" : "○"} ${o.icon || ""} ${esc(L(o.label))}</li>`).join("")}
      </ul>
      ${day1Done() ? `<button class="btn btn-primary btn-block" style="min-height:44px" onclick="endDay1()">${w.day < 5 ? t("end_day_btn")(w.day * 2) : t("btn_finish_ch")}</button>` : `<p class="obj-hint">${t("day_obj_hint")}</p>`}`}
    </div>
    <div class="app-grid">
      ${w.apps.map(a => {
        const isAtk = a.id === atkApp && w.attack;
        const unreadN = unreadFor(a.id);
        const badge = isAtk ? "!" : (unreadN > 9 ? "9+" : unreadN || "");
        return `<button class="app-icon" onclick="openApp('${a.id}')">
          ${a.iconImg ? `<img class="ai-img" src="${a.iconImg}" alt="${a.name}">${badge ? `<span class="badge">${badge}</span>` : ""}` : `<span class="ai" style="background:${a.bg}">${a.icon}${badge ? `<span class="badge">${badge}</span>` : ""}</span>`}
          <span class="label">${a.name}</span>
        </button>`;
      }).join("")}
    </div>
    <div class="dock">
      ${["chatloop", "messagebox", "safebrowse", "settings"].map(id => {
        const a = w.apps.find(x => x.id === id) || w.apps[0];
        const unreadN = unreadFor(a.id);
        const badge = (a.id === atkApp && w.attack) ? "!" : (unreadN > 9 ? "9+" : unreadN || "");
        return `<button class="app-icon" onclick="openApp('${a.id}')" aria-label="${a.name}">
          ${a.iconImg ? `<img class="ai-img dock" src="${a.iconImg}" alt="${a.name}">${badge ? `<span class="badge">${badge}</span>` : ""}` : `<span class="ai" style="background:${a.bg};width:46px;height:46px;font-size:20px">${a.icon}${badge ? `<span class="badge">${badge}</span>` : ""}</span>`}
        </button>`;
      }).join("")}
    </div>
  </div>`;
}

/* ---------- app windows ---------- */
function vAppWindow() {
  const w = state.world;
  const app = state.openApp;
  if (app === "chatloop" && state.openChat) return vChatThread(state.openChat);
  const meta = w.apps.find(a => a.id === app) || { name: app, icon: "📱", bg: "#64748B" };
  let body = "";
  if (state.atkPreview && w.attack && w.attack.app === app && !w.attack.done) body = vAtkPreview();
  else if (app === "chatloop") body = vChatLoop();
  else if (app === "messagebox") body = vMessageBox();
  else if (app === "journal") body = vJournalApp();
  else if (app === "mailbox") body = vMailboxApp(meta);
  else if (app === "security") body = vSecurityApp();
  else if (app === "settings") body = vSettingsApp();
  else if (app === "phone") body = vPhoneApp();
  else body = vGenericApp(meta);
  return `
  <div class="appwin">
    <div class="appbar">
      <button class="back" onclick="closeApp()" aria-label="back">${icons.back}</button>
      <h5>${meta.iconImg ? `<img class="ai-img sm" src="${meta.iconImg}" alt="">` : meta.icon} ${meta.name}</h5>
    </div>
    <div class="appbody">${body}</div>
  </div>`;
}
function openApp(id) {
  state.openApp = id;
  state.openChat = null;
  // land on the normal app view first — the attack item in the list is what
  // opens the preview (player's choice, not forced)
  state.atkPreview = false;
  if (id === "settings" && !state.events.some(e => e.includes("📶"))) trackEvent("📶 WiFi settings");
  if (id === "phone" && !state.events.some(e => e.includes("📞"))) trackEvent("📞 phone log");
  if (id === "chatloop") state.openedChat = true;
  if (id === "mailbox" && !state.events.some(e => e.includes("📧"))) trackEvent("📧 Mailbox");
  if (id === "security") state.openedSecurity = true;
  if (id === "journal") state.openedJournal = true;
  render();
  // NOTE: no auto-encounter anymore — opening the app lands on the preview /
  // chat list; the player chooses to engage from there (check-first flow).
}
function closeApp() { state.openApp = null; state.openChat = null; state.atkPreview = false; render(); }

/* ---------- Phone app: incoming-call attack + call log ---------- */
function vPhoneApp() {
  const w = state.world;
  const atk = w.attack;
  const live = atk && atk.app === "phone" && !atk.done;
  if (live) {
    // incoming call screen — the day-4 incident
    const vt = verifyTargetFor(atk) || {};
    return `
    <div class="card center call-live">
      <span style="font-size:44px" class="pulse">📞</span>
      <h3 style="margin:8px 0 2px">${esc(L(atk.from))}</h3>
      <p class="small dim">${L({id:"Panggilan masuk…", en:"Incoming call…", es:"Llamada entrante…", fr:"Appel entrant…", it:"Chiamata in arrivo…", de:"Eingehender Anruf…", pt:"Chamada recebida…"})}</p>
      <p class="small" style="margin:10px 0;opacity:.85">${esc(L(atk.notifText))}</p>
      <div class="call-actions">
        <button class="btn btn-ghost" onclick="actDismiss('atk')">${L({id:"📵 Tolak", en:"📵 Decline", es:"📵 Rechazar", fr:"📵 Refuser", it:"📵 Rifiuta", de:"📵 Ablehnen", pt:"📵 Recusar"})}</button>
        <button class="btn btn-primary" onclick="openAtkPreview()">${L({id:"🔍 Cek dulu", en:"🔍 Check first", es:"🔍 Revisar", fr:"🔍 Vérifier", it:"🔍 Verifica", de:"🔍 Erst prüfen", pt:"🔍 Verificar"})}</button>
      </div>
      <button class="btn btn-ghost btn-block" style="margin-top:8px;color:#94A3B8" onclick="closeApp()">${L({id:"← Kembali — biarkan berdering", en:"← Back — let it ring", es:"← Volver — dejar sonar", fr:"← Retour — laisser sonner", it:"← Indietro — lascia suonare", de:"← Zurück — klingeln lassen", pt:"← Voltar — deixar tocando"})}</button>
    </div>`;
  }
  // call log (day-4 exploration mission + history)
  const cast = activeProfile()?.cast || {};
  const log = [
    { icon: "📵", name: atk ? atk.from : "—", when: "09:02", tag: {id:"Ditolak · mencurigakan", en:"Declined · suspicious", es:"Rechazada · sospechosa", fr:"Refusé · suspect", it:"Rifiutata · sospetta", de:"Abgelehnt · verdächtig", pt:"Recusada · suspeita"} },
    { icon: "📞", name: (cast.npcs || []).find(n => n.role === "parent")?.name || L({id:"Ibu", en:"Mom", es:"Mamá", fr:"Maman", it:"Mamma", de:"Mama", pt:"Mãe"}), when: "08:14", tag: {id:"Kontak tersimpan", en:"Saved contact", es:"Contacto guardado", fr:"Contact enregistré", it:"Contatto salvato", de:"Gespeicherter Kontakt", pt:"Contato salvo"} },
    { icon: "📞", name: (cast.npcs || []).find(n => n.role === "best_friend")?.name || L({id:"Sahabat", en:"Best friend", es:"Mejor amigo", fr:"Meilleur ami", it:"Migliore amico", de:"Bester Freund", pt:"Melhor amigo"}), when: "Kemarin", tag: {id:"Kontak tersimpan", en:"Saved contact", es:"Contacto guardado", fr:"Contact enregistré", it:"Contatto salvato", de:"Gespeicherter Kontakt", pt:"Contato salvo"} },
  ];
  return `
    <h4 class="app-h">${L({id:"Riwayat Panggilan", en:"Call Log", es:"Registro de llamadas", fr:"Journal d'appels", it:"Registro chiamate", de:"Anrufliste", pt:"Histórico de chamadas"})}</h4>
    <div class="notif-list">
      ${log.map(c => `
        <div class="notif-item">
          <div class="cav" style="background:#E2E8F0">${c.icon}</div>
          <div class="cb">
            <div class="ct"><strong>${esc(L(c.name))}</strong> <span class="dim small">${c.when}</span></div>
            <p class="small dim">${L(c.tag)}</p>
          </div>
        </div>`).join("")}
    </div>
    <p class="note">${L({id:"💡 Nomor asing yang mengaku petugas? Google nomornya, atau tutup dan hubungi kanal resmi.", en:"💡 Unknown number claiming to be staff? Search the number, or hang up and call the official line.", es:"💡 ¿Número desconocido de 'personal'? Búscalo o cuelga y llama al canal oficial.", fr:"💡 Numéro inconnu qui se dit « personnel » ? Cherchez le numéro, ou raccrochez et appelez le canal officiel.", it:"💡 Numero sconosciuto che dice di essere 'staff'? Cerca il numero o riaggancia e chiama il canale ufficiale.", de:"💡 Unbekannte Nummer als 'Mitarbeiter'? Nummer suchen oder auflegen und offiziellen Kanal anrufen.", pt:"💡 Número desconhecido dizendo ser 'equipe'? Pesquise o número ou desligue e chame o canal oficial."})}</p>`;
}

function vChatLoop() {
  if (state.openChat) return vChatThread(state.openChat);
  const w = state.world;
  const atk = w.attack;
  const atkThread = atk && atk.app === "chatloop" && !atk.done ? atk : null;
  return `
    ${atkThread ? `
    <div class="chat-list-item unread" onclick="openAtkPreview()">
      <div class="cav" style="background:#FEE2E2">👤</div>
      <div class="cb">
        <div class="ct"><strong>${esc(L(atkThread.from))}</strong><time>09:02</time></div>
        <p>${esc(L(atkThread.notifText))}</p>
      </div>
      <span class="dot-un"></span>
    </div>` : ""}
    ${w.contacts.map(c => {
      const msg = chatPreview(c.id);
      return `
      <div class="chat-list-item" onclick="openChat('${c.id}')">
        <div class="cav" style="background:${c.color}">${c.avatar}</div>
        <div class="cb">
          <div class="ct"><strong>${esc(L(c.name))}</strong><time>08:${String(30 + (c.name.length % 20)).padStart(2, "0")}</time></div>
          <p>${esc(msg)}</p>
        </div>
      </div>`;
    }).join("")}`;
}

/* ---------- attack preview: CHECK the sender BEFORE engaging ---------- */
function openAtkPreview() {
  state.atkPreview = true;
  render();
}
function closeAtkPreview() {
  state.atkPreview = false;
  render();
}
/* app icon renderer: uses the user's PNG icon set when available */
function appIconEl(meta, style, badge) {
  if (meta && meta.iconImg) return `<img class="ai-img" src="${meta.iconImg}" style="${style || ""}" alt="${meta.name}">${badge || ""}`;
  return `<span class="ai" style="${style || ""}">${meta ? meta.icon : "?"}${badge || ""}</span>`;
}
function vAtkPreview() {
  const atk = state.world?.attack;
  if (!atk) return "";
  const meta = (APP_CATALOG[atk.app] || {});
  const vt = verifyTargetFor(atk) || {};
  const isWifi = vt.kind === "wifi", isCall = vt.kind === "call";
  // header icon: use the APP's own icon (mailbox=📧, messagebox=📬, chatloop=💬, safebrowse=🌐)
  // — only fall back to 👤 for unspecific chat senders
  const appIcon = meta.icon || "👤";
  const headerIcon = isWifi ? "📶" : (isCall ? "📞" : appIcon);
  const checkBtn = vt.previewBtn ? L(vt.previewBtn) : `🔍 ${t("check_sender")}`;
  // subline: per-channel, never "unknown number" for non-call incidents
  const subLine = isWifi ? L({id:"Jaringan terbuka terdeteksi", en:"Open network detected", es:"Red abierta detectada", fr:"Réseau ouvert détecté", it:"Rete aperta rilevata", de:"Offenes Netzwerk erkannt", pt:"Rede aberta detectada"})
    : (isCall ? L({id:"Nomor tidak dikenal", en:"Unknown number", es:"Número desconocido", fr:"Numéro inconnu", it:"Numero sconosciuto", de:"Unbekannte Nummer", pt:"Número desconhecido"})
    : (vt.kind === "email" ? L({id:"Domain pengirim mencurigakan", en:"Suspicious sender domain", es:"Dominio del remitente sospechoso", fr:"Domaine d'expéditeur suspect", it:"Dominio del mittente sospetto", de:"Verdächtige Absender-Domain", pt:"Domínio do remetente suspeito"})
    : (vt.kind === "sms" ? L({id:"SMS minta kamu balas kode", en:"SMS asks you to reply with a code", es:"SMS pide responder con un código", fr:"SMS demande de répondre avec un code", it:"SMS chiede di rispondere con un codice", de:"SMS bittet um Antwort mit einem Code", pt:"SMS pede para responder com um código"})
    : t("not_in_contacts"))));
  // MD Ch1: after the email link, the preview IS the spoofed login page —
  // render it as a browser page with a fake URL bar, not a chat bubble.
  const isPortal = atk.scenario === "story_komp_d1_password";
  if (isPortal) {
    return `
    <div class="atk-preview portal-page">
      <div class="url-bar"><span class="lock">🔒</span><span class="url">portal-kompetisi-daftar<b style="color:#DC2626">.id</b>/login</span><button class="ap-close" onclick="closeAtkPreview()" title="${L({id:"Tutup dulu — insiden tetap ada", en:"Close for now — incident stays"})}">✕</button></div>
      <div class="portal-body">
        <div style="font-size:30px">🏆</div>
        <h4>${esc(L(atk.from))}</h4>
        <p class="small dim">${esc(t("mail_ch1_subject"))}</p>
        <div class="login-form">
          <div class="lfield">📧 ${L({id:"Email sekolah", en:"School email", es:"Correo escolar", fr:"E-mail scolaire", it:"Email scolastica", de:"Schul-E-Mail", pt:"E-mail escolar"})}</div>
          <div class="lfield">🔒 ${L({id:"Kata sandi", en:"Password", es:"Contraseña", fr:"Mot de passe", it:"Password", de:"Passwort", pt:"Senha"})}</div>
          <button class="btn btn-primary btn-block" onclick="closeAtkPreview(); startEncounter()">${L({id:"Masuk", en:"Sign in", es:"Entrar", fr:"Se connecter", it:"Accedi", de:"Anmelden", pt:"Entrar"})}</button>
        </div>
        <p class="ap-hint">💡 ${t("check_first_hint")}</p>
        <div class="ap-actions">
          <button class="btn btn-ghost" onclick="showSenderSheet()">${checkBtn}</button>
          <button class="btn btn-ghost" onclick="closeAtkPreview(); actDismiss('atk')">${t("ignore")}</button>
        </div>
      </div>
    </div>`;
  }
  return `
  <div class="atk-preview">
    <div class="ap-head">
      <button class="cav" style="background:${isWifi ? "#FEF3C7" : "#FEE2E2"}" onclick="showSenderSheet()" title="${t("check_sender")}">${headerIcon}</button>
      <div>
        <strong>${esc(L(atk.from))}</strong>
        <p class="sub">${subLine}</p>
      </div>
      <span class="dot-un"></span>
      <button class="ap-close" onclick="closeAtkPreview()" aria-label="back" title="${L({id:"Tutup dulu — insiden tetap ada", en:"Close for now — incident stays", es:"Cerrar por ahora — el incidente sigue", fr:"Fermer pour l'instant — l'incident reste", it:"Chiudi per ora — l'incidente resta", de:"Erst schließen — der Vorfall bleibt", pt:"Fechar por ora — o incidente continua"})}">✕</button>
    </div>
    <div class="ap-bubble">
      <p>${esc(L(atk.notifText))}</p>
      <time>09:02</time>
    </div>
    <p class="ap-hint">💡 ${t("check_first_hint")}</p>
    <div class="ap-actions">
      <button class="btn btn-ghost" onclick="showSenderSheet()">${checkBtn}</button>
      <button class="btn btn-ghost" onclick="closeAtkPreview(); actDismiss('${"atk"}')">${t("ignore")}</button>
      <button class="btn btn-primary" onclick="closeAtkPreview(); startEncounter()">${isCall ? "📞 " : "💬 "}${isCall ? L({id:"Angkat", en:"Answer", es:"Responder", fr:"Répondre", it:"Rispondi", de:"Annehmen", pt:"Atender"}) : t("reply_engage")}</button>
    </div>
  </div>`;
}
function chatPreview(cid) { return chatPreviewFor(cid); }

/* ---------- normal chat conversation (chatbot-style replies) ---------- */
function openChat(cid) {
  state.openChat = cid;
  state.openApp = "chatloop";
  trackEvent(`💬 ${cid}`);
  render();
  const el = $("#chat-scroll"); if (el) el.scrollTop = el.scrollHeight;
}
function closeChat() { state.openChat = null; render(); }

const NORM_CHAT_CAP = 2; // template replies per contact per day — then they "move on"

async function sendNormChat() {
  const input = $("#chat-in");
  const text = input.value.trim();
  if (!text || !state.openChat) return;
  input.value = "";
  const cid = state.openChat;
  state.normChat = state.normChat || {};
  state.normChat[cid] = state.normChat[cid] || [];
  state.normChat[cid].push({ who: "me", text });
  state.busyNorm = true;
  render();
  scrollNorm();
  await new Promise(r => setTimeout(r, 900 + Math.random() * 700));
  const sent = state.normChat[cid].filter(m => m.who === "me").length;
  let reply;
  if (sent <= NORM_CHAT_CAP) {
    // TEMPLATE ONLY — no AI, no network. Rotate variants if array.
    const r = CONTACT_REPLIES[cid];
    reply = Array.isArray(r) ? L(r[(sent - 1) % r.length]) : (r ? L(r) : null);
  } else {
    reply = L(NORM_CHAT_END.pick()); // contact moves on
  }
  state.normChat[cid].push({ who: "them", text: reply || "…" });
  state.busyNorm = false;
  render();
  scrollNorm();
}
function scrollNorm() { const el = $("#chat-scroll"); if (el) el.scrollTop = el.scrollHeight; }

/* end-of-conversation templates — contacts are people, not chatbots */
const NORM_CHAT_END = {
  items: [
    {id:"Oke ya, aku ada urusan dulu. Chat lagi nanti 👋", en:"Okay, I've got things to do. Talk later 👋", es:"Ok, tengo cosas que hacer. Hablamos luego 👋", pt:"Ok, tenho coisas a fazer. Falamos depois 👋", hi:"ठीक है, मुझे काम है। बाद में बात करते हैं 👋", fr:"Ok, j'ai des choses à faire. À plus 👋", it:"Ok, ho cose da fare. A dopo 👋", de:"Okay, ich habe zu tun. Bis später 👋"},
    {id:"Sip dicatat! Aku offline dulu ya", en:"Noted! Going offline for now", es:"¡Anotado! Me desconecto un rato", pt:"Anotado! Vou desconectar um pouco", hi:"नोट किया! अभी ऑफलाइन हो रहा हूँ", fr:"Noté ! Je me déconnecte pour l'instant", it:"Capito! Vado offline per ora", de:"Notiert! Ich bin jetzt offline"},
    {id:"Hehe oke deh. Nanti dilanjut ya!", en:"Haha okay. We'll continue later!", es:"Jaja ok. ¡Seguimos luego!", pt:"Haha ok. Continuamos depois!", hi:"हहा ठीक। बाद में जारी रखेंगे!", fr:"Haha d'accord. On continue plus tard !", it:"Haha ok. Continuiamo dopo!", de:"Haha okay. Wir machen später weiter!"},
  ],
  pick() { return this.items[Math.floor(Math.random() * this.items.length)]; },
};

function vChatThread(cid) {
  const c = state.world.contacts.find(x => x.id === cid) || { name: cid, avatar: "👤", color: "#94A3B8" };
  // AI cast: replace legacy hardcoded names inside message bodies with cast names
  const cast = activeProfile()?.cast;
  const swapNames = (txt) => {
    if (!cast || !cast.npcs) return txt;
    let out = txt;
    const legacy = [["Bimo", "best_friend"], ["Rani", "best_friend"]];
    legacy.forEach(([old, role]) => {
      const npc = cast.npcs.find(n => n.role === role);
      if (npc && out.includes(old)) out = out.split(old).join(npc.name.split(" ")[0]);
    });
    return out;
  };
  const thread = (CONTACT_THREADS[cid] || []).map(m => ({ ...m, text: swapNames(L(m.text)) }));
  const mine = (state.normChat || {})[cid] || [];
  const lines = [...thread, ...mine];
  return `
  <div class="appwin" style="height:100%">
    <div class="appbar">
      <button class="back" onclick="closeChat()" aria-label="back">${icons.back}</button>
      <h5><span class="cav" style="background:${c.color};width:26px;height:26px;font-size:13px">${c.avatar}</span> ${esc(L(c.name))}</h5>
      <button class="back" onclick="normContactInfo('${esc(L(c.name))}')" aria-label="info">ⓘ</button>
    </div>
    <div class="appbody" id="chat-scroll">
      <p class="chat-day-sep">${t("chat_encrypted")}</p>
      ${lines.map(l => `<div class="bubble-row ${l.who === "me" ? "me" : "them"}"><div class="bubble">${esc(l.text)}</div></div>`).join("")}
      ${state.busyNorm ? `<div class="typing"><i></i><i></i><i></i></div>` : ""}
    </div>
    <div class="chat-input-row">
      <input id="chat-in" placeholder="${t("chat_placeholder")}" autocomplete="off" onkeydown="if(event.key==='Enter')sendNormChat()">
      <button onclick="sendNormChat()" aria-label="send">${icons.send}</button>
    </div>
  </div>`;
}
function normContactInfo(name) { toast("ℹ️ " + name); }

function vMessageBox() {
  const w = state.world;
  const atk = w.attack;
  const atkThread = atk && atk.app === "messagebox" && !atk.done ? atk : null;
  const smsList = w.notifs.filter(n => n.app === "messagebox").map(n => ({ id: n.id, from: n.from, text: n.text, read: n.read }));
  return `
    ${atkThread ? `
    <div class="chat-list-item unread" onclick="openAtkPreview()">
      <div class="cav" style="background:#FEE2E2">📩</div>
      <div class="cb">
        <div class="ct"><strong>${esc(L(atkThread.from))}</strong><time>09:02</time></div>
        <p>${esc(L(atkThread.notifText))}</p>
      </div><span class="dot-un"></span>
    </div>` : ""}
    ${smsList.map(s => `
      <div class="chat-list-item ${s.read ? "" : "unread"}" onclick="readSms('${s.id}', '${esc(s.from)}', '${esc(s.text).replace(/'/g, "&#39;")}')">
        <div class="cav" style="background:#DBEAFE">💬</div>
        <div class="cb"><div class="ct"><strong>${esc(s.from)}</strong></div><p>${esc(s.text)}</p></div>
        ${s.read ? "" : '<span class="dot-un"></span>'}
      </div>`).join("")}`;
}

function vJournalApp() {
  const p = activeProfile();
  const w = state.world;
  return `
    <div class="card"><strong>${t("chap_day_of")(curChapter())} · ${chapterTitle(curChapter())}</strong><p class="small dim">${t("obj_prefix")} ${chapterObjText(curChapter())}</p></div>
    <div class="card"><strong class="small">${t("journal_today")}</strong>
      ${state.events.length ? `<ol class="log-list" style="margin-top:8px">${state.events.map((e, i) => `<li><b>${i + 1}</b><span>${esc(e)}</span></li>`).join("")}</ol>` : `<p class="small dim">${t("journal_none")}</p>`}
    </div>
    <div class="card"><strong class="small">Progres</strong><p class="small dim">${t("journal_prog")(p.level, p.xp, p.done.length)}</p></div>`;
}

function vSecurityApp() {
  const perms = INAPP.perms.map(p => [L(p.app), p.icon, L(p.perms), p.bad]);
  return `
    <div class="card"><strong>${t("scan_h")}</strong><p class="small dim">${t("sec_last")}</p></div>
    ${perms.map(x => `
      <div class="card" style="padding:12px">
        <div style="display:flex;gap:10px;align-items:center">
          <span style="font-size:20px">${x[1]}</span>
          <div style="flex:1"><strong class="small">${x[0]}</strong><p class="small dim" style="margin:0">${t("perm_l")} ${x[2]}</p></div>
          ${x[3] ? `<span class="pill no">${t("sec_check")}</span>` : `<span class="pill ok">${t("sec_ok")}</span>`}
        </div>
      </div>`).join("")}
    <p class="small dim center">${t("sec_note")}</p>`;
}

function vSettingsApp() {
  const w = state.world;
  const rows = INAPP.settings.map(s => [s.icon, L(s.label), L(s.value)]);
  const wifiAtk = w.attack && w.attack.app === "settings" && !w.attack.done ? w.attack : null;
  const isD2 = wifiAtk && /wifi/i.test(wifiAtk.scenario || "");
  return `
    <div class="card" style="padding:4px 12px">
      <p class="small dim" style="margin:8px 0 4px">WLAN / Wi-Fi</p>
      ${wifiAtk ? `
      <div class="wifinet" onclick="wifiConnectFlow()" style="display:flex;gap:10px;align-items:center;padding:10px 0;border-top:1px solid rgba(148,163,184,.15)">
        <span style="font-size:18px">📶</span>
        <div style="flex:1">
          <strong class="small">${esc(wifiAtk.from)}</strong>
          <p class="small dim" style="margin:0">${t("wifi_open_net")}</p>
        </div>
        <span class="dot-un"></span>
      </div>` : ""}
      <div style="display:flex;gap:10px;align-items:center;padding:10px 0;border-top:1px solid rgba(148,163,184,.15)">
        <span style="font-size:18px">📶</span>
        <div style="flex:1"><strong class="small">${t("wifi_home")}</strong><p class="small dim" style="margin:0">${t("wifi_saved")}</p></div>
        <span class="dim small">✓</span>
      </div>
      <div style="display:flex;gap:10px;align-items:center;padding:10px 0;border-top:1px solid rgba(148,163,184,.15)">
        <span style="font-size:18px">📶</span>
        <div style="flex:1"><strong class="small">${t("wifi_mobile")}</strong><p class="small dim" style="margin:0">${isD2 ? L({id:"Kuota tersisa 120 MB — tipis untuk tugas hari ini", en:"120 MB left — tight for today's task", es:"Quedan 120 MB — justo para la tarea de hoy", fr:"120 Mo restants — juste pour la tâche du jour", it:"Restano 120 MB — appena per il compito di oggi", de:"120 MB übrig — knapp für die heutige Aufgabe", pt:"Faltam 120 MB — apertado para a tarefa de hoje"}) : t("wifi_data")}</p></div>
        <span class="dim small">4G</span>
      </div>
    </div>
    ${rows.map(r => `
    <div class="card" style="padding:12px;display:flex;gap:10px;align-items:center" onclick="toast('⚙')">
      <span style="font-size:18px">${r[0]}</span>
      <div style="flex:1"><strong class="small">${r[1]}</strong></div>
      <span class="dim">${esc(r[2])} ›</span>
    </div>`).join("")}
    <div class="card" style="padding:12px;display:flex;gap:10px;align-items:center;border-left:3px solid var(--amber)" onclick="openPerms()">
      <span style="font-size:18px">🛡️</span>
      <div style="flex:1"><strong class="small">${t("perm_link")}</strong><p class="small dim" style="margin:0">${t("perm_link_sub")}</p></div>
      <span class="dim">›</span>
    </div>`;
}
/* WiFi intent flow: connect → (no login needed? safe) → login gate = the actual trap */
let _wifiConn = null;
function wifiConnectFlow() {
  // simulate the connect + captive-portal gate; a network that never asks for
  // credentials can't phish — the login form IS the attack surface
  _wifiConn = true;
  toast(L({id:"Menghubungkan…", en:"Connecting…", es:"Conectando…", fr:"Connexion…", it:"Connessione…", de:"Verbinden…", pt:"Conectando…"}));
  setTimeout(() => {
    if (state.openApp === "settings" && _wifiConn) { openAtkPreview(); }
    _wifiConn = null;
  }, 900);
}
function openPerms() {
  trackEvent("🛡️ permissions");
  state.openApp = "security";
  render();
}

/* MD Ch1 natural channel: the MAILBOX is a real inbox — the committee email
   sits there with a subject. Opening it shows the body + the link. The link
   opens SafeBrowse on the spoofed portal (that's where the decision lives). */
function vMailboxApp(meta) {
  const w = state.world;
  const atk = w.attack;
  if (atk && atk.app === "mailbox" && !atk.done) {
    const open = state.mailOpen;
    if (!open) {
      return `
      <div class="maillist">
        <h6 class="small dim" style="margin:4px 0 8px">${t("mail_inbox")}</h6>
        <div class="mailrow unread" onclick="state.mailOpen=true;render()">
          <span style="font-size:22px">📧</span>
          <div style="flex:1">
            <strong>${esc(L(atk.from))}</strong>
            <p class="small dim" style="margin:2px 0 0">${esc(t("mail_ch1_subject"))}</p>
          </div>
          <span class="dot"></span>
        </div>
      </div>`;
    }
    return `
    <div class="maildetail">
      <button class="back small" onclick="state.mailOpen=false;render()">◂ ${t("mail_back")}</button>
      <h4>${esc(t("mail_ch1_subject"))}</h4>
      <p class="small dim">${esc(L(atk.from))} · ${L({id:"hari ini", en:"today", es:"hoy", fr:"aujourd'hui", it:"oggi", de:"heute", pt:"hoje"})} 08:12</p>
      <p>${esc(t("mail_ch1_body"))}</p>
      <div class="btn btn-ghost btn-block mt8" onclick="showSenderSheet()">🔍 ${t("check_sender")}</div>
      <div class="btn btn-primary btn-block mt8" onclick="mailboxOpenPortal()">${t("mail_open_link")}</div>
      <p class="small dim mt8">${t("mail_link_hint")}</p>
    </div>`;
  }
  return vGenericApp(meta);
}
function mailboxOpenPortal() {
  // the link launches the browser on the spoofed portal → decision screen.
  // From here on the incident LIVES in SafeBrowse (it's a web page, not mail).
  const w = state.world;
  if (w?.attack && w.attack.app === "mailbox") w.attack.app = "safebrowse";
  state.openApp = "safebrowse";
  state.atkPreview = true;
  render();
}

function vGenericApp(meta) {
  const w = state.world;
  const atk = w.attack;
  if (atk && atk.app === meta.id && !atk.done) {
    return `
      <div class="card center">
        <span style="font-size:34px">${meta.icon}</span>
        <h3 style="margin:6px 0">${esc(L(atk.from))}</h3>
        <p class="small dim">${esc(L(atk.notifText))}</p>
        <button class="btn btn-primary btn-block mt8" onclick="openAtkPreview()">${t("open")} ▸</button>
      </div>`;
  }
  return `<div class="card center"><span style="font-size:34px">${meta.icon}</span><h3 style="margin:6px 0">${esc(meta.name)}</h3><p class="small dim">${t("guest_generic")(esc(meta.name))}</p></div>`;
}

/* ---------- notification panel ---------- */
function vNotifPanel() {
  const w = state.world;
  return `
  <div class="notif-panel" onclick="if(event.target===this) toggleNotif(false)">
    <div class="notif-sheet">
      <h4><span>${t("notif_h")(w.notifs.filter(n => !n.read).length)}</span><button class="dim small" style="font-weight:700" onclick="clearNotifs()">${t("clear")}</button></h4>
      ${w.notifs.map(n => `
        <div class="ncard ${n.read ? "read" : ""}">
          <div class="ni" style="background:${(APP_CATALOG[n.app] || {}).bg || "#64748B"}">${(APP_CATALOG[n.app] || {}).icon || "🔔"}</div>
          <div class="nb">
            <div class="nt"><strong>${esc(L(n.from))}</strong><time>09:0${n.id.slice(-1)}</time></div>
            <p>${esc(L(n.text))}</p>
            ${n.attack ? `<div class="actions"><button class="pri" onclick="toggleNotif(false); ${n.slotB ? `activateAttackB('${n.id}')` : `openApp('${n.app}'); openAtkPreview()`}">${t("open")}</button><button onclick="${n.slotB ? `activateAttackB('${n.id}', true)` : `actDismiss('${n.id}')`}">${t("ignore")}</button></div>` : `<div class="actions"><button onclick="readNotif('${n.id}')">${t("mark_read")}</button></div>`}
          </div>
        </div>`).join("")}
    </div>
  </div>`;
}
function readSms(id, from, text) {
  const n = state.world.notifs.find(x => x.id === id);
  if (n && !n.read) {
    n.read = true;
    if (n.attack) { toggleNotif(false); openApp(n.app); openAtkPreview(); return; }
    trackEvent(`📬 ${from}`);
    render();
    toast(`💬 ${text.slice(0, 60)}`);
  }
}

/* ---------- Day-1 exploration objectives ---------- */
/* ---------- per-day mission panel (all days, story-aligned) ---------- */
/* CHANNEL-DRIVEN objectives: each chapter's "where to look" objective
   is derived from the active attack's app (A slot + B slot), NOT hardcoded
   per day. That way Ch1→Mailbox, Ch3→Settings, Ch6→MessageBox, Ch7→Phone
   etc. all tell the player the RIGHT place to inspect. */
const CHAN_OBJ = {
  'mailbox':    {icon:'📧', ev:['📧'], label:{id:'Buka Mailbox & baca email mencurigakan', en:'Open Mailbox & read the suspicious email', es:'Abre Mailbox y lee el correo sospechoso', fr:'Ouvre Mailbox et lis le mail suspect', it:"Apri Mailbox e leggi l'email sospetta", de:'Öffne Mailbox und lies die verdächtige E-Mail', pt:'Abra o Mailbox e leia o e-mail suspeito'}},
  'chatloop':   {icon:'💬', ev:['💬'], label:{id:'Buka ChatLoop & baca chat mencurigakan', en:'Open ChatLoop & read the suspicious chat', es:'Abre ChatLoop y lee el chat sospechoso', fr:'Ouvre ChatLoop et lis le chat suspect', it:"Apri ChatLoop e leggi la chat sospetta", de:'Öffne ChatLoop und lies den verdächtigen Chat', pt:'Abra o ChatLoop e leia o chat suspeito'}},
  'messagebox': {icon:'📬', ev:['📬'], label:{id:'Buka MessageBox & baca SMS mencurigakan', en:'Open MessageBox & read the suspicious SMS', es:'Abre MessageBox y lee el SMS sospechoso', fr:'Ouvre MessageBox et lis le SMS suspect', it:"Apri MessageBox e leggi l'SMS sospetto", de:'Öffne MessageBox und lies die verdächtige SMS', pt:'Abra o MessageBox e leia o SMS suspeito'}},
  'settings':   {icon:'📶', ev:['📶'], label:{id:'Buka Settings & periksa WiFi mencurigakan', en:'Open Settings & inspect the suspicious WiFi', es:'Abre Ajustes y revisa la WiFi sospechosa', fr:'Ouvre Réglages et inspecte le WiFi suspect', it:'Apri Impostazioni e controlla il WiFi sospetto', de:'Öffne Einstellungen und prüfe das verdächtige WLAN', pt:'Abra Ajustes e inspecione o Wi-Fi suspeito'}},
  'phone':      {icon:'📞', ev:['📞'], label:{id:'Buka Phone & periksa panggilan masuk', en:'Open Phone & check the incoming call', es:'Abre Phone y revisa la llamada entrante', fr:"Ouvre Phone et vérifie l'appel entrant", it:'Apri Phone e controlla la chiamata in arrivo', de:'Öffne Phone und prüfe den eingehenden Anruf', pt:'Abra o Phone e verifique a chamada'}},
  'safebrowse': {icon:'🌐', ev:['🌐'], label:{id:'Buka SafeBrowse & periksa halaman login', en:'Open SafeBrowse & inspect the login page', es:'Abre SafeBrowse y revisa la página de login', fr:'Ouvre SafeBrowse et inspecte la page de login', it:'Apri SafeBrowse e controlla la pagina di login', de:'Öffne SafeBrowse und prüfe die Login-Seite', pt:'Abra o SafeBrowse e inspecione a página de login'}},
};
function channelObjFor(app) { return app && CHAN_OBJ[app] ? CHAN_OBJ[app] : null; }
function isEventOpen(app) {
  if (!app) return true;
  const c = CHAN_OBJ[app]; if (!c) return true;
  if (c.ev.some(e => state.events.some(ev => ev.startsWith(e)))) return true;
  // also: opening the attack via openApp counts
  if (state.openApp === app) return true;
  return false;
}
function dayObjectives(day) {
  const w = state.world;
  const atk = w?.attack;
  const atkOpen = atk && !atk.done;
  // two chapters per day: an unresolved reserve chapter still blocks the day
  const reserveOpen = !!w?.attackB;
  const verified = state.events.some(e => e.includes("🔍"));
  // verify counts if: player opened the sender sheet, OR the incident is already
  // resolved (ignore/engage decision made from the visible notif/preview) — never
  // let a resolved day leave this objective permanently unchecked (mission/action
  // alignment: "ignore" must always be a valid way to complete the day).
  const readAtk = verified || !atk || atk.done;
  const common = [
    { id: "obj_notif", icon: "🔔", label: {id:"Cek panel notifikasi", en:"Check the notification panel", es:"Revisa el panel de notificaciones", fr:"Consulte le panneau de notifications", it:"Controlla il pannello notifiche", de:"Prüfe das Benachrichtigungsfeld", pt:"Confira o painel de notificações"},
      done: state.notifSeen || false },
    { id: "obj_verify", icon: "🔍", label: (verifyLabelFor(atk) || {id:"Cek pengirim pesan mencurigakan", en:"Verify the suspicious sender"}),
      done: readAtk || false },
    { id: "obj_enc", icon: "⚔️", label: (() => {
        // when chapter B is pending, the objective must SAY so — a silent
        // unchecked box after "ignore" reads like a bug
        if (w?.attackB) return {id:"Chapter berikutnya baru masuk — selesaikan juga (cek 🔔)", en:"The next chapter just arrived — resolve it too (check 🔔)", es:"Un 2.º incidente llegó — resuélvelo también (mira 🔔)", fr:"Un 2e incident arrive — résolvez-le aussi (voir 🔔)", it:"Un 2° incidente è arrivato — risolvi anche quello (vedi 🔔)", de:"Ein 2. Vorfall kam — löse auch ihn (siehe 🔔)", pt:"Um 2º incidente chegou — resolva também (veja 🔔)"};
        return {id:"Selesaikan insiden chapter ini (serang atau abaikan)", en:"Resolve today's incident (fight or ignore)", es:"Resuelve el incidente de hoy", fr:"Résolvez l'incident du jour", it:"Risolvi l'incidente di oggi", de:"Löse das heutige Ereignis", pt:"Resolva o incidente de hoje"};
      })(),
      done: !atkOpen && !reserveOpen },
  ];
   const channelExtras = [];
  // A slot: tell player WHERE to look for the current chapter's attack
  if (atk && atk.app && CHAN_OBJ[atk.app]) {
    const c = CHAN_OBJ[atk.app];
    channelExtras.push({ id: "obj_chan_a", icon: c.icon, label: c.label,
      done: isEventOpen(atk.app) });
  }
  // B slot: also derived once it surfaces (attackB.app may exist before promotion)
  const b = w?.attackB;
  if (b && b.app && CHAN_OBJ[b.app]) {
    const c = CHAN_OBJ[b.app];
    channelExtras.push({ id: "obj_chan_b_" + b.app, icon: c.icon, label: c.label,
      done: isEventOpen(b.app) });
  }
  // always keep the journal objective (low-cost exploration that grounds the phone UX)
  if (w?.day === 1) channelExtras.push({ id: "obj_journal", icon: "📓", label: {id:"Cek Journal harianmu", en:"Check your Journal", es:"Revisa tu Journal", fr:"Consultez votre Journal", it:"Controlla il Journal", de:"Prüfe dein Journal", pt:"Confira seu Journal"}, done: state.openedJournal || false });
  return [...channelExtras, ...common];
}
function day1Objectives() {
  return [
    { id: "open_msg",    label: {id:"Buka MessageBox dan baca SMS", en:"Open MessageBox and read an SMS", es:"Abre MessageBox y lee un SMS", pt:"Abra o MessageBox e leia um SMS", hi:"MessageBox खोलें और SMS पढ़ें", fr:"Ouvre MessageBox et lis un SMS", it:"Apri MessageBox e leggi un SMS", de:"Öffne MessageBox und lies eine SMS"}, done: state.events.some(e => e.startsWith("📬")) },
    { id: "open_chat",   label: {id:"Buka ChatLoop dan baca chat", en:"Open ChatLoop and read a chat", es:"Abre ChatLoop y lee un chat", pt:"Abra o ChatLoop e leia um chat", hi:"ChatLoop खोलें और चैट पढ़ें", fr:"Ouvre ChatLoop et lis un chat", it:"Apri ChatLoop e leggi una chat", de:"Öffne ChatLoop und lies einen Chat"}, done: state.openedChat || false },
    { id: "check_notif", label: {id:"Buka panel notifikasi (ketuk jam)", en:"Open the notification panel (tap the clock)", es:"Abre el panel de notificaciones (toca el reloj)", pt:"Abra o painel de notificações (toque no relógio)", hi:"सूचना पैनल खोलें (घड़ी टैप करें)", fr:"Ouvre le panneau de notifications (touche l'horloge)", it:"Apri il pannello notifiche (tocca l'orologio)", de:"Öffne das Benachrichtigungsfeld (Tippe auf die Uhr)"}, done: state.notifSeen || false },
    { id: "check_perm",  label: {id:"Cek izin aplikasi di Security", en:"Check app permissions in Security", es:"Revisa permisos en Security", pt:"Verifique permissões no Security", hi:"Security में ऐप अनुमतियाँ देखें", fr:"Vérifie les permissions dans Security", it:"Controlla i permessi in Security", de:"Prüfe Berechtigungen in Security"}, done: state.events.some(e => e.startsWith("🛡")) || state.openedSecurity || false },
    { id: "open_journal",label: {id:"Buka Journal dan cek misimu", en:"Open Journal and check your mission", es:"Abre Journal y revisa tu misión", pt:"Abra o Journal e veja sua missão", hi:"Journal खोलें और मिशन देखें", fr:"Ouvre Journal et vérifie ta mission", it:"Apri Journal e controlla la missione", de:"Öffne Journal und prüfe deine Mission"}, done: state.openedJournal || false },
  ];
}
function day1Done() {
  // universal gate: today's objectives done AND the incident resolved
  const w = state.world;
  return dayObjectives(w?.day || 1).every(o => o.done);
}

function toggleNotif(open) {
  state.notifOpen = open ?? !state.notifOpen;
  if (state.notifOpen) state.notifSeen = true;
  render();
}
function clearNotifs() { state.world.notifs.forEach(n => n.read = true); render(); }
function readNotif(id) { const n = state.world.notifs.find(x => x.id === id); if (n) { n.read = true; trackEvent("📄 " + n.from); } render(); }
function actDismiss(id) {
  const n = state.world.notifs.find(x => x.id === id);
  const atk = state.world.attack;
  // ignoring IS a decision — mark the incident resolved.
  // id === "atk" comes from the preview screen (no notif row); a real notif id
  // comes from the notification panel.
  if (atk && !atk.done && (id === "atk" || (n && atk.from === n.from))) {
    atk.done = true;
    if (n) n.read = true;
    // chapter accounting: slot B ignore = even chapter, slot A = odd (via promoteAttackB)
    if (atk.isSlotB) markChapterDone((state.world.day - 1) * 2 + 2);
    trackEvent("🙈 ignored: " + L(atk.from));
    recordIncidentOutcome(atk.scenario, "ignored");
    promoteAttackB();
  } else if (n) { n.read = true; trackEvent("🙈 " + n.from); }
  state.atkPreview = false;
  render();
  // tell the player what's still pending — never let "ignore" feel dead
  const pendingB = state.world?.attackB;
  toast(pendingB
    ? L({id:"Diabaikan ✅ — tapi 📮 insiden ke-2 baru masuk! Cek 🔔", en:"Ignored ✅ — but 📮 a 2nd incident just arrived! Check 🔔", es:"Ignorado ✅ — ¡pero 📮 llegó un 2.º incidente! Mira 🔔", fr:"Ignoré ✅ — mais 📮 un 2e incident arrive ! Voir 🔔", it:"Ignorato ✅ — ma 📮 è arrivato un 2° incidente! Vedi 🔔", de:"Ignoriert ✅ — aber 📮 ein 2. Vorfall kam! Siehe 🔔", pt:"Ignorado ✅ — mas 📮 um 2º incidente chegou! Veja 🔔"})
    : t("ignored_toast"));
}

/* Two chapters per day: when the first incident resolves, the reserve
   chapter surfaces in the notification bar. */
function promoteAttackB() {
  const w = state.world;
  if (!w) return;
  // attackB is seeded at world-build; "promotion" = surfacing it in the notif
  // bar once chapter A resolves. Guarded so it only happens once.
  if (w.attack?.done !== true || !w.attackB || w.attackB.surfaced) return;
  // chapter A resolved -> record it as a completed chapter (odd number)
  markChapterDone((w.day - 1) * 2 + 1);
  const B = w.attackB;
  B.surfaced = true;
  w.notifs.unshift({ id: nid(), app: B.app, from: B.from, text: B.notifText, attack: true, read: false, slotB: true });
  state.mission = null; // chapter A's mission is closed; B starts fresh via its notif
  toast(L({id:"📮 Insiden baru masuk…", en:"📮 A new incident just came in…", es:"📮 Nuevo incidente entrante…", fr:"📮 Nouvel incident entrant…", it:"📮 Nuovo incidente in arrivo…", de:"📮 Neuer Vorfall eingegangen…", pt:"📮 Novo incidente chegando…"}));
}

/* ---------- cross-day storyline state (storyline doc §4.C) ----------
   Set from each resolved incident's outcome; consumed by later days to
   shape intensity/context. Persisted on the profile. */
function storyState() {
  const p = activeProfile();
  if (!p) return {};
  if (!p.storyState) p.storyState = {};
  return p.storyState;
}
function recordIncidentOutcome(scenario, outcome) {
  const s = storyState();
  const ss = (v) => { s[v] = true; saveLocal(); };
  switch (scenario) {
    // Day 1 — credentials: phishing chat / fake portal
    case "story_komp_d1_phishing":
    case "story_komp_d1_password":
      if (outcome === "compromised") ss("credentials_leaked");
      else if (outcome === "survived" || outcome === "survived_reported") ss("knows_scam_pattern");
      break;
    // Day 2 — wifi evil twin / privacy overshare
    case "story_komp_d2_wifi":
      if (outcome === "compromised") ss("wifi_leaked");
      else if (outcome !== "ignored") ss("knows_scam_pattern");
      break;
    case "story_komp_d2_privacy":
      if (outcome === "compromised") ss("personal_data_public");
      break;
    // Day 3 — APK / takeover
    case "story_komp_d3_apk":
      if (outcome === "compromised") ss("spyware_installed");
      break;
    case "story_komp_d3_takeover":
      if (outcome === "compromised") ss("account_breached");
      else if (outcome === "survived" || outcome === "survived_reported") ss("knows_scam_pattern");
      break;
    // Day 4 — OTP call / QRIS
    case "story_komp_d4_otpcall":
    case "story_komp_d4_qris":
      if (outcome === "compromised") ss("wallet_damaged");
      else if (outcome === "survived" || outcome === "survived_reported") ss("knows_scam_pattern");
      break;
    // Day 5 — threat / family
    case "story_komp_d5_threat":
      if (outcome === "compromised") ss("wallet_damaged");
      break;
    case "story_komp_d5_family":
      if (outcome === "survived" || outcome === "survived_reported") ss("family_safe");
      break;
  }
  saveLocal();
}

/* Player taps chapter B's notification: promote it to the ACTIVE attack
   (swap) so preview/encounter/verify all operate on it. */
function activateAttackB(notifId, dismiss) {
  const w = state.world;
  const n = w.notifs.find(x => x.id === notifId);
  if (n) n.read = true;
  if (!w.attackB) return;
  const B = w.attackB;
  w.attack = { ...B, done: false, isSlotB: true };
  delete w.attack.surfaced;
  w.attackB = null;
  toggleNotif(false);
  if (dismiss) {
    w.attack.done = true;
    markChapterDone((w.day - 1) * 2 + 2); // even chapter (B) resolved
    trackEvent("🙈 ignored: " + L(w.attack.from));
    recordIncidentOutcome(w.attack.scenario, "ignored");
    toast(L({id:"Diabaikan ✅ — semua insiden hari ini sudah kelar", en:"Ignored ✅ — all of today's incidents are resolved", es:"Ignorado ✅ — todos los incidentes de hoy resueltos", fr:"Ignoré ✅ — tous les incidents du jour sont résolus", it:"Ignorato ✅ — tutti gli incidenti di oggi risolti", de:"Ignoriert ✅ — alle heutigen Vorfälle gelöst", pt:"Ignorado ✅ — todos os incidentes de hoje resolvidos"}));
    render();
    return;
  }
  openApp(B.app);
  openAtkPreview();
}

/* ---------- sheets ---------- */
function vSheet() {
  const s = state.sheet;
  if (s.type === "sender") {
    return `
    <div class="sheet-backdrop" onclick="closeSheet()"></div>
    <div class="sheet">
      <div style="display:flex;gap:12px;align-items:center;margin-bottom:10px">
        <div style="width:48px;height:48px;border-radius:50%;background:${s.color || "#E2E8F0"};display:grid;place-items:center;font-size:22px">${s.avatar || "👤"}</div>
        <div><h3>${esc(s.name)}</h3><p class="sub">${esc(typeof s.sub === "object" ? L(s.sub) : (s.sub || ""))}</p></div>
      </div>
      <div class="row"><b>${t("sheet_number")}</b><span>${esc(s.number)}</span></div>
      <div class="row"><b>${t("sheet_verified")}</b><span>${s.verified ? t("v_yes") : t("v_no")}</span></div>
      <div class="row"><b>${t("sheet_saved")}</b><span>${s.saved ? t("s_yes") : t("s_no")}</span></div>
      <div class="row"><b>${t("sheet_history")}</b><span>${s.history ? t("h_yes") : t("h_no")}</span></div>
      <div class="actions">
        <button class="btn btn-ghost btn-block" onclick="senderChecked('${esc(s.name)}')">${t("done_checking")}</button>
      </div>
      <p class="note">${t("sheet_note")}</p>
    </div>`;
  }
  if (s.type === "wifi" || s.type === "caller") {
    const vt = s.vt || {};
    return `
    <div class="sheet-backdrop" onclick="closeSheet()"></div>
    <div class="sheet">
      <div style="display:flex;gap:12px;align-items:center;margin-bottom:10px">
        <div style="width:48px;height:48px;border-radius:50%;background:${s.color || "#FEF3C7"};display:grid;place-items:center;font-size:22px">${s.avatar || "📶"}</div>
        <div><h3>${esc(s.name)}</h3><p class="sub">${esc(typeof s.sub === "object" ? L(s.sub) : (s.sub || ""))}</p></div>
      </div>
      ${(vt.rows || []).map(([key, val]) => {
        const label = key.startsWith("sheet_") ? t(key) : key;
        const display = val == null ? t("v_no") : (typeof val === "object" ? L(val) : val);
        return `<div class="row"><b>${esc(label)}</b><span>${esc(display)}</span></div>`;
      }).join("")}
      <div class="actions">
        <button class="btn btn-ghost btn-block" onclick="senderChecked('${esc(s.name)}')">${t("done_checking")}</button>
      </div>
      ${vt.hint ? `<p class="note">${esc(L(vt.hint))}</p>` : `<p class="note">${t("sheet_note")}</p>`}
    </div>`;
  }
  return "";
}
function closeSheet() { state.sheet = null; render(); }
function senderChecked(name) { closeSheet(); trackEvent("🔍 " + name); toast("✔ " + name); }

/* ============================================================
   ENCOUNTER
   ============================================================ */
async function startEncounter() {
  const w = state.world;
  const atk = w.attack;
  if (!atk || atk.done) { toast(t("no_event")); return; }
  // RESUME an in-progress conversation instead of restarting it — the player
  // may back out of a chat and reopen it; the thread must survive that.
  const m = state.mission;
  if (m && !m.finished && state.encounterChat?.length && (m.scenario?.id || m.scenario) === atk.scenario) {
    state.openApp = null;
    state.atkPreview = false;
    state.notifOpen = false;
    state.screen = "encounter";
    render();
    return;
  }
  state.openApp = null;
  state.atkPreview = false;
  state.notifOpen = false;
  state.encounterChat = [];
  state.screen = "encounter";
  render();
  try {
    const personaMap = { student: "mahasiswa", merchant: "umkm", worker: "karyawan", parent: "orangtua", general: "umum" };
    const p = activeProfile();
    const s = await fetch(`${API}/session`, { method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ persona_id: personaMap[w.profile.archetype] || "umum", lang: ["id","en","es","hi","pt"].includes(LANG) ? LANG : "id",
        story_id: p?.storyId || "", story_day: p?.day || 1, cast: p?.cast || {}, scenario_hint: atk?.scenario || "" }) }).then(r => r.json());
    state.session = s;
    const m = await fetch(`${API}/session/${s.session_id}/mission/start`, { method: "POST" }).then(r => r.json());
    if (m.paywall) { toast(m.msg); state.screen = "phone"; render(); return; }
    state.mission = m;
    state.encounterChat = [{ role: "them", text: m.message, time: nowT() }];
    trackEvent("📬 " + L(atk.from));
    render();
  } catch (e) {
    toast("ERR " + e.message);
    state.screen = "phone";
    render();
  }
}
function nowT() { const d = new Date(); return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`; }

function vEncounter() {
  const w = state.world;
  const atk = w.attack;
  const sc = state.mission?.scenario;
  return `
  <div class="phone-stage">
    <div class="phone-topbar">
      <button class="exit" onclick="exitEncounter()">${t("exit")}</button>
      <span>${sc ? esc(sc.title) : ""}</span>
      <span class="demo-flag">Lv ${state.mission?.level || 1}</span>
    </div>
    <div class="phone-frame">
      <div class="statusbar"><span>${nowT()}</span><span class="sicons"><span class="sbatt">🔋${w.battery - 2}%</span><span>▮▮▮</span></span></div>
      <div class="appwin">
        <div class="appbar">
          <button class="back" onclick="showSenderSheet()" aria-label="sender info">${atk ? (APP_CATALOG[atk.app] || {}).icon || "💬" : "💬"}</button>
          <h5 onclick="showSenderSheet()" style="cursor:pointer">${esc(atk?.from || "")} <span class="dim" style="font-size:11px">${t("sender_hint")}</span></h5>
          <button class="back" onclick="reportMsg()" aria-label="report" title="Report">🚩</button>
        </div>
        <div class="appbody" id="chat-scroll">
          ${state.encounterChat.map(l => l.role === "sys"
            ? `<div class="sys-line">${esc(l.text)}</div>`
            : `<div class="bubble-row ${l.role}"><div class="bubble">${esc(l.text)}${l.time ? `<time>${l.time}</time>` : ""}</div></div>`).join("")}
          ${state.busy ? `<div class="typing"><i></i><i></i><i></i></div>` : ""}
        </div>
        <div class="chat-input-row">
          <input id="chat-in" placeholder="${t("chat_placeholder")}" autocomplete="off" onkeydown="if(event.key==='Enter')sendChat()">
          <button onclick="sendChat()" aria-label="send">${icons.send}</button>
        </div>
      </div>
      ${state.sheet ? vSheet() : ""}
    </div>
    ${state.toast ? `<div class="toast">${esc(typeof state.toast === "function" ? state.toast() : state.toast)}</div>` : ""}
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
    toast("ERR " + e.message);
    render();
  }
}
function scrollChat() { const el = $("#chat-scroll"); if (el) el.scrollTop = el.scrollHeight; }

/* ---------- channel-aware verification (chat sender / wifi SSID / caller number) ---------- */
/* Each day's incident arrives through a DIFFERENT channel — the "verify" action
   must match it: chat → check the sender's number, wifi → inspect the network
   details (open vs locked, twin SSID), call → look up the number. */
function verifyTargetFor(atk) {
  if (!atk) return null;
  if (atk.app === "settings" || /wifi/i.test(atk.scenario || "")) {
    return {
      kind: "wifi",
      label: {id:"Periksa detail jaringan mencurigakan", en:"Inspect the suspicious network", es:"Inspecciona la red sospechosa", fr:"Inspectez le réseau suspect", it:"Ispeziona la rete sospetta", de:"Prüfe das verdächtige Netzwerk", pt:"Inspecione a rede suspeita"},
      previewBtn: {id:"🔍 Detail jaringan", en:"🔍 Network details", es:"🔍 Detalles de red", fr:"🔍 Détails du réseau", it:"🔍 Dettagli rete", de:"🔍 Netzwerkdetails", pt:"🔍 Detalhes da rede"},
      sheetTitle: atk.from,
      sheetSub: {id:"Jaringan Wi-Fi terdeteksi", en:"Detected Wi-Fi network", es:"Red Wi-Fi detectada", fr:"Réseau Wi-Fi détecté", it:"Rete Wi-Fi rilevata", de:"Erkanntes WLAN", pt:"Rede Wi-Fi detectada"},
      rows: [
        ["sheet_security", {id:"Open (tanpa password) ⚠️", en:"Open (no password) ⚠️", es:"Abierta (sin contraseña) ⚠️", fr:"Ouvert (sans mot de passe) ⚠️", it:"Aperta (senza password) ⚠️", de:"Offen (ohne Passwort) ⚠️", pt:"Aberta (sem senha) ⚠️"}],
        ["sheet_twin", {id:"Ada SSID kembar terdaftar ⚠️", en:"Twin SSID also visible ⚠️", es:"SSID gemelo también visible ⚠️", fr:"SSID jumeau également visible ⚠️", it:"SSID gemello visibile ⚠️", de:"Zwillings-SSID sichtbar ⚠️", pt:"SSID gêmeo visível ⚠️"}],
        ["sheet_owner", {id:"Pemilik tidak diketahui", en:"Owner unknown", es:"Propietario desconocido", fr:"Propriétaire inconnu", it:"Proprietario sconosciuto", de:"Besitzer unbekannt", pt:"Proprietário desconhecido"}],
      ],
      hint: {id:"💡 Jaringan publik open + SSID kembar = taktik evil-twin. Selalu konfirmasi ke staf.", en:"💡 Open network + twin SSID = evil-twin tactic. Always confirm with staff.", es:"💡 Red abierta + SSID gemelo = evil-twin. Confirma con el personal.", fr:"💡 Réseau ouvert + SSID jumeau = evil-twin. Confirmez avec le personnel.", it:"💡 Rete aperta + SSID gemello = evil-twin. Conferma col personale.", de:"💡 Offenes Netz + Zwillings-SSID = Evil-Twin. Frag das Personal.", pt:"💡 Rede aberta + SSID gêmeo = evil-twin. Confirme com a equipe."},
    };
  }
  if (atk.app === "phone") {
    return {
      kind: "call",
      label: {id:"Periksa nomor penelepon mencurigakan", en:"Look up the suspicious caller", es:"Investiga la llamada sospechosa", fr:"Vérifiez l'appelant suspect", it:"Verifica il chiamante sospetto", de:"Prüfe den verdächtigen Anrufer", pt:"Verifique a chamada suspeita"},
      previewBtn: {id:"🔍 Cek nomor", en:"🔍 Check the number", es:"🔍 Verifica el número", fr:"🔍 Vérifiez le numéro", it:"🔍 Verifica il numero", de:"🔍 Nummer prüfen", pt:"🔍 Verifique o número"},
      sheetTitle: atk.from,
      sheetSub: {id:"Panggilan masuk", en:"Incoming call", es:"Llamada entrante", fr:"Appel entrant", it:"Chiamata in arrivo", de:"Eingehender Anruf", pt:"Chamada recebida"},
      rows: [
        ["sheet_number", "0813-" + String(1000 + (atk.seed % 8999)) + "-•••"],
        ["sheet_verified", null], // filled by vSheet with v_no
        ["sheet_owner", {id:"Tidak terdaftar sebagai resmi ⚠️", en:"Not listed as official ⚠️", es:"No listado como oficial ⚠️", fr:"Non répertorié comme officiel ⚠️", it:"Non elencato come ufficiale ⚠️", de:"Nicht als offiziell gelistet ⚠️", pt:"Não listado como oficial ⚠️"}],
      ],
      hint: {id:"💡 CS resmi tidak pernah minta kode OTP via telepon. Tutup, hubungi kanal resmi.", en:"💡 Real support never asks for OTP codes over the phone. Hang up, call the official line.", es:"💡 El soporte real nunca pide OTP por teléfono. Cuelga y llama al canal oficial.", fr:"💡 Le vrai support ne demande jamais d'OTP par téléphone. Raccrochez, appelez le canal officiel.", it:"💡 Il supporto vero non chiede OTP al telefono. Riaggancia e chiama il canale ufficiale.", de:"💡 Echter Support fragt nie nach OTP am Telefon. Auflegen, offiziellen Kanal anrufen.", pt:"💡 Suporte real nunca pede OTP por telefone. Desligue e chame o canal oficial."},
    };
  }
  // MD Ch1: email sender verification — the URL is the red flag, not a phone number.
  if (atk.app === "mailbox") {
    return {
      kind: "email",
      label: {id:"Periksa alamat email & domain pengirim", en:"Check the sender address & domain", es:"Revisa el correo y dominio del remitente", fr:"Vérifie l'adresse et le domaine de l'expéditeur", it:"Controlla indirizzo e dominio del mittente", de:"Prüfe Absender-Adresse und Domain", pt:"Confira o endereço e domínio do remetente"},
      previewBtn: {id:"🔍 Detail email", en:"🔍 Email details", es:"🔍 Detalles del correo", fr:"🔍 Détails de l'e-mail", it:"🔍 Dettagli email", de:"🔍 E-Mail-Details", pt:"🔍 Detalhes do e-mail"},
      sheetTitle: atk.from,
      sheetSub: {id:"Email masuk", en:"Email received", es:"Correo recibido", fr:"E-mail reçu", it:"Email ricevuta", de:"E-Mail empfangen", pt:"E-mail recebido"},
      rows: [
        ["sheet_address", "noreply@portal-kompetisi-daftar.id"],
        ["sheet_spoof", {id:"Domain hampir identik dengan aslinya, tapi salah ⚠️", en:"Domain looks almost like the real one, but isn't ⚠️", es:"El dominio se parece al real, pero no lo es ⚠️", fr:"Le domaine ressemble à l'officiel, mais ne l'est pas ⚠️", it:"Il dominio somiglia all'originale, ma non lo è ⚠️", de:"Domain sieht aus wie das echte, ist es aber nicht ⚠️", pt:"Domínio parecido com o real, mas não é ⚠️"}],
        ["sheet_urgency", {id:"Meminta tindakan dalam 24 jam ⏰", en:"Demands action within 24 hours ⏰", es:"Pide actuar en 24 horas ⏰", fr:"Demande d'agir en 24 h ⏰", it:"Chiede azione entro 24 ore ⏰", de:"Verlangt Handeln in 24 Std. ⏰", pt:"Exige ação em 24 horas ⏰"}],
        ["sheet_owner", {id:"BCC: banyak email sekolah sekaligus 📣", en:"BCC'd to many school emails at once 📣", es:"En BCC a muchos correos escolares 📣", fr:"En CCI à de nombreux e-mails scolaires 📣", it:"In CCN a molte email scolastiche 📣", de:"In BCC an viele Schul-E-Mails gleichzeitig 📣", pt:"Em CCO para muitos e-mails escolares 📣"}],
      ],
      hint: {id:"💡 Domain 'portal-kompetisi-daftar.id' bukan domain resmi lomba. Cek 'daftAR' vs 'daftER'.", en:"💡 'portal-kompetisi-daftar.id' is not the real domain. Notice the swapped letters.", es:"💡 'portal-kompetisi-daftar.id' no es el dominio real. Fíjate en letras cambiadas.", fr:"💡 'portal-kompetisi-daftar.id' n'est pas le vrai domaine. Lettres permutées.", it:"💡 'portal-kompetisi-daftar.id' non è il dominio reale. Nota le lettere scambiate.", de:"💡 'portal-kompetisi-daftar.id' ist nicht die echte Domain. Buchstaben vertauscht.", pt:"💡 'portal-kompetisi-daftar.id' não é o domínio real. Letras trocadas."},
    };
  }
  // Ch6: SMS sender — the suspicious thing is the LOGIN-ATTEMPT context, not the number.
  if (atk.app === "messagebox") {
    return {
      kind: "sms",
      label: {id:"Periksa SMS 'percobaan login' ini", en:"Check this 'sign-in attempt' SMS", es:"Revisa el SMS de 'intento de login'", fr:"Vérifie ce SMS 'tentative de connexion'", it:"Controlla l'SMS 'tentativo di accesso'", de:"Prüfe diese 'Anmeldeversuch'-SMS", pt:"Confira o SMS de 'tentativa de login'"},
      previewBtn: {id:"🔍 Detail SMS", en:"🔍 SMS details", es:"🔍 Detalles del SMS", fr:"🔍 Détails du SMS", it:"🔍 Dettagli SMS", de:"🔍 SMS-Details", pt:"🔍 Detalhes do SMS"},
      sheetTitle: atk.from,
      sheetSub: {id:"SMS masuk", en:"SMS received", es:"SMS recibido", fr:"SMS reçu", it:"SMS ricevuto", de:"SMS empfangen", pt:"SMS recebido"},
      rows: [
        ["sheet_address", {id:"Google (Kode) <no-reply@accounts.google.com>", en:"Google (Code) <no-reply@accounts.google.com>", es:"Google (Código) <no-reply@accounts.google.com>", fr:"Google (Code) <no-reply@accounts.google.com>", it:"Google (Codice) <no-reply@accounts.google.com>", de:"Google (Code) <no-reply@accounts.google.com>", pt:"Google (Código) <no-reply@accounts.google.com>"}],
        ["sheet_context", {id:"Disebutkan 'login dari Windows · Jakarta'", en:"Mentions 'login from Windows · Jakarta'", es:"Menciona 'login desde Windows · Yakarta'", fr:"Mentionne 'connexion depuis Windows · Jakarta'", it:"Cita 'accesso da Windows · Jakarta'", de:"Erwähnt 'Anmeldung von Windows · Jakarta'", pt:"Menciona 'login do Windows · Jacarta'"}],
        ["sheet_warning", {id:"Siapa pun yang minta kode ini = scammer 🚨", en:"Anyone asking for this code = scammer 🚨", es:"Quien pida este código = estafador 🚨", fr:"Quiconque demande ce code = arnaqueur 🚨", it:"Chiunque chieda questo codice = truffatore 🚨", de:"Wer diesen Code verlangt = Betrüger 🚨", pt:"Quem pedir este código = golpista 🚨"}],
      ],
      hint: {id:"💡 OTP dari Google tidak pernah diminta oleh 'Tim Dukungan Akun'.", en:"💡 Google never sends codes for 'Account Support' to read.", es:"💡 Google nunca envía códigos para que el 'Soporte' los lea.", fr:"💡 Google n'envoie jamais de codes pour que le 'Support' les lise.", it:"💡 Google non invia codici da far leggere al 'Supporto'.", de:"💡 Google verschickt keine Codes, die 'Support' lesen darf.", pt:"💡 O Google nunca envia códigos para o 'Suporte' ler."},
    };
  }
  // default: chat/DM sender
  return {
    kind: "chat",
    label: {id:"Cek pengirim pesan mencurigakan", en:"Verify the suspicious sender", es:"Verifica el remitente sospechoso", fr:"Vérifiez l'expéditeur suspect", it:"Verifica il mittente sospetto", de:"Prüfe den verdächtigen Absender", pt:"Verifique o remetente suspeito"},
    previewBtn: null, // uses t("check_sender")
    sheetTitle: atk.from,
    sheetSub: (APP_CATALOG[atk.app] || {}).name || "",
    rows: null, // classic rows (number/verified/saved/history)
    hint: null,
  };
}
function verifyLabelFor(atk) { const v = verifyTargetFor(atk); return v ? v.label : null; }

function showSenderSheet() {
  const atk = state.world?.attack;
  if (!atk) return;
  const v = verifyTargetFor(atk);
  if (!state.events.some(e => e.includes("🔍"))) trackEvent("🔍 verified: " + atk.from);
  state.sheet = { type: v.kind === "wifi" ? "wifi" : (v.kind === "call" ? "caller" : "sender"),
    name: v.sheetTitle, sub: v.sheetSub, vt: v, number: "0813-" + String(1000 + (atk.seed % 8999)) + "-•••",
    verified: false, saved: false, history: false, color: v.kind === "wifi" ? "#FEF3C7" : "#FEE2E2", avatar: v.kind === "wifi" ? "📶" : (v.kind === "call" ? "📞" : "👤") };
  render();
}

async function reportMsg() {
  if (!state.mission) { toast(t("report_first")); return; }
  trackEvent("🚩");
  try {
    const r = await fetch(`${API}/mission/${state.mission.mission_id}/action`, { method: "POST",
      headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "report" }) }).then(r => r.json());
    if (r.outcome) finishEncounter(r.outcome);
    else toast(t("report_ok"));
  } catch (e) { toast("ERR " + e.message); }
}

async function finishEncounter(outcome) {
  try {
    const d = await fetch(`${API}/mission/${state.mission.mission_id}/debrief`).then(r => r.json());
    state.debrief = { ...d, outcome };
  } catch (e) {
    state.debrief = { summary: { outcome }, coach: "-" };
  }
  state.world.attack.done = true;
  // chapter accounting: slot B engage = even chapter; slot A odd is marked in promoteAttackB
  if (state.world.attack.isSlotB) markChapterDone((state.world.day - 1) * 2 + 2);
  // storyline state: credentials leak, wallet damage, etc. (doc §4.C)
  recordIncidentOutcome(state.world.attack.scenario, outcome);
  // chapter A resolved → surface chapter B in the notif bar (after the debrief)
  promoteAttackB();
  state.screen = "debrief";
  render();
}
function exitEncounter() {
  // back out of the chat — the mission stays ALIVE and resumable (player is
  // never locked in; reopening the incident resumes the same thread)
  state.screen = "phone"; render();
}

/* ============================================================
   DEBRIEF
   ============================================================ */
function vDebrief() {
  const d = state.debrief;
  const s = d?.summary || {};
  const ST = { "Teramati": ["ok", t("pill_ok")], "Belum teramati": ["no", t("pill_no")], "Perlu diuji": ["todo", t("pill_todo")],
               "Observed": ["ok", t("pill_ok")], "Not observed": ["no", t("pill_no")], "Needs testing": ["todo", t("pill_todo")] };
  const inds = Object.entries(s.indicators || {});
  const isExploration = !!d?.exploration;
  const xpEarn = isExploration ? d.xp : ((s.outcome === "survived" || s.outcome === "survived_reported" ? 100 : 60) + (s.risky_actions === 0 ? 20 : 0));
  return `
  <div class="debrief-wrap"><div class="wrap">
    <p class="kicker">${t("deb_kicker")(state.world.day * 2)}</p>
    <h1>${(s.outcome || "").startsWith("survived") ? t("deb_survived") : t("deb_exposed")}</h1>
    <p class="xp-note">${t("deb_xp_note")(xpEarn)}</p>
    <div class="deb-cards">
      <div class="deb-card"><h3>${t("coach_h")}</h3><p class="coach">${esc(d?.coach || "-")}</p></div>
      ${isExploration ? `
      <div class="deb-card"><h3>${t("day1_done_h")}</h3>
        <ul class="ind-list">
          ${day1Objectives().map(o => `<li><span>${esc(L(o.label))}</span><span class="pill ${o.done ? "ok" : "todo"}">${o.done ? t("pill_ok") : t("pill_todo")}</span></li>`).join("")}
        </ul>
      </div>` : `
      <div class="deb-card"><h3>🚩 ${t("flags_h")}</h3>
        <ul class="flag-list">
          ${(d.red_flags || []).map(f => `<li>🚩 <span>${esc(f)}</span></li>`).join("") || "<li>—</li>"}
        </ul>
      </div>
      <div class="deb-card"><h3>🛡️ ${t("safe_h")}</h3>
        <p style="margin:0;line-height:1.55">${esc(d.safe_response || "-")}</p>
      </div>
      <div class="deb-card"><h3>🎓 ${t("lesson_h")}</h3>
        <p style="margin:0;line-height:1.55">${esc(d.lesson || "-")}</p>
      </div>
      <div class="deb-card"><h3>${t("ind_h")}</h3>
        <ul class="ind-list">
          ${inds.map(([k, v]) => `<li><span>${t("ind" + ({verify_source:1,under_pressure:2,protect_data:3,report_threat:4}[k] || 0)) || esc(k)}</span><span class="pill ${(ST[v] || [])[0] || "todo"}">${(ST[v] || [])[1] || esc(v)}</span></li>`).join("") || "<li>—</li>"}
        </ul>
      </div>`}
      <div class="deb-card"><h3>${t("log_h")}</h3>
        <ol class="log-list">${state.events.map((e, i) => `<li><b>${i + 1}</b><span>${esc(e)}</span></li>`).join("") || "<li>—</li>"}</ol>
      </div>
      <div class="deb-card"><h3>${t("principle_h")}</h3><p>${t("p"+state.world.day)}</p></div>
    </div>
    <div class="deb-actions">
      ${state.world.day < 5
        ? `<button class="btn btn-primary btn-block" onclick="nextDay(${xpEarn})">${t("btn_next_day")(state.world.day * 2 + 1)}</button>`
        : `<button class="btn btn-primary btn-block" onclick="finishChapter()">${t("btn_finish_ch")}</button>`}
      <button class="btn btn-ghost btn-block" style="color:#CBD5E1;border-color:#334155" onclick="requireAuth(go)('dashboard')">${t("back_dash")}</button>
    </div>
  </div></div>`;
}
function nextDay(xpEarn) {
  const p = activeProfile();
  if (!state.debrief) return; // guard: no debrief open → no day advance (prevents double/skip)
  const dayJustFinished = state.world ? state.world.day : p.day;
  if (p.done.includes(dayJustFinished)) return; // already credited — no double-advance
  p.xp += xpEarn;
  if (p.xp >= 100 * p.level) { p.level += 1; toast(t("lvl_up")); }
  if (!p.done.includes(dayJustFinished)) p.done.push(dayJustFinished);
  // archive today's action log BEFORE resetting — the finale aggregates from p.log
  p.log = (p.log || []).concat(state.events.map(e => `[d${dayJustFinished}] ${e}`)).slice(-60);
  p.day = Math.min(5, dayJustFinished + 1);
  state.debrief = null;
  state.events = [];
  saveLocal();
  go("dashboard");
}
async function finishChapter() {
  const p = activeProfile();
  p.xp += 50;
  if (!p.done.includes(5)) p.done.push(5);
  saveLocal();
  // aggregate behavior across the run for the finale
  const dom = { risky: 0, verify: 0, refuse: 0 };
  (p.log || []).forEach(e => {
    // events are tracked with emoji prefixes: 🙈 ignore, 🔍 verify, 🔎, 🚨 report, 📲/💬 engagement
    if (/risky|klik|kirim|OTP|data|📋|📤/i.test(e)) dom.risky++;
    if (/cek|verif|detail|lapor|🔍|🔎|🚨/i.test(e)) dom.verify++;
    if (/tolak|abaik|batal|block|ignore|🙈|reported/i.test(e)) dom.refuse++;
  });
  state.finale = {
    xp: p.xp,
    level: p.level || Math.min(5, 1 + Math.floor(p.xp / 200)),
    days: 5,
    counts: dom,
    loadingCoach: true,
    coach: "",
  };
  state.screen = "finale";
  render();
  // fetch AI coach chapter recap (falls back to template on error)
  try {
    const body = {
      lang: LANG,
      profile: { name: p.name, archetype: p.archetype, level: state.finale.level },
      chapter: 1,
      counts: dom,
      log: (p.log || []).slice(-12),
    };
    const r = await fetch(API + "/chapter-recap", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const j = await r.json();
    state.finale.coach = j.coach || "";
    state.finale.loadingCoach = false;
  } catch (e) {
    state.finale.coach = t("finale_coach_fallback");
    state.finale.loadingCoach = false;
  }
  render();
}

function vFinale() {
  const f = state.finale || {};
  const grade = f.counts
    ? (f.counts.verify + f.counts.refuse * 2 > f.counts.risky * 2 ? "A" :
       f.counts.verify + f.counts.refuse > f.counts.risky ? "B" : "C")
    : "?";
  return `
  <div class="finale-wrap">
    <div class="finale-hero">
      <div class="finale-badge">🎉</div>
      <p class="kicker">${t("finale_kicker")}</p>
      <h1>${t("finale_h")}</h1>
      <p class="sub">${t("finale_sub")}</p>
    </div>
    <div class="finale-grid">
      <div class="finale-card">
        <h3>${t("finale_score_h")}</h3>
        <div class="finale-score"><span class="grade">${grade}</span>
          <div><strong>${f.xp || 0} XP</strong><span>${t("finale_lv")}${f.level || 1}</span></div>
        </div>
        <div class="finale-bars">
          <div class="fbar"><span>${t("finale_b_verify")}</span><div><i style="width:${Math.min(100, (f.counts?.verify||0) * 25)}%"></i></div><b>${f.counts?.verify || 0}</b></div>
          <div class="fbar"><span>${t("finale_b_refuse")}</span><div><i style="width:${Math.min(100, (f.counts?.refuse||0) * 25)}%"></i></div><b>${f.counts?.refuse || 0}</b></div>
          <div class="fbar bad"><span>${t("finale_b_risky")}</span><div><i style="width:${Math.min(100, (f.counts?.risky||0) * 25)}%"></i></div><b>${f.counts?.risky || 0}</b></div>
        </div>
      </div>
      <div class="finale-card coach-card">
        <h3>🧠 ${t("coach_h").replace(/^🧠\s*/, "")}</h3>
        ${f.loadingCoach
          ? `<div class="coach-loading"><span class="dot"></span><span class="dot"></span><span class="dot"></span></div>`
          : `<p class="coach-text">${esc(f.coach || "")}</p>`}
        <p class="coach-domains">${t("finale_domains_note")}</p>
      </div>
      <div class="finale-card">
        <h3>${t("finale_lessons_h")}</h3>
        <ul class="finale-lessons">
          ${[1,2,3,4,5].map(d => `<li><span>✦</span>${t("p"+d)}</li>`).join("")}
        </ul>
      </div>
    </div>
    <div class="finale-next">
      <div class="fn-box">
        <span class="tag">BAB 2</span>
        <h4>${t("finale_next_h")}</h4>
        <p>${t("finale_next_p")}</p>
      </div>
      <div class="finale-actions">
        <button class="btn btn-primary" onclick="go('profiles')">${t("finale_other_world")}</button>
        <button class="btn btn-ghost" onclick="requireAuth(go)('dashboard')">${t("back_dash")}</button>
      </div>
    </div>
  </div>`;
}

/* ============================================================
   PHONE top
   ============================================================ */
function toggleObj() { state.objCollapsed = !state.objCollapsed; render(); }
function endDay1() {
  const p = activeProfile();
  // both chapters of this world-day are resolved here -> record the even one
  if (state.world) markChapterDone(state.world.day * 2);
  const xp = 100 + state.events.length * 5;
  state.debrief = {
    summary: { outcome: "survived", indicators: {} },
    coach: t("day1_coach"),
    xp,
    exploration: true,
  };
  state.screen = "debrief";
  render();
}
/* endDay1 handles ALL days now: same debrief shape (exploration view when no
   encounter debrief data, which is the case when the incident was ignored) */

function enterPhone() { state.screen = "phone"; state.notifOpen = false; state.mailOpen = false; render(); }
function exitPhone() {
  go("dashboard");
}
function trackEvent(text) { state.events.push(text); }

/* wallpaper css */
const WALL_CSS = {
  0: "linear-gradient(160deg,#0F172A,#0D408E)",
  1: "linear-gradient(160deg,#1F2937,#7C2D12)",
  2: "linear-gradient(160deg,#0F172A,#86198F)",
  3: "linear-gradient(160deg,#0F172A,#3F3F46)",
};

/* ============================================================
   RENDER
   ============================================================ */
function render() {
  if (state.screen === "wizard") startWizBadgeTicker(); else stopWizBadgeTicker();
  const root = $("#root");
  const dr = docRoute();
  if (dr) { root.innerHTML = vDoc(dr); window.scrollTo(0, 0); if (typeof hpStopBg3d === "function") hpStopBg3d(); return; }
  const views = {
    landing: vLanding, auth: vAuth, profiles: vProfiles, wizard: vWizard,
    prep: vPrep, dashboard: vDashboard, splash: vSplash, phone: vPhone,
    encounter: vEncounter, debrief: vDebrief, finale: vFinale,
    "md-home": vMdHome, "md-notif": vMdNotif, "md-channel": vMdChannel,
    "md-outcome": vMdOutcome, "md-finale": vMdFinale,
  };
  const v = views[state.screen] || vLanding;
  root.innerHTML = v();
  // toast is global — visible on every screen (demo worlds, auth, etc.)
  if (state.toast && !root.querySelector(".toast")) {
    const el = document.createElement("div");
    el.className = "toast";
    el.textContent = typeof state.toast === "function" ? state.toast() : state.toast;
    root.appendChild(el);
  }
}


/* ============================================================
   SITE DOCS — footer + doc pages + hash router (#/docs/<id>)
   ============================================================ */
function siteFooter() {
  const yr = new Date().getFullYear();
  return `
  <footer class="site-footer">
    <div class="inner">
      <div class="footer-brand">🛡️ HumanPatch</div>
      <p class="footer-note">${t("foot_note")}</p>
      <nav class="footer-nav">
        ${DOC_ORDER.map(d => `<button onclick="openDoc('${d}')">${L(DOCS[d].title)}</button>`).join("")}
      </nav>
      <div class="footer-meta">
        <span>© ${yr} HumanPatch — AMD ACT III</span>
        <span class="dot-sep">${t("foot_sim")}</span>
        <span class="dot-sep">ID · EN · ES · FR · IT · DE · PT</span>
      </div>
    </div>
  </footer>`;
}

function openDoc(id) { location.hash = "docs/" + id; }
function docRoute() {
  const m = location.hash.match(/^#docs\/(\w+)$/);
  return m ? m[1] : null;
}
function docPager(id) {
  const i = DOC_ORDER.indexOf(id);
  const prev = DOC_ORDER[(i - 1 + DOC_ORDER.length) % DOC_ORDER.length];
  const next = DOC_ORDER[(i + 1) % DOC_ORDER.length];
  return `
  <div class="doc-pager">
    <button onclick="openDoc('${prev}')"><span class="pg-label">‹ ${t("pg_prev")}</span><span class="pg-title">${L(DOCS[prev].title)}</span></button>
    <button onclick="openDoc('${next}')" style="text-align:right"><span class="pg-label">${t("pg_next")} ›</span><span class="pg-title">${L(DOCS[next].title)}</span></button>
  </div>`;
}
function vDoc(id) {
  const doc = DOCS[id];
  if (!doc) return vLanding();
  const blocks = doc.body[LANG] || doc.body.en || doc.body.id;
  return `
  <div class="doc-page">
    <header class="topbar topbar-fixed"><div class="wrap-wide topbar-inner">
      <button class="brand brand-btn" onclick="go('landing'); location.hash='';"><img class="brand-mark" src="HumanPatch_Logo.png?v=64" alt="HumanPatch — Every Choice Shapes Your Safety."></button>
      <div style="margin-left:auto;display:flex;gap:10px;align-items:center">
        ${langDropdown()}
        <button class="btn btn-ghost nav-btn" onclick="go('landing'); location.hash='';">‹ ${t("back_home")}</button>
      </div>
    </div></header>
    <div class="doc-wrap">
      <p class="doc-kicker">HumanPatch</p>
      <h1>${L(doc.title)}</h1>
      ${blocks.map(([kind, content]) =>
        kind === "p" ? `<p>${esc(content)}</p>` :
        kind === "h" ? `<h2>${esc(content)}</h2>` :
        `<ul>${content.map(li => `<li>${esc(li)}</li>`).join("")}</ul>`).join("")}
      ${docPager(id)}
      <button class="doc-back" onclick="go('landing'); location.hash='';">‹ ${t("back_home")}</button>
    </div>
    ${siteFooter()}
  </div>`;
}

/* boot — hardened: recover from corrupt/cached localStorage */
window.addEventListener("hashchange", () => render());
loadLocal();
if (state.user) state.screen = "profiles";
try {
  render();
  syncBg3d();
} catch (e) {
  console.error("boot render failed:", e);
  // nuke possibly-corrupt local state and retry clean
  try {
    localStorage.removeItem("hp2_user");
    localStorage.removeItem("hp2_profiles");
    localStorage.removeItem("hp2_active");
  } catch (_) {}
  state.user = null; state.profiles = []; state.activeProfileId = null;
  state.screen = "landing";
  render();
}
