import React, { useState, useEffect } from 'react';
import {
  Flame,
  Clock,
  ShieldCheck,
  TrendingDown,
  Sparkles,
  ArrowRight,
  MapPin,
  CheckCircle2,
  Thermometer,
  Zap,
  ShoppingBag
} from 'lucide-react';
import { FoodItem } from '../types';

interface HeroSectionProps {
  onExploreClick: () => void;
  onHowItWorksClick: () => void;
  featuredFood: FoodItem;
  onAddToCart: (food: FoodItem) => void;
  onViewFoodDetails: (food: FoodItem) => void;
  selectedCity: string;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onExploreClick,
  onHowItWorksClick,
  featuredFood,
  onAddToCart,
  onViewFoodDetails,
  selectedCity,
}) => {
  // Live countdown timer for the featured resale batch (simulating dynamic minutes & seconds)
  const [secondsRemaining, setSecondsRemaining] = useState(48 * 60 + 15);

  useEffect(() => {
    const interval = setInterval(() => {
      setSecondsRemaining((prev) => (prev > 1 ? prev - 1 : 45 * 60));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatCountdown = (totalSecs: number) => {
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${mins}m ${secs < 10 ? '0' : ''}${secs}s`;
  };

  return (
    <section
      id="home"
      className="relative overflow-hidden pt-8 pb-16 lg:py-20 bg-gradient-to-b from-orange-50/70 via-[#FAF8F5] to-[#FAF8F5]"
    >
      {/* Subtle organic background glow */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-orange-200/40 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-20 left-10 w-72 h-72 bg-emerald-100/50 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Branding, Headline & Supporting Text */}
          <div className="lg:col-span-7 space-y-6">
            {/* Top pill tags */}
            <div className="flex flex-wrap items-center gap-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-100 text-orange-800 text-xs font-bold tracking-wide border border-orange-200 shadow-xs">
                <Flame className="w-3.5 h-3.5 text-orange-600 animate-pulse" />
                <span>Smart Resale Cloud Kitchens</span>
              </div>

              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold tracking-wide border border-emerald-200">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                <span>Zero Food Wastage</span>
              </div>

              <div className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-stone-100 text-stone-600 text-xs font-medium">
                <MapPin className="w-3 h-3 text-stone-500" />
                <span>Serving {selectedCity}</span>
              </div>
            </div>

            {/* Headline matching user prompt */}
            <div className="space-y-3">
              <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold text-stone-900 tracking-tight leading-[1.12]">
                Fresh Food,{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 via-amber-600 to-orange-500">
                  Better Prices,
                </span>{' '}
                Less Waste.
              </h1>

              {/* Supporting text matching user prompt */}
              <p className="text-lg sm:text-xl text-stone-600 font-normal leading-relaxed max-w-2xl">
                Discover freshly prepared meals and smartly resold food from trusted cloud kitchens near you.
              </p>
            </div>

            {/* Brand Motto Highlight */}
            <div className="p-4 rounded-2xl bg-white border border-stone-200/90 shadow-xs flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-orange-500 text-white flex items-center justify-center shrink-0 shadow-sm">
                  <Zap className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs uppercase font-bold text-orange-600 tracking-wider">
                    Our Philosophy
                  </div>
                  <div className="text-sm font-semibold text-stone-800">
                    “Good food deserves another chance.”
                  </div>
                </div>
              </div>
              <div className="text-right hidden sm:block">
                <div className="text-xs text-stone-500 font-medium">Average Resale Savings</div>
                <div className="text-base font-bold text-emerald-600">40% - 55% OFF</div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 pt-2">
              <button
                id="hero-explore-btn"
                type="button"
                onClick={onExploreClick}
                className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-2xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-sm shadow-md hover:shadow-lg transition-all active:scale-98"
              >
                <span>Explore Resale Batches</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                id="hero-how-it-works-btn"
                type="button"
                onClick={onHowItWorksClick}
                className="inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-2xl bg-white hover:bg-stone-50 text-stone-800 font-semibold text-sm border border-stone-300 transition-colors"
              >
                <span>How Aroma Resale Works</span>
              </button>
            </div>

            {/* Trust Badges Bar */}
            <div className="pt-4 grid grid-cols-3 gap-3 border-t border-stone-200/80">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
                <div className="text-xs">
                  <div className="font-bold text-stone-900">100% FSSAI Certified</div>
                  <div className="text-stone-500">Inspected hygiene</div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-orange-600 shrink-0" />
                <div className="text-xs">
                  <div className="font-bold text-stone-900">18 - 25 Min Delivery</div>
                  <div className="text-stone-500">Thermal insulated</div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <TrendingDown className="w-5 h-5 text-amber-600 shrink-0" />
                <div className="text-xs">
                  <div className="font-bold text-stone-900">Zero Food Waste</div>
                  <div className="text-stone-500">Every box counts</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Featured "Live Resale Spotlight" Card */}
          <div className="lg:col-span-5">
            <div className="relative">
              {/* Decorative badge floating */}
              <div className="absolute -top-3 -right-2 z-20 bg-emerald-600 text-white text-[11px] font-bold px-3 py-1 rounded-full shadow-lg flex items-center gap-1.5 animate-bounce">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Save ₹{featuredFood.originalPrice - featuredFood.resalePrice}</span>
              </div>

              {/* Main Resale Card */}
              <div className="bg-white rounded-3xl border border-stone-200/90 shadow-xl overflow-hidden group hover:border-orange-200 transition-all">
                {/* Image & Badges */}
                <div className="relative h-60 w-full overflow-hidden bg-stone-100">
                  <img
                    src={featuredFood.imageUrl}
                    alt={featuredFood.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                  {/* Resale Badge */}
                  <div className="absolute top-3.5 left-3.5 flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded-xl bg-orange-600 text-white text-xs font-extrabold uppercase tracking-wide shadow-md flex items-center gap-1">
                      <Flame className="w-3.5 h-3.5" />
                      Smart Resale {featuredFood.resaleDiscountPercent}% OFF
                    </span>
                  </div>

                  {/* Countdown Timer Strip */}
                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10">
                    <div className="flex items-center gap-1.5 font-medium">
                      <Clock className="w-3.5 h-3.5 text-amber-400" />
                      <span>Freshness Window:</span>
                    </div>
                    <span className="font-mono font-bold text-amber-300">
                      {formatCountdown(secondsRemaining)} left
                    </span>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-5 space-y-4">
                  {/* Title & Cloud Kitchen */}
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="text-[11px] font-bold text-orange-700 bg-orange-50 px-2 py-0.5 rounded-md border border-orange-200 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-orange-600" />
                        {featuredFood.cloudKitchen.name}
                      </span>
                      <span className="text-xs text-stone-500 font-medium">
                        {featuredFood.cloudKitchen.distanceKm} km away
                      </span>
                    </div>

                    <h2
                      onClick={() => onViewFoodDetails(featuredFood)}
                      className="font-display text-lg font-bold text-stone-900 group-hover:text-orange-600 transition-colors line-clamp-1 cursor-pointer"
                    >
                      {featuredFood.name}
                    </h2>
                    <p className="text-xs text-stone-600 line-clamp-2 mt-1">
                      {featuredFood.description}
                    </p>
                  </div>

                  {/* Live Freshness & Quality Gauge */}
                  <div className="grid grid-cols-3 gap-2 bg-stone-50 p-2.5 rounded-2xl border border-stone-200/80 text-center">
                    <div>
                      <div className="text-[10px] text-stone-500 uppercase font-semibold">
                        Prep Time
                      </div>
                      <div className="text-xs font-bold text-stone-800">
                        {featuredFood.preparationTime}
                      </div>
                    </div>
                    <div>
                      <div className="text-[10px] text-stone-500 uppercase font-semibold">
                        Temp Hold
                      </div>
                      <div className="text-xs font-bold text-orange-700 flex items-center justify-center gap-0.5">
                        <Thermometer className="w-3 h-3" />
                        {featuredFood.holdingTemperatureC}°C Active
                      </div>
                    </div>
                    <div>
                      <div className="text-[10px] text-stone-500 uppercase font-semibold">
                        Freshness
                      </div>
                      <div className="text-xs font-bold text-emerald-600">
                        {featuredFood.freshnessScore}% Peak
                      </div>
                    </div>
                  </div>

                  {/* Resale Context / Why it's discounted */}
                  <div className="text-[11px] text-stone-600 bg-amber-50/60 p-2 rounded-xl border border-amber-200/60 flex items-start gap-1.5">
                    <span className="font-bold text-amber-800 shrink-0">Resale Note:</span>
                    <span className="line-clamp-1">{featuredFood.resaleReason}</span>
                  </div>

                  {/* Pricing & CTA */}
                  <div className="flex items-center justify-between pt-2 border-t border-stone-100">
                    <div>
                      <div className="flex items-baseline gap-2">
                        <span className="text-2xl font-extrabold text-stone-900">
                          ₹{featuredFood.resalePrice}
                        </span>
                        <span className="text-sm text-stone-400 line-through">
                          ₹{featuredFood.originalPrice}
                        </span>
                      </div>
                      <span className="text-[11px] font-bold text-emerald-600">
                        Instant {featuredFood.resaleDiscountPercent}% Discount
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => onViewFoodDetails(featuredFood)}
                        className="px-3 py-2 rounded-xl border border-stone-200 text-xs font-semibold text-stone-700 hover:bg-stone-100 transition-colors"
                      >
                        Inspect
                      </button>
                      <button
                        id="claim-featured-batch-btn"
                        type="button"
                        onClick={() => onAddToCart(featuredFood)}
                        className="px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm active:scale-95 transition-all"
                      >
                        <ShoppingBag className="w-3.5 h-3.5" />
                        <span>Claim Batch</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
