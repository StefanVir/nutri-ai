import OpenAI from 'openai';
import fs from 'fs';

const envContent = fs.readFileSync('.env.local', 'utf8');
const match = envContent.match(/NVIDIA_NIM_API_KEY=(.*)/);
const apiKey = match ? match[1].trim() : process.env.NVIDIA_NIM_API_KEY;

const NVIDIA_BASE_URL = 'https://integrate.api.nvidia.com/v1';
const client = new OpenAI({ apiKey, baseURL: NVIDIA_BASE_URL });

async function test8bDeck() {
  const context = {
    mode: 'fridge',
    mealCategory: 'dinner',
    servings: 1,
    appliances: ['Airfryer', 'Tigaie'],
    fridgeIngredients: ['Somon proaspăt', 'Avocado', 'Cartofi dulci', 'Lămâie'],
    remainingCalories: 600,
    remainingProtein: 42,
    remainingCarbs: 45,
    remainingFat: 18,
  };

  const systemPrompt = `You are NutriAI, an expert sports nutritionist and chef.
Given the user's available ingredients, appliances, and exact remaining macros, generate 3 unique, realistic recipes in Romanian.
CRITICAL RULES:
1. Every recipe MUST use the user's ingredients (${context.fridgeIngredients.join(', ')}).
2. The macros MUST strictly match the target: ~${context.remainingCalories} kcal, ~${context.remainingProtein}g Protein, ~${context.remainingCarbs}g Carbs, ~${context.remainingFat}g Fat.
3. Respond ONLY in valid JSON matching this schema:
{
  "recipes": [
    {
      "id": "rec-1",
      "title": "Titlu Rețetă în Română",
      "mode": "${context.mode}",
      "calories": ${context.remainingCalories},
      "protein": ${context.remainingProtein},
      "carbs": ${context.remainingCarbs},
      "fat": ${context.remainingFat},
      "prepTimeMinutes": 10,
      "cookTimeMinutes": 15,
      "difficulty": "Ușor",
      "servings": ${context.servings},
      "appliancesUsed": ["${context.appliances[0] || 'Tigaie'}"],
      "estimatedCostRon": 25,
      "matchReason": "Potrivire exactă cu ingredientele tale (${context.fridgeIngredients.slice(0, 2).join(', ')}) și deficitul caloric rămas.",
      "tags": ["High Protein", "${context.appliances[0] || 'Rapid'}"],
      "ingredients": [
        { "name": "${context.fridgeIngredients[0] || 'Ingredient'}", "amount": "180g", "isPantryStock": true }
      ],
      "instructions": [
        "Pasul 1...",
        "Pasul 2...",
        "Pasul 3..."
      ]
    }
  ]
}`;

  const userPrompt = `Generează 3 rețete folosind obligatoriu aceste ingrediente din frigider: ${context.fridgeIngredients.join(', ')}.
Echipamente disponibile: ${context.appliances.join(', ')}.
Macro-uri țintă de atins: ${context.remainingCalories} kcal, ${context.remainingProtein}g Proteine, ${context.remainingCarbs}g Carbohidrați, ${context.remainingFat}g Grăsimi.`;

  const start = Date.now();
  console.log('Sending request to Llama 3.1 8B...');
  try {
    const res = await client.chat.completions.create({
      model: 'meta/llama-3.1-8b-instruct',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.3,
      max_tokens: 1500,
    });
    console.log(`⏱️ Llama 3.1 8B completed in ${Date.now() - start}ms!`);
    console.log(res.choices[0]?.message?.content);
  } catch (e) {
    console.error('Error:', e);
  }
}

test8bDeck();
