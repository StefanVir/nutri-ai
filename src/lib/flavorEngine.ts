/**
 * NutriAI 5-Vector Flavor Pairing & Sensory Balance Engine
 * Grounded in Computational Gastronomy & FlavorDB chemistry.
 */

export interface FlavorVector {
  fat: number;       // 0 to 1
  acid: number;      // 0 to 1
  umami: number;     // 0 to 1
  salinity: number;  // 0 to 1
  aromatics: number; // 0 to 1
}

export interface FlavorProfile {
  name: string;
  badge: string;
  color: string;
  balanceTip?: string;
}

const INGREDIENT_FLAVOR_PROFILES: Record<string, Partial<FlavorVector>> = {
  // Proteins
  vită: { fat: 0.7, umami: 0.9, salinity: 0.3 },
  mușchi: { fat: 0.6, umami: 0.9, salinity: 0.3 },
  somon: { fat: 0.8, umami: 0.8, salinity: 0.4 },
  ton: { fat: 0.3, umami: 0.8, salinity: 0.5 },
  pui: { fat: 0.4, umami: 0.6, salinity: 0.2 },
  ouă: { fat: 0.6, umami: 0.6, salinity: 0.3 },
  ou: { fat: 0.6, umami: 0.6, salinity: 0.3 },

  // Dairy & Fats
  telemea: { fat: 0.7, salinity: 0.8, acid: 0.3 },
  feta: { fat: 0.7, salinity: 0.8, acid: 0.4 },
  avocado: { fat: 0.8, acid: 0.1, umami: 0.2 },
  ulei: { fat: 1.0 },
  unt: { fat: 0.9, salinity: 0.3 },

  // Veggies & Acids
  spanac: { acid: 0.2, umami: 0.4, aromatics: 0.3 },
  roșii: { acid: 0.7, umami: 0.7, salinity: 0.1 },
  lămâie: { acid: 1.0, aromatics: 0.6 },
  usturoi: { aromatics: 1.0, umami: 0.5 },
  ceapă: { aromatics: 0.8, acid: 0.2 },
  piper: { aromatics: 0.9 },
  cartofi: { umami: 0.3, salinity: 0.1 },
};

export function evaluateDishFlavor(ingredients: { name: string }[]): FlavorProfile {
  let fat = 0.2;
  let acid = 0.1;
  let umami = 0.2;
  let salinity = 0.2;
  let aromatics = 0.2;

  ingredients.forEach((ing) => {
    const norm = ing.name.toLowerCase();
    for (const [key, vector] of Object.entries(INGREDIENT_FLAVOR_PROFILES)) {
      if (norm.includes(key)) {
        fat = Math.max(fat, vector.fat || 0);
        acid = Math.max(acid, vector.acid || 0);
        umami = Math.max(umami, vector.umami || 0);
        salinity = Math.max(salinity, vector.salinity || 0);
        aromatics = Math.max(aromatics, vector.aromatics || 0);
      }
    }
  });

  // Calculate Balance Bridge
  let balanceTip: string | undefined;
  if (fat >= 0.7 && acid <= 0.2) {
    balanceTip = 'Tip Chef: Stropește cu puțină zeamă de lămâie pentru a tăia grăsimea și a deschide aromele.';
  } else if (umami >= 0.7 && aromatics <= 0.3) {
    balanceTip = 'Tip Chef: Adaugă usturoi zdrobit sau piper proaspăt măcinat pentru o profunzime sporită.';
  } else if (fat <= 0.3 && acid <= 0.3) {
    balanceTip = 'Tip Chef: O linguriță de ulei de măsline extravirgin la final va lega perfect textura.';
  }

  // Determine Profile Badge
  if (acid >= 0.5 && umami >= 0.5) {
    return { name: 'Proaspăt & Mediteranean', badge: '🍋 Mediteranean', color: 'emerald', balanceTip };
  }
  if (umami >= 0.7) {
    return { name: 'Bogat în Umami & Sățios', badge: '🥩 Savuros Umami', color: 'amber', balanceTip };
  }
  if (fat >= 0.7) {
    return { name: 'Cremos & Dens Nutritiv', badge: '🥑 Cremos & Sățios', color: 'indigo', balanceTip };
  }

  return { name: 'Echilibrat & Curat', badge: '✨ Gust Echilibrat', color: 'blue', balanceTip };
}
