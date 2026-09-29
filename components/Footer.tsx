'use client';

import React from 'react';
import Link from 'next/link';
import { useI18n } from '@/lib/i18n';
import { Truck, Phone, Mail, MapPin, ShieldCheck, Heart, Sparkles } from 'lucide-react';

export default function Footer() {
  const { t } = useI18n();

  return (
    <footer className="bg-slate-950 text-slate-300 border-t border-slate-800 pt-16 pb-28 md:pb-14 relative overflow-hidden">
      {/* Decorative gradient blur background */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-rose-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Company Info */}
          <div className="md:col-span-1">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 via-rose-500 to-indigo-600 text-white flex items-center justify-center font-bold shadow-lg shadow-rose-500/25">
                <Truck className="w-5 h-5 stroke-[2.2]" />
              </div>
              <span className="text-xl font-black text-white tracking-tight">
                SABARISAN <span className="bg-gradient-to-r from-rose-400 to-amber-300 bg-clip-text text-transparent">TRANSPORT</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed mb-4">
              Premier goods logistics and house shifting hub in Erode, connecting Tamil Nadu, Karnataka & Kerala with verified drivers and transparent per-KM tariffs.
            </p>
            <div className="inline-flex items-center space-x-1 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-[11px] text-amber-400 font-bold">
              <Sparkles className="w-3 h-3 text-amber-400" />
              <span>Serving TN &bull; KA &bull; KL Corridors</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-black uppercase tracking-wider text-white mb-4">
              Quick Navigation
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link href="/" className="hover:text-amber-400 transition-colors">
                  {t('nav.home')}
                </Link>
              </li>
              <li>
                <Link href="/services" className="hover:text-amber-400 transition-colors">
                  {t('nav.services')}
                </Link>
              </li>
              <li>
                <Link href="/track" className="hover:text-amber-400 transition-colors">
                  {t('nav.track')}
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-amber-400 transition-colors">
                  {t('nav.contact')}
                </Link>
              </li>
              <li>
                <Link href="/driver/dashboard" className="text-slate-400 hover:text-emerald-400 flex items-center space-x-1 font-semibold transition-colors">
                  <Truck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Driver Delivery Portal</span>
                </Link>
              </li>
              <li>
                <Link href="/admin/dashboard" className="text-slate-400 hover:text-purple-400 flex items-center space-x-1 font-semibold transition-colors">
                  <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />
                  <span>Admin Control Portal</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Service Areas */}
          <div>
            <h4 className="text-xs font-black uppercase tracking-wider text-white mb-4">
              Primary Corridors from Erode
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>Erode ⇄ Coimbatore / Tirupur / Salem</li>
              <li>Erode ⇄ Chennai / Trichy / Madurai</li>
              <li>Erode ⇄ Bengaluru / Mysuru / Hosur</li>
              <li>Erode ⇄ Kochi / Palakkad / Kozhikode</li>
              <li>Erode ⇄ Thiruvananthapuram / Mangaluru</li>
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h4 className="text-xs font-black uppercase tracking-wider text-white mb-4">
              Operations Head Office
            </h4>
            <ul className="space-y-3 text-xs text-slate-400">
              <li className="flex items-start space-x-2.5">
                <MapPin className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                <span>Near Bus Stand, Bhavani Main Road, Erode, Tamil Nadu 638004</span>
              </li>
              <li className="flex items-center space-x-2.5">
                <Phone className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                <a href="tel:+919876543210" className="hover:text-white font-bold text-slate-200">
                  +91 98765 43210
                </a>
              </li>
              <li className="flex items-center space-x-2.5">
                <Mail className="w-4 h-4 text-rose-400 flex-shrink-0" />
                <a href="mailto:support@sarisantransport.in" className="hover:text-white font-medium">
                  support@sarisantransport.in
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-slate-850 text-center text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div>
            &copy; {new Date().getFullYear()} Sabarisan Transport. All rights reserved.
          </div>
          <div className="flex items-center space-x-1.5 text-slate-400">
            <span>Built with precision in Erode, Tamil Nadu</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
