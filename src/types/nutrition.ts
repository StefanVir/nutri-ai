export type Gender = 'male' | 'female';
export type Goal = 'cut' | 'maintain' | 'bulk';
export type ActivityLevel = 'sedentary' | 'light' | 'moderate' | 'very_active';

export interface UserProfile {
  id?: string;
  name: string;
  gender: Gender;
  age: number;
  heightCm: number;
  weightKg: number;
  activityLevel: ActivityLevel;
  goal: Goal;
  calorieTarget: number;
  proteinTarget: number;
  carbsTarget: number;
  fatTarget: number;
  appliances: string[];
  dietaryRestrictions: string[];
  hasCompletedOnboarding: boolean;
}

export type MealCategory = 'breakfast' | 'lunch' | 'dinner' | 'snack';

export type SwipeMode = 'fridge' | 'grocery_empty' | 'grocery_stock' | 'restaurant';

export interface MealCardProposal {
  id: string;
  title: string;
  mode: SwipeMode;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  prepTimeMinutes: number;
  cookTimeMinutes: number;
  difficulty: 'Ușor' | 'Mediu' | 'Avansat' | string;
  servings: number;
  appliancesUsed: string[];
  estimatedCostRon?: number;
  ingredients: {
    name: string;
    amount: string;
    isPantryStock?: boolean;
    toBuy?: boolean;
    estimatedPriceRon?: number;
  }[];
  instructions: string[];
  matchReason: string;
  tags: string[];
}

export interface LoggedMeal {
  id: string;
  timestamp: string;
  category: MealCategory;
  title: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  servings: number;
  recipeId?: string;
  source: 'swipe' | 'quick_ai' | 'manual';
}

export interface DailyTrackingState {
  date: string;
  targetCalories: number;
  targetProtein: number;
  targetCarbs: number;
  targetFat: number;
  consumedCalories: number;
  consumedProtein: number;
  consumedCarbs: number;
  consumedFat: number;
  meals: LoggedMeal[];
}

export interface PreSwipeContext {
  mode: SwipeMode;
  mealCategory: MealCategory;
  servings: number;
  appliances: string[];
  fridgeIngredients: string[];
  maxBudgetRon?: number;
  remainingCalories: number;
  remainingProtein: number;
  remainingCarbs: number;
  remainingFat: number;
}

export interface MatchupShowdownState {
  isActive: boolean;
  shortlistedMeals: MealCardProposal[];
  context: PreSwipeContext;
}

export interface AdaptiveFavorite {
  id: string;
  recipe: MealCardProposal;
  savedAt: string;
  timesSuggested: number;
  timesSelected: number;
}
