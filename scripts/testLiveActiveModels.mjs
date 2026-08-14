import OpenAI from 'openai';
import fs from 'fs';

const envContent = fs.readFileSync('.env.local', 'utf8');
const match = envContent.match(/NVIDIA_NIM_API_KEY=(.*)/);
const apiKey = match ? match[1].trim() : process.env.NVIDIA_NIM_API_KEY;

const client = new OpenAI({
  apiKey,
  baseURL: 'https://integrate.api.nvidia.com/v1',
});

async function findLiveActiveModels() {
  const list = await client.models.list();
  const allModels = list.data.map(m => m.id);
  console.log(`Testing ${allModels.length} models for live HTTP 200 response...\n`);

  const liveModels = [];

  for (const model of allModels) {
    // Skip embedding / vision / detector models for text generation testing
    if (model.includes('embed') || model.includes('detector') || model.includes('safety') || model.includes('guard') || model.includes('clip') || model.includes('parse')) {
      continue;
    }

    try {
      const start = Date.now();
      const res = await client.chat.completions.create({
        model,
        messages: [{ role: 'user', content: 'Say {"status":"ok"} in valid JSON.' }],
        max_tokens: 20,
      });
      const time = Date.now() - start;
      const text = res.choices[0]?.message?.content?.trim();
      console.log(`✅ LIVE: ${model} (${time}ms) -> ${text?.slice(0, 30)}`);
      liveModels.push({ model, time });
    } catch (e) {
      // ignore 404 / inactive
    }
  }

  console.log('\n--- ALL LIVE ACTIVE TEXT MODELS ---');
  liveModels.sort((a, b) => a.time - b.time);
  liveModels.forEach(m => console.log(`• ${m.model}: ${m.time}ms`));
}

findLiveActiveModels();
