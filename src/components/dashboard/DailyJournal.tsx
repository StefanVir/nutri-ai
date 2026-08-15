'use client';

import React from 'react';
import { LoggedMeal, MealCategory } from '@/types/nutrition';
import { Plus, Trash2, Sparkles } from 'lucide-react';

interface DailyJournalProps {
  loggedMeals: LoggedMeal[];
  onDeleteMeal: (mealId: string) => void;
  onOpenQuickLog: (category: MealCategory) => void;
  onOpenSwipe: (category: MealCategory) => void;
}

const CATEGORIES: { id: MealCategory; label: string }[] = [
  { id: 'breakfast', label: 'Mic Dejun' },
  { id: 'lunch', label: 'Prânz' },
  { id: 'dinner', label: 'Cină' },
  { id: 'snack', label: 'Gustări' },
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
        <h2 className="journal-title">Jurnal de mese</h2>
      </div>

      <div className="categories-stack">
        {CATEGORIES.map((cat) => {
          const meals = getMealsForCategory(cat.id);
          const totals = getCategoryTotal(cat.id);

          return (
            <div key={cat.id} className="category-block">
              {/* Category Header */}
              <div className="category-header-row">
                <div className="cat-title-wrap">
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
                    title="Adaugă masă"
                  >
                    <Plus size={13} />
                    <span>Adaugă</span>
                  </button>
                  <button
                    type="button"
                    className="btn-cat-action btn-cat-swipe"
                    onClick={() => onOpenSwipe(cat.id)}
                    title="Sugestii rețete"
                  >
                    <Sparkles size={12} />
                    <span>Rețete</span>
                  </button>
                </div>
              </div>

              {/* Meals List */}
              <div className="meals-list">
                {meals.length === 0 ? (
                  <div className="empty-meal-slot">
                    <span className="empty-slot-text">Nicio masă înregistrată</span>
                  </div>
                ) : (
                  meals.map((meal) => (
                    <div key={meal.id} className="meal-card animate-slide-up">
                      <div className="meal-info">
                        <span className="meal-title">{meal.title}</span>
                        <div className="meal-macros-row tabular-num">
                          <span className="macro-chip-sm chip-cal">{meal.calories} kcal</span>
                          <span className="macro-chip-sm chip-prot">{meal.protein}g P</span>
                          <span className="macro-chip-sm chip-carb">{meal.carbs}g C</span>
                          <span className="macro-chip-sm chip-fat">{meal.fat}g G</span>
                        </div>
                      </div>

                      <button
                        type="button"
                        className="btn-delete-meal"
                        onClick={() => onDeleteMeal(meal.id)}
                        aria-label={`Șterge ${meal.title}`}
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
          margin-top: 14px;
        }

        .journal-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .journal-title {
          font-size: 0.95rem;
          font-weight: 700;
          color: var(--text-primary);
          letter-spacing: -0.01em;
        }

        .categories-stack {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .category-block {
          background: #0d121d;
          border: 1px solid rgba(255, 255, 255, 0.08);
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

        .cat-label {
          font-size: 0.86rem;
          font-weight: 700;
          color: var(--text-primary);
        }

        .cat-kcal-total {
          font-size: 0.74rem;
          font-weight: 700;
          color: var(--macro-calories);
          background: rgba(245, 158, 11, 0.12);
          padding: 1px 7px;
          border-radius: var(--radius-full);
        }

        .cat-actions {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .btn-cat-action {
          display: flex;
          align-items: center;
          gap: 4px;
          padding: 5px 10px;
          min-height: 32px;
          background: rgba(255, 255, 255, 0.06);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: var(--radius-full);
          font-size: 0.74rem;
          font-weight: 600;
          color: var(--text-secondary);
          cursor: pointer;
        }

        .btn-cat-action:active {
          background: rgba(255, 255, 255, 0.12);
          transform: scale(0.97);
        }

        .btn-cat-swipe {
          background: rgba(16, 185, 129, 0.12);
          border-color: rgba(16, 185, 129, 0.3);
          color: var(--macro-protein);
        }

        .meals-list {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .empty-meal-slot {
          padding: 8px 10px;
          background: rgba(255, 255, 255, 0.02);
          border: 1px dashed rgba(255, 255, 255, 0.06);
          border-radius: var(--radius-sm);
        }

        .empty-slot-text {
          font-size: 0.72rem;
          color: var(--text-tertiary);
        }

        .meal-card {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 10px 12px;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.06);
          border-radius: var(--radius-sm);
        }

        .meal-info {
          display: flex;
          flex-direction: column;
          gap: 3px;
        }

        .meal-title {
          font-size: 0.84rem;
          font-weight: 600;
          color: var(--text-primary);
        }

        .meal-macros-row {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .macro-chip-sm {
          font-size: 0.68rem;
          font-weight: 700;
        }

        .chip-cal { color: var(--macro-calories); }
        .chip-prot { color: var(--macro-protein); }
        .chip-carb { color: var(--macro-carbs); }
        .chip-fat { color: var(--macro-fat); }

        .btn-delete-meal {
          color: var(--text-tertiary);
          padding: 6px;
          border-radius: var(--radius-sm);
          cursor: pointer;
        }

        .btn-delete-meal:active {
          color: #ef4444;
          background: rgba(239, 68, 68, 0.1);
        }
      `}</style>
    </div>
  );
}
