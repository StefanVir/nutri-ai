import fs from 'fs';
import path from 'path';

const BRAIN_DIR = 'D:/Intership/MySecondBrain';
const NOTES_DIR = path.join(BRAIN_DIR, 'notes');
const OPS_DIR = path.join(BRAIN_DIR, 'ops');

// 1. Update nutri-ai intelligent nutrition platform.md
const mainHubPath = path.join(NOTES_DIR, 'nutri-ai intelligent nutrition platform.md');
const mainHubContent = `---
description: Platformă web Mobile-First de nutriție personalizată cu mecanism Swipe Deck, Groq LPU 70B, Computer Vision și Gastronomie Computațională
type: project
created: 2026-08-14
updated: 2026-08-15
---

# nutri-ai intelligent nutrition platform

**NutriAI** este o aplicație web **Mobile-First** de nutriție și asistență culinară în timp real care transformă planificarea meselor și tracking-ul de calorii printr-un mecanism interactiv tip **Swipe Deck & Matchup Showdown**, conectat la o arhitectură hibridă **Groq LPU (Llama 3.3 70B) + NVIDIA NIM Vision (Llama 3.2 11B/90B) + Motor Determinist USDA & Gastronomie Computațională (CAGA)**.

- **Locație repository:** \`D:\\Intership\\nutri-ai\`
- **Specificație detaliată (PRD):** \`D:\\Intership\\nutri-ai\\docs\\prd.md\`
- **Arhitectură Gastronomică (BMAD Spec):** \`D:\\Intership\\nutri-ai\\docs\\bmad-computational-gastronomy-engine.md\`
- **Analiză Reziliență (Ant Analysis):** \`D:\\Intership\\nutri-ai\\docs\\ant-analysis-culinary-engine.md\`
- **Stare curentă:** ✅ Proiect Funcțional End-to-End, Conectat la Groq 70B & NVIDIA NIM, Verificat în Producție.

---

## ⚡ Concepte & Funcționalități Cheie Implementate

1. **The Swipe Machine & Matchup Showdown:**
   - Pre-filtrare pe context: inventar frigider (manual sau scanat foto AI), echipamente disponibile (Airfryer, Tigaie, Cuptor) și **bugetul caloric/proteic alocat mesei curente** (Slot Budgeting).
   - Glisare rapidă la 60 FPS cu fotografii culinare HD și carduri optimizate.
   - **Matchup Showdown:** Ecran split comparativ între cele mai bune 2-3 opțiuni pentru decizie în 3 secunde.
   - **Adaptive Favorites:** Opțiunile nealese sunt salvate în memorie și repropuse inteligent.

2. **Computational Gastronomy & CAGA Engine (Culinary Action Graph Architecture):**
   - **Izolarea Proteinelor Erou:** Când utilizatorul are mai multe proteine (vită, ton, ouă), sistemul generează 3 arhetipuri distincte, fără combinații absurde (*Semantic Mashup Collapse*).
   - **Grafuri de Acțiuni în 4 Faze:** *Mise en place* $\\rightarrow$ *Gătire termică* $\\rightarrow$ *Garnituri/Sote* $\\rightarrow$ *Odihnă & Plating*.
   - **Linter Morfologic Românesc:** Corectează automat verbele culinare la imperativ persoana a II-a (*„Încinge”*, *„Taie”*, *„Scurge”*, *„Așază”*) și elimină AI-slop.
   - **Matricea de Arome în 5 Vectori (FlavorDB):** Echilibrează raportul Grăsime-Aciditate-Umami și oferă ponturi de bucătar.

3. **Hands-Free Cook Mode cu Timere Live:**
   - Ecran dedicat full-screen cu font mare și **WakeLock API** (ecranul nu se stinge în timpul gătitului).
   - **Timere automate extrase din text:** Detectează intervalele de timp (ex. *„3-4 minute”*, *„12 minute”*) și creează temporizatoare interactive cu semnal sonor.
   - **Convertor Termic de Echipamente:** Comutare instantanee între *Tigaie*, *Airfryer* (180°C / -25% timp) și *Cuptor* (200°C).
   - **Scaler Dinamic de Porții:** Multiplicare $1\\times, 2\\times, 3\\times$ cu recalculare automată a gramajelor și valorilor nutriționale.

4. **Multi-Model Intelligence & Computer Vision:**
   - **Groq LPU Engine (\`llama-3.3-70b-versatile\`):** Generare deck de rețete la nivel Michelin în **~2.8 secunde** (300 tokens/sec).
   - **Multimodal Vision (\`llama-3.2-11b-vision-preview\` / \`90b\`):** Scanare automată foto a frigiderului și estimare volumetrică 3D a farfuriilor.
   - **Quick AI Food Log (\`llama-3.1-8b-instant\`):** Extragere instantanee a alimentelor din text liber în <300ms.

5. **3-Tier Hybrid Deterministic Nutrition Engine (USDA FoodData Central):**
   - **Tier 1 (Slot Budgeting):** Împarte deficitul zilnic în sloturi realiste (Mic Dejun ~28%, Prânz ~36%, Cină ~28%, Gustare ~8%).
   - **Tier 2 (Bottom-Up Grounding):** Calculează caloriile și macronutrienții ca sumă strictă $\\sum (\\text{grame}_i \\times \\text{USDA}_{100g} / 100)$, eliminând halucinațiile.
   - **Tier 3 (Portion Scaler):** Ajustează gramajele primare pentru a atinge ținta metabolică precisă a mesei.

---

## 🛠️ Stack Tehnic Validat

| Strat | Tehnologie | Rol |
|---|---|---|
| **Frontend** | Next.js (App Router, TypeScript) + Vanilla CSS | Mobile-first, bottom sheets, 60fps swipe gestures, Cook Mode, Obsidian Athletic UI |
| **AI Layer** | Groq LPU (\`llama-3.3-70b\`, \`8b\`, \`11b-vision\`) + NVIDIA NIM (Fallback) | Generare rețete gourmet sub 3s, recunoaștere imagini frigider, quick logging |
| **Gastronomy Engine** | TypeScript CAGA Engine + FlavorDB Ontology | Izolare proteine, 4-phase DAGs, normalizare morfologică RO, convertor Airfryer |
| **Nutrition Database** | USDA FoodData Central Subset (\`nutritionDb.ts\`) | Calibrare matematică a macronutrienților și densităților volumetrice |
| **Backend & Storage** | Next.js Server Actions / Supabase (Postgres) | Persistență utilizator, profil metabolic, jurnal mese și favorite adaptive |
| **Securitate** | \`.env.local\` | Chei API izolate exclusiv pe server |

---

## 📈 Status & Progres (BMAD Workflow)

1. [x] **\`bmad-prd\`**: Finalizarea cerințelor funcționale, UJ-urilor și a mecanismului Swipe & Matchup
2. [x] **\`bmad-architecture\`**: Definirea spine-ului arhitectural, contractelor Zod/JSON Schema și decuplării multi-model
3. [x] **\`bmad-build\`**: Scaffold Next.js, Obsidian Athletic UI, motor CAGA, Cook Mode, integrare Groq 70B & Vision
4. [x] **\`bmad-deep-recon\` & \`ant-analysis\`**: Diagnoză completă a generării culinare și eliminare a defectelor de sinteză

---

Topics:
- [[projects MOC]]
- [[skills and technical domains MOC]]
- [[nutri-ai architecture]]
- [[computational gastronomy and recipe action graphs]]
- [[Index]]

### 🔒 Invariant Securitate (.env)
Strict interzisă citirea, modificarea sau suprascrierea fișierelor .env / .env.local fără comanda explicită a utilizatorului.
`;

fs.writeFileSync(mainHubPath, mainHubContent, 'utf8');
console.log('✅ Updated:', mainHubPath);

// 2. Create/Update computational gastronomy and recipe action graphs.md
const domainNotePath = path.join(NOTES_DIR, 'computational gastronomy and recipe action graphs.md');
const domainNoteContent = `---
description: Metodologie și arhitectură de gastronomie computațională, grafuri de acțiuni culinare (DAGs) și calibrare deterministă a macronutrienților
type: domain-note
created: 2026-08-15
---

# Computational Gastronomy and Recipe Action Graphs (CAGA)

## 📌 Context & Problemă
Când modelele mari de limbaj (LLMs) generează rețete culinare dintr-o listă de ingrediente oferite de utilizator (ex. *Mușchi de vită, Conserve de ton, Ouă, Avocado, Spanac*), apar frecvent două defecțiuni majore:
1. **Semantic Mashup Collapse (Frankenstein Dishes):** Modelul tinde să amestece toate ingredientele într-un singur preparat bizar (ex. prăjirea tonului din conservă peste friptura de vită cu ouă bătute).
2. **Grammatical & Morphological Translation Drift:** Traduceri stângace din corpusul englezesc (ex. *„Ouă rumenit”*, *„Spăla conservele”*, *„A tăia”*).
3. **Macro Hallucination:** Inventarea unor valori calorice nerealiste (ex. atribuirea întregii cote zilnice de 2.340 kcal unei singure salate).

---

## 🧱 Soluția Arhitecturală: CAGA (Culinary Action Graph Architecture)

### 1. Taxonomia Rolurilor de Ingrediente & Izolarea Proteinelor Erou
Fiecare aliment este clasificat într-un rol funcțional:
- \`HERO_PROTEIN\`: Vită, Ton, Pui, Somon, Ouă, Tofu
- \`STARCH_BASE\`: Orez, Cartofi, Paste, Lipii
- \`FIBER_VEGGIES\`: Spanac, Broccoli, Roșii, Ciuperci
- \`HEALTHY_FATS_DAIRY\`: Avocado, Telemea, Ulei de măsline
- \`AROMATICS_CONDIMENTS\`: Usturoi, Ceapă, Lămâie, Ierburi

**Regula Izolării:** Dacă sunt disponibile $N \ge 2$ proteine erou, sistemul partiționează intrările în $N$ arhetipuri culinare distincte (ex. Farfuria 1 = Vită | Farfuria 2 = Ton | Farfuria 3 = Ouă).

### 2. Graful Procedural în 4 Faze (4-Phase DAG)
Fiecare rețetă urmează strict etapele fizico-chimice ale bucătăriei clasice:
1. **Faza 1 (Mise en Place):** Feliere, scurgere conserve, adus la temperatura camerei, asezonare inițială.
2. **Faza 2 (Tratament Termic / Reacția Maillard):** Timp, temperatură, mediu de gătire la foc mediu-iute.
3. **Faza 3 (Garnituri & Arome):** Sotarea legumelor delicate în ultimele 2 minute pentru a reține textura și micronutrienții.
4. **Faza 4 (Odihnă & Plating):** Odihna cărnii pentru reținerea sucurilor, montarea și servirea.

### 3. Matricea de Echilibrare a Aromelor în 5 Vectori (FlavorDB)
Fiecare preparat este evaluat pe 5 dimensiuni:
$$\\vec{S} = \\langle \\text{Fat}, \\text{Acid}, \\text{Umami}, \\text{Salinity}, \\text{Aromatics} \\rangle$$
- **Regula Contrastului:** Grăsime ridicată ($\\ge 0.7$) + Aciditate scăzută ($\\le 0.2$) $\\rightarrow$ Injectare automată de aciditate (*lămâie, oțet balsamic*) pentru deschiderea aromelor și digestie optimă.

### 4. Calibrare Deterministă pe Baza USDA FoodData Central
- **Slot Budgeting:** Partiționează deficitul zilnic pe mese (Mic Dejun ~28%, Prânz ~36%, Cină ~28%, Gustare ~8%).
- **Bottom-Up Nutrient Sum:** Caloriile și macro-nutrienții sunt calculați exclusiv ca $\\sum (\\text{grame}_i \\times \\text{USDA}_{100g} / 100)$.

---

## 🔗 Conexiuni în Graph
- [[nutri-ai intelligent nutrition platform]]
- [[nutri-ai architecture]]
- [[skills and technical domains MOC]]
`;

fs.writeFileSync(domainNotePath, domainNoteContent, 'utf8');
console.log('✅ Created:', domainNotePath);

// 3. Update ops/tasks.md
const tasksPath = path.join(OPS_DIR, 'tasks.md');
if (fs.existsSync(tasksPath)) {
  let tasksContent = fs.readFileSync(tasksPath, 'utf8');
  if (!tasksContent.includes('NutriAI Groq LPU 70B & Gastronomie Computațională')) {
    tasksContent = tasksContent.replace(
      '- [x] NutriAI Impeccable Frontend Redesign (Obsidian Athletic Design System, Zero AI Slop)',
      `- [x] NutriAI Impeccable Frontend Redesign (Obsidian Athletic Design System, Zero AI Slop)
- [x] NutriAI Groq LPU 70B & Gastronomie Computațională (CAGA, Cook Mode cu Timere Live, Linter Morfologic, USDA Grounding)`
    );
    fs.writeFileSync(tasksPath, tasksContent, 'utf8');
    console.log('✅ Updated:', tasksPath);
  }
}

// 4. Update skills and technical domains MOC.md
const mocPath = path.join(NOTES_DIR, 'skills and technical domains MOC.md');
if (fs.existsSync(mocPath)) {
  let mocContent = fs.readFileSync(mocPath, 'utf8');
  if (!mocContent.includes('computational gastronomy and recipe action graphs')) {
    mocContent += '\n- [[computational gastronomy and recipe action graphs]] — Gastronomie Computațională, CAGA DAGs & Sinteză Culinară\n';
    fs.writeFileSync(mocPath, mocContent, 'utf8');
    console.log('✅ Updated:', mocPath);
  }
}
