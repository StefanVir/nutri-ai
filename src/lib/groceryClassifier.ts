import { GroceryCategory, GroceryItem } from '@/types/nutrition';

interface CategoryMetadata {
  id: GroceryCategory;
  label: string;
}

export const GROCERY_CATEGORIES: Record<GroceryCategory, CategoryMetadata> = {
  produce: {
    id: 'produce',
    label: 'Legume & Fructe',
  },
  protein: {
    id: 'protein',
    label: 'Carne, Pește & Ouă',
  },
  dairy: {
    id: 'dairy',
    label: 'Lactate & Brânzeturi',
  },
  bakery: {
    id: 'bakery',
    label: 'Panificație & Cereale',
  },
  pantry: {
    id: 'pantry',
    label: 'Cămară & Condimente',
  },
  other: {
    id: 'other',
    label: 'Diverse',
  },
};

const PRODUCE_KEYWORDS = [
  'ceapa', 'ceapă', 'usturoi', 'morcov', 'cartof', 'cartofi', 'ardei', 'rosie', 'rosii', 'roșie', 'roșii',
  'castravete', 'castraveti', 'castraveți', 'salata', 'salată', 'spanac', 'ciuperci', 'avocado', 'mar', 'măr',
  'mere', 'banana', 'banană', 'banane', 'lamaie', 'lămâie', 'lămâi', 'patrunjel', 'pătrunjel', 'marar', 'mărar',
  'dovlecel', 'dovlecei', 'vanata', 'vânătă', 'vinete', 'varza', 'varză', 'brocoli', 'broccoli', 'conopida',
  'conopidă', 'telina', 'țelină', 'praz', 'ridichi', 'ghimbir', 'lime', 'portocale', 'capsuni', 'căpșuni',
  'afine', 'zmeura', 'zmeură', 'fructe', 'legume', 'rucola', 'valeriana', 'busuioc proaspat', 'coriandru'
];

const PROTEIN_KEYWORDS = [
  'carne', 'pui', 'piept de pui', 'pulpa', 'pulpă', 'porc', 'vita', 'vită', 'curcan', 'peste', 'pește',
  'somon', 'ton', 'ou', 'oua', 'ouă', 'creveti', 'creveți', 'tofu', 'sunca', 'șuncă', 'bacon', 'muschi',
  'mușchi', 'cotlet', 'friptura', 'friptură', 'mici', 'carnati', 'cârnați', 'salam', 'prosciutto',
  'muschiulet', 'dorada', 'pastrav', 'păstrăv', 'cod', 'fructe de mare', 'proteina', 'pudră proteică'
];

const DAIRY_KEYWORDS = [
  'lapte', 'iaurt', 'branza', 'brânză', 'telemea', 'mozzarella', 'cascaval', 'cașcaval', 'smantana',
  'smântână', 'unt', 'parmezan', 'ricotta', 'branzica', 'brânzică', 'kefir', 'urda', 'urdă', 'halloumi',
  'cheddar', 'feta', 'iaurt grecesc', 'iaurt natural', 'cottage', 'lapte de migdale', 'lapte de soia',
  'lapte de ovăz', 'mascarpone', 'lapte batut', 'lapte bătut'
];

const BAKERY_KEYWORDS = [
  'paine', 'pâine', 'lipie', 'lipii', 'bagheta', 'baghetă', 'chifla', 'chiflă', 'chifle', 'covrig', 'covrigi',
  'tortilla', 'toast', 'faina', 'făină', 'malai', 'mălai', 'paine integrala', 'pâine integrală', 'crutoane',
  'biscuiti', 'biscuiți', 'baza pizza', 'aluat'
];

const PANTRY_KEYWORDS = [
  'orez', 'paste', 'macaroane', 'spaghete', 'penne', 'ovaz', 'ovăz', 'fulgi de ovaz', 'ulei', 'ulei de masline',
  'ulei de măsline', 'ulei de floarea soarelui', 'otet', 'oțet', 'sare', 'piper', 'boia', 'oregano',
  'busuioc', 'scortisoara', 'scorțișoară', 'sos', 'mustar', 'muștar', 'ketchup', 'maioneza', 'maioneză',
  'miere', 'nuci', 'migdale', 'seminte', 'semințe', 'seminte de chia', 'conserve', 'fasole', 'naut', 'năut',
  'linte', 'sos de soia', 'bulion', 'pasta de tomate', 'pastă de tomate', 'zahar', 'zahăr', 'pesmet',
  'quinoa', 'cuscus', 'chia', 'caju', 'arahide', 'unt de arahide', 'cacao', 'vanilie', 'praf de copt'
];

export function classifyIngredient(rawName: string): GroceryCategory {
  const normalized = rawName
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();

  for (const kw of PROTEIN_KEYWORDS) {
    const normKw = kw.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    if (normalized.includes(normKw)) return 'protein';
  }

  for (const kw of DAIRY_KEYWORDS) {
    const normKw = kw.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    if (normalized.includes(normKw)) return 'dairy';
  }

  for (const kw of BAKERY_KEYWORDS) {
    const normKw = kw.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    if (normalized.includes(normKw)) return 'bakery';
  }

  for (const kw of PRODUCE_KEYWORDS) {
    const normKw = kw.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    if (normalized.includes(normKw)) return 'produce';
  }

  for (const kw of PANTRY_KEYWORDS) {
    const normKw = kw.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    if (normalized.includes(normKw)) return 'pantry';
  }

  return 'other';
}

export function formatGroceryListForExport(items: GroceryItem[]): string {
  if (items.length === 0) return 'Lista de cumpărături este goală.';

  const uncompleted = items.filter((i) => !i.checked);
  const completed = items.filter((i) => i.checked);

  let text = `Lista de Cumpărături (${new Date().toLocaleDateString('ro-RO', { day: 'numeric', month: 'short' })})\n\n`;

  const categoriesOrder: GroceryCategory[] = ['produce', 'protein', 'dairy', 'bakery', 'pantry', 'other'];

  if (uncompleted.length > 0) {
    text += `DE CUMPĂRAT (${uncompleted.length}):\n`;
    for (const cat of categoriesOrder) {
      const catItems = uncompleted.filter((i) => i.category === cat);
      if (catItems.length > 0) {
        const meta = GROCERY_CATEGORIES[cat];
        text += `\n[${meta.label}]\n`;
        catItems.forEach((item) => {
          const priceStr = item.estimatedPriceRon ? ` (~${item.estimatedPriceRon} lei)` : '';
          text += `• ${item.name} - ${item.amount}${priceStr}\n`;
        });
      }
    }
  }

  if (completed.length > 0) {
    text += `\nDEJA CUMPĂRATE (${completed.length}):\n`;
    completed.forEach((item) => {
      text += `✓ ${item.name} - ${item.amount}\n`;
    });
  }

  const totalEst = items.reduce((acc, i) => acc + (i.estimatedPriceRon || 0), 0);
  if (totalEst > 0) {
    text += `\nCost estimat: ~${totalEst.toFixed(0)} RON\n`;
  }

  return text;
}
