export interface CloudKitchen {
  id: string;
  name: string;
  locality: string;
  city: string;
  hygieneRating: number; // e.g. 4.9
  fssaiLicense: string;
  distanceKm: number;
  openBatchesCount: number;
  specialty: string;
  address: string;
}

export interface FoodItem {
  id: string;
  name: string;
  description: string;
  category: 'Biryani' | 'Pizza' | 'Burger' | 'Momos' | 'Sandwich' | 'Pasta' | 'Desserts' | 'Healthy food' | 'Rolls & Bowls';
  isVeg: boolean;
  isSmartResale: boolean; // true = smart resale surplus, false = made-to-order fresh
  originalPrice: number;
  resalePrice: number;
  resaleDiscountPercent: number;
  preparationTime: string; // e.g., "18 mins ago"
  prepTimestamp: string; // e.g., "1:15 PM"
  maxHoldMinutes: number; // e.g., 75 mins max hold
  estimatedDeliveryMinutes: string; // e.g. "15 - 22 mins"
  deliveryRadiusKm: number; // e.g., 4.5 km
  freshnessStatus: 'Peak Freshness' | 'Optimal Warmth' | 'Flash Resale - Final Call';
  freshnessScore: number; // 0 to 100%
  holdingTemperatureC: number; // e.g. 68°C
  availableUnits: number;
  imageUrl: string;
  cloudKitchen: CloudKitchen;
  resaleReason: string;
  safetyDetails: {
    tamperSealed: boolean;
    temperatureControlled: boolean;
    fssaiInspected: boolean;
    packagingType: string;
    holdCutoffTime: string;
  };
  tags: string[];
  calories?: number;
  serves: string;
}

export interface CartItem {
  food: FoodItem;
  quantity: number;
}

export interface KitchenHub {
  id: string;
  name: string;
  locality: string;
  city: 'Bengaluru' | 'Mumbai' | 'Delhi NCR' | 'Hyderabad';
  lat: number;
  lng: number;
  activeKitchens: number;
  activeBatches: number;
  radiusKm: number;
  topCuisine: string;
  address: string;
}

export interface Coupon {
  code: string;
  title: string;
  discountType: 'percentage' | 'flat' | 'free_delivery';
  discountValue: number;
  maxDiscount?: number;
  minOrder: number;
  description: string;
}

export interface OrderRecord {
  id: string;
  items: CartItem[];
  totalAmount: number;
  totalSaved: number;
  couponCode?: string;
  couponDiscount?: number;
  wastePreventedKg: number;
  createdAt: string;
  status: 'Inspecting Batch' | 'Driver Assigned' | 'Out for Express Delivery' | 'Delivered';
  estimatedDeliveryTime: string;
  address: string;
  deliveryOtp: string;
  kitchenName: string;
}
