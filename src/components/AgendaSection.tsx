import React from 'react';
import {
  ChefHat,
  ListPlus,
  Percent,
  Compass,
  FileCheck2,
  ShoppingCart,
  Bike,
  CheckCircle2,
  Flame,
  ShieldCheck,
  TrendingDown,
  Sparkles,
  HeartHandshake
} from 'lucide-react';

export const AgendaSection: React.FC = () => {
  const steps = [
    {
      number: 1,
      title: 'Cloud kitchen prepares food',
      description: 'Partner cloud kitchens prepare authentic gourmet recipes using fresh ingredients during active service shifts.',
      icon: ChefHat,
      color: 'from-orange-500 to-amber-500',
    },
    {
      number: 2,
      title: 'Fresh food is listed on Aroma',
      description: 'Prepared batches and menu specialties are dynamically tracked with exact kitchen completion timestamps.',
      icon: ListPlus,
      color: 'from-amber-500 to-yellow-500',
    },
    {
      number: 3,
      title: 'Eligible items offered for resale',
      description: 'If excess, cancelled, or buffer catering portions remain in thermal warmers, they convert to smart resale at 30%–55% OFF.',
      icon: Percent,
      color: 'from-orange-600 to-red-500',
    },
    {
      number: 4,
      title: 'Customers discover nearby food',
      description: 'Nearby foodies browse live inventory based on their delivery radius (within 3–7 km) with instant availability.',
      icon: Compass,
      color: 'from-emerald-500 to-teal-500',
    },
    {
      number: 5,
      title: 'Transparent freshness & safety',
      description: 'Aroma displays preparation timestamp, internal temperature, hold-cutoff countdown, FSSAI rating, and delivery ETA.',
      icon: FileCheck2,
      color: 'from-blue-500 to-cyan-500',
    },
    {
      number: 6,
      title: 'Customers order the food',
      description: 'Lock in your deal with 1-tap checkout. The cloud kitchen seals the package with tamper-proof thermal QR security.',
      icon: ShoppingCart,
      color: 'from-indigo-500 to-purple-500',
    },
    {
      number: 7,
      title: 'Fast delivery within estimate',
      description: 'Dedicated express couriers deliver hot insulated packages to your doorstep strictly within the displayed ETA.',
      icon: Bike,
      color: 'from-emerald-600 to-green-600',
    },
  ];

  return (
    <section id="how-it-works" className="py-20 bg-stone-50 border-t border-stone-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header: Our Mission & Agenda */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-orange-100 text-orange-800 text-xs font-bold uppercase tracking-wider">
            <HeartHandshake className="w-3.5 h-3.5 text-orange-600" />
            <span>Our Agenda & Why Aroma</span>
          </div>

          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold text-stone-900 tracking-tight">
            Our Mission: Zero Waste, Maximum Flavour
          </h2>

          <p className="text-base sm:text-lg text-stone-600 leading-relaxed">
            Aroma aims to eliminate food wastage from commercial cloud kitchens across India, while empowering customers to enjoy delicious, chef-prepared hot food at steep discounts.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-6 pt-2 text-xs font-semibold text-stone-700">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>100% Edible & Fresh</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Full Thermal Tracking</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>FSSAI Certified Cloud Kitchens</span>
            </div>
          </div>
        </div>

        {/* 7-Step Interactive Visual Flow / Timeline */}
        <div className="mb-20">
          <div className="flex items-center justify-between mb-8 pb-3 border-b border-stone-200">
            <h3 className="font-display text-xl font-bold text-stone-900 flex items-center gap-2">
              <Flame className="w-5 h-5 text-orange-600" />
              <span>How Aroma Resale Works — The 7-Step Lifecycle</span>
            </h3>
            <span className="text-xs font-semibold text-stone-500 bg-white px-3 py-1 rounded-full border border-stone-200">
              Avg. 45-min cycle from kitchen to customer
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-4">
            {steps.map((step) => {
              const Icon = step.icon;
              return (
                <div
                  key={step.number}
                  className="bg-white rounded-2xl p-4 border border-stone-200/80 shadow-xs hover:shadow-md transition-all hover:-translate-y-1 relative group flex flex-col justify-between"
                >
                  <div>
                    {/* Step Number & Icon */}
                    <div className="flex items-center justify-between mb-3">
                      <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${step.color} text-white flex items-center justify-center shadow-xs`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className="font-display text-xs font-extrabold text-stone-400 group-hover:text-orange-600 transition-colors">
                        0{step.number}
                      </span>
                    </div>

                    {/* Step Title */}
                    <h4 className="font-display text-sm font-bold text-stone-900 mb-1.5 leading-snug">
                      {step.title}
                    </h4>

                    {/* Step Description */}
                    <p className="text-xs text-stone-500 leading-relaxed">
                      {step.description}
                    </p>
                  </div>

                  {/* Micro indicator */}
                  <div className="mt-4 pt-2 border-t border-stone-100 flex items-center gap-1 text-[10px] text-stone-400 font-medium">
                    <span>Phase {step.number}</span>
                    <span className="text-orange-500">✓</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

