'use client';

import React, { useState, useEffect } from 'react';
import { useI18n } from '@/lib/i18n';
import {
  MapPin,
  Navigation,
  ArrowRight,
  Truck,
  Home,
  Building2,
  Check,
  AlertCircle,
  RefreshCw,
  Sparkles,
  Zap,
} from 'lucide-react';
import { LocationEntry } from '@/lib/locations';

interface ServiceOption {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  pricingType: string;
  pricingRules: {
    id: string;
    name: string;
    minLoad: number | null;
    maxLoad: number | null;
    ratePerKm: number;
    minDistanceKm: number;
  }[];
}

interface QuoteResult {
  service: { id: string; name: string; slug: string };
  pricingRule: { id: string; name: string; ratePerKm: number };
  pickup: { city: string; state: string; pincode: string };
  destination: { city: string; state: string; pincode: string };
  distanceKm: number;
  durationText?: string;
  estimatedAmount: number;
}

interface BookingCalculatorProps {
  onOpenBookingModal: (quoteData: {
    serviceId: string;
    pricingRuleId: string;
    loadCapacity?: number | string;
    pickup: any;
    destination: any;
    quote: QuoteResult;
  }) => void;
}

export default function BookingCalculator({ onOpenBookingModal }: BookingCalculatorProps) {
  const { t } = useI18n();

  // Locations state
  const [pickupQuery, setPickupQuery] = useState('Erode, Tamil Nadu');
  const [pickupLocation, setPickupLocation] = useState<any>({
    city: 'Erode',
    district: 'Erode',
    state: 'Tamil Nadu',
    pincode: '638001',
    latitude: 11.341,
    longitude: 77.7172,
  });
  const [pickupSuggestions, setPickupSuggestions] = useState<LocationEntry[]>([]);
  const [showPickupDropdown, setShowPickupDropdown] = useState(false);

  const [destQuery, setDestQuery] = useState('Coimbatore, Tamil Nadu');
  const [destLocation, setDestLocation] = useState<any>({
    city: 'Coimbatore',
    district: 'Coimbatore',
    state: 'Tamil Nadu',
    pincode: '641001',
    latitude: 11.0168,
    longitude: 76.9558,
  });
  const [destSuggestions, setDestSuggestions] = useState<LocationEntry[]>([]);
  const [showDestDropdown, setShowDestDropdown] = useState(false);

  // Dynamic Services state
  const [services, setServices] = useState<ServiceOption[]>([]);
  const [selectedServiceId, setSelectedServiceId] = useState<string>('');
  const [selectedLoadCapacity, setSelectedLoadCapacity] = useState<string>('2.5–5 Ton');
  const [loadingServices, setLoadingServices] = useState(true);

  // Calculation & Results state
  const [isCalculating, setIsCalculating] = useState(false);
  const [quoteResult, setQuoteResult] = useState<QuoteResult | null>(null);
  const [calcError, setCalcError] = useState<string | null>(null);

  // Fetch dynamic services from database API
  useEffect(() => {
    async function loadServices() {
      try {
        setLoadingServices(true);
        const res = await fetch('/api/services');
        const data = await res.json();
        if (data.success && data.data?.length > 0) {
          setServices(data.data);
          setSelectedServiceId(data.data[0].id);
        }
      } catch (err) {
        console.error('Failed to load services:', err);
      } finally {
        setLoadingServices(false);
      }
    }
    loadServices();
  }, []);

  // Fetch pickup location suggestions
  useEffect(() => {
    if (!pickupQuery || pickupQuery.length < 2) {
      setPickupSuggestions([]);
      return;
    }
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`/api/locations/search?q=${encodeURIComponent(pickupQuery)}`);
        const data = await res.json();
        if (data.success) {
          setPickupSuggestions(data.data);
        }
      } catch {
        // ignore
      }
    }, 200);
    return () => clearTimeout(timer);
  }, [pickupQuery]);

  // Fetch destination location suggestions
  useEffect(() => {
    if (!destQuery || destQuery.length < 2) {
      setDestSuggestions([]);
      return;
    }
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`/api/locations/search?q=${encodeURIComponent(destQuery)}`);
        const data = await res.json();
        if (data.success) {
          setDestSuggestions(data.data);
        }
      } catch {
        // ignore
      }
    }, 200);
    return () => clearTimeout(timer);
  }, [destQuery]);

  // Current active service
  const currentService = services.find((s) => s.id === selectedServiceId) || services[0];

  // Helper for service colors & icon
  const getServiceDesign = (slug: string, iconName: string, isSelected: boolean) => {
    if (slug.includes('home')) {
      return {
        icon: <Home className="w-5 h-5 text-amber-600" />,
        badgeBg: 'bg-amber-100 text-amber-800 border-amber-200',
        activeBorder: 'border-amber-500 bg-amber-50/70 ring-amber-400/20',
        activePill: 'bg-amber-500',
      };
    } else if (slug.includes('office')) {
      return {
        icon: <Building2 className="w-5 h-5 text-indigo-600" />,
        badgeBg: 'bg-indigo-100 text-indigo-800 border-indigo-200',
        activeBorder: 'border-indigo-500 bg-indigo-50/70 ring-indigo-400/20',
        activePill: 'bg-indigo-600',
      };
    } else {
      return {
        icon: <Truck className="w-5 h-5 text-emerald-600" />,
        badgeBg: 'bg-emerald-100 text-emerald-800 border-emerald-200',
        activeBorder: 'border-emerald-500 bg-emerald-50/70 ring-emerald-400/20',
        activePill: 'bg-emerald-600',
      };
    }
  };

  // Perform Quote Calculation
  const handleCalculatePrice = async () => {
    setCalcError(null);

    if (!pickupLocation || !destLocation) {
      setCalcError(t('calculator.errorSelectLocations'));
      return;
    }

    if (
      pickupLocation.city.toLowerCase() === destLocation.city.toLowerCase() &&
      pickupLocation.pincode === destLocation.pincode
    ) {
      setCalcError(t('calculator.errorSameLocation'));
      return;
    }

    if (!currentService) {
      setCalcError('Please select a valid service.');
      return;
    }

    setIsCalculating(true);
    try {
      const res = await fetch('/api/quote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pickup: pickupLocation,
          destination: destLocation,
          serviceId: currentService.id,
          loadCapacity: currentService.pricingType === 'LOAD_BASED' ? selectedLoadCapacity : undefined,
        }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || 'Failed to calculate price estimate');
      }

      setQuoteResult(json.data);
    } catch (err: any) {
      setCalcError(err.message || 'Error calculating route distance and quotation.');
    } finally {
      setIsCalculating(false);
    }
  };

  return (
    <div id="calculator" className="w-full max-w-4xl mx-auto">
      <div className="glass-card rounded-2xl sm:rounded-[2.5rem] p-4 sm:p-10 border border-slate-200/80 shadow-2xl relative overflow-hidden bg-white/95">
        {/* Dynamic colorful decorative ambient glows */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-gradient-to-br from-amber-300/30 to-rose-400/30 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-gradient-to-tr from-blue-300/30 via-indigo-300/30 to-purple-300/30 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10">
          <div className="flex items-center justify-between mb-5 sm:mb-8 pb-3 sm:pb-4 border-b border-slate-100">
            <div className="flex items-center space-x-2.5 sm:space-x-3">
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-tr from-amber-500 via-rose-500 to-indigo-600 text-white flex items-center justify-center shadow-md shadow-rose-500/20">
                <Zap className="w-4 h-4 sm:w-5 sm:h-5 fill-current" />
              </div>
              <div>
                <h2 className="text-lg sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                  {t('calculator.title')}
                </h2>
                <p className="text-[11px] sm:text-xs text-slate-500">Instant database-computed road quote &bull; Zero hidden fees</p>
              </div>
            </div>

            <span className="hidden sm:inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>TN &bull; KA &bull; KL</span>
            </span>
          </div>

          {/* Grid Layout for Steps 1 & 2 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-5 sm:mb-6">
            {/* STEP 1: Pickup Location */}
            <div className="relative">
              <label className="block text-xs sm:text-sm font-extrabold text-slate-800 uppercase tracking-wider mb-1.5 sm:mb-2 flex items-center space-x-1.5">
                <span className="w-5 h-5 sm:w-6 sm:h-6 rounded-lg bg-amber-500 text-white flex items-center justify-center text-[10px] sm:text-xs font-bold shadow-sm">1</span>
                <span>{t('calculator.step1')}</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={pickupQuery}
                  onChange={(e) => {
                    setPickupQuery(e.target.value);
                    setShowPickupDropdown(true);
                  }}
                  onFocus={() => setShowPickupDropdown(true)}
                  placeholder={t('calculator.step1Placeholder')}
                  className="w-full pl-9 sm:pl-11 pr-3 sm:pr-4 py-3 sm:py-4 bg-slate-50/80 hover:bg-white focus:bg-white rounded-xl sm:rounded-2xl border-2 border-slate-200 focus:border-amber-500 focus:ring-4 focus:ring-amber-500/15 text-slate-900 text-xs sm:text-sm font-semibold transition-all shadow-sm outline-none"
                />
                <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-amber-500 absolute left-3 top-3.5 sm:top-4" />
              </div>

              {/* Pickup Suggestions Dropdown */}
              {showPickupDropdown && pickupSuggestions.length > 0 && (
                <div className="absolute left-0 right-0 mt-1 max-h-52 overflow-y-auto bg-white rounded-xl sm:rounded-2xl border border-slate-200 shadow-2xl z-30 py-1 divide-y divide-slate-100">
                  {pickupSuggestions.map((loc) => (
                    <button
                      key={loc.id}
                      type="button"
                      onClick={() => {
                        setPickupLocation({
                          city: loc.name,
                          district: loc.district,
                          state: loc.state,
                          pincode: loc.pincode,
                          latitude: loc.latitude,
                          longitude: loc.longitude,
                        });
                        setPickupQuery(`${loc.name}, ${loc.state} (${loc.pincode})`);
                        setShowPickupDropdown(false);
                      }}
                      className="w-full text-left px-3.5 py-2 hover:bg-amber-50/60 flex items-center justify-between text-xs sm:text-sm transition-colors"
                    >
                      <div>
                        <span className="font-bold text-slate-800">{loc.name}</span>
                        <span className="text-slate-500 text-[11px] sm:text-xs ml-1.5">({loc.district}, {loc.state})</span>
                      </div>
                      <span className="text-[10px] sm:text-xs font-mono font-bold text-amber-700 bg-amber-50 border border-amber-200 px-1.5 py-0.5 rounded">
                        {loc.pincode}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* STEP 2: Destination Location */}
            <div className="relative">
              <label className="block text-xs sm:text-sm font-extrabold text-slate-800 uppercase tracking-wider mb-1.5 sm:mb-2 flex items-center space-x-1.5">
                <span className="w-5 h-5 sm:w-6 sm:h-6 rounded-lg bg-indigo-600 text-white flex items-center justify-center text-[10px] sm:text-xs font-bold shadow-sm">2</span>
                <span>{t('calculator.step2')}</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={destQuery}
                  onChange={(e) => {
                    setDestQuery(e.target.value);
                    setShowDestDropdown(true);
                  }}
                  onFocus={() => setShowDestDropdown(true)}
                  placeholder={t('calculator.step2Placeholder')}
                  className="w-full pl-9 sm:pl-11 pr-3 sm:pr-4 py-3 sm:py-4 bg-slate-50/80 hover:bg-white focus:bg-white rounded-xl sm:rounded-2xl border-2 border-slate-200 focus:border-indigo-600 focus:ring-4 focus:ring-indigo-600/15 text-slate-900 text-xs sm:text-sm font-semibold transition-all shadow-sm outline-none"
                />
                <Navigation className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-600 absolute left-3 top-3.5 sm:top-4" />
              </div>

              {/* Destination Suggestions Dropdown */}
              {showDestDropdown && destSuggestions.length > 0 && (
                <div className="absolute left-0 right-0 mt-1.5 max-h-56 overflow-y-auto bg-white rounded-2xl border border-slate-200 shadow-2xl z-30 py-1.5 divide-y divide-slate-100">
                  {destSuggestions.map((loc) => (
                    <button
                      key={loc.id}
                      type="button"
                      onClick={() => {
                        setDestLocation({
                          city: loc.name,
                          district: loc.district,
                          state: loc.state,
                          pincode: loc.pincode,
                          latitude: loc.latitude,
                          longitude: loc.longitude,
                        });
                        setDestQuery(`${loc.name}, ${loc.state} (${loc.pincode})`);
                        setShowDestDropdown(false);
                      }}
                      className="w-full text-left px-4 py-2.5 hover:bg-indigo-50/60 flex items-center justify-between text-xs sm:text-sm transition-colors"
                    >
                      <div>
                        <span className="font-bold text-slate-800">{loc.name}</span>
                        <span className="text-slate-500 text-xs ml-1.5">({loc.district}, {loc.state})</span>
                      </div>
                      <span className="text-xs font-mono font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded-md">
                        {loc.pincode}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* STEP 3: Dynamic Services Cards */}
          <div className="mb-6">
            <label className="block text-xs sm:text-sm font-extrabold text-slate-800 uppercase tracking-wider mb-3 flex items-center space-x-1.5">
              <span className="w-6 h-6 rounded-lg bg-rose-500 text-white flex items-center justify-center text-xs font-bold shadow-sm">3</span>
              <span>{t('calculator.step3')}</span>
            </label>

            {loadingServices ? (
              <div className="flex items-center justify-center p-6 text-slate-400 text-sm">
                <RefreshCw className="w-4 h-4 animate-spin mr-2" /> Loading transport options...
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 sm:gap-4">
                {services.map((srv) => {
                  const isSelected = selectedServiceId === srv.id;
                  const design = getServiceDesign(srv.slug, srv.icon, isSelected);

                  return (
                    <button
                      key={srv.id}
                      type="button"
                      onClick={() => {
                        setSelectedServiceId(srv.id);
                        setQuoteResult(null);
                      }}
                      className={`p-4 sm:p-5 rounded-2xl text-left border-2 transition-all flex flex-col justify-between tap-target relative group ${
                        isSelected
                          ? `${design.activeBorder} shadow-lg ring-4`
                          : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/60'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="p-2.5 rounded-xl bg-white shadow-sm border border-slate-100 group-hover:scale-110 transition-transform">
                          {design.icon}
                        </div>
                        {isSelected && (
                          <div className={`w-6 h-6 rounded-full ${design.activePill} text-white flex items-center justify-center shadow-sm`}>
                            <Check className="w-4 h-4 stroke-[3]" />
                          </div>
                        )}
                      </div>
                      <div>
                        <div className="font-extrabold text-slate-900 text-sm sm:text-base">{srv.name}</div>
                        <div className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                          {srv.description}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Load Capacity Selection (if service is load-based or has multiple rules) */}
          {currentService?.pricingRules && currentService.pricingRules.length > 1 && (
            <div className="mb-6 p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-emerald-50/80 via-teal-50/80 to-cyan-50/80 border border-emerald-200/80 animate-in fade-in duration-200">
              <label className="block text-xs sm:text-sm font-bold text-emerald-950 mb-2.5">
                {t('calculator.loadCapacity')}
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {currentService.pricingRules.map((rule) => {
                  const isSelected = selectedLoadCapacity === rule.name;
                  return (
                    <button
                      key={rule.id}
                      type="button"
                      onClick={() => {
                        setSelectedLoadCapacity(rule.name);
                        setQuoteResult(null);
                      }}
                      className={`px-3.5 py-3 rounded-xl text-xs sm:text-sm font-extrabold border-2 transition-all text-center ${
                        isSelected
                          ? 'bg-emerald-600 text-white border-emerald-600 shadow-md shadow-emerald-600/25'
                          : 'bg-white text-emerald-900 border-emerald-200 hover:bg-emerald-50'
                      }`}
                    >
                      {rule.name}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Validation Error Banner */}
          {calcError && (
            <div className="mb-6 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs sm:text-sm flex items-center space-x-2.5">
              <AlertCircle className="w-5 h-5 flex-shrink-0 text-rose-600" />
              <span className="font-semibold">{calcError}</span>
            </div>
          )}

          {/* Calculate Price CTA */}
          <button
            type="button"
            onClick={handleCalculatePrice}
            disabled={isCalculating}
            className="w-full py-4 sm:py-5 px-6 rounded-2xl bg-gradient-to-r from-rose-600 via-purple-600 to-indigo-600 hover:from-rose-700 hover:via-purple-700 hover:to-indigo-700 active:scale-[0.99] text-white text-base sm:text-lg font-extrabold shadow-xl shadow-rose-600/25 flex items-center justify-center space-x-2.5 transition-all disabled:opacity-75 tap-target"
          >
            {isCalculating ? (
              <>
                <RefreshCw className="w-5 h-5 animate-spin" />
                <span>{t('calculator.calculating')}</span>
              </>
            ) : (
              <>
                <span>{t('calculator.calculateBtn')}</span>
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>

          {/* Quotation Results Box */}
          {quoteResult && (
            <div className="mt-6 sm:mt-8 p-4 sm:p-8 rounded-2xl sm:rounded-3xl bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 text-white border border-slate-800 shadow-2xl animate-in fade-in slide-in-from-bottom-3 duration-300">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 pb-4 sm:pb-6 border-b border-slate-800">
                <div>
                  <div className="text-[11px] sm:text-xs uppercase tracking-wider text-amber-400 font-extrabold mb-1 flex items-center space-x-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>{t('calculator.estimatedCost')}</span>
                  </div>
                  <div className="text-3xl sm:text-5xl font-black text-white tracking-tight bg-gradient-to-r from-white via-amber-200 to-emerald-300 bg-clip-text text-transparent">
                    ₹{quoteResult.estimatedAmount.toLocaleString('en-IN')}
                  </div>
                </div>

                <div className="flex items-center justify-around sm:justify-start space-x-3 sm:space-x-4 bg-slate-900/90 px-3.5 sm:px-5 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl border border-slate-700/80">
                  <div>
                    <div className="text-[9px] sm:text-[10px] text-slate-400 uppercase font-bold">{t('calculator.distance')}</div>
                    <div className="text-base sm:text-lg font-black text-cyan-400">{quoteResult.distanceKm} KM</div>
                  </div>
                  <div className="h-6 sm:h-8 w-px bg-slate-700" />
                  <div>
                    <div className="text-[9px] sm:text-[10px] text-slate-400 uppercase font-bold">{t('calculator.ratePerKm')}</div>
                    <div className="text-base sm:text-lg font-black text-emerald-400">₹{quoteResult.pricingRule.ratePerKm}/km</div>
                  </div>
                </div>
              </div>

              <div className="py-3 sm:py-4 text-xs sm:text-sm text-slate-300 leading-relaxed">
                <span className="font-bold text-amber-400">Route:</span> {quoteResult.pickup.city} → {quoteResult.destination.city} &bull; <span className="font-bold text-amber-400">Service:</span> {quoteResult.service.name} ({quoteResult.pricingRule.name})
              </div>

              <p className="text-[10px] sm:text-xs text-slate-400 mb-4 sm:mb-6 italic">
                {t('calculator.disclaimer')}
              </p>

              <button
                type="button"
                onClick={() =>
                  onOpenBookingModal({
                    serviceId: currentService.id,
                    pricingRuleId: quoteResult.pricingRule.id,
                    loadCapacity: selectedLoadCapacity,
                    pickup: pickupLocation,
                    destination: destLocation,
                    quote: quoteResult,
                  })
                }
                className="w-full py-4 sm:py-4.5 px-6 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-600 hover:to-teal-500 text-slate-950 font-black text-base sm:text-lg shadow-lg shadow-emerald-500/30 flex items-center justify-center space-x-2 transition-transform active:scale-[0.99] tap-target"
              >
                <span>{t('calculator.bookNow')}</span>
                <ArrowRight className="w-5 h-5 text-slate-950" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
