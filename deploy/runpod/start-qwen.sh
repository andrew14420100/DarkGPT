#!/usr/bin/env bash
set -euo pipefail

MODEL="${QWEN_MODEL:-Qwen/Qwen3.8-27B}"
PORT="${QWEN_PORT:-8000}"
MAX_MODEL_LEN="${QWEN_MAX_MODEL_LEN:-32768}"
GPU_MEMORY_UTILIZATION="${QWEN_GPU_MEMORY_UTILIZATION:-0.92}"
MAX_NUM_SEQS="${QWEN_MAX_NUM_SEQS:-8}"

if [[ -z "${VLLM_API_KEY:-}" ]]; then
  echo "Errore: imposta VLLM_API_KEY prima di avviare Qwen." >&2
  exit 1
fi

python -m pip install --upgrade pip
python -m pip install --upgrade vllm

exec vllm serve "$MODEL" \
  --host 0.0.0.0 \
  --port "$PORT" \
  --tensor-parallel-size 1 \
  --max-model-len "$MAX_MODEL_LEN" \
  --gpu-memory-utilization "$GPU_MEMORY_UTILIZATION" \
  --max-num-seqs "$MAX_NUM_SEQS" \
  --reasoning-parser qwen3 \
  --enable-auto-tool-choice \
  --tool-call-parser qwen3_coder \
  --api-key "$VLLM_API_KEY"
