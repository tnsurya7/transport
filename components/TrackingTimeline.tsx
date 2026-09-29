'use client';

import React from 'react';
import { useI18n } from '@/lib/i18n';
import { Check, Clock, Truck, Package, ShieldCheck, MapPin, CheckCircle2 } from 'lucide-react';

interface TrackingTimelineProps {
  currentStatus: string;
  events?: {
    id: string;
    status: string;
    message: string;
    location?: string | null;
    createdAt: string | Date;
  }[];
}

const STEP_ORDER = [
  { key: 'BOOKING_RECEIVED', labelKey: 'tracking.statuses.BOOKING_RECEIVED', icon: Clock },
  { key: 'CONFIRMED', labelKey: 'tracking.statuses.CONFIRMED', icon: ShieldCheck },
  { key: 'VEHICLE_ASSIGNED', labelKey: 'tracking.statuses.VEHICLE_ASSIGNED', icon: Truck },
  { key: 'PICKUP_COMPLETED', labelKey: 'tracking.statuses.PICKUP_COMPLETED', icon: Package },
  { key: 'IN_TRANSIT', labelKey: 'tracking.statuses.IN_TRANSIT', icon: Truck },
  { key: 'OUT_FOR_DELIVERY', labelKey: 'tracking.statuses.OUT_FOR_DELIVERY', icon: MapPin },
  { key: 'DELIVERED', labelKey: 'tracking.statuses.DELIVERED', icon: CheckCircle2 },
];

export default function TrackingTimeline({ currentStatus, events = [] }: TrackingTimelineProps) {
  const { t } = useI18n();

  const currentIndex = STEP_ORDER.findIndex((s) => s.key === currentStatus);
  const isCancelled = currentStatus === 'CANCELLED';

  if (isCancelled) {
    return (
      <div className="p-6 rounded-2xl bg-red-50 border border-red-200 text-center">
        <div className="text-red-700 font-bold text-lg mb-1">Shipment Cancelled</div>
        <p className="text-red-600 text-xs">This booking was cancelled. Please contact our support team for details.</p>
      </div>
    );
  }

  return (
    <div className="py-4">
      {/* Horizontal / Stepper View */}
      <div className="relative">
        {/* Step Items */}
        <div className="space-y-6 sm:space-y-0 sm:grid sm:grid-cols-7 gap-2">
          {STEP_ORDER.map((step, idx) => {
            const isCompleted = currentIndex >= idx;
            const isCurrent = currentIndex === idx;
            const StepIcon = step.icon;

            return (
              <div key={step.key} className="flex sm:flex-col items-center text-left sm:text-center relative">
                {/* Status Dot / Icon */}
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs transition-all z-10 flex-shrink-0 ${
                    isCompleted
                      ? 'bg-brand-600 text-white shadow-md shadow-brand-500/20'
                      : 'bg-slate-100 text-slate-400 border border-slate-200'
                  } ${isCurrent ? 'ring-4 ring-brand-500/30 scale-110' : ''}`}
                >
                  {isCompleted ? <Check className="w-5 h-5 stroke-[2.5]" /> : <StepIcon className="w-4 h-4" />}
                </div>

                {/* Status Label */}
                <div className="ml-3.5 sm:ml-0 sm:mt-2.5">
                  <div
                    className={`text-xs font-bold leading-tight ${
                      isCompleted ? 'text-slate-900' : 'text-slate-400'
                    }`}
                  >
                    {t(step.labelKey)}
                  </div>
                  {isCurrent && (
                    <span className="inline-block px-2 py-0.5 mt-1 rounded-full bg-brand-100 text-brand-700 text-[10px] font-extrabold uppercase">
                      Current
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Detailed Event Log Timeline if available */}
      {events && events.length > 0 && (
        <div className="mt-10 pt-6 border-t border-slate-100">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">
            {t('tracking.timeline')}
          </h4>
          <div className="space-y-4">
            {events.map((evt, i) => (
              <div key={evt.id || i} className="flex items-start space-x-3 text-xs sm:text-sm">
                <div className="w-2 h-2 rounded-full bg-brand-500 mt-1.5 flex-shrink-0" />
                <div className="flex-1">
                  <div className="font-semibold text-slate-800">{evt.message}</div>
                  <div className="text-[11px] text-slate-400 mt-0.5 flex items-center space-x-2">
                    {evt.location && <span>📍 {evt.location}</span>}
                    <span>&bull;</span>
                    <span>{new Date(evt.createdAt).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
