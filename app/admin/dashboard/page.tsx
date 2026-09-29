'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  CalendarCheck,
  Clock,
  CheckCircle2,
  Truck,
  TrendingUp,
  ArrowRight,
  RefreshCw,
  Phone,
  MapPin,
  Sparkles,
} from 'lucide-react';

export default function AdminDashboardPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchDashboard = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/dashboard');
      const json = await res.json();
      if (json.success) {
        setData(json.data);
      }
    } catch (err) {
      console.error('Failed to fetch dashboard metrics:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const stats = data?.stats || {
    total: 0,
    received: 0,
    confirmed: 0,
    inTransit: 0,
    delivered: 0,
  };

  return (
    <div className="space-y-6 sm:space-y-8 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 sm:pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center space-x-2.5 sm:space-x-3">
            <h1 className="text-xl sm:text-3xl font-black text-white tracking-tight">
              Operations Dashboard
            </h1>
            <span className="px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/50 text-[10px] sm:text-[11px] font-black uppercase tracking-wider flex items-center space-x-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-ping" />
              <span>LIVE</span>
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-300 mt-0.5 font-medium">
            Real-time transport bookings & fleet metrics &bull; TN, KA & KL
          </p>
        </div>

        <button
          onClick={fetchDashboard}
          disabled={loading}
          className="inline-flex items-center space-x-2 px-3.5 py-2 rounded-xl bg-[#131d33] hover:bg-[#1a2744] active:scale-95 text-white text-xs font-black border border-slate-700 transition-all w-fit shadow-md"
        >
          <RefreshCw className={`w-3.5 h-3.5 text-amber-400 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh Data</span>
        </button>
      </div>

      {/* Stats Cards Grid with High-Contrast Vivid Colors */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-5">
        {/* Total Bookings */}
        <div className="p-3.5 sm:p-6 rounded-2xl sm:rounded-3xl bg-[#0d1424] border-2 border-amber-500/40 shadow-xl flex flex-col justify-between relative overflow-hidden group hover:border-amber-400 transition-all">
          <div className="flex items-center justify-between text-amber-400 mb-1.5 sm:mb-2">
            <span className="text-[10px] sm:text-[11px] font-black uppercase tracking-wider">TOTAL</span>
            <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <div className="text-2xl sm:text-4xl font-black text-white">{stats.total}</div>
          <div className="text-[10px] sm:text-[11px] font-bold text-amber-300/90 mt-1">All bookings recorded</div>
        </div>

        {/* Pending Confirmation */}
        <div className="p-3.5 sm:p-6 rounded-2xl sm:rounded-3xl bg-[#0d1424] border-2 border-rose-500/40 shadow-xl flex flex-col justify-between relative overflow-hidden group hover:border-rose-400 transition-all">
          <div className="flex items-center justify-between text-rose-400 mb-1.5 sm:mb-2">
            <span className="text-[10px] sm:text-[11px] font-black uppercase tracking-wider">PENDING CALL</span>
            <Clock className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <div className="text-2xl sm:text-4xl font-black text-rose-400">{stats.received}</div>
          <div className="text-[10px] sm:text-[11px] font-bold text-rose-300 mt-1">Needs confirmation</div>
        </div>

        {/* Confirmed */}
        <div className="p-3.5 sm:p-6 rounded-2xl sm:rounded-3xl bg-[#0d1424] border-2 border-blue-500/40 shadow-xl flex flex-col justify-between relative overflow-hidden group hover:border-blue-400 transition-all">
          <div className="flex items-center justify-between text-blue-400 mb-1.5 sm:mb-2">
            <span className="text-[10px] sm:text-[11px] font-black uppercase tracking-wider">CONFIRMED</span>
            <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <div className="text-2xl sm:text-4xl font-black text-blue-400">{stats.confirmed}</div>
          <div className="text-[10px] sm:text-[11px] font-bold text-blue-300 mt-1">Tracking ID issued</div>
        </div>

        {/* In Transit */}
        <div className="p-3.5 sm:p-6 rounded-2xl sm:rounded-3xl bg-[#0d1424] border-2 border-purple-500/40 shadow-xl flex flex-col justify-between relative overflow-hidden group hover:border-purple-400 transition-all">
          <div className="flex items-center justify-between text-purple-400 mb-1.5 sm:mb-2">
            <span className="text-[10px] sm:text-[11px] font-black uppercase tracking-wider">IN TRANSIT</span>
            <Truck className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <div className="text-2xl sm:text-4xl font-black text-purple-400">{stats.inTransit}</div>
          <div className="text-[10px] sm:text-[11px] font-bold text-purple-300 mt-1">On the road</div>
        </div>

        {/* Delivered */}
        <div className="p-3.5 sm:p-6 rounded-2xl sm:rounded-3xl bg-[#0d1424] border-2 border-emerald-500/40 shadow-xl flex flex-col justify-between col-span-2 sm:col-span-1 relative overflow-hidden group hover:border-emerald-400 transition-all">
          <div className="flex items-center justify-between text-emerald-400 mb-1.5 sm:mb-2">
            <span className="text-[10px] sm:text-[11px] font-black uppercase tracking-wider">DELIVERED</span>
            <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <div className="text-2xl sm:text-4xl font-black text-emerald-400">{stats.delivered}</div>
          <div className="text-[10px] sm:text-[11px] font-bold text-emerald-300 mt-1">Completed trips</div>
        </div>
      </div>

      {/* Recent Bookings Section Card */}
      <div className="p-4 sm:p-6 lg:p-8 rounded-2xl sm:rounded-3xl bg-[#0d1424] border-2 border-slate-800 shadow-2xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-5 sm:mb-6 pb-3 sm:pb-4 border-b border-slate-800 gap-3">
          <div>
            <h2 className="text-lg sm:text-xl font-black text-white tracking-tight">
              Recent Transport Bookings
            </h2>
            <p className="text-xs text-slate-300 mt-0.5">Latest customer submissions & active consignments</p>
          </div>
          <Link
            href="/admin/bookings"
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-slate-950 font-black text-xs flex items-center justify-center space-x-1.5 shadow-md transition-all active:scale-95 w-full sm:w-fit"
          >
            <span>View All Bookings</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {loading ? (
          <div className="py-16 text-center text-slate-300 text-xs">
            <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-amber-400" />
            Loading booking records...
          </div>
        ) : !data?.recentBookings || data.recentBookings.length === 0 ? (
          <div className="py-16 text-center text-slate-400 text-xs font-semibold">
            No booking submissions recorded yet.
          </div>
        ) : (
          <>
            {/* Mobile View: Clean, Spacious Booking Cards */}
            <div className="block sm:hidden space-y-3.5">
              {data.recentBookings.map((b: any) => (
                <div
                  key={b.id}
                  className="p-4 rounded-2xl bg-[#090d16] border border-slate-800 shadow-lg space-y-3"
                >
                  {/* Top Bar: Booking ID & Status */}
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="font-mono font-black text-white text-sm tracking-tight">
                        {b.bookingNumber}
                      </div>
                      {b.trackingId ? (
                        <div className="text-[11px] font-mono text-cyan-300 font-bold mt-0.5">
                          {b.trackingId}
                        </div>
                      ) : (
                        <div className="text-[10px] text-slate-400 italic">No tracking ID yet</div>
                      )}
                    </div>
                    <span
                      className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider shrink-0 ${
                        b.status === 'BOOKING_RECEIVED'
                          ? 'bg-rose-900/60 text-rose-300 border border-rose-500'
                          : b.status === 'CONFIRMED'
                          ? 'bg-blue-900/60 text-blue-300 border border-blue-500'
                          : b.status === 'DELIVERED'
                          ? 'bg-emerald-900/60 text-emerald-300 border border-emerald-500'
                          : 'bg-purple-900/60 text-purple-300 border border-purple-500'
                      }`}
                    >
                      {b.status.replace(/_/g, ' ')}
                    </span>
                  </div>

                  {/* Customer Info */}
                  <div className="flex items-center justify-between text-xs py-1 border-y border-slate-850">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400">Customer: </span>
                      <span className="font-bold text-white">{b.customer?.name || 'Guest'}</span>
                    </div>
                    {b.customer?.phone && (
                      <div className="flex items-center space-x-2">
                        <a
                          href={`tel:${b.customer.phone}`}
                          className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 font-bold flex items-center space-x-1"
                        >
                          <Phone className="w-3 h-3" />
                          <span className="text-[11px]">{b.customer.phone}</span>
                        </a>
                      </div>
                    )}
                  </div>

                  {/* Route & Service */}
                  <div className="space-y-1 text-xs">
                    <div className="flex items-center justify-between">
                      <div className="font-bold text-slate-100 flex items-center space-x-1.5">
                        <MapPin className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                        <span>{b.pickupCity}</span>
                        <span className="text-slate-400">&rarr;</span>
                        <span>{b.destinationCity}</span>
                      </div>
                      <span className="text-[11px] text-amber-400 font-bold bg-amber-500/10 px-2 py-0.5 rounded-md">
                        {b.distanceKm} KM
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-300">
                      Service: <span className="font-semibold text-slate-200">{b.serviceNameSnapshot}</span>
                    </div>
                  </div>

                  {/* Price & Action */}
                  <div className="flex items-center justify-between pt-2 border-t border-slate-850">
                    <div>
                      <div className="text-[10px] uppercase font-bold text-slate-400">Estimated Total</div>
                      <div className="text-base font-black text-emerald-400">
                        ₹{(b.finalAmount ?? b.estimatedAmount).toLocaleString('en-IN')}
                      </div>
                    </div>
                    <Link
                      href={`/admin/bookings?id=${b.id}`}
                      className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-rose-600 hover:text-white text-white text-xs font-black transition-all shadow-sm border border-slate-700"
                    >
                      Manage
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop / Tablet View: Spacious Table */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="w-full text-left text-xs min-w-[850px]">
                <thead className="text-[11px] uppercase tracking-wider text-slate-300 border-b border-slate-750">
                  <tr>
                    <th className="pb-3.5 font-black text-slate-200 whitespace-nowrap pr-4">BOOKING REF</th>
                    <th className="pb-3.5 font-black text-slate-200 whitespace-nowrap pr-4">CUSTOMER</th>
                    <th className="pb-3.5 font-black text-slate-200 whitespace-nowrap pr-4">ROUTE</th>
                    <th className="pb-3.5 font-black text-slate-200 whitespace-nowrap pr-4">SERVICE</th>
                    <th className="pb-3.5 font-black text-slate-200 whitespace-nowrap pr-4">AMOUNT</th>
                    <th className="pb-3.5 font-black text-slate-200 whitespace-nowrap pr-4">STATUS</th>
                    <th className="pb-3.5 font-black text-right text-slate-200 whitespace-nowrap">ACTION</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {data.recentBookings.map((b: any) => (
                    <tr key={b.id} className="hover:bg-slate-800/60 transition-colors">
                      <td className="py-4 pr-4 whitespace-nowrap font-mono font-black text-white text-xs sm:text-sm">
                        <div>{b.bookingNumber}</div>
                        {b.trackingId ? (
                          <div className="text-[10px] font-mono text-cyan-300 font-bold mt-0.5">
                            {b.trackingId}
                          </div>
                        ) : (
                          <div className="text-[10px] text-slate-400 italic">No tracking ID yet</div>
                        )}
                      </td>
                      <td className="py-4 pr-4 whitespace-nowrap">
                        <div className="font-bold text-white text-xs sm:text-sm">{b.customer?.name || 'Guest'}</div>
                        <div className="text-[11px] text-slate-300 flex items-center space-x-1.5 mt-0.5">
                          <Phone className="w-3 h-3 text-emerald-400" />
                          <a href={`tel:${b.customer?.phone}`} className="text-emerald-400 hover:underline font-bold">
                            {b.customer?.phone}
                          </a>
                        </div>
                      </td>
                      <td className="py-4 pr-4 whitespace-nowrap">
                        <div className="font-bold text-slate-100">
                          {b.pickupCity} &rarr; {b.destinationCity}
                        </div>
                        <div className="text-[11px] text-slate-300 font-medium">{b.distanceKm} KM</div>
                      </td>
                      <td className="py-4 pr-4 whitespace-nowrap text-slate-200 font-semibold">{b.serviceNameSnapshot}</td>
                      <td className="py-4 pr-4 whitespace-nowrap font-black text-emerald-400 text-sm">
                        ₹{(b.finalAmount ?? b.estimatedAmount).toLocaleString('en-IN')}
                      </td>
                      <td className="py-4 pr-4 whitespace-nowrap">
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-[10px] font-black uppercase ${
                            b.status === 'BOOKING_RECEIVED'
                              ? 'bg-rose-900/60 text-rose-300 border border-rose-500'
                              : b.status === 'CONFIRMED'
                              ? 'bg-blue-900/60 text-blue-300 border border-blue-500'
                              : b.status === 'DELIVERED'
                              ? 'bg-emerald-900/60 text-emerald-300 border border-emerald-500'
                              : 'bg-purple-900/60 text-purple-300 border border-purple-500'
                          }`}
                        >
                          {b.status.replace(/_/g, ' ')}
                        </span>
                      </td>
                      <td className="py-4 text-right whitespace-nowrap">
                        <Link
                          href={`/admin/bookings?id=${b.id}`}
                          className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-rose-600 hover:text-white text-slate-100 text-xs font-black transition-all shadow-sm border border-slate-700"
                        >
                          Manage
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

