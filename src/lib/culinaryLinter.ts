import { MealCardProposal } from '@/types/nutrition';

/**
 * Deterministic Culinary Linter & Morphology Engine
 * Enforces natural Romanian cooking verbs, purges AI slop, and guarantees logical procedural steps.
 */

const SLOP_PATTERNS = [
  /sărbătorește\s+cu\s+o\s+bucătărie/i,
  /bucură-te\s+de\s+o\s+masă/i,
  /savurează\s+această\s+călătorie/i,
  /explică\s+de\s+ce/i,
  /bucătărie\s+delicioasă/i,
];

export function lintAndFormatCookingStep(rawStep: string): string {
  let step = rawStep.trim();

  // Strip leading numbers or bullets (e.g. "1.", "Pasul 1:", "- ")
  step = step.replace(/^(?:pasul\s*\d+[:.]?|\d+[\.\):]|\-|\*)\s*/i, '');

  // Verb normalizations for broken Romanian LLM translations:
  step = step
    .replace(/^a\s+tăia\b/i, 'Taie')
    .replace(/^tăia\b/i, 'Taie')
    .replace(/^spăla\b/i, 'Spală')
    .replace(/^scurge\s+conservele\b/i, 'Scurge conserva')
    .replace(/^a\s+scurge\b/i, 'Scurge')
    .replace(/^a\s+încinge\b/i, 'Încinge')
    .replace(/^a\s+găti\b/i, 'Gătește')
    .replace(/^a\s+coace\b/i, 'Coace')
    .replace(/^a\s+așeza\b/i, 'Așază')
    .replace(/^așeza\b/i, 'Așază')
    .replace(/^bate\s+ouăle\s+și\s+le\s+adaugă\b/i, 'Bate ouăle și toarnă-le în tigaie')
    .replace(/\bcoace\s+în\s+aragaz\b/i, 'gătește pe aragaz la foc mediu')
    .replace(/\bcoace\s+în\s+aragaz\s*\/\s*tigaie\b/i, 'gătește în tigaie la foc mediu')
    .replace(/\bîl\s+coace\b/i, 'gătește-l')
    .replace(/\bîl\s+adaugă\b/i, 'adaugă-l')
    .replace(/\ble\s+adaugă\b/i, 'adaugă-le');

  // Capitalize first letter
  if (step.length > 0) {
    step = step.charAt(0).toUpperCase() + step.slice(1);
  }

  // Ensure trailing punctuation
  if (step.length > 0 && !/[.!?]$/.test(step)) {
    step += '.';
  }

  return step;
}

/**
 * Builds a robust 4-phase procedural cooking DAG if steps are malformed
 */
export function generateProceduralCookingDAG(
  title: string,
  ingredients: { name: string; amount: string }[],
  appliance: string = 'Aragaz / Tigaie'
): string[] {
  const primary = ingredients[0]?.name || 'Ingredientele principale';
  const secondary = ingredients[1]?.name || 'Legumele';
  const app = appliance.toLowerCase();

  if (app.includes('airfryer')) {
    return [
      `Preîncălzește airfryer-ul la 180°C timp de 3 minute.`,
      `Porționează ${primary} și ${secondary}, apoi pulverizează puțin ulei și asezonează cu sare și piper.`,
      `Așază ingredientele în coșul airfryer-ului într-un singur strat și gătește timp de 12-14 minute la 180°C.`,
      `Scoate preparatul rumenit, lasă-l să se tempereze 1 minut și servește cald.`,
    ];
  }

  if (title.toLowerCase().includes('salată') || title.toLowerCase().includes('bowl') || title.toLowerCase().includes('ton')) {
    return [
      `Dacă folosești conservă de ton, scurge bine lichidul și mărunțește carnea cu o furculiță.`,
      `Spală legumele, curăță avocado-ul și taie-l în cuburi uniforme.`,
      `Asamblează ${primary} și ${secondary} într-un bol generos.`,
      `Stropește cu ulei de măsline și zeamă de lămâie, asezonează cu sare de mare și piper, apoi servește.`,
    ];
  }

  if (title.toLowerCase().includes('omletă') || primary.toLowerCase().includes('ou')) {
    return [
      `Sparge ouăle într-un bol, asezonează cu sare și piper, apoi bate-le energic cu o furculiță.`,
      `Încinge tigaia antiaderentă la foc mediu cu puțin ulei sau unt.`,
      `Toarnă compoziția și adaugă ${secondary} pe jumătate de omletă, gătind timp de 2-3 minute până se leagă.`,
      `Împăturește omleta cu o spatulă, las-o să alunece pe farfurie și servește imediat.`,
    ];
  }

  // Standard Sear & Sauté / Roast
  return [
    `Scoate ${primary} din frigider cu 10 minute înainte și asezonează cu sare și piper proaspăt măcinat.`,
    `Încinge tigaia la foc mediu-iute cu 1 linguriță de ulei de măsline și gătește ${primary} timp de 3-4 minute pe fiecare parte până devine aurie.`,
    `Adaugă ${secondary} în aceeași tigaie în ultimele minute și sotează rapid până se pătrunde ușor.`,
    `Așază preparatul pe farfurie, lasă-l să se odihnească 2 minute pentru a reține sucurile și servește cald.`,
  ];
}

/**
 * Lints and repairs the whole recipe proposal against culinary invariants
 */
export function lintAndRepairRecipe<T extends MealCardProposal>(recipe: T): T {
  // 1. Sanitize matchReason
  let matchReason = recipe.matchReason || '';
  const isSlopReason = SLOP_PATTERNS.some((p) => p.test(matchReason)) || matchReason.toLowerCase().startsWith('explică');
  if (isSlopReason || matchReason.trim().length < 15) {
    const heroName = recipe.ingredients[0]?.name || 'alimentele selectate';
    matchReason = `Aport nutritiv optimizat pe bază de ${heroName}, oferind proteine de calitate superioară și sațietate prelungită.`;
  }

  // 2. Lint instructions
  let instructions = (recipe.instructions || []).map(lintAndFormatCookingStep).filter((s) => s.length > 5);

  // Filter out any AI slop steps
  instructions = instructions.filter((step) => !SLOP_PATTERNS.some((p) => p.test(step)));

  // If instructions are too short, nonsensical, or fragmented, regenerate a clean 4-phase DAG
  if (instructions.length < 3 || instructions.some((s) => s.toLowerCase().includes('conservele') && s.toLowerCase().includes('spăla'))) {
    instructions = generateProceduralCookingDAG(
      recipe.title,
      recipe.ingredients,
      recipe.appliancesUsed?.[0] || 'Aragaz / Tigaie'
    );
  }

  return {
    ...recipe,
    matchReason,
    instructions,
  };
}
