'use client';

import React from 'react';
import Navbar from '@/components/Navbar';
import ServicesShowcase from '@/components/ServicesShowcase';
import FloatingContactButtons from '@/components/FloatingContactButtons';
import Footer from '@/components/Footer';
import { useI18n } from '@/lib/i18n';
import Link from 'next/link';
import { ArrowRight, CheckCircle2 } from 'lucide-react';

export default function ServicesPage() {
  const { t } = useI18n();

  return (
    <main className="min-h-screen flex flex-col bg-slate-50/50">
      <Navbar />

      <section className="pt-10 pb-6 bg-slate-900 text-white text-center px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight mb-3">
            {t('services.title')}
          </h1>
          <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto">
            {t('services.subtitle')}
          </p>
        </div>
      </section>

      <ServicesShowcase />

      {/* Corridor & Booking Banner */}
      <section className="py-12 bg-white border-t border-slate-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center">
          <div className="glass-card rounded-3xl p-8 sm:p-12 border border-slate-200/80 bg-gradient-to-br from-brand-50/40 via-white to-slate-50">
            <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-4">
              Need a Custom Commercial Transport Quote?
            </h3>
            <p className="text-slate-600 text-sm sm:text-base max-w-xl mx-auto mb-6">
              We operate daily routes across all 38 districts of Tamil Nadu, 31 districts of Karnataka, and 14 districts of Kerala.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/#calculator"
                className="w-full sm:w-auto py-3.5 px-8 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm shadow-md flex items-center justify-center space-x-2"
              >
                <span>Calculate Cost Now</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <a
                href="tel:+919876543210"
                className="w-full sm:w-auto py-3.5 px-8 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm"
              >
                Call Operations: +91 98765 43210
              </a>
            </div>
          </div>
        </div>
      </section>

      <FloatingContactButtons />
      <Footer />
    </main>
  );
}
