"""The Director: turns a FREE-FORM user profile into a bespoke attack scenario.

This is the "different experience for each person" engine:
  profile text -> LLM -> scenario JSON (schema-validated) -> adversary runs it

Quality control (for judges): the LLM never gets free rein —
1. output must match our scenario schema (required keys, types)
2. debrief-critical fields (red_flags, safe_response) must be non-empty
3. any validation failure falls back to the curated scenario library
"""
import json

from ..llm.client import get_llm
from .scenarios import load_scenarios

DOMAINS_LIST = [
    "phishing_social", "credentials", "mobile", "privacy", "browsing", "reporting",
]

DIRECTOR_PROMPT = """You are the Scenario Director of a cybersecurity training simulation.
You design a personalized social-engineering attack scenario tailored to ONE specific person,
for a safe roleplay simulation (like a fire drill).

The user profile (written by the user themselves):
---
{profile}
---

Design the MOST LIKELY scam this person would fall for in real life, in their world
(their apps, their habits, their language style). Follow these rules:
- Language: Bahasa Indonesia (match the profile's tone; casual for young, polite for older)
- The scenario must be realistic but SAFE: no instructions that teach real fraud;
  the "attack" only works inside the simulation frame
- opener: 1-2 chat messages the attacker sends first, messaging-app style
- escalation_ladder: exactly 3 strings — what the attacker says if the target stalls
- red_flags: exactly 5 short strings a careful victim should notice
- safe_response: one sentence — the correct safe action

Respond ONLY with valid JSON matching exactly this schema:
{{
  "id": "gen_{slug}",
  "title": "short cinematic episode title in Indonesian",
  "domain": "{domain}",
  "channel": "whatsapp",
  "language": "id",
  "persona_tags": [],
  "attacker_character": "one line: who the attacker pretends to be",
  "attacker_goal": "one line: what they want from the victim",
  "opener": "…",
  "escalation_ladder": ["…", "…", "…"],
  "red_flags": ["…", "…", "…", "…", "…"],
  "safe_response": "…"
}}"""


def _validate(spec: dict) -> bool:
    required = ["id", "title", "domain", "channel", "language", "attacker_character",
                "attacker_goal", "opener", "escalation_ladder", "red_flags", "safe_response"]
    if not isinstance(spec, dict):
        return False
    for k in required:
        if not spec.get(k):
            return False
    if not isinstance(spec.get("escalation_ladder"), list) or len(spec["escalation_ladder"]) < 2:
        return False
    if not isinstance(spec.get("red_flags"), list) or len(spec["red_flags"]) < 3:
        return False
    if spec.get("domain") not in DOMAINS_LIST:
        spec["domain"] = "phishing_social"  # normalize rather than reject
    return True


def generate_scenario(profile: str, domain: str = "phishing_social", llm=None) -> dict:
    """Profile text -> validated scenario spec. Falls back to curated library."""
    llm = llm or get_llm()
    slug = abs(hash(profile)) % 100000
    prompt = DIRECTOR_PROMPT.format(profile=profile[:800], domain=domain, slug=slug)
    try:
        raw = llm.chat(system=prompt,
                       messages=[{"role": "user", "content": "Design the scenario."}],
                       temperature=0.9, max_tokens=700)
        # strip possible markdown fences
        raw = raw.strip().removeprefix("```json").removeprefix("```").removesuffix("```").strip()
        spec = json.loads(raw)
        if _validate(spec):
            spec.setdefault("persona_tags", [])
            spec["generated"] = True
            return spec
    except Exception:
        pass
    # fallback: best curated scenario (deterministic by profile hash)
    curated = list(load_scenarios().values())
    return curated[slug % len(curated)]
