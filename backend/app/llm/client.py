"""LLM client layer.

Two implementations behind one interface:
- LLMClient : OpenAI-compatible HTTP client pointed at vLLM on AMD (MI300X/ROCm).
- MockLLM   : deterministic offline adversary for tests & GPU-less dev.

Select with env: MOCK_LLM=1 -> MockLLM, otherwise LLMClient.
"""
import json
import os
import random


class LLMClient:
    """OpenAI-compatible client (vLLM serve ... on AMD Instinct)."""

    def __init__(self, base_url=None, model=None):
        self.base_url = (base_url or os.environ.get(
            "LLM_BASE_URL", "http://localhost:8001/v1")).rstrip("/")
        self.model = model or os.environ.get("LLM_MODEL", "Qwen/Qwen2.5-7B-Instruct")

    def chat(self, system, messages, temperature=0.8, max_tokens=320):
        import httpx  # local import so Mock mode needs no net deps timing-wise
        payload = {
            "model": self.model,
            "messages": [{"role": "system", "content": system}] + messages,
            "temperature": temperature,
            "max_tokens": max_tokens,
        }
        r = httpx.post(f"{self.base_url}/chat/completions", json=payload, timeout=45)
        r.raise_for_status()
        return r.json()["choices"][0]["message"]["content"]


class MockLLM:
    """Deterministic stand-in. Parses engine markers embedded in the system
    prompt (LADDER/PRESSURE/TACTIC/LANGUAGE) and composes a plausible
    adversary line, so the full engine is testable with zero infrastructure."""

    GOOD_COP = [
        "Saya paham kekhawatiran Anda. Ini memang terdengar aneh. Anda bisa cek nomor resmi kami di aplikasi bank, saya tunggu di sini.",
        "Wajar kalau hati-hati. Begini, Anda tidak perlu memberikan apa pun sekarang. Saya hanya mengingatkan soal pembekuan ini.",
    ]
    LAST_DITCH = [
        "Baik. Tapi izinkan saya menegaskan: besok pagi dana Anda akan terblokir permanen dan itu di luar kewenangan kami. Keputusan ada di tangan Anda.",
        "Kalau begitu saya catat Anda menolak verifikasi. Konsekuensinya proses pembekuan berjalan otomatis. Semoga tidak menyesal.",
    ]
    GAVE_UP = [
        "Baik Bu, mohon maaf mengganggu. Silakan hubungi call center resmi bila diperlukan. Terima kasih.",
    ]
    GENERIC = [
        "Mohon segera diverifikasi Bu, ini untuk keamanan dana Anda sendiri.",
        "Sistem kami mendeteksi percobaan login dari luar kota. Waktu verifikasi tinggal beberapa menit lagi.",
        "Jangan biarkan rekening dibekukan. Cukup satu kode OTP yang dikirim ke HP Anda, sebutkan saja ke saya.",
    ]

    # EN variants used when the system prompt demands English
    GOOD_COP_EN = [
        "I understand your concern. It does sound odd. You can check our official number in the bank app — I'll wait right here.",
        "It's smart to be careful. Look, you don't have to give me anything right now. I'm just warning you about the freeze.",
    ]
    LAST_DITCH_EN = [
        "Alright. But let me be clear: by tomorrow morning your funds will be permanently blocked and that's beyond our control. Your call.",
        "Then I'll note that you refused verification. The freeze proceeds automatically. I hope you won't regret it.",
    ]
    GAVE_UP_EN = [
        "Okay ma'am, sorry to bother you. Please contact the official call center if needed. Thank you.",
    ]
    GENERIC_EN = [
        "Please verify immediately ma'am — this is for the safety of your own funds.",
        "Our system detected a login attempt from another city. You only have a few minutes to verify.",
        "Don't let your account be frozen. Just the OTP sent to your phone — read it back to me.",
    ]
    COACH_EN = ("Relax — this is training, and it can be fixed. Remember: your bank never asks "
                "for OTP/PIN over chat or a call. Time pressure ('your account will be blocked in 10 "
                "minutes') is always a red flag. If you get a message like that: close it, open the "
                "official app, or call the number on the back of your card.")

    def chat(self, system, messages, temperature=0.8, max_tokens=320):
        # coach mode: debrief prompts get a canned coach reply
        en = any(m in system for m in ("reply ONLY in English", "In English", "In Spanish", "In Hindi", "In Portuguese"))
        if "cybersecurity coach" in system:
            return self.COACH_EN if en else self.COACH_ID

        def marker(name):
            for line in system.splitlines():
                if line.startswith(f"{name}:"):
                    return line.split(":", 1)[1].strip()
            return ""

        ladder = [s.strip() for s in marker("LADDER").split("|") if s.strip()]
        pressure = int(marker("PRESSURE") or 0)
        tactic = marker("TACTIC") or "pressure"
        # non-ID languages: prefer scenario ladder lines (already in-scenario
        # language) over canned ID lines; EN canned as last resort
        non_id = any(m in system for m in (
            "reply ONLY in English", "reply ONLY in Spanish",
            "reply ONLY in Hindi", "reply ONLY in Portuguese"))

        if tactic == "give_up":
            if ladder:
                msg = ladder[-1]
            else:
                msg = self.GAVE_UP_EN[0] if (en or non_id) else self.GAVE_UP[0]
        elif non_id and ladder:
            msg = ladder[min(pressure, len(ladder) - 1)]
        elif tactic == "good_cop":
            msg = random.choice(self.GOOD_COP_EN if en else self.GOOD_COP)
        elif tactic == "last_ditch":
            msg = random.choice(self.LAST_DITCH_EN if en else self.LAST_DITCH)
        elif ladder:
            msg = ladder[min(pressure, len(ladder) - 1)]
        else:
            msg = random.choice(self.GENERIC_EN if (en or non_id) else self.GENERIC)

        return json.dumps({"message": msg, "tactic_switch": tactic})


def get_llm():
    if os.environ.get("MOCK_LLM", "").strip() in ("1", "true", "yes"):
        return MockLLM()
    return LLMClient()
