'use client';

import React, { useState } from 'react';
import { MealCategory, LoggedMeal } from '@/types/nutrition';
import { X, Sparkles, Plus, Loader2 } from 'lucide-react';

interface QuickLogModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveQuickMeal: (meal: Omit<LoggedMeal, 'id' | 'timestamp'>) => void;
}

const QUICK_SUGGESTIONS = [
  '1 măr mediu și 30g migdale crude',
  'Un covrig cu susan și un iaurt grecesc 150g',
  '1 cupă proteină zer cu 250ml lapte de ovăz',
  '2 ouă fierte cu o felie de pâine prăjită',
  'O cafea cu lapte și un baton proteic',
];

export function QuickLogModal({
  isOpen,
  onClose,
  onSaveQuickMeal,
}: QuickLogModalProps) {
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<MealCategory>('snack');
  const [isLoading, setIsLoading] = useState(false);
  const [parsedPreview, setParsedPreview] = useState<{
    title: string;
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    confidenceNotes?: string;
  } | null>(null);

  if (!isOpen) return null;

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) return;

    setIsLoading(true);
    try {
      const res = await fetch('/api/ai/quick-log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ description }),
      });

      if (res.ok) {
        const data = await res.json();
        setParsedPreview(data);
      } else {
        throw new Error('Analiza a eșuat');
      }
    } catch (err) {
      console.warn('Fallback pe estimare locală:', err);
      setParsedPreview({
        title: description.slice(0, 32),
        calories: 320,
        protein: 18,
        carbs: 38,
        fat: 10,
        confidenceNotes: 'Estimare rapidă offline.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirmAndSave = () => {
    if (!parsedPreview) return;

    onSaveQuickMeal({
      title: parsedPreview.title,
      category,
      calories: parsedPreview.calories,
      protein: parsedPreview.protein,
      carbs: parsedPreview.carbs,
      fat: parsedPreview.fat,
      servings: 1,
      source: 'quick_ai',
    });

    onClose();
  };

  return (
    <div className="modal-backdrop animate-fade-in" onClick={onClose}>
      <div className="modal-sheet animate-slide-up" onClick={(e) => e.stopPropagation()}>
        <div className="sheet-drag-handle" />

        <div className="modal-header">
          <div className="header-titles">
            <h3 className="modal-title">+ Quick AI Food Log</h3>
            <span className="modal-sub">Descrie masa în limbaj natural ➔ AI extrage macro-urile</span>
          </div>
          <button type="button" className="btn-close" onClick={onClose} aria-label="Închide">
            <X size={18} />
          </button>
        </div>

        <div className="modal-body-scroll">
          {/* Category Chip Selector */}
          <div className="category-select-row">
            <span className="row-lbl">Loghează la:</span>
            <div className="category-chips">
              {(['breakfast', 'lunch', 'dinner', 'snack'] as MealCategory[]).map((cat) => {
                const labels: Record<MealCategory, string> = {
                  breakfast: 'Mic Dejun',
                  lunch: 'Prânz',
                  dinner: 'Cină',
                  snack: 'Gustare',
                };
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setCategory(cat)}
                    className={`cat-pill ${category === cat ? 'selected' : ''}`}
                  >
                    {labels[cat]}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Form Description */}
          <form onSubmit={handleAnalyze} className="quick-form">
            <textarea
              className="quick-textarea"
              rows={3}
              placeholder="Ex: Am mâncat 1 banană, un iaurt grecesc 2% și 20g unt de arahide..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />

            {/* Quick Suggestions Chips */}
            <div className="quick-suggestions-wrap">
              <span className="sug-lbl">Exemple rapide:</span>
              <div className="sug-chips">
                {QUICK_SUGGESTIONS.map((sug, i) => (
                  <button
                    key={i}
                    type="button"
                    className="sug-chip"
                    onClick={() => setDescription(sug)}
                  >
                    {sug}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading || !description.trim()}
              className="btn-analyze"
            >
              {isLoading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  <span>Se analizează prin NVIDIA NIM...</span>
                </>
              ) : (
                <>
                  <Sparkles size={16} />
                  <span>Calculează Macronutrienții</span>
                </>
              )}
            </button>
          </form>

          {/* Parsed Result Preview */}
          {parsedPreview && (
            <div className="parsed-card animate-fade-in">
              <div className="parsed-top">
                <strong className="parsed-title">{parsedPreview.title}</strong>
                <span className="parsed-category-badge">{category}</span>
              </div>

              {parsedPreview.confidenceNotes && (
                <p className="parsed-notes">{parsedPreview.confidenceNotes}</p>
              )}

              <div className="parsed-macros-grid">
                <div className="p-macro-box p-cal">
                  <span className="p-val tabular-num">{parsedPreview.calories}</span>
                  <span className="p-lbl">kcal</span>
                </div>
                <div className="p-macro-box p-prot">
                  <span className="p-val tabular-num">{parsedPreview.protein}g</span>
                  <span className="p-lbl">Proteine</span>
                </div>
                <div className="p-macro-box p-carb">
                  <span className="p-val tabular-num">{parsedPreview.carbs}g</span>
                  <span className="p-lbl">Carbo</span>
                </div>
                <div className="p-macro-box p-fat">
                  <span className="p-val tabular-num">{parsedPreview.fat}g</span>
                  <span className="p-lbl">Grăsimi</span>
                </div>
              </div>

              <button
                type="button"
                className="btn-confirm-save"
                onClick={handleConfirmAndSave}
              >
                <Plus size={16} />
                <span>Confirmă & Adaugă în Jurnal</span>
              </button>
            </div>
          )}
        </div>

        <style jsx>{`
          .modal-backdrop {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.75);
            backdrop-filter: blur(8px);
            z-index: 100;
            display: flex;
            align-items: flex-end;
            justify-content: center;
          }

          .modal-sheet {
            width: 100%;
            max-width: var(--mobile-max-width);
            background: var(--bg-surface);
            border-top-left-radius: var(--radius-xl);
            border-top-right-radius: var(--radius-xl);
            border: 1px solid var(--border-medium);
            max-height: 85vh;
            display: flex;
            flex-direction: column;
            box-shadow: 0 -10px 40px rgba(0, 0, 0, 0.85);
          }

          .sheet-drag-handle {
            width: 36px;
            height: 4px;
            border-radius: var(--radius-full);
            background: rgba(255, 255, 255, 0.2);
            margin: 10px auto 4px auto;
          }

          .modal-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 8px 18px 12px 18px;
            border-bottom: 1px solid var(--border-subtle);
          }

          .modal-title {
            font-size: 1.15rem;
            font-weight: 800;
            color: var(--text-primary);
          }

          .modal-sub {
            font-size: 0.74rem;
            color: var(--text-secondary);
          }

          .btn-close {
            width: 32px;
            height: 32px;
            border-radius: var(--radius-full);
            background: rgba(255, 255, 255, 0.08);
            display: flex;
            align-items: center;
            justify-content: center;
            color: var(--text-secondary);
          }

          .modal-body-scroll {
            padding: 16px 18px var(--safe-bottom) 18px;
            overflow-y: auto;
            display: flex;
            flex-direction: column;
            gap: 16px;
          }

          .category-select-row {
            display: flex;
            flex-direction: column;
            gap: 6px;
          }

          .row-lbl {
            font-size: 0.72rem;
            font-weight: 700;
            text-transform: uppercase;
            color: var(--text-tertiary);
          }

          .category-chips {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 6px;
          }

          .cat-pill {
            padding: 6px 4px;
            font-size: 0.72rem;
            font-weight: 700;
            background: var(--bg-card);
            border: 1px solid var(--border-subtle);
            border-radius: var(--radius-sm);
            color: var(--text-secondary);
          }

          .cat-pill.selected {
            background: var(--accent-primary);
            color: #ffffff;
            border-color: var(--accent-primary);
          }

          .quick-form {
            display: flex;
            flex-direction: column;
            gap: 10px;
          }

          .quick-textarea {
            width: 100%;
            background: var(--bg-card);
            border: 1px solid var(--border-medium);
            border-radius: var(--radius-md);
            padding: 12px 14px;
            color: var(--text-primary);
            font-size: 0.88rem;
            line-height: 1.4;
            resize: none;
          }

          .quick-textarea:focus {
            outline: 2px solid var(--accent-primary);
            border-color: transparent;
          }

          .quick-suggestions-wrap {
            display: flex;
            flex-direction: column;
            gap: 4px;
          }

          .sug-lbl {
            font-size: 0.68rem;
            font-weight: 700;
            color: var(--text-tertiary);
          }

          .sug-chips {
            display: flex;
            flex-wrap: wrap;
            gap: 4px;
          }

          .sug-chip {
            font-size: 0.68rem;
            padding: 3px 8px;
            background: rgba(255, 255, 255, 0.05);
            border-radius: var(--radius-full);
            color: var(--text-secondary);
            text-align: left;
          }

          .btn-analyze {
            width: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            padding: 12px;
            background: var(--accent-primary);
            color: #ffffff;
            border-radius: var(--radius-md);
            font-size: 0.88rem;
            font-weight: 800;
            box-shadow: 0 4px 14px var(--accent-primary-glow);
          }

          .btn-analyze:disabled {
            opacity: 0.5;
          }

          .parsed-card {
            background: var(--bg-card);
            border: 1px solid var(--border-bright);
            border-radius: var(--radius-md);
            padding: 14px;
            display: flex;
            flex-direction: column;
            gap: 10px;
          }

          .parsed-top {
            display: flex;
            align-items: center;
            justify-content: space-between;
          }

          .parsed-title {
            font-size: 0.95rem;
            color: var(--text-primary);
          }

          .parsed-category-badge {
            font-size: 0.68rem;
            font-weight: 700;
            padding: 2px 8px;
            border-radius: var(--radius-full);
            background: rgba(99, 102, 241, 0.15);
            color: #a5b4fc;
            text-transform: uppercase;
          }

          .parsed-notes {
            font-size: 0.75rem;
            color: var(--text-secondary);
          }

          .parsed-macros-grid {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 6px;
          }

          .p-macro-box {
            display: flex;
            flex-direction: column;
            align-items: center;
            padding: 6px 2px;
            border-radius: var(--radius-sm);
          }

          .p-cal { background: var(--macro-calories-bg); color: var(--macro-calories); }
          .p-prot { background: var(--macro-protein-bg); color: var(--macro-protein); }
          .p-carb { background: var(--macro-carbs-bg); color: var(--macro-carbs); }
          .p-fat { background: var(--macro-fat-bg); color: var(--macro-fat); }

          .p-val { font-size: 0.88rem; font-weight: 800; }
          .p-lbl { font-size: 0.58rem; font-weight: 700; text-transform: uppercase; }

          .btn-confirm-save {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 6px;
            padding: 10px;
            background: var(--macro-protein);
            color: #061e14;
            border-radius: var(--radius-sm);
            font-size: 0.84rem;
            font-weight: 800;
          }
        `}</style>
      </div>
    </div>
  );
}
