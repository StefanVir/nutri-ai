# NutriAI — Product Requirements Document (PRD)

| Metadata | Value |
|---|---|
| **Project** | NutriAI — Intelligent Mobile-First Nutrition & Meal Matchup Platform |
| **Owner** | Vîrnav Ștefan (StefanVir) |
| **Status** | Finalized (Ready for Architecture & Specs) |
| **Date** | 2026-08-14 |
| **Tech Core** | Next.js (App Router, TypeScript), Vanilla CSS, NVIDIA NIM API, Supabase |

---

## 1. Executive Summary & Product Vision

### 1.1 Product Vision
**NutriAI** este o platformă web **Mobile-First** de nutriție inteligentă și asistență culinară în timp real care transformă planificarea meselor și tracking-ul de macronutrienți într-o experiență interactivă, rapidă și fără fricțiune. 

Punctul central al experienței este **The Swipe Machine** (mecanism tip Tinder-Swipe combinat cu un **Matchup Showdown** de 2-3 opțiuni favorite) – utilizatorul filtrează contextul în câteva secunde (ce are în frigider, ce echipamente deține, dacă vrea să cumpere ingrediente într-un buget stabilit sau dacă mănâncă în oraș), iar AI-ul livrează un pachet de carduri de rețete optimizate exact pe **macronutrienții rămași în ziua curentă**.

### 1.2 Diferențiatorii Cheie (The Wedge)
1. **The Swipe & Matchup Loop:** 
   - Utilizatorul glisează (Swipe Right = adaugă în Shortlist de favorite; Swipe Left = next proposal).
   - Când Shortlist-ul are 2-3 opțiuni, intră în modul **Matchup Showdown** (comparație directă: timp, macro-uri, dificultate, cost) pentru a elimina indecizia.
   - Opțiunile nealese în finală sunt salvate automat în **Adaptive Favorites** și re-propuse cu prioritate de AI când ingredientele/bugetul redevin compatibile.
2. **Mobile-First & One-Hand Ergonomics:** Navigare fluidă pe smartphone, bottom sheets, swipe gestures la 60 FPS, touch targets >= 48px, fără elemente dependente de hover.
3. **Smart Grocery cu Bifurcație Stoc vs. Frigider Gol:** 
   - *Ramura A:* Frigider complet gol (0 ingrediente) ➔ generează rețete complete încadrate 100% în plafonul de buget (ex: 25-30 lei).
   - *Ramura B:* Stoc existent (am orez, ouă) + Buget adițional (ex: 15 lei) ➔ rețete hibride.
4. **Context-Aware Macro Injection:** AI-ul cunoaște în permanență deficitul/surplusul rămas pe ziua curentă și calibrează porțiile milimetric.
5. **Quick AI Log (Limbaj Natural):** Înregistrare instantanee a meselor neplanificate prin simplă descriere text (ex: *„1 măr și 30g migdale”*).

---

## 2. Personas & Core User Journeys (UJ)

### UJ-1: Onboarding Ghidat & Calcul Metabolic (Protagonist: Alex, 24 ani, Developer)
* **Context:** Alex vrea să slăbească 4 kg, dar lucrează mult la birou și vrea să știe exact ce și cât să mănânce fără să cântărească fiecare frunză de salată.
* **Flux:**
  1. Alex deschide platforma pe telefon și parcurge onboarding-ul (Sex: Băiat, Vârstă: 24, Înălțime: 180 cm, Greutate: 82 kg, Activitate: Moderat).
  2. Alege Obiectivul: *Slăbire / Deficit caloric moderat (-400 kcal)*.
  3. Sistemul calculează automat TDEE (2500 kcal), setează ținta zilnică: **2100 kcal | 165g Proteine | 200g Carbohidrați | 65g Grăsimi** și deschide Dashboard-ul.

### UJ-2: The Swipe Deck & Matchup Showdown (Protagonist: Alex)
* **Context:** Este ora 19:30. Alex mai are disponibile pe ziua de azi **650 kcal și 45g Proteine**.
* **Flux:**
  1. Alex apasă din tab-ul de jos pe *„Swipe Meal”* și alege modul **Gătesc acasă (Ce am în frigider)**.
  2. Selectează rapid ingredientele pe care le are: *ouă, piept de pui, spanac, telemea, lipii*.
  3. Bifează echipamentele: *Airfryer + Tigaie*. Porții: *1 porție*.
  4. Se deschide **Deck-ul de Swipe**:
     * *Card 1:* Quesadilla la Airfryer cu pui și telemea (580 kcal, 48g P) ➔ **Swipe Right (Shortlist 1/3)**.
     * *Card 2:* Omletă cu spanac și telemea (450 kcal, 32g P) ➔ **Swipe Left (Skip)**.
     * *Card 3:* Pui tras la tigaie cu spanac cremos și lipie (620 kcal, 46g P) ➔ **Swipe Right (Shortlist 2/3)**.
  5. Sistemul deschide automat ecranul de **Matchup Showdown** cu cele 2 finaliste.
  6. Alex alege *Quesadilla la Airfryer*. 
  7. Se deschide **Bottom Sheet-ul complet** cu rețeta pas cu pas, masa este logată în jurnal, macro-urile scad din inelul de progres, iar rețeta cu pui tras la tigaie este salvată în **Adaptive Favorites**.

### UJ-3: Modul Cumpărături Inteligente — Frigider Gol vs. Stoc (Protagonist: Elena, 29 ani)
* **Cazul A (Frigider Gol):** Elena alege *„Frigiderul e complet gol”*, setează bugetul maxim *30 lei* și echipamentele (Cuptor/Aragaz). AI-ul propune rețete a căror listă totală de cumpărături nu depășește 30 lei.
* **Cazul B (Stoc Existent):** Elena are *orez și ouă* și introduce un buget suplimentar de *15 lei*. AI-ul propune rețete hibride (folosește orezul și ouăle din casă și adaugă 1 conservă de ton/legume de max 15 lei).

### UJ-4: Quick AI Log & Conversație Coach (Protagonist: Alex)
* **Flux:**
  1. Alex a mâncat la prânz o gustare neplanificată la birou.
  2. Apasă pe butonul **„+ Quick AI Log”** din Dashboard și tastează: *„Un covrig cu susan și un iaurt grecesc de 150g”*.
  3. AI-ul (NVIDIA NIM) extrage instant valorile: *~380 kcal, 18g Proteine, 52g Carbohidrați, 10g Grăsimi* și le loghează în Jurnal.

---

## 3. Functional Requirements (FR)

### Modul A: Onboarding & Profil Metabolic
* **FR-01**: Onboarding ghidat pas cu pas (Sex biologic, Vârstă, Greutate, Înălțime, Nivel activitate fizică PAL conform OMS).
* **FR-02**: Selecție obiectiv metabolic: *Slăbire (Deficit)*, *Menținere*, *Creștere masă musculară (Surplus)*.
* **FR-03**: Calcul metabolic automat: BMR (Mifflin-St Jeor), TDEE, Caloric Target și Macro Split (Proteine g/kg corp, Grăsimi %, restul Carbohidrați).
* **FR-04**: Salvarea preferințelor dietetice (Omnivor, Vegetarian, Vegan, Keto, etc.) și a alergiilor/intoleranțelor.

### Modul B: Motorul de Recomandare & The Swipe Deck
* **FR-05**: **Pre-Swipe Filtering:**
  * Selectare mod: (1) *Gătesc din frigider*, (2) *Cumpărături inteligente cu buget*, (3) *Mănânc în oraș*.
  * Selectare echipamente de gătit (Airfryer, Cuptor, Aragaz/Tigaie, Blender, Microunde).
  * Selector număr porții (1 - 6 porții).
  * Auto-injectare dinamică a **macronutrienților rămași** în contextul cererii către AI.
* **FR-06**: **Smart Grocery Bifurcation:**
  * Întrebare: *Frigider complet gol* vs. *Am ingrediente de folosit*.
  * Setare plafon financiar (Buget în RON / EUR).
* **FR-07**: **The Swipe Deck UI (60 FPS):**
  * Stivă de carduri interactive cu suport pentru gesturi native de drag/swipe stânga-dreapta și butoane mari tactile.
  * Pre-fetching în fundal a câte 3-5 carduri pentru eliminarea oricărei latențe de încărcare.
* **FR-08**: **Swipe Right (Shortlist Curator):**
  * Salvarea rețetei în Shortlist-ul sesiunii curente (până la 2-3 opțiuni).
* **FR-09**: **Matchup Showdown & Selecție Finală:**
  * Afișarea ecranului de confruntare între cele 2-3 finaliste cu metrici cheie comparative.
  * La selecția câștigătoarei: deschidere Bottom Sheet cu rețeta pas cu pas, logare automată în jurnal și scădere din macro-urile rămase.
* **FR-10**: **Adaptive Favorites & Preference Memory:**
  * Rețetele din shortlist nealese în finală sunt salvate în baza de date ca Favorite / Recomandate și au prioritate crescută la generările viitoare când ingredientele/bugetul coincid.

### Modul C: AI Engine (NVIDIA NIM Integration)
* **FR-11**: Conectare la **NVIDIA NIM API** (https://integrate.api.nvidia.com/v1) utilizând modele performante (Llama 3.1 70B Instruct / Mistral Large).
* **FR-12**: Validare strictă a răspunsurilor prin JSON Schema (Structured Output) pentru prevenirea oricărei halucinații structurale.
* **FR-13**: **Quick AI Food Log:** Procesare text nestructurat în limbaj natural pentru logare rapidă de alimente.

### Modul D: Dashboard & Jurnal de Nutriție
* **FR-14**: Dashboard vizual cu inele de progres pentru Calorii, Proteine, Carbohidrați, Grăsimi (Consumat vs. Țintă vs. Rămas).
* **FR-15**: Jurnalul meselor pe 4 categorii (Mic Dejun, Prânz, Cină, Gustări) cu posibilitate de editare și ștergere.
* **FR-16**: Listă automată de cumpărături agregată din mesele planificate.

---

## 4. Non-Functional Requirements (NFR)

* **NFR-01 (Mobile-First Ergonomics):** Interfață optimizată 100% pentru operare cu o singură mână (butoane plasate în thumb zone, bottom navigation bar, bottom sheets fluide, touch targets >= 48px).
* **NFR-02 (Swipe Performance & 60 FPS):** Animație de swipe hardware-accelerated (CSS transforms, will-change, zero layout shifts).
* **NFR-03 (Securitate Chei & Date):** Cheile API NVIDIA NIM sunt stocate exclusiv în .env.local și nu sunt expuse niciodată clientului.
* **NFR-04 (Design System):** Impeccable Design: paletă modernă dark/light cu contrast ridicat (WCAG AA), tipografie modernă, micro-interacțiuni rafinate.
* **NFR-05 (Persistență & Offline Resiliency):** Suport pentru Supabase cu fallback pe LocalStorage dacă utilizatorul nu este autentificat.

---

## 5. Scope Boundaries (MVP v1.0)

### ✅ În Scop (MVP)
1. Onboarding complet Mobile-First + Calculator TDEE/Macro.
2. Dashboard cu inele de calorii & macro-uri rămase.
3. The Swipe Machine (Mod Frigider, Smart Grocery cu Buget & Bifurcație, Mănânc în oraș).
4. Matchup Showdown & Adaptive Favorites Memory.
5. Bottom Sheet cu rețeta pas cu pas.
6. Quick AI Log în limbaj natural.
7. Integrare NVIDIA NIM API cu Structured Outputs.

### ❌ În Afara Scopului (Post-MVP / v2.0)
1. Computer Vision (recunoaștere foto a farfuriei).
2. Comenzi automate prin aplicații de livrare supermarket.
3. Sistem de plăți și abonamente Stripe.
