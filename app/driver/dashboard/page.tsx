'use client';

import React, { useState, useEffect } from 'react';
import {
  Truck,
  Phone,
  MessageSquare,
  MapPin,
  CheckCircle2,
  Clock,
  Navigation,
  RefreshCw,
  Send,
  AlertCircle,
  Package,
  Calendar,
  Check,
} from 'lucide-react';

export default function DriverDashboardPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Active status updating state
  const [selectedBookingId, setSelectedBookingId] = useState<string | null>(null);
  const [newStatus, setNewStatus] = useState<string>('IN_TRANSIT');
  const [locationInput, setLocationInput] = useState<string>('');
  const [messageInput, setMessageInput] = useState<string>('');
  const [updating, setUpdating] = useState(false);
  const [successNotice, setSuccessNotice] = useState<string | null>(null);

  const fetchTrips = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/driver/bookings');
      const json = await res.json();
      if (json.success) {
        setData(json.data);
      }
    } catch (err) {
      console.error('Failed to load driver trips:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrips();
  }, []);

  const handleUpdateTrip = async (bookingId: string) => {
    setUpdating(true);
    setSuccessNotice(null);
    try {
      const res = await fetch(`/api/driver/bookings/${bookingId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: newStatus,
          location: locationInput.trim() || undefined,
          message: messageInput.trim() || undefined,
        }),
      });

      const json = await res.json();
      if (!json.success) throw new Error(json.error || 'Update failed');

      setSuccessNotice(`Trip updated to ${newStatus.replace(/_/g, ' ')}! Live tracking updated.`);
      setSelectedBookingId(null);
      setLocationInput('');
      setMessageInput('');
      fetchTrips();
    } catch (err: any) {
      alert(err.message || 'Status update failed');
    } finally {
      setUpdating(false);
    }
  };

  const bookings = data?.bookings || [];
  const driver = data?.driver;

  const activeCount = bookings.filter((b: any) => b.status !== 'DELIVERED' && b.status !== 'CANCELLED').length;
  const inTransitCount = bookings.filter((b: any) => b.status === 'IN_TRANSIT').length;
  const deliveredCount = bookings.filter((b: any) => b.status === 'DELIVERED').length;

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="p-4 sm:p-6 rounded-2xl sm:rounded-3xl bg-gradient-to-r from-[#0d1424] via-[#101c36] to-[#0d1424] border-2 border-slate-800 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs uppercase tracking-wider font-extrabold text-amber-400">
              Welcome Driver
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span className="text-xs font-mono text-emerald-400 font-bold">Duty Active</span>
          </div>
          <h1 className="text-lg sm:text-2xl font-black text-white mt-1">
            {driver?.name || 'Driver Portal'} &bull; Assigned Trips
          </h1>
          <p className="text-xs text-slate-300 mt-0.5 font-medium">
            Review customer delivery addresses, direct phone numbers, and live highway updates.
          </p>
        </div>

        <button
          onClick={fetchTrips}
          disabled={loading}
          className="inline-flex items-center space-x-2 px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-xl bg-[#090d16] hover:bg-slate-800 text-slate-200 text-xs font-black border border-slate-700 transition-all w-fit shadow-md active:scale-95"
        >
          <RefreshCw className={`w-3.5 h-3.5 text-emerald-400 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh Assigned Trips</span>
        </button>
      </div>

      {/* Driver Quick Metrics */}
      <div className="grid grid-cols-3 gap-2.5 sm:gap-4">
        <div className="p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-[#0d1424] border border-amber-500/30 text-center shadow-lg">
          <div className="text-[9px] sm:text-[10px] font-black uppercase text-amber-400 tracking-wider">Active Trips</div>
          <div className="text-xl sm:text-3xl font-black text-white mt-1">{activeCount}</div>
        </div>

        <div className="p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-[#0d1424] border border-purple-500/30 text-center shadow-lg">
          <div className="text-[9px] sm:text-[10px] font-black uppercase text-purple-400 tracking-wider">In Transit</div>
          <div className="text-xl sm:text-3xl font-black text-purple-400 mt-1">{inTransitCount}</div>
        </div>

        <div className="p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-[#0d1424] border border-emerald-500/30 text-center shadow-lg">
          <div className="text-[9px] sm:text-[10px] font-black uppercase text-emerald-400 tracking-wider">Delivered</div>
          <div className="text-xl sm:text-3xl font-black text-emerald-400 mt-1">{deliveredCount}</div>
        </div>
      </div>

      {successNotice && (
        <div className="p-4 rounded-2xl bg-emerald-950/90 border border-emerald-700 text-emerald-300 text-xs font-bold flex items-center space-x-2 shadow-lg animate-in fade-in duration-200">
          <CheckCircle2 className="w-5 h-5 flex-shrink-0 text-emerald-400" />
          <span>{successNotice}</span>
        </div>
      )}

      {/* Trips List */}
      <div className="space-y-5">
        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
          <h2 className="text-base sm:text-lg font-black text-white tracking-tight flex items-center space-x-2">
            <Package className="w-5 h-5 text-amber-400" />
            <span>Assigned Consignments ({bookings.length})</span>
          </h2>
          <span className="text-[11px] text-slate-400 font-medium">
            (Only Admin-confirmed & assigned orders appear here)
          </span>
        </div>

        {loading ? (
          <div className="py-20 text-center text-slate-300 text-xs bg-[#0d1424] rounded-3xl border border-slate-800">
            <RefreshCw className="w-7 h-7 animate-spin mx-auto mb-2 text-emerald-400" />
            Loading assigned delivery orders...
          </div>
        ) : bookings.length === 0 ? (
          <div className="py-16 text-center text-slate-400 text-xs font-semibold bg-[#0d1424] rounded-3xl border border-slate-800 p-6 space-y-2">
            <Truck className="w-8 h-8 text-slate-600 mx-auto" />
            <div className="text-slate-300 font-bold text-sm">No Active Consignments Assigned</div>
            <p className="text-slate-500 max-w-md mx-auto text-xs">
              When the Super Admin confirms an order and assigns your vehicle, the complete pickup address, delivery address, and customer contact details will automatically appear here.
            </p>
          </div>
        ) : (
          bookings.map((b: any) => {
            const isDelivered = b.status === 'DELIVERED';
            const isEditing = selectedBookingId === b.id;

            return (
              <div
                key={b.id}
                className={`p-5 sm:p-7 rounded-3xl bg-[#0d1424] border-2 shadow-2xl transition-all ${
                  isDelivered
                    ? 'border-slate-800 opacity-90'
                    : 'border-emerald-500/40 hover:border-emerald-400'
                }`}
              >
                {/* Top Trip Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800 gap-3">
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-mono font-black text-amber-400 bg-amber-950/80 px-2.5 py-1 rounded-lg border border-amber-800">
                        {b.bookingNumber}
                      </span>
                      {b.trackingId && (
                        <span className="text-xs font-mono font-bold text-cyan-300 bg-cyan-950/80 px-2.5 py-1 rounded-lg border border-cyan-800">
                          ID: {b.trackingId}
                        </span>
                      )}
                      <span className="text-xs text-slate-400 font-semibold">&bull; {b.serviceNameSnapshot}</span>
                    </div>
                    <div className="text-lg font-black text-white mt-1.5 flex items-center space-x-2">
                      <span>{b.pickupCity}</span>
                      <span className="text-amber-400">&rarr;</span>
                      <span>{b.destinationCity}</span>
                      <span className="text-xs font-bold text-slate-400">({b.distanceKm} KM)</span>
                    </div>
                  </div>

                  {/* Status Badge */}
                  <div>
                    <span
                      className={`inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-[11px] font-black uppercase ${
                        b.status === 'DELIVERED'
                          ? 'bg-emerald-950 text-emerald-300 border border-emerald-500'
                          : b.status === 'IN_TRANSIT'
                          ? 'bg-purple-950 text-purple-300 border border-purple-500'
                          : b.status === 'PICKUP_COMPLETED'
                          ? 'bg-amber-950 text-amber-300 border border-amber-500'
                          : 'bg-blue-950 text-blue-300 border border-blue-500'
                      }`}
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-current" />
                      <span>{b.status.replace(/_/g, ' ')}</span>
                    </span>
                  </div>
                </div>

                {/* Customer & Route Details Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 my-4 sm:my-5 text-xs">
                  {/* Customer Details */}
                  <div className="p-3.5 sm:p-4 rounded-xl sm:rounded-2xl bg-[#090d16] border border-slate-800 space-y-2">
                    <div className="text-[10px] font-black uppercase tracking-wider text-amber-400">
                      Customer &amp; Consignee Details
                    </div>
                    <div className="text-white font-bold text-sm">{b.customer?.name}</div>

                    <div className="flex flex-wrap items-center gap-2 pt-1">
                      <a
                        href={`tel:${b.customer?.phone}`}
                        className="px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black text-xs flex items-center space-x-1.5 shadow-md active:scale-95 transition-all tap-target"
                      >
                        <Phone className="w-3.5 h-3.5" />
                        <span>Call: {b.customer?.phone}</span>
                      </a>

                      <a
                        href={`https://wa.me/${b.customer?.phone?.replace(/[^0-9]/g, '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs flex items-center space-x-1.5 shadow-md active:scale-95 transition-all tap-target"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>WhatsApp</span>
                      </a>
                    </div>
                  </div>

                  {/* Vehicle Info */}
                  <div className="p-4 rounded-2xl bg-[#090d16] border border-slate-800 space-y-1.5">
                    <div className="text-[10px] font-black uppercase tracking-wider text-amber-400">
                      Assigned Fleet Vehicle
                    </div>
                    <div className="text-white font-mono font-bold text-sm">
                      {b.vehicle?.vehicleNumber || 'Vehicle Assigned'}
                    </div>
                    <div className="text-slate-300">{b.vehicle?.vehicleType}</div>
                    {b.customerNotes && (
                      <div className="text-[11px] text-amber-300/90 pt-1 font-medium bg-amber-950/30 p-2 rounded-lg border border-amber-900/50">
                        <strong>Customer Note:</strong> {b.customerNotes}
                      </div>
                    )}
                  </div>
                </div>

                {/* Full Pickup & Destination Addresses */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-[#090d16] border border-slate-800 text-xs mb-5">
                  <div>
                    <div className="flex items-center space-x-1.5 text-amber-400 font-black uppercase text-[10px] mb-1">
                      <MapPin className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                      <span>1. Pickup Loading Address</span>
                    </div>
                    <div className="text-white font-semibold text-xs sm:text-sm">{b.pickupAddress}</div>
                    <div className="text-slate-400 mt-0.5 font-medium">
                      {b.pickupCity}, {b.pickupDistrict}, {b.pickupState} - {b.pickupPincode}
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center space-x-1.5 text-emerald-400 font-black uppercase text-[10px] mb-1">
                      <Navigation className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                      <span>2. Destination Delivery Address</span>
                    </div>
                    <div className="text-white font-semibold text-xs sm:text-sm">{b.destinationAddress}</div>
                    <div className="text-slate-400 mt-0.5 font-medium">
                      {b.destinationCity}, {b.destinationDistrict}, {b.destinationState} - {b.destinationPincode}
                    </div>
                  </div>
                </div>

                {/* Driver Action Bar / Update Panel */}
                <div className="pt-4 border-t border-slate-800">
                  {!isEditing ? (
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="text-xs text-slate-400">
                        {b.trackingEvents && b.trackingEvents[0] && (
                          <span>
                            Latest Checkpoint: <strong className="text-slate-200">{b.trackingEvents[0].location || 'Active'}</strong> &bull; {b.trackingEvents[0].message}
                          </span>
                        )}
                      </div>

                      <button
                        onClick={() => {
                          setSelectedBookingId(b.id);
                          setNewStatus(
                            b.status === 'CONFIRMED' || b.status === 'VEHICLE_ASSIGNED'
                              ? 'PICKUP_COMPLETED'
                              : b.status === 'PICKUP_COMPLETED'
                              ? 'IN_TRANSIT'
                              : b.status === 'IN_TRANSIT'
                              ? 'OUT_FOR_DELIVERY'
                              : 'DELIVERED'
                          );
                          setLocationInput('');
                          setMessageInput('');
                        }}
                        className="px-5 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-black text-xs sm:text-sm flex items-center justify-center space-x-2 shadow-lg shadow-emerald-500/20 active:scale-95 transition-all tap-target"
                      >
                        <Navigation className="w-4 h-4" />
                        <span>Update Trip Status &amp; Location</span>
                      </button>
                    </div>
                  ) : (
                    /* In-place Update Form */
                    <div className="p-4 sm:p-5 rounded-2xl bg-[#090d16] border-2 border-emerald-500/50 space-y-4 animate-in fade-in duration-150">
                      <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                        <span className="text-xs font-black text-white uppercase tracking-wider flex items-center space-x-1.5">
                          <Check className="w-4 h-4 text-emerald-400" />
                          <span>Submit Milestone &amp; Checkpoint Update</span>
                        </span>
                        <button
                          onClick={() => setSelectedBookingId(null)}
                          className="text-xs text-slate-400 hover:text-white font-bold"
                        >
                          Cancel
                        </button>
                      </div>

                      {/* 1-Tap Status Selector */}
                      <div>
                        <label className="block text-[11px] font-black uppercase text-slate-300 mb-2">
                          Select Current Shipment Status
                        </label>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                          {[
                            { val: 'PICKUP_COMPLETED', label: '📦 Pickup Done', color: 'amber' },
                            { val: 'IN_TRANSIT', label: '🚛 In Transit', color: 'purple' },
                            { val: 'OUT_FOR_DELIVERY', label: '📍 Out for Delivery', color: 'blue' },
                            { val: 'DELIVERED', label: '✅ Delivered', color: 'emerald' },
                          ].map((st) => (
                            <button
                              key={st.val}
                              type="button"
                              onClick={() => setNewStatus(st.val)}
                              className={`p-3 rounded-xl text-xs font-black border transition-all ${
                                newStatus === st.val
                                  ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-md scale-[1.02]'
                                  : 'bg-[#0d1424] text-slate-300 border-slate-700 hover:bg-slate-800'
                              }`}
                            >
                              {st.label}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Location Input */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[11px] font-black uppercase text-slate-300 mb-1">
                            Current Location / Checkpoint *
                          </label>
                          <input
                            type="text"
                            value={locationInput}
                            onChange={(e) => setLocationInput(e.target.value)}
                            placeholder="e.g. Salem Toll Plaza / Hosur Highway"
                            className="w-full px-3.5 py-2.5 bg-[#0d1424] rounded-xl border border-slate-700 text-white text-xs outline-none focus:border-emerald-400 font-semibold"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-black uppercase text-slate-300 mb-1">
                            Status Note / Checkpoint Message
                          </label>
                          <input
                            type="text"
                            value={messageInput}
                            onChange={(e) => setMessageInput(e.target.value)}
                            placeholder="e.g. Crossing Salem, on schedule"
                            className="w-full px-3.5 py-2.5 bg-[#0d1424] rounded-xl border border-slate-700 text-white text-xs outline-none focus:border-emerald-400"
                          />
                        </div>
                      </div>

                      <div className="flex items-center space-x-2 pt-1">
                        <button
                          type="button"
                          onClick={() => handleUpdateTrip(b.id)}
                          disabled={updating}
                          className="flex-1 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-slate-950 font-black text-xs sm:text-sm flex items-center justify-center space-x-2 shadow-lg transition-all active:scale-95 disabled:opacity-75"
                        >
                          {updating ? (
                            <>
                              <RefreshCw className="w-4 h-4 animate-spin" />
                              <span>Submitting...</span>
                            </>
                          ) : (
                            <>
                              <Send className="w-4 h-4" />
                              <span>Apply Status &amp; Notify Customer</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
