import React from 'react';
import { FoodItem } from '../types';
import { FoodCard } from './FoodCard';
import {
  Flame,
  Filter,
  Sparkles,
  ArrowUpDown,
  Search,
  RotateCcw,
  SlidersHorizontal,
  MapPin
} from 'lucide-react';

interface FoodGridProps {
  foods: FoodItem[];
  selectedCategory: string;
  onSelectCategory: (cat: string) => void;
  vegOnly: boolean;
  onToggleVegOnly: () => void;
  smartResaleOnly: boolean;
  onToggleSmartResaleOnly: () => void;
  sortBy: string;
  onSortByChange: (sort: string) => void;
  searchQuery: string;
  onClearSearch: () => void;
  cartMap: Record<string, number>;
  onAddToCart: (food: FoodItem) => void;
  onRemoveFromCart: (foodId: string) => void;
  onInspect: (food: FoodItem) => void;
  activeHubName?: string | null;
  onClearHubFilter?: () => void;
  userDeliveryLocation?: string | null;
}

const CATEGORIES = [
  { id: 'All', label: 'All Dishes', icon: '🍽️' },
  { id: 'Biryani', label: 'Biryani', icon: '🍲' },
  { id: 'Pizza', label: 'Pizza', icon: '🍕' },
  { id: 'Burger', label: 'Burgers', icon: '🍔' },
  { id: 'Momos', label: 'Momos', icon: '🥟' },
  { id: 'Sandwich', label: 'Sandwiches', icon: '🥪' },
  { id: 'Pasta', label: 'Pasta', icon: '🍝' },
  { id: 'Healthy food', label: 'Healthy & Bowls', icon: '🥗' },
  { id: 'Desserts', label: 'Desserts', icon: '🍮' },
  { id: 'Rolls & Bowls', label: 'Rolls & Meals', icon: '🌯' },
];

export const FoodGrid: React.FC<FoodGridProps> = ({
  foods,
  selectedCategory,
  onSelectCategory,
  vegOnly,
  onToggleVegOnly,
  smartResaleOnly,
  onToggleSmartResaleOnly,
  sortBy,
  onSortByChange,
  searchQuery,
  onClearSearch,
  cartMap,
  onAddToCart,
  onRemoveFromCart,
  onInspect,
  activeHubName,
  onClearHubFilter,
  userDeliveryLocation,
}) => {
  return (
    <section id="explore-food" className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Section Title & Tagline */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-100 text-orange-800 text-xs font-bold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5 text-orange-600" />
            <span>Real-Time Cloud Kitchen Inventory</span>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-stone-900 tracking-tight">
            Explore Fresh Meals & Resale Batches
          </h2>
          <p className="text-sm sm:text-base text-stone-600 mt-1">
            Browse available batches from certified nearby cloud kitchens. Freshly inspected, strictly temperature-monitored.
          </p>
        </div>

        {/* Counter Tag */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-stone-600 bg-white px-3.5 py-2 rounded-2xl border border-stone-200 shadow-2xs">
            Showing <strong className="text-orange-600">{foods.length}</strong> available items
          </span>
        </div>
      </div>

      {/* Active Hub or Delivery Radius Filter Banner */}
      {activeHubName && (
        <div className="mb-6 p-4 rounded-2xl bg-orange-50 border border-orange-200 flex flex-wrap items-center justify-between gap-3 animate-in fade-in">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-orange-600 text-white flex items-center justify-center shrink-0">
              <MapPin className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-stone-900 flex items-center gap-2">
                <span>Filtered to {activeHubName}</span>
                {userDeliveryLocation && (
                  <span className="text-stone-500 font-normal">
                    • Delivering to <strong>{userDeliveryLocation}</strong>
                  </span>
                )}
              </div>
              <p className="text-[11px] text-orange-800">
                Displaying only batches ready for dispatch within your thermal radius.
              </p>
            </div>
          </div>

          {onClearHubFilter && (
            <button
              type="button"
              onClick={onClearHubFilter}
              className="px-3 py-1.5 bg-white hover:bg-orange-100 text-orange-700 text-xs font-bold rounded-xl border border-orange-200 transition-colors flex items-center gap-1"
            >
              <span>Show All Kitchens</span>
            </button>
          )}
        </div>
      )}

      {/* Category Pills Slider */}
      <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-6 scrollbar-none">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            id={`category-tab-${cat.id.toLowerCase().replace(/\s+/g, '-')}`}
            type="button"
            onClick={() => onSelectCategory(cat.id)}
            className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all ${
              selectedCategory === cat.id
                ? 'bg-orange-600 text-white shadow-sm ring-2 ring-orange-600/20'
                : 'bg-white hover:bg-stone-100 text-stone-700 border border-stone-200'
            }`}
          >
            <span>{cat.icon}</span>
            <span>{cat.label}</span>
          </button>
        ))}
      </div>

      {/* Interactive Filter Bar */}
      <div className="bg-white rounded-2xl p-4 border border-stone-200/90 shadow-xs mb-8 flex flex-wrap items-center justify-between gap-4">
        {/* Left Filter Toggles */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          {/* Veg Only Toggle */}
          <button
            id="filter-veg-only-btn"
            type="button"
            onClick={onToggleVegOnly}
            className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all border ${
              vegOnly
                ? 'bg-emerald-50 border-emerald-500 text-emerald-800 ring-2 ring-emerald-500/15'
                : 'bg-stone-50 border-stone-200 text-stone-700 hover:bg-stone-100'
            }`}
          >
            <div className="w-3.5 h-3.5 rounded-xs border border-emerald-600 p-0.5 flex items-center justify-center">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
            </div>
            <span>Pure Veg</span>
          </button>

          {/* Smart Resale Only Toggle */}
          <button
            id="filter-resale-only-btn"
            type="button"
            onClick={onToggleSmartResaleOnly}
            className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all border ${
              smartResaleOnly
                ? 'bg-orange-50 border-orange-500 text-orange-800 ring-2 ring-orange-500/15'
                : 'bg-stone-50 border-stone-200 text-stone-700 hover:bg-stone-100'
            }`}
          >
            <Flame className="w-3.5 h-3.5 text-orange-600" />
            <span>Smart Resale Only (30%-55% OFF)</span>
          </button>
        </div>

        {/* Right Sort By Dropdown */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-stone-500 font-medium hidden sm:inline flex items-center gap-1">
            <ArrowUpDown className="w-3.5 h-3.5" /> Sort by:
          </span>
          <select
            id="food-sort-select"
            value={sortBy}
            onChange={(e) => onSortByChange(e.target.value)}
            className="bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs font-semibold text-stone-800 focus:outline-none focus:border-orange-500"
          >
            <option value="recommended">Recommended & Bestsellers</option>
            <option value="discount">Highest Resale Discount (50%+ OFF)</option>
            <option value="freshness">Freshest Prep Time (&lt;20m ago)</option>
            <option value="delivery">Fastest Delivery (Under 18 mins)</option>
            <option value="price-low">Price: Low to High</option>
          </select>
        </div>
      </div>

      {/* Food Cards Grid or Empty State */}
      {foods.length === 0 ? (
        <div
          id="no-results-state"
          className="bg-white rounded-3xl p-12 text-center border border-stone-200 shadow-xs space-y-4 max-w-md mx-auto my-6"
        >
          <div className="w-16 h-16 rounded-full bg-orange-50 text-orange-500 flex items-center justify-center mx-auto">
            <Search className="w-8 h-8" />
          </div>

          <div className="space-y-1">
            <h3 className="font-display text-lg font-bold text-stone-900">
              No Food Items Found
            </h3>
            <p className="text-xs text-stone-500 leading-relaxed">
              We couldn’t find any matches for &ldquo;<strong>{searchQuery || selectedCategory}</strong>&rdquo; with the current filters.
            </p>
          </div>

          <button
            id="reset-filters-btn"
            type="button"
            onClick={onClearSearch}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold shadow-xs transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Search & Filters</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {foods.map((food) => (
            <FoodCard
              key={food.id}
              food={food}
              quantityInCart={cartMap[food.id] || 0}
              onAddToCart={onAddToCart}
              onRemoveFromCart={onRemoveFromCart}
              onInspect={onInspect}
            />
          ))}
        </div>
      )}
    </section>
  );
};
