'use client';

import React from 'react';
import { MealCardProposal } from '@/types/nutrition';
import { Swords, Clock, Flame, Dumbbell, Check, Eye } from 'lucide-react';

interface MatchupShowdownProps {
  shortlistedMeals: MealCardProposal[];
  onSelectWinner: (winner: MealCardProposal, runnerUps: MealCardProposal[]) => void;
  onOpenDetails: (recipe: MealCardProposal) => void;
  onCancel: () => void;
}

export function MatchupShowdown({
  shortlistedMeals,
  onSelectWinner,
  onOpenDetails,
  onCancel,
}: MatchupShowdownProps) {
  if (shortlistedMeals.length === 0) return null;

  const handlePick = (chosen: MealCardProposal) => {
    const runnerUps = shortlistedMeals.filter((m) => m.id !== chosen.id);
    onSelectWinner(chosen, runnerUps);
  };

  return (
    <div className="showdown-container animate-fade-in">
      {/* Showdown Header */}
      <div className="showdown-header">
        <div className="showdown-badge">
          <Swords size={15} className="swords-icon" />
          <span>Matchup Showdown</span>
        </div>
        <h2 className="showdown-title">Alege Masa Câștigătoare</h2>
        <p className="showdown-sub">
          Compară cele {shortlistedMeals.length} opțiuni favorite selectate din Swipe. Opțiunile nealese vor fi salvate automat în <strong>Adaptive Favorites</strong>.
        </p>
      </div>

      {/* Comparison Grid */}
      <div className="showdown-cards-list">
        {shortlistedMeals.map((recipe, index) => (
          <div key={recipe.id} className="showdown-card animate-slide-up" style={{ animationDelay: `${index * 80}ms` }}>
            {recipe.imageUrl && (
              <div className="showdown-photo-hero">
                <img src={recipe.imageUrl} alt={recipe.title} className="showdown-photo-img" />
                <div className="showdown-photo-gradient" />
              </div>
            )}

            <div className="showdown-card-body">
              <div className="card-top-row">
                <span className="candidate-index">Opțiunea #{index + 1}</span>
                <div className="time-badge">
                  <Clock size={12} />
                  <span className="tabular-num">{recipe.prepTimeMinutes + recipe.cookTimeMinutes} min</span>
                </div>
              </div>

              <h4 className="recipe-name">{recipe.title}</h4>
              <p className="match-rationale">{recipe.matchReason}</p>

              {/* Quick Metrics Bar */}
              <div className="metrics-compare-row">
                <div className="mini-metric cal-metric">
                  <Flame size={13} />
                  <span className="tabular-num"><strong>{recipe.calories}</strong> kcal</span>
                </div>
                <div className="mini-metric prot-metric">
                  <Dumbbell size={13} />
                  <span className="tabular-num"><strong>{recipe.protein}g</strong> P</span>
                </div>
                {recipe.estimatedCostRon && (
                  <div className="mini-metric cost-metric">
                    <span className="tabular-num">~{recipe.estimatedCostRon} RON</span>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="card-actions-row">
                <button
                  type="button"
                  className="btn-inspect"
                  onClick={() => onOpenDetails(recipe)}
                >
                  <Eye size={15} />
                  <span>Vezi Rețeta</span>
                </button>

                <button
                  type="button"
                  className="btn-select-winner"
                  onClick={() => handlePick(recipe)}
                >
                  <Check size={16} />
                  <span>Gătește Această Masă</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="showdown-footer">
        <button type="button" className="btn-cancel" onClick={onCancel}>
          Renunță & Înapoi la Swipe
        </button>
      </div>

      <style jsx>{`
        .showdown-container {
          padding: 16px 14px;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .showdown-header {
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .showdown-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 4px 12px;
          background: rgba(245, 158, 11, 0.15);
          border: 1px solid rgba(245, 158, 11, 0.35);
          border-radius: var(--radius-full);
          font-size: 0.72rem;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: #fbbf24;
          margin-bottom: 8px;
        }

        :global(.swords-icon) {
          color: var(--macro-calories);
        }

        .showdown-title {
          font-size: 1.35rem;
          font-weight: 800;
          color: var(--text-primary);
          letter-spacing: -0.01em;
          margin-bottom: 6px;
        }

        .showdown-sub {
          font-size: 0.8rem;
          color: var(--text-secondary);
          line-height: 1.4;
          max-width: 340px;
        }

        .showdown-cards-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .showdown-card {
          background: linear-gradient(150deg, #18233b 0%, #101726 100%);
          border: 1px solid var(--border-medium);
          border-radius: var(--radius-lg);
          overflow: hidden;
          box-shadow: 0 6px 18px rgba(0, 0, 0, 0.5);
          transition: all var(--duration-fast);
        }

        .showdown-card:active {
          border-color: var(--macro-protein);
          transform: scale(0.99);
        }

        .showdown-photo-hero {
          position: relative;
          width: 100%;
          height: 120px;
          overflow: hidden;
          background: #0d121d;
        }

        .showdown-photo-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }

        .showdown-photo-gradient {
          position: absolute;
          inset: 0;
          background: linear-gradient(to bottom, transparent 30%, rgba(16, 23, 38, 0.95) 100%);
        }

        .showdown-card-body {
          padding: 14px 16px 16px 16px;
        }

        .card-top-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 6px;
        }

        .candidate-index {
          font-size: 0.7rem;
          font-weight: 800;
          text-transform: uppercase;
          color: var(--accent-primary);
        }

        .time-badge {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 0.72rem;
          font-weight: 700;
          color: var(--text-tertiary);
        }

        .recipe-name {
          font-size: 1.05rem;
          font-weight: 800;
          color: var(--text-primary);
          line-height: 1.3;
          margin-bottom: 6px;
        }

        .match-rationale {
          font-size: 0.76rem;
          color: #c7d2fe;
          margin-bottom: 12px;
          line-height: 1.35;
        }

        .metrics-compare-row {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 14px;
        }

        .mini-metric {
          display: flex;
          align-items: center;
          gap: 4px;
          padding: 4px 8px;
          border-radius: var(--radius-sm);
          font-size: 0.75rem;
          font-weight: 700;
        }

        .cal-metric { background: var(--macro-calories-bg); color: var(--macro-calories); }
        .prot-metric { background: var(--macro-protein-bg); color: var(--macro-protein); }
        .cost-metric { background: rgba(255, 255, 255, 0.06); color: var(--text-secondary); }

        .card-actions-row {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .btn-inspect {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 10px 14px;
          background: rgba(255, 255, 255, 0.06);
          border: 1px solid var(--border-medium);
          border-radius: var(--radius-md);
          font-size: 0.78rem;
          font-weight: 700;
          color: var(--text-secondary);
        }

        .btn-select-winner {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          padding: 10px 16px;
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
          color: #ffffff;
          border-radius: var(--radius-md);
          font-size: 0.84rem;
          font-weight: 800;
          box-shadow: 0 4px 14px rgba(16, 185, 129, 0.4);
          transition: transform var(--duration-fast);
        }

        .btn-select-winner:hover {
          transform: translateY(-1px);
        }

        .showdown-footer {
          display: flex;
          justify-content: center;
          padding: 8px 0;
        }

        .btn-cancel {
          font-size: 0.78rem;
          font-weight: 700;
          color: var(--text-tertiary);
          padding: 8px 16px;
        }

        .btn-cancel:hover {
          color: var(--text-secondary);
          text-decoration: underline;
        }
      `}</style>
    </div>
  );
}
