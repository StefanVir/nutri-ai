import OpenAI from 'openai';
import fs from 'fs';

const envContent = fs.readFileSync('.env.local', 'utf8');
const match = envContent.match(/NVIDIA_NIM_API_KEY=(.*)/);
const apiKey = match ? match[1].trim() : process.env.NVIDIA_NIM_API_KEY;

const NVIDIA_BASE_URL = 'https://integrate.api.nvidia.com/v1';

const client = new OpenAI({
  apiKey,
  baseURL: NVIDIA_BASE_URL,
});

async function testFastModel(model) {
  const start = Date.now();
  console.log(`Testing model: ${model}...`);
  try {
    const res = await client.chat.completions.create({
      model,
      messages: [
        { role: 'system', content: 'Output JSON only: {"status": "ok", "message": "hello"}' },
        { role: 'user', content: 'Say hello in JSON' },
      ],
      temperature: 0.1,
      max_tokens: 100,
    });
    console.log(`✅ ${model} responded in ${Date.now() - start}ms:`, res.choices[0]?.message?.content);
  } catch (e) {
    console.error(`❌ ${model} error:`, e.message);
  }
}

async function run() {
  await testFastModel('meta/llama-3.1-8b-instruct');
  await testFastModel('meta/llama-3.3-70b-instruct');
  await testFastModel('meta/llama-3.1-70b-instruct');
}

run();
