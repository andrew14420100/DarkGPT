import fs from 'node:fs';
import path from 'node:path';
import readline from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';

const root = process.cwd();
const envPath = path.join(root, '.env');
const rl = readline.createInterface({ input, output });

console.log('\nDarkGPT local setup');
console.log('La chiave resta solo nel file .env locale e non viene salvata su GitHub.\n');

const apiKey = (await rl.question('Incolla la NUOVA Groq API key: ')).trim();

if (!apiKey || !apiKey.startsWith('gsk_')) {
  console.error('\nChiave non valida. Deve iniziare con gsk_.');
  rl.close();
  process.exit(1);
}

const env = [
  'PORT=3001',
  'GROQ_BASE_URL=https://api.groq.com/openai/v1',
  'GROQ_MODEL=qwen/qwen3.8-27b',
  `GROQ_API_KEY=${apiKey}`,
  '',
].join('\n');

fs.writeFileSync(envPath, env, { encoding: 'utf8', mode: 0o600 });
rl.close();

console.log('\n.env creato correttamente.');
console.log('Ora esegui: npm run dev\n');
