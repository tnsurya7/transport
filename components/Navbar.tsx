'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useI18n, SUPPORTED_LANGUAGES } from '@/lib/i18n';
import {
  Truck,
  Phone,
  MessageSquare,
  Globe,
  Menu,
  X,
  ShieldCheck,
  Home,
  Layers,
  Search,
  Mail,
  ChevronDown,
} from 'lucide-react';

export default function Navbar() {
  const { language, setLanguage, t } = useI18n();
  const pathname = usePathname();
  const [langOpen, setLangOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const phone = process.env.NEXT_PUBLIC_OWNER_PHONE || '+919876543210';
  const whatsapp = process.env.NEXT_PUBLIC_OWNER_WHATSAPP || '919876543210';

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: t('nav.home'), href: '/#calculator', icon: Home },
    { label: t('nav.services'), href: '/services', icon: Layers },
    { label: t('nav.track'), href: '/track', icon: Search },
    { label: t('nav.contact'), href: '/contact', icon: Mail },
  ];

  return (
    <>
      {/* Floating Apple Dock Container */}
      <header className="fixed top-2 sm:top-5 left-0 right-0 z-50 flex justify-center px-3 sm:px-6 pointer-events-none transition-all duration-300">
        <div
          className={`w-full max-w-6xl pointer-events-auto transition-all duration-300 rounded-[1.5rem] sm:rounded-full border ${
            scrolled
              ? 'bg-white/90 shadow-[0_20px_50px_rgba(0,0,0,0.12),0_1px_3px_rgba(0,0,0,0.06)] border-white/80 ring-1 ring-black/[0.06] backdrop-blur-2xl py-2 px-3.5 sm:px-6'
              : 'bg-white/85 shadow-[0_12px_36px_rgba(0,0,0,0.08),0_1px_2px_rgba(0,0,0,0.04)] border-white/70 ring-1 ring-black/[0.04] backdrop-blur-xl py-2 sm:py-2.5 px-4 sm:px-7'
          }`}
          style={{
            backdropFilter: 'blur(28px) saturate(190%)',
            WebkitBackdropFilter: 'blur(28px) saturate(190%)',
          }}
        >
          <div className="flex items-center justify-between gap-2 lg:gap-4">
            {/* 1. Left: Brand Logo (SABARISAN TRANSPORT) */}
            <Link href="/" className="flex items-center space-x-2.5 sm:space-x-3 group shrink-0">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-gradient-to-tr from-amber-500 via-rose-500 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-rose-500/25 group-hover:scale-110 group-hover:rotate-3 transition-all duration-200">
                <Truck className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.3]" />
              </div>
              <div className="flex flex-col justify-center select-none">
                <span className="font-black text-xs sm:text-sm md:text-base tracking-wider text-slate-900 leading-none group-hover:text-rose-600 transition-colors">
                  SABARISAN
                </span>
                <span className="font-extrabold text-[8px] sm:text-[10px] tracking-[0.2em] bg-gradient-to-r from-rose-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent uppercase leading-tight mt-0.5">
                  TRANSPORT
                </span>
              </div>
            </Link>

            {/* 2. Center: Apple Dock Navigation Links (Strictly Single Line, Whitespace-Nowrap) */}
            <nav className="hidden md:flex items-center space-x-1 lg:space-x-1.5 bg-slate-100/80 p-1.5 rounded-full border border-slate-200/60 shadow-inner">
              {navLinks.map((item) => {
                const isActive = pathname === item.href || (item.href === '/#calculator' && pathname === '/');
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`whitespace-nowrap select-none px-3.5 lg:px-4 py-1.5 rounded-full text-xs lg:text-[13px] font-bold transition-all duration-200 flex items-center space-x-1.5 ${
                      isActive
                        ? 'bg-white text-slate-950 shadow-sm shadow-slate-900/10 font-extrabold scale-[1.02]'
                        : 'text-slate-600 hover:text-slate-950 hover:bg-white/70 hover:scale-[1.02]'
                    }`}
                  >
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>

            {/* 3. Right: Utility & Action Pills */}
            <div className="flex items-center space-x-1.5 sm:space-x-2 shrink-0">
              {/* Language Selector */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setLangOpen(!langOpen)}
                  className="flex items-center space-x-1 px-2.5 sm:px-3 py-1.5 rounded-full bg-slate-100/90 hover:bg-white text-slate-800 text-[11px] sm:text-xs font-bold border border-slate-200/80 shadow-sm transition-all hover:scale-105 whitespace-nowrap"
                  aria-expanded={langOpen}
                  aria-label="Change Language"
                >
                  <Globe className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                  <span className="hidden xs:inline">{SUPPORTED_LANGUAGES.find((l) => l.code === language)?.nativeLabel}</span>
                  <ChevronDown className={`w-3 h-3 text-slate-500 transition-transform duration-200 ${langOpen ? 'rotate-180' : ''}`} />
                </button>

                {langOpen && (
                  <div
                    className="absolute right-0 mt-3 w-44 rounded-2xl bg-white/95 backdrop-blur-2xl border border-white/80 shadow-2xl py-2 z-50 animate-in fade-in zoom-in-95 duration-150 ring-1 ring-black/5"
                    onMouseLeave={() => setLangOpen(false)}
                  >
                    <div className="px-3.5 py-1 text-[10px] font-black text-slate-400 uppercase tracking-wider">
                      Select Language
                    </div>
                    {SUPPORTED_LANGUAGES.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => {
                          setLanguage(lang.code);
                          setLangOpen(false);
                        }}
                        className={`w-full text-left px-3.5 py-2 text-xs flex items-center justify-between hover:bg-slate-50 transition-colors ${
                          language === lang.code ? 'font-black text-rose-600 bg-rose-50/60' : 'text-slate-700 font-semibold'
                        }`}
                      >
                        <span>{lang.nativeLabel}</span>
                        <span className="text-[10px] text-slate-400 font-normal">{lang.label}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Call Pill */}
              <a
                href={`tel:${phone}`}
                className="hidden xl:flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-indigo-50 to-blue-50 hover:from-indigo-100 hover:to-blue-100 text-indigo-950 border border-indigo-200/80 text-xs font-bold transition-all hover:scale-105 shadow-sm whitespace-nowrap"
              >
                <Phone className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                <span>{phone}</span>
              </a>

              {/* WhatsApp Pill */}
              <a
                href={`https://wa.me/${whatsapp}?text=Hello%20Sabarisan%20Transport,%20I%20need%20transport%20service`}
                target="_blank"
                rel="noopener noreferrer"
                className="hidden sm:flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white text-xs font-bold shadow-md shadow-emerald-500/25 transition-all hover:scale-105 whitespace-nowrap"
              >
                <MessageSquare className="w-3.5 h-3.5 shrink-0" />
                <span>WhatsApp</span>
              </a>

              {/* Driver Portal Link */}
              <Link
                href="/driver/dashboard"
                className="hidden lg:flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-200/80 text-xs font-bold transition-all hover:scale-105 whitespace-nowrap"
                title="Driver Delivery Portal"
              >
                <Truck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Driver</span>
              </Link>

              {/* Admin Portal Icon Button */}
              <Link
                href="/admin/dashboard"
                className="p-2 rounded-full text-slate-600 hover:text-purple-600 hover:bg-purple-50 transition-all hover:scale-110 shrink-0"
                title="Admin Operations Hub"
              >
                <ShieldCheck className="w-4 h-4 text-purple-600" />
              </Link>

              {/* Mobile Menu Hamburger */}
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-1.5 rounded-xl text-slate-700 hover:bg-slate-100 transition-colors"
                aria-label="Toggle Navigation Menu"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Mobile Liquid Drawer Dropdown */}
          {mobileMenuOpen && (
            <div className="md:hidden mt-2.5 pt-2.5 border-t border-slate-200/60 space-y-2 animate-in slide-in-from-top-2 duration-200">
              <div className="grid grid-cols-2 gap-1.5">
                {navLinks.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="px-3 py-2 rounded-xl text-xs font-bold text-slate-800 bg-slate-50 hover:bg-slate-100 flex items-center space-x-2"
                  >
                    <item.icon className="w-3.5 h-3.5 text-slate-500" />
                    <span>{item.label}</span>
                  </Link>
                ))}
              </div>

              {/* Portal Links on Mobile */}
              <div className="grid grid-cols-2 gap-1.5 pt-1">
                <Link
                  href="/driver/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 rounded-xl text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 flex items-center space-x-1.5"
                >
                  <Truck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Driver Portal</span>
                </Link>

                <Link
                  href="/admin/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 rounded-xl text-xs font-bold text-purple-800 bg-purple-50 border border-purple-200 flex items-center space-x-1.5"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-purple-600" />
                  <span>Admin Hub</span>
                </Link>
              </div>

              <div className="flex space-x-2 pt-1">
                <a
                  href={`tel:${phone}`}
                  className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-bold text-xs flex items-center justify-center space-x-1.5 shadow-sm"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Call Us</span>
                </a>
                <a
                  href={`https://wa.me/${whatsapp}?text=Hello%20Sabarisan%20Transport`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold text-xs flex items-center justify-center space-x-1.5 shadow-sm"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>WhatsApp</span>
                </a>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Spacer so content does not hide behind floating dock */}
      <div className="h-16 sm:h-24" />
    </>
  );
}
