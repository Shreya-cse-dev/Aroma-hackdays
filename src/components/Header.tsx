import React, { useState } from 'react';
import { AromaLogo } from './AromaLogo';
import { SearchBar } from './SearchBar';
import {
  ShoppingBag,
  User,
  MapPin,
  ChevronDown,
  Menu,
  X,
  Sparkles,
  ShieldCheck,
  Percent,
  Clock,
  Compass,
  Check
} from 'lucide-react';
import { CartItem } from '../types';

interface HeaderProps {
  activeSection: string;
  onNavigate: (sectionId: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onSearchClear: () => void;
  resultCount: number;
  cartItems: CartItem[];
  onOpenCart: () => void;
  onOpenProfile: () => void;
  selectedCity: string;
  onCityChange: (city: string) => void;
  userLocation?: string;
  activeHubName?: string | null;
}

const INDIAN_CITIES = [
  { name: 'Bengaluru', locality: 'Indiranagar & Koramangala' },
  { name: 'Mumbai', locality: 'Bandra West & Powai' },
  { name: 'Delhi NCR', locality: 'DLF Cyber Hub & Noida' },
  { name: 'Hyderabad', locality: 'Hitec City & Jubilee Hills' },
];

export const Header: React.FC<HeaderProps> = ({
  activeSection,
  onNavigate,
  searchQuery,
  onSearchChange,
  onSearchClear,
  resultCount,
  cartItems,
  onOpenCart,
  onOpenProfile,
  selectedCity,
  onCityChange,
  userLocation,
  activeHubName,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [cityDropdownOpen, setCityDropdownOpen] = useState(false);

  const totalCartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const totalCartPrice = cartItems.reduce(
    (sum, item) => sum + item.food.resalePrice * item.quantity,
    0
  );

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'explore-food', label: 'Explore Food' },
    { id: 'how-it-works', label: 'How It Works' },
    { id: 'safety', label: 'Safety' },
    { id: 'delivery-map', label: 'Delivery Radius' },
    { id: 'offers', label: 'Offers' },
    { id: 'about-us', label: 'About Us' },
  ];

  const handleItemClick = (id: string) => {
    onNavigate(id);
    setMobileMenuOpen(false);
  };

  return (
    <header
      id="aroma-sticky-header"
      className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200/80 transition-shadow duration-200"
    >
      {/* Top Banner: Resale Impact Ticker */}
      <div className="bg-stone-900 text-stone-200 text-xs py-1.5 px-4 hidden md:flex items-center justify-between">
        <div className="flex items-center gap-2 font-medium">
          <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
          <span className="text-emerald-400 font-semibold">Live Resale Network:</span>
          <span>14,840+ freshly prepared meals rescued from cloud kitchen wastage across India.</span>
        </div>
        <div className="flex items-center gap-4 text-stone-400 text-[11px]">
          <span className="flex items-center gap-1 text-amber-300">
            <Sparkles className="w-3 h-3" /> FSSAI Verified Kitchens Only
          </span>
          <span>•</span>
          <span className="text-stone-300">Avg. 18-min Express Hot-Insulated Delivery</span>
        </div>
      </div>

      {/* Main Header Row */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          {/* Logo & City Selector */}
          <div className="flex items-center gap-4 shrink-0">
            <AromaLogo onClick={() => handleItemClick('home')} />

            {/* City / Cloud Kitchen Hub Selector */}
            <div className="relative hidden lg:block">
              <button
                id="city-selector-btn"
                type="button"
                onClick={() => setCityDropdownOpen(!cityDropdownOpen)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200/80 text-xs font-semibold text-stone-700 transition-colors"
                title="Change city or active delivery hub"
              >
                <MapPin className="w-3.5 h-3.5 text-orange-600" />
                <div className="flex flex-col items-start leading-tight text-left">
                  <span>{selectedCity}</span>
                  {userLocation && (
                    <span className="text-[10px] text-stone-400 max-w-[130px] truncate font-normal">
                      {userLocation.split('(')[0]}
                    </span>
                  )}
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-stone-400 ml-0.5" />
              </button>

              {cityDropdownOpen && (
                <div
                  id="city-dropdown-menu"
                  className="absolute left-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-stone-200 p-2 z-50 animate-in fade-in"
                >
                  <div className="px-3 py-1.5 text-[11px] font-bold text-stone-400 uppercase tracking-wider">
                    Select Active Hub Zone
                  </div>
                  {INDIAN_CITIES.map((city) => (
                    <button
                      key={city.name}
                      type="button"
                      onClick={() => {
                        onCityChange(city.name);
                        setCityDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 rounded-xl flex items-center justify-between text-xs transition-colors ${
                        selectedCity === city.name
                          ? 'bg-orange-50 text-orange-700 font-semibold'
                          : 'hover:bg-stone-50 text-stone-700'
                      }`}
                    >
                      <div>
                        <div className="font-medium text-stone-900">{city.name}</div>
                        <div className="text-[11px] text-stone-500">{city.locality}</div>
                      </div>
                      {selectedCity === city.name && (
                        <Check className="w-4 h-4 text-orange-600" />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Search Bar in Header (Desktop / Tablet) */}
          <div className="hidden md:flex flex-1 max-w-md mx-2">
            <SearchBar
              value={searchQuery}
              onChange={onSearchChange}
              onClear={onSearchClear}
              resultCount={resultCount}
            />
          </div>

          {/* Navigation Links (Desktop) */}
          <nav className="hidden xl:flex items-center gap-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                id={`nav-${item.id}`}
                type="button"
                onClick={() => handleItemClick(item.id)}
                className={`px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                  activeSection === item.id
                    ? 'text-orange-600 bg-orange-50 font-semibold shadow-xs'
                    : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* Right Action Icons: Cart & Profile */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* User Profile / Orders */}
            <button
              id="header-profile-btn"
              type="button"
              onClick={onOpenProfile}
              className="flex items-center gap-2 p-2 sm:px-3 sm:py-2 rounded-xl border border-stone-200 hover:border-stone-300 hover:bg-stone-50 text-stone-700 text-xs font-medium transition-all"
              title="View Account & Resale Orders"
            >
              <div className="w-7 h-7 rounded-lg bg-orange-100 text-orange-700 flex items-center justify-center font-bold">
                <User className="w-4 h-4" />
              </div>
              <span className="hidden sm:inline">My Orders</span>
            </button>

            {/* Cart Button */}
            <button
              id="header-cart-btn"
              type="button"
              onClick={onOpenCart}
              className="relative flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-semibold text-xs transition-all shadow-sm hover:shadow active:scale-95"
            >
              <div className="relative">
                <ShoppingBag className="w-4 h-4" />
                {totalCartCount > 0 && (
                  <span
                    id="cart-badge-count"
                    className="absolute -top-2 -right-2.5 bg-emerald-500 text-white text-[10px] font-extrabold w-4 h-4 rounded-full flex items-center justify-center border-2 border-orange-600"
                  >
                    {totalCartCount}
                  </span>
                )}
              </div>
              <span className="hidden sm:inline">
                {totalCartCount > 0 ? `₹${totalCartPrice}` : 'Cart'}
              </span>
            </button>

            {/* Mobile Hamburger Menu */}
            <button
              id="mobile-menu-toggle"
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="xl:hidden p-2 rounded-xl text-stone-600 hover:text-stone-900 hover:bg-stone-100"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Search Bar Row (When on mobile screen) */}
        <div className="md:hidden pb-3 pt-1">
          <SearchBar
            value={searchQuery}
            onChange={onSearchChange}
            onClear={onSearchClear}
            resultCount={resultCount}
          />
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div
          id="mobile-nav-drawer"
          className="xl:hidden border-t border-stone-200 bg-white px-4 pt-3 pb-6 space-y-2 shadow-lg animate-in fade-in"
        >
          {/* City selector on mobile */}
          <div className="pb-2 border-b border-stone-100 flex items-center justify-between text-xs">
            <span className="text-stone-500 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-orange-600" /> Active City:
            </span>
            <div className="flex gap-1.5 overflow-x-auto">
              {INDIAN_CITIES.map((c) => (
                <button
                  key={c.name}
                  onClick={() => onCityChange(c.name)}
                  className={`px-2 py-1 rounded-lg text-xs font-medium whitespace-nowrap ${
                    selectedCity === c.name
                      ? 'bg-orange-600 text-white'
                      : 'bg-stone-100 text-stone-700'
                  }`}
                >
                  {c.name}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-2">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleItemClick(item.id)}
                className={`text-left px-3 py-2.5 rounded-xl text-xs font-medium transition-colors ${
                  activeSection === item.id
                    ? 'bg-orange-50 text-orange-600 font-semibold'
                    : 'text-stone-700 hover:bg-stone-50'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
            <span className="flex items-center gap-1 text-emerald-600 font-semibold">
              <ShieldCheck className="w-4 h-4" /> 100% FSSAI Inspected
            </span>
            <span className="flex items-center gap-1 text-orange-600 font-semibold">
              <Percent className="w-4 h-4" /> Up to 55% OFF Resale
            </span>
          </div>
        </div>
      )}
    </header>
  );
};
