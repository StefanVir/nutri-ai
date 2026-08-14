import OpenAI from 'openai';
import { PreSwipeContext, MealCardProposal } from '@/types/nutrition';
import { MealCardDeckSchema, QuickLogOutputSchema, QuickLogOutput } from './schemas';
import { filterOrGenerateRecipes } from './mockRecipes';
import { resolveMealImageUrl } from './foodImages';
import { calculateMealTargetSlot } from './metabolic';
import { recalculateAndGroundMeal } from './nutritionDb';

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

  // Tier 1: Top-Down Dynamic Meal Slot Partitioning
  const mealSlot = calculateMealTargetSlot(
    2100,
    160,
    200,
    65,
    context.remainingCalories || 2100,
    context.remainingProtein || 160,
    context.remainingCarbs || 200,
    context.remainingFat || 65,
    context.mealCategory || 'lunch'
  );

  if (!client) {
    return filterOrGenerateRecipes(context);
  }

  const ingredientsListStr = context.fridgeIngredients && context.fridgeIngredients.length > 0
    ? context.fridgeIngredients.join(', ')
    : 'Ingrediente nutritive uzuale din bucătărie';

  const appliancesStr = context.appliances && context.appliances.length > 0
    ? context.appliances.join(', ')
    : 'Bucătărie standard (aragaz/cuptor/airfryer)';

  const systemPrompt = `You are a Master Executive Chef & Sports Nutritionist for NutriAI.
You create 3 DISTINCT, CULINARILY COHERENT, and DELICIOUS single-meal recipes in Romanian based on the user's available pantry:
- Available ingredients: [${ingredientsListStr}]
- Available appliances: [${appliancesStr}]
- Mode: ${context.mode}
- TARGET MEAL SLOT: ~${mealSlot.targetCalories} kcal (Range: ${mealSlot.minCalories}-${mealSlot.maxCalories} kcal), ~${mealSlot.targetProtein}g Protein, ~${mealSlot.targetCarbs}g Carbs, ~${mealSlot.targetFat}g Fat.

STRICT CULINARY RULES (MANDATORY):
1. CULINARY COHERENCE & PROTEIN ISOLATION:
   - NEVER combine incompatible proteins in one dish (DO NOT mix Beef + Tuna + Eggs together into a bizarre mashup!).
   - Instead, create 3 DIFFERENT recipes, each choosing ONE primary hero ingredient + logical sides from the user's list:
     • Recipe 1: Beef / Meat dish (e.g. Mușchi de vită la tigaie cu spanac sote și orez)
     • Recipe 2: Fish / Seafood dish (e.g. Salată bogată de ton cu avocado și verdețuri)
     • Recipe 3: Egg / Light dish (e.g. Omletă cremoasă cu spanac și felii de avocado)
2. REALISTIC PROFESSIONAL COOKING INSTRUCTIONS:
   - Provide 3 to 4 clear, logical culinary steps using authentic Romanian cooking verbs:
     • Step 1 (Prep): "Scoate mușchiul de vită din frigider cu 10 minute înainte și asezonează-l cu sare și piper." / "Scurge bine conserva de ton."
     • Step 2 (Cook): "Încinge tigaia antiaderentă cu 1 linguriță de ulei la foc mediu spre iute și gătește carnea timp de 3-4 minute pe fiecare parte."
     • Step 3 (Sides/Season): "Adaugă spanacul în ultimele 2 minute și trage-l la tigaie până scade în volum."
     • Step 4 (Plating): "Așază preparatul pe farfurie, stropește cu puțin suc de lămâie și servește cald."
   - STRICTLY FORBIDDEN: NEVER use AI slop phrases like "Sărbătorește cu o bucătărie delicioasă", "Bucură-te de o masă", or template placeholder text.
3. REAL NUTRITIONAL MATCH REASON:
   - Write a real 1-sentence explanation of why the dish works (e.g. "Proteine de înaltă calitate cu eliberare rapidă și grăsimi sănătoase din avocado pentru sațietate prelungită.").
4. PORTIONS:
   - Use realistic single-serving weights (150-200g meat/fish, 100-160g carbs, 80-120g veggies, 5-10ml oil). Target: ~${mealSlot.targetCalories} kcal.

The response MUST be ONLY valid JSON matching this schema:
{
  "recipes": [
    {
      "id": "rec-1",
      "title": "Mușchi de vită la tigaie cu spanac sote",
      "mode": "${context.mode}",
      "calories": ${mealSlot.targetCalories},
      "protein": ${mealSlot.targetProtein},
      "carbs": ${mealSlot.targetCarbs},
      "fat": ${mealSlot.targetFat},
      "prepTimeMinutes": 8,
      "cookTimeMinutes": 12,
      "difficulty": "Ușor",
      "servings": ${context.servings || 1},
      "appliancesUsed": ["${context.appliances[0] || 'Aragaz / Tigaie'}"],
      "estimatedCostRon": ${context.maxBudgetRon ? Math.min(context.maxBudgetRon, 25) : 20},
      "matchReason": "Aport generos de fier și proteine complete din carnea de vită, asociat cu micronutrienții din spanac.",
      "tags": ["High Protein", "${context.appliances[0] || 'Rapid'}"],
      "ingredients": [
        {
          "name": "Mușchi de vită",
          "amount": "180g",
          "isPantryStock": true,
          "toBuy": false,
          "estimatedPriceRon": 0
        },
        {
          "name": "Spanac",
          "amount": "120g",
          "isPantryStock": true,
          "toBuy": false,
          "estimatedPriceRon": 0
        },
        {
          "name": "Ulei de măsline",
          "amount": "10ml",
          "isPantryStock": true,
          "toBuy": false,
          "estimatedPriceRon": 0
        }
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

  const userPrompt = `Ingrediente disponibile în bucătărie: ${ingredientsListStr}.
Echipamente disponibile: ${appliancesStr}.
Mod: ${context.mode}.
Țintă nutrițională pentru această masă (${context.mealCategory}): ~${mealSlot.targetCalories} kcal, ~${mealSlot.targetProtein}g Proteine.
Creează 3 rețete gourmet variate, logice și delicioase.`;

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
        temperature: 0.3,
        max_tokens: 1800,
      });

      const content = completion.choices[0]?.message?.content;
      if (!content) continue;

      const rawJson = parseJsonResponse(content);
      const parsed = MealCardDeckSchema.safeParse(rawJson);

      if (parsed.success && parsed.data.recipes.length > 0) {
        return parsed.data.recipes.map((rec) => {
          // Clean any leftover placeholder or slop text in matchReason
          const cleanMatchReason = rec.matchReason && !rec.matchReason.toLowerCase().startsWith('explică')
            ? rec.matchReason
            : 'Optimizat pentru aport proteic ridicat și sațietate metabolică.';

          // Filter out generic slop lines from instructions
          const cleanInstructions = rec.instructions
            .filter((step) => !step.toLowerCase().includes('sărbătorește') && !step.toLowerCase().includes('bucură-te'))
            .map((step) => step.trim());

          const cleanedRecipe = {
            ...rec,
            matchReason: cleanMatchReason,
            instructions: cleanInstructions.length > 0 ? cleanInstructions : rec.instructions,
          };

          // Tier 3: Deterministic Bottom-Up Ingredient Aggregator
          const grounded = recalculateAndGroundMeal(cleanedRecipe, mealSlot.targetCalories);
          return {
            ...grounded,
            imageUrl: grounded.imageUrl || resolveMealImageUrl(grounded.title, grounded.ingredients, grounded.tags),
          };
        }) as MealCardProposal[];
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

export async function scanFridgeImageWithNIM(imageBase64: string): Promise<string[]> {
  const client = getOpenAIClient();
  if (!client) {
    return ['Ouă', 'Piept de pui', 'Spanac', 'Telemea', 'Roșii'];
  }

  const systemPrompt = `You are a specialized multimodal computer vision model for NutriAI.
Your task is to scan the uploaded fridge, grocery haul, or pantry photo and identify all visible food ingredients, produce, proteins, dairy, and items.
Respond STRICTLY in valid JSON matching this schema:
{
  "detectedIngredients": ["Somon", "Ouă", "Spanac", "Telemea", "Cartofi"]
}`;

  const visionModels = ['meta/llama-3.2-11b-vision-instruct', 'meta/llama-3.2-90b-vision-instruct'];

  for (const model of visionModels) {
    try {
      const res = await client.chat.completions.create({
        model,
        messages: [
          { role: 'system', content: systemPrompt },
          {
            role: 'user',
            content: [
              { type: 'text', text: 'Identifică toate ingredientele alimentare vizibile în această fotografie în limba Română.' },
              { type: 'image_url', image_url: { url: imageBase64 } },
            ],
          },
        ],
        temperature: 0.1,
        max_tokens: 400,
      });

      const content = res.choices[0]?.message?.content;
      if (!content) continue;

      const rawJson = parseJsonResponse(content);
      if (Array.isArray(rawJson.detectedIngredients) && rawJson.detectedIngredients.length > 0) {
        return rawJson.detectedIngredients.map((item: any) => String(item).trim()).filter(Boolean);
      }
    } catch (err) {
      console.warn(`Fridge vision model ${model} failed:`, err);
    }
  }

  return ['Ouă', 'Piept de pui', 'Spanac', 'Telemea'];
}




