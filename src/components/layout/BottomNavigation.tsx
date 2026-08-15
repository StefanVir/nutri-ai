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
          aria-label="Jurnal"
        >
          <Home size={19} />
          <span className="dock-label">Jurnal</span>
        </button>

        {/* Tab 2: Recipes */}
        <button
          type="button"
          className={`dock-btn ${currentTab === 'swipe' ? 'active' : ''}`}
          onClick={() => onTabChange('swipe')}
          aria-label="Rețete"
        >
          <div className="icon-with-badge">
            <Sparkles size={19} />
            {shortlistCount > 0 && (
              <span className="dock-badge tabular-num">{shortlistCount}</span>
            )}
          </div>
          <span className="dock-label">Rețete</span>
        </button>

        {/* CENTER ACTION BUTTON: Scan / Log */}
        <button
          type="button"
          className="dock-fab-center"
          onClick={() => onTabChange('quick_log')}
          aria-label="Scanare alimente"
        >
          <div className="fab-circle-glow">
            <Camera size={20} className="fab-icon" />
          </div>
          <span className="fab-sub-label">Scanare</span>
        </button>

        {/* Tab 4: Saved Recipes */}
        <button
          type="button"
          className={`dock-btn ${currentTab === 'favorites' ? 'active' : ''}`}
          onClick={() => onTabChange('favorites')}
          aria-label="Rețete salvate"
        >
          <Bookmark size={19} />
          <span className="dock-label">Salvate</span>
        </button>

        {/* Tab 5: Profile */}
        <button
          type="button"
          className={`dock-btn ${currentTab === 'profile' ? 'active' : ''}`}
          onClick={() => onTabChange('profile')}
          aria-label="Profil"
        >
          <User size={19} />
          <span className="dock-label">Profil</span>
        </button>
      </div>
    </nav>
  );
}
