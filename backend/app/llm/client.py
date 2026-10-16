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
    """OpenAI-compatible client. Three deployment targets:

    1. vLLM on AMD Instinct (MI300X/ROCm) — the hackathon target (LLM_PROVIDER=amd).
    2. MiniMax API (LLM_PROVIDER=minimax) — cloud fallback for demos without GPU.
    3. Any OpenAI-compatible endpoint via LLM_BASE_URL/LLM_API_KEY/LLM_MODEL.

    API keys are read from environment (backend/.env), NEVER hardcoded.
    """

    PROVIDERS = {
        "amd": {
            "base_url": "http://localhost:8001/v1",
            "model": "Qwen/Qwen2.5-7B-Instruct",
            "key_env": None,  # local vLLM: no auth
        },
        "minimax": {
            "base_url": "https://api.minimax.io/v1",
            "model": "MiniMax-M2.7-highspeed",
            "key_env": "MINIMAX_API_KEY",
        },
        "amdradeon": {
            "base_url": "https://developer.amd.com.cn/radeon/api/v1",
            "model": "DeepSeek-V4.1-Flash",
            "key_env": "AMD_RAIDEN_API_KEY",
            # endpoint is slow + concurrency-limited: generous timeout, no retry storm
            "timeout": 60,
            "retries": 1,
            # same-family fallback when the primary GPU node 504s upstream
            "fallback_models": ["DeepSeek-V4-Flash"],
        },
        "tokenrouter": {
            "base_url": "https://api.tokenrouter.com/v1",
            "model": "MiniMax-M3",
            "key_env": "TOKENROUTER_API_KEY",
        },
    }

    def __init__(self, base_url=None, model=None):
        provider = os.environ.get("LLM_PROVIDER", "").strip().lower()
        conf = self.PROVIDERS.get(provider, {})
        self.base_url = (base_url or os.environ.get("LLM_BASE_URL") or
                         conf.get("base_url", "http://localhost:8001/v1")).rstrip("/")
        self.model = model or os.environ.get("LLM_MODEL") or conf.get(
            "model", "Qwen/Qwen2.5-7B-Instruct")
        key_env = conf.get("key_env")
        api_key = os.environ.get("LLM_API_KEY") or (
            os.environ.get(key_env, "") if key_env else "")
        self.headers = {"Authorization": f"Bearer {api_key}"} if api_key else {}
        # provider tuning: slow/concurrency-limited endpoints need longer timeouts
        self.timeout = int(conf.get("timeout", 60))
        self.retries = int(conf.get("retries", 1))
        self.fallback_models = conf.get("fallback_models", [])

    # scripts that must never appear in output (leak guard for reasoning models)
    import re as _re
    _FOREIGN = _re.compile(r"[\u0400-\u04FF\u4E00-\u9FFF\u3040-\u30FF\uAC00-\uD7AF]")

    def chat(self, system, messages, temperature=0.8, max_tokens=700):
        try:
            content = self._chat_once(system, messages, temperature, max_tokens)
        except Exception:
            # primary model/node unavailable → try same-family fallbacks
            content = None
            for fb in self.fallback_models:
                try:
                    content = self._chat_once(system, messages, temperature, max_tokens, model=fb)
                    break
                except Exception:
                    continue
            if content is None:
                raise
        # language-leak guard: reasoning models occasionally slip into
        # Cyrillic/CJK mid-sentence — retry once with an explicit correction
        if self._FOREIGN.search(content):
            fixed = self._chat_once(
                system,
                messages + [{"role": "user", "content":
                    "IMPORTANT: your previous reply contained Cyrillic or CJK characters. "
                    "Rewrite the ENTIRE reply strictly in the language required above. "
                    "No other scripts allowed."}],
                temperature, max_tokens)
            if not self._FOREIGN.search(fixed):
                return fixed
            # second chance failed → drop offending sentences
            import re
            parts = re.split(r"(?<=[.!?])\s+", content)
            clean = " ".join(p for p in parts if not self._FOREIGN.search(p)).strip()
            if clean:
                return clean
        return content

    def _chat_once(self, system, messages, temperature, max_tokens, model=None):
        import httpx  # local import so Mock mode needs no net deps timing-wise
        payload = {
            "model": model or self.model,
            "messages": [{"role": "system", "content": system}] + messages,
            "temperature": temperature,
            "max_tokens": max_tokens,
        }
        # retry on 429/5xx: concurrency-limited endpoints (AMD Radeon API)
        content = ""
        last_exc = None
        for attempt in range(max(1, self.retries)):
            try:
                r = httpx.post(f"{self.base_url}/chat/completions", json=payload,
                               headers=self.headers, timeout=self.timeout)
                if r.status_code in (429, 500, 502, 503, 504) and attempt < self.retries - 1:
                    import time
                    time.sleep(3 * (attempt + 1))
                    continue
                r.raise_for_status()
                content = r.json()["choices"][0]["message"]["content"] or ""
                break
            except (httpx.ReadTimeout, httpx.ConnectError) as e:
                last_exc = e
                if attempt < self.retries - 1:
                    continue
                raise
        else:
            if last_exc:
                raise last_exc
        # reasoning models (MiniMax M-series) inline <think>...</think>.
        # If the budget cut the reply inside <think>, take the LAST usable
        # sentence-like fragment instead of returning the raw reasoning.
        if "<think>" in content:
            after = content.split("</think>", 1)[-1].strip()
            if after:
                content = after
            else:
                # unclosed <think>: salvage tail of reasoning (often the drafted reply)
                tail = content.split("<think>", 1)[-1]
                tail = tail.strip().strip("-").strip()
                sentences = [s.strip() for s in tail.replace("\n", " ").split(". ") if len(s.strip()) > 20]
                content = sentences[-1] + ("." if sentences and not sentences[-1].endswith(".") else "")
        return content.strip()


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

    def chat(self, system, messages, temperature=0.8, max_tokens=700):
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
