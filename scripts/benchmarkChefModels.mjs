import OpenAI from 'openai';
import fs from 'fs';

const envContent = fs.readFileSync('.env.local', 'utf8');
const match = envContent.match(/NVIDIA_NIM_API_KEY=(.*)/);
const apiKey = match ? match[1].trim() : process.env.NVIDIA_NIM_API_KEY;

const client = new OpenAI({
  apiKey,
  baseURL: 'https://integrate.api.nvidia.com/v1',
});

const CANDIDATE_MODELS = [
  'mistralai/mistral-large-2411',
  'mistralai/mistral-nemo-12b-instruct',
  'qwen/qwen2.5-72b-instruct',
  'qwen/qwen2.5-32b-instruct',
  'meta/llama-3.3-70b-instruct',
  'nvidia/llama-3.1-nemotron-70b-instruct',
  'google/gemma-2-27b-it',
  'deepseek-ai/deepseek-r1',
  'meta/llama-3.1-8b-instruct',
];

const testPrompt = `Ești un Chef Executiv și Nutriționist Sportiv de elită.
Generează 1 rețetă gourmet în limba Română cu ingredientele: [Mușchi de vită, Spanac, Cartofi dulci, Ulei de măsline].
Țintă: ~650 kcal, ~45g Proteine.
Răspunde STRICT în JSON valid:
{
  "title": "Titlu preparat",
  "calories": 650,
  "protein": 45,
  "carbs": 40,
  "fat": 20,
  "matchReason": "Beneficiu nutrițional real.",
  "instructions": [
    "Pas 1...",
    "Pas 2...",
    "Pas 3...",
    "Pas 4..."
  ]
}`;

async function runBenchmark() {
  console.log('🚀 Starting NVIDIA NIM Culinary Model Benchmark...\n');

  for (const model of CANDIDATE_MODELS) {
    console.log(`--------------------------------------------------`);
    console.log(`🔍 Testing model: ${model}`);
    const start = Date.now();
    try {
      const response = await client.chat.completions.create({
        model,
        messages: [
          { role: 'system', content: 'You are a culinary AI master. Respond strictly in valid JSON.' },
          { role: 'user', content: testPrompt },
        ],
        temperature: 0.2,
        max_tokens: 800,
      });

      const elapsed = Date.now() - start;
      const content = response.choices[0]?.message?.content || '';

      console.log(`⏱️ Latency: ${elapsed}ms`);
      try {
        const jsonMatch = content.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]);
          console.log(`✅ Title: "${parsed.title}"`);
          console.log(`✅ Match Reason: "${parsed.matchReason}"`);
          console.log(`✅ Steps (${parsed.instructions?.length || 0}):`);
          (parsed.instructions || []).forEach((step, idx) => console.log(`   ${idx + 1}. ${step}`));
        } else {
          console.log('⚠️ No JSON found in output:', content.slice(0, 150));
        }
      } catch (jsonErr) {
        console.log('❌ JSON Parse Error. Raw content snippet:', content.slice(0, 150));
      }
    } catch (apiErr) {
      console.log(`❌ API Error for ${model}: ${apiErr.message}`);
    }
  }
}

runBenchmark();
