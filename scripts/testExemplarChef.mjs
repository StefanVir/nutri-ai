import OpenAI from 'openai';
import fs from 'fs';

const envContent = fs.readFileSync('.env.local', 'utf8');
const match = envContent.match(/NVIDIA_NIM_API_KEY=(.*)/);
const apiKey = match ? match[1].trim() : process.env.NVIDIA_NIM_API_KEY;

const client = new OpenAI({
  apiKey,
  baseURL: 'https://integrate.api.nvidia.com/v1',
});

const archetypeGuide = `Rețeta 1: Mușchi de vită la tigaie cu spanac sote și cartofi dulci (Hero Protein: Mușchi de vită, Garnituri: Spanac proaspăt, Cartofi dulci, Ulei de măsline)
Rețeta 2: Salată gourmet de ton cu cuburi de avocado și verdețuri (Hero Protein: Conserve de ton, Garnituri: Avocado, Spanac proaspăt, Ulei de măsline)
Rețeta 3: Omletă cremoasă cu spanac și felii de avocado (Hero Protein: Ouă, Garnituri: Spanac proaspăt, Avocado)`;

const systemPrompt = `You are a Master Executive Chef & Sports Nutritionist for NutriAI.
You generate 3 DISTINCT, CULINARILY REALISTIC single-meal recipes in Romanian based strictly on the assigned archetypes.

STRICT CULINARY RULES:
1. HERO PROTEIN ISOLATION: Each recipe MUST isolate ONE primary hero protein. NEVER combine incompatible proteins in one dish (DO NOT mix Beef + Tuna + Eggs).
2. 4-PHASE PROCEDURAL COOKING STEPS:
   - Pasul 1 (Mise en Place / Pregătire): Scoate/curăță/taie/scurge ingredientele și asezonează.
   - Pasul 2 (Tratament termic): Încinge tigaia/cuptorul la foc mediu-iute cu ulei și gătește carnea/proteina (timp precis: ex. 3-4 min/parte).
   - Pasul 3 (Sote / Garnituri): Adaugă legumele/spanacul în ultimele minute pentru a-și păstra textura.
   - Pasul 4 (Odihnă & Servire): Lasă carnea 2 minute la odihnit pentru frăgezime, așază pe farfurie și servește cald.
3. AUTHENTIC ROMANIAN COOKING VERBS:
   - Use: "Taie", "Încinge", "Scurge", "Rumenește", "Așază", "Presară", "Gătește".
   - BANNED: Never use AI slop ("Sărbătorește cu o bucătărie", "Bucură-te de o masă", etc.).

EXEMPLAR OF HIGH-QUALITY OUTPUT:
{
  "recipes": [
    {
      "id": "rec-1",
      "title": "Mușchi de vită la tigaie cu spanac sote și cartofi dulci",
      "mode": "fridge",
      "calories": 680,
      "protein": 52,
      "carbs": 45,
      "fat": 18,
      "prepTimeMinutes": 10,
      "cookTimeMinutes": 15,
      "difficulty": "Ușor",
      "servings": 1,
      "appliancesUsed": ["Aragaz / Tigaie"],
      "estimatedCostRon": 26,
      "matchReason": "Aport excelent de fier și aminoacizi esențiali din carnea de vită, asociat cu antioxidanții din spanac și carbohidrații complecși.",
      "tags": ["High Protein", "Gourmet", "Tigaie"],
      "ingredients": [
        { "name": "Mușchi de vită", "amount": "180g", "isPantryStock": true },
        { "name": "Spanac proaspăt", "amount": "120g", "isPantryStock": true },
        { "name": "Cartofi dulci", "amount": "150g", "isPantryStock": true },
        { "name": "Ulei de măsline", "amount": "10ml", "isPantryStock": true }
      ],
      "instructions": [
        "Curăță cartofii dulci și taie-i în cuburi mici, apoi scoate mușchiul de vită din frigider și asezonează-l cu sare și piper.",
        "Încinge tigaia antiaderentă la foc mediu spre iute cu 1 linguriță de ulei de măsline și rumenește cartofii timp de 8-10 minute până devin fragezi, apoi scoate-i deoparte.",
        "În aceeași tigaie încinsă, gătește mușchiul de vită timp de 3-4 minute pe fiecare parte pentru a obține o crustă rumenă și interior suculent.",
        "Adaugă spanacul în ultimul minut până scade în volum, lasă carnea să se odihnească 2 minute, apoi așază totul pe farfurie alături de cartofii dulci."
      ]
    }
  ]
}`;

async function test() {
  console.log('Testing exemplar-driven chef with meta/llama-3.1-8b-instruct...');
  const start = Date.now();
  const res = await client.chat.completions.create({
    model: 'meta/llama-3.1-8b-instruct',
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: `Generează 3 rețete gourmet variate urmând aceste 3 arhetipuri:\n${archetypeGuide}` },
    ],
    temperature: 0.25,
    max_tokens: 1800,
  });

  console.log(`⏱️ Response Time: ${Date.now() - start}ms\n`);
  const content = res.choices[0]?.message?.content || '';
  const parsed = JSON.parse(content.match(/\{[\s\S]*\}/)[0]);

  parsed.recipes.forEach((r, i) => {
    console.log(`=== REȚETA ${i + 1}: ${r.title} ===`);
    console.log(`💡 De ce: ${r.matchReason}`);
    console.log(`📝 Ingrediente: ${r.ingredients.map(ing => `${ing.name} (${ing.amount})`).join(', ')}`);
    console.log(`👨‍🍳 Instrucțiuni:`);
    r.instructions.forEach((step, idx) => console.log(`   ${idx + 1}. ${step}`));
    console.log('');
  });
}

test();
