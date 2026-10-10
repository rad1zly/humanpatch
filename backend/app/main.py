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


@app.get("/api/health")
def health():
    return {"ok": True, "mock_llm": os.environ.get("MOCK_LLM", "") in ("1", "true")}


@app.get("/api/personas")
def personas():
    return PERSONAS


@app.get("/api/domains")
def domains():
    return DOMAINS


FREE_EPISODES = 2  # freemium: free tier cap (mock paywall for the demo)


@app.post("/api/session")
def start_session(req: StartReq):
    persona = next((p for p in PERSONAS if p["id"] == req.persona_id), None)
    if not persona:
        return {"error": "unknown persona"}
    if req.profile_text:
        persona = {**persona, "context": req.profile_text[:800]}
    sid = str(uuid.uuid4())[:8]
    SESSIONS[sid] = MissionDirector(persona, custom_profile=req.profile_text or None)
    return {"session_id": sid, "persona": persona, "free_episodes": FREE_EPISODES}


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
        },
        **res,
    }


@app.post("/api/mission/{mid}/reply")
def reply(mid: str, req: ReplyReq):
    m = MISSIONS.get(mid)
    if not m:
        return {"error": "no mission"}
    return m.reply(req.text, req.delay_ms)


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
    summary = m.summary()

    flags = m.scenario.get("red_flags", [])
    llm = get_llm()
    prompt = (
        "You are a warm, concise cybersecurity coach. The user just finished a "
        f"simulation: '{m.scenario['title']}' and their outcome was: {summary['outcome']}. "
        f"Behavior: {summary['risky_actions']} risky actions, {summary['verifications']} "
        f"verifications, {summary['refusals']} refusals. "
        "In Bahasa Indonesia, 4-6 sentences: (1) one-line verdict, no shaming; "
        "(2) the specific red flags they should have caught: " + "; ".join(flags[:3]) + ". "
        "(3) the safe action: " + m.scenario.get("safe_response", "") + " "
        "Speak as 'kamu' to the user. Plain text only."
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
