/**
 * NutriAI Computational Gastronomy & Culinary Action Graph Engine (CAGA)
 * Classifies ingredient roles, isolates hero proteins, and structures coherent culinary archetypes.
 */

export type IngredientRole = 'HERO_PROTEIN' | 'STARCH_BASE' | 'FIBER_VEGGIES' | 'HEALTHY_FATS_DAIRY' | 'AROMATICS_CONDIMENTS';

export interface ClassifiedIngredient {
  name: string;
  role: IngredientRole;
}

const HERO_PROTEINS_SET = [
  'vită', 'vita', 'pui', 'curcan', 'porc', 'somon', 'ton', 'peste', 'pește',
  'creveți', 'creveti', 'ouă', 'oua', 'tofu', 'muschi', 'mușchi', 'cotlet',
  'antricot', 'dorada', 'pastrav', 'păstrăv', 'cod', 'salau', 'șalău'
];

const STARCH_BASES_SET = [
  'orez', 'cartofi', 'cartof', 'paste', 'lipie', 'lipii', 'pâine', 'paine',
  'quinoa', 'ovăz', 'ovaz', 'mămăligă', 'mamaliga', 'tortilla', 'couscous', 'bulgur'
];

const FIBER_VEGGIES_SET = [
  'spanac', 'broccoli', 'ciuperci', 'ardei', 'roșii', 'rosii', 'castraveți',
  'castraveti', 'mazăre', 'mazare', 'fasole', 'salată', 'salata', 'morcovi',
  'morcov', 'dovlecei', 'dovlecel', 'conopidă', 'conopida', 'ceapă', 'ceapa', 'usturoi'
];

const HEALTHY_FATS_DAIRY_SET = [
  'avocado', 'telemea', 'feta', 'iaurt', 'mozzarella', 'parmezan', 'brânză',
  'branza', 'unt', 'ulei', 'nuci', 'semințe', 'seminte', 'migdale'
];

export function classifyIngredient(name: string): ClassifiedIngredient {
  const norm = name.toLowerCase().trim();

  if (HERO_PROTEINS_SET.some((p) => norm.includes(p))) {
    return { name, role: 'HERO_PROTEIN' };
  }
  if (STARCH_BASES_SET.some((s) => norm.includes(s))) {
    return { name, role: 'STARCH_BASE' };
  }
  if (HEALTHY_FATS_DAIRY_SET.some((f) => norm.includes(f))) {
    return { name, role: 'HEALTHY_FATS_DAIRY' };
  }
  if (FIBER_VEGGIES_SET.some((v) => norm.includes(v))) {
    return { name, role: 'FIBER_VEGGIES' };
  }

  return { name, role: 'AROMATICS_CONDIMENTS' };
}

export function formatGourmetDishTitle(
  heroProtein: string,
  veggie: string = 'Spanac',
  fatOrDairy: string = 'Telemea',
  starch: string = 'Cartofi',
  appliance: string = 'Tigaie'
): string {
  const norm = heroProtein.toLowerCase().trim();

  // Eggs
  if (norm.includes('ou')) {
    if (fatOrDairy.toLowerCase().includes('telemea') || fatOrDairy.toLowerCase().includes('brânz') || fatOrDairy.toLowerCase().includes('branz')) {
      return `Omletă pufoasă cu ${fatOrDairy} și ${veggie}`;
    }
    if (fatOrDairy.toLowerCase().includes('avocado')) {
      return `Omletă fină cu ${veggie} și cuburi de ${fatOrDairy}`;
    }
    return `Omletă gourmet cu ${veggie} și ${fatOrDairy}`;
  }

  // Tuna / Fish
  if (norm.includes('ton') || norm.includes('conserv')) {
    return `Salată mediteraneană de ton cu ${fatOrDairy} și ${veggie}`;
  }
  if (norm.includes('somon') || norm.includes('păstrăv') || norm.includes('pastrav') || norm.includes('dorad') || norm.includes('cod')) {
    return `File de ${heroProtein.toLowerCase()} la ${appliance} cu ${veggie}`;
  }

  // Beef / Steak
  if (norm.includes('vit') || norm.includes('mușchi') || norm.includes('muschi') || norm.includes('antricot')) {
    return `Mușchi de vită suculent la ${appliance} cu ${veggie} sote`;
  }

  // Chicken / Turkey
  if (norm.includes('pui') || norm.includes('curcan') || norm.includes('piept')) {
    return `Piept de pui rumenit la ${appliance} cu ${veggie} și ${starch}`;
  }

  // Pork
  if (norm.includes('porc') || norm.includes('cotlet')) {
    return `Cotlet de porc la ${appliance} cu garnitură de ${starch}`;
  }

  // Fallback
  return `Preparat gourmet din ${heroProtein} cu ${veggie} și ${fatOrDairy}`;
}

export interface CulinaryArchetypePlan {
  heroProtein: string;
  complementaryIngredients: string[];
  suggestedDishTitle: string;
  suggestedAppliance: string;
  preparationStyle: 'saute_sear' | 'fresh_bowl' | 'skillet_omelette' | 'roasted_bake' | 'crisp_wrap';
}

import { prioritizeZeroWasteIngredients } from './perishabilityRanker';

/**
 * Builds 3 distinct, non-overlapping culinary archetypes from user inputs
 * ensuring NO Frankenstein mashup of clashing proteins and prioritizing zero-waste perishable items.
 */
export function buildCulinaryArchetypes(
  rawIngredients: string[],
  appliances: string[] = ['Aragaz / Tigaie']
): CulinaryArchetypePlan[] {
  const sortedIngredients = prioritizeZeroWasteIngredients(rawIngredients);
  const classified = sortedIngredients.map(classifyIngredient);
  const heroProteins = classified.filter((c) => c.role === 'HERO_PROTEIN').map((c) => c.name);
  const starches = classified.filter((c) => c.role === 'STARCH_BASE').map((c) => c.name);
  const veggies = classified.filter((c) => c.role === 'FIBER_VEGGIES').map((c) => c.name);
  const fatsDairy = classified.filter((c) => c.role === 'HEALTHY_FATS_DAIRY').map((c) => c.name);

  const defaultStarch = starches[0] || 'Cartofi dulci';
  const defaultVeggie = veggies[0] || 'Spanac proaspăt';
  const defaultFat = fatsDairy[0] || 'Ulei de măsline';

  // Case 1: Multiple hero proteins available -> Isolate 1 hero protein per recipe!
  if (heroProteins.length >= 2) {
    const p1 = heroProteins[0];
    const p2 = heroProteins[1];
    const p3 = heroProteins[2] || heroProteins[0];

    const v1 = veggies[0] || 'Spanac';
    const v2 = veggies[1] || veggies[0] || 'Verdețuri';
    const f1 = fatsDairy[0] || 'Ulei de măsline';
    const f2 = fatsDairy[1] || fatsDairy[0] || 'Telemea';

    return [
      {
        heroProtein: p1,
        complementaryIngredients: [p1, v1, starches[0] || 'Cartofi', f1].filter(Boolean),
        suggestedDishTitle: formatGourmetDishTitle(p1, v1, f1, starches[0] || 'Cartofi', appliances[0] || 'Tigaie'),
        suggestedAppliance: appliances[0] || 'Aragaz / Tigaie',
        preparationStyle: 'saute_sear',
      },
      {
        heroProtein: p2,
        complementaryIngredients: [p2, f2, v2, starches[1] || starches[0]].filter(Boolean),
        suggestedDishTitle: formatGourmetDishTitle(p2, v2, f2, starches[1] || 'Orez', appliances[1] || appliances[0] || 'Tigaie'),
        suggestedAppliance: appliances[1] || appliances[0] || 'Aragaz / Tigaie',
        preparationStyle: p2.toLowerCase().includes('ton') ? 'fresh_bowl' : 'saute_sear',
      },
      {
        heroProtein: p3,
        complementaryIngredients: [p3, v1, f2].filter(Boolean),
        suggestedDishTitle: formatGourmetDishTitle(p3, v1, f2, starches[0] || 'Lipie', appliances[0] || 'Tigaie'),
        suggestedAppliance: appliances[0] || 'Aragaz / Tigaie',
        preparationStyle: p3.toLowerCase().includes('ou') ? 'skillet_omelette' : 'roasted_bake',
      },
    ];
  }

  // Case 2: Only 1 hero protein (or none) -> Create 3 diverse culinary styles for that single protein
  const hero = heroProteins[0] || 'Piept de pui';
  return [
    {
      heroProtein: hero,
      complementaryIngredients: [hero, defaultVeggie, defaultStarch, defaultFat].filter(Boolean),
      suggestedDishTitle: formatGourmetDishTitle(hero, defaultVeggie, defaultFat, defaultStarch, appliances[0] || 'Tigaie'),
      suggestedAppliance: appliances[0] || 'Aragaz / Tigaie',
      preparationStyle: 'saute_sear',
    },
    {
      heroProtein: hero,
      complementaryIngredients: [hero, defaultVeggie, fatsDairy[0] || 'Avocado'].filter(Boolean),
      suggestedDishTitle: `Bowl proteic cu ${hero.toLowerCase()}, ${defaultVeggie.toLowerCase()} și ${fatsDairy[0] || 'avocado'}`,
      suggestedAppliance: appliances[1] || appliances[0] || 'Airfryer',
      preparationStyle: 'fresh_bowl',
    },
    {
      heroProtein: hero,
      complementaryIngredients: [hero, starches[0] || 'Lipie', defaultVeggie].filter(Boolean),
      suggestedDishTitle: `Wrap rumenit crocant cu ${hero.toLowerCase()} și legume`,
      suggestedAppliance: appliances[0] || 'Aragaz / Tigaie',
      preparationStyle: 'crisp_wrap',
    },
  ];
}
