import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import fs from 'node:fs';

const app = express();
const PORT = Number(process.env.PORT || 3001);
const QWEN_BASE_URL = (process.env.QWEN_BASE_URL || 'http://127.0.0.1:8000/v1').replace(/\/$/, '');
const QWEN_MODEL = process.env.QWEN_MODEL || 'Qwen/Qwen3.8-27B';
const QWEN_API_KEY = process.env.QWEN_API_KEY || '';
const SYSTEM_PROMPT = process.env.DARKGPT_SYSTEM_PROMPT || [
  'You are DarkGPT, a capable general-purpose AI assistant powered by Qwen3.8-27B.',
  'Reply in the same language as the user unless they ask otherwise.',
  'Be accurate, clear, useful, and transparent about uncertainty.',
  'Do not claim to have used tools, files, websites, or external data unless that information was actually supplied to you.',
].join(' ');

app.disable('x-powered-by');
app.use(cors());
app.use(express.json({ limit: '2mb' }));

function normalizeMessages(messages) {
  if (!Array.isArray(messages)) return [];
  return messages
    .filter((message) => message && (message.role === 'user' || message.role === 'assistant') && typeof message.content === 'string')
    .map((message) => ({ role: message.role, content: message.content.trim() }))
    .filter((message) => message.content)
    .slice(-80);
}

app.post('/api/chat', async (req, res) => {
  const messages = normalizeMessages(req.body?.messages);
  if (!messages.length) {
    return res.status(400).json({ error: 'messages must contain at least one user message' });
  }

  const headers = { 'Content-Type': 'application/json' };
  if (QWEN_API_KEY) headers.Authorization = `Bearer ${QWEN_API_KEY}`;

  try {
    const upstream = await fetch(`${QWEN_BASE_URL}/chat/completions`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        model: QWEN_MODEL,
        messages: [{ role: 'system', content: SYSTEM_PROMPT }, ...messages],
        stream: true,
        temperature: 0.7,
        top_p: 0.8,
      }),
    });

    if (!upstream.ok || !upstream.body) {
      const details = await upstream.text().catch(() => '');
      console.error('Qwen upstream error:', upstream.status, details);
      return res.status(502).json({
        error: 'Qwen server unavailable',
        status: upstream.status,
      });
    }

    res.status(200);
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.setHeader('Cache-Control', 'no-cache, no-transform');
    res.setHeader('X-Accel-Buffering', 'no');

    const reader = upstream.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';

    const consume = (text) => {
      buffer += text;
      const lines = buffer.split('\n');
      buffer = lines.pop() || '';

      for (const rawLine of lines) {
        const line = rawLine.trim();
        if (!line.startsWith('data:')) continue;
        const payload = line.slice(5).trim();
        if (!payload || payload === '[DONE]') continue;

        try {
          const parsed = JSON.parse(payload);
          const token = parsed?.choices?.[0]?.delta?.content;
          if (typeof token === 'string' && token) res.write(token);
        } catch {
          // Ignore malformed/incomplete SSE events and continue the stream.
        }
      }
    };

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      consume(decoder.decode(value, { stream: true }));
    }
    consume(decoder.decode());
    res.end();
  } catch (error) {
    console.error('DarkGPT backend error:', error);
    if (!res.headersSent) {
      res.status(502).json({ error: 'Unable to reach Qwen3.8-27B' });
    } else {
      res.end();
    }
  }
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distPath = path.resolve(__dirname, '../dist');

if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api/')) return next();
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`DarkGPT backend listening on http://localhost:${PORT}`);
  console.log(`Qwen endpoint: ${QWEN_BASE_URL}`);
  console.log(`Model: ${QWEN_MODEL}`);
});
