# DarkGPT + Qwen3.8-27B su RunPod

Questa configurazione usa **1× NVIDIA A100 80 GB** per avviare Qwen3.8-27B con vLLM.
Il modello resta `Qwen/Qwen3.8-27B`; per contenere l'uso di VRAM il contesto iniziale è impostato a **32.768 token** invece dei 262.144 token massimi supportati dal modello.

## 1. Crea il Pod

Configurazione consigliata:

- GPU: `NVIDIA A100 80GB PCIe` oppure `A100 SXM 80GB`
- GPU count: `1`
- Volume persistente: almeno `120 GB`
- Mount: `/workspace`
- Porta HTTP esposta: `8000/http`
- Immagine: una recente immagine RunPod PyTorch/CUDA compatibile con vLLM

Un volume persistente evita di dover riscaricare ogni volta i pesi del modello.

## 2. Entra nel Pod

Clona DarkGPT:

```bash
git clone https://github.com/andrew14420100/DarkGPT.git
cd DarkGPT
chmod +x deploy/runpod/start-qwen.sh
```

Genera una chiave lunga e casuale. Esempio:

```bash
export VLLM_API_KEY="sostituisci-con-una-chiave-lunga-e-casuale"
```

Avvia il modello:

```bash
./deploy/runpod/start-qwen.sh
```

La prima esecuzione scaricherà i pesi di `Qwen/Qwen3.8-27B`.

## 3. Endpoint RunPod

Con la porta `8000/http` esposta, RunPod rende disponibile il server con un URL simile a:

```text
https://<POD_ID>-8000.proxy.runpod.net/v1
```

Verifica il server:

```bash
curl https://<POD_ID>-8000.proxy.runpod.net/v1/models \
  -H "Authorization: Bearer $VLLM_API_KEY"
```

## 4. Collega DarkGPT

Nel server dove esegui il backend DarkGPT crea `.env`:

```env
PORT=3001
QWEN_BASE_URL=https://<POD_ID>-8000.proxy.runpod.net/v1
QWEN_MODEL=Qwen/Qwen3.8-27B
QWEN_API_KEY=la-stessa-chiave-impostata-in-VLLM_API_KEY
```

Poi:

```bash
npm install
npm run build
npm start
```

Il browser chiama soltanto `/api/chat`; la chiave di Qwen resta nel backend.

## 5. Se la GPU va in OOM

Riduci il contesto prima di cambiare modello:

```bash
export QWEN_MAX_MODEL_LEN=16384
export QWEN_GPU_MEMORY_UTILIZATION=0.90
./deploy/runpod/start-qwen.sh
```

## 6. Passare in futuro a più GPU

L'esempio ufficiale Qwen usa 4 GPU per il contesto completo da 262.144 token. Quando vorrai aumentare il contesto, potrai passare a più GPU e aumentare `--tensor-parallel-size` e `--max-model-len` senza cambiare il frontend DarkGPT.
