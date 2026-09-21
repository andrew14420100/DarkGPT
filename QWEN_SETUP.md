# DarkGPT + Qwen3.8-27B

DarkGPT uses **Qwen/Qwen3.8-27B** as its language model through an OpenAI-compatible local API.

## 1. Start Qwen3.8-27B

The official Qwen repository documents vLLM as an OpenAI-compatible server. Example:

```bash
vllm serve Qwen/Qwen3.8-27B \
  --port 8000 \
  --tensor-parallel-size 4 \
  --max-model-len 262144 \
  --reasoning-parser qwen3 \
  --enable-auto-tool-choice \
  --tool-call-parser qwen3_coder
```

This exposes:

```text
http://127.0.0.1:8000/v1
```

`--tensor-parallel-size` must match the GPU setup you actually use. If the available VRAM is lower, reduce the maximum context length or use a supported quantized deployment.

## 2. Configure DarkGPT

Copy the example environment file:

```bash
cp .env.example .env
```

Default configuration:

```env
PORT=3001
QWEN_BASE_URL=http://127.0.0.1:8000/v1
QWEN_MODEL=Qwen/Qwen3.8-27B
QWEN_API_KEY=
```

If Qwen runs on another machine, replace `QWEN_BASE_URL` with the private URL of that inference server.

## 3. Start DarkGPT

```bash
npm install
npm run dev
```

This starts:

- Vite frontend
- DarkGPT Node backend
- `/api/chat` streaming proxy to Qwen3.8-27B

The browser never needs direct access to the Qwen inference endpoint.

## Production

Build the frontend:

```bash
npm run build
```

Then run:

```bash
npm start
```

The Node backend serves the compiled frontend and `/api/chat` from the same application.
