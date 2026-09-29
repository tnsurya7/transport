'use client';

import React from 'react';
import Navbar from '@/components/Navbar';
import FloatingContactButtons from '@/components/FloatingContactButtons';
import Footer from '@/components/Footer';
import { useI18n } from '@/lib/i18n';
import { Phone, MessageSquare, Mail, MapPin, Clock, Sparkles } from 'lucide-react';

export default function ContactPage() {
  const { t } = useI18n();

  const phone = '+919876543210';
  const whatsapp = '919876543210';
  const email = 'support@sarisantransport.in';

  return (
    <main className="min-h-screen flex flex-col bg-slate-50/50">
      <Navbar />

      <section className="pt-6 sm:pt-12 pb-16 sm:pb-20 max-w-5xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-12">
          <span className="inline-flex items-center space-x-1.5 text-xs font-black uppercase tracking-widest text-amber-700 bg-amber-50 px-3.5 py-1 rounded-full border border-amber-200 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>24/7 Operations Hub</span>
          </span>
          <h1 className="text-2xl sm:text-5xl font-black text-slate-900 mt-3 sm:mt-4 tracking-tight">
            Contact <span className="bg-gradient-to-r from-rose-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">Sabarisan Transport</span>
          </h1>
          <p className="text-xs sm:text-base text-slate-600 mt-2">
            {t('contact.subtitle')}
          </p>
        </div>

        {/* Contact Cards Grid with vibrant gradients */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-8 sm:mb-12">
          {/* Phone Card */}
          <div className="rounded-2xl sm:rounded-3xl p-5 sm:p-8 border-2 border-indigo-200/80 bg-gradient-to-br from-indigo-50/90 via-white to-blue-50/50 flex flex-col justify-between shadow-lg hover:shadow-xl transition-all">
            <div>
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-tr from-indigo-600 to-blue-600 text-white flex items-center justify-center font-bold mb-4 sm:mb-5 shadow-md shadow-indigo-500/25">
                <Phone className="w-6 h-6 sm:w-7 sm:h-7" />
              </div>
              <h3 className="text-lg sm:text-xl font-black text-slate-900 mb-1">{t('contact.phone')}</h3>
              <p className="text-xs sm:text-sm text-slate-600 mb-5 sm:mb-6 leading-relaxed">
                Speak directly with our transport dispatch manager in Erode for immediate lorry bookings and route guidance.
              </p>
            </div>
            <a
              href={`tel:${phone}`}
              className="py-3.5 sm:py-4 px-4 sm:px-6 rounded-xl sm:rounded-2xl bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white font-extrabold text-xs sm:text-sm text-center shadow-md shadow-indigo-500/25 transition-all tap-target active:scale-95"
            >
              Call {phone}
            </a>
          </div>

          {/* WhatsApp Card */}
          <div className="rounded-2xl sm:rounded-3xl p-5 sm:p-8 border-2 border-emerald-200/80 bg-gradient-to-br from-emerald-50/90 via-white to-teal-50/50 flex flex-col justify-between shadow-lg hover:shadow-xl transition-all">
            <div>
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-500 text-white flex items-center justify-center font-bold mb-4 sm:mb-5 shadow-md shadow-emerald-500/25">
                <MessageSquare className="w-6 h-6 sm:w-7 sm:h-7" />
              </div>
              <h3 className="text-lg sm:text-xl font-black text-slate-900 mb-1">{t('contact.whatsapp')}</h3>
              <p className="text-xs sm:text-sm text-slate-600 mb-5 sm:mb-6 leading-relaxed">
                Send consignment photos, request custom commercial freight estimates, and track consignments on WhatsApp.
              </p>
            </div>
            <a
              href={`https://wa.me/${whatsapp}?text=Hello%20Sabarisan%20Transport,%20I%20need%20transport%20assistance`}
              target="_blank"
              rel="noopener noreferrer"
              className="py-3.5 sm:py-4 px-4 sm:px-6 rounded-xl sm:rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-extrabold text-xs sm:text-sm text-center shadow-md shadow-emerald-500/25 transition-all tap-target active:scale-95"
            >
              Chat on WhatsApp
            </a>
          </div>
        </div>

        {/* Office Details & Working Hours */}
        <div className="glass-card rounded-3xl p-8 border border-slate-200/80 shadow-md bg-white">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <div className="flex items-center space-x-2.5 text-slate-900 font-extrabold text-base mb-2">
                <MapPin className="w-5 h-5 text-rose-600" />
                <span>{t('contact.addressTitle')}</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed pl-7">
                {t('contact.address')}
              </p>
            </div>

            <div>
              <div className="flex items-center space-x-2.5 text-slate-900 font-extrabold text-base mb-2">
                <Clock className="w-5 h-5 text-indigo-600" />
                <span>Operating Schedule</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed pl-7">
                Lorry Dispatch Yard: Open 24/7<br />
                Helpline Support: 6:00 AM – 11:00 PM (Daily)
              </p>
            </div>
          </div>
        </div>
      </section>

      <FloatingContactButtons />
      <Footer />
    </main>
  );
}
