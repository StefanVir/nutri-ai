'use client';

import React, { useState } from 'react';
import { GroceryCategory, GroceryItem } from '@/types/nutrition';
import { GROCERY_CATEGORIES, classifyIngredient, formatGroceryListForExport } from '@/lib/groceryClassifier';
import {
  ShoppingCart,
  Check,
  Plus,
  Trash2,
  Share2,
  X,
  Sparkles,
  ChevronDown,
  ChevronUp,
  CheckCheck,
  RotateCcw,
} from 'lucide-react';

interface GroceryListModalProps {
  items: GroceryItem[];
  onToggleItem: (id: string) => void;
  onDeleteItem: (id: string) => void;
  onAddItem: (item: Omit<GroceryItem, 'id' | 'addedAt'>) => void;
  onClearChecked: () => void;
  onClearAll: () => void;
  onClose: () => void;
}

type FilterTab = 'all' | 'uncompleted' | 'completed';

export function GroceryListModal({
  items,
  onToggleItem,
  onDeleteItem,
  onAddItem,
  onClearChecked,
  onClearAll,
  onClose,
}: GroceryListModalProps) {
  const [filter, setFilter] = useState<FilterTab>('uncompleted');
  const [collapsedCategories, setCollapsedCategories] = useState<Record<string, boolean>>({});
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Quick Add state
  const [newItemName, setNewItemName] = useState('');
  const [newItemAmount, setNewItemAmount] = useState('');
  const [newItemPrice, setNewItemPrice] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<GroceryCategory | 'auto'>('auto');

  const uncompletedItems = items.filter((i) => !i.checked);
  const completedItems = items.filter((i) => i.checked);

  const displayedItems =
    filter === 'all'
      ? items
      : filter === 'uncompleted'
      ? uncompletedItems
      : completedItems;

  const totalEstimatedCost = items.reduce((acc, i) => acc + (i.estimatedPriceRon || 0), 0);
  const remainingCost = uncompletedItems.reduce((acc, i) => acc + (i.estimatedPriceRon || 0), 0);
  const completionRate = items.length > 0 ? Math.round((completedItems.length / items.length) * 100) : 0;

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2500);
  };

  const handleCopyWhatsApp = async () => {
    const formatted = formatGroceryListForExport(items);
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(formatted);
      } else {
        const textArea = document.createElement('textarea');
        textArea.value = formatted;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
      }
      showToast('✅ Lista a fost copiată pe Clipboard!');
    } catch {
      showToast('❌ Nu s-a putut copia textul');
    }
  };

  const handleQuickAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName.trim()) return;

    const cat: GroceryCategory =
      selectedCategory === 'auto'
        ? classifyIngredient(newItemName.trim())
        : selectedCategory;

    const priceNum = parseFloat(newItemPrice);

    onAddItem({
      name: newItemName.trim(),
      amount: newItemAmount.trim() || '1 buc',
      category: cat,
      estimatedPriceRon: isNaN(priceNum) || priceNum <= 0 ? undefined : priceNum,
      checked: false,
      recipeSourceTitle: 'Adăugat manual',
    });

    setNewItemName('');
    setNewItemAmount('');
    setNewItemPrice('');
    setSelectedCategory('auto');
    showToast(`Adăugat: ${newItemName.trim()}`);
  };

  const toggleCategoryCollapse = (cat: string) => {
    setCollapsedCategories((prev) => ({
      ...prev,
      [cat]: !prev[cat],
    }));
  };

  // Group items by category
  const categoriesOrder: GroceryCategory[] = ['produce', 'protein', 'dairy', 'bakery', 'pantry', 'other'];

  return (
    <div className="sheet-backdrop" onClick={onClose}>
      <div
        className="sheet-container grocery-modal-container animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Grab Handle */}
        <div className="sheet-handle-wrap">
          <div className="sheet-handle" />
        </div>

        {/* Modal Header */}
        <div className="grocery-header">
          <div className="grocery-header-title-wrap">
            <div className="grocery-icon-badge">
              <ShoppingCart size={18} />
            </div>
            <div>
              <h2 className="grocery-title">Listă de Cumpărături</h2>
              <span className="grocery-sub">Agregată inteligent pe raioane din supermarket</span>
            </div>
          </div>
          <button
            type="button"
            className="btn-sheet-close"
            onClick={onClose}
            aria-label="Închide lista de cumpărături"
          >
            <X size={18} />
          </button>
        </div>

        {/* Toast Feedback */}
        {toastMessage && (
          <div className="grocery-toast-banner animate-fade-in">
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Scrollable Content */}
        <div className="grocery-content-scroll">
          {/* Metrics Card */}
          <div className="grocery-metrics-card">
            <div className="metrics-row-top">
              <div className="metric-stat">
                <span className="stat-label">De cumpărat</span>
                <span className="stat-num tabular-num">
                  {uncompletedItems.length} <span className="stat-sub-num">/ {items.length}</span>
                </span>
              </div>

              {totalEstimatedCost > 0 && (
                <div className="metric-stat metric-cost">
                  <span className="stat-label">Cost estimat rămas</span>
                  <span className="stat-num cost-highlight tabular-num">
                    ~{remainingCost.toFixed(0)} <span className="stat-currency">RON</span>
                  </span>
                </div>
              )}
            </div>

            {/* Progress Bar */}
            <div className="grocery-progress-bar-wrap">
              <div className="grocery-progress-track">
                <div
                  className="grocery-progress-fill"
                  style={{ width: `${completionRate}%` }}
                />
              </div>
              <span className="grocery-progress-pct tabular-num">{completionRate}% complet</span>
            </div>
          </div>

          {/* Quick Add Form */}
          <form className="grocery-quick-add-card" onSubmit={handleQuickAdd}>
            <div className="quick-add-header">
              <span className="quick-add-title">
                <Plus size={14} /> Adaugă rapid un articol
              </span>
              {newItemName.trim() && selectedCategory === 'auto' && (
                <span className="auto-detect-pill">
                  Auto: {GROCERY_CATEGORIES[classifyIngredient(newItemName)].emoji}{' '}
                  {GROCERY_CATEGORIES[classifyIngredient(newItemName)].label}
                </span>
              )}
            </div>

            <div className="quick-add-inputs-row">
              <input
                type="text"
                placeholder="Ex: Iaurt grecesc, Piept de pui, Spanac..."
                value={newItemName}
                onChange={(e) => setNewItemName(e.target.value)}
                className="grocery-input-main"
                required
              />
              <input
                type="text"
                placeholder="Cantitate (ex: 2 buc)"
                value={newItemAmount}
                onChange={(e) => setNewItemAmount(e.target.value)}
                className="grocery-input-sm"
              />
              <input
                type="number"
                step="0.5"
                placeholder="Preț lei"
                value={newItemPrice}
                onChange={(e) => setNewItemPrice(e.target.value)}
                className="grocery-input-price"
              />
              <button
                type="submit"
                className="btn-quick-add-submit"
                disabled={!newItemName.trim()}
                aria-label="Adaugă ingredient"
              >
                <Plus size={18} />
              </button>
            </div>
          </form>

          {/* Filter Tabs & Quick Actions */}
          <div className="grocery-tabs-bar">
            <div className="filter-chips-wrap">
              <button
                type="button"
                className={`filter-chip ${filter === 'uncompleted' ? 'active' : ''}`}
                onClick={() => setFilter('uncompleted')}
              >
                <span>De cumpărat</span>
                <span className="chip-count tabular-num">{uncompletedItems.length}</span>
              </button>

              <button
                type="button"
                className={`filter-chip ${filter === 'all' ? 'active' : ''}`}
                onClick={() => setFilter('all')}
              >
                <span>Toate</span>
                <span className="chip-count tabular-num">{items.length}</span>
              </button>

              <button
                type="button"
                className={`filter-chip ${filter === 'completed' ? 'active' : ''}`}
                onClick={() => setFilter('completed')}
              >
                <span>Cumpărate</span>
                <span className="chip-count tabular-num">{completedItems.length}</span>
              </button>
            </div>

            {items.length > 0 && (
              <button
                type="button"
                className="btn-copy-whatsapp"
                onClick={handleCopyWhatsApp}
                title="Copiază pe WhatsApp"
              >
                <Share2 size={14} />
                <span>WhatsApp</span>
              </button>
            )}
          </div>

          {/* Items List grouped by category */}
          {displayedItems.length === 0 ? (
            <div className="grocery-empty-box">
              <div className="empty-cart-icon">
                <ShoppingCart size={32} />
              </div>
              <strong className="empty-cart-title">
                {filter === 'completed'
                  ? 'Nu ai niciun articol bifat ca și cumpărat'
                  : filter === 'uncompleted' && items.length > 0
                  ? 'Felicitări! Ai cumpărat toate ingredientele din listă.'
                  : 'Lista de cumpărături este goală'}
              </strong>
              <p className="empty-cart-sub">
                {items.length === 0
                  ? 'Adaugă ingrediente manual mai sus sau apasă pe „Adaugă în listă” din cardul oricărei rețete găsite la Swipe.'
                  : 'Poți bifa sau debifa articole oricând.'}
              </p>
            </div>
          ) : (
            <div className="grocery-categories-container">
              {categoriesOrder.map((catKey) => {
                const catMeta = GROCERY_CATEGORIES[catKey];
                const catItems = displayedItems.filter((i) => i.category === catKey);
                if (catItems.length === 0) return null;

                const isCollapsed = !!collapsedCategories[catKey];

                return (
                  <div key={catKey} className="grocery-aisle-card">
                    {/* Aisle Header */}
                    <div
                      className="aisle-header"
                      role="button"
                      tabIndex={0}
                      onClick={() => toggleCategoryCollapse(catKey)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          toggleCategoryCollapse(catKey);
                        }
                      }}
                    >
                      <div className="aisle-title-group">
                        <span className="aisle-emoji">{catMeta.emoji}</span>
                        <strong className="aisle-name">{catMeta.label}</strong>
                        <span className="aisle-count tabular-num">{catItems.length}</span>
                      </div>
                      <div className="aisle-collapse-icon">
                        {isCollapsed ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
                      </div>
                    </div>

                    {/* Aisle Items */}
                    {!isCollapsed && (
                      <div className="aisle-items-list">
                        {catItems.map((item) => (
                          <div
                            key={item.id}
                            className={`grocery-item-row ${item.checked ? 'item-checked' : ''}`}
                            onClick={() => onToggleItem(item.id)}
                          >
                            {/* Checkbox */}
                            <div className="grocery-check-box">
                              {item.checked ? (
                                <div className="checked-indicator">
                                  <Check size={14} className="check-icon-svg" />
                                </div>
                              ) : (
                                <div className="unchecked-indicator" />
                              )}
                            </div>

                            {/* Item Details */}
                            <div className="grocery-item-info">
                              <span className="grocery-item-name">{item.name}</span>
                              <div className="grocery-item-meta">
                                <span className="grocery-item-amount">{item.amount}</span>
                                {item.estimatedPriceRon && (
                                  <span className="grocery-item-price tabular-num">
                                    ~{item.estimatedPriceRon} lei
                                  </span>
                                )}
                                {item.recipeSourceTitle && (
                                  <span className="grocery-item-source">
                                    {item.recipeSourceTitle}
                                  </span>
                                )}
                              </div>
                            </div>

                            {/* Delete Action */}
                            <button
                              type="button"
                              className="btn-delete-grocery-item"
                              onClick={(e) => {
                                e.stopPropagation();
                                onDeleteItem(item.id);
                              }}
                              aria-label={`Șterge ${item.name}`}
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* Clear & Manage Actions */}
          {items.length > 0 && (
            <div className="grocery-footer-actions">
              {completedItems.length > 0 && (
                <button
                  type="button"
                  className="btn-clear-completed"
                  onClick={onClearChecked}
                >
                  <CheckCheck size={14} />
                  <span>Curăță articolele cumpărate ({completedItems.length})</span>
                </button>
              )}

              <button
                type="button"
                className="btn-clear-all-grocery"
                onClick={() => {
                  if (confirm('Sigur dorești să golești toată lista de cumpărături?')) {
                    onClearAll();
                  }
                }}
              >
                <RotateCcw size={14} />
                <span>Golește toată lista</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
