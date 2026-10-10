"""Telemetry: behavioral events -> KAB domain scores -> patch level.

Success metrics (measured behavior, NOT module completion):
- % of actions preceded by verification (asking sender identity, checking URL)
- risky-action rate drop between first exposure and retest (different skin)
- correct incident-reporting choices in domain `reporting`
"""
from collections import defaultdict


class Telemetry:
    def __init__(self, domain: str):
        self.domain = domain
        self.events = []

    def track(self, event: str, meta: dict | None = None):
        self.events.append({"t": len(self.events), "event": event, **(meta or {})})

    # ---------------------------------------------------------------- scoring
    def behavior_score(self) -> dict:
        """Heuristic KAB behavior score for this mission run."""
        risky = sum(1 for e in self.events if e["event"] in (
            "shared_credentials", "risky_click", "risky_install", "risky_submit"))
        verifies = sum(1 for e in self.events if e["event"] in (
            "verified_sender", "checked_url", "asked_identity", "skepticism"))
        refusals = sum(1 for e in self.events if e["event"] == "refusal")
        reports = sum(1 for e in self.events if e["event"] == "reported")

        total = len([e for e in self.events if e["event"] != "mission_start"])
        score = 50
        if total:
            score = 50 + 18 * verifies + 25 * refusals + 30 * reports - 35 * risky
            score = max(0, min(100, int(score)))
        return {
            "domain": self.domain,
            "score": score,
            "risky_actions": risky,
            "verifications": verifies,
            "refusals": refusals,
            "reports": reports,
            "events_total": total,
        }


RANKS = [
    (0, "TARGET MUDAH"),      # easy target
    (40, "WASPADA"),          # alert
    (70, "HARD TARGET"),      # hard target
    (90, "PATCHED"),          # resilient
]


def patch_level(scores: list[int]) -> str:
    avg = sum(scores) / len(scores) if scores else 0
    for threshold, name in reversed(RANKS):
        if avg >= threshold:
            return name
    return RANKS[0][1]
