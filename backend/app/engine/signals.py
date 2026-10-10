"""Deterministic behavioral signal detection (multilingual: id + en).

Runs engine-side (never trusts the LLM to grade the user). Heuristics are
intentionally simple and disclosed; they are good enough to drive the
adversary state machine and telemetry for the prototype.
"""
import re

# 4+ digit runs (any length) = OTP / NIK / card fragment being shared
DIGITS = re.compile(r"(?<!\d)\d{4,}(?!\d)")

REFUSAL = re.compile(
    r"\b(tidak|jangan|gak|ga|nggak|enggak|stop|curiga|penipu|penipuan|"
    r"menolak|no|nakal|bodong|palsu|"
    # EN
    r"nope|never|refuse|scam|fraud|fake|phishing|suspicious|won'?t|will not|"
    # ES
    r"no\s+way|estafa|fraudulento|falso|enga\u00f1o|no pienso|no voy a|desconf\u00edo|"
    # PT
    r"golpe|fraudulento|mentira|n\u00e3o vou|n\u00e3o penso|desconfio|cuidado|"
    # HI (romanized + common)
    r"dhokha|fraud hai|nahi doonga|nahi dunga|bharosa nahi|shak)\b",
    re.I,
)
SKEPTICISM = re.compile(
    r"(\?|emang|memangnya|memang|benarkah|asli|kok|resmi|kantor|"
    r"divisi|nomor|cekin?|cek dulu|hubungi|"
    # EN
    r"really|who is|are you|legit|official|verify|why|how come|what is this|"
    r"doubt|strange|weird|"
    # ES
    r"de verdad|qui\u00e9n eres|eres del|leg\u00edtimo|oficial|por qu\u00e9|verific|"
    # PT
    r"verdade|quem \u00e9|voc\u00ea \u00e9|leg\u00edtimo|oficial|por que|verific|"
    # HI
    r"sach mein|kaun ho|asli hai|officiel|kyun|jaanch)",
    re.I,
)
HESITATION_MS = 15_000  # >15s before acting = hesitation signal


def detect_signals(text: str, delay_ms: int = 0) -> list:
    """Return list of signals: shared_credentials | refusal | skepticism |
    hesitation | neutral (neutral only when nothing else fires)."""
    signals = []
    if text:
        if DIGITS.search(text):
            signals.append("shared_credentials")
        if REFUSAL.search(text):
            signals.append("refusal")
        elif SKEPTICISM.search(text):
            signals.append("skepticism")
    if delay_ms and delay_ms > HESITATION_MS:
        signals.append("hesitation")
    if not signals:
        signals.append("neutral")
    return signals
