"""Scenario registry. Scenarios are SPECS, not scripts: they define the
attacker's goal, context, red flags and an escalation ladder -- the LLM
improvises inside those bounds, so every playthrough differs."""
import json
import os
from pathlib import Path

SCENARIO_DIR = Path(__file__).resolve().parent.parent / "data" / "scenarios"
_CACHE = {}


def load_scenarios() -> dict:
    if not _CACHE:
        for p in sorted(SCENARIO_DIR.glob("*.json")):
            with open(p, encoding="utf-8") as f:
                spec = json.load(f)
            _CACHE[spec["id"]] = spec
    return _CACHE


def get_scenario(scenario_id: str) -> dict:
    return load_scenarios()[scenario_id]


def scenarios_for_persona(persona: dict) -> list:
    """Order scenarios by persona tag match (matching first, rest after)."""
    tags = set(persona.get("tags", []))
    all_scenarios = list(load_scenarios().values())
    matched = [s for s in all_scenarios if tags & set(s.get("persona_tags", []))]
    rest = [s for s in all_scenarios if s not in matched]
    return matched + rest


DOMAINS = {
    "phishing_social": "Phishing & Social Engineering",
    "credentials": "Passwords & Login Hygiene",
    "mobile": "Mobile & App Safety",
    "privacy": "Privacy & Data Handling",
    "browsing": "Browsing & Network",
    "reporting": "Incident Reporting",
}
