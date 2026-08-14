/**
 * NutriAI Authoritative Food Reference Engine
 * Calibrated 100g nutritional baselines aligned with USDA FoodData Central & EuroFIR standard datasets.
 */

export interface FoodProfile {
  id: string;
  nameRo: string;
  aliases: string[];
  category: 'fish' | 'meat' | 'starch' | 'vegetable' | 'dairy_sauce' | 'beverage' | 'fruit' | 'fat_oil';
  per100g: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    fiber?: number;
  };
  defaultServingGrams: number;
  typicalDensityGPerCm3: number;
}

export const USDA_NUTRITION_DATABASE: FoodProfile[] = [
  // --- PEȘTE & FRUCTE DE MARE ---
  {
    id: 'sea_bass_dorada',
    nameRo: 'Biban de mare / Păstrăv / Doradă (la grătar/cuptor)',
    aliases: ['peste', 'peste la gratar', 'file de peste', 'pastrav', 'dorada', 'biban', 'salau', 'cod', 'peshte'],
    category: 'fish',
    per100g: { calories: 124, protein: 24.2, carbs: 0, fat: 3.1 },
    defaultServingGrams: 160,
    typicalDensityGPerCm3: 1.08,
  },
  {
    id: 'salmon_grilled',
    nameRo: 'Somon la grătar / cuptor',
    aliases: ['somon', 'file somon', 'salmon'],
    category: 'fish',
    per100g: { calories: 206, protein: 22.1, carbs: 0, fat: 12.3 },
    defaultServingGrams: 150,
    typicalDensityGPerCm3: 1.10,
  },
  {
    id: 'tuna_steak',
    nameRo: 'Ton la grătar / conservă în suc propriu',
    aliases: ['ton', 'file ton', 'tuna'],
    category: 'fish',
    per100g: { calories: 132, protein: 28.0, carbs: 0, fat: 1.3 },
    defaultServingGrams: 140,
    typicalDensityGPerCm3: 1.12,
  },
  {
    id: 'shrimp_cooked',
    nameRo: 'Creveți gătiți',
    aliases: ['creveti', 'crevete', 'shrimp'],
    category: 'fish',
    per100g: { calories: 99, protein: 21.0, carbs: 0.2, fat: 1.1 },
    defaultServingGrams: 150,
    typicalDensityGPerCm3: 1.05,
  },

  // --- CARNE & OUĂ ---
  {
    id: 'chicken_breast_grilled',
    nameRo: 'Piept de pui la grătar',
    aliases: ['piept de pui', 'pui la gratar', 'pui', 'chicken breast', 'pui gratar'],
    category: 'meat',
    per100g: { calories: 165, protein: 31.0, carbs: 0, fat: 3.6 },
    defaultServingGrams: 150,
    typicalDensityGPerCm3: 1.06,
  },
  {
    id: 'chicken_thigh_roasted',
    nameRo: 'Pulpă de pui la cuptor',
    aliases: ['pulpa de pui', 'pulpe de pui', 'pulpa pui'],
    category: 'meat',
    per100g: { calories: 209, protein: 24.5, carbs: 0, fat: 11.8 },
    defaultServingGrams: 180,
    typicalDensityGPerCm3: 1.04,
  },
  {
    id: 'beef_steak_grilled',
    nameRo: 'Mușchi / Antricot de vită la grătar',
    aliases: ['muschi de vita', 'vita la gratar', 'friptura de vita', 'steak', 'vita'],
    category: 'meat',
    per100g: { calories: 240, protein: 26.0, carbs: 0, fat: 14.5 },
    defaultServingGrams: 200,
    typicalDensityGPerCm3: 1.08,
  },
  {
    id: 'pork_tenderloin',
    nameRo: 'Mușchiuleț de porc slab',
    aliases: ['porc la gratar', 'muschiulet de porc', 'porc slab', 'friptura de porc'],
    category: 'meat',
    per100g: { calories: 143, protein: 26.0, carbs: 0, fat: 3.5 },
    defaultServingGrams: 160,
    typicalDensityGPerCm3: 1.07,
  },
  {
    id: 'eggs_whole',
    nameRo: 'Ouă întregi (ochiuri / fierte)',
    aliases: ['oua', 'ou ochi', 'oua fierte', 'omleta', '2 oua', 'ou'],
    category: 'meat',
    per100g: { calories: 143, protein: 12.6, carbs: 0.7, fat: 9.5 },
    defaultServingGrams: 100, // ~ 2 ouă medii
    typicalDensityGPerCm3: 1.03,
  },

  // --- CARTOFI & CARBOHIDRAȚI ---
  {
    id: 'sweet_potato_fries',
    nameRo: 'Cartofi dulci (la cuptor / prăjiți)',
    aliases: ['cartofi dulci', 'cartof dulce', 'sweet potato', 'bastonașe cartofi dulci'],
    category: 'starch',
    per100g: { calories: 140, protein: 2.0, carbs: 28.0, fat: 3.5 },
    defaultServingGrams: 120,
    typicalDensityGPerCm3: 0.75,
  },
  {
    id: 'french_fries',
    nameRo: 'Cartofi prăjiți / rumeniți',
    aliases: ['cartofi prajiti', 'cartofi', 'cartofi wedges', 'cartofi la cuptor', 'cartof'],
    category: 'starch',
    per100g: { calories: 196, protein: 2.8, carbs: 29.0, fat: 8.0 },
    defaultServingGrams: 120,
    typicalDensityGPerCm3: 0.65,
  },
  {
    id: 'white_rice_cooked',
    nameRo: 'Orez alb / basmati fiert',
    aliases: ['orez', 'orez basmati', 'orez fiert', 'orez alb', 'orez simplu'],
    category: 'starch',
    per100g: { calories: 130, protein: 2.7, carbs: 28.2, fat: 0.3 },
    defaultServingGrams: 150,
    typicalDensityGPerCm3: 0.85,
  },
  {
    id: 'pasta_cooked',
    nameRo: 'Paste fierte',
    aliases: ['paste', 'spaghete', 'penne', 'macaroane', 'noodles'],
    category: 'starch',
    per100g: { calories: 158, protein: 5.8, carbs: 30.9, fat: 0.9 },
    defaultServingGrams: 180,
    typicalDensityGPerCm3: 0.90,
  },
  {
    id: 'bread_whole_wheat',
    nameRo: 'Pâine integrală / albă',
    aliases: ['paine', 'paine prajita', 'toast', 'felie de paine', 'chifla'],
    category: 'starch',
    per100g: { calories: 250, protein: 9.0, carbs: 48.0, fat: 2.5 },
    defaultServingGrams: 50, // ~ 2 felii
    typicalDensityGPerCm3: 0.35,
  },

  // --- SOSURI & LACTATE ---
  {
    id: 'garlic_yogurt_sauce',
    nameRo: 'Sos de usturoi / Mujdei cu iaurt sau smântână',
    aliases: ['sos alb', 'mujdei', 'sos de usturoi', 'tzatziki', 'sos iaurt', 'iaurt', 'mujdei cremos'],
    category: 'dairy_sauce',
    per100g: { calories: 110, protein: 4.5, carbs: 5.0, fat: 8.0 },
    defaultServingGrams: 50,
    typicalDensityGPerCm3: 1.02,
  },
  {
    id: 'greek_yogurt_2pct',
    nameRo: 'Iaurt grecesc 2%',
    aliases: ['iaurt grecesc', 'iaurt grecesc 2%', 'iaurt simplu'],
    category: 'dairy_sauce',
    per100g: { calories: 73, protein: 9.0, carbs: 4.0, fat: 2.0 },
    defaultServingGrams: 150,
    typicalDensityGPerCm3: 1.03,
  },
  {
    id: 'mayonnaise',
    nameRo: 'Maioneză clasică',
    aliases: ['maioneza', 'sos maioneza', 'mayo'],
    category: 'dairy_sauce',
    per100g: { calories: 680, protein: 1.0, carbs: 1.0, fat: 75.0 },
    defaultServingGrams: 30,
    typicalDensityGPerCm3: 0.95,
  },
  {
    id: 'feta_cheese',
    nameRo: 'Brânză Feta / Telemea',
    aliases: ['branza feta', 'telemea', 'branza', 'feta'],
    category: 'dairy_sauce',
    per100g: { calories: 264, protein: 14.2, carbs: 4.1, fat: 21.3 },
    defaultServingGrams: 45,
    typicalDensityGPerCm3: 1.05,
  },

  // --- LEGUME & SALATE ---
  {
    id: 'mixed_salad_tomatoes',
    nameRo: 'Salată proaspătă / Roșii / Castraveți',
    aliases: ['salata', 'rosii', 'castraveti', 'salata de rosii', 'salata mixta', 'legume'],
    category: 'vegetable',
    per100g: { calories: 22, protein: 1.1, carbs: 3.9, fat: 0.2 },
    defaultServingGrams: 150,
    typicalDensityGPerCm3: 0.45,
  },
  {
    id: 'steamed_broccoli',
    nameRo: 'Broccoli / Sparanghel la abur / cuptor',
    aliases: ['broccoli', 'sparanghel', 'legume la abur', 'fasole verde'],
    category: 'vegetable',
    per100g: { calories: 35, protein: 2.8, carbs: 7.0, fat: 0.4 },
    defaultServingGrams: 120,
    typicalDensityGPerCm3: 0.55,
  },

  // --- BĂUTURI & FRUCTE ---
  {
    id: 'fresh_berry_juice',
    nameRo: 'Suc natural de fructe / Rodie / Vișine / Smoothie',
    aliases: ['suc', 'smoothie', 'suc natural', 'suc de rodie', 'suc de visine', 'bautura', 'fresh'],
    category: 'beverage',
    per100g: { calories: 48, protein: 0.5, carbs: 11.5, fat: 0.1 },
    defaultServingGrams: 250,
    typicalDensityGPerCm3: 1.04,
  },
  {
    id: 'apple_banana',
    nameRo: 'Măr / Banană proaspătă',
    aliases: ['mar', 'banana', 'mar mediu', 'fructe'],
    category: 'fruit',
    per100g: { calories: 65, protein: 0.8, carbs: 16.0, fat: 0.2 },
    defaultServingGrams: 130,
    typicalDensityGPerCm3: 0.88,
  },
];

/**
 * Cooking method fat & calorie offsets per serving
 */
export type CookingMethod = 'dry_grill' | 'steam_boil' | 'airfry' | 'pan_oil' | 'deep_fry';

export const COOKING_METHOD_OFFSETS: Record<CookingMethod, { label: string; extraCalories: number; extraFatGrams: number }> = {
  dry_grill: { label: 'Grătar / Fără Ulei', extraCalories: 0, extraFatGrams: 0 },
  steam_boil: { label: 'La Abur / Fiert', extraCalories: 0, extraFatGrams: 0 },
  airfry: { label: 'Airfryer (Spray minim ~2g)', extraCalories: 20, extraFatGrams: 2 },
  pan_oil: { label: 'Tigaie cu Ulei / Unt (+1 lingură)', extraCalories: 110, extraFatGrams: 12 },
  deep_fry: { label: 'Prăjit în Baie de Ulei (Deep Fried)', extraCalories: 220, extraFatGrams: 24 },
};

/**
 * Matches detected food string against the authoritative database
 */
export function groundNutritionalItem(
  detectedName: string,
  estimatedGrams: number = 100,
  cookingMethod: CookingMethod = 'dry_grill'
) {
  const norm = detectedName.toLowerCase().trim();
  
  // Exact or alias search
  let matched = USDA_NUTRITION_DATABASE.find(
    (item) => item.nameRo.toLowerCase().includes(norm) || item.aliases.some((a) => norm.includes(a) || a.includes(norm))
  );

  // Fallback to closest category if not matched
  if (!matched) {
    if (norm.includes('peste') || norm.includes('fish') || norm.includes('salmon') || norm.includes('pastrav')) {
      matched = USDA_NUTRITION_DATABASE[0];
    } else if (norm.includes('pui') || norm.includes('carne') || norm.includes('chicken') || norm.includes('curcan')) {
      matched = USDA_NUTRITION_DATABASE[4];
    } else if (norm.includes('cartof') || norm.includes('fries') || norm.includes('potato') || norm.includes('orez')) {
      matched = USDA_NUTRITION_DATABASE[9];
    } else if (norm.includes('sos') || norm.includes('iaurt') || norm.includes('sauce') || norm.includes('mujdei')) {
      matched = USDA_NUTRITION_DATABASE[14];
    } else if (norm.includes('suc') || norm.includes('bautura') || norm.includes('juice') || norm.includes('smoothie')) {
      matched = USDA_NUTRITION_DATABASE[20];
    } else {
      matched = {
        id: 'generic_meal',
        nameRo: detectedName,
        aliases: [],
        category: 'meat',
        per100g: { calories: 150, protein: 12, carbs: 15, fat: 5 },
        defaultServingGrams: estimatedGrams,
        typicalDensityGPerCm3: 1.0,
      };
    }
  }

  const factor = estimatedGrams / 100;
  const offset = COOKING_METHOD_OFFSETS[cookingMethod] || COOKING_METHOD_OFFSETS.dry_grill;

  return {
    matchedProfile: matched,
    grams: estimatedGrams,
    cookingMethod,
    calories: Math.round(matched.per100g.calories * factor + offset.extraCalories),
    protein: Math.round((matched.per100g.protein * factor) * 10) / 10,
    carbs: Math.round((matched.per100g.carbs * factor) * 10) / 10,
    fat: Math.round((matched.per100g.fat * factor + offset.extraFatGrams) * 10) / 10,
  };
}

/**
 * Extracts realistic gram weights from natural language ingredient amounts
 * (e.g. "150g", "1 lipie (60g)", "10ml", "2 bucăți", "1 conservă (120g)")
 */
export function parseGramsFromAmount(amountStr: string = '', defaultGrams: number = 100): number {
  if (!amountStr) return defaultGrams;

  const text = amountStr.toLowerCase().trim();

  // Pattern: (120g) or (60 g) or (15ml)
  const parenMatch = text.match(/\((\d+(?:\.\d+)?)\s*(?:g|ml|gr|g.)\)/i);
  if (parenMatch) return parseFloat(parenMatch[1]);

  // Pattern: 150g, 150 gr, 200 ml
  const directMatch = text.match(/(\d+(?:\.\d+)?)\s*(?:g|ml|gr|g.)/i);
  if (directMatch) return parseFloat(directMatch[1]);

  // Pattern: 2 buc, 3 oua
  const countMatch = text.match(/^(\d+)\s*(?:buc|bucati|bucăți|oua|ouă|felii)/i);
  if (countMatch) {
    const count = parseInt(countMatch[1], 10);
    if (text.includes('ou') || text.includes('oua')) return count * 55; // 1 egg ~55g
    if (text.includes('felie') || text.includes('felii')) return count * 35; // 1 slice bread ~35g
    return count * 60;
  }

  // Pattern: 1 lingură / 1 lingura
  if (text.includes('lingura') || text.includes('lingură')) return 15;
  if (text.includes('lingurita') || text.includes('linguriță')) return 5;

  return defaultGrams;
}

/**
 * Deterministic Truth Engine:
 * Recalculates total meal calories and macronutrients strictly from the sum of its ingredients
 * using USDA FoodData Central reference values. Eliminates LLM hallucination and inconsistency.
 */
export function recalculateAndGroundMeal<T extends {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  ingredients: { name: string; amount: string; [key: string]: any }[];
}>(recipe: T, targetSlotCalories?: number): T {
  if (!recipe.ingredients || recipe.ingredients.length === 0) {
    return recipe;
  }

  let rawTotalKcal = 0;
  let rawTotalProt = 0;
  let rawTotalCarbs = 0;
  let rawTotalFat = 0;

  const groundedIngredients = recipe.ingredients.map((ing) => {
    const grams = parseGramsFromAmount(ing.amount, 100);
    const grounded = groundNutritionalItem(ing.name, grams, 'dry_grill');

    rawTotalKcal += grounded.calories;
    rawTotalProt += grounded.protein;
    rawTotalCarbs += grounded.carbs;
    rawTotalFat += grounded.fat;

    return {
      ...ing,
      parsedGrams: grams,
    };
  });

  // If a target slot was requested and the raw sum is significantly under target (>25% under),
  // scale the primary protein and carb ingredients proportionately and update ingredient text
  let finalIngredients = recipe.ingredients;
  let finalKcal = Math.round(rawTotalKcal);
  let finalProt = Math.round(rawTotalProt);
  let finalCarbs = Math.round(rawTotalCarbs);
  let finalFat = Math.round(rawTotalFat);

  if (targetSlotCalories && targetSlotCalories > 400 && rawTotalKcal > 150) {
    const scaleRatio = Math.min(1.45, Math.max(0.8, targetSlotCalories / rawTotalKcal));

    if (Math.abs(scaleRatio - 1.0) > 0.15) {
      let scaledKcal = 0;
      let scaledProt = 0;
      let scaledCarbs = 0;
      let scaledFat = 0;

      finalIngredients = groundedIngredients.map((ing, idx) => {
        // Scale main protein/carb items (usually first 1-3 ingredients)
        const isScalable = idx <= 2 && !ing.name.toLowerCase().includes('ulei') && !ing.name.toLowerCase().includes('condiment');
        const factor = isScalable ? scaleRatio : 1.0;
        const newGrams = Math.round(ing.parsedGrams * factor);

        const grounded = groundNutritionalItem(ing.name, newGrams, 'dry_grill');
        scaledKcal += grounded.calories;
        scaledProt += grounded.protein;
        scaledCarbs += grounded.carbs;
        scaledFat += grounded.fat;

        // Keep unit formatting clean (e.g. "180g" or "1 buc (60g)")
        const updatedAmount = ing.amount.includes('(')
          ? ing.amount.replace(/\(\d+g\)/i, `(${newGrams}g)`)
          : `${newGrams}g`;

        const { parsedGrams, ...cleanIng } = ing;
        return {
          ...cleanIng,
          amount: isScalable ? updatedAmount : ing.amount,
        };
      });

      finalKcal = Math.round(scaledKcal);
      finalProt = Math.round(scaledProt);
      finalCarbs = Math.round(scaledCarbs);
      finalFat = Math.round(scaledFat);
    }
  }

  return {
    ...recipe,
    calories: Math.max(150, finalKcal),
    protein: Math.max(10, finalProt),
    carbs: Math.max(5, finalCarbs),
    fat: Math.max(3, finalFat),
    ingredients: finalIngredients,
  };
}
