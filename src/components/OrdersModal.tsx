import React from 'react';
import { OrderRecord } from '../types';
import {
  X,
  Clock,
  CheckCircle2,
  Bike,
  ShieldCheck,
  Leaf,
  MapPin,
  ShoppingBag,
  ExternalLink,
  Phone
} from 'lucide-react';

interface OrdersModalProps {
  isOpen: boolean;
  onClose: () => void;
  orders: OrderRecord[];
}

export const OrdersModal: React.FC<OrdersModalProps> = ({
  isOpen,
  onClose,
  orders,
}) => {
  if (!isOpen) return null;

  const totalWasteSaved = orders.reduce((sum, o) => sum + o.wastePreventedKg, 0);
  const totalMoneySaved = orders.reduce((sum, o) => sum + o.totalSaved, 0);

  return (
    <div
      id="orders-modal-backdrop"
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-in fade-in"
      onClick={onClose}
    >
      <div
        id="orders-modal-card"
        className="bg-white rounded-3xl max-w-xl w-full overflow-hidden shadow-2xl border border-stone-200 my-8 animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-stone-200 flex items-center justify-between bg-stone-50">
          <div>
            <h3 className="font-display text-base font-bold text-stone-900 flex items-center gap-2">
              <span>My Resale Orders & Impact</span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-extrabold uppercase">
                Zero Waste Hero
              </span>
            </h3>
            <p className="text-xs text-stone-500">
              Track live food dispatches & environmental metrics
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl text-stone-400 hover:text-stone-700 hover:bg-stone-200/70"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Impact Stats Banner */}
        <div className="p-5 bg-emerald-900 text-white flex items-center justify-around text-center">
          <div>
            <div className="text-2xl font-display font-extrabold text-emerald-300">
              {totalWasteSaved > 0 ? `${totalWasteSaved.toFixed(1)} kg` : '1.4 kg'}
            </div>
            <div className="text-[11px] text-emerald-200 flex items-center justify-center gap-1">
              <Leaf className="w-3.5 h-3.5" /> Food Waste Prevented
            </div>
          </div>
          <div className="h-8 w-px bg-emerald-700" />
          <div>
            <div className="text-2xl font-display font-extrabold text-amber-300">
              ₹{totalMoneySaved > 0 ? totalMoneySaved : 520}
            </div>
            <div className="text-[11px] text-emerald-200">
              Resale Savings Kept
            </div>
          </div>
        </div>

        {/* Orders List */}
        <div className="p-5 max-h-[55vh] overflow-y-auto space-y-4">
          {orders.length === 0 ? (
            <div className="text-center py-10 space-y-3">
              <ShoppingBag className="w-12 h-12 text-stone-300 mx-auto" />
              <p className="text-sm font-semibold text-stone-700">No active orders yet</p>
              <p className="text-xs text-stone-400 max-w-xs mx-auto">
                Explore delicious meals from partner cloud kitchens and rescue high-quality food.
              </p>
            </div>
          ) : (
            orders.map((order) => (
              <div
                key={order.id}
                className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-3"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-mono font-bold text-stone-800">{order.id}</span>
                  <span className="text-stone-500">{order.createdAt}</span>
                </div>

                {/* Progress Status Bar */}
                <div className="bg-white p-3 rounded-xl border border-stone-200/80 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-orange-600 flex items-center gap-1.5">
                      <Bike className="w-4 h-4 animate-bounce" />
                      {order.status}
                    </span>
                    <span className="text-[11px] text-stone-500 font-medium">
                      ETA: {order.estimatedDeliveryTime}
                    </span>
                  </div>

                  <div className="w-full bg-stone-100 h-2 rounded-full overflow-hidden">
                    <div className="bg-gradient-to-r from-orange-500 to-emerald-500 h-full w-3/4 rounded-full transition-all duration-1000" />
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-stone-600 pt-1">
                    <span>Kitchen: <strong>{order.kitchenName}</strong></span>
                    <span className="bg-orange-100 text-orange-800 px-2 py-0.5 rounded font-mono font-bold text-[10px]">
                      OTP: {order.deliveryOtp}
                    </span>
                  </div>
                </div>

                {/* Items in order */}
                <div className="space-y-1 text-xs text-stone-600">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between">
                      <span>
                        {item.quantity}x {item.food.name}
                      </span>
                      <span className="font-semibold">
                        ₹{item.food.resalePrice * item.quantity}
                      </span>
                    </div>
                  ))}
                  {order.couponCode && (
                    <div className="flex justify-between text-emerald-700 font-semibold pt-1 border-t border-dashed border-stone-200">
                      <span>Coupon Applied ({order.couponCode})</span>
                      <span>- ₹{order.couponDiscount || 0}</span>
                    </div>
                  )}
                </div>

                <div className="pt-2 border-t border-stone-200 flex items-center justify-between text-xs">
                  <span className="text-stone-500">Paid: <strong className="text-stone-900 text-sm">₹{order.totalAmount}</strong></span>
                  <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-200">
                    Saved ₹{order.totalSaved} today
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-stone-50 border-t border-stone-200 flex items-center justify-between text-xs text-stone-500">
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            Aroma Quality Guarantee
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-bold"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
