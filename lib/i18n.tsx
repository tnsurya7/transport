'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import en from '@/locales/en.json';
import ta from '@/locales/ta.json';
import kn from '@/locales/kn.json';
import hi from '@/locales/hi.json';
import ml from '@/locales/ml.json';

export type LanguageCode = 'en' | 'ta' | 'kn' | 'hi' | 'ml';

export interface LanguageOption {
  code: LanguageCode;
  label: string;
  nativeLabel: string;
}

export const SUPPORTED_LANGUAGES: LanguageOption[] = [
  { code: 'en', label: 'English', nativeLabel: 'English' },
  { code: 'ta', label: 'Tamil', nativeLabel: 'தமிழ்' },
  { code: 'kn', label: 'Kannada', nativeLabel: 'ಕನ್ನಡ' },
  { code: 'hi', label: 'Hindi', nativeLabel: 'हिन्दी' },
  { code: 'ml', label: 'Malayalam', nativeLabel: 'മലയാളം' },
];

const dictionaries: Record<LanguageCode, any> = {
  en,
  ta,
  kn,
  hi,
  ml,
};

interface I18nContextType {
  language: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
  t: (path: string, fallback?: string) => string;
}

const I18nContext = createContext<I18nContextType>({
  language: 'en',
  setLanguage: () => {},
  t: (path: string, fallback?: string) => fallback || path,
});

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<LanguageCode>('en');

  useEffect(() => {
    const saved = localStorage.getItem('app_lang') as LanguageCode;
    if (saved && dictionaries[saved]) {
      setLanguageState(saved);
    }
  }, []);

  const setLanguage = (lang: LanguageCode) => {
    setLanguageState(lang);
    if (typeof window !== 'undefined') {
      localStorage.setItem('app_lang', lang);
      document.cookie = `app_lang=${lang}; path=/; max-age=31536000; SameSite=Lax`;
    }
  };

  const t = (path: string, fallback?: string): string => {
    const keys = path.split('.');
    let current = dictionaries[language] || dictionaries.en;

    for (const key of keys) {
      if (current && typeof current === 'object' && key in current) {
        current = current[key];
      } else {
        // Fallback to English dictionary
        let enCurrent = dictionaries.en;
        for (const enKey of keys) {
          if (enCurrent && typeof enCurrent === 'object' && enKey in enCurrent) {
            enCurrent = enCurrent[enKey];
          } else {
            return fallback || path;
          }
        }
        return typeof enCurrent === 'string' ? enCurrent : fallback || path;
      }
    }

    return typeof current === 'string' ? current : fallback || path;
  };

  return (
    <I18nContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  return useContext(I18nContext);
}
