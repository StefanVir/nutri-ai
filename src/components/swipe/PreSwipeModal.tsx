'use client';

import React, { useState } from 'react';
import { MealCategory, PreSwipeContext, SwipeMode } from '@/types/nutrition';
import { X, Sparkles, Plus, Check, Refrigerator, ShoppingCart, Utensils, Flame, Zap, Waves, CookingPot } from 'lucide-react';

import { useSwipeDownSheet } from '@/lib/useSwipeDownSheet';

interface PreSwipeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLaunch: (context: PreSwipeContext) => void;
  remainingCalories: number;
  remainingProtein: number;
  remainingCarbs: number;
  remainingFat: number;
  currentCategory: MealCategory;
}

const COMMON_PANTRY = [
  'Ouă', 'Piept de pui', 'Orez basmati', 'Lipii integrale',
  'Spanac', 'Telemea', 'Ovăz', 'Conserve de ton',
  'Broccoli', 'Iaurt grecesc', 'Paste', 'Ulei de măsline',
];

const APPLIANCES_LIST = [
  { name: 'Airfryer', icon: Zap },
  { name: 'Aragaz / Tigaie', icon: Flame },
  { name: 'Cuptor', icon: CookingPot },
  { name: 'Blender', icon: Waves },
  { name: 'Microunde', icon: Zap },
];

export function PreSwipeModal({
  isOpen,
  onClose,
  onLaunch,
  remainingCalories,
  remainingProtein,
  remainingCarbs,
  remainingFat,
  currentCategory,
}: PreSwipeModalProps) {
  const [mode, setMode] = useState<SwipeMode>('fridge');
  const [mealCategory, setMealCategory] = useState<MealCategory>(currentCategory);
  const [fridgeIngredients, setFridgeIngredients] = useState<string[]>([
    'Ouă', 'Piept de pui', 'Spanac', 'Telemea', 'Lipii integrale'
  ]);
  const [appliances, setAppliances] = useState<string[]>(['Airfryer', 'Aragaz / Tigaie']);
  const [servings, setServings] = useState<number>(1);
  const [groceryFork, setGroceryFork] = useState<'empty' | 'stock'>('empty');
  const [maxBudgetRon, setMaxBudgetRon] = useState<number>(30);
  const [customItem, setCustomItem] = useState('');

  const { sheetStyle, backdropStyle, dragProps, scrollRef } = useSwipeDownSheet({
    onClose,
    isOpen,
  });

  if (!isOpen) return null;

  const toggleIngredient = (item: string) => {
    setFridgeIngredients((prev) =>
      prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]
    );
  };

  const addCustomIngredient = (e: React.FormEvent) => {
    e.preventDefault();
    if (customItem.trim() && !fridgeIngredients.includes(customItem.trim())) {
      setFridgeIngredients((prev) => [...prev, customItem.trim()]);
      setCustomItem('');
    }
  };

  const toggleAppliance = (app: string) => {
    setAppliances((prev) =>
      prev.includes(app) ? prev.filter((a) => a !== app) : [...prev, app]
    );
  };

  const handleStartSwipe = () => {
    const finalMode =
      mode === 'grocery_empty' || mode === 'grocery_stock'
        ? groceryFork === 'empty'
          ? 'grocery_empty'
          : 'grocery_stock'
        : mode;

    onLaunch({
      mode: finalMode,
      mealCategory,
      fridgeIngredients: finalMode === 'grocery_empty' ? [] : fridgeIngredients,
      appliances,
      servings,
      maxBudgetRon: finalMode.startsWith('grocery') ? maxBudgetRon : undefined,
      remainingCalories,
      remainingProtein,
      remainingCarbs,
      remainingFat,
    });
  };

  return (
    <div className="modal-backdrop animate-fade-in" onClick={onClose} style={backdropStyle}>
      <div className="modal-sheet animate-slide-up" onClick={(e) => e.stopPropagation()} style={sheetStyle}>
        {/* Drag Handle Touch Zone */}
        <div className="sheet-drag-handle-touch-zone" {...dragProps}>
          <div className="sheet-drag-handle" />
        </div>

        {/* Header with swipe down affordance */}
        <div className="modal-header" {...dragProps}>
          <div className="header-titles">
            <h3 className="modal-title">Filtrează Swipe Deck</h3>
            <span className="modal-sub">
              Macro-uri țintă rămase: <strong className="tabular-num text-amber">{remainingCalories} kcal</strong> | <strong className="tabular-num text-emerald">{remainingProtein}g P</strong>
            </span>
          </div>
          <button type="button" className="btn-close" onClick={onClose} aria-label="Închide">
            <X size={18} />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <div className="modal-body-scroll" ref={scrollRef}>
          {/* Category Selector */}
          <div className="config-section">
            <span className="section-label">Pentru ce masă?</span>
            <div className="category-chips-grid">
              {(['breakfast', 'lunch', 'dinner', 'snack'] as MealCategory[]).map((cat) => {
                const labels: Record<MealCategory, string> = {
                  breakfast: 'Mic Dejun',
                  lunch: 'Prânz',
                  dinner: 'Cină',
                  snack: 'Gustare',
                };
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setMealCategory(cat)}
                    className={`chip-button ${mealCategory === cat ? 'selected' : ''}`}
                  >
                    {labels[cat]}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Mode Selector */}
          <div className="config-section">
            <span className="section-label">Cum pregătești masa?</span>
            <div className="modes-stack">
              <button
                type="button"
                className={`mode-card ${mode === 'fridge' ? 'selected' : ''}`}
                onClick={() => setMode('fridge')}
              >
                <div className="mode-icon-wrap icon-fridge">
                  <Refrigerator size={18} />
                </div>
                <div className="mode-content">
                  <strong className="mode-title">Gătesc acasă (Ce am în frigider)</strong>
                  <span className="mode-sub">AI folosește strict ingredientele din stoc</span>
                </div>
              </button>

              <button
                type="button"
                className={`mode-card ${mode.startsWith('grocery') ? 'selected' : ''}`}
                onClick={() => setMode('grocery_empty')}
              >
                <div className="mode-icon-wrap icon-grocery">
                  <ShoppingCart size={18} />
                </div>
                <div className="mode-content">
                  <strong className="mode-title">Cumpărături inteligente cu buget</strong>
                  <span className="mode-sub">Frigider gol sau stoc + buget suplimentar</span>
                </div>
              </button>

              <button
                type="button"
                className={`mode-card ${mode === 'restaurant' ? 'selected' : ''}`}
                onClick={() => setMode('restaurant')}
              >
                <div className="mode-icon-wrap icon-restaurant">
                  <Utensils size={18} />
                </div>
                <div className="mode-content">
                  <strong className="mode-title">Mănânc în oraș</strong>
                  <span className="mode-sub">Ghid optimizat pentru restaurante / bistrou</span>
                </div>
              </button>
            </div>
          </div>

          {/* Grocery Fork Details */}
          {mode.startsWith('grocery') && (
            <div className="grocery-bifurcation animate-fade-in">
              <span className="section-label">Starea stocului tău:</span>
              <div className="grid-2">
                <button
                  type="button"
                  className={`choice-btn ${groceryFork === 'empty' ? 'selected' : ''}`}
                  onClick={() => setGroceryFork('empty')}
                >
                  <span className="choice-head">Frigider complet gol</span>
                  <span className="choice-hint">Pleacă de la zero</span>
                </button>
                <button
                  type="button"
                  className={`choice-btn ${groceryFork === 'stock' ? 'selected' : ''}`}
                  onClick={() => setGroceryFork('stock')}
                >
                  <span className="choice-head">Am ingrediente de bază</span>
                  <span className="choice-hint">Rețetă hibridă</span>
                </button>
              </div>

              {/* Budget Slider */}
              <div className="budget-slider-wrap">
                <div className="budget-header">
                  <span className="section-label">Plafon buget maxim:</span>
                  <span className="budget-val tabular-num">{maxBudgetRon} RON</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="100"
                  step="5"
                  value={maxBudgetRon}
                  onChange={(e) => setMaxBudgetRon(Number(e.target.value))}
                  className="slider-input"
                />
              </div>
            </div>
          )}

          {/* Ingredients Picker */}
          {(mode === 'fridge' || (mode.startsWith('grocery') && groceryFork === 'stock')) && (
            <div className="config-section animate-fade-in">
              <span className="section-label">Ce ingrediente ai la dispoziție?</span>
              <form onSubmit={addCustomIngredient} className="custom-item-form">
                <input
                  type="text"
                  placeholder="+ Adaugă ingredient custom..."
                  value={customItem}
                  onChange={(e) => setCustomItem(e.target.value)}
                  className="add-item-input"
                />
                <button type="submit" className="btn-add-item" aria-label="Adaugă">
                  <Plus size={16} />
                </button>
              </form>

              <div className="fridge-chips-wrap">
                {COMMON_PANTRY.map((ing) => {
                  const isSel = fridgeIngredients.includes(ing);
                  return (
                    <button
                      key={ing}
                      type="button"
                      onClick={() => toggleIngredient(ing)}
                      className={`fridge-chip ${isSel ? 'selected' : ''}`}
                    >
                      {isSel && <Check size={12} />}
                      <span>{ing}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Appliances */}
          <div className="config-section">
            <span className="section-label">Echipamente disponibile:</span>
            <div className="appliances-chips">
              {APPLIANCES_LIST.map((app) => {
                const isSel = appliances.includes(app.name);
                const IconComponent = app.icon;
                return (
                  <button
                    key={app.name}
                    type="button"
                    onClick={() => toggleAppliance(app.name)}
                    className={`app-chip ${isSel ? 'selected' : ''}`}
                  >
                    <IconComponent size={13} />
                    <span>{app.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Servings */}
          <div className="config-section servings-section">
            <span className="section-label">Număr porții:</span>
            <div className="servings-control">
              <button
                type="button"
                className="btn-serv"
                onClick={() => setServings((s) => Math.max(1, s - 1))}
              >
                -
              </button>
              <span className="servings-num tabular-num">{servings}</span>
              <button
                type="button"
                className="btn-serv"
                onClick={() => setServings((s) => Math.min(6, s + 1))}
              >
                +
              </button>
            </div>
          </div>
        </div>

        {/* Footer CTA */}
        <div className="modal-footer">
          <button type="button" className="btn-launch-deck" onClick={handleStartSwipe}>
            <Sparkles size={18} />
            <span>Generează & Deschide Swipe Deck</span>
          </button>
        </div>

        <style jsx>{`
          .modal-backdrop {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.75);
            backdrop-filter: blur(8px);
            -webkit-backdrop-filter: blur(8px);
            z-index: 100;
            display: flex;
            align-items: flex-end;
            justify-content: center;
          }

          .modal-sheet {
            width: 100%;
            max-width: var(--mobile-max-width);
            background: var(--bg-surface);
            border-top-left-radius: var(--radius-xl);
            border-top-right-radius: var(--radius-xl);
            border: 1px solid var(--border-medium);
            border-bottom: none;
            max-height: 88vh;
            display: flex;
            flex-direction: column;
            box-shadow: 0 -10px 40px rgba(0, 0, 0, 0.85);
          }

          .sheet-drag-handle {
            width: 36px;
            height: 4px;
            border-radius: var(--radius-full);
            background: rgba(255, 255, 255, 0.2);
            margin: 10px auto 4px auto;
          }

          .modal-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 8px 18px 12px 18px;
            border-bottom: 1px solid var(--border-subtle);
          }

          .modal-title {
            font-size: 1.15rem;
            font-weight: 800;
            color: var(--text-primary);
            letter-spacing: -0.01em;
          }

          .modal-sub {
            font-size: 0.74rem;
            color: var(--text-secondary);
          }

          :global(.text-amber) { color: var(--macro-calories); }
          :global(.text-emerald) { color: var(--macro-protein); }

          .btn-close {
            width: 32px;
            height: 32px;
            border-radius: var(--radius-full);
            background: rgba(255, 255, 255, 0.08);
            display: flex;
            align-items: center;
            justify-content: center;
            color: var(--text-secondary);
          }

          .modal-body-scroll {
            flex: 1;
            padding: 16px 18px;
            overflow-y: auto;
            display: flex;
            flex-direction: column;
            gap: 18px;
          }

          .config-section {
            display: flex;
            flex-direction: column;
            gap: 8px;
          }

          .section-label {
            font-size: 0.75rem;
            font-weight: 800;
            text-transform: uppercase;
            letter-spacing: 0.04em;
            color: var(--text-secondary);
          }

          .category-chips-grid {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 6px;
          }

          .chip-button {
            padding: 8px 4px;
            background: var(--bg-card);
            border: 1px solid var(--border-subtle);
            border-radius: var(--radius-sm);
            font-size: 0.74rem;
            font-weight: 700;
            color: var(--text-secondary);
            text-align: center;
            transition: all var(--duration-fast);
          }

          .chip-button.selected {
            background: var(--accent-primary);
            color: #ffffff;
            border-color: var(--accent-primary);
          }

          .modes-stack {
            display: flex;
            flex-direction: column;
            gap: 8px;
          }

          .mode-card {
            display: flex;
            align-items: center;
            gap: 12px;
            padding: 12px 14px;
            background: var(--bg-card);
            border: 1px solid var(--border-medium);
            border-radius: var(--radius-md);
            text-align: left;
            transition: all var(--duration-fast);
          }

          .mode-card:hover {
            background: var(--bg-card-hover);
          }

          .mode-card.selected {
            border-color: var(--macro-calories);
            background: rgba(245, 158, 11, 0.08);
            box-shadow: 0 0 14px rgba(245, 158, 11, 0.15);
          }

          .mode-icon-wrap {
            width: 36px;
            height: 36px;
            border-radius: var(--radius-sm);
            display: flex;
            align-items: center;
            justify-content: center;
            flex-shrink: 0;
          }

          .icon-fridge { background: rgba(16, 185, 129, 0.15); color: var(--macro-protein); }
          .icon-grocery { background: rgba(245, 158, 11, 0.15); color: var(--macro-calories); }
          .icon-restaurant { background: rgba(99, 102, 241, 0.15); color: var(--accent-primary); }

          .mode-content {
            display: flex;
            flex-direction: column;
            gap: 2px;
          }

          .mode-title {
            font-size: 0.86rem;
            font-weight: 700;
            color: var(--text-primary);
          }

          .mode-sub {
            font-size: 0.72rem;
            color: var(--text-tertiary);
          }

          .grocery-bifurcation {
            background: rgba(0, 0, 0, 0.25);
            padding: 12px;
            border-radius: var(--radius-md);
            border: 1px solid var(--border-subtle);
          }

          .grid-2 {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 8px;
            margin-bottom: 12px;
          }

          .choice-btn {
            padding: 10px 8px;
            background: var(--bg-card);
            border: 1px solid var(--border-subtle);
            border-radius: var(--radius-sm);
            display: flex;
            flex-direction: column;
            align-items: center;
            text-align: center;
            gap: 2px;
          }

          .choice-btn.selected {
            border-color: var(--macro-calories);
            background: rgba(245, 158, 11, 0.15);
          }

          .choice-head {
            font-size: 0.76rem;
            font-weight: 700;
            color: var(--text-primary);
          }

          .choice-hint {
            font-size: 0.66rem;
            color: var(--text-tertiary);
          }

          .budget-slider-wrap {
            display: flex;
            flex-direction: column;
            gap: 6px;
          }

          .budget-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
          }

          .budget-val {
            font-size: 0.95rem;
            font-weight: 800;
            color: var(--macro-calories);
          }

          .slider-input {
            width: 100%;
            accent-color: var(--macro-calories);
          }

          .custom-item-form {
            display: flex;
            gap: 6px;
            margin-bottom: 8px;
          }

          .add-item-input {
            flex: 1;
            padding: 8px 12px;
            background: var(--bg-card);
            border: 1px solid var(--border-medium);
            border-radius: var(--radius-sm);
            font-size: 0.8rem;
            color: var(--text-primary);
          }

          .btn-add-item {
            padding: 0 12px;
            background: var(--accent-primary);
            color: #ffffff;
            border-radius: var(--radius-sm);
            display: flex;
            align-items: center;
            justify-content: center;
          }

          .fridge-chips-wrap, .appliances-chips {
            display: flex;
            flex-wrap: wrap;
            gap: 6px;
          }

          .fridge-chip, .app-chip {
            display: flex;
            align-items: center;
            gap: 4px;
            padding: 5px 10px;
            background: var(--bg-card);
            border: 1px solid var(--border-subtle);
            border-radius: var(--radius-full);
            font-size: 0.72rem;
            font-weight: 600;
            color: var(--text-secondary);
            transition: all var(--duration-fast);
          }

          .fridge-chip.selected {
            background: rgba(16, 185, 129, 0.15);
            border-color: var(--macro-protein);
            color: #6ee7b7;
          }

          .app-chip.selected {
            background: rgba(99, 102, 241, 0.15);
            border-color: var(--accent-primary);
            color: #a5b4fc;
          }

          .servings-section {
            flex-direction: row;
            align-items: center;
            justify-content: space-between;
          }

          .servings-control {
            display: flex;
            align-items: center;
            gap: 12px;
            background: var(--bg-card);
            padding: 4px 10px;
            border-radius: var(--radius-full);
            border: 1px solid var(--border-medium);
          }

          .btn-serv {
            width: 26px;
            height: 26px;
            border-radius: var(--radius-full);
            background: rgba(255, 255, 255, 0.08);
            font-size: 1.05rem;
            font-weight: 800;
            color: var(--text-primary);
            display: flex;
            align-items: center;
            justify-content: center;
          }

          .servings-num {
            font-size: 0.95rem;
            font-weight: 800;
            color: var(--text-primary);
            width: 18px;
            text-align: center;
          }

          .modal-footer {
            padding: 12px 18px var(--safe-bottom) 18px;
            border-top: 1px solid var(--border-subtle);
            background: var(--bg-surface-raised);
            flex-shrink: 0;
            box-shadow: 0 -4px 16px rgba(0, 0, 0, 0.4);
          }

          .btn-launch-deck {
            width: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            padding: 14px 20px;
            background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
            color: #06080d;
            border-radius: var(--radius-md);
            font-size: 0.92rem;
            font-weight: 800;
            box-shadow: 0 4px 20px rgba(245, 158, 11, 0.4);
            transition: transform var(--duration-fast);
          }

          .btn-launch-deck:hover {
            transform: translateY(-1px);
          }
        `}</style>
      </div>
    </div>
  );
}
