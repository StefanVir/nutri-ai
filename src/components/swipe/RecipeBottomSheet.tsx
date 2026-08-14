'use client';

import React, { useState } from 'react';
import { MealCardProposal } from '@/types/nutrition';
import { X, Clock, Check, Utensils, ListOrdered, Flame, Zap, CookingPot, Sparkles, ChefHat, Scale } from 'lucide-react';
import { evaluateDishFlavor } from '@/lib/flavorEngine';
import { convertApplianceInstructions, ApplianceType } from '@/lib/applianceConverter';
import { CookModeModal } from './CookModeModal';
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
  const [portionMultiplier, setPortionMultiplier] = useState<number>(1);
  const [selectedAppliance, setSelectedAppliance] = useState<ApplianceType>('Aragaz / Tigaie');
  const [isCookModeOpen, setIsCookModeOpen] = useState(false);

  const { sheetStyle, backdropStyle, dragProps, scrollRef } = useSwipeDownSheet({
    onClose,
    isOpen: isOpen && !!recipe,
  });

  if (!isOpen || !recipe) return null;

  // Flavor evaluation
  const flavor = evaluateDishFlavor(recipe.ingredients);

  // Appliance converted instructions
  const converted = convertApplianceInstructions(
    recipe.instructions,
    selectedAppliance,
    recipe.ingredients
  );

  // Scaled macros
  const scaledCalories = Math.round(recipe.calories * portionMultiplier);
  const scaledProtein = Math.round(recipe.protein * portionMultiplier);
  const scaledCarbs = Math.round(recipe.carbs * portionMultiplier);
  const scaledFat = Math.round(recipe.fat * portionMultiplier);

  // Scaled recipe copy for Cook Mode & Logging
  const activeScaledRecipe: MealCardProposal = {
    ...recipe,
    servings: (recipe.servings || 1) * portionMultiplier,
    calories: scaledCalories,
    protein: scaledProtein,
    carbs: scaledCarbs,
    fat: scaledFat,
    appliancesUsed: [selectedAppliance],
    prepTimeMinutes: converted.prepTimeMinutes,
    cookTimeMinutes: converted.cookTimeMinutes,
    instructions: converted.instructions,
    ingredients: recipe.ingredients.map((ing) => {
      const match = ing.amount.match(/(\d+(?:\.\d+)?)/);
      if (match) {
        const num = parseFloat(match[1]) * portionMultiplier;
        const newAmount = ing.amount.replace(match[1], String(Math.round(num)));
        return { ...ing, amount: newAmount };
      }
      return ing;
    }),
  };

  return (
    <>
      <div className="sheet-overlay animate-fade-in" onClick={onClose} style={backdropStyle}>
        <div className="sheet-panel animate-slide-up" onClick={(e) => e.stopPropagation()} style={sheetStyle}>
          {/* Top Drag Handle Touch Zone */}
          <div className="sheet-drag-handle-touch-zone" {...dragProps}>
            <div className="sheet-drag-handle" />
          </div>

          {/* Header */}
          <div className="sheet-header" {...dragProps}>
            <div className="header-tags-row flex items-center gap-2">
              <span className="mode-chip">{recipe.mode === 'fridge' ? 'Din Frigider' : 'Smart Grocery'}</span>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                {flavor.badge}
              </span>
              <div className="time-pill">
                <Clock size={13} />
                <span className="tabular-num">{converted.prepTimeMinutes + converted.cookTimeMinutes} min</span>
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
          <p className="recipe-match-desc">
            {recipe.matchReason && !recipe.matchReason.toLowerCase().startsWith('explică')
              ? recipe.matchReason
              : 'Optimizat pentru aport proteic ridicat și sațietate metabolică.'}
          </p>

          {/* Chef Flavor Balance Tip (If Applicable) */}
          {flavor.balanceTip && (
            <div className="mx-6 my-2 p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/30 flex items-start gap-2.5 text-xs text-emerald-200">
              <Sparkles className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>{flavor.balanceTip}</span>
            </div>
          )}

          {/* Interactive Appliance Converter Selector */}
          <div className="mx-6 my-3 p-1.5 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center justify-between gap-1">
            <button
              onClick={() => setSelectedAppliance('Aragaz / Tigaie')}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-bold transition-all ${
                selectedAppliance === 'Aragaz / Tigaie'
                  ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Flame size={14} />
              <span>Tigaie</span>
            </button>

            <button
              onClick={() => setSelectedAppliance('Airfryer')}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-bold transition-all ${
                selectedAppliance === 'Airfryer'
                  ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Zap size={14} />
              <span>Airfryer</span>
            </button>

            <button
              onClick={() => setSelectedAppliance('Cuptor')}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-bold transition-all ${
                selectedAppliance === 'Cuptor'
                  ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <CookingPot size={14} />
              <span>Cuptor</span>
            </button>
          </div>

          {/* Scaled Macro Strip */}
          <div className="sheet-macros-grid">
            <div className="macro-cell macro-cal">
              <span className="cell-num tabular-num">{scaledCalories}</span>
              <span className="cell-sub">kcal</span>
            </div>
            <div className="macro-cell macro-prot">
              <span className="cell-num tabular-num">{scaledProtein}g</span>
              <span className="cell-sub">Proteine</span>
            </div>
            <div className="macro-cell macro-carb">
              <span className="cell-num tabular-num">{scaledCarbs}g</span>
              <span className="cell-sub">Carbohidrați</span>
            </div>
            <div className="macro-cell macro-fat">
              <span className="cell-num tabular-num">{scaledFat}g</span>
              <span className="cell-sub">Grăsimi</span>
            </div>
          </div>

          {/* Scrollable Ingredients & Steps */}
          <div className="sheet-scroll-body" ref={scrollRef}>
            {/* Ingredients Section with Real-Time Portion Multiplier */}
            <div className="recipe-section">
              <div className="section-head flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Utensils size={16} className="head-icon" />
                  <h3 className="section-name">Ingrediente</h3>
                </div>

                {/* Portion Multiplier Pill */}
                <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 rounded-full px-2 py-0.5">
                  <button
                    onClick={() => setPortionMultiplier((p) => Math.max(1, p - 1))}
                    className="w-5 h-5 rounded-full flex items-center justify-center text-slate-400 hover:text-white font-bold text-xs"
                  >
                    -
                  </button>
                  <span className="text-xs font-bold text-emerald-400 px-1">
                    {portionMultiplier} {portionMultiplier === 1 ? 'porție' : 'porții'}
                  </span>
                  <button
                    onClick={() => setPortionMultiplier((p) => Math.min(4, p + 1))}
                    className="w-5 h-5 rounded-full flex items-center justify-center text-slate-400 hover:text-white font-bold text-xs"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="ingredients-list">
                {activeScaledRecipe.ingredients.map((ing, i) => (
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
                <h3 className="section-name">Instrucțiuni ({selectedAppliance})</h3>
              </div>

              <div className="instructions-list">
                {converted.instructions.map((step, idx) => (
                  <div key={idx} className="step-row">
                    <span className="step-index-pill tabular-num">{idx + 1}</span>
                    <p className="step-text">{step}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Footer Action Bar with Cook Mode & Direct Log */}
          <div className="sheet-footer flex items-center gap-3">
            <button
              type="button"
              className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm shadow-lg shadow-emerald-500/20 transition-all active:scale-95"
              onClick={() => setIsCookModeOpen(true)}
            >
              <ChefHat size={18} />
              <span>Gătește Asistat (Cook Mode)</span>
            </button>

            {onCookAndLog && (
              <button
                type="button"
                className="flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-sm transition-all"
                onClick={() => onCookAndLog(activeScaledRecipe)}
                title="Loghează direct fără modul ghidat"
              >
                <Check size={18} className="text-emerald-400" />
                <span>Loghează</span>
              </button>
            )}
          </div>

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
              background: #0f172a;
              border-top: 1px solid rgba(255, 255, 255, 0.1);
              border-radius: 28px 28px 0 0;
              width: 100%;
              max-width: 540px;
              max-height: 90vh;
              display: flex;
              flex-direction: column;
              color: #f8fafc;
              box-shadow: 0 -10px 40px rgba(0, 0, 0, 0.5);
              overflow: hidden;
            }
            .sheet-drag-handle-touch-zone {
              width: 100%;
              padding: 10px 0 6px 0;
              display: flex;
              justify-content: center;
              cursor: grab;
              touch-action: none;
            }
            .sheet-drag-handle {
              width: 44px;
              height: 4px;
              border-radius: 999px;
              background: rgba(255, 255, 255, 0.2);
            }
            .sheet-header {
              display: flex;
              align-items: center;
              justify-content: space-between;
              padding: 4px 20px 10px 20px;
            }
            .header-tags-row {
              display: flex;
              align-items: center;
              gap: 8px;
            }
            .mode-chip {
              font-size: 11px;
              font-weight: 700;
              text-transform: uppercase;
              letter-spacing: 0.05em;
              color: #10b981;
              background: rgba(16, 185, 129, 0.15);
              border: 1px solid rgba(16, 185, 129, 0.3);
              padding: 2px 8px;
              border-radius: 999px;
            }
            .time-pill {
              display: flex;
              align-items: center;
              gap: 4px;
              font-size: 12px;
              color: #94a3b8;
              background: #1e293b;
              padding: 2px 8px;
              border-radius: 999px;
            }
            .btn-close-sheet {
              background: #1e293b;
              border: none;
              color: #94a3b8;
              width: 32px;
              height: 32px;
              border-radius: 50%;
              display: flex;
              align-items: center;
              justify-content: center;
              cursor: pointer;
              transition: all 0.2s;
            }
            .btn-close-sheet:hover {
              color: #fff;
              background: #334155;
            }
            .sheet-recipe-hero {
              position: relative;
              width: 100%;
              height: 180px;
              overflow: hidden;
              margin-bottom: 12px;
            }
            .sheet-hero-img {
              width: 100%;
              height: 100%;
              object-fit: cover;
            }
            .sheet-hero-gradient {
              position: absolute;
              inset: 0;
              background: linear-gradient(180deg, transparent 40%, #0f172a 100%);
            }
            .recipe-full-title {
              font-size: 20px;
              font-weight: 800;
              color: #f8fafc;
              margin: 0 20px 4px 20px;
              line-height: 1.25;
            }
            .recipe-match-desc {
              font-size: 13px;
              color: #94a3b8;
              margin: 0 20px 14px 20px;
              line-height: 1.4;
            }
            .sheet-macros-grid {
              display: grid;
              grid-template-columns: repeat(4, 1fr);
              gap: 8px;
              padding: 0 20px;
              margin-bottom: 14px;
            }
            .macro-cell {
              background: #1e293b;
              border: 1px solid rgba(255, 255, 255, 0.05);
              border-radius: 12px;
              padding: 8px 4px;
              text-align: center;
              display: flex;
              flex-direction: column;
            }
            .macro-cal { border-color: rgba(245, 158, 11, 0.3); }
            .macro-prot { border-color: rgba(16, 185, 129, 0.3); }
            .macro-carb { border-color: rgba(59, 130, 246, 0.3); }
            .macro-fat { border-color: rgba(239, 68, 68, 0.3); }
            .cell-num {
              font-size: 15px;
              font-weight: 800;
              color: #f8fafc;
            }
            .cell-sub {
              font-size: 10px;
              color: #94a3b8;
              font-weight: 600;
              text-transform: uppercase;
            }
            .sheet-scroll-body {
              flex: 1;
              overflow-y: auto;
              padding: 0 20px;
              display: flex;
              flex-direction: column;
              gap: 16px;
            }
            .recipe-section {
              background: rgba(30, 41, 59, 0.5);
              border: 1px solid rgba(255, 255, 255, 0.05);
              border-radius: 16px;
              padding: 14px;
            }
            .section-head {
              display: flex;
              align-items: center;
              gap: 8px;
              margin-bottom: 10px;
            }
            .section-name {
              font-size: 13px;
              font-weight: 700;
              color: #e2e8f0;
              text-transform: uppercase;
              letter-spacing: 0.03em;
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
              padding: 6px 0;
              border-bottom: 1px solid rgba(255, 255, 255, 0.03);
              font-size: 13px;
            }
            .ingr-left {
              display: flex;
              align-items: center;
              gap: 8px;
            }
            .ingr-bullet {
              width: 5px;
              height: 5px;
              border-radius: 50%;
              background: #10b981;
            }
            .ingr-name {
              color: #e2e8f0;
            }
            .ingr-amount {
              font-weight: 600;
              color: #94a3b8;
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
              background: #10b981;
              color: #0f172a;
              font-size: 11px;
              font-weight: 800;
              width: 20px;
              height: 20px;
              border-radius: 50%;
              display: flex;
              align-items: center;
              justify-content: center;
              flex-shrink: 0;
              margin-top: 2px;
            }
            .step-text {
              font-size: 13px;
              line-height: 1.45;
              color: #cbd5e1;
              margin: 0;
            }
            .sheet-footer {
              padding: 14px 20px 20px 20px;
              border-top: 1px solid rgba(255, 255, 255, 0.08);
              background: #0f172a;
            }
          `}</style>
        </div>
      </div>

      {/* Embedded Live Cook Mode Modal */}
      {isCookModeOpen && (
        <CookModeModal
          isOpen={isCookModeOpen}
          onClose={() => setIsCookModeOpen(false)}
          recipe={activeScaledRecipe}
          onCompleteCooking={(completedRecipe) => {
            if (onCookAndLog) {
              onCookAndLog(completedRecipe);
            }
            onClose();
          }}
        />
      )}
    </>
  );
}
