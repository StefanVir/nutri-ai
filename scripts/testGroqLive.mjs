import OpenAI from 'openai';
import fs from 'fs';

let groqKey = process.env.GROQ_API_KEY;
if (!groqKey && fs.existsSync('.env.local')) {
  const envContent = fs.readFileSync('.env.local', 'utf8');
  const match = envContent.match(/GROQ_API_KEY=(.*)/);
  if (match) groqKey = match[1].trim();
}

if (!groqKey) {
  console.error('❌ GROQ_API_KEY was not found in environment or .env.local');
  process.exit(1);
}

const client = new OpenAI({
  apiKey: groqKey,
  baseURL: 'https://api.groq.com/openai/v1',
});

const systemPrompt = `You are a Master Executive Chef & Sports Nutritionist for NutriAI.
Generate 3 gourmet, culinarily coherent single-meal recipes in Romanian for a user with these ingredients:
[Mușchi de vită, Conserve de ton, Ouă, Spanac proaspăt, Avocado, Cartofi dulci].
Target: ~680 kcal, ~48g Protein per meal.

STRICT CULINARY RULES:
1. PROTEIN ISOLATION: NEVER mix incompatible proteins in one dish (DO NOT mix Beef + Tuna + Eggs).
   • Recipe 1: Beef dish (e.g. Mușchi de vită la tigaie cu spanac sote și cartofi dulci)
   • Recipe 2: Tuna dish (e.g. Salată gourmet de ton cu cuburi de avocado și verdețuri)
   • Recipe 3: Egg dish (e.g. Omletă cremoasă cu spanac și felii de avocado)
2. 4-PHASE COOKING DAG: 4 clear, logical steps with Romanian cooking verbs (Mise en place, Gătire termică, Garnituri/Sote, Odihnă & Servire).
3. ROMANIAN GOURMET: Zero AI slop.

Respond ONLY with valid JSON:
{
  "recipes": [
    {
      "id": "rec-1",
      "title": "Mușchi de vită la tigaie cu spanac sote și cartofi dulci",
      "calories": 680,
      "protein": 50,
      "carbs": 45,
      "fat": 18,
      "prepTimeMinutes": 10,
      "cookTimeMinutes": 15,
      "difficulty": "Ușor",
      "servings": 1,
      "appliancesUsed": ["Aragaz / Tigaie"],
      "estimatedCostRon": 25,
      "matchReason": "Aport generos de fier și proteine de înaltă calitate din carnea de vită, asociat cu antioxidanții din spanac.",
      "tags": ["High Protein", "Gourmet", "Tigaie"],
      "ingredients": [
        { "name": "Mușchi de vită", "amount": "180g", "isPantryStock": true },
        { "name": "Spanac proaspăt", "amount": "100g", "isPantryStock": true },
        { "name": "Cartofi dulci", "amount": "150g", "isPantryStock": true },
        { "name": "Ulei de măsline", "amount": "10ml", "isPantryStock": true }
      ],
      "instructions": [
        "Curăță cartofii dulci și taie-i în cuburi mici, apoi scoate mușchiul de vită din frigider și asezonează-l cu sare și piper.",
        "Încinge tigaia antiaderentă la foc mediu cu 1 linguriță de ulei și rumenește cartofii timp de 8-10 minute până devin fragezi, apoi scoate-i deoparte.",
        "În aceeași tigaie încinsă la foc mediu-iute, gătește mușchiul de vită timp de 3-4 minute pe fiecare parte pentru o crustă rumenă și interior suculent.",
        "Adaugă spanacul în ultimul minut până scade în volum, lasă carnea să se odihnească 2 minute, apoi așază totul pe farfurie alături de cartofi."
      ]
    }
  ]
}`;

async function testGroq() {
  console.log('⚡ Testing Groq LPU with llama-3.3-70b-versatile...\n');
  const start = Date.now();

  try {
    const res = await client.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: 'Generează cele 3 rețete gourmet conform instrucțiunilor.' },
      ],
      temperature: 0.2,
      max_tokens: 1800,
    });

    const elapsed = Date.now() - start;
    console.log(`✅ SUCCESS! Latency: ${elapsed}ms (${(elapsed / 1000).toFixed(2)}s)\n`);

    const content = res.choices[0]?.message?.content || '';
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.log('Raw output:', content);
      return;
    }

    const parsed = JSON.parse(jsonMatch[0]);
    console.log(`Generated ${parsed.recipes?.length || 0} Gourmet Recipes on Groq Llama 3.3 70B:\n`);

    parsed.recipes.forEach((r, idx) => {
      console.log(`🍽️ [Rețeta ${idx + 1}] ${r.title}`);
      console.log(`   📊 Macro: ${r.calories} kcal | ${r.protein}g Proteine | ${r.carbs}g Carbohidrați | ${r.fat}g Grăsimi`);
      console.log(`   💡 De ce funcționează: ${r.matchReason}`);
      console.log(`   📝 Ingrediente: ${r.ingredients?.map(i => `${i.name} (${i.amount})`).join(', ')}`);
      console.log(`   👨‍🍳 Pasi de preparare:`);
      (r.instructions || []).forEach((s, sIdx) => console.log(`      ${sIdx + 1}. ${s}`));
      console.log('--------------------------------------------------');
    });
  } catch (err) {
    console.error('❌ Groq API Error:', err.message);
  }
}

testGroq();
