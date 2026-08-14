'use client';

import React, { useState, useRef, useEffect } from 'react';
import { MealCardProposal, PreSwipeContext } from '@/types/nutrition';
import {
  Heart,
  X,
  Clock,
  Flame,
  Dumbbell,
  Tag,
  Eye,
  Sparkles,
  RotateCcw,
  Layers,
  ArrowRight,
} from 'lucide-react';

interface SwipeDeckProps {
  initialRecipes: MealCardProposal[];
  context: PreSwipeContext;
  onShortlistRecipe: (recipe: MealCardProposal) => void;
  onOpenDetails: (recipe: MealCardProposal) => void;
  onTriggerShowdown: () => void;
  shortlistedMeals: MealCardProposal[];
  onBackToConfig: () => void;
}

export function SwipeDeck({
  initialRecipes,
  context,
  onShortlistRecipe,
  onOpenDetails,
  onTriggerShowdown,
  shortlistedMeals,
  onBackToConfig,
}: SwipeDeckProps) {
  const [deck, setDeck] = useState<MealCardProposal[]>(initialRecipes);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const activeCard = deck[0];
  const nextCard = deck[1];

  // Drag physics threshold
  const SWIPE_THRESHOLD = 85;

  const handleTouchStart = (e: React.TouchEvent | React.MouseEvent) => {
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    setIsDragging(true);
    setDragStart({ x: clientX, y: clientY });
  };

  const handleTouchMove = (e: React.TouchEvent | React.MouseEvent) => {
    if (!isDragging) return;
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    setDragOffset({
      x: clientX - dragStart.x,
      y: clientY - dragStart.y,
    });
  };

  const handleTouchEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);

    if (dragOffset.x > SWIPE_THRESHOLD) {
      // Swiped Right -> Shortlist
      handleSwipeRight();
    } else if (dragOffset.x < -SWIPE_THRESHOLD) {
      // Swiped Left -> Skip
      handleSwipeLeft();
    }

    setDragOffset({ x: 0, y: 0 });
  };

  const handleSwipeRight = () => {
    if (!activeCard) return;
    onShortlistRecipe(activeCard);
    setDeck((prev) => prev.slice(1));
  };

  const handleSwipeLeft = () => {
    if (!activeCard) return;
    setDeck((prev) => prev.slice(1));
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') handleSwipeRight();
      if (e.key === 'ArrowLeft') handleSwipeLeft();
      if (e.key === 'ArrowUp' && activeCard) onOpenDetails(activeCard);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeCard]);

  // Compute rotation angle & opacity based on drag
  const rotateDeg = dragOffset.x * 0.08;
  const likeOpacity = Math.min(1, Math.max(0, dragOffset.x / 70));
  const skipOpacity = Math.min(1, Math.max(0, -dragOffset.x / 70));

  return (
    <div className="swipe-screen animate-fade-in">
      {/* Top Header & Shortlist Counter */}
      <div className="swipe-top-bar">
        <button type="button" className="btn-filter-back" onClick={onBackToConfig}>
          <RotateCcw size={15} />
          <span>Filtre</span>
        </button>

        <div className="shortlist-status-pill">
          <Layers size={14} className="icon-layers" />
          <span>Shortlist: <strong className="tabular-num">{shortlistedMeals.length}/3</strong></span>
        </div>

        {shortlistedMeals.length >= 2 ? (
          <button type="button" className="btn-showdown-quick animate-fade-in" onClick={onTriggerShowdown}>
            <span>Showdown</span>
            <ArrowRight size={14} />
          </button>
        ) : (
          <div style={{ width: 60 }} />
        )}
      </div>

      {/* Card Deck Viewport */}
      <div className="deck-viewport">
        {deck.length === 0 ? (
          <div className="empty-deck-card animate-fade-in">
            <div className="empty-icon-wrap">
              <Sparkles size={32} className="sparkle-gold" />
            </div>
            <h3 className="empty-title">Ai parcurs toate propunerile!</h3>
            <p className="empty-desc">
              {shortlistedMeals.length > 0
                ? `Ai ${shortlistedMeals.length} rețete în Shortlist gata de confruntare.`
                : 'Schimbă filtrele sau adaugă alte ingrediente pentru opțiuni noi.'}
            </p>

            {shortlistedMeals.length >= 2 ? (
              <button type="button" className="btn-cta-showdown" onClick={onTriggerShowdown}>
                <Sparkles size={18} />
                <span>Deschide Matchup Showdown ({shortlistedMeals.length})</span>
              </button>
            ) : (
              <button type="button" className="btn-cta-showdown" onClick={onBackToConfig}>
                <RotateCcw size={18} />
                <span>Reconfigurează Căutarea</span>
              </button>
            )}
          </div>
        ) : (
          <div className="cards-stack">
            {/* Background Preview Card */}
            {nextCard && (
              <div className="deck-card next-card">
                <div className="card-inner">
                  <div className="card-top-tags">
                    <span className="mode-badge">{nextCard.mode}</span>
                    <span className="time-badge">{nextCard.prepTimeMinutes + nextCard.cookTimeMinutes} min</span>
                  </div>
                  <h3 className="card-title">{nextCard.title}</h3>
                </div>
              </div>
            )}

            {/* Active Swipe Card */}
            {activeCard && (
              <div
                className="deck-card active-card"
                style={{
                  transform: isDragging
                    ? `translate3d(${dragOffset.x}px, ${dragOffset.y}px, 0) rotate(${rotateDeg}deg)`
                    : 'translate3d(0, 0, 0) rotate(0deg)',
                  transition: isDragging ? 'none' : 'transform 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
                  cursor: isDragging ? 'grabbing' : 'grab',
                }}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
                onMouseDown={handleTouchStart}
                onMouseMove={handleTouchMove}
                onMouseUp={handleTouchEnd}
                onMouseLeave={handleTouchEnd}
              >
                {/* Swipe Stamp Indicators */}
                <div className="stamp stamp-like" style={{ opacity: likeOpacity }}>
                  SHORTLIST ❤️
                </div>
                <div className="stamp stamp-skip" style={{ opacity: skipOpacity }}>
                  SKIP ❌
                </div>

                <div className="card-inner">
                  {/* Top Bar on Card */}
                  <div className="card-top-tags">
                    <span className="mode-badge">
                      {activeCard.mode === 'fridge' && '🧊 Din Frigider'}
                      {activeCard.mode === 'grocery_empty' && '🛒 Frigider Gol'}
                      {activeCard.mode === 'grocery_stock' && '🛒 Smart Grocery'}
                      {activeCard.mode === 'restaurant' && '🍽️ Restaurant'}
                    </span>
                    <div className="card-time-pill">
                      <Clock size={13} />
                      <span className="tabular-num">{activeCard.prepTimeMinutes + activeCard.cookTimeMinutes} min</span>
                    </div>
                  </div>

                  {/* Recipe Title */}
                  <h3 className="card-title">{activeCard.title}</h3>

                  {/* AI Match Reason Callout */}
                  <div className="match-reason-box">
                    <Sparkles size={14} className="reason-icon" />
                    <span>{activeCard.matchReason}</span>
                  </div>

                  {/* Macro Badges Grid */}
                  <div className="card-macros-grid">
                    <div className="macro-box box-cal">
                      <Flame size={14} className="icon-cal" />
                      <span className="macro-val tabular-num">{activeCard.calories}</span>
                      <span className="macro-lbl">kcal</span>
                    </div>
                    <div className="macro-box box-prot">
                      <Dumbbell size={14} className="icon-prot" />
                      <span className="macro-val tabular-num">{activeCard.protein}g</span>
                      <span className="macro-lbl">Proteine</span>
                    </div>
                    <div className="macro-box box-carb">
                      <span className="macro-val tabular-num">{activeCard.carbs}g</span>
                      <span className="macro-lbl">Carbo</span>
                    </div>
                    <div className="macro-box box-fat">
                      <span className="macro-val tabular-num">{activeCard.fat}g</span>
                      <span className="macro-lbl">Grăsimi</span>
                    </div>
                  </div>

                  {/* Ingredients Preview */}
                  <div className="card-ingredients-preview">
                    <span className="ingr-head">Ingrediente Cheie ({activeCard.ingredients.length}):</span>
                    <div className="ingr-tags-wrap">
                      {activeCard.ingredients.slice(0, 4).map((ing, idx) => (
                        <span key={idx} className={`ingr-tag ${ing.toBuy ? 'to-buy-tag' : ''}`}>
                          {ing.name} ({ing.amount})
                        </span>
                      ))}
                      {activeCard.ingredients.length > 4 && (
                        <span className="ingr-more">+{activeCard.ingredients.length - 4} altele</span>
                      )}
                    </div>
                  </div>

                  {/* Cost & Appliances Footnote */}
                  <div className="card-footer-meta">
                    {activeCard.estimatedCostRon && (
                      <span className="cost-tag tabular-num">
                        Cost estimat: ~{activeCard.estimatedCostRon} RON
                      </span>
                    )}
                    {activeCard.appliancesUsed.length > 0 && (
                      <span className="app-tag">{activeCard.appliancesUsed.join(', ')}</span>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Thumb-Zone Control Bar */}
      {activeCard && (
        <div className="swipe-controls">
          <button
            type="button"
            className="btn-ctrl btn-dislike"
            onClick={handleSwipeLeft}
            aria-label="Skip Rețetă"
          >
            <X size={26} />
          </button>

          <button
            type="button"
            className="btn-ctrl btn-info"
            onClick={() => onOpenDetails(activeCard)}
            aria-label="Vezi Rețeta Pas cu Pas"
          >
            <Eye size={22} />
          </button>

          <button
            type="button"
            className="btn-ctrl btn-like"
            onClick={handleSwipeRight}
            aria-label="Adaugă în Shortlist"
          >
            <Heart size={26} fill="#10b981" />
          </button>
        </div>
      )}

      <style jsx>{`
        .swipe-screen {
          display: flex;
          flex-direction: column;
          height: calc(100vh - var(--bottom-bar-height) - 30px);
          overflow: hidden;
        }

        .swipe-top-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 8px 12px;
          margin-bottom: 8px;
        }

        .btn-filter-back {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 6px 12px;
          background: var(--bg-card);
          border: 1px solid var(--border-medium);
          border-radius: var(--radius-full);
          font-size: 0.75rem;
          font-weight: 700;
          color: var(--text-secondary);
        }

        .shortlist-status-pill {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 6px 14px;
          background: rgba(99, 102, 241, 0.12);
          border: 1px solid rgba(99, 102, 241, 0.3);
          border-radius: var(--radius-full);
          font-size: 0.76rem;
          font-weight: 700;
          color: #a5b4fc;
        }

        :global(.icon-layers) {
          color: var(--accent-primary);
        }

        .btn-showdown-quick {
          display: flex;
          align-items: center;
          gap: 4px;
          padding: 6px 12px;
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
          color: #ffffff;
          border-radius: var(--radius-full);
          font-size: 0.75rem;
          font-weight: 800;
          box-shadow: 0 0 12px rgba(16, 185, 129, 0.4);
        }

        .deck-viewport {
          flex: 1;
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 4px 10px;
        }

        .cards-stack {
          position: relative;
          width: 100%;
          height: 100%;
          max-height: 480px;
        }

        .deck-card {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          border-radius: var(--radius-xl);
          background: linear-gradient(160deg, #192338 0%, #101726 100%);
          border: 1px solid var(--border-medium);
          box-shadow: var(--shadow-lg);
          user-select: none;
          touch-action: none;
          overflow: hidden;
        }

        .next-card {
          transform: scale(0.94) translateY(12px);
          opacity: 0.6;
          pointer-events: none;
          z-index: 1;
        }

        .active-card {
          z-index: 2;
          will-change: transform;
        }

        .stamp {
          position: absolute;
          top: 24px;
          padding: 6px 14px;
          border-radius: var(--radius-sm);
          font-size: 1.1rem;
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
          transform: rotate(15deg);
        }

        .stamp-skip {
          left: 20px;
          color: var(--status-error);
          border-color: var(--status-error);
          transform: rotate(-15deg);
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
          margin-bottom: 10px;
        }

        .mode-badge {
          font-size: 0.7rem;
          font-weight: 800;
          padding: 3px 10px;
          border-radius: var(--radius-full);
          background: rgba(255, 255, 255, 0.08);
          color: var(--text-primary);
          border: 1px solid var(--border-subtle);
        }

        .card-time-pill {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 0.75rem;
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
          margin-bottom: 14px;
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
          margin-bottom: 14px;
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
        .macro-lbl { font-size: 0.62rem; font-weight: 700; text-transform: uppercase; }

        .card-ingredients-preview {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 6px;
          margin-bottom: 10px;
        }

        .ingr-head {
          font-size: 0.72rem;
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
          gap: 20px;
          padding: 8px 0;
        }

        .btn-ctrl {
          width: 58px;
          height: 58px;
          border-radius: var(--radius-full);
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all var(--duration-fast) var(--ease-out-smooth);
          box-shadow: 0 4px 14px rgba(0, 0, 0, 0.5);
        }

        .btn-ctrl:hover {
          transform: scale(1.1);
        }

        .btn-dislike {
          background: rgba(239, 68, 68, 0.15);
          color: #ef4444;
          border: 1px solid rgba(239, 68, 68, 0.4);
        }

        .btn-info {
          width: 48px;
          height: 48px;
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
          padding: 30px 20px;
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
