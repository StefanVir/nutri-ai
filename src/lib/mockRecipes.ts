import { MealCardProposal, PreSwipeContext } from '@/types/nutrition';
import { resolveMealImageUrl } from './foodImages';

export const INITIAL_MOCK_RECIPES: MealCardProposal[] = [
  {
    id: 'rec-quesadilla-airfryer-pui',
    title: 'Quesadilla Crispy la Airfryer cu Pui, Spanac & Telemea',
    mode: 'fridge',
    imageUrl: 'https://images.unsplash.com/photo-1618040996337-56904b7850b9?auto=format&fit=crop&w=800&q=80',
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
    imageUrl: 'https://images.unsplash.com/photo-1532550907401-a500c9a57435?auto=format&fit=crop&w=800&q=80',
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
    imageUrl: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=800&q=80',
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
    tags: ['Keto / Low Carb', 'Mic Dejun Rapid', 'Airfryer Soufflé'],
    ingredients: [
      { name: 'Ouă proaspete', amount: '3 buc mari', isPantryStock: true },
      { name: 'Telemea rasă', amount: '40g', isPantryStock: true },
      { name: 'Frunze de spanac tocate', amount: '30g', isPantryStock: true },
      { name: 'Iaurt grecesc 2%', amount: '1 lingură (25g)', isPantryStock: true },
      { name: 'Sare, piper, mărar uscat', amount: 'după gust', isPantryStock: true },
    ],
    instructions: [
      'Bate bine ouăle cu iaurtul grecesc, sarea și piperul până când compoziția devine aerată.',
      'Toarnă amestecul într-o formă mică de silicon/ceramică termorezistentă compatibilă cu Airfryer-ul.',
      'Presară deasupra spanacul tocat și telemeaua rasă.',
      'Coace la 165°C timp de 12 minute până când omleta crește frumos și se rumenește la suprafață.',
    ],
  },
  {
    id: 'rec-paste-ton-rosii',
    title: 'Penne Proteice cu Ton, Roșii & Ulei de Măsline',
    mode: 'grocery_stock',
    imageUrl: 'https://images.unsplash.com/photo-1621996346565-e3d5d6281691?auto=format&fit=crop&w=800&q=80',
    calories: 590,
    protein: 42,
    carbs: 72,
    fat: 14,
    prepTimeMinutes: 5,
    cookTimeMinutes: 10,
    difficulty: 'Ușor',
    servings: 1,
    appliancesUsed: ['Aragaz / Tigaie'],
    estimatedCostRon: 14,
    matchReason: 'Folosește pastele și tonul din stoc și adaugă suc de roșii cu cost minim.',
    tags: ['Pantry Hero', 'Buget Redus', 'High Carb Load'],
    ingredients: [
      { name: 'Paste integrale (Penne)', amount: '80g (cântărit uscat)', isPantryStock: true },
      { name: 'Conservă de ton bucăți în suc propriu', amount: '1 conservă (120g scurs)', isPantryStock: true },
      { name: 'Sos de roșii pasate / Passata', amount: '120ml', toBuy: true, estimatedPriceRon: 3.5 },
      { name: 'Ulei de măsline', amount: '1 linguriță (5ml)', isPantryStock: true },
      { name: 'Oregano & busuioc', amount: '1/2 linguriță', isPantryStock: true },
    ],
    instructions: [
      'Fierbe pastele în apă cu sare timp de 8-9 minute până sunt al dente.',
      'Într-o tigaie, încălzește passata de roșii cu oregano și busuioc timp de 2-3 minute.',
      'Adaugă tonul scurs și pastele fierte direct în tigaie, amestecând 1 minut.',
      'Toarnă la final lingurița de ulei de măsline crud.',
    ],
  },
  {
    id: 'rec-airfryer-pui-orez-legume-empty',
    title: 'Airfryer Chicken Rice Bowl (Buget Fix Sub 30 Lei)',
    mode: 'grocery_empty',
    imageUrl: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&w=800&q=80',
    calories: 610,
    protein: 52,
    carbs: 64,
    fat: 12,
    prepTimeMinutes: 8,
    cookTimeMinutes: 14,
    difficulty: 'Ușor',
    servings: 1,
    appliancesUsed: ['Airfryer / Friteuză cu aer cald'],
    estimatedCostRon: 24.5,
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
    imageUrl: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80',
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

  const list = filtered.length >= 2 ? filtered : INITIAL_MOCK_RECIPES;

  return list.map((rec) => ({
    ...rec,
    imageUrl: rec.imageUrl || resolveMealImageUrl(rec.title, rec.ingredients, rec.tags),
  }));
}
