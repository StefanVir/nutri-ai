'use client';

import React, { useState } from 'react';
import { MealCategory, LoggedMeal } from '@/types/nutrition';
import { Sparkles, X, Flame, Dumbbell, Wheat, Droplets, Check, Loader2 } from 'lucide-react';

interface QuickLogModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogMeal: (meal: Omit<LoggedMeal, 'id' | 'timestamp'>) => void;
  defaultCategory?: MealCategory;
}

export function QuickLogModal({
  isOpen,
  onClose,
  onLogMeal,
  defaultCategory = 'snack',
}: QuickLogModalProps) {
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<MealCategory>(defaultCategory);
  const [isLoading, setIsLoading] = useState(false);
  const [parsedMeal, setParsedMeal] = useState<{
    title: string;
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    confidenceNotes: string;
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
        body: JSON.stringify({ text: description.trim() }),
      });
      const data = await res.json();
      if (data.success && data.meal) {
        setParsedMeal(data.meal);
      }
    } catch (err) {
      console.error('Failed to parse quick log:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirmLog = () => {
    if (!parsedMeal) return;
    onLogMeal({
      category,
      title: parsedMeal.title,
      calories: parsedMeal.calories,
      protein: parsedMeal.protein,
      carbs: parsedMeal.carbs,
      fat: parsedMeal.fat,
      servings: 1,
      source: 'quick_ai',
    });
    // Reset & close
    setDescription('');
    setParsedMeal(null);
    onClose();
  };

  return (
    <div className="modal-overlay animate-fade-in" onClick={onClose}>
      <div className="modal-sheet animate-slide-up" onClick={(e) => e.stopPropagation()}>
        <div className="sheet-drag-handle" />

        <div className="modal-header">
          <div className="title-wrap">
            <Sparkles size={18} className="sparkle-icon" />
            <h3 className="modal-title">Quick AI Food Log</h3>
          </div>
          <button type="button" className="btn-close" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <div className="modal-body">
          <p className="hint-text">
            Descrie masa consumată în limbaj natural. AI-ul va extrage automat estimarea de calorii și macronutrienți.
          </p>

          <form onSubmit={handleAnalyze} className="log-form">
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="ex: O shaorma mică de pui la lipie cu salată de varză și un iaurt ayran 250ml..."
              className="text-area-input"
            />

            <div className="category-select-row">
              <span className="cat-label">Destinație:</span>
              <div className="chips-row">
                {(['breakfast', 'lunch', 'dinner', 'snack'] as MealCategory[]).map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    className={`cat-chip ${category === cat ? 'selected' : ''}`}
                    onClick={() => setCategory(cat)}
                  >
                    {cat === 'breakfast' && 'Mic Dejun'}
                    {cat === 'lunch' && 'Prânz'}
                    {cat === 'dinner' && 'Cină'}
                    {cat === 'snack' && 'Gustare'}
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
                  <Loader2 size={16} className="spin-icon" />
                  <span>Analizez descrierea...</span>
                </>
              ) : (
                <>
                  <Sparkles size={16} />
                  <span>Calculează cu NVIDIA NIM</span>
                </>
              )}
            </button>
          </form>

          {/* Parsed Result Preview */}
          {parsedMeal && (
            <div className="parsed-result-card animate-fade-in">
              <div className="parsed-header">
                <span className="result-tag">Rezultat Extragere AI</span>
                <h4 className="parsed-title">{parsedMeal.title}</h4>
              </div>

              <div className="parsed-macros-grid">
                <div className="p-macro p-cal">
                  <Flame size={14} />
                  <span className="tabular-num"><strong>{parsedMeal.calories}</strong> kcal</span>
                </div>
                <div className="p-macro p-prot">
                  <Dumbbell size={14} />
                  <span className="tabular-num"><strong>{parsedMeal.protein}g</strong> P</span>
                </div>
                <div className="p-macro p-carb">
                  <Wheat size={14} />
                  <span className="tabular-num"><strong>{parsedMeal.carbs}g</strong> C</span>
                </div>
                <div className="p-macro p-fat">
                  <Droplets size={14} />
                  <span className="tabular-num"><strong>{parsedMeal.fat}g</strong> F</span>
                </div>
              </div>

              {parsedMeal.confidenceNotes && (
                <p className="confidence-text">{parsedMeal.confidenceNotes}</p>
              )}

              <button type="button" className="btn-confirm-log" onClick={handleConfirmLog}>
                <Check size={16} />
                <span>Confirmă & Adaugă în Jurnal</span>
              </button>
            </div>
          )}
        </div>

        <style jsx>{`
          .modal-overlay {
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
            max-height: 85vh;
            background: var(--bg-surface-raised);
            border-top: 1px solid var(--border-medium);
            border-radius: var(--radius-xl) var(--radius-xl) 0 0;
            display: flex;
            flex-direction: column;
            box-shadow: 0 -10px 40px rgba(0, 0, 0, 0.8);
          }

          .sheet-drag-handle {
            width: 40px;
            height: 4px;
            background: rgba(255, 255, 255, 0.2);
            border-radius: var(--radius-full);
            margin: 10px auto 4px auto;
          }

          .modal-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 12px 18px;
            border-bottom: 1px solid var(--border-subtle);
          }

          .title-wrap {
            display: flex;
            align-items: center;
            gap: 8px;
          }

          :global(.sparkle-icon) {
            color: var(--macro-protein);
          }

          .modal-title {
            font-size: 1.05rem;
            font-weight: 800;
            color: var(--text-primary);
          }

          .btn-close {
            color: var(--text-tertiary);
            padding: 6px;
          }

          .modal-body {
            padding: 16px 18px var(--safe-bottom) 18px;
            overflow-y: auto;
            display: flex;
            flex-direction: column;
            gap: 14px;
          }

          .hint-text {
            font-size: 0.8rem;
            color: var(--text-secondary);
            line-height: 1.4;
          }

          .log-form {
            display: flex;
            flex-direction: column;
            gap: 10px;
          }

          .text-area-input {
            width: 100%;
            padding: 12px 14px;
            background: var(--bg-card);
            border: 1px solid var(--border-medium);
            border-radius: var(--radius-md);
            font-size: 0.88rem;
            color: var(--text-primary);
            resize: none;
          }

          .text-area-input:focus {
            border-color: var(--macro-protein);
          }

          .category-select-row {
            display: flex;
            align-items: center;
            gap: 8px;
          }

          .cat-label {
            font-size: 0.72rem;
            font-weight: 700;
            color: var(--text-tertiary);
            text-transform: uppercase;
          }

          .chips-row {
            display: flex;
            gap: 4px;
            flex-wrap: wrap;
          }

          .cat-chip {
            font-size: 0.7rem;
            font-weight: 700;
            padding: 4px 8px;
            background: var(--bg-card);
            border: 1px solid var(--border-subtle);
            border-radius: var(--radius-full);
            color: var(--text-secondary);
          }

          .cat-chip.selected {
            background: var(--accent-primary);
            color: #ffffff;
            border-color: var(--accent-primary);
          }

          .btn-analyze {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            padding: 12px;
            background: rgba(99, 102, 241, 0.2);
            color: #a5b4fc;
            border: 1px solid rgba(99, 102, 241, 0.4);
            border-radius: var(--radius-md);
            font-size: 0.85rem;
            font-weight: 700;
            transition: all var(--duration-fast);
          }

          .btn-analyze:not(:disabled):hover {
            background: rgba(99, 102, 241, 0.35);
          }

          :global(.spin-icon) {
            animation: spin 1s linear infinite;
          }

          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }

          .parsed-result-card {
            background: linear-gradient(150deg, #18253f 0%, #111a2c 100%);
            border: 1px solid rgba(16, 185, 129, 0.35);
            border-radius: var(--radius-md);
            padding: 14px;
            display: flex;
            flex-direction: column;
            gap: 10px;
          }

          .result-tag {
            font-size: 0.65rem;
            font-weight: 800;
            text-transform: uppercase;
            color: var(--macro-protein);
            letter-spacing: 0.04em;
          }

          .parsed-title {
            font-size: 1.05rem;
            font-weight: 800;
            color: var(--text-primary);
          }

          .parsed-macros-grid {
            display: grid;
            grid-template-columns: 1.2fr 1fr 1fr 1fr;
            gap: 6px;
          }

          .p-macro {
            display: flex;
            align-items: center;
            gap: 4px;
            padding: 6px 4px;
            border-radius: var(--radius-sm);
            font-size: 0.72rem;
            justify-content: center;
          }

          .p-cal { background: var(--macro-calories-bg); color: var(--macro-calories); }
          .p-prot { background: var(--macro-protein-bg); color: var(--macro-protein); }
          .p-carb { background: var(--macro-carbs-bg); color: var(--macro-carbs); }
          .p-fat { background: var(--macro-fat-bg); color: var(--macro-fat); }

          .confidence-text {
            font-size: 0.72rem;
            color: var(--text-tertiary);
            font-style: italic;
          }

          .btn-confirm-log {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 6px;
            padding: 12px;
            background: linear-gradient(135deg, #10b981 0%, #059669 100%);
            color: #ffffff;
            border-radius: var(--radius-md);
            font-size: 0.88rem;
            font-weight: 800;
            box-shadow: 0 4px 14px rgba(16, 185, 129, 0.4);
          }
        `}</style>
      </div>
    </div>
  );
}
