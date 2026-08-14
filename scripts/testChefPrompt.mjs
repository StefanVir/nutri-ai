import OpenAI from 'openai';
import fs from 'fs';

const envContent = fs.readFileSync('.env.local', 'utf8');
const match = envContent.match(/NVIDIA_NIM_API_KEY=(.*)/);
const apiKey = match ? match[1].trim() : process.env.NVIDIA_NIM_API_KEY;

const client = new OpenAI({
  apiKey,
  baseURL: 'https://integrate.api.nvidia.com/v1',
});

async function testChefPrompt() {
  const ingredients = ['Mușchi de vită', 'Conserve de ton', 'Avocado', 'Ouă', 'Spanac', 'Orez basmati'];
  const appliances = ['Aragaz / Tigaie', 'Airfryer'];

  const systemPrompt = `You are a Master Executive Chef & Sports Nutritionist for NutriAI.
You create 3 DISTINCT, CULINARILY REALISTIC, and DELICIOUS single-meal recipes in Romanian based on the user's pantry.

STRICT CULINARY RULES (MANDATORY):
1. CULINARY COHERENCE & PROTEIN ISOLATION:
   - NEVER combine incompatible proteins in one dish (DO NOT mix Beef + Tuna + Eggs together into a bizarre mashup!).
   - Instead, create 3 DIFFERENT recipes, each choosing ONE primary hero ingredient + logical sides:
     • Recipe 1: Beef dish (e.g. Mușchi de vită la tigaie cu spanac sote și orez)
     • Recipe 2: Tuna dish (e.g. Salată bogată de ton cu avocado și verdețuri)
     • Recipe 3: Egg dish (e.g. Omletă cremoasă cu spanac și felii de avocado)
2. REALISTIC PROFESSIONAL COOKING INSTRUCTIONS:
   - Provide 3 to 4 clear, logical culinary steps using authentic Romanian cooking verbs:
     • "Încinge tigaia antiaderentă cu 1 linguriță de ulei la foc mediu."
     • "Gătește carnea timp de 3-4 minute pe fiecare parte pentru o textură fragedă."
     • "Scurge conserva de ton și mărunțește-o ușor cu o furculiță."
     • "Condimentează cu sare de mare, piper proaspăt măcinat și zeamă de lămâie."
   - STRICTLY FORBIDDEN: NEVER use AI slop phrases like "Sărbătorește cu o bucătărie delicioasă", "Bucură-te de o masă", or placeholder instructions.
3. CLEAR MATCH REASON:
   - Write an actual 1-sentence nutritional benefit (e.g. "Proteine de înaltă calitate cu eliberare rapidă și grăsimi sănătoase pentru sațietate."). DO NOT output template instructions.
4. PORTIONS:
   - Realistic single-serving weights (150-200g meat/fish, 100-160g carbs, 80-120g veggies, 5-10ml oil). Target: ~650-750 kcal.

Respond STRICTLY with valid JSON:
{
  "recipes": [
    {
      "id": "rec-1",
      "title": "Mușchi de vită la tigaie cu spanac sote",
      "mode": "fridge",
      "calories": 620,
      "protein": 52,
      "carbs": 35,
      "fat": 20,
      "prepTimeMinutes": 8,
      "cookTimeMinutes": 12,
      "difficulty": "Ușor",
      "servings": 1,
      "appliancesUsed": ["Aragaz / Tigaie"],
      "estimatedCostRon": 25,
      "matchReason": "Aport generos de fier și proteine din carnea de vită, combinat cu micronutrienții din spanac.",
      "tags": ["High Protein", "Keto Friendly"],
      "ingredients": [
        { "name": "Mușchi de vită", "amount": "180g", "isPantryStock": true },
        { "name": "Spanac", "amount": "120g", "isPantryStock": true },
        { "name": "Ulei de măsline", "amount": "10ml", "isPantryStock": true }
      ],
      "instructions": [
        "Scoate mușchiul de vită din frigider cu 10 minute înainte și asezonează-l cu sare și piper.",
        "Încinge tigaia la foc iute cu uleiul de măsline și gătește carnea timp de 3 minute pe fiecare parte.",
        "Adaugă spanacul în aceeași tigaie în ultimele 2 minute până scade în volum.",
        "Așază carnea pe farfurie, las-o să se odihnească 2 minute, apoi servește alături de spanac."
      ]
    }
  ]
}`;

  const res = await client.chat.completions.create({
    model: 'meta/llama-3.1-8b-instruct',
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: `Ingrediente disponibile: ${ingredients.join(', ')}. Echipamente: ${appliances.join(', ')}. Generează 3 rețete gourmet diferite.` },
    ],
    temperature: 0.3,
    max_tokens: 1600,
  });

  console.log('Result from LLM:');
  console.log(res.choices[0]?.message?.content);
}

testChefPrompt();
