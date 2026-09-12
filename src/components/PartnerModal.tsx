import React, { useState } from 'react';
import { X, ChefHat, CheckCircle2, ShieldCheck } from 'lucide-react';

interface PartnerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PartnerModal: React.FC<PartnerModalProps> = ({ isOpen, onClose }) => {
  const [submitted, setSubmitted] = useState(false);
  const [kitchenName, setKitchenName] = useState('');
  const [fssai, setFssai] = useState('');
  const [city, setCity] = useState('Bengaluru');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div
      id="partner-modal-backdrop"
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-in fade-in"
      onClick={onClose}
    >
      <div
        id="partner-modal-card"
        className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-stone-200 animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-5 border-b border-stone-100 flex items-center justify-between bg-stone-50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-orange-600 text-white flex items-center justify-center">
              <ChefHat className="w-4 h-4" />
            </div>
            <h3 className="font-display text-base font-bold text-stone-900">
              Partner Your Cloud Kitchen
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-stone-400 hover:text-stone-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {submitted ? (
          <div className="p-8 text-center space-y-4">
            <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h4 className="font-display text-lg font-bold text-stone-900">
              Partnership Application Received!
            </h4>
            <p className="text-xs text-stone-600 max-w-sm mx-auto">
              Our regional culinary inspector for <strong>{city}</strong> will contact {kitchenName || 'your team'} within 24 hours to set up thermal testing and FSSAI integration.
            </p>
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 bg-stone-900 text-white rounded-xl text-xs font-bold"
            >
              Back to Aroma
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <p className="text-xs text-stone-600">
              Monetize buffer batches and cancelled corporate meal portions. Aroma handles thermal packaging, marketing, and rider dispatch.
            </p>

            <div className="space-y-3">
              <div>
                <label className="text-[11px] font-bold text-stone-700 block mb-1">
                  Cloud Kitchen Name
                </label>
                <input
                  type="text"
                  required
                  value={kitchenName}
                  onChange={(e) => setKitchenName(e.target.value)}
                  placeholder="e.g. Spice Route Dark Kitchen"
                  className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:border-orange-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] font-bold text-stone-700 block mb-1">
                    City Hub
                  </label>
                  <select
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:border-orange-500"
                  >
                    <option value="Bengaluru">Bengaluru</option>
                    <option value="Mumbai">Mumbai</option>
                    <option value="Delhi NCR">Delhi NCR</option>
                    <option value="Hyderabad">Hyderabad</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-stone-700 block mb-1">
                    FSSAI Registration #
                  </label>
                  <input
                    type="text"
                    required
                    value={fssai}
                    onChange={(e) => setFssai(e.target.value)}
                    placeholder="14-digit license"
                    className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold transition-colors shadow-sm"
            >
              Submit Cloud Kitchen Profile
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
