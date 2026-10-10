"""FastAPI app: mission API + AI coach debrief."""
import json
import os
import uuid
from pathlib import Path

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel

from .engine.mission import Mission, MissionDirector
from .engine.scenarios import DOMAINS, load_scenarios
from .engine.telemetry import patch_level
from .llm.client import get_llm

app = FastAPI(title="HumanPatch")
app.add_middleware(
    CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"]
)

PERSONAS = json.loads(
    (Path(__file__).parent / "data" / "personas.json").read_text(encoding="utf-8")
)
SESSIONS: dict[str, MissionDirector] = {}
MISSIONS: dict[str, Mission] = {}


class StartReq(BaseModel):
    persona_id: str
    profile_text: str = ""  # free-form self-description -> bespoke episodes
    lang: str = "id"        # id | en — drives scenario language & Director output


class PremiumReq(BaseModel):
    plan: str = "monthly"  # monthly | family


@app.post("/api/session/{sid}/premium")
def go_premium(sid: str, req: PremiumReq):
    """Mock paywall unlock for the demo (no real billing in the prototype)."""
    d = SESSIONS.get(sid)
    if not d:
        return {"error": "no session"}
    d.premium = True
    return {"premium": True, "plan": req.plan,
            "note": "mock unlock — real billing is post-hackathon"}


class ReplyReq(BaseModel):
    text: str = ""
    delay_ms: int = 0


class ActionReq(BaseModel):
    action: str  # verify_sender | open_link | report


@app.get("/api/health")
def health():
    return {"ok": True, "mock_llm": os.environ.get("MOCK_LLM", "") in ("1", "true")}


@app.get("/api/personas")
def personas(lang: str = "id"):
    lang = lang if lang in ("id", "en") else "id"
    out = []
    for p in PERSONAS:
        out.append({
            "id": p["id"],
            "name": p["name"].get(lang, p["name"].get("id")) if isinstance(p.get("name"), dict) else p.get("name", p["id"]),
            "context": p["context"].get(lang, p["context"].get("id")) if isinstance(p.get("context"), dict) else p.get("context", ""),
            "tags": p.get("tags", []),
        })
    return out


@app.get("/api/domains")
def domains():
    return DOMAINS


FREE_EPISODES = 2  # freemium: free tier cap (mock paywall for the demo)


@app.post("/api/session")
def start_session(req: StartReq):
    persona = next((p for p in PERSONAS if p["id"] == req.persona_id), None)
    if not persona:
        return {"error": "unknown persona"}
    lang = req.lang if req.lang in ("id", "en") else "id"
    if req.profile_text:
        persona = {**persona, "context": req.profile_text[:800]}
    persona = {**persona, "lang": lang}
    sid = str(uuid.uuid4())[:8]
    SESSIONS[sid] = MissionDirector(persona, custom_profile=req.profile_text or None, lang=lang)
    return {"session_id": sid, "persona": persona, "free_episodes": FREE_EPISODES, "lang": lang}


@app.get("/api/session/{sid}/queue")
def queue(sid: str):
    d = SESSIONS.get(sid)
    if not d:
        return {"error": "no session"}
    return {"missions": [s["id"] for s in d.queue], "done": len(d.results)}


@app.post("/api/session/{sid}/mission/start")
def start_mission(sid: str):
    d = SESSIONS.get(sid)
    if not d:
        return {"error": "no session"}
    # freemium gate: free tier caps at FREE_EPISODES missions
    if len(d.results) >= FREE_EPISODES and not getattr(d, "premium", False):
        return {"paywall": True, "played": len(d.results),
                "msg": "Free tier: 2 episode per hari. Upgrade untuk episode tanpa batas."}
    m = d.next_mission()
    if not m:
        return {"finished_all": True}
    m.director = d  # so results auto-record on finish
    MISSIONS[m.id] = m
    res = m.start()
    return {
        "mission_id": m.id,
        "scenario": {
            "id": m.scenario["id"],
            "title": m.scenario["title"],
            "domain": m.scenario["domain"],
            "channel": m.scenario["channel"],
            "sender": m.scenario.get("sender", "Unknown"),
            "page": m.scenario.get("page"),
        },
        **res,
    }


@app.post("/api/mission/{mid}/reply")
def reply(mid: str, req: ReplyReq):
    m = MISSIONS.get(mid)
    if not m:
        return {"error": "no mission"}
    return m.reply(req.text, req.delay_ms)


@app.post("/api/mission/{mid}/action")
def ui_action(mid: str, req: ActionReq):
    """Observed UI actions (buttons), not inferred from chat text.
    verify_sender -> protective; open_link -> risky (enters sandbox);
    fill -> risky data submission; leave -> protective exit; report -> protective+end."""
    m = MISSIONS.get(mid)
    if not m:
        return {"error": "no mission"}
    if req.action == "verify_sender":
        m.telemetry.track("verified_sender")
        return {"logged": "verified_sender",
                "note": "Kamu cek identitas pengirim — perilaku pelindung tercatat."}
    if req.action == "open_link":
        m.telemetry.track("risky_click")
        return {"logged": "risky_click", "sandbox": True,
                "note": "Link dibuka — kamu masuk halaman sandbox tiruan."}
    if req.action == "fill":
        m.telemetry.track("risky_submit")
        m.finished = True
        m.outcome = "compromised"
        if getattr(m, "director", None):
            m.director.record(m)
        return {"logged": "risky_submit", "finished": True, "outcome": "compromised",
                "note": "Data diisi di halaman tiruan. Kredensial tidak keluar dari sandbox."}
    if req.action == "leave":
        m.telemetry.track("protective_exit")
        m.finished = True
        m.outcome = "survived"
        if getattr(m, "director", None):
            m.director.record(m)
        return {"logged": "protective_exit", "finished": True, "outcome": "survived",
                "note": "Halaman ditutup tanpa mengisi apa pun."}
    if req.action == "report":
        return m.report()
    return {"error": "unknown action"}


@app.post("/api/mission/{mid}/report")
def report(mid: str):
    m = MISSIONS.get(mid)
    if not m:
        return {"error": "no mission"}
    return m.report()


@app.get("/api/mission/{mid}/debrief")
def debrief(mid: str):
    """AI coach: personalized debrief grounded in THIS run's events."""
    m = MISSIONS.get(mid)
    if not m:
        return {"error": "no mission"}
    summary = m.summary(lang=m.scenario.get("language", "id"))

    flags = m.scenario.get("red_flags", [])
    llm = get_llm()
    lang = m.scenario.get("language", "id")
    lang_rule = {
        "id": "In Bahasa Indonesia, 4-6 sentences... Speak as 'kamu' to the user.",
        "en": "In English, 4-6 sentences... Speak naturally to the user.",
    }[lang if lang in ("id", "en") else "id"]
    prompt = (
        "You are a warm, concise cybersecurity coach. The user just finished a "
        f"simulation: '{m.scenario['title']}' and their outcome was: {summary['outcome']}. "
        f"Behavior: {summary['risky_actions']} risky actions, {summary['verifications']} "
        f"verifications, {summary['refusals']} refusals. "
        f"{lang_rule.replace('...', ' (1) one-line verdict, no shaming; ')}"
        "(2) the specific red flags they should have caught: " + "; ".join(flags[:3]) + ". "
        "(3) the safe action: " + m.scenario.get("safe_response", "") + " "
        "Plain text only."
    )
    try:
        text = llm.chat(system=prompt, messages=[{"role": "user", "content": "Debrief, please."}],
                        temperature=0.4, max_tokens=250)
        # if a JSON payload sneaks through, unwrap it
        try:
            _j = json.loads(text)
            if isinstance(_j, dict) and "message" in _j:
                text = _j["message"]
        except json.JSONDecodeError:
            pass
    except Exception:
        if lang == "en":
            text = (
                f"Result: {summary['outcome']}. Main red flag: {flags[0] if flags else '-'}. "
                f"{m.scenario.get('safe_response', '')}"
            )
        else:
            text = (
                f"Hasil misi: {summary['outcome']}. Red flag utama: {flags[0] if flags else '-'}. "
                f"{m.scenario.get('safe_response', '')}"
            )
    return {"summary": summary, "coach": text}


@app.get("/api/session/{sid}/profile")
def profile(sid: str):
    d = SESSIONS.get(sid)
    if not d:
        return {"error": "no session"}
    scores = [r["score"] for r in d.results]
    return {
        "results": d.results,
        "patch_level": patch_level(scores),
        "domains": DOMAINS,
    }


# serve frontend (single-file static app) — dev convenience
_frontend_dir = Path(__file__).resolve().parent.parent.parent / "frontend"
if _frontend_dir.is_dir():
    from fastapi.staticfiles import StaticFiles
    app.mount("/", StaticFiles(directory=str(_frontend_dir), html=True), name="frontend")
