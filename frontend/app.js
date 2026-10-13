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
    const ns = state.guestMode || !state.user ? "guest" : state.user.name;
    localStorage.setItem("hp2_user", JSON.stringify(state.user));
    localStorage.setItem(userKey(ns, "profiles"), JSON.stringify(state.profiles));
    localStorage.setItem(userKey(ns, "active"), JSON.stringify(state.activeProfileId));
    localStorage.setItem("hp2_lang", JSON.stringify(LANG));
  } catch (e) { /* private mode */ }
}
function loadLocal() {
  try {
    state.user = JSON.parse(localStorage.getItem("hp2_user") || "null");
    state.guestMode = !state.user;
    const ns = state.user?.name || "guest";
    state.profiles = JSON.parse(localStorage.getItem(userKey(ns, "profiles")) || "[]");
    state.activeProfileId = JSON.parse(localStorage.getItem(userKey(ns, "active")) || "null");
    const l = JSON.parse(localStorage.getItem("hp2_lang") || '"id"');
    if (I18N[l]) LANG = l;
  } catch (e) { /* ignore */ }
}
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
  { arch: "student",  emoji: "🎓", color: "#FEF3C7",
    personas: [
      { id: "nadia",  flag: "🇮🇩", name: t("per_nadia"),  blurb: t("per_nadia_d")  },
      { id: "xiaoyu", flag: "🇨🇳", name: t("per_xiaoyu"), blurb: t("per_xiaoyu_d") },
    ], default: "nadia" },
  { arch: "merchant", emoji: "🛒", color: "#FFE4E6",
    personas: [
      { id: "maddie", flag: "🇺🇸", name: t("per_maddie"), blurb: t("per_maddie_d") },
      { id: "ananya", flag: "🇮🇳", name: t("per_ananya"), blurb: t("per_ananya_d") },
    ], default: "maddie" },
  { arch: "worker",   emoji: "💼", color: "#DBEAFE",
    personas: [
      { id: "rizky",  flag: "🇮🇩", name: t("per_rizky"),  blurb: t("per_rizky_d")  },
      { id: "oliver", flag: "🇬🇧", name: t("per_oliver"), blurb: t("per_oliver_d") },
    ], default: "rizky" },
  { arch: "parent",   emoji: "🏡", color: "#DCFCE7",
    personas: [
      { id: "elsa",   flag: "🇸🇪", name: t("per_elsa"),   blurb: t("per_elsa_d")   },
      { id: "emir",   flag: "🇹🇷", name: t("per_emir"),   blurb: t("per_emir_d")   },
    ], default: "elsa" },
  { arch: "general",  emoji: "🌐", color: "#E0E7FF",
    personas: [
      { id: "chinedu", flag: "🇳🇬", name: t("per_chinedu"), blurb: t("per_chinedu_d") },
      { id: "diego",   flag: "🇲🇽", name: t("per_diego"),   blurb: t("per_diego_d")   },
    ], default: "chinedu" },
];
const ALL_PERSONAS = WORLD_PATHS.flatMap(w => w.personas);
function setWorldFilter(f) { state.worldFilter = f; render(); }
function startWorldPath(arch) {
  state.wizard.archetype = arch;
  state.wizard.step = 2; // archetype preselected → jump to customization
  go("wizard");
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
    <button class="brand" onclick="go('landing'); location.hash=''"><img class="brand-mark" src="HumanPatch_Logo.png?v=2" alt="CyberLife"></button>
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
            ${[["💬","#0F766E"],["✉️","#2563EB"],["📧","#DC2626"],["🌐","#334155"],["👛","#7C3AED"],["🛒","#EA580C"],["📸","#DB2777"],["🎓","#0891B2"]].map(a =>
              `<span class="hv-app" style="background:${a[1]}">${a[0]}</span>`).join("")}
          </div>
          <div class="hv-notif">
            <div class="hv-n"><span class="hv-ni" style="background:#EA580C">🛒</span><div><strong>DailyMart</strong><p>${L(INAPP.sms[1].text).slice(0, 40)}…</p></div></div>
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
        ${WORLD_PATHS.filter(p => (state.worldFilter||"all")==="all" || p.arch===state.worldFilter).map(p => {
          const prof = (state.profiles||[]).find(x => x.archetype === p.arch);
          const days = prof ? (prof.day - 1) : 0;
          const pct = Math.round(days / 5 * 100);
          return `
          <article class="path-card ${prof ? "started" : ""}">
            <div class="pc-head">
              <div class="pc-icon" style="background:${p.color}">${p.emoji}</div>
              <div class="pc-title">
                <span class="pc-tag">${t("arch_" + p.arch)}</span>
                <h3>${p.personas[0].name}</h3>
                <p>${t("arch_" + p.arch + "_d")}</p>
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
            <button class="btn ${prof ? "btn-primary" : "btn-ghost"} pc-cta" onclick="${prof ? `requireAuth(playProfile)('${prof.id}')` : `requireAuth(startWorldPath)('${p.arch}')`}">
              ${prof ? t("wp_continue") : t("wp_start")}
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
      <div class="brand" style="margin-bottom:14px"><img class="brand-mark" src="HumanPatch_Logo.png?v=2" alt="CyberLife"></div>
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
  // user logged in — flush any guest trial data (won't carry over by design)
  if (state.guestMode) {
    localStorage.removeItem(userKey("guest", "profiles"));
    localStorage.removeItem(userKey("guest", "active"));
  }
  state.profiles = JSON.parse(localStorage.getItem(userKey(name, "profiles")) || "[]");
  state.activeProfileId = JSON.parse(localStorage.getItem(userKey(name, "active")) || "null");
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
    <div class="brand"><img class="brand-mark" src="HumanPatch_Logo.png?v=2" alt="CyberLife"></div>
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
            <p style="margin:0">${t("day_word")} ${p.day} · Lv ${p.level}</p>
          </div>
          <button class="btn btn-primary" style="min-height:40px;padding:0 16px;font-size:13px" onclick="requireAuth(playProfile)('${p.id}')">${t("btn_play")}</button>
        </div>`).join("")}
      ${ps.length === 0 ? `<div class="card center"><p>${t("profiles_empty")}</p></div>` : ""}
    </div>
    <button class="btn btn-dark btn-block mt16" onclick="requireAuth(go)('wizard')">${t("btn_new_profile")}</button>
  </main>` + siteFooter();
}
function playProfile(id) { state.activeProfileId = id; saveLocal(); go("dashboard"); }

/* ============================================================
   WIZARD
   ============================================================ */
const AVATARS = ["🙂", "😎", "👩‍🎓", "🧑‍🏫", "👩‍💼", "🧑‍🌾", "👨‍🔧", "👩‍💻", "🧕", "👨‍🦱"];
const WALLS = [0, 1, 2, 3];
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
    <button class="brand" onclick="go('profiles')" style="background:none;border:none"><img class="brand-mark" src="HumanPatch_Logo.png?v=2" alt="CyberLife"></button>
    <span class="dim small">${t("step_of")(step)}</span>
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
  const p = {
    id: "p" + Date.now().toString(36),
    name: archName(w.archetype),
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
   WORLD PREP
   ============================================================ */
function vPrep() {
  return `
  <div class="prep-screen"><div class="wrap prep-inner">
    <div class="prep-phone-mock"></div>
    <h1 style="font-size:22px">${t("prep_h")}</h1>
    <p class="dim small" style="margin-top:6px">${t("prep_sub")}</p>
    <div class="prep-steps">
      ${[1,2,3,4].map(i => `
        <div class="prep-step" id="ps-${i-1}"><div class="spin"></div><p>${t("prep_s"+i)}</p></div>`).join("")}
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
  <header class="topbar"><div class="wrap-wide topbar-inner">
    <div class="brand"><img class="brand-mark" src="HumanPatch_Logo.png?v=2" alt="CyberLife"></div>
    <div style="display:flex;gap:10px;align-items:center">
      ${langDropdown()}
      <button class="btn btn-ghost nav-btn" onclick="go('profiles')">${t("profiles_h1").split(" ")[0]}</button>
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
        <p class="kicker">${t("chap_day_of")(p.day)}</p>
        <h2>${t("day"+p.day+"_t")}</h2>
        <p>${t("day"+p.day+"_o")}</p>
        <button class="btn" onclick="startDay()">${t("btn_continue")}</button>
      </div>
    </div>

    <section class="section" style="border-top:none;padding-top:6px">
      <h2 style="font-size:16px">${t("journey_h")}</h2>
      <p class="sub" style="margin-bottom:12px">${t("journey_sub")}</p>
      <div class="journey">
        ${STORY_DAYS.map((d) => {
          const done = p.done.includes(d.day);
          const cur = d.day === p.day;
          return `<div class="jday ${done ? "done" : ""} ${cur ? "cur" : ""}">
            <div class="jdot">${done ? "✓" : d.day}</div><span>${t("day"+d.day+"_t").split(" ")[0]}</span>
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
  return `
  <div class="day-splash">
    <p class="daynum">${t("chap_day_of")(w.day)}</p>
    <h1>${t("day"+w.day+"_t")}</h1>
    <p class="dim">${STORY_DAYS[w.day-1].engTitle}</p>
    <div class="obj">${t("obj_prefix")} ${t("day"+w.day+"_o")}</div>
    <button class="btn btn-primary" onclick="enterPhone()">${t("btn_power")}</button>
    <button class="btn btn-ghost" style="color:#94A3B8;border-color:#334155;margin-top:10px" onclick="requireAuth(go)('dashboard')">${t("back_dash")}</button>
  </div>`;
}

/* ============================================================
   THE SIMULATED PHONE
   ============================================================ */
function unreadTotal() { return state.world ? state.world.notifs.filter(n => !n.read).length : 0; }

function vPhone() {
  const w = state.world;
  const story = STORY_DAYS[w.day - 1];
  return `
  <div class="phone-stage">
    <div class="phone-topbar">
      <button class="exit" onclick="exitPhone()">${t("exit")}</button>
      <span>${t("day_word")} ${w.day} · ${t("day"+w.day+"_t")}</span>
      <span class="demo-flag">${t("demo_flag")}</span>
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
    ${state.toast ? `<div class="toast">${esc(typeof state.toast === "function" ? state.toast() : state.toast)}</div>` : ""}
  </div>`;
}

function unreadFor(appId) { return state.world.notifs.filter(n => n.app === appId && !n.read).length; }

function vHomeScreen() {
  const w = state.world;
  const p = activeProfile();
  const wall = WALL_CSS[p.wallpaper] || w.wallpaper;
  const unread = w.notifs.filter(n => !n.read).length;
  const atkApp = w.attack?.app;
  return `
  <div class="homescreen" style="background:${wall}">
    <div class="widget">
      <p class="day-label">${t("day_word")} ${w.day} — ${t("day"+w.day+"_t")}</p>
      <h3>${t("morning")(archName(p.archetype).split(" ")[0])}</h3>
      <p>${w.day === 1 ? t("day1_hint")(unread) : t("day2_hint")(unread)}</p>
    </div>
    ${w.day === 1 ? `
    <div class="obj-card">
      <div class="obj-head">
        <strong>${t("day1_obj_h")}</strong>
        <span class="obj-count">${day1Objectives().filter(o => o.done).length}/${day1Objectives().length}</span>
      </div>
      <ul class="obj-list">
        ${day1Objectives().map(o => `<li class="${o.done ? "done" : ""}">${o.done ? "✔" : "○"} ${esc(L(o.label))}</li>`).join("")}
      </ul>
      ${day1Done() ? `<button class="btn btn-primary btn-block" style="min-height:44px" onclick="endDay1()">${t("end_day1")}</button>` : `<p class="obj-hint">${t("day1_obj_hint")}</p>`}
    </div>` : ""}
    <div class="app-grid">
      ${w.apps.map(a => {
        const isAtk = a.id === atkApp && w.attack;
        const unreadN = unreadFor(a.id);
        const badge = isAtk ? "!" : (unreadN > 9 ? "9+" : unreadN || "");
        return `<button class="app-icon" onclick="openApp('${a.id}')">
          <span class="ai" style="background:${a.bg}">${a.icon}${badge ? `<span class="badge">${badge}</span>` : ""}</span>
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
          <span class="ai" style="background:${a.bg};width:46px;height:46px;font-size:20px">${a.icon}${badge ? `<span class="badge">${badge}</span>` : ""}</span>
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
  if (app === "chatloop") body = vChatLoop();
  else if (app === "messagebox") body = vMessageBox();
  else if (app === "journal") body = vJournalApp();
  else if (app === "security") body = vSecurityApp();
  else if (app === "settings") body = vSettingsApp();
  else body = vGenericApp(meta);
  return `
  <div class="appwin">
    <div class="appbar">
      <button class="back" onclick="closeApp()" aria-label="back">${icons.back}</button>
      <h5>${meta.icon} ${meta.name}</h5>
    </div>
    <div class="appbody">${body}</div>
  </div>`;
}
function openApp(id) {
  state.openApp = id;
  if (id === "chatloop") state.openedChat = true;
  if (id === "security") state.openedSecurity = true;
  if (id === "journal") state.openedJournal = true;
  render();
  const w = state.world;
  if (w.attack && w.attack.app === id && !w.attack.done) {
    setTimeout(() => startEncounter(), 400);
  }
}
function closeApp() { state.openApp = null; state.openChat = null; render(); }

function vChatLoop() {
  if (state.openChat) return vChatThread(state.openChat);
  const w = state.world;
  const atk = w.attack;
  const atkThread = atk && atk.app === "chatloop" && !atk.done ? atk : null;
  return `
    ${atkThread ? `
    <div class="chat-list-item unread" onclick="startEncounter()">
      <div class="cav" style="background:#FEE2E2">👤</div>
      <div class="cb">
        <div class="ct"><strong>${esc(atkThread.from)}</strong><time>09:02</time></div>
        <p>${esc(atkThread.notifText)}</p>
      </div>
      <span class="dot-un"></span>
    </div>` : ""}
    ${w.contacts.map(c => {
      const msg = chatPreview(c.id);
      return `
      <div class="chat-list-item" onclick="openChat('${c.id}')">
        <div class="cav" style="background:${c.color}">${c.avatar}</div>
        <div class="cb">
          <div class="ct"><strong>${esc(c.name)}</strong><time>08:${String(30 + (c.name.length % 20)).padStart(2, "0")}</time></div>
          <p>${esc(msg)}</p>
        </div>
      </div>`;
    }).join("")}`;
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
    {id:"Oke ya, aku ada urusan dulu. Chat lagi nanti 👋", en:"Okay, I've got things to do. Talk later 👋", es:"Ok, tengo cosas que hacer. Hablamos luego 👋", pt:"Ok, tenho coisas a fazer. Falamos depois 👋", hi:"ठीक है, मुझे काम है। बाद में बात करते हैं 👋"},
    {id:"Sip dicatat! Aku offline dulu ya", en:"Noted! Going offline for now", es:"¡Anotado! Me desconecto un rato", pt:"Anotado! Vou desconectar um pouco", hi:"नोट किया! अभी ऑफलाइन हो रहा हूँ"},
    {id:"Hehe oke deh. Nanti dilanjut ya!", en:"Haha okay. We'll continue later!", es:"Jaja ok. ¡Seguimos luego!", pt:"Haha ok. Continuamos depois!", hi:"हहा ठीक। बाद में जारी रखेंगे!"},
  ],
  pick() { return this.items[Math.floor(Math.random() * this.items.length)]; },
};

function vChatThread(cid) {
  const c = state.world.contacts.find(x => x.id === cid) || { name: cid, avatar: "👤", color: "#94A3B8" };
  const thread = (CONTACT_THREADS[cid] || []).map(m => ({ ...m, text: L(m.text) }));
  const mine = (state.normChat || {})[cid] || [];
  const lines = [...thread, ...mine];
  return `
  <div class="appwin" style="height:100%">
    <div class="appbar">
      <button class="back" onclick="closeChat()" aria-label="back">${icons.back}</button>
      <h5><span class="cav" style="background:${c.color};width:26px;height:26px;font-size:13px">${c.avatar}</span> ${esc(c.name)}</h5>
      <button class="back" onclick="normContactInfo('${esc(c.name)}')" aria-label="info">ⓘ</button>
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
    <div class="chat-list-item unread" onclick="startEncounter()">
      <div class="cav" style="background:#FEE2E2">📩</div>
      <div class="cb">
        <div class="ct"><strong>${esc(atkThread.from)}</strong><time>09:02</time></div>
        <p>${esc(atkThread.notifText)}</p>
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
    <div class="card"><strong>${t("day_word")} ${w.day}: ${t("day"+w.day+"_t")}</strong><p class="small dim">${t("obj_prefix")} ${t("day"+w.day+"_o")}</p></div>
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
  const rows = INAPP.settings.map(s => [s.icon, L(s.label), L(s.value)]);
  return `
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
function openPerms() {
  trackEvent("🛡️ permissions");
  state.openApp = "security";
  render();
}

function vGenericApp(meta) {
  const w = state.world;
  const atk = w.attack;
  if (atk && atk.app === meta.id && !atk.done) {
    return `
      <div class="card center">
        <span style="font-size:34px">${meta.icon}</span>
        <h3 style="margin:6px 0">${esc(atk.from)}</h3>
        <p class="small dim">${esc(atk.notifText)}</p>
        <button class="btn btn-primary btn-block mt8" onclick="startEncounter()">${t("open")} ▸</button>
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
            <div class="nt"><strong>${esc(n.from)}</strong><time>09:0${n.id.slice(-1)}</time></div>
            <p>${esc(n.text)}</p>
            ${n.attack ? `<div class="actions"><button class="pri" onclick="startEncounter()">${t("open")}</button><button onclick="actDismiss('${n.id}')">${t("ignore")}</button></div>` : `<div class="actions"><button onclick="readNotif('${n.id}')">${t("mark_read")}</button></div>`}
          </div>
        </div>`).join("")}
    </div>
  </div>`;
}
function readSms(id, from, text) {
  const n = state.world.notifs.find(x => x.id === id);
  if (n && !n.read) {
    n.read = true;
    if (n.attack) { startEncounter(); return; }
    trackEvent(`📬 ${from}`);
    render();
    toast(`💬 ${text.slice(0, 60)}`);
  }
}

/* ---------- Day-1 exploration objectives ---------- */
function day1Objectives() {
  return [
    { id: "open_msg",    label: {id:"Buka MessageBox dan baca SMS", en:"Open MessageBox and read an SMS", es:"Abre MessageBox y lee un SMS", pt:"Abra o MessageBox e leia um SMS", hi:"MessageBox खोलें और SMS पढ़ें"}, done: state.events.some(e => e.startsWith("📬")) },
    { id: "open_chat",   label: {id:"Buka ChatLoop dan baca chat", en:"Open ChatLoop and read a chat", es:"Abre ChatLoop y lee un chat", pt:"Abra o ChatLoop e leia um chat", hi:"ChatLoop खोलें और चैट पढ़ें"}, done: state.openedChat || false },
    { id: "check_notif", label: {id:"Buka panel notifikasi (ketuk jam)", en:"Open the notification panel (tap the clock)", es:"Abre el panel de notificaciones (toca el reloj)", pt:"Abra o painel de notificações (toque no relógio)", hi:"सूचना पैनल खोलें (घड़ी टैप करें)"}, done: state.notifSeen || false },
    { id: "check_perm",  label: {id:"Cek izin aplikasi di Security", en:"Check app permissions in Security", es:"Revisa permisos en Security", pt:"Verifique permissões no Security", hi:"Security में ऐप अनुमतियाँ देखें"}, done: state.events.some(e => e.startsWith("🛡")) || state.openedSecurity || false },
    { id: "open_journal",label: {id:"Buka Journal dan cek misimu", en:"Open Journal and check your mission", es:"Abre Journal y revisa tu misión", pt:"Abra o Journal e veja sua missão", hi:"Journal खोलें और मिशन देखें"}, done: state.openedJournal || false },
  ];
}
function day1Done() { return day1Objectives().every(o => o.done); }

function toggleNotif(open) {
  state.notifOpen = open ?? !state.notifOpen;
  if (state.notifOpen) state.notifSeen = true;
  render();
}
function clearNotifs() { state.world.notifs.forEach(n => n.read = true); render(); }
function readNotif(id) { const n = state.world.notifs.find(x => x.id === id); if (n) { n.read = true; trackEvent("📄 " + n.from); } render(); }
function actDismiss(id) {
  const n = state.world.notifs.find(x => x.id === id);
  if (n) { n.read = true; trackEvent("🙈 " + n.from); }
  render();
  toast(t("ignored_toast"));
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
        <div><h3>${esc(s.name)}</h3><p class="sub">${esc(s.sub || "")}</p></div>
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
  state.openApp = null;
  state.notifOpen = false;
  state.encounterChat = [];
  state.screen = "encounter";
  render();
  try {
    const personaMap = { student: "mahasiswa", merchant: "umkm", worker: "karyawan", parent: "orangtua", general: "umum" };
    const s = await fetch(`${API}/session`, { method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ persona_id: personaMap[w.profile.archetype] || "umum", lang: ["id","en","es","hi","pt"].includes(LANG) ? LANG : "id" }) }).then(r => r.json());
    state.session = s;
    const m = await fetch(`${API}/session/${s.session_id}/mission/start`, { method: "POST" }).then(r => r.json());
    if (m.paywall) { toast(m.msg); state.screen = "phone"; render(); return; }
    state.mission = m;
    state.encounterChat = [{ role: "them", text: m.message, time: nowT() }];
    trackEvent("📬 " + atk.from);
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

function showSenderSheet() {
  const atk = state.world?.attack;
  if (!atk) return;
  state.sheet = { type: "sender", name: atk.from, sub: (APP_CATALOG[atk.app] || {}).name || "",
    number: "0813-" + String(1000 + (atk.seed % 8999)) + "-•••", verified: false, saved: false, history: false, color: "#FEE2E2", avatar: "👤" };
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
  state.screen = "debrief";
  render();
}
function exitEncounter() { state.screen = "phone"; render(); }

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
    <p class="kicker">${t("deb_kicker")(state.world.day)}</p>
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
        ? `<button class="btn btn-primary btn-block" onclick="nextDay(${xpEarn})">${t("btn_next_day")(state.world.day + 1)}</button>`
        : `<button class="btn btn-primary btn-block" onclick="finishChapter()">${t("btn_finish_ch")}</button>`}
      <button class="btn btn-ghost btn-block" style="color:#CBD5E1;border-color:#334155" onclick="requireAuth(go)('dashboard')">${t("back_dash")}</button>
    </div>
  </div></div>`;
}
function nextDay(xpEarn) {
  const p = activeProfile();
  p.xp += xpEarn;
  if (p.xp >= 100 * p.level) { p.level += 1; toast(t("lvl_up")); }
  if (!p.done.includes(p.day)) p.done.push(p.day);
  p.day = Math.min(5, p.day + 1);
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
    if (/risky|klik|kirim|OTP|data/i.test(e)) dom.risky++;
    if (/cek|verif|detail|lapor/i.test(e)) dom.verify++;
    if (/tolak|abaik|batal|block/i.test(e)) dom.refuse++;
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
function endDay1() {
  const p = activeProfile();
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

function enterPhone() { state.screen = "phone"; state.notifOpen = false; render(); }
function exitPhone() {
  go("dashboard");
}
function trackEvent(text) { state.events.push(text); }

/* wallpaper css */
const WALL_CSS = {
  0: "linear-gradient(160deg,#0F172A,#134E4A)",
  1: "linear-gradient(160deg,#1F2937,#7C2D12)",
  2: "linear-gradient(160deg,#0F172A,#86198F)",
  3: "linear-gradient(160deg,#0F172A,#3F3F46)",
};

/* ============================================================
   RENDER
   ============================================================ */
function render() {
  const root = $("#root");
  const dr = docRoute();
  if (dr) { root.innerHTML = vDoc(dr); window.scrollTo(0, 0); if (typeof hpStopBg3d === "function") hpStopBg3d(); return; }
  const views = {
    landing: vLanding, auth: vAuth, profiles: vProfiles, wizard: vWizard,
    prep: vPrep, dashboard: vDashboard, splash: vSplash, phone: vPhone,
    encounter: vEncounter, debrief: vDebrief, finale: vFinale,
  };
  const v = views[state.screen] || vLanding;
  root.innerHTML = v();
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
      <button class="brand brand-btn" onclick="go('landing'); location.hash='';"><img class="brand-mark" src="HumanPatch_Logo.png?v=2" alt="CyberLife"></button>
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
