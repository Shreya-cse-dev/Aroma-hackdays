import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { CartItem, OrderRecord, Coupon } from '../types';
import { AVAILABLE_COUPONS, computeCartCalculation } from '../data/coupons';
import {
  X,
  MapPin,
  CreditCard,
  CheckCircle2,
  ShieldCheck,
  Bike,
  Sparkles,
  Lock,
  ArrowRight,
  Clock,
  Tag,
  Check,
  Percent,
  Leaf
} from 'lucide-react';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  skipCutlery: boolean;
  onOrderPlaced: (order: OrderRecord) => void;
  selectedCity: string;
  userAddress?: string;
  userPincode?: string;
  appliedCoupon: Coupon | null;
  onApplyCoupon: (coupon: Coupon | null) => void;
  userDistanceKm?: number;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  items,
  skipCutlery,
  onOrderPlaced,
  selectedCity,
  userAddress,
  userPincode,
  appliedCoupon,
  onApplyCoupon,
  userDistanceKm = 1.8,
}) => {
  const [step, setStep] = useState<'details' | 'success'>('details');
  const [name, setName] = useState('Ananya Sharma');
  const [phone, setPhone] = useState('+91 98765 43210');
  const [address, setAddress] = useState(userAddress || 'Flat 402, Sai Residency, 12th Main, Indiranagar');
  const [pincode, setPincode] = useState(userPincode || '560038');
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card' | 'cod'>('upi');
  const [placedOrder, setPlacedOrder] = useState<OrderRecord | null>(null);

  // Coupon state within checkout modal
  const [couponInput, setCouponInput] = useState('');
  const [couponFeedback, setCouponFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  React.useEffect(() => {
    if (userAddress) setAddress(userAddress);
    if (userPincode) setPincode(userPincode);
  }, [userAddress, userPincode]);

  if (!isOpen) return null;

  const totalItemsCount = items.reduce((sum, i) => sum + i.quantity, 0);

  // Mathematically verified calculation engine
  const calc = computeCartCalculation(items, appliedCoupon, userDistanceKm, skipCutlery);

  const handleApplyCoupon = (code: string) => {
    const cleanCode = code.trim().toUpperCase();
    if (!cleanCode) return;

    const matched = AVAILABLE_COUPONS.find((c) => c.code.toUpperCase() === cleanCode);
    if (!matched) {
      setCouponFeedback({
        type: 'error',
        message: `Invalid code "${cleanCode}". Try ZERO50 or RESCUE100.`,
      });
      return;
    }

    if (calc.resaleFoodSubtotal < matched.minOrder) {
      setCouponFeedback({
        type: 'error',
        message: `Add ₹${matched.minOrder - calc.resaleFoodSubtotal} more for ${matched.code} (Min order ₹${matched.minOrder})`,
      });
      return;
    }

    onApplyCoupon(matched);
    setCouponInput('');
    setCouponFeedback({
      type: 'success',
      message: `Coupon ${matched.code} applied! Saved ₹${matched.discountValue}${matched.discountType === 'percentage' ? '%' : ''}.`,
    });
  };

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();

    // Trigger celebratory confetti
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#EA580C', '#10B981', '#F59E0B', '#3B82F6'],
    });

    const newOrder: OrderRecord = {
      id: `ARM-${Math.floor(100000 + Math.random() * 900000)}`,
      items: [...items],
      totalAmount: calc.grandTotal,
      totalSaved: calc.totalSaved,
      couponCode: appliedCoupon?.code,
      couponDiscount: calc.couponDiscount,
      wastePreventedKg: Number((totalItemsCount * 0.45).toFixed(1)),
      createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'Inspecting Batch',
      estimatedDeliveryTime: '18 - 22 mins',
      address: `${address}, ${selectedCity} - ${pincode}`,
      deliveryOtp: String(Math.floor(1000 + Math.random() * 9000)),
      kitchenName: items[0]?.food.cloudKitchen.name || 'Aroma Partner Cloud Kitchen',
    };

    setPlacedOrder(newOrder);
    setStep('success');
    onOrderPlaced(newOrder);
  };

  return (
    <div
      id="checkout-modal-backdrop"
      className="fixed inset-0 z-50 bg-black/65 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-in fade-in"
      onClick={onClose}
    >
      <div
        id="checkout-modal-card"
        className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-stone-200 animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Bar */}
        <div className="p-4 sm:p-5 border-b border-stone-100 flex items-center justify-between bg-stone-50">
          <div>
            <h3 className="font-display text-base font-bold text-stone-900">
              {step === 'details' ? 'Fast Express Checkout' : 'Order Confirmed!'}
            </h3>
            <p className="text-xs text-stone-500">
              {step === 'details'
                ? 'Thermal insulated express delivery from nearby cloud kitchen'
                : 'Your fresh resale batch has been claimed & locked'}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl text-stone-400 hover:text-stone-700 hover:bg-stone-200/70 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {step === 'details' ? (
          <form onSubmit={handlePlaceOrder} className="p-5 sm:p-6 space-y-5">
            {/* Delivery Address Details */}
            <div className="space-y-3">
              <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-stone-500">
                <MapPin className="w-4 h-4 text-orange-600" />
                <span>Delivery Address ({selectedCity})</span>
              </div>

              <div className="space-y-2">
                <div>
                  <label className="text-[11px] font-semibold text-stone-600 block mb-0.5">
                    Contact Name & Mobile
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Your Name"
                      className="px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:border-orange-500"
                    />
                    <input
                      type="text"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 Mobile Number"
                      className="px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:border-orange-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-stone-600 block mb-0.5">
                    Complete Address
                  </label>
                  <input
                    type="text"
                    required
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="House/Flat, Street, Locality"
                    className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:border-orange-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[11px] font-semibold text-stone-600 block mb-0.5">
                      Pincode
                    </label>
                    <input
                      type="text"
                      required
                      value={pincode}
                      onChange={(e) => setPincode(e.target.value)}
                      placeholder="PIN Code"
                      className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:border-orange-500"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-stone-600 block mb-0.5">
                      City Hub
                    </label>
                    <input
                      type="text"
                      readOnly
                      value={selectedCity}
                      className="w-full px-3 py-2 text-xs bg-stone-100 border border-stone-200 rounded-xl text-stone-600 cursor-not-allowed"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Coupon / Promo Code at Checkout */}
            <div className="bg-amber-50/60 p-3 rounded-2xl border border-amber-200/80 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-amber-950 flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5 text-orange-600" />
                  Promo Coupon Code
                </span>
                {appliedCoupon && (
                  <button
                    type="button"
                    onClick={() => {
                      onApplyCoupon(null);
                      setCouponFeedback(null);
                    }}
                    className="text-[11px] font-bold text-red-600 hover:text-red-700"
                  >
                    Remove
                  </button>
                )}
              </div>

              {appliedCoupon ? (
                <div className="flex items-center justify-between bg-white px-3 py-1.5 rounded-xl border border-emerald-300 text-xs">
                  <span className="font-mono font-bold text-emerald-800 flex items-center gap-1">
                    <Check className="w-3 h-3 text-emerald-600" />
                    {appliedCoupon.code} Applied
                  </span>
                  <span className="font-bold text-emerald-700">
                    - ₹{calc.couponDiscount}
                  </span>
                </div>
              ) : (
                <div className="space-y-1.5">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={couponInput}
                      onChange={(e) => {
                        setCouponInput(e.target.value);
                        setCouponFeedback(null);
                      }}
                      placeholder="Promo code (e.g. ZERO50)"
                      className="flex-1 px-3 py-1.5 text-xs bg-white border border-stone-300 rounded-xl uppercase font-mono focus:outline-none focus:border-orange-500"
                    />
                    <button
                      type="button"
                      onClick={() => handleApplyCoupon(couponInput)}
                      className="px-3 py-1.5 rounded-xl bg-stone-900 hover:bg-orange-600 text-white text-xs font-bold transition-colors"
                    >
                      Apply
                    </button>
                  </div>
                  <div className="flex gap-1.5">
                    {AVAILABLE_COUPONS.slice(0, 3).map((cp) => (
                      <button
                        key={cp.code}
                        type="button"
                        onClick={() => handleApplyCoupon(cp.code)}
                        className="text-[9px] font-bold px-2 py-0.5 rounded-lg bg-white border border-amber-200 text-stone-700 hover:text-orange-600"
                      >
                        {cp.code}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {couponFeedback && (
                <p className={`text-[10px] font-medium ${couponFeedback.type === 'success' ? 'text-emerald-700' : 'text-red-600'}`}>
                  {couponFeedback.message}
                </p>
              )}
            </div>

            {/* Payment Method Selector */}
            <div className="space-y-2 pt-1 border-t border-stone-100">
              <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-stone-500">
                <CreditCard className="w-4 h-4 text-emerald-600" />
                <span>Payment Mode</span>
              </div>

              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'upi', label: 'UPI / GPay', desc: 'Instant & Fast' },
                  { id: 'card', label: 'Cards / Net', desc: 'Visa, MC, RuPay' },
                  { id: 'cod', label: 'Pay on Delivery', desc: 'Cash / Scan QR' },
                ].map((mode) => (
                  <button
                    key={mode.id}
                    type="button"
                    onClick={() => setPaymentMethod(mode.id as any)}
                    className={`p-2.5 rounded-xl border text-left transition-all ${
                      paymentMethod === mode.id
                        ? 'border-orange-500 bg-orange-50 text-stone-900 ring-2 ring-orange-500/10'
                        : 'border-stone-200 bg-white text-stone-600 hover:bg-stone-50'
                    }`}
                  >
                    <div className="text-xs font-bold">{mode.label}</div>
                    <div className="text-[10px] text-stone-400">{mode.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Price Preview (Mathematically Valid) */}
            <div className="bg-stone-50 p-3.5 rounded-2xl border border-stone-200 text-xs space-y-1.5">
              <div className="flex justify-between font-medium text-stone-500">
                <span>Standard Items Total ({totalItemsCount} items)</span>
                <span>₹{calc.originalTotal}</span>
              </div>

              {calc.resaleDiscount > 0 && (
                <div className="flex justify-between font-semibold text-emerald-700">
                  <span className="flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                    Smart Resale Batch Discount
                  </span>
                  <span>- ₹{calc.resaleDiscount}</span>
                </div>
              )}

              <div className="flex justify-between text-stone-700 font-semibold py-0.5 border-t border-dashed border-stone-200">
                <span>Food Subtotal</span>
                <span>₹{calc.resaleFoodSubtotal}</span>
              </div>

              {calc.couponDiscount > 0 && (
                <div className="flex justify-between font-bold text-emerald-700">
                  <span>Promo Code ({appliedCoupon?.code})</span>
                  <span>- ₹{calc.couponDiscount}</span>
                </div>
              )}

              <div className="flex justify-between text-stone-600">
                <span>Thermal Delivery & Packaging</span>
                <span>
                  {calc.deliveryFee + calc.packagingFee === 0 ? (
                    <span className="flex items-center gap-1">
                      <span className="line-through text-stone-400">₹{calc.standardDeliveryFee + 15}</span>
                      <strong className="text-emerald-700">FREE</strong>
                    </span>
                  ) : (
                    `₹${calc.deliveryFee + calc.packagingFee}`
                  )}
                </span>
              </div>

              <div className="pt-2 border-t-2 border-stone-300 flex justify-between font-extrabold text-sm text-stone-900">
                <div>
                  <span>Total Payable</span>
                  <div className="text-[10px] text-stone-500 font-normal">
                    Includes all verified discounts
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-base text-orange-600 font-black">
                    ₹{calc.grandTotal}
                  </span>
                  {calc.totalSaved > 0 && (
                    <div className="text-[10px] text-emerald-700 font-bold">
                      Saved ₹{calc.totalSaved}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <button
              id="confirm-order-submit-btn"
              type="submit"
              className="w-full py-3.5 rounded-2xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-sm shadow-md transition-all active:scale-98 flex items-center justify-center gap-2"
            >
              <Lock className="w-4 h-4" />
              <span>Confirm & Place Order (₹{calc.grandTotal})</span>
            </button>
          </form>
        ) : (
          /* Order Confirmed View */
          <div className="p-6 text-center space-y-5">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-sm animate-in zoom-in">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <h4 className="font-display text-xl font-extrabold text-stone-900">
                Order Placed Successfully!
              </h4>
              <p className="text-xs text-stone-500">
                Order ID: <strong className="text-stone-800">{placedOrder?.id}</strong>
              </p>
            </div>

            {/* Delivery OTP Security Badge */}
            <div className="bg-orange-50 border border-orange-200 rounded-2xl p-4 text-center">
              <span className="text-[11px] font-bold text-orange-800 uppercase tracking-wider block">
                Thermal Handover Delivery OTP
              </span>
              <div className="text-3xl font-mono font-extrabold text-orange-600 tracking-widest my-1">
                {placedOrder?.deliveryOtp}
              </div>
              <p className="text-[10px] text-orange-700">
                Share this 4-digit code with your express delivery rider to verify the tamper seal.
              </p>
            </div>

            {/* Status & Kitchen Card */}
            <div className="bg-stone-50 rounded-2xl p-4 text-left text-xs space-y-2 border border-stone-200">
              <div className="flex items-center justify-between">
                <span className="text-stone-500">Kitchen:</span>
                <span className="font-bold text-stone-800">{placedOrder?.kitchenName}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-stone-500">Total Paid:</span>
                <span className="font-bold text-stone-900 text-sm">₹{placedOrder?.totalAmount}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-stone-500">Total Savings Kept:</span>
                <span className="font-bold text-emerald-700">
                  ₹{placedOrder?.totalSaved} Saved!
                </span>
              </div>
              {placedOrder?.couponCode && (
                <div className="flex items-center justify-between text-emerald-800">
                  <span>Coupon Applied:</span>
                  <span className="font-mono font-bold">
                    {placedOrder.couponCode} (- ₹{placedOrder.couponDiscount})
                  </span>
                </div>
              )}
              <div className="flex items-center justify-between">
                <span className="text-stone-500">Estimated Delivery:</span>
                <span className="font-bold text-emerald-600 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" /> 18 - 22 mins (Thermal bag)
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-stone-500">Food Waste Prevented:</span>
                <span className="font-bold text-emerald-700">
                  ~{placedOrder?.wastePreventedKg} kg Saved! 🌱
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="w-full py-3 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold transition-colors shadow-xs"
            >
              Track in 'My Orders' Drawer
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
