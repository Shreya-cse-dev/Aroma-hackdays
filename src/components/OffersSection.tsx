import React, { useState } from 'react';
import { FoodItem, Coupon } from '../types';
import { AVAILABLE_COUPONS } from '../data/coupons';
import {
  Tag,
  Percent,
  Copy,
  Check,
  Flame,
  Clock,
  Sparkles,
  ShoppingBag
} from 'lucide-react';

interface OffersSectionProps {
  onAddToCart: (food: FoodItem) => void;
  onInspect: (food: FoodItem) => void;
  flashDeals: FoodItem[];
  onApplyCoupon?: (coupon: Coupon) => void;
  appliedCouponCode?: string;
  onOpenCart?: () => void;
}

export const OffersSection: React.FC<OffersSectionProps> = ({
  onAddToCart,
  onInspect,
  flashDeals,
  onApplyCoupon,
  appliedCouponCode,
  onOpenCart,
}) => {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const coupons = [
    {
      code: 'ZERO50',
      title: 'Flat 50% OFF on Resale Batches',
      minOrder: 'Valid on cloud kitchen surplus batches (up to ₹120 off)',
      tag: 'Most Popular',
    },
    {
      code: 'AROMAFREE',
      title: 'Free Thermal Delivery + ₹25 OFF',
      minOrder: 'Waives express delivery fee + ₹25 food discount',
      tag: 'New User',
    },
    {
      code: 'RESCUE100',
      title: 'Flat ₹100 Eco-Warrior Discount',
      minOrder: 'Valid on orders over ₹249 (Rescue 2+ boxes)',
      tag: 'Zero Waste',
    },
  ];

  const handleApplyCoupon = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);

    const couponObj = AVAILABLE_COUPONS.find((c) => c.code === code);
    if (couponObj && onApplyCoupon) {
      onApplyCoupon(couponObj);
    }

    setTimeout(() => setCopiedCode(null), 2500);
  };

  return (
    <section id="offers" className="py-20 bg-stone-50 border-t border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-100 text-orange-800 text-xs font-bold uppercase tracking-wider mb-2">
              <Percent className="w-3.5 h-3.5 text-orange-600" />
              <span>Flash Resale Discounts & Offers</span>
            </div>
            <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-stone-900 tracking-tight">
              Exclusive Resale Deals of the Hour
            </h2>
            <p className="text-sm sm:text-base text-stone-600 mt-1">
              Limited kitchen batches approaching their prime holding window — discounted up to 55% for quick dispatch.
            </p>
          </div>

          <span className="text-xs font-semibold text-stone-500 bg-white px-3.5 py-1.5 rounded-xl border border-stone-200 w-fit shadow-2xs">
            ⏰ Batches refresh every 15 minutes
          </span>
        </div>

        {/* Coupons Banner Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
          {coupons.map((coupon) => {
            const isCurrentlyApplied = appliedCouponCode === coupon.code;

            return (
              <div
                key={coupon.code}
                className={`bg-white rounded-3xl p-5 border shadow-xs relative overflow-hidden flex flex-col justify-between transition-all ${
                  isCurrentlyApplied
                    ? 'border-emerald-500 ring-2 ring-emerald-500/20'
                    : 'border-orange-200/80 hover:border-orange-300'
                }`}
              >
                <div className="absolute top-0 right-0 transform translate-x-3 -translate-y-2 bg-orange-500 text-white text-[9px] font-extrabold uppercase px-4 py-1 rotate-12 shadow-xs">
                  {coupon.tag}
                </div>

                <div>
                  <div className="text-xs font-bold text-orange-600 uppercase tracking-wider mb-1 flex items-center gap-1">
                    <Tag className="w-3.5 h-3.5" />
                    Promo Code
                  </div>
                  <h4 className="font-display text-base font-bold text-stone-900 leading-snug mb-1">
                    {coupon.title}
                  </h4>
                  <p className="text-[11px] text-stone-500">
                    {coupon.minOrder}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between">
                  <span className="font-mono text-sm font-extrabold text-stone-800 bg-stone-100 px-2.5 py-1 rounded-lg border border-dashed border-stone-300">
                    {coupon.code}
                  </span>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => handleApplyCoupon(coupon.code)}
                      className={`inline-flex items-center gap-1 text-xs font-bold px-3 py-1.5 rounded-xl transition-all active:scale-95 shadow-2xs ${
                        isCurrentlyApplied
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                          : 'bg-orange-600 hover:bg-orange-700 text-white'
                      }`}
                    >
                      {isCurrentlyApplied ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-700" />
                          <span>Applied</span>
                        </>
                      ) : copiedCode === coupon.code ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-white" />
                          <span>Applied!</span>
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>Apply Code</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Flash Deals Horizontal Cards */}
        <div className="space-y-4">
          <h3 className="font-display text-xl font-bold text-stone-900 flex items-center gap-2">
            <Flame className="w-5 h-5 text-orange-600" />
            <span>Urgent Resale Batches — Final Call (50%+ OFF)</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {flashDeals.slice(0, 3).map((food) => (
              <div
                key={food.id}
                className="bg-white rounded-3xl border border-stone-200 p-4 shadow-xs hover:shadow-lg transition-all flex flex-col justify-between"
              >
                <div className="flex gap-4">
                  <img
                    src={food.imageUrl}
                    alt={food.name}
                    className="w-24 h-24 rounded-2xl object-cover shrink-0 cursor-pointer hover:opacity-90"
                    onClick={() => onInspect(food)}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 mb-1">
                      <span className="px-2 py-0.5 rounded-md bg-orange-600 text-white text-[10px] font-extrabold uppercase">
                        {food.resaleDiscountPercent}% OFF
                      </span>
                      <span className="text-[10px] text-stone-500 font-medium">
                        {food.cloudKitchen.locality}
                      </span>
                    </div>

                    <h4
                      onClick={() => onInspect(food)}
                      className="font-bold text-sm text-stone-900 truncate cursor-pointer hover:text-orange-600"
                    >
                      {food.name}
                    </h4>

                    <div className="mt-1 flex items-center gap-2 text-[11px] text-stone-500">
                      <span className="flex items-center gap-0.5 text-amber-700 font-medium">
                        <Clock className="w-3 h-3" /> {food.preparationTime}
                      </span>
                    </div>

                    <div className="mt-1 text-[10px] text-red-600 font-bold">
                      🔥 Only {food.availableUnits} boxes left!
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between">
                  <div>
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-lg font-extrabold text-stone-900">
                        ₹{food.resalePrice}
                      </span>
                      <span className="text-xs text-stone-400 line-through">
                        ₹{food.originalPrice}
                      </span>
                    </div>
                    <span className="text-[10px] font-bold text-emerald-700">
                      Save ₹{food.originalPrice - food.resalePrice}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => onAddToCart(food)}
                    className="px-3.5 py-1.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition-all active:scale-95"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>Claim Now</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
