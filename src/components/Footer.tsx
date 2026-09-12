import React from 'react';
import { AromaLogo } from './AromaLogo';
import {
  ShieldCheck,
  Heart,
  Mail,
  Phone,
  MapPin,
  Sparkles,
  ArrowRight,
  ExternalLink
} from 'lucide-react';

interface FooterProps {
  onNavigate: (sectionId: string) => void;
  onPartnerClick: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onPartnerClick }) => {
  return (
    <footer id="about-us" className="bg-stone-900 text-stone-300 pt-16 pb-12 border-t border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Callout: Cloud Kitchen Partner Banner */}
        <div className="bg-gradient-to-r from-orange-600 via-amber-600 to-orange-700 rounded-3xl p-6 sm:p-8 text-white mb-16 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="space-y-2 text-center md:text-left">
            <span className="text-xs uppercase font-extrabold tracking-wider bg-white/20 px-3 py-1 rounded-full">
              For Cloud Kitchen Operators
            </span>
            <h3 className="font-display text-2xl sm:text-3xl font-bold">
              Run a Cloud Kitchen in India? Zero Waste Starts Here.
            </h3>
            <p className="text-sm text-orange-100 max-w-xl">
              Turn unavoidable prep surplus and cancelled catering orders into revenue while preventing quality food from being thrown away.
            </p>
          </div>

          <button
            type="button"
            onClick={onPartnerClick}
            className="shrink-0 px-6 py-3.5 bg-white text-orange-700 hover:bg-orange-50 rounded-2xl font-bold text-xs shadow-lg transition-all active:scale-95 flex items-center gap-2"
          >
            <span>Partner With Aroma</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Main Footer Links & Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-stone-800">
          {/* Col 1 & 2: Brand Story */}
          <div className="lg:col-span-2 space-y-4">
            <AromaLogo size="lg" className="text-white" />

            <div className="space-y-1">
              <p className="text-sm font-semibold text-white">
                “Fresh Food. Smart Resale. Zero Waste.”
              </p>
              <p className="text-xs text-orange-400 font-medium italic">
                “Good food deserves another chance.”
              </p>
            </div>

            <p className="text-xs text-stone-400 leading-relaxed max-w-sm">
              Aroma is India’s pioneering cloud kitchen food-reselling and redistribution network. We connect hungry food lovers with freshly prepared, restaurant-grade surplus meals at unbeatable discounts — delivered fast in active thermal packaging.
            </p>

            <div className="pt-2 flex items-center gap-2 text-xs text-stone-400">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Compliant with Food Safety and Standards Authority of India (FSSAI).</span>
            </div>
          </div>

          {/* Col 3: Quick Navigation */}
          <div>
            <h4 className="font-display text-xs font-bold uppercase tracking-wider text-white mb-4">
              Explore Aroma
            </h4>
            <ul className="space-y-2.5 text-xs text-stone-400">
              {['home', 'explore-food', 'how-it-works', 'safety', 'delivery-map', 'offers'].map(
                (item) => (
                  <li key={item}>
                    <button
                      type="button"
                      onClick={() => onNavigate(item)}
                      className="hover:text-orange-400 transition-colors capitalize"
                    >
                      {item.replace('-', ' ')}
                    </button>
                  </li>
                )
              )}
            </ul>
          </div>

          {/* Col 4: Active Cities in India */}
          <div>
            <h4 className="font-display text-xs font-bold uppercase tracking-wider text-white mb-4">
              Active Hub Cities
            </h4>
            <ul className="space-y-2.5 text-xs text-stone-400">
              <li className="flex items-center gap-1.5 text-stone-200 font-medium">
                <MapPin className="w-3 h-3 text-orange-500" /> Bengaluru (Indiranagar, Koramangala)
              </li>
              <li className="flex items-center gap-1.5 text-stone-200 font-medium">
                <MapPin className="w-3 h-3 text-orange-500" /> Mumbai (Bandra, Powai)
              </li>
              <li className="flex items-center gap-1.5 text-stone-200 font-medium">
                <MapPin className="w-3 h-3 text-orange-500" /> Delhi NCR (Cyber City, Noida)
              </li>
              <li className="flex items-center gap-1.5 text-stone-200 font-medium">
                <MapPin className="w-3 h-3 text-orange-500" /> Hyderabad (Hitec City)
              </li>
              <li className="text-stone-500">Coming Soon: Pune, Chennai, Kolkata</li>
            </ul>
          </div>

          {/* Col 5: Contact & Support */}
          <div>
            <h4 className="font-display text-xs font-bold uppercase tracking-wider text-white mb-4">
              Support & Transparency
            </h4>
            <ul className="space-y-2.5 text-xs text-stone-400">
              <li className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-orange-400" />
                <span>support@aroma-food.in</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-orange-400" />
                <span>+91 1800-AROMA-FOOD</span>
              </li>
              <li className="pt-2 text-[11px] text-stone-500">
                100% money-back freshness guarantee on all verified temperature logs.
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500">
          <div className="flex items-center gap-2">
            <span>© {new Date().getFullYear()} AROMA Technologies India Pvt. Ltd.</span>
            <span>•</span>
            <span>All rights reserved.</span>
          </div>

          <div className="flex items-center gap-1 text-stone-400">
            <span>Built with passion for zero food waste in India</span>
            <Heart className="w-3.5 h-3.5 text-red-500 inline fill-red-500" />
          </div>
        </div>
      </div>
    </footer>
  );
};
