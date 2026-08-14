import OpenAI from 'openai';
import fs from 'fs';

const envContent = fs.readFileSync('.env.local', 'utf8');
const match = envContent.match(/NVIDIA_NIM_API_KEY=(.*)/);
const apiKey = match ? match[1].trim() : process.env.NVIDIA_NIM_API_KEY;

const client = new OpenAI({
  apiKey,
  baseURL: 'https://integrate.api.nvidia.com/v1',
});

function calculateMealTargetSlot(
  dailyCalorieTarget = 2100,
  dailyProteinTarget = 160,
  dailyCarbsTarget = 200,
  dailyFatTarget = 65,
  remainingCalories = 2100,
  remainingProtein = 160,
  remainingCarbs = 200,
  remainingFat = 65,
  category = 'lunch'
) {
  const SLOT_RATIOS = {
    breakfast: 0.28,
    lunch: 0.36,
    dinner: 0.28,
    snack: 0.08,
  };

  const standardRatio = SLOT_RATIOS[category] || 0.30;
  const baseKcal = Math.round(dailyCalorieTarget * standardRatio);
  const baseProt = Math.round(dailyProteinTarget * standardRatio);
  const baseCarbs = Math.round(dailyCarbsTarget * standardRatio);
  const baseFat = Math.round(dailyFatTarget * standardRatio);

  const minKcal = category === 'snack' ? 150 : 350;
  const maxKcal = category === 'snack' ? 400 : 900;

  const targetKcal = Math.min(
    maxKcal,
    Math.max(minKcal, Math.min(baseKcal, remainingCalories > 0 ? remainingCalories : baseKcal))
  );

  const targetProt = Math.min(
    75,
    Math.max(15, Math.min(baseProt, remainingProtein > 0 ? remainingProtein : baseProt))
  );

  const targetCarbs = Math.min(
    110,
    Math.max(15, Math.min(baseCarbs, remainingCarbs > 0 ? remainingCarbs : baseCarbs))
  );

  const targetFat = Math.min(
    35,
    Math.max(6, Math.min(baseFat, remainingFat > 0 ? remainingFat : baseFat))
  );

  return {
    mealCategory: category,
    slotRatio: standardRatio,
    targetCalories: targetKcal,
    targetProtein: targetProt,
    targetCarbs,
    targetFat,
    minCalories: Math.round(targetKcal * 0.85),
    maxCalories: Math.round(targetKcal * 1.15),
  };
}

const USDA_PROFILES = [
  { name: 'pui', per100g: { calories: 165, protein: 31, carbs: 0, fat: 3.6 } },
  { name: 'cartof', per100g: { calories: 87, protein: 1.9, carbs: 20.1, fat: 0.1 } },
  { name: 'mazare', per100g: { calories: 81, protein: 5.4, carbs: 14.5, fat: 0.4 } },
  { name: 'ulei', per100g: { calories: 884, protein: 0, carbs: 0, fat: 100 } },
];

function groundItem(name, grams) {
  const norm = name.toLowerCase();
  const profile = USDA_PROFILES.find((p) => norm.includes(p.name)) || { per100g: { calories: 150, protein: 10, carbs: 15, fat: 5 } };
  const factor = grams / 100;
  return {
    calories: Math.round(profile.per100g.calories * factor),
    protein: Math.round(profile.per100g.protein * factor),
    carbs: Math.round(profile.per100g.carbs * factor),
    fat: Math.round(profile.per100g.fat * factor),
  };
}

function parseGrams(str) {
  const m = str.match(/(\d+)\s*(?:g|ml)/i);
  return m ? parseInt(m[1], 10) : 100;
}

function recalculateMeal(recipe, targetKcal) {
  let totCal = 0, totProt = 0, totCarb = 0, totFat = 0;
  recipe.ingredients.forEach((ing) => {
    const g = parseGrams(ing.amount);
    const nut = groundItem(ing.name, g);
    totCal += nut.calories;
    totProt += nut.protein;
    totCarb += nut.carbs;
    totFat += nut.fat;
  });

  return {
    ...recipe,
    calories: totCal,
    protein: totProt,
    carbs: totCarb,
    fat: totFat,
  };
}

async function verify() {
  const context = {
    mode: 'fridge',
    mealCategory: 'lunch',
    fridgeIngredients: ['Pui (gamba)', 'Mazăre', 'Cartofi', 'Ulei de măsline'],
    remainingCalories: 2340,
    remainingProtein: 164,
    remainingCarbs: 260,
    remainingFat: 64,
  };

  const slot = calculateMealTargetSlot(2340, 164, 260, 64, 2340, 164, 260, 64, 'lunch');
  console.log('--- 1. SLOT ALLOCATION ---');
  console.log(`Daily Remaining: 2340 kcal -> Calculated Lunch Slot: ~${slot.targetCalories} kcal | ~${slot.targetProtein}g Protein`);

  const systemPrompt = `You are an elite sports nutrition chef for NutriAI.
You create tailored single-meal recipes in Romanian based STRICTLY on the user's specific inputs:
- Ingredients provided: [${context.fridgeIngredients.join(', ')}]
- TARGET MEAL SLOT: ~${slot.targetCalories} kcal, ~${slot.targetProtein}g Protein, ~${slot.targetCarbs}g Carbs, ~${slot.targetFat}g Fat.

CRITICAL INVARIANTS:
1. Every generated recipe MUST prioritize and incorporate the specific ingredients provided by the user.
2. Use REALISTIC SINGLE-SERVING gram amounts (e.g., 180-220g meat/fish, 150-200g cooked carbs, 80-120g veggies, 5-15ml oil).
3. The sum of ingredient calories MUST naturally match the single meal target (~${slot.targetCalories} kcal). DO NOT output the full day's calorie budget (2000+ kcal) for a single dish!
4. The response MUST be ONLY valid JSON matching this schema:
{
  "recipes": [
    {
      "id": "rec-1",
      "title": "Titlu preparat specific în Română",
      "mode": "${context.mode}",
      "calories": ${slot.targetCalories},
      "protein": ${slot.targetProtein},
      "carbs": ${slot.targetCarbs},
      "fat": ${slot.targetFat},
      "ingredients": [
        { "name": "Pui (gambă)", "amount": "200g" },
        { "name": "Cartofi la cuptor", "amount": "180g" },
        { "name": "Mazăre fiartă", "amount": "100g" },
        { "name": "Ulei de măsline", "amount": "10ml" }
      ]
    }
  ]
}`;

  console.log('\n--- 2. CALLING 8B INSTRUCT ENGINE ---');
  const res = await client.chat.completions.create({
    model: 'meta/llama-3.1-8b-instruct',
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: 'Generează o masă de prânz realistă.' },
    ],
    temperature: 0.2,
    max_tokens: 600,
  });

  const rawJson = JSON.parse(res.choices[0].message.content.match(/\{[\s\S]*\}/)[0]);
  const recipe = rawJson.recipes[0];
  console.log(`Title: "${recipe.title}"`);
  console.log('Ingredients on Plate:');
  recipe.ingredients.forEach((ing) => console.log(` - ${ing.name}: ${ing.amount}`));

  const finalGrounded = recalculateMeal(recipe, slot.targetCalories);
  console.log('\n--- 3. DETERMINISTIC USDA GROUNDING RESULT ---');
  console.log(`Calculated Calories: ${finalGrounded.calories} kcal`);
  console.log(`Calculated Protein: ${finalGrounded.protein}g`);
  console.log(`Calculated Carbs: ${finalGrounded.carbs}g`);
  console.log(`Calculated Fat: ${finalGrounded.fat}g`);
}

verify();
