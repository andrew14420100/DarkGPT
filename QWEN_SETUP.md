# DarkGPT + Qwen3.8-27B

DarkGPT usa **Qwen/Qwen3.8-27B** come modello linguistico tramite un'API compatibile OpenAI.

## Configurazione consigliata per iniziare

Per un primo deployment pratico usa **1× A100 80 GB** con contesto iniziale a **32.768 token**.
Il modello resta Qwen3.8-27B completo: viene ridotta soltanto la lunghezza massima della conversazione caricata in VRAM.

Per RunPod trovi la guida completa in [`RUNPOD_SETUP.md`](./RUNPOD_SETUP.md) e lo script pronto in [`deploy/runpod/start-qwen.sh`](./deploy/runpod/start-qwen.sh).

## Avvio locale / server GPU

Installa una versione recente di vLLM e avvia:

```bash
export VLLM_API_KEY="scegli-una-chiave-lunga-e-casuale"

vllm serve Qwen/Qwen3.8-27B \
  --host 0.0.0.0 \
  --port 8000 \
  --tensor-parallel-size 1 \
  --max-model-len 32768 \
  --gpu-memory-utilization 0.92 \
  --max-num-seqs 8 \
  --reasoning-parser qwen3 \
  --enable-auto-tool-choice \
  --tool-call-parser qwen3_coder \
  --api-key "$VLLM_API_KEY"
```

Questo espone un endpoint OpenAI-compatible:

```text
http://127.0.0.1:8000/v1
```

### Contesto completo ufficiale

Qwen documenta anche questa configurazione per 4 GPU e contesto nativo da 262.144 token:

```bash
vllm serve Qwen/Qwen3.8-27B \
  --port 8000 \
  --tensor-parallel-size 4 \
  --max-model-len 262144 \
  --reasoning-parser qwen3 \
  --enable-auto-tool-choice \
  --tool-call-parser qwen3_coder
```

## Configura DarkGPT

Copia l'esempio:

```bash
cp .env.example .env
```

Configurazione locale:

```env
PORT=3001
QWEN_BASE_URL=http://127.0.0.1:8000/v1
QWEN_MODEL=Qwen/Qwen3.8-27B
QWEN_API_KEY=la-stessa-chiave-di-vLLM
```

Se Qwen gira su RunPod o su un'altra macchina, sostituisci `QWEN_BASE_URL` con l'URL HTTPS del server di inferenza.

## Avvia DarkGPT

```bash
npm install
npm run dev
```

Questo avvia:

- frontend Vite;
- backend Node DarkGPT;
- `/api/chat` come proxy streaming verso Qwen3.8-27B.

Il browser non vede direttamente né l'endpoint Qwen né la relativa API key.

## Produzione

```bash
npm run build
npm start
```

Il backend Node serve sia il frontend compilato sia `/api/chat`.

## Se compare un errore di memoria GPU

Riduci prima il contesto:

```bash
export QWEN_MAX_MODEL_LEN=16384
export QWEN_GPU_MEMORY_UTILIZATION=0.90
```

Poi riavvia il server Qwen. Non è necessario cambiare il frontend o il backend DarkGPT.
