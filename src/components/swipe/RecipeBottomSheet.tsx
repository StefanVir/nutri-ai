'use client';

import React from 'react';
import { MealCardProposal } from '@/types/nutrition';
import { X, Clock, Check, Utensils, ListOrdered } from 'lucide-react';

import { useSwipeDownSheet } from '@/lib/useSwipeDownSheet';

interface RecipeBottomSheetProps {
  recipe: MealCardProposal | null;
  isOpen: boolean;
  onClose: () => void;
  onCookAndLog?: (recipe: MealCardProposal) => void;
}

export function RecipeBottomSheet({
  recipe,
  isOpen,
  onClose,
  onCookAndLog,
}: RecipeBottomSheetProps) {
  const { sheetStyle, backdropStyle, dragProps, scrollRef } = useSwipeDownSheet({
    onClose,
    isOpen: isOpen && !!recipe,
  });

  if (!isOpen || !recipe) return null;

  return (
    <div className="sheet-overlay animate-fade-in" onClick={onClose} style={backdropStyle}>
      <div className="sheet-panel animate-slide-up" onClick={(e) => e.stopPropagation()} style={sheetStyle}>
        {/* Top Drag Handle Touch Zone */}
        <div className="sheet-drag-handle-touch-zone" {...dragProps}>
          <div className="sheet-drag-handle" />
        </div>

        {/* Header */}
        <div className="sheet-header" {...dragProps}>
          <div className="header-tags-row">
            <span className="mode-chip">{recipe.mode === 'fridge' ? 'Din Frigider' : 'Smart Grocery'}</span>
            <div className="time-pill">
              <Clock size={13} />
              <span className="tabular-num">{recipe.prepTimeMinutes + recipe.cookTimeMinutes} min</span>
            </div>
          </div>
          <button type="button" className="btn-close-sheet" onClick={onClose} aria-label="Închide">
            <X size={18} />
          </button>
        </div>

        {/* Recipe Photo Cover */}
        {recipe.imageUrl && (
          <div className="sheet-recipe-hero">
            <img src={recipe.imageUrl} alt={recipe.title} className="sheet-hero-img" />
            <div className="sheet-hero-gradient" />
          </div>
        )}

        <h2 className="recipe-full-title">{recipe.title}</h2>
        <p className="recipe-match-desc">{recipe.matchReason}</p>

        {/* Macro Strip */}
        <div className="sheet-macros-grid">
          <div className="macro-cell macro-cal">
            <span className="cell-num tabular-num">{recipe.calories}</span>
            <span className="cell-sub">kcal</span>
          </div>
          <div className="macro-cell macro-prot">
            <span className="cell-num tabular-num">{recipe.protein}g</span>
            <span className="cell-sub">Proteine</span>
          </div>
          <div className="macro-cell macro-carb">
            <span className="cell-num tabular-num">{recipe.carbs}g</span>
            <span className="cell-sub">Carbohidrați</span>
          </div>
          <div className="macro-cell macro-fat">
            <span className="cell-num tabular-num">{recipe.fat}g</span>
            <span className="cell-sub">Grăsimi</span>
          </div>
        </div>

        {/* Scrollable Ingredients & Steps */}
        <div className="sheet-scroll-body" ref={scrollRef}>
          {/* Ingredients Section */}
          <div className="recipe-section">
            <div className="section-head">
              <Utensils size={16} className="head-icon" />
              <h3 className="section-name">Ingrediente Necesare ({recipe.servings} {recipe.servings === 1 ? 'porție' : 'porții'})</h3>
            </div>

            <div className="ingredients-list">
              {recipe.ingredients.map((ing, i) => (
                <div key={i} className={`ingr-row ${ing.toBuy ? 'ingr-to-buy' : ''}`}>
                  <div className="ingr-left">
                    <span className="ingr-bullet" />
                    <span className="ingr-name">{ing.name}</span>
                  </div>
                  <div className="ingr-right">
                    <span className="ingr-amount tabular-num">{ing.amount}</span>
                    {ing.toBuy && <span className="to-buy-badge">De Cumpărat</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Cooking Steps */}
          <div className="recipe-section">
            <div className="section-head">
              <ListOrdered size={16} className="head-icon" />
              <h3 className="section-name">Mod de Preparare Pas cu Pas</h3>
            </div>

            <div className="instructions-list">
              {recipe.instructions.map((step, idx) => (
                <div key={idx} className="step-row">
                  <span className="step-index-pill tabular-num">{idx + 1}</span>
                  <p className="step-text">{step}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Appliances Note */}
          <div className="appliances-note">
            <span>Echipamente utilizate: <strong>{recipe.appliancesUsed.join(', ')}</strong></span>
          </div>
        </div>

        {/* Footer Action */}
        {onCookAndLog && (
          <div className="sheet-footer">
            <button
              type="button"
              className="btn-cook-log"
              onClick={() => onCookAndLog(recipe)}
            >
              <Check size={18} />
              <span>Gătește & Loghează în Jurnal</span>
            </button>
          </div>
        )}

        <style jsx>{`
          .sheet-overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.8);
            backdrop-filter: blur(8px);
            z-index: 110;
            display: flex;
            align-items: flex-end;
            justify-content: center;
          }

          .sheet-panel {
            width: 100%;
            max-width: var(--mobile-max-width);
            max-height: 88vh;
            background: var(--bg-surface-raised);
            border-top: 1px solid var(--border-bright);
            border-radius: var(--radius-xl) var(--radius-xl) 0 0;
            display: flex;
            flex-direction: column;
            box-shadow: 0 -12px 50px rgba(0, 0, 0, 0.9);
            overflow: hidden;
          }

          .sheet-drag-handle-touch-zone {
            width: 100%;
            padding: 12px 0 6px 0;
            display: flex;
            justify-content: center;
            align-items: center;
            cursor: grab;
            touch-action: none;
            user-select: none;
            flex-shrink: 0;
          }

          .sheet-drag-handle-touch-zone:active {
            cursor: grabbing;
          }

          .sheet-drag-handle {
            width: 44px;
            height: 5px;
            background: rgba(255, 255, 255, 0.28);
            border-radius: var(--radius-full);
            margin: 0 auto;
            transition: background 0.15s, width 0.15s;
          }

          .sheet-drag-handle-touch-zone:hover .sheet-drag-handle,
          .sheet-drag-handle-touch-zone:active .sheet-drag-handle {
            background: rgba(255, 255, 255, 0.55);
            width: 52px;
          }

          .sheet-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 8px 18px 10px 18px;
            flex-shrink: 0;
            cursor: grab;
            user-select: none;
            touch-action: pan-y;
          }

          .sheet-recipe-hero {
            position: relative;
            width: 100%;
            height: 140px;
            overflow: hidden;
            background: #0d121d;
            flex-shrink: 0;
          }

          .sheet-hero-img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            display: block;
          }

          .sheet-hero-gradient {
            position: absolute;
            inset: 0;
            background: linear-gradient(to bottom, transparent 30%, var(--bg-surface-raised) 100%);
          }

          .header-tags-row {
            display: flex;
            align-items: center;
            gap: 8px;
          }

          .mode-chip {
            font-size: 0.68rem;
            font-weight: 800;
            text-transform: uppercase;
            padding: 3px 8px;
            border-radius: var(--radius-full);
            background: rgba(99, 102, 241, 0.15);
            color: #a5b4fc;
          }

          .time-pill {
            display: flex;
            align-items: center;
            gap: 4px;
            font-size: 0.74rem;
            font-weight: 700;
            color: var(--text-tertiary);
          }

          .btn-close-sheet {
            color: var(--text-tertiary);
            padding: 6px;
            border-radius: var(--radius-full);
          }

          .recipe-full-title {
            font-size: 1.25rem;
            font-weight: 800;
            color: var(--text-primary);
            padding: 0 18px;
            line-height: 1.25;
            letter-spacing: -0.01em;
            margin-bottom: 4px;
          }

          .recipe-match-desc {
            font-size: 0.78rem;
            color: #c7d2fe;
            padding: 0 18px;
            margin-bottom: 12px;
            line-height: 1.35;
          }

          .sheet-macros-grid {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 6px;
            padding: 0 18px 12px 18px;
          }

          .macro-cell {
            display: flex;
            flex-direction: column;
            align-items: center;
            padding: 8px 4px;
            border-radius: var(--radius-sm);
            text-align: center;
          }

          .macro-cal { background: var(--macro-calories-bg); color: var(--macro-calories); border: 1px solid rgba(245, 158, 11, 0.2); }
          .macro-prot { background: var(--macro-protein-bg); color: var(--macro-protein); border: 1px solid rgba(16, 185, 129, 0.2); }
          .macro-carb { background: var(--macro-carbs-bg); color: var(--macro-carbs); border: 1px solid rgba(6, 182, 212, 0.2); }
          .macro-fat { background: var(--macro-fat-bg); color: var(--macro-fat); border: 1px solid rgba(244, 63, 94, 0.2); }

          .cell-num { font-size: 0.95rem; font-weight: 800; }
          .cell-sub { font-size: 0.6rem; font-weight: 700; text-transform: uppercase; }

          .sheet-scroll-body {
            flex: 1;
            overflow-y: auto;
            padding: 12px 18px;
            display: flex;
            flex-direction: column;
            gap: 16px;
          }

          .recipe-section {
            display: flex;
            flex-direction: column;
            gap: 8px;
          }

          .section-head {
            display: flex;
            align-items: center;
            gap: 8px;
          }

          :global(.head-icon) {
            color: var(--accent-primary);
          }

          .section-name {
            font-size: 0.85rem;
            font-weight: 800;
            color: var(--text-primary);
          }

          .ingredients-list {
            display: flex;
            flex-direction: column;
            gap: 6px;
          }

          .ingr-row {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 8px 12px;
            background: var(--bg-card);
            border: 1px solid var(--border-subtle);
            border-radius: var(--radius-sm);
            font-size: 0.8rem;
          }

          .ingr-to-buy {
            border-color: rgba(245, 158, 11, 0.35);
            background: rgba(245, 158, 11, 0.08);
          }

          .ingr-left {
            display: flex;
            align-items: center;
            gap: 8px;
          }

          .ingr-bullet {
            width: 6px;
            height: 6px;
            border-radius: var(--radius-full);
            background: var(--macro-protein);
          }

          .ingr-name {
            color: var(--text-primary);
            font-weight: 600;
          }

          .ingr-right {
            display: flex;
            align-items: center;
            gap: 8px;
          }

          .ingr-amount {
            color: var(--text-secondary);
            font-weight: 700;
          }

          .to-buy-badge {
            font-size: 0.65rem;
            font-weight: 800;
            text-transform: uppercase;
            padding: 2px 6px;
            border-radius: 4px;
            background: var(--macro-calories-bg);
            color: var(--macro-calories);
            border: 1px solid rgba(245, 158, 11, 0.3);
          }

          .instructions-list {
            display: flex;
            flex-direction: column;
            gap: 10px;
          }

          .step-row {
            display: flex;
            align-items: flex-start;
            gap: 10px;
          }

          .step-index-pill {
            width: 22px;
            height: 22px;
            border-radius: var(--radius-full);
            background: var(--accent-primary);
            color: #ffffff;
            font-size: 0.74rem;
            font-weight: 800;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-shrink: 0;
            margin-top: 2px;
          }

          .step-text {
            font-size: 0.82rem;
            color: var(--text-secondary);
            line-height: 1.4;
          }

          .appliances-note {
            font-size: 0.74rem;
            color: var(--text-tertiary);
            padding: 8px 12px;
            background: rgba(0, 0, 0, 0.2);
            border-radius: var(--radius-sm);
          }

          .appliances-note strong {
            color: var(--text-secondary);
          }

          .sheet-footer {
            padding: 12px 18px var(--safe-bottom) 18px;
            border-top: 1px solid var(--border-subtle);
          }

          .btn-cook-log {
            width: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            padding: 14px 20px;
            background: linear-gradient(135deg, #10b981 0%, #059669 100%);
            color: #ffffff;
            border-radius: var(--radius-md);
            font-size: 0.92rem;
            font-weight: 800;
            box-shadow: 0 4px 18px rgba(16, 185, 129, 0.4);
            transition: transform var(--duration-fast);
          }

          .btn-cook-log:hover {
            transform: translateY(-1px);
          }
        `}</style>
      </div>
    </div>
  );
}
