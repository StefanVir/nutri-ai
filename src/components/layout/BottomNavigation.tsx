'use client';

import React from 'react';
import { Home, Sparkles, Camera, Bookmark, User } from 'lucide-react';

export type NavTab = 'dashboard' | 'swipe' | 'quick_log' | 'favorites' | 'profile';

interface BottomNavigationProps {
  currentTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  shortlistCount?: number;
}

export function BottomNavigation({ currentTab, onTabChange, shortlistCount = 0 }: BottomNavigationProps) {
  return (
    <nav className="floating-dock-wrap">
      <div className="floating-dock-glass">
        {/* Tab 1: Dashboard */}
        <button
          type="button"
          className={`dock-btn ${currentTab === 'dashboard' ? 'active' : ''}`}
          onClick={() => onTabChange('dashboard')}
          aria-label="Dashboard"
        >
          <Home size={20} />
          <span className="dock-label">Acasă</span>
        </button>

        {/* Tab 2: Swipe */}
        <button
          type="button"
          className={`dock-btn ${currentTab === 'swipe' ? 'active' : ''}`}
          onClick={() => onTabChange('swipe')}
          aria-label="Swipe Deck"
        >
          <div className="icon-with-badge">
            <Sparkles size={20} className="sparkle-accent" />
            {shortlistCount > 0 && (
              <span className="dock-badge tabular-num">{shortlistCount}</span>
            )}
          </div>
          <span className="dock-label">Swipe</span>
        </button>

        {/* CENTER ACTION BUTTON: Scan / Log (Elevated FAB) */}
        <button
          type="button"
          className="dock-fab-center"
          onClick={() => onTabChange('quick_log')}
          aria-label="Scanează mâncarea cu AI Vision"
        >
          <div className="fab-circle-glow">
            <Camera size={22} className="fab-icon" />
          </div>
          <span className="fab-sub-label">Scan AI</span>
        </button>

        {/* Tab 4: Favorites */}
        <button
          type="button"
          className={`dock-btn ${currentTab === 'favorites' ? 'active' : ''}`}
          onClick={() => onTabChange('favorites')}
          aria-label="Adaptive Favorites"
        >
          <Bookmark size={20} />
          <span className="dock-label">Favorite</span>
        </button>

        {/* Tab 5: Profile */}
        <button
          type="button"
          className={`dock-btn ${currentTab === 'profile' ? 'active' : ''}`}
          onClick={() => onTabChange('profile')}
          aria-label="Profil"
        >
          <User size={20} />
          <span className="dock-label">Profil</span>
        </button>
      </div>
    </nav>
  );
}
