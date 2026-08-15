'use client';

import React, { useState, useEffect } from 'react';
import { UserProfile, MealCardProposal, LoggedMeal, MealCategory, PreSwipeContext, GroceryItem } from '@/types/nutrition';
import { OnboardingWizard } from '@/components/onboarding/OnboardingWizard';
import { MacroRings } from '@/components/dashboard/MacroRings';
import { DailyJournal } from '@/components/dashboard/DailyJournal';
import { BottomNavigation, NavTab } from '@/components/layout/BottomNavigation';
import { SwipeDeck } from '@/components/swipe/SwipeDeck';
import { MatchupShowdown } from '@/components/swipe/MatchupShowdown';
import { PreSwipeModal } from '@/components/swipe/PreSwipeModal';
import { RecipeBottomSheet } from '@/components/swipe/RecipeBottomSheet';
import { QuickLogModal } from '@/components/dashboard/QuickLogModal';
import { ProfileScreen } from '@/components/profile/ProfileScreen';
import { AdaptiveFavoritesModal } from '@/components/favorites/AdaptiveFavoritesModal';
import { GroceryListModal } from '@/components/grocery/GroceryListModal';
import { filterOrGenerateRecipes } from '@/lib/mockRecipes';
import { classifyIngredient } from '@/lib/groceryClassifier';
import { Sparkles, ArrowRight, ShoppingCart } from 'lucide-react';

const LOCAL_STORAGE_KEY_PROFILE = 'nutri_ai_user_profile';
const LOCAL_STORAGE_KEY_MEALS = 'nutri_ai_logged_meals';
const LOCAL_STORAGE_KEY_FAVS = 'nutri_ai_adaptive_favs';
const LOCAL_STORAGE_KEY_GROCERY = 'nutri_ai_grocery_list';

export default function Home() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loggedMeals, setLoggedMeals] = useState<LoggedMeal[]>([]);
  const [adaptiveFavorites, setAdaptiveFavorites] = useState<MealCardProposal[]>([]);
  const [groceryItems, setGroceryItems] = useState<GroceryItem[]>([]);

  // Navigation State
  const [currentTab, setCurrentTab] = useState<NavTab>('dashboard');

  // Swipe & Matchup State
  const [deckRecipes, setDeckRecipes] = useState<MealCardProposal[]>([]);
  const [shortlistedMeals, setShortlistedMeals] = useState<MealCardProposal[]>([]);
  const [isShowdownActive, setIsShowdownActive] = useState(false);

  // Modals & Bottom Sheets
  const [isPreSwipeModalOpen, setIsPreSwipeModalOpen] = useState(false);
  const [isGeneratingDeck, setIsGeneratingDeck] = useState(false);
  const [preSwipeCategory, setPreSwipeCategory] = useState<MealCategory>('dinner');
  const [detailRecipe, setDetailRecipe] = useState<MealCardProposal | null>(null);
  const [isQuickLogOpen, setIsQuickLogOpen] = useState(false);
  const [isGroceryModalOpen, setIsGroceryModalOpen] = useState(false);

  // Hydrate from localStorage on client
  useEffect(() => {
    try {
      const storedProfile = localStorage.getItem(LOCAL_STORAGE_KEY_PROFILE);
      if (storedProfile) {
        setProfile(JSON.parse(storedProfile));
      }

      const storedMeals = localStorage.getItem(LOCAL_STORAGE_KEY_MEALS);
      if (storedMeals) {
        setLoggedMeals(JSON.parse(storedMeals));
      }

      const storedFavs = localStorage.getItem(LOCAL_STORAGE_KEY_FAVS);
      if (storedFavs) {
        setAdaptiveFavorites(JSON.parse(storedFavs));
      }

      const storedGrocery = localStorage.getItem(LOCAL_STORAGE_KEY_GROCERY);
      if (storedGrocery) {
        setGroceryItems(JSON.parse(storedGrocery));
      }
    } catch (e) {
      console.warn('Eroare la citirea din localStorage:', e);
    }
  }, []);

  const saveProfile = (newProfile: UserProfile) => {
    setProfile(newProfile);
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY_PROFILE, JSON.stringify(newProfile));
    } catch (e) {
      console.warn('Eroare la salvarea profilului:', e);
    }
  };

  const saveMeals = (meals: LoggedMeal[]) => {
    setLoggedMeals(meals);
    localStorage.setItem(LOCAL_STORAGE_KEY_MEALS, JSON.stringify(meals));
  };

  const saveFavorites = (favs: MealCardProposal[]) => {
    setAdaptiveFavorites(favs);
    localStorage.setItem(LOCAL_STORAGE_KEY_FAVS, JSON.stringify(favs));
  };

  const saveGroceryItems = (items: GroceryItem[]) => {
    setGroceryItems(items);
    localStorage.setItem(LOCAL_STORAGE_KEY_GROCERY, JSON.stringify(items));
  };


  // Macro Totals
  const consumedTotals = loggedMeals.reduce(
    (acc, m) => ({
      calories: acc.calories + m.calories,
      protein: acc.protein + m.protein,
      carbs: acc.carbs + m.carbs,
      fat: acc.fat + m.fat,
    }),
    { calories: 0, protein: 0, carbs: 0, fat: 0 }
  );

  const remainingCalories = Math.max(0, (profile?.calorieTarget || 2100) - consumedTotals.calories);
  const remainingProtein = Math.max(0, (profile?.proteinTarget || 160) - consumedTotals.protein);
  const remainingCarbs = Math.max(0, (profile?.carbsTarget || 200) - consumedTotals.carbs);
  const remainingFat = Math.max(0, (profile?.fatTarget || 65) - consumedTotals.fat);

  // Handlers for Swipe & Matchup
  const handleLaunchSwipe = async (context: PreSwipeContext) => {
    setIsGeneratingDeck(true);
    setIsShowdownActive(false);
    setShortlistedMeals([]);

    try {
      const res = await fetch('/api/ai/generate-deck', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(context),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.recipes && data.recipes.length > 0) {
          setDeckRecipes(data.recipes);
          setIsGeneratingDeck(false);
          setIsPreSwipeModalOpen(false);
          setCurrentTab('swipe');
          return;
        }
      }
    } catch (e) {
      console.warn('Apel API esuat, folosesc motorul local dinamic:', e);
    }

    const localRecipes = filterOrGenerateRecipes(context);
    setDeckRecipes(localRecipes);
    setIsGeneratingDeck(false);
    setIsPreSwipeModalOpen(false);
    setCurrentTab('swipe');
  };

  const handleSwipeRight = (recipe: MealCardProposal) => {
    setShortlistedMeals((prev) => {
      if (prev.some((r) => r.id === recipe.id)) return prev;
      const next = [...prev, recipe];
      if (next.length >= 3) {
        setIsShowdownActive(true);
      }
      return next;
    });
  };

  const handleSwipeLeft = (_recipe: MealCardProposal) => {
    // Ignored for current shortlist
  };

  const handleToggleGroceryItem = (id: string) => {
    saveGroceryItems(
      groceryItems.map((item) => (item.id === id ? { ...item, checked: !item.checked } : item))
    );
  };

  const handleDeleteGroceryItem = (id: string) => {
    saveGroceryItems(groceryItems.filter((item) => item.id !== id));
  };

  const handleAddGroceryItem = (itemData: Omit<GroceryItem, 'id' | 'addedAt'>) => {
    const newItem: GroceryItem = {
      ...itemData,
      id: 'grocery-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
      addedAt: new Date().toISOString(),
    };
    saveGroceryItems([newItem, ...groceryItems]);
  };

  const handleAddIngredientsToGrocery = (
    ingredients: { name: string; amount: string; estimatedPriceRon?: number }[],
    recipeTitle: string
  ) => {
    const newItems: GroceryItem[] = ingredients.map((ing, idx) => ({
      id: `grocery-${Date.now()}-${idx}`,
      name: ing.name,
      amount: ing.amount,
      category: classifyIngredient(ing.name),
      estimatedPriceRon: ing.estimatedPriceRon,
      checked: false,
      recipeSourceTitle: recipeTitle,
      addedAt: new Date().toISOString(),
    }));
    saveGroceryItems([...newItems, ...groceryItems]);
  };

  const handleClearCheckedGrocery = () => {
    saveGroceryItems(groceryItems.filter((i) => !i.checked));
  };

  const handleClearAllGrocery = () => {
    saveGroceryItems([]);
  };

  const uncompletedGroceryCount = groceryItems.filter((i) => !i.checked).length;

  const handleSelectWinner = (winner: MealCardProposal, runnerUps: MealCardProposal[]) => {
    const newMeal: LoggedMeal = {
      id: 'meal-' + Date.now(),
      recipeId: winner.id,
      title: winner.title,
      category: preSwipeCategory,
      calories: winner.calories,
      protein: winner.protein,
      carbs: winner.carbs,
      fat: winner.fat,
      servings: 1,
      source: 'swipe',
      timestamp: new Date().toISOString(),
    };
    saveMeals([newMeal, ...loggedMeals]);

    // Auto-add ingredients that need to be bought
    const missing = winner.ingredients.filter((ing) => ing.toBuy);
    if (missing.length > 0) {
      handleAddIngredientsToGrocery(missing, winner.title);
    }

    if (runnerUps.length > 0) {
      const updatedFavs = [...adaptiveFavorites];
      runnerUps.forEach((ru) => {
        if (!updatedFavs.some((f) => f.id === ru.id)) {
          updatedFavs.push(ru);
        }
      });
      saveFavorites(updatedFavs);
    }

    setIsShowdownActive(false);
    setDetailRecipe(winner);
    setCurrentTab('dashboard');
  };

  const handleCookAndLogFromSheet = (recipe: MealCardProposal) => {
    const newMeal: LoggedMeal = {
      id: 'meal-' + Date.now(),
      recipeId: recipe.id,
      title: recipe.title,
      category: preSwipeCategory,
      calories: recipe.calories,
      protein: recipe.protein,
      carbs: recipe.carbs,
      fat: recipe.fat,
      servings: 1,
      source: 'swipe',
      timestamp: new Date().toISOString(),
    };
    saveMeals([newMeal, ...loggedMeals]);
    setDetailRecipe(null);
  };

  const handleAddQuickLogMeal = (mealData: Omit<LoggedMeal, 'id' | 'timestamp'>) => {
    const newMeal: LoggedMeal = {
      ...mealData,
      id: 'quick-meal-' + Date.now(),
      timestamp: new Date().toISOString(),
    };
    saveMeals([newMeal, ...loggedMeals]);
  };

  const handleDeleteMeal = (mealId: string) => {
    saveMeals(loggedMeals.filter((m) => m.id !== mealId));
  };

  const handleRemoveFavorite = (favId: string) => {
    saveFavorites(adaptiveFavorites.filter((f) => f.id !== favId));
  };

  if (!profile) {
    return (
      <main className="screen-content">
        <OnboardingWizard onComplete={saveProfile} />
      </main>
    );
  }

  return (
    <>
      <main className="screen-content">
          {/* TAB 1: DASHBOARD */}
          {currentTab === 'dashboard' && (
            <div className="dashboard-view animate-fade-in">
              <div className="top-header">
                <div className="user-greeting">
                  <span className="greeting-label">Astăzi, {new Date().toLocaleDateString('ro-RO', { weekday: 'long', day: 'numeric', month: 'short' })}</span>
                  <h1 className="greeting-name">Salut, {profile.name || 'Alex'}</h1>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    id="btn-open-grocery-list"
                    className="btn-header-grocery"
                    onClick={() => setIsGroceryModalOpen(true)}
                    aria-label="Deschide lista de cumpărături"
                  >
                    <ShoppingCart size={14} />
                    <span>Listă</span>
                    {uncompletedGroceryCount > 0 && (
                      <span className="badge-grocery-count tabular-num">{uncompletedGroceryCount}</span>
                    )}
                  </button>

                  <button
                    type="button"
                    className="btn-quick-swipe-header"
                    onClick={() => setIsPreSwipeModalOpen(true)}
                    aria-label="Sugestii rețete"
                  >
                    <Sparkles size={14} />
                    <span>Rețete</span>
                  </button>
                </div>
              </div>

              {/* Macro Gauge & Summary */}
              <MacroRings
                calorieTarget={profile.calorieTarget}
                consumedCalories={consumedTotals.calories}
                proteinTarget={profile.proteinTarget}
                consumedProtein={consumedTotals.protein}
                carbsTarget={profile.carbsTarget}
                consumedCarbs={consumedTotals.carbs}
                fatTarget={profile.fatTarget}
                consumedFat={consumedTotals.fat}
              />

              <DailyJournal
                loggedMeals={loggedMeals}
                onDeleteMeal={handleDeleteMeal}
                onOpenQuickLog={() => {
                  setIsQuickLogOpen(true);
                }}
                onOpenSwipe={(cat) => {
                  setPreSwipeCategory(cat);
                  setIsPreSwipeModalOpen(true);
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
              ) : deckRecipes.length > 0 ? (
                <SwipeDeck
                  cards={deckRecipes}
                  onSwipeRight={handleSwipeRight}
                  onSwipeLeft={handleSwipeLeft}
                  onOpenDetails={(rec) => setDetailRecipe(rec)}
                  onStartShowdown={() => setIsShowdownActive(true)}
                  shortlistCount={shortlistedMeals.length}
                />
              ) : (
                <div className="swipe-idle-screen animate-fade-in">
                  <div className="idle-hero-icon">
                    <Sparkles size={28} className="text-amber-400" />
                  </div>
                  <h2 className="idle-title">Sugestii de rețete</h2>
                  <p className="idle-desc">
                    Alege ingredientele din frigider sau stabilește un buget pentru a primi opțiuni calibrate pe macro-urile tale.
                  </p>
                  <button
                    type="button"
                    className="btn-start-swipe"
                    onClick={() => setIsPreSwipeModalOpen(true)}
                  >
                    <Sparkles size={16} />
                    <span>Configurează căutarea</span>
                  </button>
                </div>
              )}
            </div>
          )}


          {/* TAB 4: ADAPTIVE FAVORITES */}
          {currentTab === 'favorites' && (
            <AdaptiveFavoritesModal
              favorites={adaptiveFavorites}
              onOpenDetails={(rec) => setDetailRecipe(rec)}
              onRemoveFavorite={handleRemoveFavorite}
              onCookAndLog={(rec) => {
                handleCookAndLogFromSheet(rec);
                setCurrentTab('dashboard');
              }}
              onAddIngredientsToGrocery={handleAddIngredientsToGrocery}
              onClose={() => setCurrentTab('dashboard')}
              onStartSwipe={() => setCurrentTab('swipe')}
            />
          )}

          {/* TAB 5: PROFILE */}
          {currentTab === 'profile' && (
            <ProfileScreen
              profile={profile}
              onUpdateProfile={saveProfile}
              onResetOnboarding={() => {
                localStorage.removeItem(LOCAL_STORAGE_KEY_PROFILE);
                setProfile(null);
              }}
            />
          )}
      </main>

        {/* Global Floating Glass Dock (Hidden when modal or sheet is open) */}
        {!isQuickLogOpen && !isPreSwipeModalOpen && !detailRecipe && !isGroceryModalOpen && (
          <BottomNavigation
            currentTab={currentTab}
            onTabChange={(tab) => {
              if (tab === 'quick_log') {
                setIsQuickLogOpen(true);
              } else {
                setCurrentTab(tab);
              }
            }}
            shortlistCount={shortlistedMeals.length}
          />
        )}

        {/* TOP-LEVEL MODALS */}
        <QuickLogModal
          isOpen={isQuickLogOpen}
          onClose={() => setIsQuickLogOpen(false)}
          onSaveQuickMeal={handleAddQuickLogMeal}
        />

        <PreSwipeModal
          isOpen={isPreSwipeModalOpen}
          currentCategory={preSwipeCategory}
          remainingCalories={remainingCalories}
          remainingProtein={remainingProtein}
          remainingCarbs={remainingCarbs}
          remainingFat={remainingFat}
          isGenerating={isGeneratingDeck}
          onClose={() => {
            if (!isGeneratingDeck) setIsPreSwipeModalOpen(false);
          }}
          onLaunch={handleLaunchSwipe}
        />

        <RecipeBottomSheet
          recipe={detailRecipe}
          isOpen={!!detailRecipe}
          onClose={() => setDetailRecipe(null)}
          onCookAndLog={(rec) => {
            handleCookAndLogFromSheet(rec);
            setDetailRecipe(null);
          }}
          onAddIngredientsToGrocery={handleAddIngredientsToGrocery}
        />

        <GroceryListModal
          isOpen={isGroceryModalOpen}
          items={groceryItems}
          onToggleItem={handleToggleGroceryItem}
          onDeleteItem={handleDeleteGroceryItem}
          onAddItem={handleAddGroceryItem}
          onClearChecked={handleClearCheckedGrocery}
          onClearAll={handleClearAllGrocery}
          onClose={() => setIsGroceryModalOpen(false)}
        />




      <style jsx>{`
        .dashboard-view, .swipe-tab-view, .quick-log-tab-view {
          display: flex;
          flex-direction: column;
          padding: 0 20px var(--bottom-safe-padding) 20px;
        }

        .top-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-top: max(20px, env(safe-area-inset-top, 20px));
          padding-bottom: 8px;
          margin-bottom: 14px;
        }

        .user-greeting {
          display: flex;
          flex-direction: column;
        }

        .greeting-label {
          font-size: 0.68rem;
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
          color: #06080d;
          border-radius: var(--radius-full);
          font-size: 0.78rem;
          font-weight: 800;
          box-shadow: 0 4px 14px rgba(245, 158, 11, 0.35);
          transition: transform var(--duration-fast);
        }

        .btn-quick-swipe-header:active {
          transform: scale(0.97);
        }

        .swipe-promo-banner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 16px 18px;
          background: linear-gradient(145deg, #18243c 0%, #0f1626 100%);
          border: 1px solid rgba(245, 158, 11, 0.3);
          border-radius: var(--radius-lg);
          margin-bottom: 16px;
          cursor: pointer;
          transition: all var(--duration-fast);
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.35);
        }

        .swipe-promo-banner:active {
          border-color: var(--macro-calories);
          transform: scale(0.98);
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
          display: flex;
          align-items: center;
          gap: 4px;
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
          width: 68px;
          height: 68px;
          border-radius: var(--radius-full);
          background: rgba(245, 158, 11, 0.12);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .idle-title {
          font-size: 1.35rem;
          font-weight: 900;
          color: var(--text-primary);
          letter-spacing: -0.02em;
        }

        .idle-desc {
          font-size: 0.84rem;
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
          color: #06080d;
          border-radius: var(--radius-md);
          font-size: 0.94rem;
          font-weight: 800;
          box-shadow: 0 4px 20px rgba(245, 158, 11, 0.45);
          transition: transform var(--duration-fast);
        }

        .btn-start-swipe:active {
          transform: scale(0.97);
        }
      `}</style>
    </>
  );
}
