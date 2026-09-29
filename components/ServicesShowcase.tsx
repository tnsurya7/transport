'use client';

import React, { useState, useEffect } from 'react';
import { useI18n } from '@/lib/i18n';
import { Truck, Home, Building2, ShieldCheck, Clock, CheckCircle, ArrowRight, Sparkles, Award } from 'lucide-react';
import Link from 'next/link';

interface ServiceItem {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  pricingType: string;
  pricingRules: {
    id: string;
    name: string;
    ratePerKm: number;
    minLoad: number | null;
    maxLoad: number | null;
  }[];
}

export default function ServicesShowcase() {
  const { t } = useI18n();
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchServices() {
      try {
        const res = await fetch('/api/services');
        const data = await res.json();
        if (data.success) {
          setServices(data.data);
        }
      } catch {
        // fallback
      } finally {
        setLoading(false);
      }
    }
    fetchServices();
  }, []);

  const getServicePalette = (slug: string, iconName: string) => {
    if (slug.includes('home')) {
      return {
        icon: <Home className="w-8 h-8 text-amber-600" />,
        gradient: 'from-amber-500/10 via-orange-500/5 to-white',
        border: 'border-amber-200/80 hover:border-amber-400',
        badge: 'bg-amber-100 text-amber-800 border-amber-200',
        btnGradient: 'bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700',
        accentColor: 'text-amber-600',
      };
    } else if (slug.includes('office')) {
      return {
        icon: <Building2 className="w-8 h-8 text-indigo-600" />,
        gradient: 'from-indigo-500/10 via-blue-500/5 to-white',
        border: 'border-indigo-200/80 hover:border-indigo-400',
        badge: 'bg-indigo-100 text-indigo-800 border-indigo-200',
        btnGradient: 'bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700',
        accentColor: 'text-indigo-600',
      };
    } else {
      return {
        icon: <Truck className="w-8 h-8 text-emerald-600" />,
        gradient: 'from-emerald-500/10 via-teal-500/5 to-white',
        border: 'border-emerald-200/80 hover:border-emerald-400',
        badge: 'bg-emerald-100 text-emerald-800 border-emerald-200',
        btnGradient: 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700',
        accentColor: 'text-emerald-600',
      };
    }
  };

  return (
    <section className="py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
        <span className="inline-flex items-center space-x-1.5 text-xs font-black uppercase tracking-widest text-rose-700 bg-rose-50 px-4 py-1.5 rounded-full border border-rose-200 shadow-sm">
          <Award className="w-3.5 h-3.5 text-rose-600" />
          <span>Sabarisan Transport Fleets</span>
        </span>
        <h2 className="text-3xl sm:text-5xl font-black text-slate-900 mt-4 tracking-tight">
          {t('services.title')}
        </h2>
        <p className="text-sm sm:text-base text-slate-600 mt-3 leading-relaxed">
          {t('services.subtitle')}
        </p>
      </div>

      {/* Services Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
        {services.map((srv) => {
          const palette = getServicePalette(srv.slug, srv.icon);

          return (
            <div
              key={srv.id}
              className={`rounded-3xl p-6 sm:p-8 flex flex-col justify-between hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 border-2 ${palette.border} bg-gradient-to-b ${palette.gradient} group shadow-md`}
            >
              <div>
                <div className="w-16 h-16 rounded-2xl bg-white shadow-md border border-slate-100 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  {palette.icon}
                </div>

                <h3 className="text-xl sm:text-2xl font-black text-slate-900 mb-2">
                  {srv.name}
                </h3>
                <p className="text-slate-600 text-xs sm:text-sm leading-relaxed mb-6">
                  {srv.description}
                </p>

                {/* Pricing Rules Preview */}
                {srv.pricingRules && srv.pricingRules.length > 0 && (
                  <div className="space-y-2 mb-6">
                    <div className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                      Standard Tariff Rates
                    </div>
                    {srv.pricingRules.map((rule) => (
                      <div
                        key={rule.id}
                        className="flex justify-between items-center text-xs py-2 px-3 rounded-xl bg-white/90 border border-slate-200/80 shadow-sm"
                      >
                        <span className="font-bold text-slate-800">{rule.name}</span>
                        <span className={`font-black ${palette.accentColor} text-sm`}>
                          ₹{rule.ratePerKm} / KM
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="pt-4 border-t border-slate-200/60">
                <Link
                  href="/#calculator"
                  className={`w-full py-3.5 px-4 rounded-xl ${palette.btnGradient} text-white font-extrabold text-xs sm:text-sm flex items-center justify-center space-x-2 transition-all shadow-md active:scale-95 tap-target`}
                >
                  <span>Book {srv.name}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>

      {/* Trust Badges Row with colorful accents */}
      <div className="mt-14 grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 pt-10 border-t border-slate-200">
        <div className="flex items-center space-x-3 p-4 rounded-2xl bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200/80 shadow-sm">
          <Clock className="w-7 h-7 text-amber-600 flex-shrink-0" />
          <span className="text-xs sm:text-sm font-extrabold text-amber-950">{t('services.features.ontime')}</span>
        </div>
        <div className="flex items-center space-x-3 p-4 rounded-2xl bg-gradient-to-r from-indigo-50 to-blue-50 border border-indigo-200/80 shadow-sm">
          <ShieldCheck className="w-7 h-7 text-indigo-600 flex-shrink-0" />
          <span className="text-xs sm:text-sm font-extrabold text-indigo-950">{t('services.features.verified')}</span>
        </div>
        <div className="flex items-center space-x-3 p-4 rounded-2xl bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200/80 shadow-sm">
          <CheckCircle className="w-7 h-7 text-emerald-600 flex-shrink-0" />
          <span className="text-xs sm:text-sm font-extrabold text-emerald-950">{t('services.features.pricing')}</span>
        </div>
        <div className="flex items-center space-x-3 p-4 rounded-2xl bg-gradient-to-r from-rose-50 to-pink-50 border border-rose-200/80 shadow-sm">
          <Truck className="w-7 h-7 text-rose-600 flex-shrink-0" />
          <span className="text-xs sm:text-sm font-extrabold text-rose-950">{t('services.features.support')}</span>
        </div>
      </div>
    </section>
  );
}
