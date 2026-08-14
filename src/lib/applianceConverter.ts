/**
 * NutriAI Thermal Appliance Converter
 * Converts culinary instructions and timings between Skillet, Airfryer, and Oven.
 */

export type ApplianceType = 'Aragaz / Tigaie' | 'Airfryer' | 'Cuptor';

export interface ConvertedRecipeInstructions {
  appliance: ApplianceType;
  instructions: string[];
  prepTimeMinutes: number;
  cookTimeMinutes: number;
}

export function convertApplianceInstructions(
  originalInstructions: string[],
  targetAppliance: ApplianceType,
  ingredients: { name: string; amount: string }[]
): ConvertedRecipeInstructions {
  const primary = ingredients[0]?.name || 'Ingredientele principale';
  const secondary = ingredients[1]?.name || 'Garnitura';

  if (targetAppliance === 'Airfryer') {
    return {
      appliance: 'Airfryer',
      prepTimeMinutes: 6,
      cookTimeMinutes: 14,
      instructions: [
        `Preîncălzește Airfryer-ul la 180°C timp de 3 minute.`,
        `Porționează ${primary} și ${secondary}, stropește-le cu 1 linguriță de ulei de măsline și asezonează cu sare, piper și ierburi aromatice.`,
        `Așază ingredientele în coșul Airfryer-ului într-un singur strat și gătește la 180°C timp de 12-14 minute, agitând coșul la jumătatea timpului.`,
        `Scoate preparatul crocant și suculent, lasă-l să se tempereze 1 minut și servește cald.`,
      ],
    };
  }

  if (targetAppliance === 'Cuptor') {
    return {
      appliance: 'Cuptor',
      prepTimeMinutes: 10,
      cookTimeMinutes: 22,
      instructions: [
        `Preîncălzește cuptorul la 200°C și așază hârtie de copt pe o tavă întinsă.`,
        `Pregătește ${primary} și ${secondary}, așază-le pe tavă, stropește cu ulei și condimentează generos.`,
        `Coace la 200°C timp de 20-22 minute până când se rumenesc frumos și sunt complet pătrunse.`,
        `Scoate tava din cuptor, lasă preparatul să se odihnească 2 minute și montează pe farfurie.`,
      ],
    };
  }

  // Standard Skillet / Tigaie
  return {
    appliance: 'Aragaz / Tigaie',
    prepTimeMinutes: 8,
    cookTimeMinutes: 12,
    instructions: [
      `Scoate ${primary} din frigider cu 10 minute înainte și asezonează cu sare și piper.`,
      `Încinge tigaia antiaderentă la foc mediu-iute cu 1 linguriță de ulei de măsline și gătește ${primary} timp de 3-4 minute pe fiecare parte.`,
      `Adaugă ${secondary} în aceeași tigaie în ultimele 2-3 minute și sotează rapid până scade în volum.`,
      `Așază pe farfurie, lasă la odihnit 2 minute pentru a reține sucurile și servește cald.`,
    ],
  };
}
