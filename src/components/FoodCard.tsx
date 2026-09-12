import React from 'react';
import { FoodItem } from '../types';
import {
  Clock,
  ShieldCheck,
  MapPin,
  Flame,
  Plus,
  Minus,
  Info,
  Thermometer,
  Sparkles,
  Check
} from 'lucide-react';

interface FoodCardProps {
  food: FoodItem;
  quantityInCart: number;
  onAddToCart: (food: FoodItem) => void;
  onRemoveFromCart: (foodId: string) => void;
  onInspect: (food: FoodItem) => void;
}

export const FoodCard: React.FC<FoodCardProps> = ({
  food,
  quantityInCart,
  onAddToCart,
  onRemoveFromCart,
  onInspect,
}) => {
  const savingsAmount = food.originalPrice - food.resalePrice;

  return (
    <div
      id={`food-card-${food.id}`}
      className="bg-white rounded-3xl border border-stone-200/90 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden group hover:border-orange-200"
    >
      {/* Top Media & Badges */}
      <div>
        <div className="relative h-48 sm:h-52 w-full overflow-hidden bg-stone-100">
          <img
            src={food.imageUrl}
            alt={food.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20" />

          {/* Smart Resale or Freshly Prepared Badge */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5">
            {food.isSmartResale ? (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-orange-600 text-white text-[11px] font-extrabold uppercase tracking-wide shadow-md">
                <Flame className="w-3.5 h-3.5" />
                Smart Resale • {food.resaleDiscountPercent}% OFF
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-emerald-700 text-white text-[11px] font-extrabold uppercase tracking-wide shadow-md">
                <Sparkles className="w-3.5 h-3.5" />
                Freshly Prepared Order
              </span>
            )}

            {/* Units Remaining */}
            {food.isSmartResale && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-black/60 backdrop-blur-md text-amber-300 text-[10px] font-bold border border-white/10 w-fit">
                Only {food.availableUnits} boxes left
              </span>
            )}
          </div>

          {/* Quick Info / Transparency Inspect Button */}
          <button
            id={`inspect-btn-${food.id}`}
            type="button"
            onClick={() => onInspect(food)}
            className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 hover:bg-white text-stone-700 hover:text-orange-600 flex items-center justify-center shadow-md transition-all active:scale-95"
            title="Inspect Safety, Thermal Seal & Kitchen Details"
          >
            <Info className="w-4 h-4" />
          </button>

          {/* Bottom Overlay Info inside image: Prep Time & Temp */}
          <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-white text-xs">
            <div className="flex items-center gap-1 font-semibold drop-shadow-md">
              <Clock className="w-3.5 h-3.5 text-amber-300" />
              <span>{food.preparationTime}</span>
            </div>

            <div className="flex items-center gap-1 text-[11px] bg-black/50 backdrop-blur-xs px-2 py-0.5 rounded-md border border-white/10">
              <Thermometer className="w-3 h-3 text-orange-400" />
              <span>{food.holdingTemperatureC}°C</span>
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-4 space-y-3">
          {/* Veg/Non-Veg symbol + Cloud Kitchen Name */}
          <div className="flex items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-2">
              {/* Authentic Indian Veg / Non-Veg Indicator Icon */}
              <div
                className={`w-4 h-4 rounded-sm border p-0.5 flex items-center justify-center shrink-0 ${
                  food.isVeg ? 'border-emerald-600' : 'border-red-600'
                }`}
                title={food.isVeg ? '100% Pure Vegetarian' : 'Non-Vegetarian'}
              >
                <div
                  className={`w-2 h-2 rounded-full ${
                    food.isVeg ? 'bg-emerald-600' : 'bg-red-600'
                  }`}
                />
              </div>

              {/* Kitchen Name & Rating */}
              <span className="font-semibold text-stone-700 truncate max-w-[160px]">
                {food.cloudKitchen.name}
              </span>
            </div>

            {/* Distance & Delivery Radius */}
            <span className="text-stone-500 font-medium flex items-center gap-0.5 shrink-0">
              <MapPin className="w-3 h-3 text-stone-400" />
              {food.cloudKitchen.distanceKm} km (Radius {food.deliveryRadiusKm}km)
            </span>
          </div>

          {/* Dish Name */}
          <h3
            onClick={() => onInspect(food)}
            className="font-display text-base font-bold text-stone-900 group-hover:text-orange-600 transition-colors line-clamp-1 cursor-pointer"
            title={food.name}
          >
            {food.name}
          </h3>

          <p className="text-xs text-stone-500 line-clamp-2 leading-relaxed">
            {food.description}
          </p>

          {/* Freshness Status & Delivery ETA Badge */}
          <div className="bg-stone-50 rounded-xl p-2 border border-stone-200/80 flex items-center justify-between text-[11px]">
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-semibold text-stone-700">{food.freshnessStatus}</span>
            </div>
            <div className="text-stone-500 font-medium">
              ETA: <span className="text-stone-900 font-bold">{food.estimatedDeliveryMinutes}</span>
            </div>
          </div>

          {/* Safety Micro-Tag */}
          <div className="flex items-center gap-1.5 text-[10px] text-stone-500">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span className="truncate">
              FSSAI Grade-A • Tamper Sealed • {food.safetyDetails.packagingType}
            </span>
          </div>
        </div>
      </div>

      {/* Pricing & Add To Cart Button */}
      <div className="p-4 pt-2 border-t border-stone-100 flex items-center justify-between gap-3 bg-stone-50/40">
        <div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-xl font-extrabold text-stone-900">
              ₹{food.resalePrice}
            </span>
            {food.originalPrice > food.resalePrice && (
              <span className="text-xs text-stone-400 line-through font-medium">
                ₹{food.originalPrice}
              </span>
            )}
          </div>
          {savingsAmount > 0 && (
            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
              Save ₹{savingsAmount}
            </span>
          )}
        </div>

        {/* Quantity Stepper or Add Button */}
        {quantityInCart > 0 ? (
          <div className="flex items-center gap-2 bg-orange-600 text-white rounded-xl px-2 py-1 shadow-sm">
            <button
              id={`cart-decrease-${food.id}`}
              type="button"
              onClick={() => onRemoveFromCart(food.id)}
              className="p-1 hover:bg-orange-700 rounded-lg transition-colors active:scale-90"
              title="Decrease quantity"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <span className="text-xs font-extrabold min-w-4 text-center">
              {quantityInCart}
            </span>
            <button
              id={`cart-increase-${food.id}`}
              type="button"
              onClick={() => onAddToCart(food)}
              className="p-1 hover:bg-orange-700 rounded-lg transition-colors active:scale-90"
              title="Increase quantity"
              disabled={food.isSmartResale && quantityInCart >= food.availableUnits}
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <button
            id={`add-to-cart-${food.id}`}
            type="button"
            onClick={() => onAddToCart(food)}
            className="px-4 py-2 rounded-xl bg-stone-900 hover:bg-orange-600 text-white text-xs font-bold transition-all shadow-xs hover:shadow active:scale-95 flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add</span>
          </button>
        )}
      </div>
    </div>
  );
};
