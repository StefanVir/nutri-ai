# DESIGN.md — NutriAI Visual Design System

## 1. Visual World: Obsidian Athletic Luxury
An ultra-refined, high-contrast dark aesthetic tailored for modern sports nutrition and culinary precision. Combines deep slate foundations with razor-sharp macro semantics and tactile surface elevations.

## 2. Color Tokens & Semantics
- **Backgrounds:**
  - Base Obsidian: #080B11
  - Surface Card: #0F1523
  - Raised Surface: #151E32
  - Glass Overlay: gba(15, 21, 35, 0.88) with ackdrop-filter: blur(16px)
- **Borders & Dividers:**
  - Subtle: gba(255, 255, 255, 0.08)
  - Active/Focused: gba(99, 102, 241, 0.5)
- **Macro Palette (High Precision):**
  - Energy / Calories: #F59E0B (Warm Amber)
  - Protein / Muscle: #10B981 (Energetic Emerald)
  - Carbs / Glycogen: #06B6D4 (Electric Cyan)
  - Healthy Fats: #F43F5E (Crisp Coral)
- **Typography Foregrounds:**
  - Heading & Values: #FFFFFF (Weight 700 / 800)
  - Body: #CBD5E1 (Weight 400)
  - Secondary/Meta: #94A3B8 (Weight 500)
  - Muted: #64748B

## 3. Typography Rules
- **Primary Font:** Plus Jakarta Sans, sans-serif
- **Numerals:** All calories, grams, macros, and timestamps MUST use ont-variant-numeric: tabular-nums for rock-solid visual alignment.
- **No Eyebrows/Kickers:** Headings carry their own clear hierarchy without floating subtitle labels.

## 4. Iconography
- **Strict Ban on Emoji as Icons:** All icons are authored, crisp SVGs with uniform stroke-width: 1.75px or 2px and stroke-linecap: round.

## 5. Motion & Tactile Feedback
- **Spring Curves:** cubic-bezier(0.16, 1, 0.3, 1) for entrances; cubic-bezier(0.34, 1.56, 0.64, 1) for card snaps.
- **Active Press:** 	ransform: scale(0.97) on all interactive buttons and chips.
