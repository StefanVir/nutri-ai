'use client';

import React from 'react';
import { AdaptiveFavorite, MealCardProposal } from '@/types/nutrition';
import { Bookmark, Clock, Flame, Dumbbell, Sparkles, ChefHat } from 'lucide-react';

interface AdaptiveFavoritesProps {
  favorites: AdaptiveFavorite[];
  onCookRecipe: (recipe: MealCardProposal) => void;
  onOpenDetails: (recipe: MealCardProposal) => void;
}

export function AdaptiveFavorites({
  favorites,
  onCookRecipe,
  onOpenDetails,
}: AdaptiveFavoritesProps) {
  return (
    <div className="favorites-screen animate-fade-in">
      <div className="fav-header">
        <div className="fav-badge">
          <Bookmark size={14} className="bookmark-icon" />
          <span>Memorie Inteligentă</span>
        </div>
        <h2 className="fav-title">Adaptive Favorites</h2>
        <p className="fav-sub">
          Rețete candidate din Showdown pe care le-ai apreciat. AI-ul le propune cu prioritate când ingredientele sau bugetul redevin compatibile.
        </p>
      </div>

      {favorites.length === 0 ? (
        <div className="empty-fav-card">
          <Sparkles size={32} className="empty-sparkle" />
          <h4 className="empty-title">Nicio rețetă salvată încă</h4>
          <p className="empty-desc">
            Când glisezi în The Swipe Machine și trimiți rețete în Showdown, finalistele nealese vor fi salvate automat aici.
          </p>
        </div>
      ) : (
        <div className="fav-list">
          {favorites.map((fav) => (
            <div key={fav.id} className="fav-card animate-slide-up">
              <div className="card-top-line">
                <span className="fav-mode-tag">
                  {fav.recipe.mode === 'fridge' && '🧊 Din Frigider'}
                  {fav.recipe.mode.includes('grocery') && '🛒 Smart Grocery'}
                  {fav.recipe.mode === 'restaurant' && '🍽️ Restaurant'}
                </span>
                <div className="fav-time">
                  <Clock size={12} />
                  <span className="tabular-num">{fav.recipe.prepTimeMinutes + fav.recipe.cookTimeMinutes} min</span>
                </div>
              </div>

              <h3 className="fav-recipe-name">{fav.recipe.title}</h3>
              <p className="fav-match-reason">{fav.recipe.matchReason}</p>

              <div className="fav-macros-row">
                <span className="macro-badge-sm badge-cal tabular-num">
                  <Flame size={12} /> {fav.recipe.calories} kcal
                </span>
                <span className="macro-badge-sm badge-prot tabular-num">
                  <Dumbbell size={12} /> {fav.recipe.protein}g P
                </span>
                {fav.recipe.estimatedCostRon && (
                  <span className="cost-pill tabular-num">~{fav.recipe.estimatedCostRon} RON</span>
                )}
              </div>

              <div className="fav-card-actions">
                <button
                  type="button"
                  className="btn-details-fav"
                  onClick={() => onOpenDetails(fav.recipe)}
                >
                  Vezi Rețeta
                </button>
                <button
                  type="button"
                  className="btn-cook-fav"
                  onClick={() => onCookRecipe(fav.recipe)}
                >
                  <ChefHat size={15} />
                  <span>Gătește & Loghează</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <style jsx>{`
        .favorites-screen {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .fav-header {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .fav-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 4px 10px;
          background: rgba(99, 102, 241, 0.12);
          border: 1px solid rgba(99, 102, 241, 0.25);
          border-radius: var(--radius-full);
          font-size: 0.72rem;
          font-weight: 800;
          text-transform: uppercase;
          color: #a5b4fc;
          width: fit-content;
        }

        :global(.bookmark-icon) {
          color: var(--accent-primary);
        }

        .fav-title {
          font-size: 1.35rem;
          font-weight: 800;
          color: var(--text-primary);
          letter-spacing: -0.01em;
        }

        .fav-sub {
          font-size: 0.8rem;
          color: var(--text-secondary);
          line-height: 1.4;
        }

        .empty-fav-card {
          padding: 36px 20px;
          background: var(--bg-card);
          border: 1px dashed var(--border-medium);
          border-radius: var(--radius-lg);
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 10px;
        }

        :global(.empty-sparkle) {
          color: var(--macro-calories);
        }

        .empty-title {
          font-size: 1rem;
          font-weight: 800;
          color: var(--text-primary);
        }

        .empty-desc {
          font-size: 0.78rem;
          color: var(--text-tertiary);
          line-height: 1.4;
          max-width: 280px;
        }

        .fav-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .fav-card {
          background: linear-gradient(155deg, #18233b 0%, #101726 100%);
          border: 1px solid var(--border-medium);
          border-radius: var(--radius-md);
          padding: 14px;
          box-shadow: 0 4px 14px rgba(0, 0, 0, 0.4);
        }

        .card-top-line {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 6px;
        }

        .fav-mode-tag {
          font-size: 0.68rem;
          font-weight: 800;
          color: var(--text-secondary);
          background: rgba(255, 255, 255, 0.06);
          padding: 2px 8px;
          border-radius: var(--radius-full);
        }

        .fav-time {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 0.72rem;
          color: var(--text-tertiary);
          font-weight: 700;
        }

        .fav-recipe-name {
          font-size: 1.05rem;
          font-weight: 800;
          color: var(--text-primary);
          line-height: 1.3;
          margin-bottom: 4px;
        }

        .fav-match-reason {
          font-size: 0.75rem;
          color: #c7d2fe;
          line-height: 1.35;
          margin-bottom: 10px;
        }

        .fav-macros-row {
          display: flex;
          align-items: center;
          gap: 6px;
          margin-bottom: 12px;
        }

        .macro-badge-sm {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 0.72rem;
          font-weight: 700;
          padding: 3px 8px;
          border-radius: var(--radius-sm);
        }

        .badge-cal { background: var(--macro-calories-bg); color: var(--macro-calories); }
        .badge-prot { background: var(--macro-protein-bg); color: var(--macro-protein); }

        .cost-pill {
          font-size: 0.72rem;
          font-weight: 700;
          color: var(--text-tertiary);
          margin-left: auto;
        }

        .fav-card-actions {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .btn-details-fav {
          padding: 8px 12px;
          background: rgba(255, 255, 255, 0.06);
          border: 1px solid var(--border-medium);
          border-radius: var(--radius-md);
          font-size: 0.76rem;
          font-weight: 700;
          color: var(--text-secondary);
        }

        .btn-cook-fav {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          padding: 8px 14px;
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
          color: #ffffff;
          border-radius: var(--radius-md);
          font-size: 0.8rem;
          font-weight: 800;
        }
      `}</style>
    </div>
  );
}
