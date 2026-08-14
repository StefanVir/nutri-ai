'use client';

import React, { useState } from 'react';
import { SwipeMode, MealCategory, PreSwipeContext } from '@/types/nutrition';
import { POPULAR_FRIDGE_ITEMS, DEFAULT_APPLIANCES } from '@/lib/metabolic';
import { Sparkles, Refrigerator, ShoppingCart, Utensils, X, Plus, Check } from 'lucide-react';

interface PreSwipeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLaunchSwipe: (context: PreSwipeContext) => void;
  defaultCategory?: MealCategory;
  remainingCalories: number;
  remainingProtein: number;
  remainingCarbs: number;
  remainingFat: number;
  userAppliances: string[];
}

export function PreSwipeModal({
  isOpen,
  onClose,
  onLaunchSwipe,
  defaultCategory = 'lunch',
  remainingCalories,
  remainingProtein,
  remainingCarbs,
  remainingFat,
  userAppliances,
}: PreSwipeModalProps) {
  const [mode, setMode] = useState<SwipeMode>('fridge');
  const [mealCategory, setMealCategory] = useState<MealCategory>(defaultCategory);
  const [servings, setServings] = useState(1);
  const [groceryIsEmptyFridge, setGroceryIsEmptyFridge] = useState(false);
  const [maxBudgetRon, setMaxBudgetRon] = useState(30);
  const [selectedFridgeItems, setSelectedFridgeItems] = useState<string[]>([
    'Ouă',
    'Piept de pui',
    'Spanac proaspăt',
    'Brânză telemea / Feta',
    'Lipii integrale',
  ]);
  const [customItemInput, setCustomItemInput] = useState('');
  const [selectedAppliances, setSelectedAppliances] = useState<string[]>(userAppliances);

  if (!isOpen) return null;

  const handleAddCustomItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (customItemInput.trim()) {
      if (!selectedFridgeItems.includes(customItemInput.trim())) {
        setSelectedFridgeItems([...selectedFridgeItems, customItemInput.trim()]);
      }
      setCustomItemInput('');
    }
  };

  const toggleFridgeItem = (item: string) => {
    if (selectedFridgeItems.includes(item)) {
      setSelectedFridgeItems(selectedFridgeItems.filter((i) => i !== item));
    } else {
      setSelectedFridgeItems([...selectedFridgeItems, item]);
    }
  };

  const toggleAppliance = (app: string) => {
    if (selectedAppliances.includes(app)) {
      setSelectedAppliances(selectedAppliances.filter((a) => a !== app));
    } else {
      setSelectedAppliances([...selectedAppliances, app]);
    }
  };

  const handleStart = () => {
    const resolvedMode: SwipeMode =
      mode === 'grocery_empty' || (mode === 'grocery_stock' && groceryIsEmptyFridge)
        ? 'grocery_empty'
        : mode === 'grocery_stock' && !groceryIsEmptyFridge
        ? 'grocery_stock'
        : mode;

    onLaunchSwipe({
      mode: resolvedMode,
      mealCategory,
      servings,
      appliances: selectedAppliances,
      fridgeIngredients: resolvedMode === 'grocery_empty' || resolvedMode === 'restaurant' ? [] : selectedFridgeItems,
      maxBudgetRon: mode.includes('grocery') ? maxBudgetRon : undefined,
      remainingCalories,
      remainingProtein,
      remainingCarbs,
      remainingFat,
    });
  };

  return (
    <div className="modal-overlay animate-fade-in" onClick={onClose}>
      <div className="modal-sheet animate-slide-up" onClick={(e) => e.stopPropagation()}>
        <div className="sheet-drag-handle" />

        <div className="modal-header">
          <div className="header-title-wrap">
            <Sparkles size={18} className="sparkle-icon" />
            <h3 className="modal-title">Configurează The Swipe Machine</h3>
          </div>
          <button type="button" className="btn-close" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {/* Dynamic Context Banner */}
        <div className="macro-context-banner">
          <span className="banner-label">CONTEXT NUTRITIONAL RĂMAS:</span>
          <div className="banner-badges tabular-num">
            <span className="badge badge-calories">{remainingCalories} kcal</span>
            <span className="badge badge-protein">{remainingProtein}g P</span>
            <span className="badge badge-carbs">{remainingCarbs}g C</span>
            <span className="badge badge-fat">{remainingFat}g F</span>
          </div>
        </div>

        <div className="modal-body">
          {/* Category Selector */}
          <div className="config-section">
            <label className="section-label">Pentru ce masă glisezi?</label>
            <div className="category-chips-grid">
              {(['breakfast', 'lunch', 'dinner', 'snack'] as MealCategory[]).map((cat) => (
                <button
                  key={cat}
                  type="button"
                  className={`chip-button ${mealCategory === cat ? 'selected' : ''}`}
                  onClick={() => setMealCategory(cat)}
                >
                  {cat === 'breakfast' && 'Mic Dejun'}
                  {cat === 'lunch' && 'Prânz'}
                  {cat === 'dinner' && 'Cină'}
                  {cat === 'snack' && 'Gustare'}
                </button>
              ))}
            </div>
          </div>

          {/* Mode Selector */}
          <div className="config-section">
            <label className="section-label">Alege modul de căutare</label>
            <div className="modes-stack">
              {/* Option 1: Fridge */}
              <button
                type="button"
                className={`mode-card ${mode === 'fridge' ? 'selected' : ''}`}
                onClick={() => setMode('fridge')}
              >
                <div className="mode-icon-wrap icon-fridge">
                  <Refrigerator size={20} />
                </div>
                <div className="mode-content">
                  <span className="mode-title">Gătesc acasă (Ce am în frigider)</span>
                  <span className="mode-sub">Rețete fără cumpărături din stocul tău curent</span>
                </div>
              </button>

              {/* Option 2: Smart Grocery */}
              <button
                type="button"
                className={`mode-card ${mode.includes('grocery') ? 'selected' : ''}`}
                onClick={() => setMode('grocery_stock')}
              >
                <div className="mode-icon-wrap icon-grocery">
                  <ShoppingCart size={20} />
                </div>
                <div className="mode-content">
                  <span className="mode-title">Cumpărături Inteligente & Buget</span>
                  <span className="mode-sub">Optimizare cost & ingrediente minime</span>
                </div>
              </button>

              {/* Option 3: Restaurant */}
              <button
                type="button"
                className={`mode-card ${mode === 'restaurant' ? 'selected' : ''}`}
                onClick={() => setMode('restaurant')}
              >
                <div className="mode-icon-wrap icon-restaurant">
                  <Utensils size={20} />
                </div>
                <div className="mode-content">
                  <span className="mode-title">Mănânc în oraș / Restaurant</span>
                  <span className="mode-sub">Ghid de comenzi la restaurant pe macro-uri</span>
                </div>
              </button>
            </div>
          </div>

          {/* Grocery Specific Bifurcation & Budget */}
          {mode.includes('grocery') && (
            <div className="config-section grocery-bifurcation animate-fade-in">
              <label className="section-label">Ai deja ingrediente sau frigiderul e gol?</label>
              <div className="grid-2">
                <button
                  type="button"
                  className={`choice-btn ${groceryIsEmptyFridge ? 'selected' : ''}`}
                  onClick={() => setGroceryIsEmptyFridge(true)}
                >
                  <span className="choice-head">Frigider complet gol</span>
                  <span className="choice-hint">Rețetă completă de la zero</span>
                </button>
                <button
                  type="button"
                  className={`choice-btn ${!groceryIsEmptyFridge ? 'selected' : ''}`}
                  onClick={() => setGroceryIsEmptyFridge(false)}
                >
                  <span className="choice-head">Am ingrediente de bază</span>
                  <span className="choice-hint">Completează doar ce lipsește</span>
                </button>
              </div>

              <div className="budget-slider-wrap">
                <div className="budget-header">
                  <span className="section-label" style={{ margin: 0 }}>Plafon Buget Maxim:</span>
                  <strong className="budget-val tabular-num">{maxBudgetRon} RON</strong>
                </div>
                <input
                  type="range"
                  min="10"
                  max="80"
                  step="5"
                  value={maxBudgetRon}
                  onChange={(e) => setMaxBudgetRon(Number(e.target.value))}
                  className="slider-input"
                />
              </div>
            </div>
          )}

          {/* Fridge Ingredients Selector (when mode is fridge or grocery with stock) */}
          {(mode === 'fridge' || (mode.includes('grocery') && !groceryIsEmptyFridge)) && (
            <div className="config-section animate-fade-in">
              <label className="section-label">Ce ai în frigider/cămară?</label>

              <form onSubmit={handleAddCustomItem} className="custom-item-form">
                <input
                  type="text"
                  value={customItemInput}
                  onChange={(e) => setCustomItemInput(e.target.value)}
                  placeholder="Adaugă ingredient (ex: ciuperci, avocado...)"
                  className="add-item-input"
                />
                <button type="submit" className="btn-add-item" aria-label="Adaugă">
                  <Plus size={16} />
                </button>
              </form>

              <div className="fridge-chips-wrap">
                {POPULAR_FRIDGE_ITEMS.map((item) => {
                  const isSelected = selectedFridgeItems.includes(item);
                  return (
                    <button
                      key={item}
                      type="button"
                      className={`fridge-chip ${isSelected ? 'selected' : ''}`}
                      onClick={() => toggleFridgeItem(item)}
                    >
                      {isSelected && <Check size={12} />}
                      <span>{item}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Appliances Selector */}
          {mode !== 'restaurant' && (
            <div className="config-section">
              <label className="section-label">Echipamente folosite</label>
              <div className="appliances-chips">
                {DEFAULT_APPLIANCES.map((app) => {
                  const isSelected = selectedAppliances.includes(app.name);
                  return (
                    <button
                      key={app.id}
                      type="button"
                      className={`app-chip ${isSelected ? 'selected' : ''}`}
                      onClick={() => toggleAppliance(app.name)}
                    >
                      {isSelected && <Check size={12} />}
                      <span>{app.name.split('/')[0]}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Servings */}
          <div className="config-section servings-section">
            <span className="section-label" style={{ margin: 0 }}>Număr porții:</span>
            <div className="servings-control">
              <button
                type="button"
                className="btn-serv"
                onClick={() => setServings(Math.max(1, servings - 1))}
              >
                -
              </button>
              <span className="servings-num tabular-num">{servings}</span>
              <button
                type="button"
                className="btn-serv"
                onClick={() => setServings(Math.min(6, servings + 1))}
              >
                +
              </button>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="modal-footer">
          <button type="button" className="btn-launch-deck" onClick={handleStart}>
            <Sparkles size={18} />
            <span>Lansează The Swipe Deck</span>
          </button>
        </div>

        <style jsx>{`
          .modal-overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.75);
            backdrop-filter: blur(8px);
            z-index: 100;
            display: flex;
            align-items: flex-end;
            justify-content: center;
          }

          .modal-sheet {
            width: 100%;
            max-width: var(--mobile-max-width);
            max-height: 85vh;
            background: var(--bg-surface-raised);
            border-top: 1px solid var(--border-medium);
            border-radius: var(--radius-xl) var(--radius-xl) 0 0;
            display: flex;
            flex-direction: column;
            box-shadow: 0 -10px 40px rgba(0, 0, 0, 0.8);
            overflow: hidden;
          }

          .sheet-drag-handle {
            width: 40px;
            height: 4px;
            background: rgba(255, 255, 255, 0.2);
            border-radius: var(--radius-full);
            margin: 10px auto 4px auto;
            flex-shrink: 0;
          }

          .modal-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 12px 18px;
            border-bottom: 1px solid var(--border-subtle);
            flex-shrink: 0;
          }

          .header-title-wrap {
            display: flex;
            align-items: center;
            gap: 8px;
          }

          :global(.sparkle-icon) {
            color: var(--macro-calories);
          }

          .modal-title {
            font-size: 1.05rem;
            font-weight: 800;
            color: var(--text-primary);
          }

          .btn-close {
            color: var(--text-tertiary);
            padding: 6px;
            border-radius: var(--radius-full);
          }

          .btn-close:hover {
            color: var(--text-primary);
            background: rgba(255, 255, 255, 0.05);
          }

          .macro-context-banner {
            background: rgba(0, 0, 0, 0.35);
            padding: 10px 18px;
            display: flex;
            flex-direction: column;
            gap: 6px;
            border-bottom: 1px solid var(--border-subtle);
            flex-shrink: 0;
          }

          .banner-label {
            font-size: 0.65rem;
            font-weight: 800;
            color: var(--text-tertiary);
            letter-spacing: 0.05em;
          }

          .banner-badges {
            display: flex;
            align-items: center;
            gap: 6px;
            flex-wrap: wrap;
          }

          .modal-body {
            flex: 1;
            overflow-y: auto;
            padding: 16px 18px;
            display: flex;
            flex-direction: column;
            gap: 18px;
            -webkit-overflow-scrolling: touch;
          }

          .config-section {
            display: flex;
            flex-direction: column;
            gap: 8px;
          }

          .section-label {
            font-size: 0.76rem;
            font-weight: 800;
            text-transform: uppercase;
            letter-spacing: 0.03em;
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
            font-size: 0.75rem;
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
            font-size: 0.88rem;
            font-weight: 700;
            color: var(--text-primary);
          }

          .mode-sub {
            font-size: 0.72rem;
            color: var(--text-tertiary);
          }

          .grocery-bifurcation {
            background: rgba(0, 0, 0, 0.2);
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
            font-size: 0.78rem;
            font-weight: 700;
            color: var(--text-primary);
          }

          .choice-hint {
            font-size: 0.68rem;
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
            font-size: 1rem;
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
            font-size: 0.82rem;
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
            font-size: 0.74rem;
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
            font-size: 1.1rem;
            font-weight: 800;
            color: var(--text-primary);
            display: flex;
            align-items: center;
            justify-content: center;
          }

          .servings-num {
            font-size: 1rem;
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
            color: #07090e;
            border-radius: var(--radius-md);
            font-size: 0.95rem;
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
