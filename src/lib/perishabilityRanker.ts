/**
 * NutriAI Zero-Waste Perishability Ranker
 * Assigns shelf-life scores to prioritize using expiring fridge ingredients first.
 */

export interface IngredientPerishability {
  name: string;
  shelfLifeScore: number; // 1 (Stable for months) to 5 (Critical 1-2 days)
  urgencyLabel: 'Critic (1-2 zile)' | 'Mediu (4-7 zile)' | 'Rezistent (Luni)';
}

const CRITICAL_ITEMS = [
  'pește', 'peste', 'somon', 'fructe de mare', 'creveți', 'creveti',
  'spanac', 'salată', 'salata', 'verdețuri', 'verdeturi', 'căpșuni', 'fructe'
];

const MEDIUM_ITEMS = [
  'carne', 'pui', 'vită', 'vita', 'porc', 'ouă', 'oua', 'ou',
  'telemea', 'iaurt', 'mozzarella', 'feta', 'avocado', 'ciuperci', 'ardei', 'roșii'
];

export function getIngredientPerishability(name: string): IngredientPerishability {
  const norm = name.toLowerCase().trim();

  if (CRITICAL_ITEMS.some((c) => norm.includes(c))) {
    return { name, shelfLifeScore: 5, urgencyLabel: 'Critic (1-2 zile)' };
  }

  if (MEDIUM_ITEMS.some((m) => norm.includes(m))) {
    return { name, shelfLifeScore: 3, urgencyLabel: 'Mediu (4-7 zile)' };
  }

  return { name, shelfLifeScore: 1, urgencyLabel: 'Rezistent (Luni)' };
}

/**
 * Sorts fridge ingredients putting critical perishable items first
 */
export function prioritizeZeroWasteIngredients(ingredients: string[]): string[] {
  return [...ingredients].sort((a, b) => {
    const scoreA = getIngredientPerishability(a).shelfLifeScore;
    const scoreB = getIngredientPerishability(b).shelfLifeScore;
    return scoreB - scoreA;
  });
}
