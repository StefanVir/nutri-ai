'use client';

import React from 'react';
import { MealCardProposal } from '@/types/nutrition';
import { Bookmark, Clock, Eye, Trash2, Plus } from 'lucide-react';

interface AdaptiveFavoritesModalProps {
  favorites: MealCardProposal[];
  onOpenDetails: (recipe: MealCardProposal) => void;
  onRemoveFavorite: (id: string) => void;
  onCookAndLog: (recipe: MealCardProposal) => void;
  onClose: () => void;
}

export function AdaptiveFavoritesModal({
  favorites,
  onOpenDetails,
  onRemoveFavorite,
  onCookAndLog,
  onClose,
}: AdaptiveFavoritesModalProps) {
  return (
    <div className="fav-screen animate-fade-in">
      <div className="fav-header">
        <div className="fav-badge">
          <Bookmark size={15} />
          <span>Adaptive Favorites</span>
        </div>
        <h2 className="fav-title">Rețete Favorite & Memorie AI</h2>
        <p className="fav-sub">
          Rețetele pe care ai dat Swipe Right sunt memorate aici. AI-ul le va re-propune cu prioritate când ai ingredientele potrivite.
        </p>
      </div>

      <div className="fav-list">
        {favorites.length === 0 ? (
          <div className="empty-fav-box">
            <Bookmark size={32} className="empty-icon" />
            <strong className="empty-head">Nicio rețetă favorită salvată</strong>
            <p className="empty-desc">Dă Swipe Right pe cardurile care îți plac pentru a le adăuga în memorie.</p>
          </div>
        ) : (
          favorites.map((recipe) => (
            <div key={recipe.id} className="fav-card animate-slide-up">
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

              <div className="fav-actions">
                <button
                  type="button"
                  className="btn-fav-view"
                  onClick={() => onOpenDetails(recipe)}
                >
                  <Eye size={14} />
                  <span>Vezi Rețeta</span>
                </button>

                <button
                  type="button"
                  className="btn-fav-cook"
                  onClick={() => onCookAndLog(recipe)}
                >
                  <Plus size={14} />
                  <span>Gătește & Loghează</span>
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
          gap: 16px;
        }

        .fav-header {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .fav-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 0.72rem;
          font-weight: 800;
          text-transform: uppercase;
          color: var(--macro-protein);
          margin-bottom: 2px;
        }

        .fav-title {
          font-size: 1.25rem;
          font-weight: 800;
          color: var(--text-primary);
          letter-spacing: -0.01em;
        }

        .fav-sub {
          font-size: 0.78rem;
          color: var(--text-secondary);
          line-height: 1.4;
        }

        .fav-list {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .empty-fav-box {
          padding: 36px 20px;
          background: var(--bg-card);
          border: 1px dashed var(--border-medium);
          border-radius: var(--radius-lg);
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          gap: 8px;
        }

        .empty-icon {
          color: var(--text-tertiary);
          margin-bottom: 4px;
        }

        .empty-head {
          font-size: 0.95rem;
          color: var(--text-primary);
        }

        .empty-desc {
          font-size: 0.76rem;
          color: var(--text-secondary);
          max-width: 280px;
        }

        .fav-card {
          background: var(--bg-card);
          border: 1px solid var(--border-medium);
          border-radius: var(--radius-md);
          padding: 14px;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .fav-card-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .fav-card-title {
          font-size: 0.96rem;
          font-weight: 700;
          color: var(--text-primary);
        }

        .btn-del-fav {
          color: var(--text-tertiary);
          padding: 4px;
        }

        .btn-del-fav:hover {
          color: var(--status-error);
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
          gap: 8px;
          padding-top: 6px;
          border-top: 1px solid var(--border-subtle);
        }

        .btn-fav-view {
          display: flex;
          align-items: center;
          gap: 4px;
          padding: 8px 12px;
          background: rgba(255, 255, 255, 0.06);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-sm);
          font-size: 0.74rem;
          font-weight: 700;
          color: var(--text-secondary);
        }

        .btn-fav-cook {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 4px;
          padding: 8px 12px;
          background: var(--macro-protein);
          color: #061e14;
          border-radius: var(--radius-sm);
          font-size: 0.76rem;
          font-weight: 800;
        }
      `}</style>
    </div>
  );
}
