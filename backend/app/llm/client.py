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

    def chat(self, system, messages, temperature=0.8, max_tokens=320):
        # coach mode: debrief prompts get a canned coach reply
        if "cybersecurity coach" in system:
            return ("Baik, santai — ini latihan, dan hasilnya bisa dibenerin. "
                    "Yang perlu kamu ingat: pihak bank tidak pernah meminta OTP/PIN "
                    "lewat chat atau telepon. Tekanan waktu ('rekening terblokir 10 menit') "
                    "selalu jadi tanda bahaya. Kalau dapat chat macam gini: tutup, buka "
                    "aplikasi resmi, atau hubungi call center di belakang kartu kamu.")

        def marker(name):
            for line in system.splitlines():
                if line.startswith(f"{name}:"):
                    return line.split(":", 1)[1].strip()
            return ""

        ladder = [s.strip() for s in marker("LADDER").split("|") if s.strip()]
        pressure = int(marker("PRESSURE") or 0)
        tactic = marker("TACTIC") or "pressure"

        if tactic == "good_cop":
            msg = random.choice(self.GOOD_COP)
        elif tactic == "last_ditch":
            msg = random.choice(self.LAST_DITCH)
        elif tactic == "give_up":
            msg = self.GAVE_UP[0]
        elif ladder:
            msg = ladder[min(pressure, len(ladder) - 1)]
        else:
            msg = random.choice(self.GENERIC)

        return json.dumps({"message": msg, "tactic_switch": tactic})


def get_llm():
    if os.environ.get("MOCK_LLM", "").strip() in ("1", "true", "yes"):
        return MockLLM()
    return LLMClient()
