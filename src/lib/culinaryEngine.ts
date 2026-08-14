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

export interface CulinaryArchetypePlan {
  heroProtein: string;
  complementaryIngredients: string[];
  suggestedDishTitle: string;
  suggestedAppliance: string;
  preparationStyle: 'saute_sear' | 'fresh_bowl' | 'skillet_omelette' | 'roasted_bake' | 'crisp_wrap';
}

/**
 * Builds 3 distinct, non-overlapping culinary archetypes from user inputs
 * ensuring NO Frankenstein mashup of clashing proteins.
 */
export function buildCulinaryArchetypes(
  rawIngredients: string[],
  appliances: string[] = ['Aragaz / Tigaie']
): CulinaryArchetypePlan[] {
  const classified = rawIngredients.map(classifyIngredient);
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

    return [
      {
        heroProtein: p1,
        complementaryIngredients: [p1, veggies[0] || 'Spanac', starches[0] || 'Cartofi', defaultFat].filter(Boolean),
        suggestedDishTitle: `${p1} la ${appliances[0] || 'Tigaie'} cu ${veggies[0] || 'Legume Sote'}`,
        suggestedAppliance: appliances[0] || 'Aragaz / Tigaie',
        preparationStyle: 'saute_sear',
      },
      {
        heroProtein: p2,
        complementaryIngredients: [p2, fatsDairy[0] || 'Avocado', veggies[1] || veggies[0] || 'Verdețuri', starches[1] || starches[0]].filter(Boolean),
        suggestedDishTitle: p2.toLowerCase().includes('ton')
          ? `Salată gourmet cu ${p2} și ${fatsDairy[0] || 'Avocado'}`
          : `${p2} rumenit cu ${fatsDairy[0] || 'Garnitură fină'}`,
        suggestedAppliance: appliances[1] || appliances[0] || 'Tăiere / Bol',
        preparationStyle: p2.toLowerCase().includes('ton') ? 'fresh_bowl' : 'saute_sear',
      },
      {
        heroProtein: p3,
        complementaryIngredients: [p3, veggies[0] || 'Legume', fatsDairy[0] || 'Brânză'].filter(Boolean),
        suggestedDishTitle: p3.toLowerCase().includes('ou')
          ? `Omletă pufoasă cu ${veggies[0] || 'Spanac'} și ${fatsDairy[0] || 'Avocado'}`
          : `Nutri-Bowl echilibrat cu ${p3} și ${defaultVeggie}`,
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
      suggestedDishTitle: `${hero} la ${appliances[0] || 'Tigaie'} cu ${defaultVeggie} sote`,
      suggestedAppliance: appliances[0] || 'Aragaz / Tigaie',
      preparationStyle: 'saute_sear',
    },
    {
      heroProtein: hero,
      complementaryIngredients: [hero, defaultVeggie, fatsDairy[0] || 'Avocado'].filter(Boolean),
      suggestedDishTitle: `Bowl proteic cu ${hero}, ${defaultVeggie} și ${fatsDairy[0] || 'Avocado'}`,
      suggestedAppliance: appliances[1] || appliances[0] || 'Airfryer',
      preparationStyle: 'fresh_bowl',
    },
    {
      heroProtein: hero,
      complementaryIngredients: [hero, starches[0] || 'Lipie', defaultVeggie].filter(Boolean),
      suggestedDishTitle: `Wrap / Rumenit crocant cu ${hero} și verdețuri`,
      suggestedAppliance: appliances[0] || 'Cuptor',
      preparationStyle: 'crisp_wrap',
    },
  ];
}
