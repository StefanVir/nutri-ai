import { MealCardProposal, PreSwipeContext } from '@/types/nutrition';
import { resolveMealImageUrl } from './foodImages';

export function filterOrGenerateRecipes(context: PreSwipeContext): MealCardProposal[] {
  const userItems = (context.fridgeIngredients || []).filter((i) => i.trim().length > 0);
  const appliances = context.appliances && context.appliances.length > 0 ? context.appliances : ['Tigaie / Aragaz'];
  const primaryApp = appliances[0] || 'Tigaie';
  const secondaryApp = appliances[1] || appliances[0] || 'Airfryer';

  const cal = context.remainingCalories && context.remainingCalories > 200 ? context.remainingCalories : 550;
  const prot = context.remainingProtein && context.remainingProtein > 10 ? context.remainingProtein : 42;
  const carbs = context.remainingCarbs && context.remainingCarbs > 10 ? context.remainingCarbs : 50;
  const fat = context.remainingFat && context.remainingFat > 5 ? context.remainingFat : 16;

  // If user provided specific ingredients, build custom personalized meals around them!
  if (userItems.length > 0) {
    const main1 = userItems[0];
    const main2 = userItems[1] || 'Legume proaspete';
    const main3 = userItems[2] || (userItems.length > 1 ? userItems[0] : 'Condimente naturale');

    const dynamicCards: MealCardProposal[] = [
      {
        id: `dyn-recipe-1-${Date.now()}`,
        title: `${main1} Rumenit la ${primaryApp} cu ${main2}`,
        mode: context.mode,
        calories: cal,
        protein: prot,
        carbs: carbs,
        fat: fat,
        prepTimeMinutes: 8,
        cookTimeMinutes: 14,
        difficulty: 'Ușor',
        servings: context.servings || 1,
        appliancesUsed: [primaryApp],
        estimatedCostRon: context.maxBudgetRon ? Math.min(context.maxBudgetRon, 22) : 16,
        matchReason: `Creat special din frigiderul tău pe baza ${userItems.slice(0, 3).join(', ')}, calibrat la fix pe deficitul caloric.`,
        tags: ['Smart AI', 'High Protein', primaryApp],
        ingredients: userItems.map((item, idx) => ({
          name: item,
          amount: idx === 0 ? '180g' : idx === 1 ? '80g' : '50g',
          isPantryStock: true,
          toBuy: false,
          estimatedPriceRon: 0,
        })),
        instructions: [
          `Pregătește și porționează ${main1} și ${main2}.`,
          `Setează ${primaryApp} la temperatură medie și gătește ingredientele timp de 10-12 minute.`,
          `Asezonează cu sare, piper și ierburi după gust.`,
          `Servește cald direct în farfurie pentru refacere metabolică optimă.`,
        ],
      },
      {
        id: `dyn-recipe-2-${Date.now()}`,
        title: `Nutri-Bowl Echilibrat cu ${main1} & ${main3}`,
        mode: context.mode,
        calories: Math.max(300, cal - 40),
        protein: Math.max(25, prot - 4),
        carbs: Math.max(20, carbs + 8),
        fat: Math.max(10, fat - 2),
        prepTimeMinutes: 10,
        cookTimeMinutes: 12,
        difficulty: 'Ușor',
        servings: context.servings || 1,
        appliancesUsed: [secondaryApp],
        estimatedCostRon: context.maxBudgetRon ? Math.min(context.maxBudgetRon, 20) : 14,
        matchReason: `Valorifică ${main1} și ${main3} cu o densitate nutritivă ridicată și timp minim de gătire.`,
        tags: ['Nutri Bowl', 'Clean Eating', secondaryApp],
        ingredients: userItems.map((item, idx) => ({
          name: item,
          amount: idx === 0 ? '160g' : '60g',
          isPantryStock: true,
          toBuy: false,
          estimatedPriceRon: 0,
        })),
        instructions: [
          `Gătește ${main1} la ${secondaryApp} până capătă o textură fragedă și rumenă.`,
          `Taie ${main3} și asamblează într-un bol generos.`,
          `Adaugă condimentele preferate și combină ingredientele pentru un gust echilibrat.`,
        ],
      },
      {
        id: `dyn-recipe-3-${Date.now()}`,
        title: `Tigaie Mediteraneană Rapidă cu ${main2} & ${main1}`,
        mode: context.mode,
        calories: Math.max(320, cal + 30),
        protein: Math.max(28, prot + 2),
        carbs: Math.max(20, carbs - 6),
        fat: Math.max(10, fat + 2),
        prepTimeMinutes: 6,
        cookTimeMinutes: 10,
        difficulty: 'Ușor',
        servings: context.servings || 1,
        appliancesUsed: ['Aragaz / Tigaie'],
        estimatedCostRon: context.maxBudgetRon ? Math.min(context.maxBudgetRon, 18) : 12,
        matchReason: `Masă ultra-rapidă gata în sub 15 minute, concentrată pe absorbția rapidă a proteinelor.`,
        tags: ['Gata în 15 min', 'High Protein', 'Tigaie Rapidă'],
        ingredients: userItems.map((item, idx) => ({
          name: item,
          amount: idx === 0 ? '170g' : '75g',
          isPantryStock: true,
          toBuy: false,
          estimatedPriceRon: 0,
        })),
        instructions: [
          `Încinge tigaia antiaderentă la foc mediu.`,
          `Trage rapid ${main1} și ${main2} timp de 6-8 minute.`,
          `Asezonează cu verdețuri proaspete sau uscate și servește imediat.`,
        ],
      },
    ];

    return dynamicCards.map((rec) => ({
      ...rec,
      imageUrl: resolveMealImageUrl(rec.title, rec.ingredients, rec.tags),
    }));
  }

  // Fallback for empty fridge / generic mode
  const genericCards: MealCardProposal[] = [
    {
      id: `gen-1-${Date.now()}`,
      title: 'Bowl Proteic cu Orez Basmati & Legume la Tigaie',
      mode: context.mode,
      calories: cal,
      protein: prot,
      carbs: carbs,
      fat: fat,
      prepTimeMinutes: 10,
      cookTimeMinutes: 15,
      difficulty: 'Ușor',
      servings: context.servings || 1,
      appliancesUsed: [primaryApp],
      estimatedCostRon: context.maxBudgetRon || 20,
      matchReason: 'Calibrat automat pe necesarul caloric al zilei.',
      tags: ['High Protein', 'Echilibrat'],
      ingredients: [
        { name: 'Orez basmati', amount: '160g fiert', isPantryStock: true },
        { name: 'Sursă slabă de proteine', amount: '180g', isPantryStock: true },
        { name: 'Mix legume proaspete', amount: '120g', isPantryStock: true },
      ],
      instructions: [
        'Fierbe orezul conform instrucțiunilor.',
        `Gătește sursa de proteină și legumele la ${primaryApp}.`,
        'Asamblează totul într-un bol și asezonează după gust.',
      ],
    },
    {
      id: `gen-2-${Date.now()}`,
      title: 'Wrap Crocant Proteic cu Brânză & Verdețuri',
      mode: context.mode,
      calories: Math.max(300, cal - 50),
      protein: prot,
      carbs: Math.max(20, carbs - 10),
      fat: fat,
      prepTimeMinutes: 5,
      cookTimeMinutes: 8,
      difficulty: 'Ușor',
      servings: context.servings || 1,
      appliancesUsed: [secondaryApp],
      estimatedCostRon: context.maxBudgetRon || 15,
      matchReason: 'Opțiune rapidă cu carbohidrați complecși și proteine consistente.',
      tags: ['Wrap Rapid', 'Crispy'],
      ingredients: [
        { name: 'Lipie integrală', amount: '1 buc (60g)', isPantryStock: true },
        { name: 'Brânză slabă / telemea', amount: '60g', isPantryStock: true },
        { name: 'Verdețuri proaspete', amount: '40g', isPantryStock: true },
      ],
      instructions: [
        'Așază ingredientele pe lipie și împăturește strâns.',
        `Coace la ${secondaryApp} timp de 6-8 minute până devine crocantă.`,
      ],
    },
  ];

  return genericCards.map((rec) => ({
    ...rec,
    imageUrl: resolveMealImageUrl(rec.title, rec.ingredients, rec.tags),
  }));
}
