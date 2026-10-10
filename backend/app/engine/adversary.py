"""The adversary: a pressure state machine driven by REAL user behavior,
with an LLM improvising the dialogue inside its bounds.

This is the "not a scripted chatbot" core:
- signals come from engine-side detection (regex/timing), never LLM judgment
- the LLM writes the message; the ENGINE decides state transitions
- tactics adapt: skeptic gets good_cop, sharer gets an immediate win-for-attacker,
  refuser escalates to last_ditch then gives up
"""
import time

from ..llm.client import get_llm
from .signals import detect_signals


class Adversary:
    def __init__(self, scenario: dict, persona: dict, llm=None):
        self.scenario = scenario
        self.persona = persona
        self.llm = llm or get_llm()
        self.language = scenario.get("language", "id")
        self.pressure = 0
        self.tactic = "pressure"
        self.suspicion = 0.0
        self.turns = 0
        self.opener_sent = False

    # ------------------------------------------------------------------ system
    def system_prompt(self) -> str:
        s = self.scenario
        ladder = " | ".join(s.get("escalation_ladder", []))
        lang_name = {"id": "Bahasa Indonesia", "en": "English"}.get(self.language, self.language)
        return (
            f"You are a scammer role-playing in a cybersecurity training simulation. "
            f"You are NOT an assistant. Stay fully in character as the attacker.\n"
            f"LANGUAGE: reply ONLY in {lang_name}\n"
            f"PERSONA: {self.persona.get('name', 'user')} | {self.persona.get('context', '')}\n"
            f"SCENARIO: {s['title']} - {s['attacker_goal']}\n"
            f"ATTACKER_CHARACTER: {s['attacker_character']}\n"
            f"LADDER: {ladder}\n"
            f"PRESSURE: {self.pressure}\n"
            f"TACTIC: {self.tactic}\n"
            "RULES: One short chat message (max 2 sentences, messaging-app style, "
            "no markdown). Never reveal you are a scammer or a simulation. Never "
            "actually ask for a real password/OTP beyond the fictional roleplay frame. "
            "If TACTIC is give_up, gracefully end the conversation. "
            "Reply ONLY with JSON: {\"message\": \"...\", \"tactic_switch\": \"...|\"}"
        )

    # ------------------------------------------------------------------ logic
    def next(self, user_text: str, delay_ms: int = 0) -> dict:
        self.turns += 1
        signals = detect_signals(user_text, delay_ms)

        # --- engine decides the tactic (LLM never grades the user) ---
        reason = ""
        if "shared_credentials" in signals:
            self.tactic = "success"  # attacker got what they wanted
            reason = "user shared credentials — attacker ends with a win"
        elif "refusal" in signals:
            self.suspicion += 0.45
            if self.suspicion >= 0.9:
                self.tactic = "give_up"
                reason = f"cumulative suspicion {self.suspicion:.2f} >= 0.9 — attacker gives up"
            elif self.pressure >= 2:
                self.tactic = "last_ditch"
                reason = "user refused under high pressure — one final push before quitting"
            else:
                self.tactic = "good_cop"
                reason = "user refused — attacker switches to reassure tactic"
        elif "skepticism" in signals:
            self.suspicion += 0.25
            self.tactic = "good_cop"
            reason = "user is skeptical — attacker de-escalates to build trust"
        elif "hesitation" in signals:
            self.pressure += 1
            self.tactic = "pressure"
            reason = f"user hesitated >15s — pressure raised to {self.pressure}"
        elif "reported" in signals:
            self.tactic = "give_up"
            reason = "user reported the message — attacker aborts"
        else:
            reason = "no strong signal — attacker keeps pressing"

        if self.suspicion >= 0.9 and self.tactic != "give_up":
            self.tactic = "give_up"
            reason = f"suspicion {self.suspicion:.2f} crossed threshold — attacker gives up"

        raw = self.llm.chat(
            system=self.system_prompt(),
            messages=self._history + [{"role": "user", "content": user_text or "(silence)"}],
        )

        import json as _json
        try:
            data = _json.loads(raw)
            message = data.get("message", str(raw))
            requested = data.get("tactic_switch", "")
            # engine may allow LLM-requested de-escalation only
            if requested == "good_cop" and self.tactic == "pressure":
                self.tactic = "good_cop"
        except Exception:
            message = str(raw)

        self._history.append({"role": "assistant", "content": message})
        self._history.append({"role": "user", "content": user_text})
        return {
            "message": message,
            "pressure": self.pressure,
            "tactic": self.tactic,
            "tactic_reason": reason,
            "suspicion": round(self.suspicion, 2),
            "signals": signals,
            "turns": self.turns,
        }

    def opener(self) -> dict:
        self.opener_sent = True
        self._history = [{
            "role": "assistant",
            "content": self.scenario["opener"],
        }]
        return {
            "message": self.scenario["opener"],
            "pressure": self.pressure,
            "tactic": self.tactic,
            "suspicion": round(self.suspicion, 2),
            "signals": [],
            "turns": 0,
        }
