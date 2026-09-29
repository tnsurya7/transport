'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  Search,
  Filter,
  RefreshCw,
  Phone,
  Mail,
  CheckCircle,
  Truck,
  DollarSign,
  X,
  FileText,
  MapPin,
  ExternalLink,
  ShieldCheck,
  AlertCircle,
  MessageSquare,
} from 'lucide-react';

function AdminBookingsContent() {
  const searchParams = useSearchParams();
  const highlightId = searchParams.get('id');

  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBooking, setSelectedBooking] = useState<any | null>(null);

  // Vehicles list for assignment
  const [vehicles, setVehicles] = useState<any[]>([]);

  // Action modals/states
  const [actionLoading, setActionLoading] = useState(false);
  const [actionSuccessMsg, setActionSuccessMsg] = useState<string | null>(null);

  // Pricing form state
  const [loadingCharge, setLoadingCharge] = useState<number>(0);
  const [unloadingCharge, setUnloadingCharge] = useState<number>(0);
  const [tollCharge, setTollCharge] = useState<number>(0);
  const [waitingCharge, setWaitingCharge] = useState<number>(0);
  const [otherCharges, setOtherCharges] = useState<number>(0);
  const [discount, setDiscount] = useState<number>(0);

  // Status update state
  const [newStatus, setNewStatus] = useState<string>('IN_TRANSIT');
  const [statusMessage, setStatusMessage] = useState<string>('');
  const [statusLocation, setStatusLocation] = useState<string>('');

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const url = `/api/admin/bookings?status=${statusFilter}&search=${encodeURIComponent(searchQuery)}`;
      const res = await fetch(url);
      const json = await res.json();
      if (json.success) {
        setBookings(json.data.bookings);
        if (highlightId && !selectedBooking) {
          const matched = json.data.bookings.find((b: any) => b.id === highlightId);
          if (matched) openManageModal(matched);
        }
      }
    } catch (err) {
      console.error('Failed to load bookings:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchVehicles = async () => {
    try {
      const res = await fetch('/api/admin/vehicles');
      const json = await res.json();
      if (json.success) setVehicles(json.data);
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    fetchBookings();
    fetchVehicles();
  }, [statusFilter]);

  const openManageModal = (b: any) => {
    setSelectedBooking(b);
    setLoadingCharge(b.loadingCharge || 0);
    setUnloadingCharge(b.unloadingCharge || 0);
    setTollCharge(b.tollCharge || 0);
    setWaitingCharge(b.waitingCharge || 0);
    setOtherCharges(b.otherCharges || 0);
    setDiscount(b.discount || 0);
    setNewStatus(b.status === 'BOOKING_RECEIVED' ? 'CONFIRMED' : b.status);
    setActionSuccessMsg(null);
  };

  // 1. Confirm Booking
  const handleConfirmBooking = async () => {
    if (!selectedBooking) return;
    setActionLoading(true);
    try {
      const res = await fetch(`/api/admin/bookings/${selectedBooking.id}/confirm`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      });
      const data = await res.json();
      if (data.success) {
        setSelectedBooking(data.data);
        setActionSuccessMsg(`Booking confirmed! Tracking ID: ${data.data.trackingId}`);
        fetchBookings();
      }
    } catch (err: any) {
      alert(err.message || 'Confirmation failed');
    } finally {
      setActionLoading(false);
    }
  };

  // 2. Status Update
  const handleUpdateStatus = async () => {
    if (!selectedBooking) return;
    setActionLoading(true);
    try {
      const res = await fetch(`/api/admin/bookings/${selectedBooking.id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: newStatus,
          message: statusMessage || undefined,
          location: statusLocation || undefined,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setSelectedBooking(data.data);
        setActionSuccessMsg(`Status updated to ${newStatus}`);
        fetchBookings();
      }
    } catch (err: any) {
      alert(err.message || 'Status update failed');
    } finally {
      setActionLoading(false);
    }
  };

  // 3. Save Final Pricing & Additional Charges
  const handleSavePricing = async () => {
    if (!selectedBooking) return;
    setActionLoading(true);
    try {
      const res = await fetch(`/api/admin/bookings/${selectedBooking.id}/pricing`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          loadingCharge,
          unloadingCharge,
          tollCharge,
          waitingCharge,
          otherCharges,
          discount,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setSelectedBooking(data.data);
        setActionSuccessMsg('Additional charges and final amount saved.');
        fetchBookings();
      }
    } catch (err: any) {
      alert(err.message || 'Pricing update failed');
    } finally {
      setActionLoading(false);
    }
  };

  // 4. Assign Vehicle
  const handleAssignVehicle = async (vehicleId: string) => {
    if (!selectedBooking || !vehicleId) return;
    setActionLoading(true);
    try {
      const res = await fetch(`/api/admin/bookings/${selectedBooking.id}/vehicle`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ vehicleId }),
      });
      const data = await res.json();
      if (data.success) {
        setSelectedBooking(data.data);
        setActionSuccessMsg('Vehicle assigned successfully.');
        fetchBookings();
      }
    } catch (err: any) {
      alert(err.message || 'Vehicle assignment failed');
    } finally {
      setActionLoading(false);
    }
  };

  const calculatedFinalAmount =
    (selectedBooking?.baseAmount || 0) +
    loadingCharge +
    unloadingCharge +
    tollCharge +
    waitingCharge +
    otherCharges -
    discount;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Transport Bookings Management
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Review submissions, call customers, confirm orders, assign vehicles, and issue tracking IDs
          </p>
        </div>

        <button
          onClick={fetchBookings}
          disabled={loading}
          className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors w-fit"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh List</span>
        </button>
      </div>

      {/* Filters Bar */}
      <div className="p-4 rounded-2xl bg-[#0d1424] border border-slate-800 flex flex-col md:flex-row items-center gap-3">
        {/* Search Input */}
        <div className="relative flex-1 w-full">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && fetchBookings()}
            placeholder="Search booking number, tracking ID, customer name or phone..."
            className="w-full pl-10 pr-4 py-2.5 bg-[#090d16] rounded-xl border border-slate-700 text-white placeholder:text-slate-400 text-xs sm:text-sm outline-none focus:border-amber-400"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
        </div>

        {/* Status Filter */}
        <div className="flex items-center space-x-2 w-full md:w-auto">
          <Filter className="w-4 h-4 text-slate-300 flex-shrink-0" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full md:w-48 px-3 py-2.5 bg-[#090d16] rounded-xl border border-slate-700 text-white text-xs font-semibold outline-none focus:border-amber-400"
          >
            <option value="ALL">All Statuses</option>
            <option value="BOOKING_RECEIVED">Booking Received</option>
            <option value="CONFIRMED">Confirmed</option>
            <option value="VEHICLE_ASSIGNED">Vehicle Assigned</option>
            <option value="PICKUP_COMPLETED">Pickup Completed</option>
            <option value="IN_TRANSIT">In Transit</option>
            <option value="OUT_FOR_DELIVERY">Out for Delivery</option>
            <option value="DELIVERED">Delivered</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Bookings Table */}
      <div className="p-4 sm:p-6 rounded-2xl sm:rounded-3xl bg-[#0d1424] border border-slate-800 shadow-2xl">
        {loading ? (
          <div className="py-16 text-center text-slate-300 text-xs">
            <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-amber-400" />
            Loading booking records...
          </div>
        ) : bookings.length === 0 ? (
          <div className="py-16 text-center text-slate-400 text-xs font-semibold">
            No bookings found matching the current criteria.
          </div>
        ) : (
          <>
            {/* Mobile View: Clean, Spacious Booking Cards */}
            <div className="block sm:hidden space-y-3.5">
              {bookings.map((b) => (
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

                  {/* Customer Info with Direct Call & WhatsApp */}
                  <div className="flex flex-col gap-1.5 text-xs py-2 border-y border-slate-850">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] uppercase font-bold text-slate-400">Customer: </span>
                      <span className="font-bold text-white">{b.customer?.name || 'Guest'}</span>
                    </div>
                    {b.customer?.phone && (
                      <div className="flex items-center justify-between pt-1">
                        <span className="text-[10px] text-slate-400">Phone & Chat:</span>
                        <div className="flex items-center space-x-2">
                          <a
                            href={`tel:${b.customer.phone}`}
                            className="px-2 py-1 rounded-lg bg-amber-500/20 text-amber-400 hover:bg-amber-500/30 font-bold flex items-center space-x-1 text-[11px]"
                          >
                            <Phone className="w-3 h-3" />
                            <span>{b.customer.phone}</span>
                          </a>
                          <a
                            href={`https://wa.me/${b.customer.phone.replace(/[^0-9]/g, '')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-2 py-1 rounded-lg bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 font-bold text-[11px]"
                          >
                            WhatsApp
                          </a>
                        </div>
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
                      <div className="text-[10px] uppercase font-bold text-slate-400">
                        {b.finalAmount !== null ? 'Final Total' : 'Estimated Base'}
                      </div>
                      <div className="text-base font-black text-emerald-400">
                        ₹{(b.finalAmount ?? b.estimatedAmount).toLocaleString('en-IN')}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => openManageModal(b)}
                      className="px-4 py-2 rounded-xl bg-gradient-to-r from-rose-600 to-indigo-600 hover:from-rose-500 hover:to-indigo-500 text-white text-xs font-black transition-all shadow-md active:scale-95"
                    >
                      Manage Consignment
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop / Tablet View: Spacious Table */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="w-full text-left text-xs min-w-[850px]">
                <thead className="text-[11px] uppercase tracking-wider text-slate-300 border-b border-slate-750">
                  <tr>
                    <th className="pb-3.5 font-black text-slate-200 whitespace-nowrap pr-4">Booking No / Tracking ID</th>
                    <th className="pb-3.5 font-black text-slate-200 whitespace-nowrap pr-4">Customer Contact</th>
                    <th className="pb-3.5 font-black text-slate-200 whitespace-nowrap pr-4">Route & Distance</th>
                    <th className="pb-3.5 font-black text-slate-200 whitespace-nowrap pr-4">Service Snapshot</th>
                    <th className="pb-3.5 font-black text-slate-200 whitespace-nowrap pr-4">Amount</th>
                    <th className="pb-3.5 font-black text-slate-200 whitespace-nowrap pr-4">Status</th>
                    <th className="pb-3.5 font-black text-right text-slate-200 whitespace-nowrap">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {bookings.map((b) => (
                    <tr key={b.id} className="hover:bg-slate-800/60 transition-colors">
                      <td className="py-4 pr-4 whitespace-nowrap">
                        <div className="font-mono font-black text-white text-sm">{b.bookingNumber}</div>
                        {b.trackingId ? (
                          <div className="text-[11px] font-mono text-cyan-300 font-bold mt-0.5">{b.trackingId}</div>
                        ) : (
                          <div className="text-[10px] text-slate-400 italic">No tracking ID yet</div>
                        )}
                      </td>
                      <td className="py-4 pr-4 whitespace-nowrap">
                        <div className="font-bold text-white text-sm">{b.customer?.name}</div>
                        <div className="text-[11px] text-slate-300 flex items-center space-x-2 mt-0.5">
                          <a
                            href={`tel:${b.customer?.phone}`}
                            className="text-amber-400 hover:underline flex items-center space-x-0.5 font-bold"
                          >
                            <Phone className="w-3 h-3" />
                            <span>{b.customer?.phone}</span>
                          </a>
                          <span>&bull;</span>
                          <a
                            href={`https://wa.me/${b.customer?.phone?.replace(/[^0-9]/g, '')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-emerald-400 hover:underline font-bold"
                          >
                            WhatsApp
                          </a>
                        </div>
                      </td>
                      <td className="py-4 pr-4 whitespace-nowrap">
                        <div className="font-semibold text-slate-100">
                          {b.pickupCity} &rarr; {b.destinationCity}
                        </div>
                        <div className="text-[11px] text-slate-300">{b.distanceKm} KM</div>
                      </td>
                      <td className="py-4 pr-4 whitespace-nowrap">
                        <div className="text-slate-200 font-semibold">{b.serviceNameSnapshot}</div>
                        <div className="text-[11px] text-slate-300 font-medium">
                          {b.pricingRuleSnapshot || `₹${b.rateSnapshot}/km`}
                        </div>
                      </td>
                      <td className="py-4 pr-4 whitespace-nowrap">
                        <div className="font-black text-emerald-400 text-sm">
                          ₹{(b.finalAmount ?? b.estimatedAmount).toLocaleString('en-IN')}
                        </div>
                        <div className="text-[10px] text-slate-400">
                          {b.finalAmount !== null ? 'Final Amount' : 'Estimated Base'}
                        </div>
                      </td>
                      <td className="py-4 pr-4 whitespace-nowrap">
                        <span
                          className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-black uppercase ${
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
                        <button
                          type="button"
                          onClick={() => openManageModal(b)}
                          className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-rose-600 hover:text-white text-slate-100 text-xs font-black transition-all shadow-sm border border-slate-700"
                        >
                          Manage Booking
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>

      {/* Booking Management Drawer / Modal */}
      {selectedBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-[#0d1424] border-2 border-slate-700 rounded-2xl sm:rounded-3xl max-w-2xl w-full p-4 sm:p-8 shadow-2xl relative max-h-[92vh] overflow-y-auto text-slate-100">
            {/* Close Button */}
            <button
              onClick={() => setSelectedBooking(null)}
              className="absolute top-4 right-4 sm:top-5 sm:right-5 p-2 rounded-full text-slate-400 hover:text-white hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Header */}
            <div className="mb-4 sm:mb-6 pb-3 sm:pb-4 border-b border-slate-800 pr-8">
              <div className="flex flex-wrap items-center gap-1.5 sm:space-x-2">
                <span className="text-xs font-mono font-bold text-amber-300 bg-amber-950/80 px-2.5 py-1 rounded-lg border border-amber-800">
                  {selectedBooking.bookingNumber}
                </span>
                {selectedBooking.trackingId && (
                  <span className="text-xs font-mono font-bold text-blue-300 bg-blue-950/80 px-2.5 py-1 rounded-lg border border-blue-800">
                    Tracking ID: {selectedBooking.trackingId}
                  </span>
                )}
              </div>
              <h2 className="text-lg sm:text-xl font-black text-white mt-2">
                Manage Transport Consignment
              </h2>
            </div>

            {actionSuccessMsg && (
              <div className="mb-5 p-3 rounded-xl bg-emerald-950/80 border border-emerald-700 text-emerald-300 text-xs font-bold flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 flex-shrink-0" />
                <span>{actionSuccessMsg}</span>
              </div>
            )}

            {/* Customer & Route Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 p-3.5 sm:p-4 rounded-xl sm:rounded-2xl bg-[#090d16] border border-slate-800 mb-5 sm:mb-6 text-xs">
              <div>
                <div className="text-slate-400 uppercase font-black text-[10px] mb-1">Customer Info</div>
                <div className="text-white font-bold text-sm">{selectedBooking.customer?.name}</div>
                <div className="flex items-center space-x-2 sm:space-x-3 mt-1.5">
                  <a
                    href={`tel:${selectedBooking.customer?.phone}`}
                    className="px-2.5 py-1 rounded-lg bg-amber-500 text-slate-950 font-black flex items-center space-x-1"
                  >
                    <Phone className="w-3 h-3" />
                    <span>Call</span>
                  </a>
                  <a
                    href={`https://wa.me/${selectedBooking.customer?.phone?.replace(/[^0-9]/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-2.5 py-1 rounded-lg bg-emerald-500 text-white font-black flex items-center space-x-1"
                  >
                    <MessageSquare className="w-3 h-3" />
                    <span>WhatsApp</span>
                  </a>
                </div>
              </div>

              <div>
                <div className="text-slate-400 uppercase font-black text-[10px] mb-1">Route & Service</div>
                <div className="text-white font-bold">
                  {selectedBooking.pickupCity} → {selectedBooking.destinationCity} ({selectedBooking.distanceKm} KM)
                </div>
                <div className="text-slate-300 mt-1">
                  {selectedBooking.serviceNameSnapshot} &bull; Rate: ₹{selectedBooking.rateSnapshot}/km
                </div>
              </div>
            </div>

            {/* SECTION 1: Confirmation Action */}
            {selectedBooking.status === 'BOOKING_RECEIVED' && (
              <div className="mb-5 sm:mb-6 p-3.5 sm:p-4 rounded-xl sm:rounded-2xl bg-rose-950/40 border border-rose-800/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="text-white font-bold text-xs sm:text-sm">Booking Needs Owner Confirmation</div>
                  <div className="text-[11px] sm:text-xs text-rose-200/80 mt-0.5">
                    Clicking Confirm generates official Tracking ID & emails customer.
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleConfirmBooking}
                  disabled={actionLoading}
                  className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-rose-500 hover:from-amber-600 hover:to-rose-600 text-white font-black text-xs shadow-md transition-all flex items-center justify-center space-x-1.5 flex-shrink-0 w-full sm:w-auto"
                >
                  <CheckCircle className="w-4 h-4" />
                  <span>Confirm Booking</span>
                </button>
              </div>
            )}

            {/* SECTION 2: Vehicle Assignment */}
            <div className="mb-6 p-4 rounded-2xl bg-[#090d16] border border-slate-800">
              <label className="block text-xs font-black text-white uppercase tracking-wider mb-2">
                Assign Fleet Vehicle & Driver
              </label>
              <div className="flex gap-2">
                <select
                  defaultValue={selectedBooking.vehicleId || ''}
                  onChange={(e) => handleAssignVehicle(e.target.value)}
                  className="flex-1 px-3.5 py-2.5 bg-[#0d1424] rounded-xl border border-slate-700 text-xs text-white outline-none focus:border-amber-400"
                >
                  <option value="">-- Select Transport Vehicle --</option>
                  {vehicles.map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.vehicleNumber} ({v.vehicleType} - {v.capacity}) - Driver: {v.driverName}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* SECTION 3: Update Shipment Status */}
            <div className="mb-6 p-4 rounded-2xl bg-[#090d16] border border-slate-800 space-y-3">
              <label className="block text-xs font-black text-white uppercase tracking-wider">
                Update Tracking Status & Milestone
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="px-3.5 py-2.5 bg-[#0d1424] rounded-xl border border-slate-700 text-xs text-white outline-none focus:border-amber-400"
                >
                  <option value="BOOKING_RECEIVED">BOOKING RECEIVED</option>
                  <option value="CONFIRMED">CONFIRMED</option>
                  <option value="VEHICLE_ASSIGNED">VEHICLE ASSIGNED</option>
                  <option value="PICKUP_COMPLETED">PICKUP COMPLETED</option>
                  <option value="IN_TRANSIT">IN TRANSIT</option>
                  <option value="OUT_FOR_DELIVERY">OUT FOR DELIVERY</option>
                  <option value="DELIVERED">DELIVERED</option>
                  <option value="CANCELLED">CANCELLED</option>
                </select>

                <input
                  type="text"
                  value={statusLocation}
                  onChange={(e) => setStatusLocation(e.target.value)}
                  placeholder="Checkpoint Location (e.g. Salem Toll)"
                  className="px-3.5 py-2.5 bg-[#0d1424] rounded-xl border border-slate-700 text-xs text-white outline-none focus:border-amber-400"
                />
              </div>

              <input
                type="text"
                value={statusMessage}
                onChange={(e) => setStatusMessage(e.target.value)}
                placeholder="Status Message / Update Note..."
                className="w-full px-3.5 py-2.5 bg-[#0d1424] rounded-xl border border-slate-700 text-xs text-white outline-none focus:border-amber-400"
              />

              <button
                type="button"
                onClick={handleUpdateStatus}
                disabled={actionLoading}
                className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-black text-xs border border-slate-700 transition-colors"
              >
                Apply Status & Create Tracking Event
              </button>
            </div>

            {/* SECTION 4: Additional Charges & Final Amount Calculator */}
            <div className="p-4 rounded-2xl bg-[#090d16] border border-slate-800 space-y-3">
              <div className="flex justify-between items-center">
                <label className="text-xs font-black text-white uppercase tracking-wider">
                  Additional Charges & Final Amount
                </label>
                <span className="text-xs font-black text-emerald-400">
                  Final: ₹{calculatedFinalAmount.toLocaleString('en-IN')}
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 block mb-1">Base Amount</span>
                  <input
                    type="number"
                    disabled
                    value={selectedBooking.baseAmount}
                    className="w-full p-2 bg-[#0d1424] rounded-lg border border-slate-800 text-slate-400"
                  />
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block mb-1">Loading (₹)</span>
                  <input
                    type="number"
                    value={loadingCharge}
                    onChange={(e) => setLoadingCharge(parseFloat(e.target.value) || 0)}
                    className="w-full p-2 bg-[#0d1424] rounded-lg border border-slate-700 text-white"
                  />
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block mb-1">Unloading (₹)</span>
                  <input
                    type="number"
                    value={unloadingCharge}
                    onChange={(e) => setUnloadingCharge(parseFloat(e.target.value) || 0)}
                    className="w-full p-2 bg-[#0d1424] rounded-lg border border-slate-700 text-white"
                  />
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block mb-1">Toll (₹)</span>
                  <input
                    type="number"
                    value={tollCharge}
                    onChange={(e) => setTollCharge(parseFloat(e.target.value) || 0)}
                    className="w-full p-2 bg-[#0d1424] rounded-lg border border-slate-700 text-white"
                  />
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block mb-1">Waiting / Other (₹)</span>
                  <input
                    type="number"
                    value={otherCharges}
                    onChange={(e) => setOtherCharges(parseFloat(e.target.value) || 0)}
                    className="w-full p-2 bg-[#0d1424] rounded-lg border border-slate-700 text-white"
                  />
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block mb-1">Discount (₹)</span>
                  <input
                    type="number"
                    value={discount}
                    onChange={(e) => setDiscount(parseFloat(e.target.value) || 0)}
                    className="w-full p-2 bg-[#0d1424] rounded-lg border border-slate-700 text-emerald-400 font-bold"
                  />
                </div>
              </div>

              <button
                type="button"
                onClick={handleSavePricing}
                disabled={actionLoading}
                className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs transition-colors shadow-md"
              >
                Save Final Pricing Breakdown
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function AdminBookingsPage() {
  return (
    <Suspense fallback={<div className="p-8 text-slate-400 text-center">Loading bookings...</div>}>
      <AdminBookingsContent />
    </Suspense>
  );
}
