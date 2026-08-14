'use client';

import React from 'react';
import { LoggedMeal, MealCategory } from '@/types/nutrition';
import { Plus, Trash2, Sun, Sunset, Moon, Cookie } from 'lucide-react';

interface DailyJournalProps {
  loggedMeals: LoggedMeal[];
  onDeleteMeal: (mealId: string) => void;
  onOpenQuickLog: (category: MealCategory) => void;
  onOpenSwipe: (category: MealCategory) => void;
}

const CATEGORIES: { id: MealCategory; label: string; icon: any }[] = [
  { id: 'breakfast', label: 'Mic Dejun', icon: Sun },
  { id: 'lunch', label: 'Prânz', icon: Sunset },
  { id: 'dinner', label: 'Cină', icon: Moon },
  { id: 'snack', label: 'Gustări', icon: Cookie },
];

export function DailyJournal({
  loggedMeals,
  onDeleteMeal,
  onOpenQuickLog,
  onOpenSwipe,
}: DailyJournalProps) {
  const getMealsForCategory = (cat: MealCategory) => {
    return loggedMeals.filter((m) => m.category === cat);
  };

  const getCategoryTotal = (cat: MealCategory) => {
    const meals = getMealsForCategory(cat);
    return meals.reduce(
      (acc, m) => ({
        calories: acc.calories + m.calories,
        protein: acc.protein + m.protein,
        carbs: acc.carbs + m.carbs,
        fat: acc.fat + m.fat,
      }),
      { calories: 0, protein: 0, carbs: 0, fat: 0 }
    );
  };

  return (
    <div className="journal-container">
      <div className="journal-header">
        <h2 className="journal-title">Jurnalul de Azi</h2>
      </div>

      <div className="categories-stack">
        {CATEGORIES.map((cat) => {
          const meals = getMealsForCategory(cat.id);
          const totals = getCategoryTotal(cat.id);
          const IconComponent = cat.icon;

          return (
            <div key={cat.id} className="category-block">
              {/* Category Header */}
              <div className="category-header-row">
                <div className="cat-title-wrap">
                  <div className="cat-icon-badge">
                    <IconComponent size={14} />
                  </div>
                  <strong className="cat-label">{cat.label}</strong>
                  {meals.length > 0 && (
                    <span className="cat-kcal-total tabular-num">
                      {totals.calories} kcal
                    </span>
                  )}
                </div>

                <div className="cat-actions">
                  <button
                    type="button"
                    className="btn-cat-action"
                    onClick={() => onOpenQuickLog(cat.id)}
                    title="Quick AI Log"
                  >
                    <Plus size={13} />
                    <span>Quick</span>
                  </button>
                  <button
                    type="button"
                    className="btn-cat-action btn-cat-swipe"
                    onClick={() => onOpenSwipe(cat.id)}
                    title="Găsește rețetă prin Swipe"
                  >
                    <span>Swipe</span>
                  </button>
                </div>
              </div>

              {/* Meals List */}
              <div className="meals-list">
                {meals.length === 0 ? (
                  <div className="empty-meal-slot">
                    <span className="empty-slot-text">Nicio masă logată încă</span>
                  </div>
                ) : (
                  meals.map((meal) => (
                    <div key={meal.id} className="meal-item-row animate-fade-in">
                      <div className="meal-info">
                        <strong className="meal-name">{meal.title}</strong>
                        <div className="meal-macros-mini">
                          <span className="mini-cal tabular-num">{meal.calories} kcal</span>
                          <span className="mini-dot">•</span>
                          <span className="mini-p tabular-num">{meal.protein}g P</span>
                          <span className="mini-dot">•</span>
                          <span className="mini-c tabular-num">{meal.carbs}g C</span>
                          <span className="mini-dot">•</span>
                          <span className="mini-f tabular-num">{meal.fat}g F</span>
                        </div>
                      </div>

                      <button
                        type="button"
                        className="btn-delete-meal"
                        onClick={() => onDeleteMeal(meal.id)}
                        aria-label="Șterge masă"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>

      <style jsx>{`
        .journal-container {
          display: flex;
          flex-direction: column;
          gap: 12px;
          margin-bottom: 24px;
        }

        .journal-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 2px;
        }

        .journal-title {
          font-size: 1.1rem;
          font-weight: 800;
          color: var(--text-primary);
          letter-spacing: -0.01em;
        }

        .categories-stack {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .category-block {
          background: var(--bg-card);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-md);
          padding: 12px 14px;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .category-header-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .cat-title-wrap {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .cat-icon-badge {
          width: 26px;
          height: 26px;
          border-radius: var(--radius-full);
          background: rgba(255, 255, 255, 0.08);
          color: var(--text-primary);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .cat-label {
          font-size: 0.86rem;
          font-weight: 700;
          color: var(--text-primary);
        }

        .cat-kcal-total {
          font-size: 0.72rem;
          font-weight: 700;
          color: var(--macro-calories);
          background: var(--macro-calories-bg);
          padding: 2px 6px;
          border-radius: var(--radius-sm);
        }

        .cat-actions {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .btn-cat-action {
          display: flex;
          align-items: center;
          gap: 3px;
          font-size: 0.68rem;
          font-weight: 700;
          padding: 8px 12px;
          min-height: 44px;
          background: rgba(255, 255, 255, 0.06);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-full);
          color: var(--text-secondary);
        }

        .btn-cat-swipe {
          background: rgba(99, 102, 241, 0.14);
          color: #a5b4fc;
          border-color: rgba(99, 102, 241, 0.35);
        }

        .meals-list {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .empty-meal-slot {
          padding: 8px 10px;
          background: rgba(0, 0, 0, 0.2);
          border-radius: var(--radius-sm);
          border: 1px dashed var(--border-subtle);
          text-align: center;
        }

        .empty-slot-text {
          font-size: 0.72rem;
          color: var(--text-tertiary);
        }

        .meal-item-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 8px 10px;
          background: var(--bg-surface-raised);
          border-radius: var(--radius-sm);
          border: 1px solid var(--border-subtle);
        }

        .meal-info {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .meal-name {
          font-size: 0.84rem;
          font-weight: 700;
          color: var(--text-primary);
        }

        .meal-macros-mini {
          display: flex;
          align-items: center;
          gap: 5px;
          font-size: 0.7rem;
        }

        .mini-cal { color: var(--macro-calories); font-weight: 700; }
        .mini-p { color: var(--macro-protein); font-weight: 600; }
        .mini-c { color: var(--macro-carbs); font-weight: 600; }
        .mini-f { color: var(--macro-fat); font-weight: 600; }
        .mini-dot { color: var(--text-tertiary); }

        .btn-delete-meal {
          color: var(--text-tertiary);
          padding: 10px;
          min-width: 44px;
          min-height: 44px;
          border-radius: var(--radius-sm);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .btn-delete-meal:active {
          color: var(--status-error);
          background: rgba(239, 68, 68, 0.1);
        }
      `}</style>
    </div>
  );
}
