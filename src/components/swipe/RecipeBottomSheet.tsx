'use client';

import React from 'react';
import { MealCardProposal } from '@/types/nutrition';
import { X, Clock, Flame, Dumbbell, ShoppingBag, CheckCircle, ChefHat, Check } from 'lucide-react';

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
  if (!isOpen || !recipe) return null;

  return (
    <div className="sheet-overlay animate-fade-in" onClick={onClose}>
      <div className="sheet-panel animate-slide-up" onClick={(e) => e.stopPropagation()}>
        <div className="sheet-drag-handle" />

        {/* Header */}
        <div className="sheet-header">
          <div className="header-tags-row">
            <span className="mode-chip">{recipe.mode}</span>
            <div className="time-pill">
              <Clock size={13} />
              <span className="tabular-num">Prep: {recipe.prepTimeMinutes}m | Gătit: {recipe.cookTimeMinutes}m</span>
            </div>
          </div>
          <button type="button" className="btn-close-sheet" onClick={onClose} aria-label="Închide">
            <X size={20} />
          </button>
        </div>

        <h2 className="recipe-full-title">{recipe.title}</h2>
        <p className="recipe-match-desc">{recipe.matchReason}</p>

        {/* Macro Summary Grid */}
        <div className="sheet-macros-grid">
          <div className="macro-cell macro-cal">
            <Flame size={15} />
            <span className="cell-num tabular-num">{recipe.calories}</span>
            <span className="cell-sub">Calorii</span>
          </div>
          <div className="macro-cell macro-prot">
            <Dumbbell size={15} />
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

        {/* Scrollable Content */}
        <div className="sheet-scroll-body">
          {/* Ingredients Section */}
          <div className="recipe-section">
            <div className="section-head">
              <ShoppingBag size={16} className="head-icon" />
              <h4 className="section-name">Ingrediente Necesare ({recipe.ingredients.length})</h4>
            </div>

            <div className="ingredients-list">
              {recipe.ingredients.map((ing, i) => (
                <div key={i} className={`ingr-row ${ing.toBuy ? 'ingr-to-buy' : ''}`}>
                  <div className="ingr-left">
                    <div className="ingr-bullet" />
                    <span className="ingr-name">{ing.name}</span>
                  </div>
                  <div className="ingr-right">
                    <span className="ingr-amount tabular-num">{ing.amount}</span>
                    {ing.toBuy && <span className="to-buy-badge">De cumpărat</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Instructions Section */}
          <div className="recipe-section">
            <div className="section-head">
              <ChefHat size={16} className="head-icon" />
              <h4 className="section-name">Mod de Preparare Pas cu Pas</h4>
            </div>

            <div className="instructions-list">
              {recipe.instructions.map((step, idx) => (
                <div key={idx} className="step-row">
                  <div className="step-index-pill tabular-num">{idx + 1}</div>
                  <p className="step-text">{step}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Appliances Used */}
          {recipe.appliancesUsed.length > 0 && (
            <div className="appliances-note">
              <strong>Echipamente folosite:</strong> {recipe.appliancesUsed.join(', ')}
            </div>
          )}
        </div>

        {/* Bottom Cook & Log CTA */}
        {onCookAndLog && (
          <div className="sheet-footer">
            <button
              type="button"
              className="btn-cook-log"
              onClick={() => onCookAndLog(recipe)}
            >
              <CheckCircle size={18} />
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

          .sheet-drag-handle {
            width: 40px;
            height: 4px;
            background: rgba(255, 255, 255, 0.2);
            border-radius: var(--radius-full);
            margin: 10px auto 4px auto;
            flex-shrink: 0;
          }

          .sheet-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 10px 18px;
            flex-shrink: 0;
          }

          .header-tags-row {
            display: flex;
            align-items: center;
            gap: 8px;
          }

          .mode-chip {
            font-size: 0.7rem;
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

          .btn-close-sheet:hover {
            color: var(--text-primary);
            background: rgba(255, 255, 255, 0.08);
          }

          .recipe-full-title {
            font-size: 1.3rem;
            font-weight: 800;
            color: var(--text-primary);
            padding: 0 18px;
            line-height: 1.25;
            letter-spacing: -0.01em;
            margin-bottom: 6px;
          }

          .recipe-match-desc {
            font-size: 0.78rem;
            color: #c7d2fe;
            padding: 0 18px;
            margin-bottom: 14px;
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
          .cell-sub { font-size: 0.62rem; font-weight: 700; text-transform: uppercase; }

          .sheet-scroll-body {
            flex: 1;
            overflow-y: auto;
            padding: 12px 18px;
            display: flex;
            flex-direction: column;
            gap: 18px;
          }

          .recipe-section {
            display: flex;
            flex-direction: column;
            gap: 10px;
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
            font-size: 0.88rem;
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
            font-size: 0.82rem;
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
            gap: 12px;
          }

          .step-row {
            display: flex;
            align-items: flex-start;
            gap: 12px;
          }

          .step-index-pill {
            width: 24px;
            height: 24px;
            border-radius: var(--radius-full);
            background: var(--accent-primary);
            color: #ffffff;
            font-size: 0.78rem;
            font-weight: 800;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-shrink: 0;
            margin-top: 2px;
          }

          .step-text {
            font-size: 0.84rem;
            color: var(--text-secondary);
            line-height: 1.45;
          }

          .appliances-note {
            font-size: 0.76rem;
            color: var(--text-tertiary);
            padding: 10px 12px;
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
            font-size: 0.95rem;
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
