/* md-app.js — bootstrap for the 10-chapter MD campaign (standalone page).
   Depends on i18n.js (t/L/esc) + chapters.js (MD_CHAPTERS) + md-engine.js. */

/* standalone shims (L/esc normally live in world.js/app.js of the main app) */
if (typeof L === "undefined") {
  window.L = function (obj) {
    if (obj == null) return "";
    if (typeof obj === "string") return obj;
    return obj[LANG] || obj.en || obj.id || "";
  };
}
if (typeof esc === "undefined") {
  window.esc = (s) => String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}
if (typeof toast === "undefined") {
  window.toast = (msg) => { console.log("[toast]", msg); };
}

const MD_VIEWS = {
  "md-home": vMdHome,
  "md-notif": vMdNotif,
  "md-channel": vMdChannel,
  "md-outcome": vMdOutcome,
  "md-finale": vMdFinale,
};

const mdState = {
  screen: "md-home",
  mdRun: null,
  mdSheet: false,
};

// minimal state shim so md-engine's `state.` refs work
window.state = mdState;

// persistence (localStorage, same key style as main app)
function mdLoad() {
  try {
    const raw = localStorage.getItem("hp_md_run");
    if (raw) state.mdRun = JSON.parse(raw);
  } catch (e) {}
  // restore transient chapter context if a run is in progress
  if (state.mdRun && state.mdRun.chapter) {
    MD.choice = null; MD.outcome = state.mdRun.outcomes[state.mdRun.chapter-1] || null;
    MD.recoveryDone = state.mdRun.recoveryDone?.[state.mdRun.chapter-1] || [];
  }
}
function saveLocal() {
  try {
    if (state.mdRun) {
      // persist transient MD.* into the run for reload
      state.mdRun._transient = { choice: MD.choice, outcome: MD.outcome, recoveryDone: MD.recoveryDone, log: MD.log };
      localStorage.setItem("hp_md_run", JSON.stringify(state.mdRun));
    }
  } catch (e) {}
}

function mdRender() {
  const root = document.getElementById("root");
  const v = MD_VIEWS[state.screen] || vMdHome;
  root.innerHTML = v();
}

// route helpers
function go(screen) { state.screen = screen; mdRender(); }

// md-engine calls render() — bind it
window.render = mdRender;

// init
window.addEventListener("DOMContentLoaded", () => {
  mdLoad();
  mdRender();
});

// re-render on hash too (#ch7 etc for quick jumps in dev)
window.addEventListener("hashchange", () => {
  const m = location.hash.match(/^#ch(\d+)$/);
  if (m && state.mdRun) { mdGoChapter(parseInt(m[1], 10)); }
  else mdRender();
});
