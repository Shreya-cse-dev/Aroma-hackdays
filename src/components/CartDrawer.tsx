import React, { useState } from 'react';
import { CartItem, FoodItem, Coupon } from '../types';
import { AVAILABLE_COUPONS, computeCartCalculation } from '../data/coupons';
import {
  X,
  Plus,
  Minus,
  ArrowRight,
  ShieldCheck,
  ShoppingBag,
  Leaf,
  Bike,
  Tag,
  Check,
  Percent,
  Sparkles
} from 'lucide-react';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onAddToCart: (food: FoodItem) => void;
  onRemoveFromCart: (foodId: string) => void;
  onClearCart: () => void;
  onProceedToCheckout: (skipCutlery: boolean) => void;
  appliedCoupon: Coupon | null;
  onApplyCoupon: (coupon: Coupon | null) => void;
  userDistanceKm?: number;
  skipCutlery: boolean;
  onToggleSkipCutlery: (val: boolean) => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onAddToCart,
  onRemoveFromCart,
  onClearCart,
  onProceedToCheckout,
  appliedCoupon,
  onApplyCoupon,
  userDistanceKm = 1.8,
  skipCutlery,
  onToggleSkipCutlery,
}) => {
  const [couponInput, setCouponInput] = useState('');
  const [couponFeedback, setCouponFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  if (!isOpen) return null;

  const totalItemsCount = items.reduce((sum, i) => sum + i.quantity, 0);

  // Compute mathematically verified transaction breakdown
  const calc = computeCartCalculation(items, appliedCoupon, userDistanceKm, skipCutlery);
  const wasteSavedKg = (totalItemsCount * 0.45).toFixed(1);

  const handleApplyCouponCode = (codeToApply: string) => {
    const cleanCode = codeToApply.trim().toUpperCase();
    if (!cleanCode) {
      setCouponFeedback({ type: 'error', message: 'Please enter a coupon code' });
      return;
    }

    const matched = AVAILABLE_COUPONS.find((c) => c.code.toUpperCase() === cleanCode);
    if (!matched) {
      setCouponFeedback({
        type: 'error',
        message: `Invalid code "${cleanCode}". Try ZERO50, RESCUE100, or AROMAFREE.`,
      });
      return;
    }

    if (calc.resaleFoodSubtotal < matched.minOrder) {
      const shortfall = matched.minOrder - calc.resaleFoodSubtotal;
      setCouponFeedback({
        type: 'error',
        message: `Add ₹${shortfall} more to unlock ${matched.code} (Min order ₹${matched.minOrder})`,
      });
      return;
    }

    onApplyCoupon(matched);
    setCouponInput('');
    setCouponFeedback({
      type: 'success',
      message: `Code ${matched.code} applied! Instant discount added.`,
    });
  };

  const handleRemoveCoupon = () => {
    onApplyCoupon(null);
    setCouponFeedback(null);
  };

  return (
    <div
      id="cart-drawer-backdrop"
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex justify-end animate-in fade-in"
      onClick={onClose}
    >
      <div
        id="cart-drawer-panel"
        className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-250"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-stone-200 flex items-center justify-between bg-stone-50/70">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-orange-600 text-white flex items-center justify-center shadow-xs">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-display text-base font-bold text-stone-900">
                Aroma Order Bag
              </h2>
              <span className="text-xs text-stone-500 font-medium">
                {totalItemsCount} {totalItemsCount === 1 ? 'item' : 'items'} in order
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {items.length > 0 && (
              <button
                type="button"
                onClick={onClearCart}
                className="text-xs text-stone-400 hover:text-red-600 font-medium px-2 py-1 rounded-lg transition-colors"
              >
                Clear
              </button>
            )}
            <button
              id="close-cart-btn"
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl text-stone-400 hover:text-stone-700 hover:bg-stone-200/60 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Cart Content */}
        {items.length === 0 ? (
          <div className="flex-1 p-8 flex flex-col items-center justify-center text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-orange-50 border border-orange-100 flex items-center justify-center text-orange-400">
              <ShoppingBag className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <h3 className="font-display text-base font-bold text-stone-800">
                Your Aroma Bag is Empty
              </h3>
              <p className="text-xs text-stone-500 max-w-xs">
                Explore delicious freshly prepared meals and smart resale batches from cloud kitchens nearby.
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold transition-colors shadow-xs"
            >
              Browse Food Batches
            </button>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-5">
            {/* Impact & Verified Savings Banner */}
            {calc.totalSaved > 0 && (
              <div className="bg-emerald-50 border border-emerald-200/80 rounded-2xl p-3.5 space-y-1">
                <div className="flex items-center justify-between text-xs font-bold text-emerald-800">
                  <div className="flex items-center gap-1.5">
                    <Leaf className="w-4 h-4 text-emerald-600" />
                    <span>Total Discount & Eco Savings</span>
                  </div>
                  <span className="bg-emerald-600 text-white text-[10px] px-2 py-0.5 rounded-full font-extrabold">
                    {calc.effectiveDiscountPercent}% LESS
                  </span>
                </div>
                <p className="text-xs text-emerald-700">
                  You are saving <strong>₹{calc.totalSaved}</strong> off regular price and preventing approximately{' '}
                  <strong>{wasteSavedKg} kg</strong> of fresh kitchen meals from going to waste!
                </p>
              </div>
            )}

            {/* List of Cart Items */}
            <div className="space-y-3">
              {items.map(({ food, quantity }) => (
                <div
                  key={food.id}
                  className="p-3 bg-stone-50 rounded-2xl border border-stone-200/90 flex gap-3 items-center justify-between"
                >
                  <img
                    src={food.imageUrl}
                    alt={food.name}
                    className="w-14 h-14 rounded-xl object-cover shrink-0"
                  />

                  <div className="flex-1 min-w-0 pr-2">
                    <div className="flex items-center gap-1.5">
                      <div
                        className={`w-3 h-3 rounded-xs border p-0.5 flex items-center justify-center shrink-0 ${
                          food.isVeg ? 'border-emerald-600' : 'border-red-600'
                        }`}
                      >
                        <div
                          className={`w-1.5 h-1.5 rounded-full ${
                            food.isVeg ? 'bg-emerald-600' : 'bg-red-600'
                          }`}
                        />
                      </div>
                      <h4 className="font-bold text-xs text-stone-900 truncate">
                        {food.name}
                      </h4>
                    </div>

                    <div className="text-[11px] text-stone-500 mt-0.5 flex items-center gap-2">
                      <span className="font-bold text-stone-800">₹{food.resalePrice}</span>
                      {food.originalPrice > food.resalePrice && (
                        <span className="line-through text-stone-400 text-[10px]">
                          ₹{food.originalPrice}
                        </span>
                      )}
                      {food.isSmartResale && (
                        <span className="text-orange-600 font-bold text-[10px] bg-orange-100/70 px-1.5 py-0.2 rounded">
                          {food.resaleDiscountPercent}% OFF
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Quantity controls */}
                  <div className="flex items-center gap-1.5 bg-white border border-stone-200 rounded-xl px-2 py-1 shrink-0 shadow-xs">
                    <button
                      type="button"
                      onClick={() => onRemoveFromCart(food.id)}
                      className="p-1 hover:bg-stone-100 rounded text-stone-600 transition-colors"
                      title="Decrease"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="text-xs font-bold min-w-3 text-center text-stone-900">
                      {quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => onAddToCart(food)}
                      className="p-1 hover:bg-stone-100 rounded text-stone-600 transition-colors"
                      title="Increase"
                      disabled={food.isSmartResale && quantity >= food.availableUnits}
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Coupons & Promo Codes Section */}
            <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200/80 space-y-2.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-amber-950 flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5 text-amber-600" />
                  Apply Discount Promo Code
                </span>
                {appliedCoupon && (
                  <button
                    type="button"
                    onClick={handleRemoveCoupon}
                    className="text-[11px] font-bold text-red-600 hover:text-red-700"
                  >
                    Remove
                  </button>
                )}
              </div>

              {appliedCoupon ? (
                <div className="flex items-center justify-between bg-white px-3 py-2 rounded-xl border border-emerald-300 shadow-2xs">
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center">
                      <Check className="w-3 h-3" />
                    </div>
                    <div>
                      <span className="font-mono text-xs font-extrabold text-emerald-800">
                        {appliedCoupon.code}
                      </span>
                      <span className="text-[11px] text-stone-600 ml-2">
                        {appliedCoupon.title}
                      </span>
                    </div>
                  </div>
                  <span className="text-xs font-extrabold text-emerald-700">
                    - ₹{calc.couponDiscount}
                  </span>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <input
                      id="cart-coupon-input"
                      type="text"
                      value={couponInput}
                      onChange={(e) => {
                        setCouponInput(e.target.value);
                        setCouponFeedback(null);
                      }}
                      placeholder="Enter promo code (e.g. ZERO50)"
                      className="flex-1 px-3 py-1.5 text-xs bg-white border border-stone-300 rounded-xl uppercase tracking-wider font-mono focus:outline-none focus:border-orange-500"
                    />
                    <button
                      id="apply-coupon-btn"
                      type="button"
                      onClick={() => handleApplyCouponCode(couponInput)}
                      className="px-3.5 py-1.5 rounded-xl bg-stone-900 hover:bg-orange-600 text-white text-xs font-bold transition-colors shadow-xs"
                    >
                      Apply
                    </button>
                  </div>

                  {/* Clickable Quick Coupon Chips */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {AVAILABLE_COUPONS.map((cp) => (
                      <button
                        key={cp.code}
                        type="button"
                        onClick={() => handleApplyCouponCode(cp.code)}
                        className="text-[10px] font-bold px-2 py-1 rounded-lg bg-white border border-amber-200 text-stone-700 hover:border-orange-500 hover:text-orange-600 transition-colors flex items-center gap-1 shadow-2xs"
                      >
                        <Percent className="w-2.5 h-2.5 text-orange-600" />
                        <span>{cp.code}</span>
                        <span className="text-stone-400 font-normal">
                          ({cp.code === 'ZERO50' ? '50% off' : cp.code === 'RESCUE100' ? '₹100 off' : 'Free deliv'})
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {couponFeedback && (
                <p
                  className={`text-[11px] font-medium ${
                    couponFeedback.type === 'success' ? 'text-emerald-700' : 'text-red-600'
                  }`}
                >
                  {couponFeedback.message}
                </p>
              )}
            </div>

            {/* Eco Cutlery Checkbox */}
            <div className="p-3 rounded-xl bg-stone-50 border border-stone-200 flex items-start gap-2.5">
              <input
                id="eco-cutlery-checkbox"
                type="checkbox"
                checked={skipCutlery}
                onChange={(e) => onToggleSkipCutlery(e.target.checked)}
                className="mt-0.5 rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4 cursor-pointer"
              />
              <label htmlFor="eco-cutlery-checkbox" className="text-xs text-stone-700 cursor-pointer select-none">
                <div className="flex items-center justify-between">
                  <span className="font-bold">Opt-out of disposable plastic cutlery</span>
                  <span className="text-[10px] text-emerald-700 font-bold bg-emerald-100 px-1.5 py-0.2 rounded">
                    Save ₹15
                  </span>
                </div>
                <span className="text-stone-500 text-[11px] block mt-0.5">
                  Packaging fee waived to FREE when opting out of single-use plastic.
                </span>
              </label>
            </div>

            {/* Mathematically Verified Bill Summary */}
            <div className="space-y-2 pt-3 border-t border-stone-200 text-xs">
              <div className="font-bold text-stone-900 pb-1 flex items-center justify-between">
                <span>Bill Breakdown</span>
                <span className="text-[10px] text-stone-400 font-normal">Transparent & Verified</span>
              </div>

              {/* 1. Original MRP Value */}
              <div className="flex justify-between text-stone-500">
                <span>Standard Menu Value</span>
                <span>₹{calc.originalTotal}</span>
              </div>

              {/* 2. Smart Resale Discount (Subtracted) */}
              {calc.resaleDiscount > 0 && (
                <div className="flex justify-between text-emerald-700 font-semibold">
                  <span className="flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                    Smart Resale Batch Discount
                  </span>
                  <span>- ₹{calc.resaleDiscount}</span>
                </div>
              )}

              {/* Subtotal after Resale */}
              <div className="flex justify-between text-stone-700 font-semibold py-0.5 border-t border-dashed border-stone-200">
                <span>Food Subtotal</span>
                <span>₹{calc.resaleFoodSubtotal}</span>
              </div>

              {/* 3. Coupon Promo Code Discount (Subtracted) */}
              {calc.couponDiscount > 0 && (
                <div className="flex justify-between text-emerald-700 font-bold">
                  <span className="flex items-center gap-1">
                    <Tag className="w-3.5 h-3.5 text-emerald-600" />
                    Promo Code ({appliedCoupon?.code})
                  </span>
                  <span>- ₹{calc.couponDiscount}</span>
                </div>
              )}

              {/* 4. Thermal Insulated Delivery */}
              <div className="flex justify-between text-stone-600">
                <span className="flex items-center gap-1">
                  <Bike className="w-3.5 h-3.5 text-stone-400" />
                  Thermal Insulated Delivery
                </span>
                <span>
                  {calc.deliveryFee === 0 ? (
                    <span className="flex items-center gap-1">
                      <span className="line-through text-stone-400">₹{calc.standardDeliveryFee}</span>
                      <strong className="text-emerald-700">FREE</strong>
                      <span className="text-[10px] text-emerald-600 font-medium">({calc.deliveryFreeReason})</span>
                    </span>
                  ) : (
                    `₹${calc.deliveryFee}`
                  )}
                </span>
              </div>

              {/* 5. FSSAI Tamper-Seal Packaging */}
              <div className="flex justify-between text-stone-600">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  FSSAI Tamper-Seal Packaging
                </span>
                <span>
                  {calc.packagingFee === 0 ? (
                    <span className="flex items-center gap-1">
                      <span className="line-through text-stone-400">₹15</span>
                      <strong className="text-emerald-700">FREE</strong>
                      <span className="text-[10px] text-emerald-600 font-medium">(Zero-Waste)</span>
                    </span>
                  ) : (
                    `₹${calc.packagingFee}`
                  )}
                </span>
              </div>

              {/* 6. Grand Total (Mathematically Valid Result) */}
              <div className="pt-2 border-t-2 border-stone-300 flex justify-between font-extrabold text-sm text-stone-900">
                <div>
                  <span>Total Payable</span>
                  <div className="text-[10px] text-stone-500 font-normal">
                    Inclusive of all taxes & verified discounts
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-lg text-orange-600 font-black">
                    ₹{calc.grandTotal}
                  </span>
                  {calc.originalTotal > calc.grandTotal && (
                    <div className="text-[10px] text-emerald-700 font-bold">
                      Saved ₹{calc.totalSaved} today
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Footer Proceed Button */}
        {items.length > 0 && (
          <div className="p-4 sm:p-5 border-t border-stone-200 bg-white">
            <button
              id="proceed-checkout-btn"
              type="button"
              onClick={() => onProceedToCheckout(skipCutlery)}
              className="w-full py-3.5 rounded-2xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-sm shadow-md hover:shadow-lg transition-all active:scale-98 flex items-center justify-center gap-2"
            >
              <span>Proceed to Checkout • ₹{calc.grandTotal}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <div className="mt-2 text-center text-[10px] text-stone-400 flex items-center justify-center gap-1">
              <ShieldCheck className="w-3 h-3 text-emerald-600" />
              <span>100% Safe & Inspected Cloud Kitchen Delivery</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
