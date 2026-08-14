'use client';

import React from 'react';
import { Flame, Sparkles, PlusCircle, Bookmark, User } from 'lucide-react';

export type NavTab = 'dashboard' | 'swipe' | 'quick_log' | 'favorites' | 'profile';

interface BottomNavigationProps {
  currentTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  shortlistCount?: number;
}

export function BottomNavigation({ currentTab, onTabChange, shortlistCount = 0 }: BottomNavigationProps) {
  return (
    <nav className="bottom-nav-container">
      <div className="bottom-nav-glass">
        <button
          type="button"
          onClick={() => onTabChange('dashboard')}
          className={`nav-item ${currentTab === 'dashboard' ? 'active' : ''}`}
          aria-label="Dashboard Nutriție"
        >
          <Flame size={22} className="nav-icon" />
          <span className="nav-label">Jurnal</span>
        </button>

        <button
          type="button"
          onClick={() => onTabChange('swipe')}
          className={`nav-item nav-item-highlight ${currentTab === 'swipe' ? 'active' : ''}`}
          aria-label="Swipe Mese"
        >
          <div className="swipe-badge-wrap">
            <Sparkles size={24} className="nav-icon-highlight" />
            {shortlistCount > 0 && <span className="shortlist-pill">{shortlistCount}</span>}
          </div>
          <span className="nav-label">Swipe Meal</span>
        </button>

        <button
          type="button"
          onClick={() => onTabChange('quick_log')}
          className={`nav-item ${currentTab === 'quick_log' ? 'active' : ''}`}
          aria-label="Quick AI Log"
        >
          <PlusCircle size={22} className="nav-icon" />
          <span className="nav-label">+ Quick Log</span>
        </button>

        <button
          type="button"
          onClick={() => onTabChange('favorites')}
          className={`nav-item ${currentTab === 'favorites' ? 'active' : ''}`}
          aria-label="Rețete Favorite"
        >
          <Bookmark size={22} className="nav-icon" />
          <span className="nav-label">Favorite</span>
        </button>

        <button
          type="button"
          onClick={() => onTabChange('profile')}
          className={`nav-item ${currentTab === 'profile' ? 'active' : ''}`}
          aria-label="Profil & Ținte"
        >
          <User size={22} className="nav-icon" />
          <span className="nav-label">Profil</span>
        </button>
      </div>

      <style jsx>{`
        .bottom-nav-container {
          position: fixed;
          bottom: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 100%;
          max-width: var(--mobile-max-width);
          z-index: 50;
          padding: 0 12px var(--safe-bottom) 12px;
          pointer-events: none;
        }

        .bottom-nav-glass {
          pointer-events: auto;
          display: flex;
          align-items: center;
          justify-content: space-around;
          background: rgba(15, 23, 42, 0.92);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border: 1px solid var(--border-medium);
          border-radius: var(--radius-xl);
          padding: 8px 6px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.7);
        }

        .nav-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 4px;
          padding: 6px 10px;
          border-radius: var(--radius-md);
          color: var(--text-tertiary);
          transition: all var(--duration-fast) var(--ease-out-smooth);
          min-width: 58px;
        }

        .nav-item:hover {
          color: var(--text-secondary);
        }

        .nav-item.active {
          color: var(--text-primary);
        }

        .nav-item.active :global(.nav-icon) {
          color: var(--accent-primary);
          transform: scale(1.08);
        }

        .nav-item-highlight {
          color: var(--text-secondary);
        }

        .swipe-badge-wrap {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .nav-icon-highlight {
          color: var(--macro-calories);
          filter: drop-shadow(0 0 8px rgba(245, 158, 11, 0.4));
        }

        .nav-item-highlight.active .nav-icon-highlight {
          transform: scale(1.15);
          color: #fbbf24;
        }

        .shortlist-pill {
          position: absolute;
          top: -6px;
          right: -8px;
          background: var(--macro-protein);
          color: #061e14;
          font-size: 0.65rem;
          font-weight: 800;
          padding: 1px 5px;
          border-radius: var(--radius-full);
          border: 1px solid var(--bg-surface);
        }

        .nav-label {
          font-size: 0.7rem;
          font-weight: 600;
          letter-spacing: 0.01em;
        }
      `}</style>
    </nav>
  );
}
