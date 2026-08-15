'use client';

import React, { useState } from 'react';
import { GroceryCategory, GroceryItem } from '@/types/nutrition';
import { GROCERY_CATEGORIES, classifyIngredient, formatGroceryListForExport } from '@/lib/groceryClassifier';
import { useSwipeDownSheet } from '@/lib/useSwipeDownSheet';
import {
  ShoppingCart,
  Check,
  Plus,
  Trash2,
  Share2,
  X,
  ChevronDown,
  ChevronUp,
  CheckCheck,
  RotateCcw,
} from 'lucide-react';

interface GroceryListModalProps {
  isOpen?: boolean;
  items: GroceryItem[];
  onToggleItem: (id: string) => void;
  onDeleteItem: (id: string) => void;
  onAddItem: (item: Omit<GroceryItem, 'id' | 'addedAt'>) => void;
  onClearChecked: () => void;
  onClearAll: () => void;
  onClose: () => void;
}

type FilterTab = 'uncompleted' | 'all' | 'completed';

export function GroceryListModal({
  isOpen = true,
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

  const { sheetStyle, backdropStyle, dragProps, scrollRef } = useSwipeDownSheet({
    onClose,
    isOpen: isOpen,
  });

  if (isOpen === false) return null;

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
    }, 2000);
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
      showToast('Lista a fost copiată pe clipboard');
    } catch {
      showToast('Eroare la copiere');
    }
  };

  const handleQuickAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName.trim()) return;

    const cat = classifyIngredient(newItemName.trim());
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
    showToast(`Adăugat: ${newItemName.trim()}`);
  };

  const toggleCategoryCollapse = (cat: string) => {
    setCollapsedCategories((prev) => ({
      ...prev,
      [cat]: !prev[cat],
    }));
  };

  const categoriesOrder: GroceryCategory[] = ['produce', 'protein', 'dairy', 'bakery', 'pantry', 'other'];

  return (
    <div className="grocery-modal-backdrop animate-fade-in" onClick={onClose} style={backdropStyle}>
      <div
        className="grocery-modal-sheet animate-slide-up"
        onClick={(e) => e.stopPropagation()}
        style={sheetStyle}
      >
        {/* Grab Handle Touch Zone */}
        <div className="grocery-drag-handle-touch-zone" {...dragProps}>
          <div className="grocery-drag-handle" />
        </div>

        {/* Header */}
        <div className="grocery-header" {...dragProps}>
          <div className="flex items-center gap-2.5">
            <ShoppingCart size={18} className="text-slate-300" />
            <h2 className="text-base font-bold text-white tracking-tight">Listă de cumpărături</h2>
          </div>

          <button
            type="button"
            className="btn-sheet-close"
            onClick={onClose}
            aria-label="Închide"
          >
            <X size={16} />
          </button>
        </div>

        {/* Toast Feedback */}
        {toastMessage && (
          <div className="grocery-toast-banner animate-fade-in">
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Scrollable Content */}
        <div className="grocery-content-scroll" ref={scrollRef}>
          {/* Metrics Overview */}
          <div className="grocery-metrics-card">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-400 font-medium">De cumpărat</span>
                <div className="text-xl font-bold text-white tabular-num mt-0.5">
                  {uncompletedItems.length}{' '}
                  <span className="text-xs font-normal text-slate-500">/ {items.length} produse</span>
                </div>
              </div>

              {totalEstimatedCost > 0 && (
                <div className="text-right">
                  <span className="text-xs text-slate-400 font-medium">Cost estimat rămas</span>
                  <div className="text-lg font-bold text-amber-400 tabular-num mt-0.5">
                    {remainingCost.toFixed(0)} <span className="text-xs font-semibold text-slate-400">RON</span>
                  </div>
                </div>
              )}
            </div>

            {/* Progress Bar */}
            <div className="grocery-progress-bar-wrap mt-3">
              <div className="grocery-progress-track">
                <div
                  className="grocery-progress-fill"
                  style={{ width: `${completionRate}%` }}
                />
              </div>
              <span className="text-xs font-semibold text-emerald-400 tabular-num">{completionRate}%</span>
            </div>
          </div>

          {/* Quick Add Form */}
          <form className="grocery-quick-add-card" onSubmit={handleQuickAdd}>
            <div className="quick-add-inputs-row">
              <input
                type="text"
                placeholder="Adaugă produs..."
                value={newItemName}
                onChange={(e) => setNewItemName(e.target.value)}
                className="grocery-input-main"
                required
              />
              <input
                type="text"
                placeholder="Cantitate"
                value={newItemAmount}
                onChange={(e) => setNewItemAmount(e.target.value)}
                className="grocery-input-sm"
              />
              <input
                type="number"
                step="0.5"
                placeholder="Lei"
                value={newItemPrice}
                onChange={(e) => setNewItemPrice(e.target.value)}
                className="grocery-input-price"
              />
              <button
                type="submit"
                className="btn-quick-add-submit"
                disabled={!newItemName.trim()}
                aria-label="Adaugă produs"
              >
                <Plus size={16} />
              </button>
            </div>
          </form>

          {/* Filter Tabs & Share Action */}
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
                title="Copiază textul listei"
              >
                <Share2 size={13} />
                <span>Copiază</span>
              </button>
            )}
          </div>

          {/* Categorized Items */}
          {displayedItems.length === 0 ? (
            <div className="grocery-empty-box">
              <span className="text-sm font-medium text-slate-300">
                {filter === 'completed'
                  ? 'Niciun produs bifat.'
                  : filter === 'uncompleted' && items.length > 0
                  ? 'Ai cumpărat toate produsele din listă.'
                  : 'Lista este goală.'}
              </span>
              <span className="text-xs text-slate-500 max-w-xs">
                {items.length === 0
                  ? 'Adaugă produse manual sau trimite ingredientele direct din rețete.'
                  : 'Schimbă filtrul pentru a vedea celelalte articole.'}
              </span>
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
                        <strong className="aisle-name">{catMeta.label}</strong>
                        <span className="aisle-count tabular-num">{catItems.length}</span>
                      </div>
                      <div className="aisle-collapse-icon">
                        {isCollapsed ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
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
                                  <Check size={13} className="check-icon-svg" />
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
                                    {item.estimatedPriceRon} lei
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
                              <Trash2 size={14} />
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

          {/* Footer Actions */}
          {items.length > 0 && (
            <div className="grocery-footer-actions">
              {completedItems.length > 0 && (
                <button
                  type="button"
                  className="btn-clear-completed"
                  onClick={onClearChecked}
                >
                  <CheckCheck size={14} />
                  <span>Curăță produsele bifate ({completedItems.length})</span>
                </button>
              )}

              <button
                type="button"
                className="btn-clear-all-grocery"
                onClick={() => {
                  if (confirm('Golești toată lista de cumpărături?')) {
                    onClearAll();
                  }
                }}
              >
                <RotateCcw size={14} />
                <span>Golește lista</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
