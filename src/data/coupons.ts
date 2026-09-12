import { Coupon } from '../types';

export const AVAILABLE_COUPONS: Coupon[] = [
  {
    code: 'ZERO50',
    title: 'Flat 50% OFF (Up to ₹120)',
    discountType: 'percentage',
    discountValue: 50,
    maxDiscount: 120,
    minOrder: 199,
    description: 'Instant 50% discount on cloud kitchen surplus batches',
  },
  {
    code: 'RESCUE100',
    title: 'Flat ₹100 Eco-Warrior Discount',
    discountType: 'flat',
    discountValue: 100,
    minOrder: 249,
    description: 'Flat ₹100 off when rescuing 2+ food boxes',
  },
  {
    code: 'AROMAFREE',
    title: 'Free Thermal Delivery + ₹25 OFF',
    discountType: 'free_delivery',
    discountValue: 25,
    minOrder: 0,
    description: 'Free insulated delivery plus ₹25 extra food discount',
  },
  {
    code: 'WELCOME50',
    title: 'Flat ₹50 First-Order Welcome',
    discountType: 'flat',
    discountValue: 50,
    minOrder: 0,
    description: 'Instant ₹50 off on your first zero-waste order',
  },
];

export interface CartCalculation {
  originalTotal: number;
  resaleFoodSubtotal: number;
  resaleDiscount: number;
  couponDiscount: number;
  netFoodTotal: number;
  standardDeliveryFee: number;
  deliveryFee: number;
  deliverySaved: number;
  packagingFee: number;
  packagingSaved: number;
  grandTotal: number;
  totalSaved: number;
  effectiveDiscountPercent: number;
  isFreeDelivery: boolean;
  deliveryFreeReason: string | null;
}

export function computeCartCalculation(
  items: { food: { originalPrice: number; resalePrice: number }; quantity: number }[],
  appliedCoupon: Coupon | null,
  userDistanceKm: number = 1.8,
  skipCutlery: boolean = true
): CartCalculation {
  const originalTotal = items.reduce(
    (sum, i) => sum + i.food.originalPrice * i.quantity,
    0
  );

  const resaleFoodSubtotal = items.reduce(
    (sum, i) => sum + i.food.resalePrice * i.quantity,
    0
  );

  const resaleDiscount = Math.max(0, originalTotal - resaleFoodSubtotal);

  // Compute coupon discount
  let couponDiscount = 0;
  if (appliedCoupon && resaleFoodSubtotal >= appliedCoupon.minOrder) {
    if (appliedCoupon.discountType === 'percentage') {
      const pct = Math.round((resaleFoodSubtotal * appliedCoupon.discountValue) / 100);
      couponDiscount = appliedCoupon.maxDiscount ? Math.min(pct, appliedCoupon.maxDiscount) : pct;
    } else if (appliedCoupon.discountType === 'flat') {
      couponDiscount = Math.min(appliedCoupon.discountValue, resaleFoodSubtotal);
    } else if (appliedCoupon.discountType === 'free_delivery') {
      couponDiscount = Math.min(appliedCoupon.discountValue, resaleFoodSubtotal);
    }
  }

  const netFoodTotal = Math.max(0, resaleFoodSubtotal - couponDiscount);

  // Delivery calculation: Express zone (<= 3.0km) is FREE delivery, or subtotal >= 299, or AROMAFREE coupon
  const standardDeliveryFee = 25;
  let isFreeDelivery = false;
  let deliveryFreeReason: string | null = null;

  if (appliedCoupon?.code === 'AROMAFREE') {
    isFreeDelivery = true;
    deliveryFreeReason = 'AROMAFREE Coupon';
  } else if (userDistanceKm <= 3.0) {
    isFreeDelivery = true;
    deliveryFreeReason = 'Express Zone (< 3 km)';
  } else if (resaleFoodSubtotal >= 299) {
    isFreeDelivery = true;
    deliveryFreeReason = 'Order Above ₹299';
  }

  const deliveryFee = items.length === 0 ? 0 : isFreeDelivery ? 0 : standardDeliveryFee;
  const deliverySaved = items.length === 0 ? 0 : isFreeDelivery ? standardDeliveryFee : 0;

  // Packaging fee: Opt-out of cutlery (skipCutlery) waives the packaging fee (Zero-waste rebate)
  const standardPackagingFee = 15;
  const packagingFee = items.length === 0 ? 0 : skipCutlery ? 0 : standardPackagingFee;
  const packagingSaved = items.length === 0 ? 0 : skipCutlery ? standardPackagingFee : 0;

  // Grand total payable
  const grandTotal = items.length === 0 ? 0 : netFoodTotal + deliveryFee + packagingFee;

  // Total amount saved by customer: Resale discount + coupon discount + waived delivery + waived packaging
  const totalSaved = items.length === 0 ? 0 : resaleDiscount + couponDiscount + deliverySaved + packagingSaved;

  const effectiveDiscountPercent =
    originalTotal > 0 ? Math.round((totalSaved / (originalTotal + standardDeliveryFee + standardPackagingFee)) * 100) : 0;

  return {
    originalTotal,
    resaleFoodSubtotal,
    resaleDiscount,
    couponDiscount,
    netFoodTotal,
    standardDeliveryFee,
    deliveryFee,
    deliverySaved,
    packagingFee,
    packagingSaved,
    grandTotal,
    totalSaved,
    effectiveDiscountPercent,
    isFreeDelivery,
    deliveryFreeReason,
  };
}
