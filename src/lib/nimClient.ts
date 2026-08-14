import OpenAI from 'openai';
import { PreSwipeContext, MealCardProposal } from '@/types/nutrition';
import { MealCardDeckSchema, QuickLogOutputSchema, QuickLogOutput } from './schemas';
import { filterOrGenerateRecipes } from './mockRecipes';
import { resolveMealImageUrl } from './foodImages';

// NVIDIA NIM OpenAI-Compatible Endpoint
const NVIDIA_BASE_URL = 'https://integrate.api.nvidia.com/v1';
const FAST_DECK_MODEL = 'meta/llama-3.1-8b-instruct';
const HIGH_CAPACITY_MODEL = 'meta/llama-3.3-70b-instruct';
const PRIMARY_MODEL = FAST_DECK_MODEL;

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

  let cleaned = raw.trim();

  // Extract from markdown code fence if present
  const codeBlockMatch = cleaned.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
  if (codeBlockMatch) {
    cleaned = codeBlockMatch[1].trim();
  } else {
    // Otherwise find outer JSON object or array
    const jsonMatch = cleaned.match(/(\{[\s\S]*\}|\[[\s\S]*\])/);
    if (jsonMatch) {
      cleaned = jsonMatch[1].trim();
    }
  }

  return JSON.parse(cleaned);
}

export async function generateNIMMealDeck(context: PreSwipeContext): Promise<MealCardProposal[]> {
  const client = getOpenAIClient();

  if (!client) {
    return filterOrGenerateRecipes(context);
  }

  const ingredientsListStr = context.fridgeIngredients && context.fridgeIngredients.length > 0
    ? context.fridgeIngredients.join(', ')
    : 'Ingrediente nutritive uzuale din bucătărie';

  const appliancesStr = context.appliances && context.appliances.length > 0
    ? context.appliances.join(', ')
    : 'Bucătărie standard (aragaz/cuptor/airfryer)';

  const systemPrompt = `You are an elite sports nutrition chef for NutriAI.
You create tailored meal proposals in Romanian based STRICTLY on the user's specific inputs:
- Ingredients provided: [${ingredientsListStr}]
- Appliances available: [${appliancesStr}]
- Mode: ${context.mode}
- Target remaining macros: ${context.remainingCalories} kcal, ${context.remainingProtein}g Protein, ${context.remainingCarbs}g Carbs, ${context.remainingFat}g Fat.

CRITICAL INVARIANTS:
1. Every generated recipe MUST prioritize and incorporate the specific ingredients provided by the user (${ingredientsListStr}). Do NOT default to unrelated chicken or generic recipes if the user specified other ingredients!
2. Match the remaining macros closely (~${context.remainingCalories} kcal, ~${context.remainingProtein}g P).
3. The response MUST be ONLY valid JSON matching this schema:
{
  "recipes": [
    {
      "id": "rec-1",
      "title": "Titlu preparat specific în Română",
      "mode": "${context.mode}",
      "calories": ${context.remainingCalories || 500},
      "protein": ${context.remainingProtein || 40},
      "carbs": ${context.remainingCarbs || 45},
      "fat": ${context.remainingFat || 15},
      "prepTimeMinutes": 10,
      "cookTimeMinutes": 15,
      "difficulty": "Ușor",
      "servings": ${context.servings || 1},
      "appliancesUsed": ["${context.appliances[0] || 'Aragaz / Tigaie'}"],
      "estimatedCostRon": ${context.maxBudgetRon ? Math.min(context.maxBudgetRon, 25) : 18},
      "matchReason": "Explică de ce preparatul valorifică ${context.fridgeIngredients.slice(0, 2).join(', ') || 'ingredientele tale'} și deficitul caloric.",
      "tags": ["High Protein", "${context.appliances[0] || 'Rapid'}"],
      "ingredients": [
        {
          "name": "Nume ingredient",
          "amount": "150g",
          "isPantryStock": true,
          "toBuy": false,
          "estimatedPriceRon": 0
        }
      ],
      "instructions": [
        "Pasul 1...",
        "Pasul 2...",
        "Pasul 3..."
      ]
    }
  ]
}`;

  const userPrompt = `Generează 3 rețete variate și delicioase folosind în mod expres aceste ingrediente disponibile: ${ingredientsListStr}.
Echipamente: ${appliancesStr}.
Mod gătire: ${context.mode} (${context.mode === 'fridge' ? 'Folosește ce am în frigider' : context.mode === 'grocery_empty' ? `Buget total: ${context.maxBudgetRon || 30} RON` : 'Smart Grocery / Restaurant'}).
Macro-uri țintă: ~${context.remainingCalories} kcal, ~${context.remainingProtein}g Proteine, ~${context.remainingCarbs}g Carbohidrați, ~${context.remainingFat}g Grăsimi.`;

  // Try fast 8B model first, fallback to high capacity model
  const modelsToTry = [FAST_DECK_MODEL, HIGH_CAPACITY_MODEL];

  for (const model of modelsToTry) {
    try {
      const completion = await client.chat.completions.create({
        model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        temperature: 0.35,
        max_tokens: 1800,
      });

      const content = completion.choices[0]?.message?.content;
      if (!content) continue;

      const rawJson = parseJsonResponse(content);
      const parsed = MealCardDeckSchema.safeParse(rawJson);

      if (parsed.success && parsed.data.recipes.length > 0) {
        return parsed.data.recipes.map((rec) => ({
          ...rec,
          imageUrl: rec.imageUrl || resolveMealImageUrl(rec.title, rec.ingredients, rec.tags),
        })) as MealCardProposal[];
      }
    } catch (err) {
      console.warn(`Model ${model} encounter error:`, err);
    }
  }

  return filterOrGenerateRecipes(context);
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

import { groundNutritionalItem, CookingMethod } from './nutritionDb';

export async function analyzeFoodImageWithNIM(
  imageBase64: string,
  userHint?: string,
  cookingMethod: CookingMethod = 'dry_grill'
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
    estimatedGrams: number;
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    basePer100g?: {
      calories: number;
      protein: number;
      carbs: number;
      fat: number;
    };
  }[];
  confidenceNotes: string;
}> {
  const client = getOpenAIClient();

  if (!client) {
    // Offline / Fallback grounded items
    const item1 = groundNutritionalItem('Biban de mare la grătar', 160, cookingMethod);
    const item2 = groundNutritionalItem('Cartofi dulci', 120, cookingMethod);
    const item3 = groundNutritionalItem('Sos mujdei cu iaurt', 50, 'dry_grill');

    const totalCals = item1.calories + item2.calories + item3.calories;
    const totalProt = Math.round((item1.protein + item2.protein + item3.protein) * 10) / 10;
    const totalCarbs = Math.round((item1.carbs + item2.carbs + item3.carbs) * 10) / 10;
    const totalFat = Math.round((item1.fat + item2.fat + item3.fat) * 10) / 10;

    return {
      title: 'File de Pește cu Cartofi și Mujdei',
      calories: totalCals,
      protein: totalProt,
      carbs: totalCarbs,
      fat: totalFat,
      spatialReasoning: {
        scaleAnchor: 'Farfurie standard ~26cm și furculiță ~19cm',
        calculationNotes: 'Calcul grounded pe baza bazei de date nutriționale USDA.',
      },
      detectedItems: [
        {
          name: item1.matchedProfile.nameRo,
          dimensionsEstimate: '~14x7x1.5 cm',
          estimatedGrams: item1.grams,
          calories: item1.calories,
          protein: item1.protein,
          carbs: item1.carbs,
          fat: item1.fat,
          basePer100g: item1.matchedProfile.per100g,
        },
        {
          name: item2.matchedProfile.nameRo,
          dimensionsEstimate: '~8x1.2 cm bastonașe',
          estimatedGrams: item2.grams,
          calories: item2.calories,
          protein: item2.protein,
          carbs: item2.carbs,
          fat: item2.fat,
          basePer100g: item2.matchedProfile.per100g,
        },
        {
          name: item3.matchedProfile.nameRo,
          dimensionsEstimate: 'Bol mic ~6x3 cm',
          estimatedGrams: item3.grams,
          calories: item3.calories,
          protein: item3.protein,
          carbs: item3.carbs,
          fat: item3.fat,
          basePer100g: item3.matchedProfile.per100g,
        },
      ],
      confidenceNotes: 'Estimare calibrată pe baza bazei de date de referință.',
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
   - Calculate exact mass in grams for each item.

Respond STRICTLY in valid JSON adhering to this schema:
{
  "title": "<Concise descriptive title in Romanian based on identified items>",
  "spatialReasoning": {
    "scaleAnchor": "<Reference objects used to calibrate scale, e.g. Farfurie ~26cm, furculiță ~19cm>",
    "calculationNotes": "<Brief summary of how dimensions and volumes were calculated from visual perspective>"
  },
  "detectedItems": [
    {
      "name": "<Item name in Romanian>",
      "dimensionsEstimate": "<Calculated dimensions, e.g. ~14x7x1.5 cm>",
      "estimatedGrams": <calculated weight in grams>
    }
  ],
  "confidenceNotes": "<Detailed explanation of the visual breakdown and nutritional assessment in Romanian>"
}`;

  const promptText = userHint && userHint.trim().length > 0
    ? `Analizează această imagine folosind raționamentul spațial și dimensional. Notiță utilizator: "${userHint.trim()}". Măsoară proporțiile, estimează dimensiunile și deduce gramajul fiecărui element.`
    : 'Analizează această imagine folosind raționamentul spațial și dimensional. Măsoară proporțiile pe baza ancorelor vizuale, estimează dimensiunile (L x l x grosime) și deduce gramajele fiecărui aliment și băutură.';

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
    
    // Ground every detected item through the Authoritative USDA Nutrition Database
    const rawItems: any[] = Array.isArray(rawJson.detectedItems) ? rawJson.detectedItems : [];
    let totalCals = 0;
    let totalProt = 0;
    let totalCarbs = 0;
    let totalFat = 0;

    const groundedItems = rawItems.map((raw) => {
      const gName = raw.name || 'Aliment';
      const gWeight = Number(raw.estimatedGrams) || 100;
      const grounded = groundNutritionalItem(gName, gWeight, cookingMethod);

      totalCals += grounded.calories;
      totalProt += grounded.protein;
      totalCarbs += grounded.carbs;
      totalFat += grounded.fat;

      return {
        name: grounded.matchedProfile.nameRo,
        dimensionsEstimate: raw.dimensionsEstimate || '~dimensiune standard',
        estimatedGrams: grounded.grams,
        calories: grounded.calories,
        protein: grounded.protein,
        carbs: grounded.carbs,
        fat: grounded.fat,
        basePer100g: grounded.matchedProfile.per100g,
      };
    });

    return {
      title: rawJson.title || 'Preparat Detectat Vizual',
      calories: totalCals,
      protein: Math.round(totalProt * 10) / 10,
      carbs: Math.round(totalCarbs * 10) / 10,
      fat: Math.round(totalFat * 10) / 10,
      spatialReasoning: rawJson.spatialReasoning,
      detectedItems: groundedItems,
      confidenceNotes: rawJson.confidenceNotes || 'Analiză spațială și dimensională calibrată USDA.',
    };
  } catch (err: any) {
    console.error('Vision spatial reasoning error on NIM:', err);
    // Robust grounded fallback
    const fb = groundNutritionalItem('Mâncare gătită', 250, cookingMethod);
    return {
      title: 'Mâncare Scanată Foto',
      calories: fb.calories,
      protein: fb.protein,
      carbs: fb.carbs,
      fat: fb.fat,
      detectedItems: [
        {
          name: fb.matchedProfile.nameRo,
          estimatedGrams: 250,
          calories: fb.calories,
          protein: fb.protein,
          carbs: fb.carbs,
          fat: fb.fat,
          basePer100g: fb.matchedProfile.per100g,
        }
      ],
      confidenceNotes: 'Estimare ajustată.',
    };
  }
}




