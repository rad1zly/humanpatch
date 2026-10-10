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
    # 4 understandable indicators (per the concept doc) instead of one opaque score
    INDICATORS = {
        "verify_source": "Verifikasi sumber lewat jalur independen",
        "under_pressure": "Tetap verifikasi saat ada tekanan waktu",
        "protect_data": "Tidak menyerahkan data sensitif",
        "report_threat": "Melapor / menghentikan kontak",
    }

    def behavior_score(self) -> dict:
        """Heuristic KAB behavior score + transparent indicators for this run."""
        risky = sum(1 for e in self.events if e["event"] in (
            "shared_credentials", "risky_click", "risky_install", "risky_submit"))
        verifies = sum(1 for e in self.events if e["event"] in (
            "verified_sender", "checked_url", "asked_identity", "skepticism"))
        refusals = sum(1 for e in self.events if e["event"] == "refusal")
        reports = sum(1 for e in self.events if e["event"] == "reported")
        pressured = any(e["event"] == "hesitation" for e in self.events)

        total = len([e for e in self.events if e["event"] != "mission_start"])
        score = 50
        if total:
            score = 50 + 18 * verifies + 25 * refusals + 30 * reports - 35 * risky
            score = max(0, min(100, int(score)))

        indicators = {
            "verify_source": "Teramati" if verifies else ("Belum teramati"),
            "under_pressure": ("Teramati" if pressured and (verifies or refusals)
                               else "Perlu diuji" if not pressured else "Belum teramati"),
            "protect_data": "Teramati" if not risky else "Belum teramati",
            "report_threat": "Teramati" if reports else "Belum teramati",
        }
        # next-exercise recommendation: weakest observed behavior
        weakness_rank = ["verify_source", "protect_data", "under_pressure", "report_threat"]
        next_focus = None
        for w in weakness_rank:
            if indicators[w] == "Belum teramati":
                next_focus = {"indicator": w, "label": self.INDICATORS[w]}
                break

        return {
            "domain": self.domain,
            "score": score,
            "risky_actions": risky,
            "verifications": verifies,
            "refusals": refusals,
            "reports": reports,
            "events_total": total,
            "indicators": indicators,
            "next_exercise": next_focus,
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
