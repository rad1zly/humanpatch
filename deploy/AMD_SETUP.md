# AMD deployment notes

## Serving the LLM (AMD Developer Cloud, Instinct MI300X)

1. Create an instance on AMD Developer Cloud (MI300X, ROCm image, e.g. `Ubuntu 22 + ROCm 6.x`).
2. Install vLLM (preinstalled on recent ROCm images, otherwise):

```bash
pip install vllm --extra-index-url https://repo.radeon.com/simple
```

3. Serve the open-weight adversary/coach model:

```bash
vllm serve Qwen/Qwen2.5-7B-Instruct \
  --host 0.0.0.0 --port 8001 \
  --max-model-len 4096
```

4. Point HumanPatch at it:

```bash
export LLM_BASE_URL=http://<instance-ip>:8001/v1
export LLM_MODEL=Qwen/Qwen2.5-7B-Instruct
unset MOCK_LLM   # make sure mock mode is OFF
uvicorn app.main:app --host 0.0.0.0 --port 8000
```

## Verification

- `/api/health` returns `{"ok": true, "mock_llm": false}` when wired to the GPU endpoint.
- Every adversary reply in the demo is a live inference; show `pressure/tactic/suspicion`
  HUD (exposed in the API response) as proof the engine - not a script - is steering.

## Cost note (for judges)

One mission ≈ 6-10 LLM calls × ~400 tokens ≈ **< $0.01 per user mission** on
self-hosted MI300X - the marginal cost of patching one human is near zero.

## Optional: LoRA fine-tune (stretch)

Fine-tune adversary style on localized scam dialogue data:

```bash
pip install peft datasets
# see scripts/ (roadmap) - Unsloth or peft LoRA on the same instance
```
