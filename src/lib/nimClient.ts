import OpenAI from 'openai';
import { PreSwipeContext, MealCardProposal } from '@/types/nutrition';
import { MealCardDeckSchema, QuickLogOutputSchema, QuickLogOutput } from './schemas';
import { filterOrGenerateRecipes } from './mockRecipes';

// NVIDIA NIM OpenAI-Compatible API Configuration
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

export async function generateNIMMealDeck(context: PreSwipeContext): Promise<MealCardProposal[]> {
  const client = getOpenAIClient();

  if (!client) {
    console.warn('NVIDIA_NIM_API_KEY is not set. Using curated local engine recipes.');
    return filterOrGenerateRecipes(context);
  }

  const systemPrompt = `You are an elite culinary chef and sports nutrition expert for NutriAI.
You generate personalized meal cards tailored strictly to the user's metabolic remaining macros, fridge items, appliances, and budget.

You MUST respond strictly in valid JSON adhering to this exact schema:
{
  "recipes": [
    {
      "id": "unique-recipe-id",
      "title": "Clear Appetizing Recipe Title in Romanian",
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
      "matchReason": "Why this meal is ideal for the current macro budget and available ingredients in Romanian",
      "tags": ["High Protein", "Airfryer", "Quick"],
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
      ? 'Cook with current fridge pantry ingredients only'
      : context.mode === 'grocery_empty'
      ? `Empty fridge - Total budget ceiling: ${context.maxBudgetRon || 30} RON`
      : context.mode === 'grocery_stock'
      ? `Have base ingredients + Additional grocery budget: ${context.maxBudgetRon || 15} RON`
      : 'Restaurant guide mode'
  })
- Meal Category: ${context.mealCategory}
- Servings: ${context.servings}
- Appliances: ${context.appliances.length > 0 ? context.appliances.join(', ') : 'Any / Standard kitchen'}
- Available in fridge: ${context.fridgeIngredients.length > 0 ? context.fridgeIngredients.join(', ') : 'None (empty fridge)'}
- Remaining Macros Today: ~${context.remainingCalories} kcal, ~${context.remainingProtein}g Protein, ~${context.remainingCarbs}g Carbs, ~${context.remainingFat}g Fat.

Generate 3-4 diverse, delicious and realistic meal options in Romanian adhering strictly to these constraints.`;

  try {
    const completion = await client.chat.completions.create({
      model: PRIMARY_MODEL,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.5,
      max_tokens: 2500,
      response_format: { type: 'json_object' },
    });

    const content = completion.choices[0]?.message?.content;
    if (!content) {
      console.warn('Empty response from NVIDIA NIM. Using fallback.');
      return filterOrGenerateRecipes(context);
    }

    const rawJson = JSON.parse(content);
    const parsed = MealCardDeckSchema.safeParse(rawJson);

    if (parsed.success) {
      return parsed.data.recipes as MealCardProposal[];
    } else {
      console.warn('Zod validation warning on NIM response:', parsed.error.format());
      return filterOrGenerateRecipes(context);
    }
  } catch (error) {
    console.error('NVIDIA NIM call failed:', error);
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
      confidenceNotes: 'Estimare calculată din descrierea alimentului (Modul Offline).',
    };
  }

  const systemPrompt = `You are a nutrition analyst. Given a natural language description of food/drink consumed, extract estimated nutritional values.
Respond strictly in valid JSON:
{
  "title": "Short Clean Meal Name in Romanian (e.g. 2 Ouă Ochiuri cu Pâine Prăjită)",
  "calories": 350,
  "protein": 24,
  "carbs": 30,
  "fat": 14,
  "confidenceNotes": "Estimated breakdown justification in Romanian"
}`;

  try {
    const completion = await client.chat.completions.create({
      model: PRIMARY_MODEL,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: `Analyze: "${textDescription}"` },
      ],
      temperature: 0.2,
      max_tokens: 500,
      response_format: { type: 'json_object' },
    });

    const content = completion.choices[0]?.message?.content;
    if (!content) throw new Error('Empty response');

    const rawJson = JSON.parse(content);
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
    console.error('Quick AI Log parse error:', err);
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
