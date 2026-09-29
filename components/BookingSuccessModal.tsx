'use client';

import React from 'react';
import Link from 'next/link';
import { useI18n } from '@/lib/i18n';
import { CheckCircle2, MessageSquare, Search, Copy, Check } from 'lucide-react';

interface BookingSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookingData: {
    bookingNumber: string;
    customerName: string;
    pickupCity: string;
    destinationCity: string;
    estimatedAmount: number;
  } | null;
}

export default function BookingSuccessModal({
  isOpen,
  onClose,
  bookingData,
}: BookingSuccessModalProps) {
  const { t } = useI18n();
  const [copied, setCopied] = React.useState(false);

  if (!isOpen || !bookingData) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(bookingData.bookingNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const whatsappNumber = '919876543210';
  const whatsappMsg = `Hello Erode Transport, I submitted booking ${bookingData.bookingNumber} for ${bookingData.pickupCity} to ${bookingData.destinationCity}.`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/65 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-100 text-center">
        {/* Animated Check Icon */}
        <div className="w-16 h-16 rounded-full bg-brand-100 text-brand-600 flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 className="w-10 h-10 stroke-[2.5]" />
        </div>

        <h3 className="text-2xl font-bold text-slate-900">
          {t('success.title')}
        </h3>

        {/* Booking Number Display Badge */}
        <div className="my-5 p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
          <div className="text-left">
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              {t('success.bookingNo')}
            </div>
            <div className="text-xl font-mono font-extrabold text-slate-900">
              {bookingData.bookingNumber}
            </div>
          </div>

          <button
            type="button"
            onClick={handleCopy}
            className="p-2.5 rounded-xl bg-white hover:bg-slate-100 text-slate-600 border border-slate-200 text-xs font-semibold flex items-center space-x-1"
            title="Copy Booking Number"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-600" />
                <span className="text-emerald-600">Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>

        <p className="text-sm text-slate-600 leading-relaxed mb-3">
          {t('success.message')}
        </p>

        <p className="text-xs text-slate-400 mb-6 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
          {t('success.nextStep')}
        </p>

        {/* Action Buttons */}
        <div className="space-y-2.5">
          <a
            href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMsg)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-3.5 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-sm shadow-md flex items-center justify-center space-x-2 tap-target"
          >
            <MessageSquare className="w-4 h-4" />
            <span>{t('success.whatsappBtn')}</span>
          </a>

          <Link
            href={`/track?id=${encodeURIComponent(bookingData.bookingNumber)}`}
            onClick={onClose}
            className="w-full py-3.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm flex items-center justify-center space-x-2 tap-target"
          >
            <Search className="w-4 h-4" />
            <span>{t('success.trackBtn')}</span>
          </Link>

          <button
            type="button"
            onClick={onClose}
            className="w-full py-2.5 text-xs text-slate-500 hover:text-slate-800 font-medium"
          >
            {t('success.close')}
          </button>
        </div>
      </div>
    </div>
  );
}
