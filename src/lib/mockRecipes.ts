import { MealCardProposal, PreSwipeContext } from '@/types/nutrition';

export const INITIAL_MOCK_RECIPES: MealCardProposal[] = [
  {
    id: 'rec-quesadilla-airfryer-pui',
    title: 'Quesadilla Crispy la Airfryer cu Pui, Spanac & Telemea',
    mode: 'fridge',
    calories: 580,
    protein: 48,
    carbs: 45,
    fat: 16,
    prepTimeMinutes: 5,
    cookTimeMinutes: 8,
    difficulty: 'Ușor',
    servings: 1,
    appliancesUsed: ['Airfryer / Friteuză cu aer cald'],
    estimatedCostRon: 15,
    matchReason: 'Folosește puiul și telemeaua din frigider și oferă un aport proteic ridicat fără ulei în exces.',
    tags: ['High Protein', 'Airfryer', 'Gata în 15 min'],
    ingredients: [
      { name: 'Piept de pui fâșii (gătit sau crud)', amount: '160g', isPantryStock: true },
      { name: 'Lipie integrală mare', amount: '1 buc (60g)', isPantryStock: true },
      { name: 'Telemea mărunțită', amount: '35g', isPantryStock: true },
      { name: 'Frunze de spanac proaspăt', amount: '30g', isPantryStock: true },
      { name: 'Boia dulce, oregano, sare, piper', amount: 'după gust', isPantryStock: true },
    ],
    instructions: [
      'Asezonează fâșiile de piept de pui cu boia, oregano, sare și piper.',
      'Așază pe jumătate de lipie frunzele de spanac, puiul și presară telemeaua.',
      'Împăturește lipia în două și fixeaz-o ușor cu o scobitoare sau prin presare.',
      'Introdu în coșul Airfryer-ului la 190°C timp de 7-8 minute (întoarce la minutul 4) până când devine aurie și crocantă.',
      'Taie în 3 triunghiuri și servește caldă.',
    ],
  },
  {
    id: 'rec-tigaie-pui-spanac',
    title: 'Tigaie Mediteraneană de Pui cu Spanac & Orez Basmati',
    mode: 'fridge',
    calories: 620,
    protein: 46,
    carbs: 58,
    fat: 18,
    prepTimeMinutes: 10,
    cookTimeMinutes: 15,
    difficulty: 'Ușor',
    servings: 1,
    appliancesUsed: ['Aragaz / Tigaie'],
    estimatedCostRon: 18,
    matchReason: 'Echilibru optim de carbohidrați complecși și proteine slabe pentru refacere metabolică.',
    tags: ['Post Workout', 'Echilibrat', 'Tigaie Rapidă'],
    ingredients: [
      { name: 'Piept de pui cuburi', amount: '180g', isPantryStock: true },
      { name: 'Orez basmati fiert', amount: '160g (fiert)', isPantryStock: true },
      { name: 'Spanac frunze', amount: '70g', isPantryStock: true },
      { name: 'Ulei de măsline extravirgin', amount: '1 linguriță (5ml)', isPantryStock: true },
      { name: 'Roșii cherry', amount: '6 buc', isPantryStock: true },
      { name: 'Usturoi zdrobit', amount: '2 căței', isPantryStock: true },
    ],
    instructions: [
      'Încinge o tigaie antiaderentă cu uleiul de măsline și sotează usturoiul timp de 30 de secunde.',
      'Adaugă cuburile de pui și rumenește-le la foc mediu-iute timp de 7-8 minute până devin aurii.',
      'Adaugă roșiile cherry și frunzele de spanac; amestecă 2 minute până când spanacul se restrânge.',
      'Toarnă orezul basmati fiert direct în tigaie, amestecă la foc mic 1 minut pentru a absorbi aromele și asezonează cu piper proaspăt măcinat.',
    ],
  },
  {
    id: 'rec-omleta-airfryer-souffle',
    title: 'Omletă Pufoasă la Airfryer cu Telemea & Spanac',
    mode: 'fridge',
    calories: 440,
    protein: 34,
    carbs: 8,
    fat: 28,
    prepTimeMinutes: 5,
    cookTimeMinutes: 12,
    difficulty: 'Ușor',
    servings: 1,
    appliancesUsed: ['Airfryer / Friteuză cu aer cald'],
    estimatedCostRon: 11,
    matchReason: 'Mic dejun sau cină keto-friendly, ultra-rapidă, fără ulei adăugat.',
    tags: ['Low Carb', 'Keto', 'High Protein'],
    ingredients: [
      { name: 'Ouă întregi', amount: '3 buc mari', isPantryStock: true },
      { name: 'Albuș de ou', amount: '50ml', isPantryStock: true },
      { name: 'Brânză telemea fărâmițată', amount: '40g', isPantryStock: true },
      { name: 'Spanac proaspăt tocat', amount: '20g', isPantryStock: true },
      { name: 'Lapte sau iaurt grecesc', amount: '1 lingură', isPantryStock: true },
    ],
    instructions: [
      'Bate ouăle cu laptele/iaurtul, sarea și piperul până devin spumoase.',
      'Toarnă compoziția într-o formă rotundă din silicon potrivită pentru coșul Airfryer-ului.',
      'Presară deasupra telemeaua și verdeața.',
      'Coace la 170°C în Airfryer timp de 10-12 minute până când omleta este crescută și rumenită.',
    ],
  },
  {
    id: 'rec-grocery-ton-paste-buget',
    title: 'Penne Integrale cu Ton Mediteranean & Sos de Roșii',
    mode: 'grocery_stock',
    calories: 590,
    protein: 44,
    carbs: 72,
    fat: 12,
    prepTimeMinutes: 6,
    cookTimeMinutes: 12,
    difficulty: 'Ușor',
    servings: 1,
    appliancesUsed: ['Aragaz / Tigaie'],
    estimatedCostRon: 14,
    matchReason: 'Folosește pastele din dulap și necesită cumpărarea unei singure conserve de ton de ~8 lei.',
    tags: ['Buget Redus', 'Smart Grocery', 'Proteic'],
    ingredients: [
      { name: 'Paste penne integrale', amount: '90g (uscat)', isPantryStock: true },
      { name: 'Conservă de ton în suc propriu', amount: '1 conservă (130g scurs)', toBuy: true, estimatedPriceRon: 8.5 },
      { name: 'Sos de roșii pasate / passata', amount: '120g', toBuy: true, estimatedPriceRon: 3.5 },
      { name: 'Ceapă roșie mică', amount: '1/2 buc', isPantryStock: true },
      { name: 'Oregano uscat & fulgi de chili', amount: 'după gust', isPantryStock: true },
    ],
    instructions: [
      'Fierbe pastele penne în apă cu sare conform instrucțiunilor de pe pachet (cca. 9-10 minute al dente).',
      'Într-o tigaie, călește ceapa tocată mărunt cu o linguriță de apă sau ulei timp de 2 minute.',
      'Adaugă sosul de roșii, tonul scurs și condimentele. Lasă să fiarbă la foc mic 4-5 minute.',
      'Toarnă pastele fierte și scurse peste sos, amestecă bine și servește.',
    ],
  },
  {
    id: 'rec-grocery-empty-pui-orez',
    title: 'Bowl Complet cu Pui Fraged, Orez & Legume la Abur',
    mode: 'grocery_empty',
    calories: 610,
    protein: 50,
    carbs: 65,
    fat: 14,
    prepTimeMinutes: 10,
    cookTimeMinutes: 15,
    difficulty: 'Ușor',
    servings: 1,
    appliancesUsed: ['Aragaz / Tigaie', 'Airfryer / Friteuză cu aer cald'],
    estimatedCostRon: 24,
    matchReason: 'Rețetă completă de la zero gândită să se încadreze sub plafonul tău de 30 lei.',
    tags: ['Frigider Gol', 'Sub 30 Lei', 'Clean Eating'],
    ingredients: [
      { name: 'Piept de pui proaspăt', amount: '200g', toBuy: true, estimatedPriceRon: 12.0 },
      { name: 'Pungă mică orez prefiert (100g)', amount: '1 plic', toBuy: true, estimatedPriceRon: 3.5 },
      { name: 'Mix legume congelate (broccoli/morcov)', amount: '200g', toBuy: true, estimatedPriceRon: 6.0 },
      { name: 'Sos de soia light', amount: '1 lingură', toBuy: true, estimatedPriceRon: 2.5 },
    ],
    instructions: [
      'Gătește pieptul de pui la Airfryer la 190°C timp de 12-14 minute sau la tigaie.',
      'Fierbe orezul conform plicului (10-12 minute).',
      'Trage legumele congelate la tigaie timp de 5 minute cu o lingură de sos de soia.',
      'Asamblează totul într-un bol generos.',
    ],
  },
  {
    id: 'rec-restaurant-pui-orez-salata',
    title: 'Ghid Restaurant: Pui la Grătar cu Orez & Salată Mixtă',
    mode: 'restaurant',
    calories: 560,
    protein: 48,
    carbs: 52,
    fat: 14,
    prepTimeMinutes: 0,
    cookTimeMinutes: 0,
    difficulty: 'Ușor',
    servings: 1,
    appliancesUsed: [],
    estimatedCostRon: 38,
    matchReason: 'Opțiune clasică disponibilă în aproape orice restaurant/bistrou, perfect aliniată cu deficitul tău.',
    tags: ['Restaurant Guide', 'Comandă Sigură', 'Zero Gătit'],
    ingredients: [
      { name: 'Piept de pui la grătar (fără sosuri grele)', amount: '180g' },
      { name: 'Orez simplu / orez sălbatic', amount: '150g' },
      { name: 'Salată verde / varză cu lămâie', amount: '150g' },
      { name: 'Sfat: Cere dressingul separat!', amount: '1 porție' },
    ],
    instructions: [
      'Cere ospătarului carnea preparată simplu pe grătar, fără unt sau ulei adăugat la final.',
      'Alege ca garnitură orezul fiert simplu sau cartofi copți (evită prăjelile).',
      'Asezonează salata doar cu suc proaspăt de lămâie și sare.',
    ],
  },
];

export function filterOrGenerateRecipes(context: PreSwipeContext): MealCardProposal[] {
  const filtered = INITIAL_MOCK_RECIPES.filter((recipe) => {
    if (context.mode === 'fridge' && recipe.mode !== 'fridge') return false;
    if (context.mode === 'grocery_empty' && recipe.mode !== 'grocery_empty') return false;
    if (context.mode === 'grocery_stock' && recipe.mode !== 'grocery_stock' && recipe.mode !== 'fridge') return false;
    if (context.mode === 'restaurant' && recipe.mode !== 'restaurant') return false;

    if (context.appliances.length > 0 && recipe.appliancesUsed.length > 0) {
      const hasMatchingAppliance = recipe.appliancesUsed.some((app) =>
        context.appliances.some((ca) => app.toLowerCase().includes(ca.toLowerCase()))
      );
      if (!hasMatchingAppliance) return false;
    }

    return true;
  });

  return filtered.length >= 2 ? filtered : INITIAL_MOCK_RECIPES;
}
