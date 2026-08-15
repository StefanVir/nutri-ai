# NutriAI — Intelligent Nutrition & Meal Planning Platform

[![CI](https://github.com/StefanVir/nutri-ai/actions/workflows/ci.yml/badge.svg)](https://github.com/StefanVir/nutri-ai/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Next.js](https://img.shields.io/badge/Next.js-15.1-black?logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.0-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)

A modern, high-precision nutrition tracking and meal planning web application built with **Next.js 15**, **React 19**, **TypeScript**, and **Tailored AI Gateways**. Designed with an **Obsidian Athletic Dark** aesthetic, gesture-driven bottom sheets, and zero-slop typography.

---


## 🌟 Key Features

### 1. ⚡ Precision Metabolic Engine
* **Automated BMR & TDEE Calculation:** Implements the Mifflin-St Jeor formula adjusted for biological gender, age, height, weight, activity level, and fitness goals (*Cut*, *Maintain*, *Bulk*).
* **Live Macronutrient Calibration:** Automatically derives optimal targets for daily calories, protein (g/kg), carbohydrates, and healthy fats.

### 2. 🎯 Calibrated Meal Proposals
* **Target-Aware Recipe Generation:** Suggests recipes calibrated specifically on the user's *remaining* daily calorie and protein budget.
* **Three Operational Modes:**
  * 🧊 **Din Frigider (Pantry/Fridge):** Recipes using exclusively ingredients already in stock.
  * 🛒 **Smart Grocery (Budget Mode):** Recipes planned within a specific shopping budget.
  * 🍽️ **Restaurant / Dining Out:** Macro-friendly recommendations for common restaurant menus.
* **Appliance Adaptation:** Dynamically scales cook times and temperature instructions across *Stove / Skillet*, *Airfryer*, and *Oven*.

### 3. 📸 Multimodal Meal Logging
* **Vision & Text Logging:** Log whole meals either by snapping a photo of the plate or typing a natural language description.
* **Nutritional Grounding:** Validates and rounds estimated food items against standardized reference profiles (USDA database mapping).

### 4. 🛒 Smart Grocery List & Supermarket Aisle Sorter
* **Automatic Aisle Sorting:** Classifies ingredients automatically into 6 supermarket departments (*Legume & Fructe*, *Carne & Ouă*, *Lactate*, *Panificație*, *Cămară*, *Diverse*).
* **Portion Scaling:** Add ingredients directly from any recipe with scaled quantities.
* **Live Budget Tracking:** Real-time remaining cost estimation in RON.
* **One-Click Clipboard / WhatsApp Export:** Formats clean, markdown-ready shopping lists.

### 5. 📱 Mobile-First Obsidian UI & Gestures
* **60 FPS Swipe-Down Bottom Sheets:** Smooth touch gestures with drag resistance and velocity thresholds.
* **Tabular Typography:** Rock-solid visual numerical alignment across all counters and macros (`font-variant-numeric: tabular-nums`).
* **Zero AI-Slop Design:** Minimalist dark mode, clean matte cards, crisp SVG iconography, and distraction-free data visualization.

---

## 🏗️ Architecture & Tech Stack

```
nutri-ai/
├── src/
│   ├── app/                      # Next.js App Router & Serverless API Routes
│   │   ├── api/ai/generate-deck/ # LLM recipe synthesis with Zod schema validation
│   │   ├── api/ai/quick-log/     # Natural language meal parsing API
│   │   ├── api/ai/vision-log/    # Multimodal photo plate analysis
│   │   ├── api/ai/scan-fridge/   # Fridge inventory detection
│   │   ├── page.tsx              # Main dashboard & single-page application shell
│   │   └── layout.tsx            # Root layout & Google Fonts configuration
│   ├── components/
│   │   ├── dashboard/            # MacroRings, DailyJournal, QuickLogModal
│   │   ├── grocery/              # GroceryListModal & Aisle cards
│   │   ├── swipe/                # SwipeDeck, MatchupShowdown, RecipeBottomSheet
│   │   ├── favorites/            # AdaptiveFavoritesModal (Saved Recipes)
│   │   ├── onboarding/           # OnboardingWizard & metabolic questionnaire
│   │   └── layout/               # BottomNavigation floating dock
│   ├── lib/
│   │   ├── groceryClassifier.ts  # Supermarket aisle classifier & text export
│   │   ├── metabolic.ts          # Mifflin-St Jeor & TDEE calculation engine
│   │   ├── mockRecipes.ts        # Resilient offline fallback culinary generator
│   │   ├── nutritionDb.ts        # Grounded nutritional items & USDA base data
│   │   └── useSwipeDownSheet.ts  # 60 FPS touch gesture hook for modals
│   ├── styles/
│   │   ├── globals.css           # Global resets & typography
│   │   ├── tokens.css            # CSS custom properties & color palettes
│   │   └── components.css        # Pure Vanilla CSS component system
│   └── types/
│       └── nutrition.ts          # Strict TypeScript interfaces & models
└── docs/                         # Technical Architecture & PRD specs
```

### Core Technologies
* **Frontend:** [Next.js 15](https://nextjs.org/) (App Router), [React 19](https://react.dev/), [TypeScript](https://www.typescriptlang.org/)
* **Styling:** Pure Vanilla CSS Design System with CSS Tokens & Variables (Zero heavyweight runtime overhead)
* **AI Gateways:** [Groq LPU](https://groq.com/) (`llama-3.3-70b-versatile`), [NVIDIA NIM](https://build.nvidia.com/), [OpenAI SDK](https://github.com/openai/openai-node)
* **Validation:** [Zod](https://zod.dev/) for type-safe LLM JSON schema outputs
* **Icons:** [Lucide React](https://lucide.dev/)

---

## 🚀 Getting Started

### 1. Prerequisites
* **Node.js:** v18.18+ or v20+
* **Package Manager:** `npm` or `pnpm`

### 2. Installation

```bash
# Clone repository
git clone https://github.com/StefanVir/nutri-ai.git
cd nutri-ai

# Install dependencies
npm install
```

### 3. Environment Setup

Create a `.env.local` file in the root directory:

```env
# AI Providers (At least one is required for live generation)
GROQ_API_KEY=your_groq_api_key_here
NVIDIA_NIM_API_KEY=your_nvidia_nim_api_key_here
OPENAI_API_KEY=your_openai_api_key_here

# Optional: Supabase for persistent cloud sync
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

> **Note on Offline Resilience:** If no API keys are provided or network requests fail, the application gracefully degrades to the local client-side synthesis engine (`mockRecipes.ts`), allowing full offline testing and interaction.

### 4. Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 5. Production Build

```bash
npm run build
npm run start
```

---

## 📐 Design Philosophy

* **Information Over Decoration:** Every visual element directly serves user decision-making (macros, calories, shopping categories, preparation times).
* **Zero AI-Slop Copy:** Clean, direct, and functional Romanian terminology without marketing buzzwords.
* **Tactile Responsiveness:** Micro-interactions on buttons, tactile feedback on checkbox toggles, and gesture-driven bottom sheets.

---

## 📄 License

MIT © [Stefan Vîrnav](https://github.com/StefanVir)
