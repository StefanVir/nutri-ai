import OpenAI from 'openai';
import fs from 'fs';
import { buildCulinaryArchetypes } from '../src/lib/culinaryEngine.ts';

const envContent = fs.readFileSync('.env.local', 'utf8');
const match = envContent.match(/NVIDIA_NIM_API_KEY=(.*)/);
const apiKey = match ? match[1].trim() : process.env.NVIDIA_NIM_API_KEY;

const client = new OpenAI({
  apiKey,
  baseURL: 'https://integrate.api.nvidia.com/v1',
});

const MODELS_TO_COMPARE = [
  'meta/llama-3.1-70b-instruct',
  'meta/llama-3.3-70b-instruct',
  'deepseek-ai/deepseek-v4-flash-0731',
  'google/gemma-4-31b-it',
  'meta/llama-3.1-8b-instruct',
];

const ingredients = ['Mușchi de vită', 'Conserve de ton', 'Avocado', 'Ouă', 'Spanac proaspăt', 'Cartofi dulci'];
const appliances = ['Aragaz / Tigaie', 'Airfryer'];

const archetypes = [
  'Rețeta 1: Mușchi de vită la tigaie cu spanac sote și cartofi dulci (Proteină: Mușchi de vită)',
  'Rețeta 2: Salată gourmet de ton cu cuburi de avocado și verdețuri (Proteină: Conserve de ton)',
  'Rețeta 3: Omletă cremoasă cu spanac și felii de avocado (Proteină: Ouă)',
].join('\n');

const systemPrompt = `You are a Master Executive Chef & Sports Nutritionist for NutriAI.
You create 3 DISTINCT, CULINARILY COHERENT, and DELICIOUS single-meal recipes in Romanian based on the user's available pantry.

STRICT CULINARY RULES:
1. PROTEIN ISOLATION: NEVER mix incompatible proteins in one dish (DO NOT mix Beef + Tuna + Eggs). Each recipe MUST isolate ONE primary hero protein.
2. PROFESSIONAL STEP-BY-STEP INSTRUCTIONS: Provide 3-4 clear, numbered culinary steps with authentic Romanian cooking verbs (Mise en place, Gătire termică cu timpi & temperatură, Garnituri/Sote, Odihnă & Servire).
3. NATURAL ROMANIAN: Zero AI slop, zero template text.
4. JSON FORMAT ONLY:
{
  "recipes": [
    {
      "title": "Titlu preparat",
      "calories": 650,
      "protein": 45,
      "carbs": 40,
      "fat": 20,
      "matchReason": "Beneficiu nutrițional real.",
      "ingredients": [
        { "name": "Mușchi de vită", "amount": "180g" },
        { "name": "Spanac", "amount": "100g" }
      ],
      "instructions": [
        "Pas 1...",
        "Pas 2...",
        "Pas 3...",
        "Pas 4..."
      ]
    }
  ]
}`;

const userPrompt = `Ingrediente: ${ingredients.join(', ')}. Echipamente: ${appliances.join(', ')}.
Generează 3 rețete gourmet variate urmând aceste 3 direcții:
${archetypes}`;

async function runComparison() {
  console.log('🍽️ TESTING CULINARY QUALITY & INTELLIGENCE ACROSS TOP NIM MODELS...\n');

  for (const model of MODELS_TO_COMPARE) {
    console.log(`======================================================================`);
    console.log(`🧠 EVALUATING MODEL: ${model}`);
    const start = Date.now();
    try {
      const res = await client.chat.completions.create({
        model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        temperature: 0.25,
        max_tokens: 1500,
      });

      const elapsed = Date.now() - start;
      const content = res.choices[0]?.message?.content || '';

      console.log(`⏱️ Latency: ${elapsed}ms (${(elapsed / 1000).toFixed(2)}s)`);

      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        console.log(`📊 Generated ${parsed.recipes?.length || 0} recipes:`);
        (parsed.recipes || []).forEach((r, i) => {
          console.log(`\n  [Rețeta ${i + 1}] ${r.title} (~${r.calories} kcal | ${r.protein}g P)`);
          console.log(`  💡 De ce: ${r.matchReason}`);
          console.log(`  📝 Ingrediente: ${r.ingredients?.map(ing => `${ing.name} (${ing.amount})`).join(', ')}`);
          console.log(`  👨‍🍳 Etape:`);
          (r.instructions || []).forEach((st, idx) => console.log(`     ${idx + 1}. ${st}`));
        });
      } else {
        console.log('⚠️ Could not parse JSON. Raw snippet:', content.slice(0, 300));
      }
    } catch (e) {
      console.log(`❌ Failed on ${model}: ${e.message}`);
    }
  }
}

runComparison();
