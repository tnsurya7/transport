'use client';

import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import BookingCalculator from '@/components/BookingCalculator';
import BookingModal from '@/components/BookingModal';
import BookingSuccessModal from '@/components/BookingSuccessModal';
import ServicesShowcase from '@/components/ServicesShowcase';
import FloatingContactButtons from '@/components/FloatingContactButtons';
import Footer from '@/components/Footer';
import { useI18n } from '@/lib/i18n';
import { MapPin, Shield, Zap, Truck, Sparkles, Star, Award, CheckCircle2 } from 'lucide-react';

export default function HomePage() {
  const { t } = useI18n();

  // Booking Modal State
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [activeBookingPayload, setActiveBookingPayload] = useState<any>(null);

  // Success Modal State
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [successBookingData, setSuccessBookingData] = useState<any>(null);

  const handleOpenBookingModal = (payload: any) => {
    setActiveBookingPayload(payload);
    setIsBookingModalOpen(true);
  };

  const handleBookingSuccess = (bookingData: any) => {
    setSuccessBookingData(bookingData);
    setIsSuccessModalOpen(true);
  };

  return (
    <main className="min-h-screen flex flex-col bg-slate-50/50">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-10 sm:pt-16 pb-16 sm:pb-28 overflow-hidden border-b border-slate-200/60">
        {/* Colorful Multi-Layer Ambient Background Gradients */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full pointer-events-none -z-10">
          <div className="absolute top-10 left-10 w-96 h-96 bg-amber-200/40 rounded-full blur-3xl" />
          <div className="absolute top-20 right-10 w-96 h-96 bg-rose-200/40 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/3 w-96 h-96 bg-indigo-200/40 rounded-full blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Hero Header */}
          <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14">
            <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-amber-100 via-rose-100 to-indigo-100 border border-rose-200/80 text-rose-900 text-xs sm:text-sm font-extrabold mb-5 shadow-sm">
              <Sparkles className="w-4 h-4 text-amber-600 fill-amber-500" />
              <span>Sabarisan Transport &bull; Erode Central Fleet</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.15] sm:leading-[1.1]">
              Move Anything.{' '}
              <span className="bg-gradient-to-r from-amber-500 via-rose-600 to-indigo-600 bg-clip-text text-transparent">
                We'll Handle the Journey.
              </span>
            </h1>

            <p className="mt-4 text-base sm:text-lg text-slate-600 max-w-2xl mx-auto font-medium leading-relaxed">
              {t('hero.subtitle')}
            </p>

            {/* Service Areas Badge */}
            <div className="mt-5 flex flex-wrap items-center justify-center gap-2 text-xs font-bold text-slate-700">
              <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center space-x-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Tamil Nadu (All 38 Districts)</span>
              </span>
              <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-800 border border-blue-200 flex items-center space-x-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
                <span>Karnataka (All 31 Districts)</span>
              </span>
              <span className="px-3 py-1 rounded-full bg-purple-50 text-purple-800 border border-purple-200 flex items-center space-x-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-purple-600" />
                <span>Kerala (All 14 Districts)</span>
              </span>
            </div>
          </div>

          {/* Booking Calculator Directly Embedded into Hero */}
          <BookingCalculator onOpenBookingModal={handleOpenBookingModal} />
        </div>
      </section>

      {/* Services Showcase */}
      <ServicesShowcase />

      {/* Why Choose Sabarisan Transport Highlights */}
      <section className="py-16 bg-white border-t border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-7 rounded-3xl bg-gradient-to-br from-amber-50/80 via-white to-orange-50/40 border border-amber-200/80 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-500 text-white flex items-center justify-center font-bold mb-4 shadow-md shadow-amber-500/25">
                <Zap className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-black text-slate-900 mb-2">Instant Dispatch from Erode</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Direct vehicle allocation from our central Erode yard ensuring rapid loading for Bhavani, Coimbatore, Salem, Tirupur, Bengaluru, Chennai, and Kochi routes.
              </p>
            </div>

            <div className="p-7 rounded-3xl bg-gradient-to-br from-indigo-50/80 via-white to-blue-50/40 border border-indigo-200/80 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-600 to-blue-600 text-white flex items-center justify-center font-bold mb-4 shadow-md shadow-indigo-500/25">
                <Shield className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-black text-slate-900 mb-2">Transparent Per-KM Tariff</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Zero arbitrary middleman surcharges. Fixed per-KM rates stored in database for Home Shifting, Commercial Relocation, and Heavy Cargo.
              </p>
            </div>

            <div className="p-7 rounded-3xl bg-gradient-to-br from-emerald-50/80 via-white to-teal-50/40 border border-emerald-200/80 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center font-bold mb-4 shadow-md shadow-emerald-500/25">
                <Truck className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-black text-slate-900 mb-2">Dedicated Tracking ID</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Every confirmed booking receives an official Tracking ID (e.g. <span className="font-mono font-bold text-emerald-700">TRP-ERD-2026-XXXXXX</span>) for live status updates from loading to delivery.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Guest Booking Modal */}
      <BookingModal
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        onSuccess={handleBookingSuccess}
        bookingDetails={activeBookingPayload}
      />

      {/* Booking Success Modal */}
      <BookingSuccessModal
        isOpen={isSuccessModalOpen}
        onClose={() => setIsSuccessModalOpen(false)}
        bookingData={successBookingData}
      />

      {/* Right Side Circular Floating Contact Actions */}
      <FloatingContactButtons />

      <Footer />
    </main>
  );
}
