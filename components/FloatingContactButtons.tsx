'use client';

import React, { useState } from 'react';
import { Phone, MessageSquare } from 'lucide-react';

export default function FloatingContactButtons() {
  const phone = '+919876543210';
  const whatsapp = '919876543210';
  const whatsappMsg = 'Hello Sabarisan Transport, I would like to inquire about transport service.';

  const [hoveredBtn, setHoveredBtn] = useState<string | null>(null);

  return (
    <aside
      aria-label="Quick contact actions"
      className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 flex flex-col items-end space-y-2.5 sm:space-y-3.5 pointer-events-auto"
    >
      {/* WhatsApp Circular FAB */}
      <div className="relative flex items-center group">
        {/* Tooltip on hover */}
        <span
          className={`absolute right-14 sm:right-16 px-3 py-1.5 rounded-xl bg-slate-900/90 backdrop-blur-md text-white text-xs font-bold shadow-xl border border-slate-700 whitespace-nowrap transition-all duration-200 pointer-events-none ${
            hoveredBtn === 'whatsapp' ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-2'
          }`}
        >
          Chat on WhatsApp
        </span>

        <a
          href={`https://wa.me/${whatsapp}?text=${encodeURIComponent(whatsappMsg)}`}
          target="_blank"
          rel="noopener noreferrer"
          onMouseEnter={() => setHoveredBtn('whatsapp')}
          onMouseLeave={() => setHoveredBtn(null)}
          className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-to-tr from-emerald-600 via-green-500 to-teal-400 text-white flex items-center justify-center shadow-lg shadow-emerald-500/40 hover:shadow-emerald-500/60 hover:scale-110 active:scale-95 transition-all duration-200 border-2 border-white/80 relative"
          aria-label="Chat on WhatsApp with Sabarisan Transport"
        >
          <span className="animate-ping absolute inset-0 rounded-full bg-emerald-400 opacity-25" />
          <MessageSquare className="w-5 h-5 sm:w-7 sm:h-7 stroke-[2.2] relative z-10" />
        </a>
      </div>

      {/* Call Circular FAB */}
      <div className="relative flex items-center group">
        {/* Tooltip on hover */}
        <span
          className={`absolute right-14 sm:right-16 px-3 py-1.5 rounded-xl bg-slate-900/90 backdrop-blur-md text-white text-xs font-bold shadow-xl border border-slate-700 whitespace-nowrap transition-all duration-200 pointer-events-none ${
            hoveredBtn === 'call' ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-2'
          }`}
        >
          Call Sabarisan Transport
        </span>

        <a
          href={`tel:${phone}`}
          onMouseEnter={() => setHoveredBtn('call')}
          onMouseLeave={() => setHoveredBtn(null)}
          className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-to-tr from-indigo-600 via-blue-600 to-cyan-400 text-white flex items-center justify-center shadow-lg shadow-blue-500/40 hover:shadow-blue-500/60 hover:scale-110 active:scale-95 transition-all duration-200 border-2 border-white/80"
          aria-label="Call Sabarisan Transport Operations"
        >
          <Phone className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2.2]" />
        </a>
      </div>
    </aside>
  );
}
