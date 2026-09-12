import React from 'react';
import {
  ShieldCheck,
  Thermometer,
  Timer,
  Lock,
  Award,
  Sparkles,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';

export const SafetySection: React.FC = () => {
  const safetyProtocols = [
    {
      icon: Timer,
      title: 'Strict 90-Minute Cutoff Policy',
      description: 'Any hot surplus food not claimed within 90 minutes of kitchen completion is automatically delisted and sent for verified biowaste composting. We never sell stale or day-old food.',
      badge: 'Zero Compromise',
      color: 'text-orange-600 bg-orange-100',
    },
    {
      icon: Thermometer,
      title: 'Active Thermal Temperature Control',
      description: 'Hot dishes are continuously maintained at or above 65°C in industrial warmers. Cold bowls and desserts remain in chilled cool-packs (under 8°C) until rider handover.',
      badge: '≥65°C Guaranteed',
      color: 'text-amber-600 bg-amber-100',
    },
    {
      icon: Award,
      title: '100% FSSAI Certified Cloud Kitchens',
      description: 'We only onboard licensed commercial dark kitchens with a minimum 4.5+ star hygiene rating, periodic microbiological audits, and certified culinary staff.',
      badge: 'FSSAI Grade-A',
      color: 'text-emerald-600 bg-emerald-100',
    },
    {
      icon: Lock,
      title: 'Tamper-Evident QR Thermal Seals',
      description: 'Each Aroma box is sealed with a heat-sensitive holographic security strip at the kitchen counter. If the seal has been compromised, customers receive an instant 100% refund.',
      badge: 'Tamper-Proof',
      color: 'text-blue-600 bg-blue-100',
    },
  ];

  return (
    <section id="safety" className="py-20 bg-white border-t border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Trust & Safety Architecture</span>
          </div>

          <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-stone-900 tracking-tight">
            How Aroma Guarantees Uncompromised Safety
          </h2>

          <p className="text-stone-600 text-base leading-relaxed">
            Smart food resale is only meaningful when hygiene, thermal insulation, and strict timelines are mathematically tracked. Here is our 4-pillar quality commitment.
          </p>
        </div>

        {/* 4 Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {safetyProtocols.map((protocol, index) => {
            const Icon = protocol.icon;
            return (
              <div
                key={index}
                className="p-6 rounded-3xl bg-stone-50 border border-stone-200/90 hover:border-emerald-200 hover:shadow-lg transition-all flex flex-col justify-between space-y-4"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-12 h-12 rounded-2xl ${protocol.color} flex items-center justify-center`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-md bg-white border border-stone-200 text-stone-700">
                      {protocol.badge}
                    </span>
                  </div>

                  <h3 className="font-display text-base font-bold text-stone-900 mb-2">
                    {protocol.title}
                  </h3>

                  <p className="text-xs text-stone-600 leading-relaxed">
                    {protocol.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-stone-200/60 flex items-center gap-1.5 text-xs font-semibold text-emerald-700">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Verified on every dispatch</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Safety Seal Guarantee Banner */}
        <div className="mt-12 bg-gradient-to-r from-stone-900 via-stone-800 to-stone-900 text-white rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="space-y-2 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2 text-amber-400 font-bold text-xs uppercase tracking-wider">
              <Sparkles className="w-4 h-4" />
              <span>The Aroma Fresh-Or-Free Guarantee</span>
            </div>
            <h3 className="font-display text-xl sm:text-2xl font-bold">
              Not at peak warmth or dissatisfied with freshness?
            </h3>
            <p className="text-xs sm:text-sm text-stone-300 max-w-xl">
              We stand behind every cloud kitchen batch. If the temperature seal is broken or food is below standard, get an instant 100% refund with 1-click in your order drawer.
            </p>
          </div>

          <div className="shrink-0 flex items-center gap-3">
            <div className="px-5 py-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-center">
              <div className="text-2xl font-display font-extrabold text-amber-300">100%</div>
              <div className="text-[10px] text-stone-300 font-medium">Refund Guarantee</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
