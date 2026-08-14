'use client';

import React from 'react';
import { LoggedMeal, MealCategory } from '@/types/nutrition';
import { Coffee, Sun, Moon, Apple, Trash2, Sparkles, Plus } from 'lucide-react';

interface DailyJournalProps {
  meals: LoggedMeal[];
  onDeleteMeal: (mealId: string) => void;
  onOpenSwipeForCategory: (category: MealCategory) => void;
  onOpenQuickLogForCategory: (category: MealCategory) => void;
}

const CATEGORY_CONFIG: Record<MealCategory, { title: string; icon: any; targetPct: string }> = {
  breakfast: { title: 'Mic Dejun', icon: Coffee, targetPct: '~25% kcal' },
  lunch: { title: 'Prânz', icon: Sun, targetPct: '~35% kcal' },
  dinner: { title: 'Cină', icon: Moon, targetPct: '~30% kcal' },
  snack: { title: 'Gustări & Suplimente', icon: Apple, targetPct: '~10% kcal' },
};

export function DailyJournal({
  meals,
  onDeleteMeal,
  onOpenSwipeForCategory,
  onOpenQuickLogForCategory,
}: DailyJournalProps) {
  const categories: MealCategory[] = ['breakfast', 'lunch', 'dinner', 'snack'];

  return (
    <div className="journal-stack">
      <div className="journal-header">
        <h3 className="section-title">Jurnalul Zilei</h3>
        <span className="section-sub">Mese planificate & logate</span>
      </div>

      {categories.map((cat) => {
        const catConfig = CATEGORY_CONFIG[cat];
        const Icon = catConfig.icon;
        const catMeals = meals.filter((m) => m.category === cat);
        const totalCatCalories = catMeals.reduce((sum, m) => sum + m.calories, 0);
        const totalCatProtein = catMeals.reduce((sum, m) => sum + m.protein, 0);

        return (
          <div key={cat} className="category-card">
            <div className="category-header">
              <div className="category-meta">
                <div className="category-icon-wrap">
                  <Icon size={16} className="cat-icon" />
                </div>
                <div>
                  <h4 className="category-name">{catConfig.title}</h4>
                  <span className="category-pct">{catConfig.targetPct}</span>
                </div>
              </div>

              <div className="category-stats">
                {catMeals.length > 0 && (
                  <span className="cat-cal-pill tabular-num">
                    {totalCatCalories} kcal • {totalCatProtein}g P
                  </span>
                )}
              </div>
            </div>

            {/* Meals List */}
            <div className="category-body">
              {catMeals.length === 0 ? (
                <div className="empty-category-row">
                  <span className="empty-text">Nicio masă logată încă</span>
                  <div className="empty-actions">
                    <button
                      type="button"
                      className="btn-action-pill btn-swipe-pill"
                      onClick={() => onOpenSwipeForCategory(cat)}
                    >
                      <Sparkles size={13} />
                      <span>Swipe</span>
                    </button>
                    <button
                      type="button"
                      className="btn-action-pill btn-quick-pill"
                      onClick={() => onOpenQuickLogForCategory(cat)}
                    >
                      <Plus size={13} />
                      <span>Quick</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="meals-list">
                  {catMeals.map((meal) => (
                    <div key={meal.id} className="meal-item animate-fade-in">
                      <div className="meal-info">
                        <div className="meal-title-row">
                          <span className="meal-name">{meal.title}</span>
                          {meal.source === 'swipe' && <span className="source-tag">Swipe AI</span>}
                          {meal.source === 'quick_ai' && <span className="source-tag source-quick">AI Quick</span>}
                        </div>
                        <div className="meal-macros-row tabular-num">
                          <span className="macro-chip macro-cal">{meal.calories} kcal</span>
                          <span className="macro-chip macro-prot">{meal.protein}g P</span>
                          <span className="macro-chip macro-carb">{meal.carbs}g C</span>
                          <span className="macro-chip macro-f">{meal.fat}g F</span>
                        </div>
                      </div>

                      <button
                        type="button"
                        className="btn-delete-meal"
                        onClick={() => onDeleteMeal(meal.id)}
                        aria-label="Șterge masă"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  ))}

                  <div className="add-more-row">
                    <button
                      type="button"
                      className="btn-add-more"
                      onClick={() => onOpenSwipeForCategory(cat)}
                    >
                      <Sparkles size={13} />
                      <span>Swipe încă o opțiune</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        );
      })}

      <style jsx>{`
        .journal-stack {
          display: flex;
          flex-direction: column;
          gap: 12px;
          margin-bottom: 24px;
        }

        .journal-header {
          display: flex;
          align-items: baseline;
          justify-content: space-between;
          margin-bottom: 2px;
        }

        .section-title {
          font-size: 1.1rem;
          font-weight: 800;
          color: var(--text-primary);
          letter-spacing: -0.01em;
        }

        .section-sub {
          font-size: 0.75rem;
          color: var(--text-tertiary);
          font-weight: 600;
        }

        .category-card {
          background: var(--bg-card);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-md);
          overflow: hidden;
          transition: border-color var(--duration-fast);
        }

        .category-card:hover {
          border-color: var(--border-medium);
        }

        .category-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 12px 14px;
          background: rgba(255, 255, 255, 0.02);
          border-bottom: 1px solid var(--border-subtle);
        }

        .category-meta {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .category-icon-wrap {
          width: 30px;
          height: 30px;
          border-radius: var(--radius-sm);
          background: rgba(99, 102, 241, 0.12);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #a5b4fc;
        }

        .category-name {
          font-size: 0.88rem;
          font-weight: 700;
          color: var(--text-primary);
        }

        .category-pct {
          font-size: 0.7rem;
          color: var(--text-tertiary);
        }

        .cat-cal-pill {
          font-size: 0.72rem;
          font-weight: 700;
          color: var(--macro-calories);
          background: var(--macro-calories-bg);
          padding: 2px 8px;
          border-radius: var(--radius-full);
          border: 1px solid rgba(245, 158, 11, 0.2);
        }

        .category-body {
          padding: 10px 14px;
        }

        .empty-category-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 6px 0;
        }

        .empty-text {
          font-size: 0.78rem;
          color: var(--text-tertiary);
          font-style: italic;
        }

        .empty-actions {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .btn-action-pill {
          display: flex;
          align-items: center;
          gap: 4px;
          padding: 5px 10px;
          border-radius: var(--radius-full);
          font-size: 0.72rem;
          font-weight: 700;
          transition: all var(--duration-fast);
        }

        .btn-swipe-pill {
          background: rgba(245, 158, 11, 0.15);
          color: #fbbf24;
          border: 1px solid rgba(245, 158, 11, 0.35);
        }

        .btn-swipe-pill:hover {
          background: rgba(245, 158, 11, 0.25);
          transform: translateY(-1px);
        }

        .btn-quick-pill {
          background: rgba(255, 255, 255, 0.05);
          color: var(--text-secondary);
          border: 1px solid var(--border-medium);
        }

        .btn-quick-pill:hover {
          background: rgba(255, 255, 255, 0.1);
        }

        .meals-list {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .meal-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 8px 10px;
          background: rgba(0, 0, 0, 0.25);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-sm);
        }

        .meal-info {
          display: flex;
          flex-direction: column;
          gap: 3px;
        }

        .meal-title-row {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .meal-name {
          font-size: 0.85rem;
          font-weight: 700;
          color: var(--text-primary);
        }

        .source-tag {
          font-size: 0.6rem;
          font-weight: 800;
          text-transform: uppercase;
          padding: 1px 5px;
          border-radius: 4px;
          background: rgba(99, 102, 241, 0.2);
          color: #a5b4fc;
        }

        .source-quick {
          background: rgba(16, 185, 129, 0.2);
          color: #6ee7b7;
        }

        .meal-macros-row {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .macro-chip {
          font-size: 0.7rem;
          font-weight: 600;
        }

        .macro-cal { color: var(--macro-calories); }
        .macro-prot { color: var(--macro-protein); }
        .macro-carb { color: var(--macro-carbs); }
        .macro-f { color: var(--macro-fat); }

        .btn-delete-meal {
          color: var(--text-muted);
          padding: 6px;
          border-radius: var(--radius-sm);
          transition: all var(--duration-fast);
        }

        .btn-delete-meal:hover {
          color: var(--status-error);
          background: rgba(239, 68, 68, 0.1);
        }

        .add-more-row {
          padding-top: 4px;
          display: flex;
          justify-content: flex-end;
        }

        .btn-add-more {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 0.72rem;
          font-weight: 700;
          color: var(--macro-calories);
          padding: 4px 8px;
        }

        .btn-add-more:hover {
          text-decoration: underline;
        }
      `}</style>
    </div>
  );
}
