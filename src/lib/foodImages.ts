// Smart culinary food photography resolver for NutriAI Meal Cards
// Maps recipe keywords, titles, and ingredients to high-resolution curated food imagery

const FOOD_PHOTO_MAP: { keywords: string[]; url: string }[] = [
  {
    keywords: ['quesadilla', 'wrap', 'lipie', 'taco', 'burrito', 'shawarma', 'fajita'],
    url: 'https://images.unsplash.com/photo-1618040996337-56904b7850b9?auto=format&fit=crop&w=800&q=80',
  },
  {
    keywords: ['omleta', 'ou', 'oua', 'scramble', 'egg', 'eggs', 'frittata', 'shakshuka'],
    url: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=800&q=80',
  },
  {
    keywords: ['pui', 'chicken', 'piept de pui', 'curcan', 'turkey', 'poultry'],
    url: 'https://images.unsplash.com/photo-1532550907401-a500c9a57435?auto=format&fit=crop&w=800&q=80',
  },
  {
    keywords: ['somon', 'salmon', 'peste', 'fish', 'pastrav', 'trout'],
    url: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&w=800&q=80',
  },
  {
    keywords: ['ton', 'tuna', 'conserva de ton'],
    url: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80',
  },
  {
    keywords: ['paste', 'pasta', 'spaghetti', 'penne', 'macaroane', 'tagliatelle'],
    url: 'https://images.unsplash.com/photo-1621996346565-e3d5d6281691?auto=format&fit=crop&w=800&q=80',
  },
  {
    keywords: ['orez', 'rice', 'basmati', 'risotto', 'paella'],
    url: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=800&q=80',
  },
  {
    keywords: ['vita', 'beef', 'steak', 'muschi', 'carne'],
    url: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80',
  },
  {
    keywords: ['ovaz', 'oats', 'oatmeal', 'porridge', 'terci', 'granola'],
    url: 'https://images.unsplash.com/photo-1517673132405-a56a62b18caf?auto=format&fit=crop&w=800&q=80',
  },
  {
    keywords: ['iaurt', 'yogurt', 'parfait', 'branza', 'cottage'],
    url: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=800&q=80',
  },
  {
    keywords: ['salata', 'salad', 'greens', 'spanac', 'spinach', 'caesar'],
    url: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=800&q=80',
  },
  {
    keywords: ['airfryer', 'friteuza', 'crispy', 'snitel'],
    url: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&w=800&q=80',
  },
  {
    keywords: ['bowl', 'mediteranean', 'buddha bowl', 'quinoa', 'healthy'],
    url: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80',
  },
];

const DEFAULT_FOOD_PHOTO =
  'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80';

export function resolveMealImageUrl(
  title: string,
  ingredients: { name: string }[] = [],
  tags: string[] = []
): string {
  const combinedText = `${title} ${tags.join(' ')} ${ingredients.map((i) => i.name).join(' ')}`.toLowerCase();

  for (const entry of FOOD_PHOTO_MAP) {
    for (const keyword of entry.keywords) {
      if (combinedText.includes(keyword.toLowerCase())) {
        return entry.url;
      }
    }
  }

  return DEFAULT_FOOD_PHOTO;
}
