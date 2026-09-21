# DarkGPT + Qwen3.8-27B

DarkGPT usa **Qwen3.8-27B** come modello linguistico tramite l'API OpenAI-compatible di **Groq**.

Questa è la configurazione predefinita perché non richiede di noleggiare una GPU. Groq applica i limiti del proprio free tier, quindi l'uso gratuito non è illimitato.

## 1. Crea una Groq API key

Crea una chiave nel tuo account Groq e non inserirla mai nel frontend o nei file GitHub.

## 2. Configura DarkGPT

Copia l'esempio:

```bash
cp .env.example .env
```

Configurazione:

```env
PORT=3001
GROQ_BASE_URL=https://api.groq.com/openai/v1
GROQ_MODEL=qwen/qwen3.8-27b
GROQ_API_KEY=la-tua-chiave-groq
```

Il backend Node usa l'endpoint `/chat/completions` e inoltra la risposta a DarkGPT in streaming. La API key resta soltanto sul server.

## 3. Avvia DarkGPT

```bash
npm install
npm run dev
```

Questo avvia:

- frontend Vite;
- backend Node DarkGPT;
- `/api/chat` come proxy streaming verso Groq;
- Qwen3.8-27B come modello di risposta.

## Produzione

```bash
npm run build
npm start
```

Il backend Node serve sia il frontend compilato sia `/api/chat`.

## Railway

Nel servizio Railway configura queste variabili:

```env
GROQ_BASE_URL=https://api.groq.com/openai/v1
GROQ_MODEL=qwen/qwen3.8-27b
GROQ_API_KEY=la-tua-chiave-groq
```

Non salvare `GROQ_API_KEY` nella repository.

## Provider self-hosted opzionale

Il backend mantiene compatibilità anche con le vecchie variabili `QWEN_BASE_URL`, `QWEN_MODEL` e `QWEN_API_KEY`. Se in futuro vorrai tornare a vLLM/RunPod o a un server locale, non sarà necessario riscrivere il frontend.
