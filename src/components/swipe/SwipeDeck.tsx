'use client';

import React, { useState, useRef } from 'react';
import { MealCardProposal } from '@/types/nutrition';
import { Sparkles, Clock, Check, X, Info, ChefHat } from 'lucide-react';

interface SwipeDeckProps {
  cards: MealCardProposal[];
  onSwipeRight: (card: MealCardProposal) => void;
  onSwipeLeft: (card: MealCardProposal) => void;
  onOpenDetails: (card: MealCardProposal) => void;
  onStartShowdown: () => void;
  shortlistCount: number;
}

export function SwipeDeck({
  cards,
  onSwipeRight,
  onSwipeLeft,
  onOpenDetails,
  onStartShowdown,
  shortlistCount,
}: SwipeDeckProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [stamp, setStamp] = useState<'like' | 'skip' | null>(null);

  const cardRef = useRef<HTMLDivElement>(null);
  const startPos = useRef({ x: 0, y: 0 });

  const currentCard = cards[currentIndex];
  const nextCard = cards[currentIndex + 1];

  const handleTouchStart = (e: React.TouchEvent | React.MouseEvent) => {
    if (!currentCard) return;
    setIsDragging(true);
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    startPos.current = { x: clientX, y: clientY };
  };

  const handleTouchMove = (e: React.TouchEvent | React.MouseEvent) => {
    if (!isDragging || !currentCard) return;
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    const diffX = clientX - startPos.current.x;
    const diffY = clientY - startPos.current.y;

    setDragOffset({ x: diffX, y: diffY * 0.4 });

    if (diffX > 45) {
      setStamp('like');
    } else if (diffX < -45) {
      setStamp('skip');
    } else {
      setStamp(null);
    }
  };

  const handleTouchEnd = () => {
    if (!isDragging || !currentCard) return;
    setIsDragging(false);

    if (dragOffset.x > 90) {
      executeSwipe('right');
    } else if (dragOffset.x < -90) {
      executeSwipe('left');
    } else {
      setDragOffset({ x: 0, y: 0 });
      setStamp(null);
    }
  };

  const executeSwipe = (direction: 'right' | 'left') => {
    if (!currentCard) return;
    if (direction === 'right') {
      onSwipeRight(currentCard);
    } else {
      onSwipeLeft(currentCard);
    }

    setDragOffset({ x: direction === 'right' ? 400 : -400, y: 0 });
    setTimeout(() => {
      setCurrentIndex((prev) => prev + 1);
      setDragOffset({ x: 0, y: 0 });
      setStamp(null);
    }, 200);
  };

  if (!currentCard) {
    return (
      <div className="empty-deck-card">
        <div className="empty-icon-wrap">
          <Sparkles size={32} className="sparkle-gold" />
        </div>
        <h3 className="empty-title">Ai parcurs toate propunerile!</h3>
        <p className="empty-desc">
          Ai selectat <strong>{shortlistCount} rețete favorite</strong>. Intră în Matchup Showdown pentru alegerea finală.
        </p>
        {shortlistCount >= 2 ? (
          <button type="button" onClick={onStartShowdown} className="btn-cta-showdown">
            <ChefHat size={18} />
            Pornește Matchup Showdown ({shortlistCount})
          </button>
        ) : (
          <button
            type="button"
            onClick={() => setCurrentIndex(0)}
            className="btn-cta-showdown"
          >
            Reîncarcă Deck-ul de Rețete
          </button>
        )}
      </div>
    );
  }

  const rotation = dragOffset.x * 0.08;

  return (
    <div className="deck-container">
      {/* Shortlist Progress Bar */}
      <div className="deck-header">
        <div className="deck-mode-indicator">
          <span className="deck-counter">Opțiunea {currentIndex + 1} din {cards.length}</span>
        </div>
        {shortlistCount > 0 && (
          <button
            type="button"
            onClick={onStartShowdown}
            className="btn-quick-showdown"
          >
            <ChefHat size={14} />
            Showdown ({shortlistCount})
          </button>
        )}
      </div>

      {/* Card Stack Area */}
      <div className="cards-stage">
        {/* Next Card Background Shadow */}
        {nextCard && (
          <div className="deck-card next-card">
            <div className="card-inner">
              <div className="card-top-tags">
                <span className="mode-badge">{nextCard.mode}</span>
                <span className="card-time-pill">
                  <Clock size={13} /> {nextCard.prepTimeMinutes + nextCard.cookTimeMinutes}m
                </span>
              </div>
              <h3 className="card-title">{nextCard.title}</h3>
            </div>
          </div>
        )}

        {/* Active Draggable Card */}
        <div
          ref={cardRef}
          className="deck-card active-card"
          style={{
            transform: `translate3d(${dragOffset.x}px, ${dragOffset.y}px, 0) rotate(${rotation}deg)`,
            transition: isDragging ? 'none' : 'transform 0.3s var(--ease-snap)',
          }}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onMouseDown={handleTouchStart}
          onMouseMove={handleTouchMove}
          onMouseUp={handleTouchEnd}
        >
          {/* Stamp Feedback */}
          {stamp === 'like' && <div className="stamp stamp-like">ACCEPTAT</div>}
          {stamp === 'skip' && <div className="stamp stamp-skip">URMĂTORUL</div>}

          <div className="card-inner">
            <div className="card-top-tags">
              <span className="mode-badge">
                {currentCard.mode === 'fridge' ? 'Din Frigider' : currentCard.mode === 'grocery_empty' ? 'Buget Fix' : 'Smart Grocery'}
              </span>
              <span className="card-time-pill">
                <Clock size={13} /> {currentCard.prepTimeMinutes + currentCard.cookTimeMinutes} min
              </span>
            </div>

            <h3 className="card-title">{currentCard.title}</h3>

            <div className="match-reason-box">
              <Sparkles size={14} className="reason-icon" />
              <span>{currentCard.matchReason}</span>
            </div>

            {/* Macro Grid */}
            <div className="card-macros-grid">
              <div className="macro-box box-cal">
                <span className="macro-val tabular-num">{currentCard.calories}</span>
                <span className="macro-lbl">kcal</span>
              </div>
              <div className="macro-box box-prot">
                <span className="macro-val tabular-num">{currentCard.protein}g</span>
                <span className="macro-lbl">Prot</span>
              </div>
              <div className="macro-box box-carb">
                <span className="macro-val tabular-num">{currentCard.carbs}g</span>
                <span className="macro-lbl">Carb</span>
              </div>
              <div className="macro-box box-fat">
                <span className="macro-val tabular-num">{currentCard.fat}g</span>
                <span className="macro-lbl">Grăs</span>
              </div>
            </div>

            {/* Ingredients Summary */}
            <div className="card-ingredients-preview">
              <span className="ingr-head">Ingrediente principale:</span>
              <div className="ingr-tags-wrap">
                {currentCard.ingredients.slice(0, 4).map((ing, i) => (
                  <span key={i} className={`ingr-tag ${ing.toBuy ? 'to-buy-tag' : ''}`}>
                    {ing.name} ({ing.amount})
                  </span>
                ))}
                {currentCard.ingredients.length > 4 && (
                  <span className="ingr-more">+{currentCard.ingredients.length - 4} altele</span>
                )}
              </div>
            </div>

            {/* Bottom Meta */}
            <div className="card-footer-meta">
              <span>{currentCard.appliancesUsed.join(', ')}</span>
              {currentCard.estimatedCostRon ? (
                <span className="cost-tag">~{currentCard.estimatedCostRon} RON</span>
              ) : null}
            </div>
          </div>
        </div>
      </div>

      {/* Tactile Control Buttons */}
      <div className="swipe-controls">
        <button
          type="button"
          onClick={() => executeSwipe('left')}
          className="btn-ctrl btn-dislike"
          aria-label="Treci peste"
        >
          <X size={24} />
        </button>

        <button
          type="button"
          onClick={() => onOpenDetails(currentCard)}
          className="btn-ctrl btn-info"
          aria-label="Detalii Rețetă"
        >
          <Info size={20} />
        </button>

        <button
          type="button"
          onClick={() => executeSwipe('right')}
          className="btn-ctrl btn-like"
          aria-label="Adaugă în Shortlist"
        >
          <Check size={26} />
        </button>
      </div>

      <style jsx>{`
        .deck-container {
          display: flex;
          flex-direction: column;
          gap: 12px;
          height: calc(100vh - 160px);
          max-height: 580px;
        }

        .deck-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 4px;
        }

        .deck-counter {
          font-size: 0.74rem;
          font-weight: 700;
          color: var(--text-tertiary);
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .btn-quick-showdown {
          display: flex;
          align-items: center;
          gap: 5px;
          font-size: 0.72rem;
          font-weight: 800;
          padding: 5px 12px;
          background: rgba(16, 185, 129, 0.15);
          color: var(--macro-protein);
          border: 1px solid rgba(16, 185, 129, 0.35);
          border-radius: var(--radius-full);
        }

        .cards-stage {
          position: relative;
          flex: 1;
          width: 100%;
          min-height: 420px;
        }

        .deck-card {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          border-radius: var(--radius-xl);
          background: linear-gradient(165deg, #151e32 0%, #0d1322 100%);
          border: 1px solid var(--border-medium);
          box-shadow: var(--shadow-lg);
          user-select: none;
          touch-action: none;
          overflow: hidden;
        }

        .next-card {
          transform: scale(0.95) translateY(12px);
          opacity: 0.55;
          pointer-events: none;
          z-index: 1;
        }

        .active-card {
          z-index: 2;
          will-change: transform;
        }

        .stamp {
          position: absolute;
          top: 20px;
          padding: 5px 14px;
          border-radius: var(--radius-sm);
          font-size: 1.05rem;
          font-weight: 900;
          letter-spacing: 0.08em;
          border-width: 3px;
          border-style: solid;
          pointer-events: none;
          z-index: 10;
        }

        .stamp-like {
          right: 20px;
          color: var(--macro-protein);
          border-color: var(--macro-protein);
          transform: rotate(14deg);
        }

        .stamp-skip {
          left: 20px;
          color: var(--status-error);
          border-color: var(--status-error);
          transform: rotate(-14deg);
        }

        .card-inner {
          display: flex;
          flex-direction: column;
          height: 100%;
          padding: 18px 18px 14px 18px;
        }

        .card-top-tags {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 8px;
        }

        .mode-badge {
          font-size: 0.68rem;
          font-weight: 800;
          padding: 3px 10px;
          border-radius: var(--radius-full);
          background: rgba(255, 255, 255, 0.08);
          color: var(--text-primary);
          border: 1px solid var(--border-subtle);
          text-transform: uppercase;
        }

        .card-time-pill {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 0.74rem;
          font-weight: 700;
          color: var(--text-secondary);
        }

        .card-title {
          font-size: 1.25rem;
          font-weight: 800;
          color: var(--text-primary);
          line-height: 1.25;
          letter-spacing: -0.01em;
          margin-bottom: 10px;
        }

        .match-reason-box {
          display: flex;
          align-items: flex-start;
          gap: 8px;
          background: rgba(99, 102, 241, 0.1);
          border: 1px solid rgba(99, 102, 241, 0.25);
          border-radius: var(--radius-md);
          padding: 10px 12px;
          font-size: 0.78rem;
          color: #c7d2fe;
          line-height: 1.35;
          margin-bottom: 12px;
        }

        :global(.reason-icon) {
          color: var(--macro-calories);
          flex-shrink: 0;
          margin-top: 2px;
        }

        .card-macros-grid {
          display: grid;
          grid-template-columns: 1.2fr 1fr 1fr 1fr;
          gap: 6px;
          margin-bottom: 12px;
        }

        .macro-box {
          padding: 8px 4px;
          border-radius: var(--radius-sm);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }

        .box-cal { background: var(--macro-calories-bg); color: var(--macro-calories); border: 1px solid rgba(245, 158, 11, 0.2); }
        .box-prot { background: var(--macro-protein-bg); color: var(--macro-protein); border: 1px solid rgba(16, 185, 129, 0.2); }
        .box-carb { background: var(--macro-carbs-bg); color: var(--macro-carbs); border: 1px solid rgba(6, 182, 212, 0.2); }
        .box-fat { background: var(--macro-fat-bg); color: var(--macro-fat); border: 1px solid rgba(244, 63, 94, 0.2); }

        .macro-val { font-size: 0.95rem; font-weight: 800; }
        .macro-lbl { font-size: 0.6rem; font-weight: 700; text-transform: uppercase; }

        .card-ingredients-preview {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 5px;
          margin-bottom: 10px;
        }

        .ingr-head {
          font-size: 0.7rem;
          font-weight: 700;
          color: var(--text-tertiary);
          text-transform: uppercase;
        }

        .ingr-tags-wrap {
          display: flex;
          flex-wrap: wrap;
          gap: 4px;
        }

        .ingr-tag {
          font-size: 0.7rem;
          font-weight: 600;
          padding: 3px 8px;
          background: rgba(255, 255, 255, 0.05);
          border-radius: var(--radius-full);
          color: var(--text-secondary);
        }

        .to-buy-tag {
          background: rgba(245, 158, 11, 0.15);
          color: #fbbf24;
          border: 1px dashed rgba(245, 158, 11, 0.4);
        }

        .ingr-more {
          font-size: 0.68rem;
          color: var(--text-tertiary);
          align-self: center;
        }

        .card-footer-meta {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-top: 8px;
          border-top: 1px solid var(--border-subtle);
          font-size: 0.72rem;
          color: var(--text-tertiary);
        }

        .cost-tag {
          font-weight: 700;
          color: var(--macro-calories);
        }

        .swipe-controls {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 22px;
          padding: 6px 0;
        }

        .btn-ctrl {
          width: 56px;
          height: 56px;
          border-radius: var(--radius-full);
          display: flex;
          align-items: center;
          justify-content: center;
          transition: transform var(--duration-fast) var(--ease-snap), background var(--duration-fast);
          box-shadow: 0 4px 14px rgba(0, 0, 0, 0.5);
        }

        .btn-ctrl:active {
          transform: scale(0.90);
        }

        .btn-dislike {
          background: rgba(239, 68, 68, 0.14);
          color: #ef4444;
          border: 1px solid rgba(239, 68, 68, 0.35);
        }

        .btn-info {
          width: 46px;
          height: 46px;
          background: rgba(255, 255, 255, 0.08);
          color: var(--text-secondary);
          border: 1px solid var(--border-medium);
        }

        .btn-like {
          background: rgba(16, 185, 129, 0.18);
          color: #10b981;
          border: 1px solid rgba(16, 185, 129, 0.45);
        }

        .empty-deck-card {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          padding: 36px 20px;
          background: var(--bg-card);
          border: 1px solid var(--border-medium);
          border-radius: var(--radius-xl);
          width: 100%;
        }

        .empty-icon-wrap {
          width: 64px;
          height: 64px;
          border-radius: var(--radius-full);
          background: rgba(245, 158, 11, 0.12);
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 16px;
        }

        :global(.sparkle-gold) {
          color: var(--macro-calories);
        }

        .empty-title {
          font-size: 1.2rem;
          font-weight: 800;
          color: var(--text-primary);
          margin-bottom: 8px;
        }

        .empty-desc {
          font-size: 0.84rem;
          color: var(--text-secondary);
          line-height: 1.4;
          margin-bottom: 22px;
        }

        .btn-cta-showdown {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px 22px;
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
          color: #ffffff;
          border-radius: var(--radius-md);
          font-size: 0.9rem;
          font-weight: 800;
          box-shadow: 0 4px 18px rgba(16, 185, 129, 0.4);
        }
      `}</style>
    </div>
  );
}
