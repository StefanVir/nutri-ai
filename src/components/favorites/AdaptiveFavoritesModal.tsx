'use client';

import React from 'react';
import { MealCardProposal } from '@/types/nutrition';
import { Bookmark, Clock, Eye, Trash2, Plus, ShoppingCart } from 'lucide-react';

interface AdaptiveFavoritesModalProps {
  favorites: MealCardProposal[];
  onOpenDetails: (recipe: MealCardProposal) => void;
  onRemoveFavorite: (id: string) => void;
  onCookAndLog: (recipe: MealCardProposal) => void;
  onAddIngredientsToGrocery?: (
    ingredients: { name: string; amount: string; estimatedPriceRon?: number }[],
    recipeTitle: string
  ) => void;
  onClose: () => void;
  onStartSwipe?: () => void;
}

export function AdaptiveFavoritesModal({
  favorites,
  onOpenDetails,
  onRemoveFavorite,
  onCookAndLog,
  onAddIngredientsToGrocery,
  onClose,
  onStartSwipe,
}: AdaptiveFavoritesModalProps) {
  return (
    <div className="fav-screen animate-fade-in">
      <div className="fav-header">
        <h2 className="fav-title">Rețete salvate</h2>
        <p className="fav-sub">
          Rețetele salvate din sugestii pentru acces rapid și planificare.
        </p>
      </div>

      <div className="fav-list">
        {favorites.length === 0 ? (
          <div className="empty-fav-box">
            <strong className="empty-head">Nicio rețetă salvată</strong>
            <p className="empty-desc">Salvează rețete din lista de sugestii pentru a le găsi rapid aici.</p>
            {onStartSwipe && (
              <button
                type="button"
                className="btn-empty-swipe"
                onClick={onStartSwipe}
              >
                <span>Descoperă rețete</span>
              </button>
            )}
          </div>
        ) : (
          favorites.map((recipe) => (
            <div key={recipe.id} className="fav-card animate-slide-up">
              <div className="fav-card-content">
                {recipe.imageUrl && (
                  <img src={recipe.imageUrl} alt={recipe.title} className="fav-thumb-img" />
                )}
                <div className="fav-details-col">
                  <div className="fav-card-top">
                    <strong className="fav-card-title">{recipe.title}</strong>
                    <button
                      type="button"
                      className="btn-del-fav"
                      onClick={() => onRemoveFavorite(recipe.id)}
                      aria-label="Șterge din favorite"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>

                  <div className="fav-meta-row">
                    <div className="fav-time">
                      <Clock size={12} />
                      <span className="tabular-num">{recipe.prepTimeMinutes + recipe.cookTimeMinutes} min</span>
                    </div>
                    <div className="fav-macros">
                      <span className="fav-cal tabular-num">{recipe.calories} kcal</span>
                      <span className="fav-prot tabular-num">{recipe.protein}g P</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="fav-actions">
                <button
                  type="button"
                  className="btn-fav-view"
                  onClick={() => onOpenDetails(recipe)}
                >
                  <Eye size={13} />
                  <span>Vezi rețeta</span>
                </button>

                {onAddIngredientsToGrocery && (
                  <button
                    type="button"
                    className="btn-fav-grocery"
                    onClick={() =>
                      onAddIngredientsToGrocery(
                        recipe.ingredients.map((ing) => ({
                          name: ing.name,
                          amount: ing.amount,
                          estimatedPriceRon: ing.estimatedPriceRon,
                        })),
                        recipe.title
                      )
                    }
                    title="Adaugă ingredientele în lista de cumpărături"
                  >
                    <ShoppingCart size={13} />
                    <span>Cumpără</span>
                  </button>
                )}

                <button
                  type="button"
                  className="btn-fav-cook"
                  onClick={() => onCookAndLog(recipe)}
                >
                  <Plus size={13} />
                  <span>Loghează</span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <style jsx>{`
        .fav-screen {
          display: flex;
          flex-direction: column;
          gap: 14px;
          padding: 0 20px var(--bottom-safe-padding) 20px;
        }

        .fav-header {
          display: flex;
          flex-direction: column;
          gap: 3px;
          padding-top: max(20px, env(safe-area-inset-top, 20px));
        }

        .fav-title {
          font-size: 1.15rem;
          font-weight: 800;
          color: var(--text-primary);
          letter-spacing: -0.01em;
        }

        .fav-sub {
          font-size: 0.76rem;
          color: var(--text-secondary);
        }

        .fav-list {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .empty-fav-box {
          padding: 36px 16px;
          background: rgba(255, 255, 255, 0.02);
          border: 1px dashed rgba(255, 255, 255, 0.08);
          border-radius: var(--radius-md);
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          gap: 6px;
        }

        .empty-head {
          font-size: 0.92rem;
          font-weight: 700;
          color: var(--text-primary);
        }

        .empty-desc {
          font-size: 0.76rem;
          color: var(--text-tertiary);
          max-width: 260px;
        }

        .btn-empty-swipe {
          margin-top: 10px;
          padding: 8px 16px;
          background: rgba(255, 255, 255, 0.06);
          border: 1px solid rgba(255, 255, 255, 0.12);
          border-radius: var(--radius-full);
          color: var(--text-primary);
          font-size: 0.78rem;
          font-weight: 700;
        }

        .fav-card {
          background: #0d121d;
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: var(--radius-md);
          padding: 12px;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .fav-card-content {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .fav-thumb-img {
          width: 52px;
          height: 52px;
          border-radius: var(--radius-sm);
          object-fit: cover;
          flex-shrink: 0;
        }

        .fav-details-col {
          display: flex;
          flex-direction: column;
          flex: 1;
          gap: 4px;
        }

        .fav-card-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .fav-card-title {
          font-size: 0.9rem;
          font-weight: 700;
          color: var(--text-primary);
        }

        .btn-del-fav {
          color: var(--text-tertiary);
          padding: 4px;
          cursor: pointer;
        }

        .btn-del-fav:active {
          color: #ef4444;
        }

        .fav-meta-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 0.74rem;
        }

        .fav-time {
          display: flex;
          align-items: center;
          gap: 4px;
          color: var(--text-tertiary);
        }

        .fav-macros {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .fav-cal { color: var(--macro-calories); font-weight: 700; }
        .fav-prot { color: var(--macro-protein); font-weight: 700; }

        .fav-actions {
          display: flex;
          align-items: center;
          gap: 6px;
          padding-top: 6px;
          border-top: 1px solid rgba(255, 255, 255, 0.05);
        }

        .btn-fav-view {
          display: flex;
          align-items: center;
          gap: 4px;
          padding: 6px 12px;
          min-height: 34px;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: var(--radius-sm);
          font-size: 0.74rem;
          font-weight: 600;
          color: var(--text-secondary);
        }

        .btn-fav-grocery {
          display: flex;
          align-items: center;
          gap: 4px;
          padding: 6px 12px;
          min-height: 34px;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: var(--radius-sm);
          font-size: 0.74rem;
          font-weight: 600;
          color: var(--text-secondary);
        }

        .btn-fav-cook {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 4px;
          padding: 6px 12px;
          min-height: 34px;
          background: #10b981;
          color: #061e14;
          border-radius: var(--radius-sm);
          font-size: 0.76rem;
          font-weight: 700;
        }
      `}</style>
    </div>
  );
}
