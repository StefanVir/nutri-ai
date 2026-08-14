import { ActivityLevel, Gender, Goal, MealCategory, UserProfile } from '@/types/nutrition';

export const ACTIVITY_MULTIPLIERS: Record<ActivityLevel, number> = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  very_active: 1.725,
};

export const ACTIVITY_LABELS: Record<ActivityLevel, { title: string; desc: string }> = {
  sedentary: { title: 'Sedentar', desc: 'Muncă la birou, puțină mișcare zilnică' },
  light: { title: 'Ușor Activ', desc: '1-3 antrenamente / plimbări pe săptămână' },
  moderate: { title: 'Moderat Activ', desc: '3-5 antrenamente pe săptămână' },
  very_active: { title: 'Foarte Activ', desc: '6-7 antrenamente intense sau muncă fizică' },
};

export const GOAL_LABELS: Record<Goal, { title: string; delta: string; desc: string }> = {
  cut: { title: 'Slăbire / Definire', delta: '-400 kcal', desc: 'Deficit caloric moderat pentru arderea grăsimilor' },
  maintain: { title: 'Menținere & Tonifiere', delta: '0 kcal', desc: 'Echilibru metabolic și energie optimă' },
  bulk: { title: 'Creștere Masă Musculară', delta: '+350 kcal', desc: 'Surplus caloric controlat pentru hipertrofie' },
};

export interface MetabolicResult {
  bmr: number;
  tdee: number;
  targetCalories: number;
  proteinGrams: number;
  carbsGrams: number;
  fatGrams: number;
}

export interface MealSlotAllocation {
  mealCategory: MealCategory;
  slotRatio: number;
  targetCalories: number;
  targetProtein: number;
  targetCarbs: number;
  targetFat: number;
  minCalories: number;
  maxCalories: number;
}

export function calculateMealTargetSlot(
  dailyCalorieTarget: number = 2100,
  dailyProteinTarget: number = 160,
  dailyCarbsTarget: number = 200,
  dailyFatTarget: number = 65,
  remainingCalories: number = 2100,
  remainingProtein: number = 160,
  remainingCarbs: number = 200,
  remainingFat: number = 65,
  category: MealCategory = 'lunch'
): MealSlotAllocation {
  const SLOT_RATIOS: Record<MealCategory, number> = {
    breakfast: 0.28,
    lunch: 0.36,
    dinner: 0.28,
    snack: 0.08,
  };

  const standardRatio = SLOT_RATIOS[category] || 0.30;

  // Standard proportional portion of the daily target
  const baseKcal = Math.round(dailyCalorieTarget * standardRatio);
  const baseProt = Math.round(dailyProteinTarget * standardRatio);
  const baseCarbs = Math.round(dailyCarbsTarget * standardRatio);
  const baseFat = Math.round(dailyFatTarget * standardRatio);

  // Realistic meal boundaries [350, 950] kcal for main meals, [150, 400] for snacks
  const minKcal = category === 'snack' ? 150 : 350;
  const maxKcal = category === 'snack' ? 400 : 900;

  // Allocate realistic target for this specific plate
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

export function calculateMetabolicTargets(
  gender: Gender,
  age: number,
  heightCm: number,
  weightKg: number,
  activityLevel: ActivityLevel,
  goal: Goal
): MetabolicResult {
  let bmr = 10 * weightKg + 6.25 * heightCm - 5 * age;
  if (gender === 'male') {
    bmr += 5;
  } else {
    bmr -= 161;
  }

  const multiplier = ACTIVITY_MULTIPLIERS[activityLevel] || 1.375;
  const tdee = Math.round(bmr * multiplier);

  let targetCalories = tdee;
  if (goal === 'cut') {
    targetCalories = Math.max(gender === 'male' ? 1500 : 1250, tdee - 400);
  } else if (goal === 'bulk') {
    targetCalories = tdee + 350;
  }

  const proteinMultiplier = goal === 'cut' ? 2.1 : goal === 'bulk' ? 2.0 : 1.8;
  const proteinGrams = Math.round(weightKg * proteinMultiplier);
  const proteinCalories = proteinGrams * 4;

  const fatCalories = targetCalories * 0.25;
  const fatGrams = Math.round(fatCalories / 9);

  const remainingCaloriesForCarbs = Math.max(0, targetCalories - (proteinCalories + fatGrams * 9));
  const carbsGrams = Math.round(remainingCaloriesForCarbs / 4);

  return {
    bmr: Math.round(bmr),
    tdee,
    targetCalories: Math.round(targetCalories),
    proteinGrams,
    carbsGrams,
    fatGrams,
  };
}

export const calculateMetabolicPlan = calculateMetabolicTargets;

export const DEFAULT_APPLIANCES = [
  { id: 'airfryer', name: 'Airfryer / Friteuză cu aer cald' },
  { id: 'stove', name: 'Aragaz / Tigaie' },
  { id: 'oven', name: 'Cuptor' },
  { id: 'blender', name: 'Blender' },
  { id: 'microwave', name: 'Cuptor cu microunde' },
];

export const POPULAR_FRIDGE_ITEMS = [
  'Ouă',
  'Piept de pui',
  'Mușchi de porc',
  'Ton conservă',
  'Orez',
  'Cartofi',
  'Paste integrale',
  'Ovăz',
  'Iaurt grecesc 2%',
  'Brânză telemea / Feta',
  'Mozzarella light',
  'Spanac proaspăt',
  'Roșii / Roșii cherry',
  'Castraveți',
  'Ardei gras',
  'Ceapă & Usturoi',
  'Ulei de măsline',
  'Lipii integrale',
  'Fasole / Năut conservă',
  'Avocado',
];
