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
        "verify_source": {"id": "Verifikasi sumber lewat jalur independen", "en": "Verify the source via an independent channel",
                          "es": "Verificar la fuente por un canal independiente", "hi": "स्वतंत्र चैनल से स्रोत सत्यापित करें", "pt": "Verificar a fonte por um canal independente"},
        "under_pressure": {"id": "Tetap verifikasi saat ada tekanan waktu", "en": "Still verify when under time pressure",
                           "es": "Seguir verificando bajo presión de tiempo", "hi": "समय-दबाव में भी सत्यापन करें", "pt": "Continuar verificando sob pressão de tempo"},
        "protect_data": {"id": "Tidak menyerahkan data sensitif", "en": "Do not hand over sensitive data",
                         "es": "No entregar datos sensibles", "hi": "संवेदनशील डेटा न दें", "pt": "Não entregar dados sensíveis"},
        "report_threat": {"id": "Melapor / menghentikan kontak", "en": "Report / stop contact",
                          "es": "Denunciar / detener el contacto", "hi": "रिपोर्ट करें / संपर्क रोकें", "pt": "Denunciar / interromper o contato"},
    }
    STATUS_VALUES = {
        "id": {"ok": "Teramati", "no": "Belum teramati", "todo": "Perlu diuji"},
        "en": {"ok": "Observed", "no": "Not observed", "todo": "Needs testing"},
        "es": {"ok": "Observado", "no": "No observado", "todo": "Por probar"},
        "hi": {"ok": "देखा गया", "no": "नहीं देखा गया", "todo": "परखना है"},
        "pt": {"ok": "Observado", "no": "Não observado", "todo": "A testar"},
    }

    def _st(self, kind: str, lang: str) -> str:
        return self.STATUS_VALUES.get(lang, self.STATUS_VALUES["id"])[kind]

    def behavior_score(self, lang: str = "id") -> dict:
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
            "verify_source": self._st("ok" if verifies else "no", lang),
            "under_pressure": (self._st("ok", lang) if pressured and (verifies or refusals)
                               else self._st("todo", lang) if not pressured else self._st("no", lang)),
            "protect_data": self._st("ok" if not risky else "no", lang),
            "report_threat": self._st("ok" if reports else "no", lang),
        }
        # next-exercise recommendation: weakest observed behavior
        weakness_rank = ["verify_source", "protect_data", "under_pressure", "report_threat"]
        no_label = self.STATUS_VALUES.get(lang, self.STATUS_VALUES["id"])["no"]
        next_focus = None
        for w in weakness_rank:
            if indicators[w] == no_label:
                next_focus = {"indicator": w,
                              "label": self.INDICATORS[w].get(lang, self.INDICATORS[w]["id"])}
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
