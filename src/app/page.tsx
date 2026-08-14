'use client';

import React, { useState, useEffect } from 'react';
import {
  UserProfile,
  LoggedMeal,
  AdaptiveFavorite,
  MealCardProposal,
  PreSwipeContext,
  MealCategory,
} from '@/types/nutrition';
import { BottomNavigation, NavTab } from '@/components/layout/BottomNavigation';
import { OnboardingWizard } from '@/components/onboarding/OnboardingWizard';
import { MacroRings } from '@/components/dashboard/MacroRings';
import { DailyJournal } from '@/components/dashboard/DailyJournal';
import { PreSwipeModal } from '@/components/swipe/PreSwipeModal';
import { SwipeDeck } from '@/components/swipe/SwipeDeck';
import { MatchupShowdown } from '@/components/swipe/MatchupShowdown';
import { RecipeBottomSheet } from '@/components/swipe/RecipeBottomSheet';
import { QuickLogModal } from '@/components/dashboard/QuickLogModal';
import { AdaptiveFavorites } from '@/components/favorites/AdaptiveFavoritesModal';
import { ProfileScreen } from '@/components/profile/ProfileScreen';
import { filterOrGenerateRecipes } from '@/lib/mockRecipes';
import { Sparkles, Plus, Flame, Sparkle } from 'lucide-react';

const DEFAULT_PROFILE: UserProfile = {
  name: 'Alex',
  gender: 'male',
  age: 24,
  heightCm: 180,
  weightKg: 82,
  activityLevel: 'moderate',
  goal: 'cut',
  calorieTarget: 2100,
  proteinTarget: 165,
  carbsTarget: 200,
  fatTarget: 65,
  appliances: [
    'Airfryer / Friteuză cu aer cald',
    'Aragaz / Plită / Tigaie',
  ],
  dietaryRestrictions: [],
  hasCompletedOnboarding: false,
};

export default function Home() {
  const [profile, setProfile] = useState<UserProfile>(DEFAULT_PROFILE);
  const [isLoaded, setIsLoaded] = useState(false);
  const [currentTab, setCurrentTab] = useState<NavTab>('dashboard');

  // Meals Logged Today
  const [meals, setMeals] = useState<LoggedMeal[]>([
    {
      id: 'init-breakfast-1',
      timestamp: new Date().toISOString(),
      category: 'breakfast',
      title: 'Omletă din 3 ouă cu spanac & 1 felie pâine secară',
      calories: 380,
      protein: 28,
      carbs: 22,
      fat: 20,
      servings: 1,
      source: 'manual',
    },
  ]);

  // Adaptive Favorites (Shortlist runners-up)
  const [adaptiveFavorites, setAdaptiveFavorites] = useState<AdaptiveFavorite[]>([]);

  // Swipe Deck State
  const [isPreSwipeModalOpen, setIsPreSwipeModalOpen] = useState(false);
  const [preSwipeCategory, setPreSwipeCategory] = useState<MealCategory>('lunch');
  const [activeDeckContext, setActiveDeckContext] = useState<PreSwipeContext | null>(null);
  const [deckRecipes, setDeckRecipes] = useState<MealCardProposal[]>([]);
  const [shortlistedMeals, setShortlistedMeals] = useState<MealCardProposal[]>([]);
  const [isShowdownActive, setIsShowdownActive] = useState(false);

  // Modals & Sheets
  const [detailRecipe, setDetailRecipe] = useState<MealCardProposal | null>(null);
  const [isQuickLogOpen, setIsQuickLogOpen] = useState(false);
  const [quickLogCategory, setQuickLogCategory] = useState<MealCategory>('snack');

  // Load from localStorage on client mount
  useEffect(() => {
    try {
      const savedProfile = localStorage.getItem('nutri_user_profile');
      if (savedProfile) {
        setProfile(JSON.parse(savedProfile));
      }
      const savedMeals = localStorage.getItem('nutri_daily_meals');
      if (savedMeals) {
        setMeals(JSON.parse(savedMeals));
      }
      const savedFavs = localStorage.getItem('nutri_adaptive_favs');
      if (savedFavs) {
        setAdaptiveFavorites(JSON.parse(savedFavs));
      }
    } catch (e) {
      console.warn('Could not read from localStorage', e);
    }
    setIsLoaded(true);
  }, []);

  // Save to localStorage
  const saveProfile = (newProfile: UserProfile) => {
    setProfile(newProfile);
    localStorage.setItem('nutri_user_profile', JSON.stringify(newProfile));
  };

  const saveMeals = (newMeals: LoggedMeal[]) => {
    setMeals(newMeals);
    localStorage.setItem('nutri_daily_meals', JSON.stringify(newMeals));
  };

  const saveAdaptiveFavorites = (newFavs: AdaptiveFavorite[]) => {
    setAdaptiveFavorites(newFavs);
    localStorage.setItem('nutri_adaptive_favs', JSON.stringify(newFavs));
  };

  // Macro calculations
  const consumedCalories = meals.reduce((sum, m) => sum + m.calories, 0);
  const consumedProtein = meals.reduce((sum, m) => sum + m.protein, 0);
  const consumedCarbs = meals.reduce((sum, m) => sum + m.carbs, 0);
  const consumedFat = meals.reduce((sum, m) => sum + m.fat, 0);

  const remainingCalories = Math.max(0, profile.calorieTarget - consumedCalories);
  const remainingProtein = Math.max(0, profile.proteinTarget - consumedProtein);
  const remainingCarbs = Math.max(0, profile.carbsTarget - consumedCarbs);
  const remainingFat = Math.max(0, profile.fatTarget - consumedFat);

  // Launch Swipe with Context
  const handleLaunchSwipe = async (context: PreSwipeContext) => {
    setActiveDeckContext(context);
    setIsPreSwipeModalOpen(false);
    setShortlistedMeals([]);
    setIsShowdownActive(false);

    try {
      const res = await fetch('/api/ai/generate-deck', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(context),
      });
      const data = await res.json();
      if (data.success && data.recipes && data.recipes.length > 0) {
        setDeckRecipes(data.recipes);
      } else {
        setDeckRecipes(filterOrGenerateRecipes(context));
      }
    } catch (err) {
      console.error('Deck fetch error:', err);
      setDeckRecipes(filterOrGenerateRecipes(context));
    }

    setCurrentTab('swipe');
  };

  // Shortlist Recipe from Swipe
  const handleShortlistRecipe = (recipe: MealCardProposal) => {
    const updated = [...shortlistedMeals, recipe];
    setShortlistedMeals(updated);

    // Auto-trigger showdown when 2 or 3 favorites are picked
    if (updated.length >= 2) {
      setIsShowdownActive(true);
    }
  };

  // Winner Selected from Showdown
  const handleSelectWinner = (winner: MealCardProposal, runnerUps: MealCardProposal[]) => {
    // 1. Log winner into Daily Meals
    const newMeal: LoggedMeal = {
      id: `meal-${Date.now()}`,
      timestamp: new Date().toISOString(),
      category: activeDeckContext?.mealCategory || 'lunch',
      title: winner.title,
      calories: winner.calories,
      protein: winner.protein,
      carbs: winner.carbs,
      fat: winner.fat,
      servings: winner.servings || 1,
      recipeId: winner.id,
      source: 'swipe',
    };
    saveMeals([...meals, newMeal]);

    // 2. Save runner-ups into Adaptive Favorites
    if (runnerUps.length > 0) {
      const newFavEntries: AdaptiveFavorite[] = runnerUps.map((r) => ({
        id: `fav-${Date.now()}-${r.id}`,
        recipe: r,
        savedAt: new Date().toISOString(),
        timesSuggested: 1,
        timesSelected: 0,
      }));
      saveAdaptiveFavorites([...adaptiveFavorites, ...newFavEntries]);
    }

    // 3. Reset Swipe State & Open Recipe Bottom Sheet for instant cooking!
    setIsShowdownActive(false);
    setShortlistedMeals([]);
    setDeckRecipes([]);
    setDetailRecipe(winner);
    setCurrentTab('dashboard');
  };

  // Log Meal manually from Recipe Bottom Sheet
  const handleCookAndLogFromSheet = (recipe: MealCardProposal) => {
    const newMeal: LoggedMeal = {
      id: `meal-${Date.now()}`,
      timestamp: new Date().toISOString(),
      category: activeDeckContext?.mealCategory || 'dinner',
      title: recipe.title,
      calories: recipe.calories,
      protein: recipe.protein,
      carbs: recipe.carbs,
      fat: recipe.fat,
      servings: recipe.servings || 1,
      recipeId: recipe.id,
      source: 'swipe',
    };
    saveMeals([...meals, newMeal]);
    setDetailRecipe(null);
  };

  // Add Quick Log Meal
  const handleAddQuickLogMeal = (mealData: Omit<LoggedMeal, 'id' | 'timestamp'>) => {
    const newMeal: LoggedMeal = {
      ...mealData,
      id: `meal-quick-${Date.now()}`,
      timestamp: new Date().toISOString(),
    };
    saveMeals([...meals, newMeal]);
  };

  // Delete Meal
  const handleDeleteMeal = (mealId: string) => {
    saveMeals(meals.filter((m) => m.id !== mealId));
  };

  if (!isLoaded) return null;

  // If user hasn't finished onboarding, show Wizard
  if (!profile.hasCompletedOnboarding) {
    return (
      <OnboardingWizard
        onComplete={(newProfile) => {
          saveProfile(newProfile);
        }}
      />
    );
  }

  return (
    <>
      <main className="screen-content">
        {/* TAB 1: DASHBOARD */}
        {currentTab === 'dashboard' && (
          <div className="dashboard-view animate-fade-in">
            {/* Top Bar */}
            <div className="top-header">
              <div className="user-greeting">
                <span className="greeting-label">BUN VENIT,</span>
                <h1 className="greeting-name">{profile.name} 👋</h1>
              </div>

              <button
                type="button"
                className="btn-quick-swipe-header"
                onClick={() => {
                  setPreSwipeCategory('dinner');
                  setIsPreSwipeModalOpen(true);
                }}
              >
                <Sparkles size={16} />
                <span>Swipe Meal</span>
              </button>
            </div>

            {/* Macro Circular & Bar Gauge */}
            <MacroRings
              calorieTarget={profile.calorieTarget}
              consumedCalories={consumedCalories}
              proteinTarget={profile.proteinTarget}
              consumedProtein={consumedProtein}
              carbsTarget={profile.carbsTarget}
              consumedCarbs={consumedCarbs}
              fatTarget={profile.fatTarget}
              consumedFat={consumedFat}
            />

            {/* Swipe Callout Promo */}
            <div
              className="swipe-promo-banner"
              onClick={() => {
                setPreSwipeCategory('lunch');
                setIsPreSwipeModalOpen(true);
              }}
            >
              <div className="promo-left">
                <div className="promo-icon-wrap">
                  <Sparkles size={20} className="sparkle-gold" />
                </div>
                <div>
                  <h4 className="promo-title">Nu știi ce să mănânci?</h4>
                  <span className="promo-sub">Gătește din frigider sau cu buget fix</span>
                </div>
              </div>
              <span className="promo-cta">Swipe ➔</span>
            </div>

            {/* Daily Meals Journal */}
            <DailyJournal
              meals={meals}
              onDeleteMeal={handleDeleteMeal}
              onOpenSwipeForCategory={(cat) => {
                setPreSwipeCategory(cat);
                setIsPreSwipeModalOpen(true);
              }}
              onOpenQuickLogForCategory={(cat) => {
                setQuickLogCategory(cat);
                setIsQuickLogOpen(true);
              }}
            />
          </div>
        )}

        {/* TAB 2: SWIPE DECK */}
        {currentTab === 'swipe' && (
          <div className="swipe-tab-view animate-fade-in">
            {isShowdownActive ? (
              <MatchupShowdown
                shortlistedMeals={shortlistedMeals}
                onSelectWinner={handleSelectWinner}
                onOpenDetails={(rec) => setDetailRecipe(rec)}
                onCancel={() => setIsShowdownActive(false)}
              />
            ) : deckRecipes.length > 0 && activeDeckContext ? (
              <SwipeDeck
                initialRecipes={deckRecipes}
                context={activeDeckContext}
                onShortlistRecipe={handleShortlistRecipe}
                onOpenDetails={(rec) => setDetailRecipe(rec)}
                onTriggerShowdown={() => setIsShowdownActive(true)}
                shortlistedMeals={shortlistedMeals}
                onBackToConfig={() => setIsPreSwipeModalOpen(true)}
              />
            ) : (
              <div className="swipe-idle-screen animate-fade-in">
                <div className="idle-hero-icon">
                  <Sparkles size={36} className="sparkle-gold" />
                </div>
                <h2 className="idle-title">The Swipe Machine</h2>
                <p className="idle-desc">
                  Alege dacă vrei să gătești cu ce ai în frigider, dacă frigiderul e gol și vrei rețete într-un buget sau dacă mănânci în oraș.
                </p>
                <button
                  type="button"
                  className="btn-start-swipe"
                  onClick={() => setIsPreSwipeModalOpen(true)}
                >
                  <Sparkles size={18} />
                  <span>Configurează & Deschide Deck-ul</span>
                </button>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: QUICK LOG */}
        {currentTab === 'quick_log' && (
          <div className="quick-log-tab-view animate-fade-in">
            <QuickLogModal
              isOpen={true}
              onClose={() => setCurrentTab('dashboard')}
              onLogMeal={(m) => {
                handleAddQuickLogMeal(m);
                setCurrentTab('dashboard');
              }}
              defaultCategory="snack"
            />
          </div>
        )}

        {/* TAB 4: ADAPTIVE FAVORITES */}
        {currentTab === 'favorites' && (
          <AdaptiveFavorites
            favorites={adaptiveFavorites}
            onCookRecipe={(rec) => {
              handleCookAndLogFromSheet(rec);
              setCurrentTab('dashboard');
            }}
            onOpenDetails={(rec) => setDetailRecipe(rec)}
          />
        )}

        {/* TAB 5: PROFILE */}
        {currentTab === 'profile' && (
          <ProfileScreen
            profile={profile}
            onUpdateProfile={saveProfile}
            onResetOnboarding={() => {
              saveProfile({ ...profile, hasCompletedOnboarding: false });
            }}
          />
        )}
      </main>

      {/* Floating Modals */}
      <PreSwipeModal
        isOpen={isPreSwipeModalOpen}
        onClose={() => setIsPreSwipeModalOpen(false)}
        onLaunchSwipe={handleLaunchSwipe}
        defaultCategory={preSwipeCategory}
        remainingCalories={remainingCalories}
        remainingProtein={remainingProtein}
        remainingCarbs={remainingCarbs}
        remainingFat={remainingFat}
        userAppliances={profile.appliances}
      />

      <RecipeBottomSheet
        recipe={detailRecipe}
        isOpen={!!detailRecipe}
        onClose={() => setDetailRecipe(null)}
        onCookAndLog={handleCookAndLogFromSheet}
      />

      {isQuickLogOpen && (
        <QuickLogModal
          isOpen={isQuickLogOpen}
          onClose={() => setIsQuickLogOpen(false)}
          onLogMeal={handleAddQuickLogMeal}
          defaultCategory={quickLogCategory}
        />
      )}

      {/* Persistent Bottom Bar */}
      <BottomNavigation
        currentTab={currentTab}
        onTabChange={(tab) => setCurrentTab(tab)}
        shortlistCount={shortlistedMeals.length}
      />

      <style jsx>{`
        .dashboard-view, .swipe-tab-view, .quick-log-tab-view {
          display: flex;
          flex-direction: column;
        }

        .top-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 16px;
        }

        .user-greeting {
          display: flex;
          flex-direction: column;
        }

        .greeting-label {
          font-size: 0.65rem;
          font-weight: 800;
          letter-spacing: 0.06em;
          color: var(--text-tertiary);
          text-transform: uppercase;
        }

        .greeting-name {
          font-size: 1.35rem;
          font-weight: 800;
          color: var(--text-primary);
          letter-spacing: -0.02em;
        }

        .btn-quick-swipe-header {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 8px 14px;
          background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
          color: #07090e;
          border-radius: var(--radius-full);
          font-size: 0.78rem;
          font-weight: 800;
          box-shadow: 0 4px 14px rgba(245, 158, 11, 0.35);
          transition: transform var(--duration-fast);
        }

        .btn-quick-swipe-header:hover {
          transform: translateY(-1px);
        }

        .swipe-promo-banner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 14px 16px;
          background: linear-gradient(145deg, #19253d 0%, #101828 100%);
          border: 1px solid rgba(245, 158, 11, 0.3);
          border-radius: var(--radius-lg);
          margin-bottom: 20px;
          cursor: pointer;
          transition: all var(--duration-fast);
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.35);
        }

        .swipe-promo-banner:hover {
          border-color: var(--macro-calories);
          transform: translateY(-1px);
        }

        .promo-left {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .promo-icon-wrap {
          width: 38px;
          height: 38px;
          border-radius: var(--radius-full);
          background: rgba(245, 158, 11, 0.15);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        :global(.sparkle-gold) {
          color: var(--macro-calories);
        }

        .promo-title {
          font-size: 0.92rem;
          font-weight: 800;
          color: var(--text-primary);
        }

        .promo-sub {
          font-size: 0.72rem;
          color: var(--text-secondary);
        }

        .promo-cta {
          font-size: 0.8rem;
          font-weight: 800;
          color: var(--macro-calories);
        }

        .swipe-idle-screen {
          padding: 40px 20px;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 14px;
        }

        .idle-hero-icon {
          width: 72px;
          height: 72px;
          border-radius: var(--radius-full);
          background: rgba(245, 158, 11, 0.12);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .idle-title {
          font-size: 1.4rem;
          font-weight: 900;
          color: var(--text-primary);
          letter-spacing: -0.02em;
        }

        .idle-desc {
          font-size: 0.85rem;
          color: var(--text-secondary);
          line-height: 1.5;
          max-width: 320px;
          margin-bottom: 10px;
        }

        .btn-start-swipe {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 14px 22px;
          background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
          color: #07090e;
          border-radius: var(--radius-md);
          font-size: 0.95rem;
          font-weight: 800;
          box-shadow: 0 4px 20px rgba(245, 158, 11, 0.45);
          transition: transform var(--duration-fast);
        }

        .btn-start-swipe:hover {
          transform: translateY(-1px);
        }
      `}</style>
    </>
  );
}
