import { MealCardProposal, PreSwipeContext } from '@/types/nutrition';
import { resolveMealImageUrl } from './foodImages';
import { calculateMealTargetSlot } from './metabolic';
import { recalculateAndGroundMeal } from './nutritionDb';
import { buildCulinaryArchetypes } from './culinaryEngine';
import { generateProceduralCookingDAG, lintAndRepairRecipe } from './culinaryLinter';

export function filterOrGenerateRecipes(context: PreSwipeContext): MealCardProposal[] {
  const userItems = (context.fridgeIngredients || []).filter((i) => i.trim().length > 0);
  const appliances = context.appliances && context.appliances.length > 0 ? context.appliances : ['Aragaz / Tigaie'];

  // Tier 1: Slot Allocation
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

  const cal = mealSlot.targetCalories;
  const prot = mealSlot.targetProtein;
  const carbs = mealSlot.targetCarbs;
  const fat = mealSlot.targetFat;

  // Build 3 distinct culinary archetypes to enforce protein isolation
  const archetypes = buildCulinaryArchetypes(
    userItems.length > 0 ? userItems : ['Piept de pui', 'Spanac', 'Orez'],
    appliances
  );

  const dynamicCards: MealCardProposal[] = archetypes.map((arch, index) => {
    const ingrList = arch.complementaryIngredients.map((item, idx) => ({
      name: item,
      amount: idx === 0 ? '180g' : idx === 1 ? '120g' : '60g',
      isPantryStock: true,
      toBuy: false,
      estimatedPriceRon: 0,
    }));

    const instructions = generateProceduralCookingDAG(
      arch.suggestedDishTitle,
      ingrList,
      arch.suggestedAppliance
    );

    const rawCard: MealCardProposal = {
      id: `dyn-recipe-${index + 1}-${Date.now()}`,
      title: arch.suggestedDishTitle,
      mode: context.mode,
      calories: cal,
      protein: prot,
      carbs: carbs,
      fat: fat,
      prepTimeMinutes: 8,
      cookTimeMinutes: 12,
      difficulty: 'Ușor',
      servings: context.servings || 1,
      appliancesUsed: [arch.suggestedAppliance],
      estimatedCostRon: context.maxBudgetRon ? Math.min(context.maxBudgetRon, 24) : 18,
      matchReason: `Aport nutritiv echilibrat pe bază de ${arch.heroProtein}, optimizat pentru absorbția proteinelor și sațietate.`,
      tags: ['Chef AI', 'High Protein', arch.suggestedAppliance],
      ingredients: ingrList,
      instructions,
    };

    const linted = lintAndRepairRecipe(rawCard);
    const grounded = recalculateAndGroundMeal(linted, mealSlot.targetCalories);

    return {
      ...grounded,
      imageUrl: resolveMealImageUrl(grounded.title, grounded.ingredients, grounded.tags),
    };
  });

  return dynamicCards;
}
