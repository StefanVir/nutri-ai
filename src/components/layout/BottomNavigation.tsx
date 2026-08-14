'use client';

import React from 'react';
import { Home, Sparkles, PlusCircle, Bookmark, User } from 'lucide-react';

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
          className={`nav-item ${currentTab === 'dashboard' ? 'active' : ''}`}
          onClick={() => onTabChange('dashboard')}
          aria-label="Dashboard"
        >
          <div className="icon-box">
            <Home size={20} />
          </div>
          <span className="nav-label">Acasă</span>
        </button>

        <button
          type="button"
          className={`nav-item ${currentTab === 'swipe' ? 'active' : ''}`}
          onClick={() => onTabChange('swipe')}
          aria-label="Swipe Deck"
        >
          <div className="icon-box">
            <Sparkles size={20} className="swipe-sparkle-icon" />
            {shortlistCount > 0 && (
              <span className="badge-bubble tabular-num">{shortlistCount}</span>
            )}
          </div>
          <span className="nav-label">Swipe</span>
        </button>

        <button
          type="button"
          className={`nav-item ${currentTab === 'quick_log' ? 'active' : ''}`}
          onClick={() => onTabChange('quick_log')}
          aria-label="Quick Food Log"
        >
          <div className="icon-box plus-box">
            <PlusCircle size={22} />
          </div>
          <span className="nav-label">Log AI</span>
        </button>

        <button
          type="button"
          className={`nav-item ${currentTab === 'favorites' ? 'active' : ''}`}
          onClick={() => onTabChange('favorites')}
          aria-label="Adaptive Favorites"
        >
          <div className="icon-box">
            <Bookmark size={20} />
          </div>
          <span className="nav-label">Favorite</span>
        </button>

        <button
          type="button"
          className={`nav-item ${currentTab === 'profile' ? 'active' : ''}`}
          onClick={() => onTabChange('profile')}
          aria-label="Profil"
        >
          <div className="icon-box">
            <User size={20} />
          </div>
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
          padding: 8px 12px var(--safe-bottom) 12px;
          z-index: 50;
          pointer-events: none;
        }

        .bottom-nav-glass {
          pointer-events: auto;
          display: flex;
          align-items: center;
          justify-content: space-around;
          background: rgba(12, 16, 26, 0.88);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border: 1px solid var(--border-medium);
          border-radius: var(--radius-full);
          padding: 6px 4px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.65), 0 0 0 1px rgba(255, 255, 255, 0.05);
        }

        .nav-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 3px;
          padding: 6px 12px;
          border-radius: var(--radius-full);
          color: var(--text-tertiary);
          transition: all var(--duration-fast) var(--ease-out-smooth);
        }

        .nav-item:hover {
          color: var(--text-secondary);
        }

        .nav-item.active {
          color: var(--macro-calories);
        }

        .icon-box {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 28px;
          height: 28px;
        }

        .plus-box {
          color: var(--accent-primary);
        }

        .nav-item.active .plus-box {
          color: var(--macro-calories);
        }

        .badge-bubble {
          position: absolute;
          top: -3px;
          right: -6px;
          background: var(--macro-protein);
          color: #061e14;
          font-size: 0.65rem;
          font-weight: 800;
          width: 16px;
          height: 16px;
          border-radius: var(--radius-full);
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 2px 6px rgba(16, 185, 129, 0.5);
        }

        .nav-label {
          font-size: 0.68rem;
          font-weight: 700;
          letter-spacing: 0.01em;
        }
      `}</style>
    </nav>
  );
}
