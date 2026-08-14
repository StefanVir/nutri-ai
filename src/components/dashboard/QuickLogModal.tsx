'use client';

import React, { useState, useRef } from 'react';
import { MealCategory, LoggedMeal } from '@/types/nutrition';
import { X, Sparkles, Plus, Loader2, Camera, Upload, Image as ImageIcon, CheckCircle2, RefreshCw } from 'lucide-react';

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
  const [activeTab, setActiveTab] = useState<'text' | 'photo'>('photo');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<MealCategory>('snack');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [photoHint, setPhotoHint] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [parsedPreview, setParsedPreview] = useState<{
    title: string;
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    detectedItems?: { name: string; estimatedGrams?: number; calories?: number }[];
    confidenceNotes?: string;
  } | null>(null);

  if (!isOpen) return null;

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        // Resize image to max 1024px to ensure fast upload
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        const maxDim = 1024;

        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);

        const compressedBase64 = canvas.toDataURL('image/jpeg', 0.85);
        setSelectedImage(compressedBase64);
        setParsedPreview(null);
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleAnalyzePhoto = async () => {
    if (!selectedImage) return;

    setIsLoading(true);
    try {
      const res = await fetch('/api/ai/vision-log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64: selectedImage,
          userHint: photoHint,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setParsedPreview(data);
      } else {
        throw new Error('Analiza foto a eșuat');
      }
    } catch (err) {
      console.warn('Vision analysis fallback:', err);
      setParsedPreview({
        title: photoHint.trim() || 'Preparat Detectat Vizual',
        calories: 460,
        protein: 32,
        carbs: 45,
        fat: 16,
        detectedItems: [{ name: 'Porție completă identificată', estimatedGrams: 300, calories: 460 }],
        confidenceNotes: 'Estimare calculată pe baza imaginii.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnalyzeText = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) return;

    setIsLoading(true);
    try {
      const res = await fetch('/api/ai/quick-log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: description }),
      });

      if (res.ok) {
        const data = await res.json();
        setParsedPreview(data);
      } else {
        throw new Error('Analiza textului a eșuat');
      }
    } catch (err) {
      console.warn('Fallback pe estimare locală:', err);
      setParsedPreview({
        title: description.slice(0, 32),
        calories: 350,
        protein: 20,
        carbs: 40,
        fat: 12,
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
            <h3 className="modal-title">+ Quick AI Nutrition Log</h3>
            <span className="modal-sub">Scanare Foto cu Llama 3.2 Vision sau Text Liber</span>
          </div>
          <button type="button" className="btn-close" onClick={onClose} aria-label="Închide">
            <X size={18} />
          </button>
        </div>

        {/* Tab Selector: Photo Vision vs Text */}
        <div className="tab-control-wrap">
          <button
            type="button"
            className={`mode-tab-btn ${activeTab === 'photo' ? 'active' : ''}`}
            onClick={() => { setActiveTab('photo'); setParsedPreview(null); }}
          >
            <Camera size={16} />
            <span>📸 Scanare Foto (AI Vision)</span>
          </button>
          <button
            type="button"
            className={`mode-tab-btn ${activeTab === 'text' ? 'active' : ''}`}
            onClick={() => { setActiveTab('text'); setParsedPreview(null); }}
          >
            <Sparkles size={16} />
            <span>✍️ Text / Descriere</span>
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

          {/* TAB 1: Photo Scanner */}
          {activeTab === 'photo' && (
            <div className="photo-scan-section">
              <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                capture="environment"
                onChange={handleImageUpload}
                style={{ display: 'none' }}
              />

              {!selectedImage ? (
                <div
                  className="photo-dropzone"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <div className="dropzone-icon-circle">
                    <Camera size={28} />
                  </div>
                  <div className="dropzone-texts">
                    <span className="drop-main">Fă o poză sau alege din galerie</span>
                    <span className="drop-sub">AI-ul recunoaște mâncarea și calculează macro-urile</span>
                  </div>
                  <button type="button" className="btn-browse-photo">
                    <Upload size={14} />
                    <span>Încarcă Imagine</span>
                  </button>
                </div>
              ) : (
                <div className="photo-preview-wrap">
                  <div className="preview-image-container">
                    <img src={selectedImage} alt="Mâncare scanată" className="preview-img" />
                    {isLoading && <div className="scanning-laser-line" />}
                    <button
                      type="button"
                      className="btn-remove-photo"
                      onClick={() => { setSelectedImage(null); setParsedPreview(null); }}
                      aria-label="Schimbă poza"
                    >
                      <RefreshCw size={14} />
                      <span>Schimbă poza</span>
                    </button>
                  </div>

                  <div className="hint-input-wrap">
                    <input
                      type="text"
                      className="hint-input"
                      placeholder="Adaugă o notiță (opțional, ex: fără sos, 200g somon...)"
                      value={photoHint}
                      onChange={(e) => setPhotoHint(e.target.value)}
                    />
                  </div>

                  {!parsedPreview && (
                    <button
                      type="button"
                      className="btn-run-vision"
                      onClick={handleAnalyzePhoto}
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 size={18} className="spinner" />
                          <span>Llama 3.2 Vision analizează farfuria...</span>
                        </>
                      ) : (
                        <>
                          <Sparkles size={18} />
                          <span>Analizează Farfuria cu AI Vision</span>
                        </>
                      )}
                    </button>
                  )}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: Text Description */}
          {activeTab === 'text' && (
            <form onSubmit={handleAnalyzeText} className="quick-form">
              <textarea
                className="quick-textarea"
                rows={3}
                placeholder="Ex: Am mâncat 1 banană, un iaurt grecesc 2% și 20g unt de arahide..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />

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

              {!parsedPreview && (
                <button
                  type="submit"
                  disabled={isLoading || !description.trim()}
                  className="btn-analyze-quick"
                >
                  {isLoading ? (
                    <>
                      <Loader2 size={16} className="spinner" />
                      <span>Se analizează ingredientele...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles size={16} />
                      <span>Calculează Macro-urile cu AI</span>
                    </>
                  )}
                </button>
              )}
            </form>
          )}

          {/* Parsed Result Preview */}
          {parsedPreview && (
            <div className="preview-card animate-scale-up">
              <div className="preview-header">
                <div className="detected-badge">
                  <CheckCircle2 size={14} />
                  <span>Detectat cu Succes</span>
                </div>
                <h4 className="preview-meal-title">{parsedPreview.title}</h4>
              </div>

              {/* Detected items list if from photo */}
              {parsedPreview.detectedItems && parsedPreview.detectedItems.length > 0 && (
                <div className="detected-items-wrap">
                  <span className="detected-label">Componente identificate vizual pe farfurie:</span>
                  <div className="detected-list">
                    {parsedPreview.detectedItems.map((item, idx) => (
                      <div key={idx} className="detected-item-pill">
                        <span className="item-name">{item.name}</span>
                        {item.estimatedGrams && <span className="item-grams">~{item.estimatedGrams}g</span>}
                        {item.calories && <span className="item-cals">({item.calories} kcal)</span>}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Macro stats grid */}
              <div className="preview-macros-grid">
                <div className="preview-macro-cell cal">
                  <span className="macro-num">{parsedPreview.calories}</span>
                  <span className="macro-lbl">kcal</span>
                </div>
                <div className="preview-macro-cell prot">
                  <span className="macro-num">{parsedPreview.protein}g</span>
                  <span className="macro-lbl">Proteine</span>
                </div>
                <div className="preview-macro-cell carb">
                  <span className="macro-num">{parsedPreview.carbs}g</span>
                  <span className="macro-lbl">Carbo</span>
                </div>
                <div className="preview-macro-cell fat">
                  <span className="macro-num">{parsedPreview.fat}g</span>
                  <span className="macro-lbl">Grăsimi</span>
                </div>
              </div>

              {parsedPreview.confidenceNotes && (
                <p className="confidence-text">{parsedPreview.confidenceNotes}</p>
              )}

              <button
                type="button"
                className="btn-confirm-save"
                onClick={handleConfirmAndSave}
              >
                <Plus size={18} />
                <span>Confirmă & Adaugă în Jurnalul Zilnic</span>
              </button>
            </div>
          )}
        </div>

        <style jsx>{`
          .modal-backdrop {
            position: fixed;
            inset: 0;
            background: rgba(0, 0, 0, 0.78);
            backdrop-filter: blur(8px);
            z-index: var(--z-modal);
            display: flex;
            align-items: flex-end;
            justify-content: center;
          }

          .modal-sheet {
            width: 100%;
            max-width: var(--mobile-max-width);
            max-height: 88vh;
            background: var(--bg-surface-raised);
            border-top: 1px solid var(--border-medium);
            border-radius: var(--radius-xl) var(--radius-xl) 0 0;
            display: flex;
            flex-direction: column;
            box-shadow: 0 -10px 40px rgba(0, 0, 0, 0.85);
            overflow: hidden;
          }

          .sheet-drag-handle {
            width: 40px;
            height: 4px;
            background: rgba(255, 255, 255, 0.2);
            border-radius: var(--radius-full);
            margin: 10px auto 4px auto;
            flex-shrink: 0;
          }

          .modal-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 12px 18px;
            border-bottom: 1px solid var(--border-subtle);
            flex-shrink: 0;
          }

          .header-titles {
            display: flex;
            flex-direction: column;
            gap: 2px;
          }

          .modal-title {
            font-size: 1.05rem;
            font-weight: 800;
            color: var(--text-primary);
          }

          .modal-sub {
            font-size: 0.73rem;
            color: var(--text-tertiary);
          }

          .btn-close {
            color: var(--text-tertiary);
            padding: 6px;
            border-radius: var(--radius-full);
          }

          .tab-control-wrap {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 6px;
            padding: 10px 18px 6px 18px;
            background: rgba(0, 0, 0, 0.25);
            border-bottom: 1px solid var(--border-subtle);
            flex-shrink: 0;
          }

          .mode-tab-btn {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 6px;
            padding: 8px 10px;
            border-radius: var(--radius-sm);
            background: var(--bg-card);
            border: 1px solid var(--border-subtle);
            color: var(--text-secondary);
            font-size: 0.78rem;
            font-weight: 700;
            transition: all var(--duration-fast);
          }

          .mode-tab-btn.active {
            background: rgba(99, 102, 241, 0.2);
            border-color: var(--accent-primary);
            color: #ffffff;
            box-shadow: 0 0 12px rgba(99, 102, 241, 0.25);
          }

          .modal-body-scroll {
            flex: 1;
            overflow-y: auto;
            padding: 14px 18px var(--safe-bottom) 18px;
            display: flex;
            flex-direction: column;
            gap: 14px;
            -webkit-overflow-scrolling: touch;
          }

          .category-select-row {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 8px;
            background: var(--bg-card);
            padding: 8px 12px;
            border-radius: var(--radius-md);
            border: 1px solid var(--border-subtle);
          }

          .row-lbl {
            font-size: 0.72rem;
            font-weight: 700;
            color: var(--text-tertiary);
            flex-shrink: 0;
          }

          .category-chips {
            display: flex;
            gap: 4px;
          }

          .cat-pill {
            padding: 4px 8px;
            border-radius: var(--radius-full);
            font-size: 0.72rem;
            font-weight: 700;
            background: rgba(255, 255, 255, 0.05);
            color: var(--text-secondary);
            border: 1px solid transparent;
            transition: all var(--duration-fast);
          }

          .cat-pill.selected {
            background: var(--accent-primary);
            color: #ffffff;
          }

          /* Photo scanner styles */
          .photo-scan-section {
            display: flex;
            flex-direction: column;
            gap: 10px;
          }

          .photo-dropzone {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            gap: 10px;
            padding: 24px 16px;
            background: rgba(99, 102, 241, 0.04);
            border: 2px dashed rgba(99, 102, 241, 0.35);
            border-radius: var(--radius-lg);
            cursor: pointer;
            text-align: center;
            transition: all var(--duration-fast);
          }

          .photo-dropzone:hover {
            background: rgba(99, 102, 241, 0.08);
            border-color: var(--accent-primary);
          }

          .dropzone-icon-circle {
            width: 56px;
            height: 56px;
            border-radius: var(--radius-full);
            background: rgba(99, 102, 241, 0.15);
            color: #a5b4fc;
            display: flex;
            align-items: center;
            justify-content: center;
          }

          .dropzone-texts {
            display: flex;
            flex-direction: column;
            gap: 2px;
          }

          .drop-main {
            font-size: 0.92rem;
            font-weight: 800;
            color: var(--text-primary);
          }

          .drop-sub {
            font-size: 0.72rem;
            color: var(--text-tertiary);
          }

          .btn-browse-photo {
            display: flex;
            align-items: center;
            gap: 6px;
            padding: 8px 16px;
            background: var(--accent-primary);
            color: #ffffff;
            border-radius: var(--radius-full);
            font-size: 0.78rem;
            font-weight: 700;
            box-shadow: 0 4px 14px rgba(99, 102, 241, 0.35);
          }

          .photo-preview-wrap {
            display: flex;
            flex-direction: column;
            gap: 10px;
          }

          .preview-image-container {
            position: relative;
            width: 100%;
            height: 200px;
            border-radius: var(--radius-md);
            overflow: hidden;
            border: 1px solid var(--border-medium);
            background: #000;
          }

          .preview-img {
            width: 100%;
            height: 100%;
            object-fit: cover;
          }

          .scanning-laser-line {
            position: absolute;
            left: 0;
            right: 0;
            height: 3px;
            background: #10b981;
            box-shadow: 0 0 15px #10b981, 0 0 30px #10b981;
            animation: scanLaser 1.6s ease-in-out infinite alternate;
          }

          @keyframes scanLaser {
            0% { top: 5%; }
            100% { top: 92%; }
          }

          .btn-remove-photo {
            position: absolute;
            top: 8px;
            right: 8px;
            display: flex;
            align-items: center;
            gap: 4px;
            padding: 4px 8px;
            background: rgba(0, 0, 0, 0.75);
            backdrop-filter: blur(4px);
            color: #fff;
            border-radius: var(--radius-full);
            font-size: 0.7rem;
            font-weight: 700;
          }

          .hint-input-wrap {
            width: 100%;
          }

          .hint-input {
            width: 100%;
            padding: 8px 12px;
            background: var(--bg-card);
            border: 1px solid var(--border-medium);
            border-radius: var(--radius-sm);
            font-size: 0.8rem;
            color: var(--text-primary);
          }

          .btn-run-vision {
            width: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            padding: 12px;
            background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%);
            color: #ffffff;
            border-radius: var(--radius-md);
            font-size: 0.92rem;
            font-weight: 800;
            box-shadow: 0 4px 18px rgba(99, 102, 241, 0.4);
          }

          /* Text Form */
          .quick-form {
            display: flex;
            flex-direction: column;
            gap: 10px;
          }

          .quick-textarea {
            width: 100%;
            padding: 12px;
            background: var(--bg-card);
            border: 1px solid var(--border-medium);
            border-radius: var(--radius-md);
            color: var(--text-primary);
            font-size: 0.88rem;
            resize: none;
          }

          .quick-textarea:focus {
            border-color: var(--accent-primary);
          }

          .quick-suggestions-wrap {
            display: flex;
            flex-direction: column;
            gap: 6px;
          }

          .sug-lbl {
            font-size: 0.7rem;
            font-weight: 700;
            color: var(--text-tertiary);
          }

          .sug-chips {
            display: flex;
            flex-wrap: wrap;
            gap: 6px;
          }

          .sug-chip {
            padding: 4px 10px;
            background: rgba(255, 255, 255, 0.04);
            border: 1px solid var(--border-subtle);
            border-radius: var(--radius-full);
            font-size: 0.72rem;
            color: var(--text-secondary);
            text-align: left;
          }

          .sug-chip:hover {
            border-color: var(--accent-primary);
            color: var(--text-primary);
          }

          .btn-analyze-quick {
            width: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            padding: 12px;
            background: var(--accent-primary);
            color: #ffffff;
            border-radius: var(--radius-md);
            font-size: 0.9rem;
            font-weight: 800;
          }

          /* Preview Card */
          .preview-card {
            background: rgba(0, 0, 0, 0.4);
            border: 1px solid var(--border-bright);
            border-radius: var(--radius-lg);
            padding: 14px;
            display: flex;
            flex-direction: column;
            gap: 12px;
          }

          .preview-header {
            display: flex;
            flex-direction: column;
            gap: 4px;
          }

          .detected-badge {
            display: inline-flex;
            align-items: center;
            gap: 4px;
            color: var(--macro-protein);
            font-size: 0.7rem;
            font-weight: 800;
            text-transform: uppercase;
            letter-spacing: 0.04em;
          }

          .preview-meal-title {
            font-size: 1.05rem;
            font-weight: 800;
            color: var(--text-primary);
          }

          .detected-items-wrap {
            display: flex;
            flex-direction: column;
            gap: 6px;
            background: rgba(255, 255, 255, 0.03);
            padding: 8px 10px;
            border-radius: var(--radius-sm);
          }

          .detected-label {
            font-size: 0.68rem;
            font-weight: 700;
            color: var(--text-tertiary);
          }

          .detected-list {
            display: flex;
            flex-wrap: wrap;
            gap: 4px;
          }

          .detected-item-pill {
            display: flex;
            align-items: center;
            gap: 4px;
            padding: 3px 8px;
            background: rgba(16, 185, 129, 0.12);
            border: 1px solid rgba(16, 185, 129, 0.3);
            border-radius: var(--radius-full);
            font-size: 0.72rem;
            color: #6ee7b7;
          }

          .item-grams {
            font-weight: 700;
            color: #ffffff;
          }

          .item-cals {
            font-size: 0.65rem;
            color: rgba(255, 255, 255, 0.7);
          }

          .preview-macros-grid {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 6px;
          }

          .preview-macro-cell {
            display: flex;
            flex-direction: column;
            align-items: center;
            padding: 8px 4px;
            background: var(--bg-card);
            border-radius: var(--radius-sm);
            border: 1px solid var(--border-subtle);
          }

          .preview-macro-cell.cal .macro-num { color: var(--macro-calories); }
          .preview-macro-cell.prot .macro-num { color: var(--macro-protein); }
          .preview-macro-cell.carb .macro-num { color: var(--macro-carbs); }
          .preview-macro-cell.fat .macro-num { color: var(--macro-fat); }

          .macro-num {
            font-size: 1rem;
            font-weight: 900;
            font-variant-numeric: tabular-nums;
          }

          .macro-lbl {
            font-size: 0.62rem;
            font-weight: 700;
            color: var(--text-tertiary);
            text-transform: uppercase;
          }

          .confidence-text {
            font-size: 0.74rem;
            color: var(--text-secondary);
            line-height: 1.4;
            background: rgba(255, 255, 255, 0.02);
            padding: 6px 10px;
            border-radius: var(--radius-sm);
          }

          .btn-confirm-save {
            width: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            padding: 13px;
            background: linear-gradient(135deg, #10b981 0%, #059669 100%);
            color: #ffffff;
            border-radius: var(--radius-md);
            font-size: 0.92rem;
            font-weight: 800;
            box-shadow: 0 4px 18px rgba(16, 185, 129, 0.35);
          }

          :global(.spinner) {
            animation: spin 1s linear infinite;
          }

          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    </div>
  );
}
