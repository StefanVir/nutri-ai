import { ActivityLevel, Gender, Goal, UserProfile } from '@/types/nutrition';

export const ACTIVITY_MULTIPLIERS: Record<ActivityLevel, number> = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  very_active: 1.725,
};

export const ACTIVITY_LABELS: Record<ActivityLevel, { title: string; desc: string }> = {
  sedentary: { title: 'Sedentar', desc: 'Muncă la birou, puțină mișcare zilnică' },
  light: { title: 'Ușor Activ', desc: '1-3 antrenamente / plimbări pe săptămână' },
  moderate: { title: 'Moderat Activ', desc: '3-5 antrenamente ritmice pe săptămână' },
  very_active: { title: 'Foarte Activ', desc: '6-7 antrenamente intense sau muncă fizică' },
};

export const GOAL_LABELS: Record<Goal, { title: string; delta: string; desc: string }> = {
  cut: { title: 'Slăbire / Definire', delta: '-400 kcal', desc: 'Deficit caloric moderat pentru arderea grăsimilor' },
  maintain: { title: 'Menținere & Tonifiere', delta: '0 kcal', desc: 'Echilibru metabolic și performanță optimă' },
  bulk: { title: 'Creștere Masă Musculară', delta: '+350 kcal', desc: 'Surplus caloric controlat pentru forță și volum' },
};

export interface MetabolicResult {
  bmr: number;
  tdee: number;
  targetCalories: number;
  proteinGrams: number;
  carbsGrams: number;
  fatGrams: number;
}

export function calculateMetabolicTargets(
  gender: Gender,
  age: number,
  heightCm: number,
  weightKg: number,
  activityLevel: ActivityLevel,
  goal: Goal
): MetabolicResult {
  // Formula Mifflin-St Jeor
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

  // Protein Split: 2.0g/kg pt cut, 1.8g/kg pt maintain, 2.0g/kg pt bulk
  const proteinMultiplier = goal === 'cut' ? 2.1 : goal === 'bulk' ? 2.0 : 1.8;
  const proteinGrams = Math.round(weightKg * proteinMultiplier);
  const proteinCalories = proteinGrams * 4;

  // Fat Split: 25% - 28% din caloriile totale
  const fatCalories = targetCalories * 0.25;
  const fatGrams = Math.round(fatCalories / 9);

  // Carbs: restul caloriilor
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

export const DEFAULT_APPLIANCES = [
  { id: 'airfryer', name: 'Airfryer / Friteuză cu aer cald' },
  { id: 'stove', name: 'Aragaz / Plită / Tigaie' },
  { id: 'oven', name: 'Cuptor electric / gaz' },
  { id: 'blender', name: 'Blender / Nutribullet' },
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
