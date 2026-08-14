import OpenAI from 'openai';
import fs from 'fs';

const envContent = fs.readFileSync('.env.local', 'utf8');
const match = envContent.match(/NVIDIA_NIM_API_KEY=(.*)/);
const apiKey = match ? match[1].trim() : process.env.NVIDIA_NIM_API_KEY;

console.log('API Key present:', !!apiKey, 'length:', apiKey ? apiKey.length : 0);

const NVIDIA_BASE_URL = 'https://integrate.api.nvidia.com/v1';
const PRIMARY_MODEL = 'meta/llama-3.1-70b-instruct';

const client = new OpenAI({
  apiKey,
  baseURL: NVIDIA_BASE_URL,
});

async function testDeck() {
  const context = {
    mode: 'fridge',
    mealCategory: 'dinner',
    servings: 1,
    appliances: ['Airfryer'],
    fridgeIngredients: ['Somon proaspăt', 'Avocado', 'Cartof dulce', 'Lămâie'],
    remainingCalories: 650,
    remainingProtein: 45,
    remainingCarbs: 50,
    remainingFat: 20,
  };

  const systemPrompt = `You are an elite culinary chef and sports nutrition expert for NutriAI.
You generate personalized meal cards tailored STRICTLY to the user's specific fridge ingredients, appliances, and target macros.
CRITICAL: Use ONLY or PRIMARILY the ingredients provided by the user in fridgeIngredients (${context.fridgeIngredients.join(', ')}). Do NOT return generic chicken if the user provided salmon!

Respond STRICTLY in valid JSON adhering to this schema:
{
  "recipes": [
    {
      "id": "rec-1",
      "title": "Numele Rețetei în Română",
      "mode": "${context.mode}",
      "calories": 550,
      "protein": 45,
      "carbs": 50,
      "fat": 15,
      "prepTimeMinutes": 10,
      "cookTimeMinutes": 15,
      "difficulty": "Ușor",
      "servings": ${context.servings},
      "appliancesUsed": ["Airfryer"],
      "estimatedCostRon": 18,
      "matchReason": "Explică de ce se potrivește cu ${context.fridgeIngredients.join(', ')}",
      "tags": ["High Protein", "Airfryer"],
      "ingredients": [
        {
          "name": "Somon",
          "amount": "180g",
          "isPantryStock": true,
          "toBuy": false,
          "estimatedPriceRon": 0
        }
      ],
      "instructions": [
        "Pasul 1...",
        "Pasul 2..."
      ]
    }
  ]
}`;

  const userPrompt = `Generează 3 rețete diferite exclusiv pe baza acestor ingrediente din frigider: ${context.fridgeIngredients.join(', ')}.
Echipamente: ${context.appliances.join(', ')}.
Macro-uri țintă: ~${context.remainingCalories} kcal, ~${context.remainingProtein}g Proteine, ~${context.remainingCarbs}g Carbohidrați, ~${context.remainingFat}g Grăsimi.`;

  const start = Date.now();
  console.log('Sending request to NVIDIA NIM Llama 3.1 70B...');
  try {
    const res = await client.chat.completions.create({
      model: PRIMARY_MODEL,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.3,
      max_tokens: 2500,
    });
    console.log(`Finished in ${Date.now() - start}ms`);
    console.log('Raw output:');
    console.log(res.choices[0]?.message?.content);
  } catch (e) {
    console.error('Error:', e);
  }
}

testDeck();
