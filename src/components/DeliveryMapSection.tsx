import React, { useState, useMemo, useRef } from 'react';
import { CLOUD_KITCHEN_HUBS, MOCK_FOOD_ITEMS } from '../data/mockFood';
import { KitchenHub } from '../types';
import {
  MapPin,
  Navigation,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Search,
  Sparkles,
  Zap,
  Info,
  Bike,
  AlertTriangle,
  ArrowRight,
  RotateCcw,
  ChefHat,
  Thermometer
} from 'lucide-react';

interface DeliveryMapSectionProps {
  selectedCity: string;
  onCityChange: (city: string) => void;
  onFilterMenuByHub?: (hubId: string, hubName: string) => void;
  onSetUserLocation?: (locality: string, pincode: string, distanceKm: number) => void;
  activeHubId?: string | null;
}

interface LocalityData {
  pincode: string;
  locality: string;
  city: string;
  hubId: string;
  distanceKm: number;
  relX: number; // percentage from center
  relY: number;
}

const PINCODE_DATABASE: LocalityData[] = [
  // Bengaluru
  { pincode: '560038', locality: 'Indiranagar 100ft Rd', city: 'Bengaluru', hubId: 'hub-blr-indiranagar', distanceKm: 1.2, relX: 18, relY: -15 },
  { pincode: '560008', locality: 'Ulsoor / Halasuru', city: 'Bengaluru', hubId: 'hub-blr-indiranagar', distanceKm: 2.1, relX: -22, relY: -12 },
  { pincode: '560001', locality: 'MG Road / Brigade Rd', city: 'Bengaluru', hubId: 'hub-blr-indiranagar', distanceKm: 3.4, relX: -35, relY: 10 },
  { pincode: '560095', locality: 'Koramangala 5th Block', city: 'Bengaluru', hubId: 'hub-blr-koramangala', distanceKm: 0.9, relX: 12, relY: 14 },
  { pincode: '560034', locality: 'HSR Layout Sector 1', city: 'Bengaluru', hubId: 'hub-blr-koramangala', distanceKm: 3.8, relX: 28, relY: 35 },
  { pincode: '560025', locality: 'Richmond Town', city: 'Bengaluru', hubId: 'hub-blr-indiranagar', distanceKm: 4.2, relX: -38, relY: 22 },
  { pincode: '560066', locality: 'Whitefield ITPL', city: 'Bengaluru', hubId: 'hub-blr-indiranagar', distanceKm: 14.2, relX: 95, relY: -80 },
  // Mumbai
  { pincode: '400050', locality: 'Bandra West Pali Hill', city: 'Mumbai', hubId: 'hub-mum-bandra', distanceKm: 0.8, relX: -14, relY: 12 },
  { pincode: '400051', locality: 'Bandra Kurla Complex (BKC)', city: 'Mumbai', hubId: 'hub-mum-bandra', distanceKm: 2.5, relX: 30, relY: 8 },
  { pincode: '400052', locality: 'Khar West 14th Rd', city: 'Mumbai', hubId: 'hub-mum-bandra', distanceKm: 1.6, relX: -8, relY: -25 },
  { pincode: '400053', locality: 'Andheri West Lokhandwala', city: 'Mumbai', hubId: 'hub-mum-bandra', distanceKm: 5.8, relX: -18, relY: -65 },
  { pincode: '400076', locality: 'Powai Hiranandani', city: 'Mumbai', hubId: 'hub-mum-bandra', distanceKm: 7.2, relX: 75, relY: -45 },
  // Delhi NCR
  { pincode: '122002', locality: 'DLF Cyber City / Phase 2', city: 'Delhi NCR', hubId: 'hub-del-cybercity', distanceKm: 1.1, relX: 14, relY: -10 },
  { pincode: '122001', locality: 'Gurgaon Sector 14', city: 'Delhi NCR', hubId: 'hub-del-cybercity', distanceKm: 3.2, relX: -28, relY: 24 },
  { pincode: '122003', locality: 'Sohna Road Sector 48', city: 'Delhi NCR', hubId: 'hub-del-cybercity', distanceKm: 5.6, relX: 32, relY: 55 },
  { pincode: '110001', locality: 'Connaught Place, Delhi', city: 'Delhi NCR', hubId: 'hub-del-cybercity', distanceKm: 18.5, relX: 90, relY: -90 },
  // Hyderabad
  { pincode: '500081', locality: 'Madhapur Ayyappa Society', city: 'Hyderabad', hubId: 'hub-hyd-madhapur', distanceKm: 0.9, relX: -10, relY: 15 },
  { pincode: '500033', locality: 'Jubilee Hills Rd No. 36', city: 'Hyderabad', hubId: 'hub-hyd-madhapur', distanceKm: 2.3, relX: 25, relY: -18 },
  { pincode: '500084', locality: 'Kondapur Main Rd', city: 'Hyderabad', hubId: 'hub-hyd-madhapur', distanceKm: 3.4, relX: -35, relY: -22 },
  { pincode: '500032', locality: 'Gachibowli Financial Dist', city: 'Hyderabad', hubId: 'hub-hyd-madhapur', distanceKm: 4.8, relX: -48, relY: 38 },
];

export const DeliveryMapSection: React.FC<DeliveryMapSectionProps> = ({
  selectedCity,
  onCityChange,
  onFilterMenuByHub,
  onSetUserLocation,
  activeHubId,
}) => {
  const cityHubs = useMemo(
    () => CLOUD_KITCHEN_HUBS.filter((h) => h.city.toLowerCase() === selectedCity.toLowerCase()),
    [selectedCity]
  );

  const initialHub = useMemo(() => {
    if (activeHubId) {
      const found = CLOUD_KITCHEN_HUBS.find((h) => h.id === activeHubId);
      if (found) return found;
    }
    return cityHubs[0] || CLOUD_KITCHEN_HUBS[0];
  }, [activeHubId, cityHubs]);

  const [selectedHub, setSelectedHub] = useState<KitchenHub>(initialHub);
  const [pincodeInput, setPincodeInput] = useState('560038');
  const [userLocationName, setUserLocationName] = useState('Indiranagar 100ft Rd');
  const [userPincode, setUserPincode] = useState('560038');

  // Customer Map Pin Coordinate (offset in % from center of map container)
  // [x, y] in percentage (-50 to +50)
  const [customerPin, setCustomerPin] = useState<{ x: number; y: number }>({ x: 18, y: -15 });
  const [calculatedDistanceKm, setCalculatedDistanceKm] = useState<number>(1.8);
  const [locationSetSuccess, setLocationSetSuccess] = useState(false);

  const mapContainerRef = useRef<HTMLDivElement>(null);

  // Synchronize initial hub when city changes
  React.useEffect(() => {
    if (cityHubs.length > 0 && !cityHubs.some((h) => h.id === selectedHub.id)) {
      const nextHub = cityHubs[0];
      setSelectedHub(nextHub);

      // Default sample pin for this city
      const sampleLoc = PINCODE_DATABASE.find((p) => p.city.toLowerCase() === selectedCity.toLowerCase());
      if (sampleLoc) {
        setPincodeInput(sampleLoc.pincode);
        setUserLocationName(sampleLoc.locality);
        setUserPincode(sampleLoc.pincode);
        setCustomerPin({ x: sampleLoc.relX, y: sampleLoc.relY });
        setCalculatedDistanceKm(sampleLoc.distanceKm);
      }
    }
  }, [selectedCity, cityHubs, selectedHub.id]);

  // Delivery status analysis
  const deliveryStatus = useMemo(() => {
    if (calculatedDistanceKm <= 3.0) {
      return {
        zone: 'express',
        title: 'Express Delivery Zone',
        badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-300',
        textColor: 'text-emerald-700',
        eta: '12 - 18 mins',
        fee: 0,
        description: 'Within priority 3 km radius. Super-fast thermal dispatch with 0 delivery fee!',
        eligible: true,
      };
    } else if (calculatedDistanceKm <= selectedHub.radiusKm) {
      return {
        zone: 'standard',
        title: 'Standard Radius Zone',
        badgeColor: 'bg-amber-100 text-amber-800 border-amber-300',
        textColor: 'text-amber-700',
        eta: `${Math.round(15 + calculatedDistanceKm * 2)} - ${Math.round(20 + calculatedDistanceKm * 2.5)} mins`,
        fee: 25,
        description: `Within certified ${selectedHub.radiusKm} km radius. Delivered in active heat-insulated thermal bags.`,
        eligible: true,
      };
    } else {
      return {
        zone: 'out-of-range',
        title: 'Beyond 6.5 km Thermal Limit',
        badgeColor: 'bg-red-100 text-red-800 border-red-300',
        textColor: 'text-red-600',
        eta: 'Unavailable',
        fee: 0,
        description: `Distance (${calculatedDistanceKm} km) exceeds our strict thermal quality cutoff (${selectedHub.radiusKm} km). Cooked food cannot travel this far while guaranteeing 65°C warmth.`,
        eligible: false,
      };
    }
  }, [calculatedDistanceKm, selectedHub.radiusKm]);

  // Connected food items from this hub's cloud kitchens
  const hubFoodItems = useMemo(() => {
    return MOCK_FOOD_ITEMS.filter((f) => {
      const matchLocality = f.cloudKitchen.locality.toLowerCase().includes(selectedHub.locality.split(',')[0].toLowerCase()) ||
        selectedHub.name.toLowerCase().includes(f.cloudKitchen.locality.toLowerCase()) ||
        f.cloudKitchen.city.toLowerCase() === selectedCity.toLowerCase();
      return matchLocality;
    });
  }, [selectedHub, selectedCity]);

  // Handle clicking directly on map canvas to set location pin
  const handleMapCanvasClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!mapContainerRef.current) return;
    const rect = mapContainerRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    // Convert to percentage offset (-50 to +50)
    const offsetXPercent = ((clickX - centerX) / centerX) * 50;
    const offsetYPercent = ((clickY - centerY) / centerY) * 50;

    // Radius in percentage: 0 to ~70%
    const radialPercent = Math.sqrt(offsetXPercent * offsetXPercent + offsetYPercent * offsetYPercent);
    // Scale: 40% radius = ~5.0 km
    const estimatedKm = Math.max(0.6, Number(((radialPercent / 38) * 5.0).toFixed(1)));

    setCustomerPin({ x: offsetXPercent, y: offsetYPercent });
    setCalculatedDistanceKm(estimatedKm);
    setUserLocationName(`Custom Pin Location (${estimatedKm} km)`);
    setLocationSetSuccess(false);
  };

  // Handle Pincode form submit
  const handlePincodeSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const query = pincodeInput.trim().toLowerCase();
    if (!query) return;

    // Search in PIN database
    const matched = PINCODE_DATABASE.find(
      (p) => p.pincode === query || p.locality.toLowerCase().includes(query)
    );

    if (matched) {
      setUserLocationName(matched.locality);
      setUserPincode(matched.pincode);
      setCalculatedDistanceKm(matched.distanceKm);
      setCustomerPin({ x: matched.relX, y: matched.relY });

      // If hub differs, switch to appropriate hub if in same city
      const matchingHub = CLOUD_KITCHEN_HUBS.find((h) => h.id === matched.hubId);
      if (matchingHub) {
        setSelectedHub(matchingHub);
        if (matchingHub.city !== selectedCity) {
          onCityChange(matchingHub.city);
        }
      }
    } else {
      // Semi-random deterministic distance for unlisted Indian PIN
      const pseudoRandomKm = Math.min(8.5, Math.max(1.5, Number((((query.charCodeAt(0) || 5) % 6) + 1.4).toFixed(1))));
      setCalculatedDistanceKm(pseudoRandomKm);
      setUserLocationName(`Pincode ${query}`);
      setUserPincode(query);
      setCustomerPin({ x: (pseudoRandomKm / 6) * 35, y: -((pseudoRandomKm / 6) * 30) });
    }
    setLocationSetSuccess(false);
  };

  const handleApplyDeliveryLocation = () => {
    if (onSetUserLocation) {
      onSetUserLocation(userLocationName, userPincode, calculatedDistanceKm);
    }
    setLocationSetSuccess(true);
    setTimeout(() => setLocationSetSuccess(false), 3000);
  };

  const handleFilterMenuClick = () => {
    if (onFilterMenuByHub) {
      onFilterMenuByHub(selectedHub.id, selectedHub.name);
    }
  };

  return (
    <section id="delivery-map" className="py-20 bg-stone-100/70 border-t border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-100 text-orange-800 text-xs font-bold uppercase tracking-wider mb-2.5">
              <Navigation className="w-3.5 h-3.5 text-orange-600" />
              <span>Interactive Hyper-Local Radius Network</span>
            </div>
            <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-stone-900 tracking-tight">
              Cloud Kitchen Hubs & Delivery Radius
            </h2>
            <p className="text-sm sm:text-base text-stone-600 max-w-2xl mt-1">
              Click anywhere on the interactive map or enter your PIN code to calculate real-time distance, thermal delivery eligibility, and browse batches ready at your nearest kitchen park.
            </p>
          </div>

          {/* City Switcher Pills */}
          <div className="flex flex-wrap gap-2">
            {['Bengaluru', 'Mumbai', 'Delhi NCR', 'Hyderabad'].map((city) => (
              <button
                key={city}
                id={`map-city-${city.toLowerCase().replace(/\s+/g, '-')}`}
                type="button"
                onClick={() => {
                  onCityChange(city);
                  const matching = CLOUD_KITCHEN_HUBS.find(
                    (h) => h.city.toLowerCase() === city.toLowerCase()
                  );
                  if (matching) setSelectedHub(matching);
                }}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  selectedCity === city
                    ? 'bg-orange-600 text-white shadow-sm'
                    : 'bg-white text-stone-700 hover:bg-stone-200/80 border border-stone-200'
                }`}
              >
                {city}
              </button>
            ))}
          </div>
        </div>

        {/* Real Workable Layout: Map Stage + Interactive Controller */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: Workable Clickable Map Canvas (7 cols) */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-5 sm:p-6 border border-stone-200 shadow-sm relative overflow-hidden">
            {/* Map Top Status Strip */}
            <div className="flex flex-wrap items-center justify-between gap-2 mb-4 pb-3 border-b border-stone-100 text-xs">
              <div className="flex items-center gap-2">
                <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="font-bold text-stone-900">{selectedHub.name}</span>
                <span className="text-[11px] text-stone-400">({selectedHub.locality})</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-stone-500 font-medium text-[11px]">Radius Limit:</span>
                <span className="text-orange-700 font-bold bg-orange-100 px-2.5 py-0.5 rounded-md text-xs">
                  {selectedHub.radiusKm} km
                </span>
              </div>
            </div>

            {/* Clickable Cartographic Canvas */}
            <div
              ref={mapContainerRef}
              id="interactive-map-canvas"
              onClick={handleMapCanvasClick}
              className="relative h-96 sm:h-[420px] w-full rounded-2xl bg-[#F4F1EA] border border-stone-300/80 overflow-hidden cursor-crosshair select-none group"
              title="Click anywhere on the map to drop your delivery pin"
            >
              {/* Grid Lines Pattern */}
              <div
                className="absolute inset-0 opacity-40 pointer-events-none"
                style={{
                  backgroundImage: `
                    linear-gradient(to right, #ded8cb 1px, transparent 1px),
                    linear-gradient(to bottom, #ded8cb 1px, transparent 1px)
                  `,
                  backgroundSize: '36px 36px',
                }}
              />

              {/* Vector Roads & Transit Curves */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-40">
                <path
                  d="M -20 220 Q 140 140 280 200 T 560 260"
                  fill="none"
                  stroke="#94A3B8"
                  strokeWidth="8"
                />
                <path
                  d="M 60 -40 Q 220 160 360 320 T 580 480"
                  fill="none"
                  stroke="#CBD5E1"
                  strokeWidth="6"
                  strokeDasharray="8 6"
                />
                <path
                  d="M 220 -20 L 260 480"
                  fill="none"
                  stroke="#E2E8F0"
                  strokeWidth="4"
                />
              </svg>

              {/* Click-to-place helper prompt */}
              <div className="absolute top-3 left-3 z-20 bg-stone-900/85 text-white px-3 py-1.5 rounded-xl text-[11px] font-medium flex items-center gap-1.5 shadow-md backdrop-blur-xs pointer-events-none">
                <MapPin className="w-3.5 h-3.5 text-orange-400 shrink-0" />
                <span>Click anywhere on the map to set your location</span>
              </div>

              {/* Concentric Delivery Radius Rings Centered on Hub */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                {/* 6.5km Outer Cutoff Boundary */}
                <div className="absolute w-[340px] h-[340px] rounded-full border-2 border-dashed border-orange-400/50 bg-orange-400/5 flex items-start justify-center pt-1.5">
                  <span className="text-[10px] font-bold text-orange-600 bg-white/85 px-2 py-0.5 rounded-full shadow-2xs">
                    6.5 km Thermal Hold Boundary
                  </span>
                </div>

                {/* 4.5km Standard Zone */}
                <div className="absolute w-[240px] h-[240px] rounded-full border border-orange-500/40 bg-orange-500/10" />

                {/* 2.5km Express Priority Zone */}
                <div className="absolute w-[140px] h-[140px] rounded-full border-2 border-emerald-500/60 bg-emerald-500/15 flex items-start justify-center pt-1">
                  <span className="text-[9px] font-extrabold text-emerald-800 bg-emerald-100/90 px-1.5 py-0.2 rounded-full shadow-2xs">
                    ⚡ Express Zone
                  </span>
                </div>

                {/* Center Hub Marker */}
                <div className="relative z-10 flex flex-col items-center">
                  <div className="w-11 h-11 rounded-2xl bg-orange-600 text-white flex items-center justify-center shadow-xl ring-4 ring-white">
                    <ChefHat className="w-5 h-5" />
                  </div>
                  <div className="mt-1.5 bg-stone-900 text-white text-[10px] font-extrabold px-2.5 py-0.5 rounded-full shadow-md whitespace-nowrap">
                    {selectedHub.name.split(' ')[0]} Hub
                  </div>
                </div>

                {/* User Customer Pin Marker with Interactive Placement */}
                <div
                  className="absolute z-20 transition-all duration-300 pointer-events-none flex flex-col items-center"
                  style={{
                    transform: `translate(${customerPin.x * 3.5}px, ${customerPin.y * 3.5}px)`,
                  }}
                >
                  <div className="relative">
                    <div
                      className={`w-9 h-9 rounded-full flex items-center justify-center shadow-xl ring-3 ring-white ${
                        deliveryStatus.eligible ? 'bg-emerald-600 text-white' : 'bg-red-600 text-white'
                      }`}
                    >
                      <MapPin className="w-4 h-4 animate-bounce" />
                    </div>
                    <span
                      className={`absolute -top-1 -right-1 w-3 h-3 rounded-full animate-ping ${
                        deliveryStatus.eligible ? 'bg-emerald-400' : 'bg-red-400'
                      }`}
                    />
                  </div>

                  <div
                    className={`mt-1 text-[10px] font-bold px-2 py-0.5 rounded-full shadow-md whitespace-nowrap text-white ${
                      deliveryStatus.eligible ? 'bg-stone-900' : 'bg-red-800'
                    }`}
                  >
                    You ({calculatedDistanceKm} km)
                  </div>
                </div>

                {/* Animated Route Line from Hub to Customer */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none">
                  <line
                    x1="50%"
                    y1="50%"
                    x2={`calc(50% + ${customerPin.x * 3.5}px)`}
                    y2={`calc(50% + ${customerPin.y * 3.5}px)`}
                    stroke={deliveryStatus.eligible ? '#EA580C' : '#EF4444'}
                    strokeWidth="2.5"
                    strokeDasharray="5 5"
                    className="animate-pulse"
                  />
                </svg>
              </div>

              {/* Map Legend Bar */}
              <div className="absolute bottom-3 left-3 bg-white/95 backdrop-blur-md px-3 py-2 rounded-xl border border-stone-200 text-[10px] space-y-1 shadow-sm">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  <span className="font-bold text-stone-800">&lt; 3 km Express Zone (12-18 min ETA • Free delivery)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-orange-500" />
                  <span className="font-semibold text-stone-700">3 - 6.5 km Standard Zone (18-28 min ETA)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-400" />
                  <span className="text-stone-500">&gt; 6.5 km Quality cutoff limit</span>
                </div>
              </div>
            </div>

            {/* Live Route Distance Result Strip */}
            <div className="mt-4 p-3.5 rounded-2xl bg-stone-50 border border-stone-200/90 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                    deliveryStatus.eligible ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
                  }`}
                >
                  <Bike className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-stone-900 flex items-center gap-2">
                    <span>{userLocationName}</span>
                    <span className="font-mono text-orange-600">({calculatedDistanceKm} km away)</span>
                  </div>
                  <div className={`text-[11px] font-medium ${deliveryStatus.textColor}`}>
                    {deliveryStatus.description}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {deliveryStatus.eligible ? (
                  <button
                    type="button"
                    onClick={handleApplyDeliveryLocation}
                    className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-2xs flex items-center gap-1.5"
                  >
                    {locationSetSuccess ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Address Confirmed!</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Set as Delivery Spot</span>
                      </>
                    )}
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      // Reset to center
                      setCustomerPin({ x: 12, y: -10 });
                      setCalculatedDistanceKm(1.5);
                      setUserLocationName(`${selectedHub.locality}`);
                    }}
                    className="px-3 py-1.5 bg-stone-200 hover:bg-stone-300 text-stone-700 rounded-xl text-xs font-bold transition-colors flex items-center gap-1"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Reset to Hub Center</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Right: Interactive Locality Search & Hub Selector (5 cols) */}
          <div className="lg:col-span-5 space-y-5">
            {/* 1. Indian Locality & Pincode Checker */}
            <div className="bg-white rounded-3xl p-5 sm:p-6 border border-stone-200 shadow-sm">
              <div className="flex items-center justify-between mb-1">
                <h3 className="font-display text-base font-bold text-stone-900 flex items-center gap-2">
                  <Zap className="w-4 h-4 text-orange-600" />
                  <span>Check Your Address & Radius</span>
                </h3>
                <span className="text-[10px] font-bold text-stone-500 uppercase bg-stone-100 px-2 py-0.5 rounded-full">
                  Instant Test
                </span>
              </div>
              <p className="text-xs text-stone-500 mb-4">
                Enter your 6-digit PIN code or area to check instant thermal delivery eligibility.
              </p>

              <form onSubmit={handlePincodeSearch} className="space-y-3">
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-3" />
                    <input
                      id="delivery-pincode-input"
                      type="text"
                      value={pincodeInput}
                      onChange={(e) => {
                        setPincodeInput(e.target.value);
                      }}
                      placeholder="e.g. 560038 or Indiranagar"
                      className="w-full pl-8.5 pr-3 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs font-semibold text-stone-900 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/15"
                    />
                  </div>
                  <button
                    id="verify-pincode-btn"
                    type="submit"
                    className="px-4 py-2.5 bg-stone-900 hover:bg-orange-600 text-white rounded-xl text-xs font-bold transition-colors shadow-2xs"
                  >
                    Verify
                  </button>
                </div>

                {/* Popular Indian Locality Quick-Chips */}
                <div className="space-y-1 pt-1">
                  <span className="text-[11px] text-stone-400 font-medium">Quick Select Samples:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {PINCODE_DATABASE.filter((p) => p.city.toLowerCase() === selectedCity.toLowerCase())
                      .slice(0, 4)
                      .map((item) => (
                        <button
                          key={item.pincode}
                          type="button"
                          onClick={() => {
                            setPincodeInput(item.pincode);
                            setUserLocationName(item.locality);
                            setUserPincode(item.pincode);
                            setCalculatedDistanceKm(item.distanceKm);
                            setCustomerPin({ x: item.relX, y: item.relY });
                          }}
                          className={`text-[11px] px-2 py-1 rounded-lg border transition-all ${
                            userPincode === item.pincode
                              ? 'bg-orange-50 border-orange-500 text-orange-700 font-bold'
                              : 'bg-stone-50 border-stone-200 text-stone-600 hover:bg-stone-100'
                          }`}
                        >
                          {item.pincode} ({item.locality.split(' ')[0]})
                        </button>
                      ))}
                  </div>
                </div>

                {/* Eligibility Result Banner */}
                <div
                  className={`p-3.5 rounded-2xl border text-xs space-y-1.5 transition-all ${
                    deliveryStatus.eligible
                      ? 'bg-emerald-50/70 border-emerald-200 text-emerald-900'
                      : 'bg-red-50/70 border-red-200 text-red-900'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold flex items-center gap-1.5">
                      {deliveryStatus.eligible ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      ) : (
                        <AlertTriangle className="w-4 h-4 text-red-500 shrink-0" />
                      )}
                      <span>{deliveryStatus.title}</span>
                    </span>
                    <span className="font-extrabold text-[11px] uppercase tracking-wider">
                      ETA: {deliveryStatus.eta}
                    </span>
                  </div>

                  <p className="text-[11px] leading-relaxed opacity-90">
                    {deliveryStatus.description}
                  </p>

                  <div className="pt-2 border-t border-black/5 flex items-center justify-between text-[11px] font-semibold">
                    <span>Estimated Thermal Delivery:</span>
                    <span className="font-bold text-stone-900">
                      {deliveryStatus.fee === 0 ? 'FREE (Express)' : `₹${deliveryStatus.fee}`}
                    </span>
                  </div>
                </div>
              </form>
            </div>

            {/* 2. Cloud Kitchen Parks in Active City */}
            <div className="bg-white rounded-3xl p-5 sm:p-6 border border-stone-200 shadow-sm space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-stone-900">
                  Kitchen Hubs in {selectedCity}
                </span>
                <span className="text-orange-600 font-bold">
                  {cityHubs.length} Hubs Active
                </span>
              </div>

              <div className="space-y-2">
                {cityHubs.map((hub) => (
                  <div
                    key={hub.id}
                    id={`hub-card-${hub.id}`}
                    onClick={() => {
                      setSelectedHub(hub);
                      // Update pin to near center
                      setCustomerPin({ x: 14, y: -12 });
                      setCalculatedDistanceKm(1.6);
                      setUserLocationName(hub.locality);
                    }}
                    className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                      selectedHub.id === hub.id
                        ? 'border-orange-500 bg-orange-50/50 shadow-xs ring-2 ring-orange-500/20'
                        : 'border-stone-200 hover:border-stone-300 hover:bg-stone-50'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-bold text-xs text-stone-900">{hub.name}</h4>
                      <span className="text-[10px] font-extrabold text-orange-700 bg-orange-100 px-2 py-0.5 rounded-md">
                        {hub.radiusKm} km radius
                      </span>
                    </div>

                    <p className="text-[11px] text-stone-500">{hub.address}</p>

                    <div className="mt-2.5 pt-2 border-t border-stone-100 flex items-center justify-between text-[10px] text-stone-600 font-medium">
                      <span>🍳 {hub.topCuisine}</span>
                      <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-md">
                        {hub.activeBatches} active batches
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* 1-Click Action to Browse Batches from this Hub */}
              <div className="pt-2">
                <button
                  id="browse-hub-batches-btn"
                  type="button"
                  onClick={handleFilterMenuClick}
                  className="w-full py-3 rounded-2xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold transition-all shadow-md active:scale-98 flex items-center justify-center gap-2"
                >
                  <ChefHat className="w-4 h-4" />
                  <span>Browse {hubFoodItems.length} Batches from {selectedHub.name.split(' ')[0]} Hub</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
