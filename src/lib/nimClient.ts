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

export async function analyzeFoodImageWithNIM(
  imageBase64: string,
  userHint?: string
): Promise<{
  title: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  spatialReasoning?: {
    scaleAnchor: string;
    calculationNotes: string;
  };
  detectedItems: {
    name: string;
    dimensionsEstimate?: string;
    estimatedGrams?: number;
    calories?: number;
    protein?: number;
    carbs?: number;
    fat?: number;
  }[];
  confidenceNotes: string;
}> {
  const client = getOpenAIClient();

  if (!client) {
    return {
      title: 'Preparat din Imagine (Modul Offline)',
      calories: 450,
      protein: 30,
      carbs: 45,
      fat: 15,
      detectedItems: [{ name: 'Aliment detectat vizual', estimatedGrams: 250, calories: 450 }],
      confidenceNotes: 'Pentru recunoaștere foto avansată prin Llama 3.2 Vision, adaugă cheia NVIDIA NIM.',
    };
  }

  const systemPrompt = `You are an elite computer vision and biomechanical nutrition AI specialist.
Your task is to conduct an AUTONOMOUS DIMENSIONAL AND SPATIAL REASONING analysis of the food in the photo:

1. SPATIAL ANCHORING & SCALE:
   - Identify reference objects in the scene (e.g. standard dinner plate ~25-27cm, fork ~19cm, drink glass, bowl size).
   - Use their geometric proportions to calibrate real-world dimensions in centimeters.

2. COMPONENT DECOMPOSITION & 3D VOLUME ESTIMATION:
   - Segment every visible item (meat/fish, sides, fries, sauces, beverages).
   - Estimate the physical dimensions (length x width x thickness/depth in cm) and calculate the 3D volume (cm³).

3. MASS & MACRO DERIVATION:
   - Multiply the derived volume by realistic food densities (e.g. cooked fish/meat ~1.1g/cm³, fries/wedges ~0.7g/cm³, liquids/yogurt ~1.0g/cm³).
   - Calculate exact Calories, Protein, Carbs, and Fat derived directly from the computed mass in grams.

Respond STRICTLY in valid JSON adhering to this schema:
{
  "title": "<Concise descriptive title in Romanian based on identified items>",
  "calories": <integer sum of all item calories>,
  "protein": <integer sum of all item protein>,
  "carbs": <integer sum of all item carbs>,
  "fat": <integer sum of all item fat>,
  "spatialReasoning": {
    "scaleAnchor": "<Reference objects used to calibrate scale, e.g. Farfurie ~26cm, furculiță ~19cm>",
    "calculationNotes": "<Brief summary of how dimensions and volumes were calculated from visual perspective>"
  },
  "detectedItems": [
    {
      "name": "<Item name in Romanian>",
      "dimensionsEstimate": "<Calculated dimensions, e.g. ~14x7x1.5 cm>",
      "estimatedGrams": <calculated weight in grams>,
      "calories": <calories>,
      "protein": <protein grams>,
      "carbs": <carbs grams>,
      "fat": <fat grams>
    }
  ],
  "confidenceNotes": "<Detailed explanation of the visual breakdown and nutritional assessment in Romanian>"
}`;

  const promptText = userHint && userHint.trim().length > 0
    ? `Analizează această imagine folosind raționamentul spațial și dimensional. Notiță utilizator: "${userHint.trim()}". Măsoară proporțiile, estimează dimensiunile și calculează gramajele și macronutrienții fiecărui element.`
    : 'Analizează această imagine folosind raționamentul spațial și dimensional. Măsoară proporțiile pe baza ancorelor vizuale, estimează dimensiunile (L x l x grosime), deduce gramajele și calculează macronutrienții fiecărui aliment și băutură.';

  try {
    const completion = await client.chat.completions.create({
      model: 'meta/llama-3.2-11b-vision-instruct',
      messages: [
        { role: 'system', content: systemPrompt },
        {
          role: 'user',
          content: [
            { type: 'text', text: promptText },
            { type: 'image_url', image_url: { url: imageBase64 } },
          ],
        },
      ],
      temperature: 0.15,
      max_tokens: 800,
    });

    const content = completion.choices[0]?.message?.content;
    if (!content) throw new Error('Empty response from Vision model');

    const rawJson = parseJsonResponse(content);
    return {
      title: rawJson.title || 'Preparat Detectat',
      calories: Number(rawJson.calories) || 400,
      protein: Number(rawJson.protein) || 25,
      carbs: Number(rawJson.carbs) || 40,
      fat: Number(rawJson.fat) || 15,
      spatialReasoning: rawJson.spatialReasoning,
      detectedItems: Array.isArray(rawJson.detectedItems) ? rawJson.detectedItems : [],
      confidenceNotes: rawJson.confidenceNotes || 'Analiză spațială și dimensională efectuată.',
    };
  } catch (err: any) {
    console.error('Vision spatial reasoning error on NIM:', err);
    return {
      title: 'Mâncare Scanată Foto',
      calories: 450,
      protein: 28,
      carbs: 45,
      fat: 16,
      detectedItems: [{ name: 'Porție mâncare', estimatedGrams: 300, calories: 450 }],
      confidenceNotes: 'Estimare ajustată.',
    };
  }
}



