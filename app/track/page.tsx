'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Navbar from '@/components/Navbar';
import TrackingTimeline from '@/components/TrackingTimeline';
import FloatingContactButtons from '@/components/FloatingContactButtons';
import Footer from '@/components/Footer';
import { useI18n } from '@/lib/i18n';
import { Search, MapPin, Truck, RefreshCw, AlertCircle, ArrowRight, ShieldCheck } from 'lucide-react';
import Link from 'next/link';

function TrackingContent() {
  const searchParams = useSearchParams();
  const { t } = useI18n();

  const [queryId, setQueryId] = useState('');
  const [loading, setLoading] = useState(false);
  const [trackingData, setTrackingData] = useState<any>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const fetchTracking = async (id: string) => {
    if (!id || id.trim().length === 0) return;
    setLoading(true);
    setErrorMsg(null);
    try {
      const res = await fetch(`/api/tracking/${encodeURIComponent(id.trim())}`);
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || t('tracking.notFound'));
      }
      setTrackingData(data.data);
    } catch (err: any) {
      setTrackingData(null);
      setErrorMsg(err.message || t('tracking.notFound'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const idFromUrl = searchParams.get('id');
    if (idFromUrl) {
      setQueryId(idFromUrl);
      fetchTracking(idFromUrl);
    }
  }, [searchParams]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchTracking(queryId);
  };

  return (
    <div className="max-w-4xl mx-auto px-3.5 sm:px-6 py-6 sm:py-16">
      {/* Page Title */}
      <div className="text-center max-w-2xl mx-auto mb-6 sm:mb-10">
        <span className="text-[11px] sm:text-xs font-bold uppercase tracking-widest text-brand-600 bg-brand-50 px-3 py-1 rounded-full border border-brand-200">
          Live Logistics Tracking
        </span>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 mt-2.5 sm:mt-3 tracking-tight">
          {t('tracking.title')}
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 mt-1.5 sm:mt-2">
          {t('tracking.subtitle')}
        </p>
      </div>

      {/* Search Bar Card */}
      <div className="glass-card rounded-2xl sm:rounded-3xl p-4 sm:p-8 border border-slate-200/80 shadow-xl mb-6 sm:mb-8">
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-2.5 sm:gap-3">
          <div className="relative flex-1">
            <input
              type="text"
              required
              value={queryId}
              onChange={(e) => setQueryId(e.target.value)}
              placeholder={t('tracking.placeholder')}
              className="w-full pl-9 sm:pl-11 pr-3 sm:pr-4 py-3 sm:py-4 bg-white rounded-xl border border-slate-200 focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 text-slate-900 text-xs sm:text-sm font-semibold outline-none transition-all shadow-sm uppercase placeholder:normal-case font-mono"
            />
            <Search className="w-4 h-4 sm:w-5 sm:h-5 text-slate-400 absolute left-3 top-3.5 sm:top-4" />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="py-3.5 sm:py-4 px-6 sm:px-8 rounded-xl bg-slate-900 hover:bg-slate-800 active:scale-[0.99] text-white font-bold text-xs sm:text-sm shadow-md flex items-center justify-center space-x-2 transition-all disabled:opacity-75 tap-target"
          >
            {loading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>{t('tracking.searching')}</span>
              </>
            ) : (
              <span>{t('tracking.searchBtn')}</span>
            )}
          </button>
        </form>

        {errorMsg && (
          <div className="mt-4 sm:mt-5 p-3.5 sm:p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs sm:text-sm flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}
      </div>

      {/* Tracking Result Details */}
      {trackingData && (
        <div className="glass-card rounded-2xl sm:rounded-3xl p-4 sm:p-10 border border-slate-200/80 shadow-2xl animate-in fade-in slide-in-from-bottom-3 duration-300">
          {/* Header Info */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 sm:pb-6 border-b border-slate-100 gap-3 sm:gap-4">
            <div>
              <div className="text-[10px] sm:text-xs text-slate-400 font-bold uppercase tracking-wider">
                Tracking ID
              </div>
              <div className="text-xl sm:text-3xl font-mono font-extrabold text-slate-900">
                {trackingData.trackingId || trackingData.bookingNumber}
              </div>
              <div className="text-[11px] sm:text-xs text-slate-500 mt-0.5 sm:mt-1">
                Booking Reference: <span className="font-mono font-semibold">{trackingData.bookingNumber}</span>
              </div>
            </div>

            <div className="text-left sm:text-right">
              <span className="inline-block px-3.5 py-1.5 rounded-full bg-brand-100 text-brand-800 text-xs font-extrabold uppercase">
                {t(`tracking.statuses.${trackingData.status}`, trackingData.status)}
              </span>
              <div className="text-xs text-slate-400 mt-1.5">
                Service: <span className="font-semibold text-slate-700">{trackingData.serviceName}</span>
              </div>
            </div>
          </div>

          {/* Route Overview */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 my-6 p-4 rounded-2xl bg-slate-50 border border-slate-100">
            <div>
              <div className="text-[11px] text-slate-400 uppercase font-bold">{t('tracking.route')}</div>
              <div className="text-sm font-bold text-slate-900 mt-0.5">
                {trackingData.pickupCity} → {trackingData.destinationCity}
              </div>
              <div className="text-xs text-slate-500">{trackingData.pickupState} to {trackingData.destinationState}</div>
            </div>

            <div>
              <div className="text-[11px] text-slate-400 uppercase font-bold">{t('tracking.distance')}</div>
              <div className="text-sm font-bold text-slate-900 mt-0.5">{trackingData.distanceKm} KM</div>
              <div className="text-xs text-slate-500">Highway Route</div>
            </div>

            <div>
              <div className="text-[11px] text-slate-400 uppercase font-bold">{t('tracking.vehicle')}</div>
              <div className="text-sm font-bold text-slate-900 mt-0.5">
                {trackingData.vehicle ? trackingData.vehicle.vehicleType : 'Assignment Pending'}
              </div>
              <div className="text-xs text-slate-500">Operations Hub Erode</div>
            </div>
          </div>

          {/* Stepper Timeline */}
          <TrackingTimeline
            currentStatus={trackingData.status}
            events={trackingData.trackingEvents}
          />
        </div>
      )}
    </div>
  );
}

export default function TrackPage() {
  return (
    <main className="min-h-screen flex flex-col bg-slate-50/50">
      <Navbar />
      <Suspense fallback={<div className="p-12 text-center text-slate-400">Loading tracking portal...</div>}>
        <TrackingContent />
      </Suspense>
      <FloatingContactButtons />
      <Footer />
    </main>
  );
}
