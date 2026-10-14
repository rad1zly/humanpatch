"""FastAPI app: mission API + AI coach debrief."""
import os
# --- .env loader (keys live in backend/.env, gitignored) ---
from pathlib import Path as _P
_env_file = _P(__file__).resolve().parents[1] / ".env"
if _env_file.exists():
    for _line in _env_file.read_text().splitlines():
        if "=" in _line and not _line.strip().startswith("#"):
            _k, _, _v = _line.partition("=")
            os.environ.setdefault(_k.strip(), _v.strip())

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
    story_id: str = ""      # storyline template the profile rolled (e.g. student-01)
    story_day: int = 1      # current story day 1..5


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
    lang = lang if lang in ("id", "en", "es", "fr", "it", "de", "pt") else "id"
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
    lang = req.lang if req.lang in ("id", "en", "es", "fr", "it", "de", "pt") else "id"
    if req.profile_text:
        persona = {**persona, "context": req.profile_text[:800]}
    persona = {**persona, "lang": lang}
    sid = str(uuid.uuid4())[:8]
    d = MissionDirector(persona, custom_profile=req.profile_text or None, lang=lang)
    d.story_id = req.story_id
    d.story_day = req.story_day
    SESSIONS[sid] = d
    return {"session_id": sid, "persona": persona, "free_episodes": FREE_EPISODES, "lang": lang,
            "story_id": req.story_id, "story_day": req.story_day}


@app.get("/api/session/{sid}/queue")
def queue(sid: str):
    d = SESSIONS.get(sid)
    if not d:
        return {"error": "no session"}
    return {"missions": [s["id"] for s in d.queue], "done": len(d.results)}


def story_mission(director):
    """Storyline-bound missions: pick the curated scenario matching the
    profile's storyline + current story day (one encounter per phone-day:
    first unused event of that day)."""
    sid = getattr(director, "story_id", "")
    day = int(getattr(director, "story_day", 1) or 1)
    if not sid or sid == "student-01":
        pool = [s for s in load_scenarios().values()
                if s.get("story") == "student-01" and int(s.get("story_day", 0)) == day]
        if not pool:
            return None
        used = {m.scenario["id"] for m in MISSIONS.values()
                if getattr(m, "story_used_by", None) is director}
        for s in sorted(pool, key=lambda x: x["id"]):
            if s["id"] not in used:
                mi = Mission(s["id"], director.persona)
                mi.story_used_by = director
                return mi
    return None


@app.post("/api/session/{sid}/mission/start")
def start_mission(sid: str):
    d = SESSIONS.get(sid)
    if not d:
        return {"error": "no session"}
    # freemium gate: free tier caps at FREE_EPISODES missions
    if len(d.results) >= FREE_EPISODES and not getattr(d, "premium", False):
        return {"paywall": True, "played": len(d.results),
                "msg": "Free tier: 2 episode per hari. Upgrade untuk episode tanpa batas."}
    m = story_mission(d) or d.next_mission()
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
            "level": int(m.scenario.get("level", 1)),
        },
        "level": d.level,
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


class AdaptStoryReq(BaseModel):
    lang: str = "id"
    story: dict          # the full storyline template JSON
    persona: dict        # persona facts: name, age, city, level, context


@app.post("/api/adapt-story")
def adapt_story(req: AdaptStoryReq):
    """AI adapts a storyline template to the player's persona:
    same security beats, different words/context/age-level."""
    persona = req.persona
    story = req.story
    lang = req.lang if req.lang in ("id", "en", "es", "fr", "it", "de", "pt") else "id"

    lang_name = {"id": "Indonesian (Bahasa Indonesia)", "en": "English", "es": "Spanish",
                 "fr": "French", "it": "Italian", "de": "German", "pt": "Portuguese"}[lang]

    # Collect all texts to adapt (event text + choice texts + twists)
    def collect(s):
        items = []
        premise = s.get("premise", {}).get(lang) or s.get("premise", {}).get("en")
        if premise:
            items.append({"id": "premise", "text": premise})
        for di, day in enumerate(s.get("days", [])):
            for ei, ev in enumerate(day.get("events", [])):
                txt = ev.get("text", {}).get(lang) or ev.get("text", {}).get("en")
                if txt:
                    items.append({"id": f"d{di}e{ei}", "text": txt})
                tw = (ev.get("twist") or {})
                if isinstance(tw, dict):
                    twt = tw.get(lang) or tw.get("en")
                elif tw:
                    twt = tw
                else:
                    twt = None
                if twt:
                    items.append({"id": f"d{di}e{ei}tw", "text": twt})
                for ci, ch in enumerate(ev.get("choices", [])):
                    ct = ch.get("t", {}).get(lang) or ch.get("t", {}).get("en")
                    if ct:
                        items.append({"id": f"d{di}e{ei}c{ci}", "text": ct})
        return items

    items = collect(story)
    if not items:
        return {"adapted": {}, "adapted_by": "none"}

    # Mock mode: simple placeholder substitution, no LLM
    if os.environ.get("MOCK_LLM", "") in ("1", "true", "yes"):
        adapted = {}
        name = persona.get("name", "Player")
        city = persona.get("city", "")
        for it in items:
            tx = it["text"]
            tx = tx.replace("kamu", name if lang == "id" else "you")
            adapted[it["id"]] = tx
        return {"adapted": adapted, "adapted_by": "mock"}

    # LLM mode: rewrite each text for the persona
    sys_prompt = (
        "You are a narrative adapter for a cybersecurity-awareness simulation game. "
        f"Rewrite each story text so it fits this character:\n"
        f"- Name: {persona.get('name')}\n"
        f"- Age: {persona.get('age')}\n"
        f"- School level: {persona.get('level')}\n"
        f"- City/country: {persona.get('city')}\n"
        f"- Context: {persona.get('context','')}\n\n"
        f"Write in {lang_name}. Rules:\n"
        "1. Keep the SAME security-teaching point and the same choice structure.\n"
        "2. Adapt vocabulary to the character's age (a 12-year-old gets simpler words than a 22-year-old).\n"
        "3. Localize context details (school type, apps, currency, local references) to the character's city/country.\n"
        "4. Refer to the player in second person as the character's name where natural.\n"
        "5. Keep each text under 2 sentences unless the original is longer.\n"
        "6. NEVER use Chinese/Cyrillic/other non-Latin scripts unless the target language uses them.\n"
        "Return STRICT JSON: {\"items\": [{\"id\": \"<same id>\", \"text\": \"<rewritten>\"}]}"
    )

    user_payload = json.dumps({"items": items[:20]}, ensure_ascii=False)
    try:
        out = get_llm().chat(
            system=sys_prompt,
            messages=[{"role": "user", "content": user_payload}],
            temperature=0.7,
            max_tokens=1600,
        )
        raw = out.strip()
        if raw.startswith("```"):
            raw = raw.split("```")[1]
            if raw.startswith("json"):
                raw = raw[4:]
        data = json.loads(raw)
        adapted = {it["id"]: it["text"] for it in data.get("items", [])}
        return {"adapted": adapted, "adapted_by": "ai"}
    except Exception as e:
        return {"adapted": {}, "adapted_by": f"error:{e}"}


class StoryContextReq(BaseModel):
    lang: str = "id"
    archetype: str = "student"
    persona: dict = {}
    story: dict = {}


@app.post("/api/story-context")
def story_context(req: StoryContextReq):
    """One-shot world personalization: AI adapts storyline + generates NPC cast
    (classmates, teachers, class group name, school name) for the persona."""
    persona = req.persona or {}
    lang = req.lang if req.lang in ("id", "en", "es", "fr", "it", "de", "pt") else "id"
    lang_name = {"id": "Indonesian", "en": "English", "es": "Spanish", "fr": "French",
                 "it": "Italian", "de": "German", "pt": "Portuguese"}[lang]
    name = persona.get("name", "Player")
    age = persona.get("age", 16)
    city = persona.get("city", "Jakarta")
    level = persona.get("level", "SMA")
    context = persona.get("context", "")

    mock = os.environ.get("MOCK_LLM", "") in ("1", "true", "yes")

    # ---- part 1: NPC cast (always generated, even mock) ----
    if mock:
        import random as _r
        first = ["Ayu", "Bagas", "Citra", "Dimas", "Eka", "Fajar", "Gita", "Hana", "Ivan", "Joko"]
        last = ["Pratama", "Sari", "Wijaya", "Nugroho", "Saputra"]
        npcs = [
            {"role": "best_friend", "name": _r.choice(first) + " " + _r.choice(last), "avatar": "😊"},
            {"role": "classmate", "name": _r.choice(first) + " " + _r.choice(last), "avatar": "🙂"},
            {"role": "classmate", "name": _r.choice(first) + " " + _r.choice(last), "avatar": "😎"},
            {"role": "homeroom_teacher", "name": "Bu " + _r.choice(first), "avatar": "👩‍🏫"},
            {"role": "parent", "name": "Ibu", "avatar": "👩"},
            {"role": "sibling", "name": "Adik", "avatar": "🧒"},
        ]
        cast = {"school": f"SMA Negeri 2 {city}", "class_group": f"Kelas XI-{_r.randint(1,9)}",
                "npcs": npcs}
        return {"cast": cast, "adapted": {}, "adapted_by": "mock"}

    sys_prompt = (
        "You generate the social world for a cybersecurity simulation game. "
        f"Character: {name}, {age} years old, {level} student in {city}. {context}\n"
        f"Write ALL names/texts in {lang_name}.\n\n"
        "Generate a JSON with:\n"
        '"cast": {\n'
        '  "school": "<realistic school name for this city/level>",\n'
        '  "class_group": "<class group name, local convention>",\n'
        '  "npcs": [\n'
        '    {"role": "best_friend", "name": "<local name>", "avatar": "😊"},\n'
        '    {"role": "classmate", "name": "<local name>", "avatar": "🙂"},\n'
        '    {"role": "classmate", "name": "<local name>", "avatar": "😎"},\n'
        '    {"role": "homeroom_teacher", "name": "<local name with title>", "avatar": "👩\u200d\U0001F3EB"},\n'
        '    {"role": "parent", "name": "<local title>", "avatar": "👩"},\n'
        '    {"role": "sibling", "name": "<local title>", "avatar": "\U0001F9D2"}\n'
        "  ]\n"
        "}\n"
        "Names must be culturally realistic for the character's city and age group "
        "(e.g. Indonesian names for Jakarta, Yoruba/Hausa/Igbo for Lagos, Mexican for CDMX). "
        "Return ONLY the JSON object."
    )
    try:
        cast = None
        for _try in range(2):
            out = get_llm().chat(system=sys_prompt,
                                 messages=[{"role": "user", "content": f"Generate the world for {name}."}],
                                 temperature=0.9, max_tokens=700)
            raw = out.strip()
            if raw.startswith("```"):
                raw = raw.split("```")[1]
                if raw.startswith("json"):
                    raw = raw[4:]
            try:
                cast = json.loads(raw)
                break
            except Exception:
                continue
        if cast is None:
            raise RuntimeError("LLM did not return valid JSON after 2 attempts")
        if "cast" in cast and isinstance(cast["cast"], dict):
            cast = cast["cast"]
        return {"cast": cast, "adapted": {}, "adapted_by": "ai"}
    except Exception as e:
        # NO generic fallback — client retries; 503 signals failure
        from fastapi import HTTPException
        raise HTTPException(status_code=503, detail=f"cast generation failed: {e}")


class ChapterRecapReq(BaseModel):
    lang: str = "id"
    profile: dict = {}
    chapter: int = 1
    counts: dict = {}
    log: list = []


@app.post("/api/chapter-recap")
def chapter_recap(req: ChapterRecapReq):
    """AI coach: chapter-level recap grounded in the run's behavior counts."""
    lang = req.lang if req.lang in ("id", "en", "es", "fr", "it", "de", "pt") else "id"
    lang_rule = {
        "id": "In Bahasa Indonesia (informal 'kamu'), 4-6 kalimat.",
        "en": "In English, 4-6 sentences.",
        "es": "In Spanish, 4-6 frases.",
        "fr": "En français, 4-6 phrases.",
        "it": "In italiano, 4-6 frasi.",
        "de": "Auf Deutsch, 4-6 Sätze.",
        "pt": "In Portuguese (Brazilian), 4-6 frases.",
    }[lang]
    cjk_lock = (" CRITICAL: write ONLY in the specified language. "
                "Never output Chinese/Japanese/Korean characters.")
    prompt = (
        "You are a warm cybersecurity coach reviewing a player who just finished "
        f"Chapter 1 (5 days) of a phone-simulation game. Player: {req.profile.get('name','player')} "
        f"({req.profile.get('archetype','general')} world, level {req.profile.get('level',1)}). "
        f"Behavior this run: {req.counts.get('verify',0)} verification habits "
        f"(checking sender details, verifying through official channels), "
        f"{req.counts.get('refuse',0)} refusals (declining/blocking suspicious asks), "
        f"{req.counts.get('risky',0)} risky actions (clicking shady links, sharing data/OTP). "
        "Write a recap that: (1) celebrates 1-2 strongest moments concretely, "
        "(2) names the single riskiest pattern and why it matters in real life, "
        "(3) gives ONE specific habit to practice next chapter. "
        f"{lang_rule} Warm, no shaming, plain text.{cjk_lock}"
    )
    llm = get_llm()
    try:
        text = llm.chat(system=prompt,
                        messages=[{"role": "user", "content": "Chapter recap, please."}],
                        temperature=0.5, max_tokens=900)
    except Exception:
        text = {
            "id": ("Lima hari, banyak keputusan. Kebiasaan memeriksa pengirim dan menolak "
                   "permintaan aneh adalah benteng terbaikmu. Bab depan: latih ragu lebih "
                   "cepat saat ada tekanan waktu."),
            "en": ("Five days, many decisions. Checking senders and refusing odd requests are "
                   "your best defenses. Next chapter: learn to doubt faster under time pressure."),
        }.get(lang, "Good run — keep verifying senders and refusing odd requests.")
    return {"coach": text}


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
        "es": "In Spanish, 4-6 sentences... Speak naturally to the user.",
        "fr": "En français, 4-6 phrases... Parlez naturellement à l'utilisateur.",
        "it": "In italiano, 4-6 frasi... Parla naturalmente all'utente.",
        "de": "Auf Deutsch, 4-6 Sätze... Sprich natürlich mit dem Nutzer.",
        "pt": "In Portuguese (Brazilian), 4-6 sentences... Speak naturally to the user.",
    }[lang if lang in ("id", "en", "es", "fr", "it", "de", "pt") else "id"]
    # hard language lock — reasoning models occasionally drift to CJK otherwise
    cjk_lock = (" CRITICAL: write ONLY in the language just specified. "
                "Never output Chinese/Japanese/Korean characters or English words "
                "when writing in another language.")
    prompt = (
        "You are a warm, concise cybersecurity coach. The user just finished a "
        f"simulation: '{m.scenario['title']}' and their outcome was: {summary['outcome']}. "
        f"Behavior: {summary['risky_actions']} risky actions, {summary['verifications']} "
        f"verifications, {summary['refusals']} refusals. "
        f"{lang_rule.replace('...', ' (1) one-line verdict, no shaming; ')}"
        "(2) the specific red flags they should have caught: " + "; ".join(flags[:3]) + ". "
        "(3) the safe action: " + m.scenario.get("safe_response", "") + " "
        "Plain text only." + cjk_lock
    )
    try:
        text = llm.chat(system=prompt, messages=[{"role": "user", "content": "Debrief, please."}],
                        temperature=0.4, max_tokens=900)
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
        "difficulty_level": d.level,
        "level_history": d.level_history,
    }


# serve frontend (single-file static app) — dev convenience
_frontend_dir = Path(__file__).resolve().parent.parent.parent / "frontend"
if _frontend_dir.is_dir():
    from fastapi.staticfiles import StaticFiles
    app.mount("/", StaticFiles(directory=str(_frontend_dir), html=True), name="frontend")
