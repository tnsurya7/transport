'use client';

import React, { useState } from 'react';
import { useI18n } from '@/lib/i18n';
import { X, User, Phone, Mail, FileText, CheckCircle, AlertCircle, RefreshCw } from 'lucide-react';
import { isValidPhone, isValidEmail, sanitizePhoneInput } from '@/lib/validators';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (bookingData: any) => void;
  bookingDetails: {
    serviceId: string;
    pricingRuleId: string;
    loadCapacity?: number | string;
    pickup: any;
    destination: any;
    quote: any;
  } | null;
}

export default function BookingModal({
  isOpen,
  onClose,
  onSuccess,
  bookingDetails,
}: BookingModalProps) {
  const { t, language } = useI18n();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [notes, setNotes] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen || !bookingDetails) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!name.trim() || name.trim().length < 2) {
      setErrorMsg('Please enter your full name (minimum 2 characters).');
      return;
    }

    const cleanPhone = sanitizePhoneInput(phone);
    if (!isValidPhone(cleanPhone)) {
      setErrorMsg('Please enter a valid 10-digit Indian mobile number starting with 6, 7, 8, or 9 (e.g. 9876543210).');
      return;
    }

    if (!isValidEmail(email)) {
      setErrorMsg('Please enter a valid email address (e.g. name@example.com).');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: name.trim(),
          customerPhone: phone.trim(),
          customerEmail: email.trim(),
          customerLanguage: language,
          serviceId: bookingDetails.serviceId,
          pricingRuleId: bookingDetails.pricingRuleId,
          loadCapacity: bookingDetails.loadCapacity,
          pickup: bookingDetails.pickup,
          destination: bookingDetails.destination,
          customerNotes: notes.trim() || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to submit booking');
      }

      onSuccess(data.data);
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || 'Booking submission failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl sm:rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-100 relative max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="mb-6">
          <div className="text-xs font-bold uppercase tracking-wider text-brand-600 mb-1">
            Guest Booking &bull; Instant Dispatch
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-slate-900">
            {t('bookingModal.title')}
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            {t('bookingModal.subtitle')}
          </p>
        </div>

        {/* Route & Estimate Summary Pill */}
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 mb-6 text-xs sm:text-sm">
          <div className="flex justify-between items-center font-semibold text-slate-800 mb-1">
            <span>{bookingDetails.pickup.city} → {bookingDetails.destination.city}</span>
            <span className="text-brand-600 font-bold">₹{bookingDetails.quote.estimatedAmount.toLocaleString('en-IN')}</span>
          </div>
          <div className="text-slate-500 text-xs flex justify-between">
            <span>{bookingDetails.quote.service.name} ({bookingDetails.quote.pricingRule.name})</span>
            <span>{bookingDetails.quote.distanceKm} KM</span>
          </div>
        </div>

        {errorMsg && (
          <div className="mb-5 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs sm:text-sm flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center space-x-1">
              <User className="w-3.5 h-3.5 text-slate-400" />
              <span>{t('bookingModal.fullName')} *</span>
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t('bookingModal.fullNamePlaceholder')}
              className="w-full px-4 py-3 bg-white rounded-xl border border-slate-200 focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 text-slate-900 text-sm outline-none transition-all shadow-sm"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center space-x-1">
                <Phone className="w-3.5 h-3.5 text-slate-400" />
                <span>{t('bookingModal.phone')} *</span>
              </label>
              <span className="text-[11px] font-mono text-slate-500 font-bold">
                {phone.length}/10 digits
              </span>
            </div>
            <input
              type="tel"
              required
              maxLength={10}
              value={phone}
              onChange={(e) => setPhone(sanitizePhoneInput(e.target.value))}
              placeholder="10-digit mobile (e.g. 9876543210)"
              className="w-full px-4 py-3 bg-white rounded-xl border border-slate-200 focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 text-slate-900 text-sm outline-none transition-all shadow-sm font-mono font-bold tracking-wider"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center space-x-1">
              <Mail className="w-3.5 h-3.5 text-slate-400" />
              <span>{t('bookingModal.email')} *</span>
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t('bookingModal.emailPlaceholder')}
              className="w-full px-4 py-3 bg-white rounded-xl border border-slate-200 focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 text-slate-900 text-sm outline-none transition-all shadow-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center space-x-1">
              <FileText className="w-3.5 h-3.5 text-slate-400" />
              <span>{t('bookingModal.notes')}</span>
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder={t('bookingModal.notesPlaceholder')}
              className="w-full px-4 py-2.5 bg-white rounded-xl border border-slate-200 focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 text-slate-900 text-sm outline-none transition-all shadow-sm"
            />
          </div>

          <p className="text-[11px] text-slate-500 flex items-center space-x-1 pt-1">
            <CheckCircle className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
            <span>{t('bookingModal.secureNote')}</span>
          </p>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-4 px-6 rounded-xl bg-brand-600 hover:bg-brand-700 active:scale-[0.99] text-white text-base font-bold shadow-lg shadow-brand-600/25 flex items-center justify-center space-x-2 transition-all disabled:opacity-75 tap-target mt-4"
          >
            {isSubmitting ? (
              <>
                <RefreshCw className="w-5 h-5 animate-spin" />
                <span>{t('bookingModal.submitting')}</span>
              </>
            ) : (
              <span>{t('bookingModal.submit')}</span>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
