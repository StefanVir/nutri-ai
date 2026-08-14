import OpenAI from 'openai';
import fs from 'fs';

const envContent = fs.readFileSync('.env.local', 'utf8');
const match = envContent.match(/NVIDIA_NIM_API_KEY=(.*)/);
const apiKey = match ? match[1].trim() : process.env.NVIDIA_NIM_API_KEY;

const client = new OpenAI({
  apiKey,
  baseURL: 'https://integrate.api.nvidia.com/v1',
});

const TOP_MODELS = [
  'mistralai/mistral-large-2-instruct',
  'nvidia/llama-3.1-nemotron-70b-instruct',
  'google/gemma-3-12b-it',
  'google/gemma-4-31b-it',
  'openai/gpt-oss-120b',
  'ai21labs/jamba-1.5-large-instruct',
  'meta/llama-3.3-70b-instruct',
  'meta/llama-3.1-8b-instruct',
];

const testPrompt = `Ești un Chef Executiv și Nutriționist Sportiv de elită.
Creează 1 rețetă gourmet în limba Română cu ingredientele: [Mușchi de vită, Spanac proaspăt, Cartofi dulci, Ulei de măsline].
Țintă: ~650 kcal, ~45g Proteine.
Răspunde STRICT în JSON valid:
{
  "title": "Titlu preparat",
  "matchReason": "O singură frază clară despre beneficiul nutrițional și digestie.",
  "instructions": [
    "Pas 1 (Mise en place)",
    "Pas 2 (Tratament termic)",
    "Pas 3 (Garnitură / Sote)",
    "Pas 4 (Odihnă & Servire)"
  ]
}`;

async function runBenchmark() {
  console.log('🚀 Benchmarking Top NVIDIA NIM Models for Culinary Intelligence...\n');

  for (const model of TOP_MODELS) {
    console.log(`==================================================`);
    console.log(`🔍 Testing: ${model}`);
    const start = Date.now();
    try {
      const response = await client.chat.completions.create({
        model,
        messages: [
          { role: 'system', content: 'You are an elite culinary master. Respond strictly in valid JSON.' },
          { role: 'user', content: testPrompt },
        ],
        temperature: 0.2,
        max_tokens: 600,
      });

      const elapsed = Date.now() - start;
      const content = response.choices[0]?.message?.content || '';

      console.log(`⏱️ Latency: ${elapsed}ms`);
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        console.log(`🍲 Title: "${parsed.title}"`);
        console.log(`💡 Match Reason: "${parsed.matchReason}"`);
        console.log(`👨‍🍳 Steps:`);
        (parsed.instructions || []).forEach((step, idx) => console.log(`   ${idx + 1}. ${step}`));
      } else {
        console.log('⚠️ Raw Output snippet:', content.slice(0, 200));
      }
    } catch (err) {
      console.log(`❌ Error: ${err.message}`);
    }
  }
}

runBenchmark();
