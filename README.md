# HumanPatch

> **Security teams patch software every month. Nobody patches the human.**

HumanPatch is a generative-AI sparring partner that trains everyday people to withstand real cyber attacks - built for the [AMD Developer Hackathon: ACT III](https://lablab.ai/ai-hackathons/amd-developer-hackathon-act-iii), Track 4 (Create a New Kind of Experience).

An adaptive **AI adversary** attacks you in hyper-realistic simulations - WhatsApp chats, fake login pages, malicious app installs - across 7 security domains. It measures your **actual behavior** (not quiz answers), coaches you instantly, and raises your **patch level**.

## How it works

1. **Pick your life** - student, office worker, small business owner, senior. The AI adapts attacks to your world.
2. **Get attacked** - 2-3 minute missions. You don't know when you're being tested. Every tap, hesitation, and verification is telemetry.
3. **Meet your adversary** - a live LLM roleplay that adapts tone, escalates pressure when you hesitate, switches tactics when you resist. No two attacks are the same.
4. **Get patched** - an AI coach debriefs the red flags YOU missed, in 60 seconds.
5. **Retested differently** - the adversary remembers your weakness and attacks it again with a different skin.

## Architecture

```
frontend/  static mobile-first UI (WhatsApp-style chat, mission pages)
backend/   FastAPI mission engine
             engine/adversary.py   pressure state machine + LLM adversary
             engine/mission.py     mission lifecycle
             engine/telemetry.py   behavioral events -> KAB scores
             llm/                  OpenAI-compatible client (vLLM)
             data/scenarios/       scenario specs (JSON) + personas
deploy/    AMD setup notes (vLLM + ROCm on Instinct MI300X)
```

## The AMD part

The adversary and coach run on **AMD Radeon Open API** (`https://developer.amd.com.cn/radeon/api/v1`) serving **DeepSeek-V4-Flash** - an OpenAI-compatible endpoint on AMD hardware (the client also targets vLLM on **AMD Instinct MI300X** / ROCm for full self-hosting). Self-hostable inference = a government can deploy HumanPatch fully on-prem. Citizen data never leaves the country.

## Run locally (dev mode, no GPU needed)

```bash
cd backend
python3 -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
MOCK_LLM=1 uvicorn app.main:app --reload --port 8000
# then open frontend/index.html  (or serve it: python3 -m http.server 8080)
```

`MOCK_LLM=1` uses a deterministic scripted adversary so the engine is fully testable before the LLM endpoint exists.

## Run with the real LLM (AMD Radeon Open API)

```bash
cd backend
cp .env.example .env   # or create .env manually - NEVER commit it (gitignored)

# .env contents:
# LLM_PROVIDER=amdradeon
# LLM_MODEL=DeepSeek-V4-Flash
# AMD_RAIDEN_API_KEY=<your key from developer.amd.com.cn>

uvicorn app.main:app --port 8000
```

The client (`backend/app/llm/client.py`) is provider-aware with a fallback chain (`DeepSeek-V4.1-Flash` → `DeepSeek-V4-Flash`) and retries on 429/5xx, since the endpoint is concurrency-limited.

### Alternative: self-hosted vLLM on AMD Instinct (MI300X)

```bash
# on AMD Developer Cloud (MI300X):
vllm serve Qwen/Qwen2.5-7B-Instruct --port 8001

# locally:
export LLM_BASE_URL=http://<gpu-host>:8001/v1
export LLM_MODEL=Qwen/Qwen2.5-7B-Instruct
unset MOCK_LLM
uvicorn app.main:app --port 8000
```

## Tests

```bash
cd backend && python3 -m pytest tests/ -v
```

## Roadmap

- [x] Mission engine + adaptive adversary (chat missions)
- [x] Behavioral telemetry + KAB domain scoring
- [x] Persona-adaptive scenarios (senior / student / worker)
- [ ] Page-type missions (fake login URL, APK install) - frontend templates
- [ ] Cross-mission adversary memory + personalized retesting
- [ ] Policy heatmap (anonymized population view)
- [ ] LoRA fine-tune adversary on localized scam dialogues

## License

MIT
