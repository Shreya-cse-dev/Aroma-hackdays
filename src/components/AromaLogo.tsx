import React from 'react';

interface AromaLogoProps {
  size?: 'sm' | 'md' | 'lg';
  showTagline?: boolean;
  className?: string;
  onClick?: () => void;
}

export const AromaLogo: React.FC<AromaLogoProps> = ({
  size = 'md',
  showTagline = true,
  className = '',
  onClick,
}) => {
  const iconSize = size === 'sm' ? 28 : size === 'lg' ? 44 : 36;
  const textSize = size === 'sm' ? 'text-lg' : size === 'lg' ? 'text-2xl' : 'text-xl';

  return (
    <div
      id="aroma-brand-logo"
      onClick={onClick}
      className={`inline-flex items-center gap-2.5 cursor-pointer select-none group ${className}`}
    >
      {/* Brand Icon: Steaming bowl with fresh leaf */}
      <div className="relative flex items-center justify-center">
        <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-600 via-orange-500 to-emerald-600 p-[2px] shadow-sm group-hover:shadow-md transition-shadow">
          <div className="w-full h-full bg-white rounded-[14px] flex items-center justify-center relative overflow-hidden">
            <svg
              width={iconSize}
              height={iconSize}
              viewBox="0 0 36 36"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="transform group-hover:scale-105 transition-transform duration-300"
            >
              {/* Bowl Base */}
              <path
                d="M6 18C6 24.6274 11.3726 30 18 30C24.6274 30 30 24.6274 30 18H6Z"
                fill="#EA580C"
              />
              <path
                d="M5 17C5 16.4477 5.44772 16 6 16H30C30.5523 16 31 16.4477 31 17C31 17.5523 30.5523 18 30 18H6C5.44772 18 5 17.5523 5 17Z"
                fill="#C2410C"
              />

              {/* Steam swirl 1 */}
              <path
                d="M13 14C13 11 15 10 15 8C15 6 13 5.5 13 4"
                stroke="#F97316"
                strokeWidth="2"
                strokeLinecap="round"
              />
              {/* Steam swirl 2 (Center) */}
              <path
                d="M18 13C18 10 20 9 20 6.5C20 4.5 18 4 18 2.5"
                stroke="#059669"
                strokeWidth="2"
                strokeLinecap="round"
              />
              {/* Steam swirl 3 */}
              <path
                d="M23 14C23 11.5 21 10.5 21 8.5C21 7 23 6 23 4.5"
                stroke="#F97316"
                strokeWidth="2"
                strokeLinecap="round"
              />

              {/* Eco Leaf Badge */}
              <path
                d="M18 18C18 18 21 14 26 15C26 20 22 22 18 18Z"
                fill="#10B981"
                opacity="0.9"
              />
            </svg>
          </div>
        </div>

        {/* Live Freshness Ping dot */}
        <span className="absolute -top-0.5 -right-0.5 flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
        </span>
      </div>

      {/* Brand Wordmark & Tagline */}
      <div className="flex flex-col">
        <div className="flex items-center gap-1.5">
          <span className={`font-display font-extrabold tracking-tight ${textSize} text-stone-900 group-hover:text-orange-600 transition-colors`}>
            AROMA
          </span>
          <span className="text-[10px] uppercase font-bold tracking-widest px-1.5 py-0.5 bg-emerald-50 text-emerald-700 rounded-md border border-emerald-200">
            Resale
          </span>
        </div>
        {showTagline && (
          <span className="text-[10px] text-stone-500 font-medium tracking-tight -mt-0.5">
            Fresh Food. Smart Resale. Zero Waste.
          </span>
        )}
      </div>
    </div>
  );
};
