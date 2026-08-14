import OpenAI from 'openai';
import fs from 'fs';

const envContent = fs.readFileSync('.env.local', 'utf8');
const match = envContent.match(/NVIDIA_NIM_API_KEY=(.*)/);
const apiKey = match ? match[1].trim() : process.env.NVIDIA_NIM_API_KEY;

const client = new OpenAI({
  apiKey,
  baseURL: 'https://integrate.api.nvidia.com/v1',
});

const systemPrompt = `You are a Master Executive Chef for NutriAI. Generate 3 distinct gourmet single-meal recipes in Romanian in valid JSON format.`;

const userPrompt = `Ingrediente disponibile: Mușchi de vită, Conserve de ton, Ouă, Spanac proaspăt, Avocado, Cartofi dulci. Echipamente: Tigaie, Airfryer.
Generează 3 rețete gourmet diferite (Rețeta 1: Vită, Rețeta 2: Ton, Rețeta 3: Ouă).
Răspunde STRICT în JSON valid:
{
  "recipes": [
    {
      "title": "Titlu preparat",
      "calories": 650,
      "protein": 45,
      "carbs": 40,
      "fat": 20,
      "matchReason": "Beneficiu nutrițional real.",
      "ingredients": [{ "name": "Mușchi de vită", "amount": "180g" }],
      "instructions": [
        "1. Pas pregătire...",
        "2. Pas gătire termică...",
        "3. Pas garnitură...",
        "4. Pas servire..."
      ]
    }
  ]
}`;

async function testFastModels() {
  const models = [
    'deepseek-ai/deepseek-v4-flash-0731',
    'google/diffusiongemma-26b-a4b-it',
    'google/gemma-4-31b-it',
  ];

  for (const model of models) {
    console.log(`\n========================================`);
    console.log(`Testing ${model}...`);
    const start = Date.now();
    try {
      const res = await client.chat.completions.create({
        model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        temperature: 0.2,
        max_tokens: 1200,
      });
      const time = Date.now() - start;
      console.log(`⏱️ Latency: ${time}ms (${(time / 1000).toFixed(2)}s)`);
      const content = res.choices[0]?.message?.content || '';
      console.log('Output Snippet:');
      console.log(content.slice(0, 700));
    } catch (e) {
      console.log(`❌ Error on ${model}:`, e.message);
    }
  }
}

testFastModels();
