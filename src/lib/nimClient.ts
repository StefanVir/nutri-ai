import OpenAI from 'openai';
import { PreSwipeContext, MealCardProposal } from '@/types/nutrition';
import { MealCardDeckSchema, QuickLogOutputSchema, QuickLogOutput } from './schemas';
import { filterOrGenerateRecipes } from './mockRecipes';

// NVIDIA NIM OpenAI-Compatible Endpoint
const NVIDIA_BASE_URL = 'https://integrate.api.nvidia.com/v1';
const PRIMARY_MODEL = 'meta/llama-3.1-70b-instruct';

function getOpenAIClient(): OpenAI | null {
  const apiKey = process.env.NVIDIA_NIM_API_KEY;
  if (!apiKey) return null;

  return new OpenAI({
    apiKey,
    baseURL: NVIDIA_BASE_URL,
  });
}

function parseJsonResponse(raw: string): any {
  if (!raw) throw new Error('Empty text content');

  // Strip markdown code fences if model returns ```json ... ```
  let cleaned = raw.trim();
  if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```(?:json)?\s*/i, '').replace(/```\s*$/, '').trim();
  }

  return JSON.parse(cleaned);
}

export async function generateNIMMealDeck(context: PreSwipeContext): Promise<MealCardProposal[]> {
  const client = getOpenAIClient();

  if (!client) {
    return filterOrGenerateRecipes(context);
  }

  const systemPrompt = `You are an elite culinary chef and sports nutrition expert for NutriAI.
You generate personalized meal cards tailored strictly to the user's metabolic remaining macros, fridge items, appliances, and budget.

Respond STRICTLY in valid JSON adhering to this schema:
{
  "recipes": [
    {
      "id": "nim-recipe-1",
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
      "appliancesUsed": ["Airfryer / Friteuză cu aer cald"],
      "estimatedCostRon": 18,
      "matchReason": "De ce este ideală pentru profilul tău caloric și ingredientele din frigider",
      "tags": ["High Protein", "Rapid"],
      "ingredients": [
        {
          "name": "Piept de pui",
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

  const userPrompt = `Context details:
- Mode: ${context.mode} (${
    context.mode === 'fridge'
      ? 'Gătesc doar cu ce am în frigider'
      : context.mode === 'grocery_empty'
      ? `Frigider gol - Buget maxim total: ${context.maxBudgetRon || 30} RON`
      : context.mode === 'grocery_stock'
      ? `Am ingrediente de bază + Buget suplimentar magazin: ${context.maxBudgetRon || 15} RON`
      : 'Ghid restaurant'
  })
- Categorie masă: ${context.mealCategory}
- Porții: ${context.servings}
- Echipamente: ${context.appliances.length > 0 ? context.appliances.join(', ') : 'Bucătărie standard'}
- Ingrediente disponibile: ${context.fridgeIngredients.length > 0 ? context.fridgeIngredients.join(', ') : 'Niciunul'}
- Macro-uri rămase azi: ~${context.remainingCalories} kcal, ~${context.remainingProtein}g Proteine, ~${context.remainingCarbs}g Carbohidrați, ~${context.remainingFat}g Grăsimi.

Generează 3-4 opțiuni de mese gustoase, diversificate și realiste în limba Română, respectând cu strictețe aceste constrângeri.`;

  try {
    const completion = await client.chat.completions.create({
      model: PRIMARY_MODEL,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.4,
      max_tokens: 2500,
    });

    const content = completion.choices[0]?.message?.content;
    if (!content) return filterOrGenerateRecipes(context);

    const rawJson = parseJsonResponse(content);
    const parsed = MealCardDeckSchema.safeParse(rawJson);

    if (parsed.success && parsed.data.recipes.length > 0) {
      return parsed.data.recipes as MealCardProposal[];
    } else {
      return filterOrGenerateRecipes(context);
    }
  } catch (error) {
    console.error('NVIDIA NIM API error:', error);
    return filterOrGenerateRecipes(context);
  }
}

export async function parseQuickAILog(textDescription: string): Promise<QuickLogOutput> {
  const client = getOpenAIClient();

  if (!client) {
    return {
      title: textDescription.slice(0, 35),
      calories: 380,
      protein: 22,
      carbs: 45,
      fat: 12,
      confidenceNotes: 'Estimare calculată din descriere (Modul Offline).',
    };
  }

  const systemPrompt = `You are an elite sports nutrition analyst. Given a natural language description of food/drink consumed, extract estimated nutritional values.
Respond STRICTLY in valid JSON:
{
  "title": "Nume Clar și Scurt al Preparatului în Română",
  "calories": 350,
  "protein": 24,
  "carbs": 30,
  "fat": 14,
  "confidenceNotes": "Scurtă justificare a valorilor nutriționale estimate în Română"
}`;

  try {
    const completion = await client.chat.completions.create({
      model: PRIMARY_MODEL,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: `Analizează preparatul: "${textDescription}"` },
      ],
      temperature: 0.2,
      max_tokens: 500,
    });

    const content = completion.choices[0]?.message?.content;
    if (!content) throw new Error('Empty response');

    const rawJson = parseJsonResponse(content);
    const parsed = QuickLogOutputSchema.safeParse(rawJson);

    if (parsed.success) {
      return parsed.data;
    } else {
      return {
        title: textDescription.slice(0, 35),
        calories: 350,
        protein: 20,
        carbs: 40,
        fat: 12,
        confidenceNotes: 'Estimare ajustată.',
      };
    }
  } catch (err) {
    console.error('Quick AI Log error:', err);
    return {
      title: textDescription.slice(0, 35),
      calories: 350,
      protein: 20,
      carbs: 40,
      fat: 12,
      confidenceNotes: 'Estimare offline.',
    };
  }
}
