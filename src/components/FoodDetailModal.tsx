import React from 'react';
import { FoodItem } from '../types';
import {
  X,
  Clock,
  ShieldCheck,
  MapPin,
  Thermometer,
  Flame,
  Award,
  CheckCircle2,
  AlertCircle,
  ShoppingBag,
  Heart,
  Share2
} from 'lucide-react';

interface FoodDetailModalProps {
  food: FoodItem | null;
  onClose: () => void;
  onAddToCart: (food: FoodItem) => void;
  quantityInCart: number;
}

export const FoodDetailModal: React.FC<FoodDetailModalProps> = ({
  food,
  onClose,
  onAddToCart,
  quantityInCart,
}) => {
  if (!food) return null;

  const savingsAmount = food.originalPrice - food.resalePrice;

  return (
    <div
      id="food-detail-modal-backdrop"
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-in fade-in"
      onClick={onClose}
    >
      <div
        id="food-detail-modal-card"
        className="bg-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl border border-stone-200 my-8 animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Image with Badges */}
        <div className="relative h-64 sm:h-72 w-full bg-stone-100">
          <img
            src={food.imageUrl}
            alt={food.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

          {/* Close Button */}
          <button
            id="close-detail-modal-btn"
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/50 hover:bg-black/70 text-white flex items-center justify-center backdrop-blur-md transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Resale Tag & Veg/Non-veg */}
          <div className="absolute top-4 left-4 flex flex-wrap gap-2">
            {food.isSmartResale ? (
              <span className="px-3 py-1 rounded-xl bg-orange-600 text-white text-xs font-bold uppercase tracking-wider flex items-center gap-1 shadow-md">
                <Flame className="w-3.5 h-3.5" />
                Smart Resale • Save {food.resaleDiscountPercent}%
              </span>
            ) : (
              <span className="px-3 py-1 rounded-xl bg-emerald-600 text-white text-xs font-bold uppercase tracking-wider shadow-md">
                Freshly Prepared To Order
              </span>
            )}

            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-white/95 backdrop-blur-md text-xs font-semibold text-stone-800">
              <div
                className={`w-3 h-3 rounded-xs border p-0.5 flex items-center justify-center ${
                  food.isVeg ? 'border-emerald-600' : 'border-red-600'
                }`}
              >
                <div className={`w-1.5 h-1.5 rounded-full ${food.isVeg ? 'bg-emerald-600' : 'bg-red-600'}`} />
              </div>
              <span>{food.isVeg ? 'Vegetarian' : 'Non-Vegetarian'}</span>
            </div>
          </div>

          {/* Bottom Title on Image */}
          <div className="absolute bottom-4 left-5 right-5 text-white">
            <div className="text-xs font-semibold text-amber-300 mb-1 flex items-center gap-1.5">
              <Award className="w-4 h-4" />
              <span>{food.cloudKitchen.name} • {food.cloudKitchen.locality}, {food.cloudKitchen.city}</span>
            </div>
            <h2 className="font-display text-2xl font-bold leading-tight">
              {food.name}
            </h2>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 max-h-[60vh] overflow-y-auto">
          {/* Resale Backstory / Why This Food is Available */}
          <div className="bg-amber-50/80 border border-amber-200/80 rounded-2xl p-4 space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-900">
              <AlertCircle className="w-4 h-4 text-amber-700" />
              <span>Resale Transparency & Backstory</span>
            </div>
            <p className="text-xs text-amber-950 leading-relaxed font-medium">
              {food.resaleReason}
            </p>
            <div className="pt-2 border-t border-amber-200/60 flex items-center justify-between text-[11px] text-amber-800">
              <span>Prepared: <strong>{food.preparationTime}</strong> ({food.prepTimestamp})</span>
              <span>Max safety hold cutoff: <strong>{food.safetyDetails.holdCutoffTime}</strong></span>
            </div>
          </div>

          {/* Description & Servings */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-400 mb-1.5">
              Dish Overview
            </h4>
            <p className="text-sm text-stone-700 leading-relaxed">
              {food.description}
            </p>
            <div className="flex items-center gap-4 mt-3 text-xs text-stone-500 font-medium">
              <span>Serves: <strong className="text-stone-800">{food.serves}</strong></span>
              {food.calories && (
                <span>Approx: <strong className="text-stone-800">{food.calories} kcal</strong></span>
              )}
              <span>Est. Delivery: <strong className="text-stone-800">{food.estimatedDeliveryMinutes}</strong></span>
            </div>
          </div>

          {/* Safety & Thermal Seal Verification Checklist */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-400 mb-2.5 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Aroma Safety & Hygiene Protocol</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-stone-50 border border-stone-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Tamper-evident thermal seal verified</span>
              </div>
              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-stone-50 border border-stone-200">
                <Thermometer className="w-4 h-4 text-orange-600 shrink-0" />
                <span>Holding Temp: <strong>{food.holdingTemperatureC}°C</strong> (Hot-insulated)</span>
              </div>
              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-stone-50 border border-stone-200">
                <Award className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{food.cloudKitchen.fssaiLicense}</span>
              </div>
              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-stone-50 border border-stone-200">
                <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0" />
                <span>Kitchen Hygiene Rating: <strong>{food.cloudKitchen.hygieneRating} / 5.0 ★</strong></span>
              </div>
            </div>
          </div>

          {/* Cloud Kitchen Location & Delivery Radius */}
          <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200 text-xs space-y-2">
            <div className="flex items-center justify-between font-bold text-stone-800">
              <span className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-orange-600" />
                {food.cloudKitchen.name}
              </span>
              <span className="text-orange-700 bg-orange-100 px-2 py-0.5 rounded-md">
                Active Kitchen Hub
              </span>
            </div>
            <p className="text-stone-500">{food.cloudKitchen.address}</p>
            <div className="pt-2 border-t border-stone-200 flex items-center justify-between text-stone-600">
              <span>Distance to you: <strong>{food.cloudKitchen.distanceKm} km</strong></span>
              <span>Express delivery radius: <strong>Within {food.deliveryRadiusKm} km</strong></span>
            </div>
          </div>
        </div>

        {/* Modal Footer Pricing & Add to Cart */}
        <div className="p-5 bg-stone-50 border-t border-stone-200 flex items-center justify-between gap-4">
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-extrabold text-stone-900">
                ₹{food.resalePrice}
              </span>
              {savingsAmount > 0 && (
                <span className="text-sm text-stone-400 line-through">
                  ₹{food.originalPrice}
                </span>
              )}
            </div>
            {savingsAmount > 0 && (
              <span className="text-xs font-bold text-emerald-600">
                Save ₹{savingsAmount} ({food.resaleDiscountPercent}% OFF)
              </span>
            )}
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-stone-300 text-xs font-bold text-stone-700 hover:bg-white transition-colors"
            >
              Back to Dishes
            </button>

            <button
              id="modal-add-to-cart-btn"
              type="button"
              onClick={() => onAddToCart(food)}
              className="px-6 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold flex items-center gap-2 shadow-md active:scale-95 transition-all"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>
                {quantityInCart > 0 ? `Add Another (${quantityInCart} in cart)` : 'Add to Order'}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
