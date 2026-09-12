import React, { useState, useMemo, useEffect } from 'react';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { AgendaSection } from './components/AgendaSection';
import { FoodGrid } from './components/FoodGrid';
import { DeliveryMapSection } from './components/DeliveryMapSection';
import { SafetySection } from './components/SafetySection';
import { OffersSection } from './components/OffersSection';
import { Footer } from './components/Footer';
import { FoodDetailModal } from './components/FoodDetailModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { OrdersModal } from './components/OrdersModal';
import { PartnerModal } from './components/PartnerModal';
import { MOCK_FOOD_ITEMS } from './data/mockFood';
import { FoodItem, CartItem, OrderRecord, Coupon } from './types';
import { AVAILABLE_COUPONS } from './data/coupons';

export default function App() {
  // Navigation & City state
  const [activeSection, setActiveSection] = useState('home');
  const [selectedCity, setSelectedCity] = useState('Bengaluru');
  const [userDeliveryLocation, setUserDeliveryLocation] = useState('Indiranagar 100ft Rd (560038)');
  const [userPincode, setUserPincode] = useState('560038');
  const [userDistanceKm, setUserDistanceKm] = useState(1.8);
  const [activeHubFilter, setActiveHubFilter] = useState<{ id: string; name: string } | null>(null);

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [vegOnly, setVegOnly] = useState(false);
  const [smartResaleOnly, setSmartResaleOnly] = useState(false);
  const [sortBy, setSortBy] = useState('recommended');

  const handleCityChange = (city: string) => {
    setSelectedCity(city);
    setActiveHubFilter(null);
  };

  // Cart & Orders state
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [skipCutlery, setSkipCutlery] = useState(true);
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(AVAILABLE_COUPONS[0]); // Default ZERO50 applied for instant discount

  // Modals state
  const [inspectedFood, setInspectedFood] = useState<FoodItem | null>(null);
  const [isOrdersOpen, setIsOrdersOpen] = useState(false);
  const [isPartnerOpen, setIsPartnerOpen] = useState(false);
  const [orders, setOrders] = useState<OrderRecord[]>([
    {
      id: 'ARM-829104',
      items: [
        {
          food: MOCK_FOOD_ITEMS[0],
          quantity: 1,
        },
      ],
      totalAmount: 249,
      totalSaved: 190,
      wastePreventedKg: 0.65,
      createdAt: 'Today, 12:40 PM',
      status: 'Out for Express Delivery',
      estimatedDeliveryTime: '12 mins left',
      address: 'Flat 402, Sai Residency, Indiranagar, Bengaluru - 560038',
      deliveryOtp: '4819',
      kitchenName: 'Royal Dum Cloud Kitchen',
    },
  ]);

  // Handle Cart Operations
  const handleAddToCart = (food: FoodItem) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.food.id === food.id);
      if (existing) {
        return prev.map((item) =>
          item.food.id === food.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { food, quantity: 1 }];
    });
  };

  const handleRemoveFromCart = (foodId: string) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.food.id === foodId);
      if (existing && existing.quantity > 1) {
        return prev.map((item) =>
          item.food.id === foodId
            ? { ...item, quantity: item.quantity - 1 }
            : item
        );
      }
      return prev.filter((item) => item.food.id !== foodId);
    });
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  const cartMap = useMemo(() => {
    const map: Record<string, number> = {};
    cartItems.forEach((item) => {
      map[item.food.id] = item.quantity;
    });
    return map;
  }, [cartItems]);

  // Smooth Navigation
  const scrollToSection = (sectionId: string) => {
    setActiveSection(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      const offset = 80;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    }
  };

  // Dynamic Food Filtering & Searching
  const filteredFoods = useMemo(() => {
    let result = [...MOCK_FOOD_ITEMS];

    // 1. Text Search Filter (Dishes, Kitchens, Categories, Offers)
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter((item) => {
        const nameMatch = item.name.toLowerCase().includes(q);
        const descMatch = item.description.toLowerCase().includes(q);
        const catMatch = item.category.toLowerCase().includes(q);
        const kitchenMatch = item.cloudKitchen.name.toLowerCase().includes(q);
        const localityMatch = item.cloudKitchen.locality.toLowerCase().includes(q);
        const tagsMatch = item.tags.some((t) => t.toLowerCase().includes(q));
        const offersMatch =
          q === 'offers' || q === 'offer' || q === 'discount' || q === 'sale'
            ? item.resaleDiscountPercent >= 40
            : false;

        return (
          nameMatch ||
          descMatch ||
          catMatch ||
          kitchenMatch ||
          localityMatch ||
          tagsMatch ||
          offersMatch
        );
      });
    }

    // 2. Category Filter
    if (selectedCategory !== 'All') {
      result = result.filter((item) => item.category === selectedCategory);
    }

    // 3. Veg Only Filter
    if (vegOnly) {
      result = result.filter((item) => item.isVeg);
    }

    // 4. Smart Resale Only Filter
    if (smartResaleOnly) {
      result = result.filter((item) => item.isSmartResale);
    }

    // 5. Active Cloud Kitchen Hub Filter
    if (activeHubFilter) {
      result = result.filter((item) => {
        const hubLocality = activeHubFilter.name.split(' ')[0].toLowerCase();
        return (
          item.cloudKitchen.locality.toLowerCase().includes(hubLocality) ||
          activeHubFilter.name.toLowerCase().includes(item.cloudKitchen.locality.toLowerCase()) ||
          item.cloudKitchen.city.toLowerCase() === selectedCity.toLowerCase()
        );
      });
    }

    // 6. Sorting
    if (sortBy === 'discount') {
      result.sort((a, b) => b.resaleDiscountPercent - a.resaleDiscountPercent);
    } else if (sortBy === 'freshness') {
      result.sort((a, b) => b.freshnessScore - a.freshnessScore);
    } else if (sortBy === 'delivery') {
      result.sort((a, b) => a.cloudKitchen.distanceKm - b.cloudKitchen.distanceKm);
    } else if (sortBy === 'price-low') {
      result.sort((a, b) => a.resalePrice - b.resalePrice);
    }

    return result;
  }, [searchQuery, selectedCategory, vegOnly, smartResaleOnly, sortBy, activeHubFilter, selectedCity]);

  // Flash Deals for Offers Section
  const flashDeals = useMemo(() => {
    return MOCK_FOOD_ITEMS.filter((f) => f.isSmartResale && f.resaleDiscountPercent >= 48);
  }, []);

  const handleClearSearch = () => {
    setSearchQuery('');
    setSelectedCategory('All');
    setVegOnly(false);
    setSmartResaleOnly(false);
    setActiveHubFilter(null);
  };

  const handleOrderPlaced = (newOrder: OrderRecord) => {
    setOrders((prev) => [newOrder, ...prev]);
    setCartItems([]);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5] text-stone-900 selection:bg-orange-600 selection:text-white">
      {/* Sticky Header */}
      <Header
        activeSection={activeSection}
        onNavigate={scrollToSection}
        searchQuery={searchQuery}
        onSearchChange={(q) => {
          setSearchQuery(q);
          if (q.trim() && activeSection !== 'explore-food') {
            scrollToSection('explore-food');
          }
        }}
        onSearchClear={() => setSearchQuery('')}
        resultCount={filteredFoods.length}
        cartItems={cartItems}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenProfile={() => setIsOrdersOpen(true)}
        selectedCity={selectedCity}
        onCityChange={handleCityChange}
        userLocation={userDeliveryLocation}
        activeHubName={activeHubFilter?.name}
      />

      <main className="flex-1">
        {/* Hero Section */}
        <HeroSection
          onExploreClick={() => scrollToSection('explore-food')}
          onHowItWorksClick={() => scrollToSection('how-it-works')}
          featuredFood={MOCK_FOOD_ITEMS[0]}
          onAddToCart={handleAddToCart}
          onViewFoodDetails={(food) => setInspectedFood(food)}
          selectedCity={selectedCity}
        />

        {/* Our Agenda & How It Works Section */}
        <AgendaSection />

        {/* Explore Food & Workable Search Grid */}
        <FoodGrid
          foods={filteredFoods}
          selectedCategory={selectedCategory}
          onSelectCategory={(cat) => setSelectedCategory(cat)}
          vegOnly={vegOnly}
          onToggleVegOnly={() => setVegOnly(!vegOnly)}
          smartResaleOnly={smartResaleOnly}
          onToggleSmartResaleOnly={() => setSmartResaleOnly(!smartResaleOnly)}
          sortBy={sortBy}
          onSortByChange={setSortBy}
          searchQuery={searchQuery}
          onClearSearch={handleClearSearch}
          cartMap={cartMap}
          onAddToCart={handleAddToCart}
          onRemoveFromCart={handleRemoveFromCart}
          onInspect={(food) => setInspectedFood(food)}
          activeHubName={activeHubFilter?.name}
          onClearHubFilter={() => setActiveHubFilter(null)}
          userDeliveryLocation={userDeliveryLocation}
        />

        {/* Delivery Radius Map Section */}
        <DeliveryMapSection
          selectedCity={selectedCity}
          onCityChange={handleCityChange}
          onFilterMenuByHub={(hubId, hubName) => {
            setActiveHubFilter({ id: hubId, name: hubName });
            scrollToSection('explore-food');
          }}
          onSetUserLocation={(locality, pincode, dist) => {
            setUserDeliveryLocation(`${locality} (${pincode})`);
            setUserPincode(pincode);
            setUserDistanceKm(dist);
          }}
          activeHubId={activeHubFilter?.id}
        />

        {/* Safety & Hygiene Protocol Section */}
        <SafetySection />

        {/* Flash Offers & Promo Codes Section */}
        <OffersSection
          flashDeals={flashDeals}
          onAddToCart={handleAddToCart}
          onInspect={(food) => setInspectedFood(food)}
          onApplyCoupon={(cp) => {
            setAppliedCoupon(cp);
            setIsCartOpen(true);
          }}
          appliedCouponCode={appliedCoupon?.code}
          onOpenCart={() => setIsCartOpen(true)}
        />
      </main>

      {/* Footer */}
      <Footer
        onNavigate={scrollToSection}
        onPartnerClick={() => setIsPartnerOpen(true)}
      />

      {/* Slide-out Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onAddToCart={handleAddToCart}
        onRemoveFromCart={handleRemoveFromCart}
        onClearCart={handleClearCart}
        onProceedToCheckout={(skip) => {
          setSkipCutlery(skip);
          setIsCartOpen(false);
          setIsCheckoutOpen(true);
        }}
        appliedCoupon={appliedCoupon}
        onApplyCoupon={setAppliedCoupon}
        userDistanceKm={userDistanceKm}
        skipCutlery={skipCutlery}
        onToggleSkipCutlery={setSkipCutlery}
      />

      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        items={cartItems}
        skipCutlery={skipCutlery}
        onOrderPlaced={handleOrderPlaced}
        selectedCity={selectedCity}
        userAddress={userDeliveryLocation}
        userPincode={userPincode}
        appliedCoupon={appliedCoupon}
        onApplyCoupon={setAppliedCoupon}
        userDistanceKm={userDistanceKm}
      />

      {/* Food Transparency & Inspection Modal */}
      <FoodDetailModal
        food={inspectedFood}
        onClose={() => setInspectedFood(null)}
        onAddToCart={handleAddToCart}
        quantityInCart={inspectedFood ? cartMap[inspectedFood.id] || 0 : 0}
      />

      {/* My Orders & Impact Modal */}
      <OrdersModal
        isOpen={isOrdersOpen}
        onClose={() => setIsOrdersOpen(false)}
        orders={orders}
      />

      {/* Cloud Kitchen Partner Modal */}
      <PartnerModal
        isOpen={isPartnerOpen}
        onClose={() => setIsPartnerOpen(false)}
      />
    </div>
  );
}
