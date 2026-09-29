'use client';

import React, { useState, useEffect } from 'react';
import {
  Truck,
  Phone,
  User,
  CheckCircle,
  RefreshCw,
  Plus,
  Edit2,
  Trash2,
  Key,
  ShieldCheck,
  X,
  Lock,
  Mail,
  FileBadge,
  Layers,
  Eye,
  EyeOff,
} from 'lucide-react';
import { isValidPhone, isValidEmail, sanitizePhoneInput } from '@/lib/validators';

export default function AdminVehiclesAndDriversPage() {
  const [activeTab, setActiveTab] = useState<'VEHICLES' | 'DRIVERS'>('VEHICLES');

  const [vehicles, setVehicles] = useState<any[]>([]);
  const [drivers, setDrivers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Vehicle Modal State
  const [vehicleModalOpen, setVehicleModalOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<any | null>(null);
  const [vehicleNumber, setVehicleNumber] = useState('');
  const [vehicleType, setVehicleType] = useState('Eicher 17ft Closed Container');
  const [capacity, setCapacity] = useState('5 Ton');
  const [assignedDriverId, setAssignedDriverId] = useState('');
  const [vehicleActive, setVehicleActive] = useState(true);

  // Driver Modal State
  const [driverModalOpen, setDriverModalOpen] = useState(false);
  const [editingDriver, setEditingDriver] = useState<any | null>(null);
  const [driverName, setDriverName] = useState('');
  const [driverPhone, setDriverPhone] = useState('');
  const [driverEmail, setDriverEmail] = useState('');
  const [driverPassword, setDriverPassword] = useState('');
  const [showDriverPassword, setShowDriverPassword] = useState(false);
  const [driverLicense, setDriverLicense] = useState('');
  const [driverActive, setDriverActive] = useState(true);

  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [vRes, dRes] = await Promise.all([
        fetch('/api/admin/vehicles'),
        fetch('/api/admin/drivers'),
      ]);
      const vJson = await vRes.json();
      const dJson = await dRes.json();
      if (vJson.success) setVehicles(vJson.data);
      if (dJson.success) setDrivers(dJson.data);
    } catch (err) {
      console.error('Failed to fetch fleet & driver data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Open Vehicle Modal
  const openAddVehicleModal = () => {
    setEditingVehicle(null);
    setVehicleNumber('');
    setVehicleType('Eicher 17ft Closed Container');
    setCapacity('5 Ton');
    setAssignedDriverId(drivers.length > 0 ? drivers[0].id : '');
    setVehicleActive(true);
    setErrorMsg(null);
    setVehicleModalOpen(true);
  };

  const openEditVehicleModal = (v: any) => {
    setEditingVehicle(v);
    setVehicleNumber(v.vehicleNumber);
    setVehicleType(v.vehicleType);
    setCapacity(v.capacity || '');
    setAssignedDriverId(v.driverId || '');
    setVehicleActive(v.isActive);
    setErrorMsg(null);
    setVehicleModalOpen(true);
  };

  const handleSaveVehicle = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setErrorMsg(null);
    try {
      const method = editingVehicle ? 'PATCH' : 'POST';
      const url = editingVehicle
        ? `/api/admin/vehicles/${editingVehicle.id}`
        : '/api/admin/vehicles';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          vehicleNumber,
          vehicleType,
          capacity,
          driverId: assignedDriverId || null,
          isActive: vehicleActive,
        }),
      });

      const json = await res.json();
      if (!json.success) throw new Error(json.error || 'Failed to save vehicle');

      setVehicleModalOpen(false);
      fetchData();
    } catch (err: any) {
      setErrorMsg(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteVehicle = async (id: string) => {
    if (!confirm('Are you sure you want to delete this vehicle?')) return;
    try {
      await fetch(`/api/admin/vehicles/${id}`, { method: 'DELETE' });
      fetchData();
    } catch {
      alert('Delete failed');
    }
  };

  // Open Driver Modal
  const openAddDriverModal = () => {
    setEditingDriver(null);
    setDriverName('');
    setDriverPhone('');
    setDriverEmail('');
    setDriverPassword('Driver@2026');
    setDriverLicense('');
    setDriverActive(true);
    setErrorMsg(null);
    setDriverModalOpen(true);
  };

  const openEditDriverModal = (d: any) => {
    setEditingDriver(d);
    setDriverName(d.name);
    setDriverPhone(d.phone);
    setDriverEmail(d.email || '');
    setDriverPassword(''); // leave blank if keeping same
    setDriverLicense(d.licenseNo || '');
    setDriverActive(d.isActive);
    setErrorMsg(null);
    setDriverModalOpen(true);
  };

  const handleSaveDriver = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setErrorMsg(null);

    const cleanP = sanitizePhoneInput(driverPhone);
    if (!isValidPhone(cleanP)) {
      setErrorMsg('Please enter a valid 10-digit mobile number for the driver starting with 6-9 (e.g. 9876543211).');
      setSaving(false);
      return;
    }

    if (driverEmail && driverEmail.trim() !== '' && !isValidEmail(driverEmail.trim())) {
      setErrorMsg('Please enter a valid email format for driver (or leave it blank).');
      setSaving(false);
      return;
    }

    if (!editingDriver && (!driverPassword || driverPassword.length < 6)) {
      setErrorMsg('Driver password must be at least 6 characters long.');
      setSaving(false);
      return;
    }

    try {
      const method = editingDriver ? 'PATCH' : 'POST';
      const url = editingDriver
        ? `/api/admin/drivers/${editingDriver.id}`
        : '/api/admin/drivers';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: driverName.trim(),
          phone: cleanP,
          email: driverEmail ? driverEmail.trim() : null,
          password: driverPassword ? driverPassword : undefined,
          licenseNo: driverLicense ? driverLicense.trim() : null,
          isActive: driverActive,
        }),
      });

      const json = await res.json();
      if (!json.success) throw new Error(json.error || 'Failed to save driver account');

      setDriverModalOpen(false);
      fetchData();
    } catch (err: any) {
      setErrorMsg(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteDriver = async (id: string) => {
    if (!confirm('Are you sure you want to delete this driver account?')) return;
    try {
      await fetch(`/api/admin/drivers/${id}`, { method: 'DELETE' });
      fetchData();
    } catch {
      alert('Delete failed');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 sm:pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center space-x-2.5 sm:space-x-3">
            <h1 className="text-xl sm:text-3xl font-black text-white tracking-tight">
              Fleet & Driver Management
            </h1>
            <span className="px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-[10px] sm:text-[11px] font-black uppercase">
              Operations
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-300 mt-0.5 font-medium">
            Manage transport fleet vehicles, driver login credentials, and corridor dispatch assignments
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={openAddVehicleModal}
            className="px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-slate-950 font-black text-xs flex items-center space-x-1.5 shadow-md active:scale-95 transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Vehicle</span>
          </button>

          <button
            onClick={openAddDriverModal}
            className="px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-black text-xs flex items-center space-x-1.5 shadow-md active:scale-95 transition-all"
          >
            <Key className="w-3.5 h-3.5" />
            <span>Create Driver Login</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center space-x-2 border-b border-slate-800 pb-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab('VEHICLES')}
          className={`px-4 py-2 sm:px-5 sm:py-2.5 rounded-xl sm:rounded-2xl text-xs sm:text-sm font-black flex items-center space-x-1.5 sm:space-x-2 transition-all whitespace-nowrap flex-shrink-0 ${
            activeTab === 'VEHICLES'
              ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/80'
          }`}
        >
          <Truck className="w-4 h-4" />
          <span>Fleet Vehicles ({vehicles.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('DRIVERS')}
          className={`px-4 py-2 sm:px-5 sm:py-2.5 rounded-xl sm:rounded-2xl text-xs sm:text-sm font-black flex items-center space-x-1.5 sm:space-x-2 transition-all whitespace-nowrap flex-shrink-0 ${
            activeTab === 'DRIVERS'
              ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/80'
          }`}
        >
          <User className="w-4 h-4" />
          <span>Driver Logins ({drivers.length})</span>
        </button>

        <button
          onClick={fetchData}
          disabled={loading}
          className="ml-auto p-2 sm:p-2.5 rounded-xl bg-[#0d1424] hover:bg-slate-800 text-slate-300 border border-slate-700 flex-shrink-0"
          title="Refresh Data"
        >
          <RefreshCw className={`w-3.5 h-3.5 text-amber-400 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* TAB 1: FLEET VEHICLES */}
      {activeTab === 'VEHICLES' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {loading ? (
            <div className="py-16 text-slate-300 text-xs text-center col-span-full">
              <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-amber-400" />
              Loading fleet vehicles...
            </div>
          ) : vehicles.length === 0 ? (
            <div className="py-16 text-center text-slate-400 text-xs font-semibold col-span-full bg-[#0d1424] rounded-3xl border border-slate-800">
              No vehicles registered yet. Click &quot;Add Vehicle&quot; to register a truck or lorry.
            </div>
          ) : (
            vehicles.map((v) => (
              <div
                key={v.id}
                className="p-6 rounded-3xl bg-[#0d1424] border-2 border-slate-800 shadow-xl flex flex-col justify-between hover:border-amber-500/50 transition-all group"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-mono font-black text-amber-400 text-base">
                      {v.vehicleNumber}
                    </span>
                    <span
                      className={`text-[10px] font-black px-2.5 py-0.5 rounded-full ${
                        v.isActive
                          ? 'bg-emerald-950 text-emerald-300 border border-emerald-600'
                          : 'bg-rose-950 text-rose-300 border border-rose-600'
                      }`}
                    >
                      {v.isActive ? 'READY FOR DISPATCH' : 'OFF DUTY'}
                    </span>
                  </div>

                  <div className="text-sm font-black text-white mb-1">{v.vehicleType}</div>
                  <div className="text-xs text-slate-300 mb-4 font-semibold">
                    Capacity: <strong className="text-white">{v.capacity || 'Standard'}</strong>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-[#090d16] border border-slate-800 space-y-2 text-xs text-slate-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <User className="w-3.5 h-3.5 text-amber-400" />
                        <span>
                          Driver:{' '}
                          <strong className="text-white font-bold">
                            {v.driver?.name || v.driverName || 'Not Assigned'}
                          </strong>
                        </span>
                      </div>
                      {v.driver && (
                        <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/80 px-1.5 py-0.5 rounded border border-emerald-800">
                          Active Account
                        </span>
                      )}
                    </div>

                    {(v.driver?.phone || v.driverPhone) && (
                      <div className="flex items-center space-x-2">
                        <Phone className="w-3.5 h-3.5 text-emerald-400" />
                        <a
                          href={`tel:${v.driver?.phone || v.driverPhone}`}
                          className="text-emerald-400 hover:underline font-bold"
                        >
                          {v.driver?.phone || v.driverPhone}
                        </a>
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800 flex justify-end space-x-2">
                  <button
                    onClick={() => openEditVehicleModal(v)}
                    className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700"
                    title="Edit Vehicle"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteVehicle(v.id)}
                    className="p-2 rounded-xl bg-rose-950/60 hover:bg-rose-900 text-rose-400 border border-rose-800"
                    title="Delete Vehicle"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* TAB 2: DRIVER ACCOUNTS */}
      {activeTab === 'DRIVERS' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {loading ? (
            <div className="py-16 text-slate-300 text-xs text-center col-span-full">
              <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-emerald-400" />
              Loading driver accounts...
            </div>
          ) : drivers.length === 0 ? (
            <div className="py-16 text-center text-slate-400 text-xs font-semibold col-span-full bg-[#0d1424] rounded-3xl border border-slate-800">
              No driver accounts created yet. Click &quot;Create Driver Login&quot; to give drivers portal access.
            </div>
          ) : (
            drivers.map((d) => (
              <div
                key={d.id}
                className="p-6 rounded-3xl bg-[#0d1424] border-2 border-slate-800 shadow-xl flex flex-col justify-between hover:border-emerald-500/50 transition-all group"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-bold text-white text-base flex items-center space-x-2">
                      <User className="w-4 h-4 text-emerald-400" />
                      <span>{d.name}</span>
                    </span>
                    <span
                      className={`text-[10px] font-black px-2.5 py-0.5 rounded-full ${
                        d.isActive
                          ? 'bg-emerald-950 text-emerald-300 border border-emerald-600'
                          : 'bg-rose-950 text-rose-300 border border-rose-600'
                      }`}
                    >
                      {d.isActive ? 'LOGIN ACTIVE' : 'DISABLED'}
                    </span>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-[#090d16] border border-slate-800 space-y-2 text-xs text-slate-200 mb-3">
                    <div className="flex items-center space-x-2">
                      <Phone className="w-3.5 h-3.5 text-amber-400" />
                      <span>
                        Login ID / Phone: <strong className="text-white font-mono">{d.phone}</strong>
                      </span>
                    </div>

                    {d.licenseNo && (
                      <div className="flex items-center space-x-2">
                        <FileBadge className="w-3.5 h-3.5 text-blue-400" />
                        <span>License: <strong className="text-slate-100">{d.licenseNo}</strong></span>
                      </div>
                    )}

                    <div className="flex items-center space-x-2">
                      <Truck className="w-3.5 h-3.5 text-purple-400" />
                      <span>
                        Assigned Vehicle:{' '}
                        <strong className="text-amber-400 font-mono">
                          {d.vehicles && d.vehicles.length > 0
                            ? d.vehicles.map((v: any) => v.vehicleNumber).join(', ')
                            : 'None assigned'}
                        </strong>
                      </span>
                    </div>
                  </div>

                  <div className="text-[11px] text-slate-400 flex items-center justify-between">
                    <span>Assigned Bookings: <strong className="text-emerald-400">{d._count?.bookings || 0}</strong></span>
                    {d.lastLoginAt && (
                      <span className="text-[10px] text-slate-400">
                        Active: {new Date(d.lastLoginAt).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800 flex justify-end space-x-2">
                  <button
                    onClick={() => openEditDriverModal(d)}
                    className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 flex items-center space-x-1"
                    title="Edit Driver / Reset Password"
                  >
                    <Key className="w-3.5 h-3.5 text-amber-400" />
                    <span>Edit / Password</span>
                  </button>
                  <button
                    onClick={() => handleDeleteDriver(d.id)}
                    className="p-2 rounded-xl bg-rose-950/60 hover:bg-rose-900 text-rose-400 border border-rose-800"
                    title="Delete Driver"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* MODAL: ADD / EDIT VEHICLE */}
      {vehicleModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="bg-[#0d1424] border-2 border-slate-700 rounded-2xl sm:rounded-3xl max-w-md w-full p-4 sm:p-6 text-slate-100 shadow-2xl max-h-[92vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4 pb-2.5 border-b border-slate-800">
              <h3 className="font-black text-white text-base sm:text-lg">
                {editingVehicle ? 'Edit Fleet Vehicle' : 'Register New Fleet Vehicle'}
              </h3>
              <button onClick={() => setVehicleModalOpen(false)}>
                <X className="w-5 h-5 text-slate-400 hover:text-white" />
              </button>
            </div>

            {errorMsg && (
              <div className="mb-4 p-3 rounded-xl bg-rose-950/80 border border-rose-800 text-rose-200 text-xs">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleSaveVehicle} className="space-y-4">
              <div>
                <label className="block text-xs font-black text-white mb-1">
                  Vehicle Registration Number (e.g. TN 33 BK 8844) *
                </label>
                <input
                  type="text"
                  required
                  value={vehicleNumber}
                  onChange={(e) => setVehicleNumber(e.target.value.toUpperCase())}
                  placeholder="TN 33 BK 8844"
                  className="w-full px-3.5 py-2.5 bg-[#090d16] rounded-xl border border-slate-700 text-xs text-amber-400 font-mono font-bold outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-xs font-black text-white mb-1">Vehicle Type / Model *</label>
                <input
                  type="text"
                  required
                  value={vehicleType}
                  onChange={(e) => setVehicleType(e.target.value)}
                  placeholder="e.g. Eicher 17ft Closed Container, Tata 407, Ashok Leyland Dost"
                  className="w-full px-3.5 py-2.5 bg-[#090d16] rounded-xl border border-slate-700 text-xs text-white outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-xs font-black text-white mb-1">Load Capacity</label>
                <input
                  type="text"
                  value={capacity}
                  onChange={(e) => setCapacity(e.target.value)}
                  placeholder="e.g. 5 Ton, 2.5 Ton, 10 Ton"
                  className="w-full px-3.5 py-2.5 bg-[#090d16] rounded-xl border border-slate-700 text-xs text-white outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-xs font-black text-white mb-1">
                  Assigned Driver (Login Account)
                </label>
                <select
                  value={assignedDriverId}
                  onChange={(e) => setAssignedDriverId(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#090d16] rounded-xl border border-slate-700 text-xs text-white outline-none focus:border-amber-400"
                >
                  <option value="">-- No driver linked --</option>
                  {drivers.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name} ({d.phone})
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center space-x-2 pt-2">
                <input
                  type="checkbox"
                  id="vehActive"
                  checked={vehicleActive}
                  onChange={(e) => setVehicleActive(e.target.checked)}
                  className="rounded border-slate-700 bg-slate-950 text-amber-500"
                />
                <label htmlFor="vehActive" className="text-xs font-bold text-white">
                  Active (Ready for dispatch assignment)
                </label>
              </div>

              <button
                type="submit"
                disabled={saving}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-slate-950 font-black text-xs shadow-md mt-2"
              >
                {saving ? 'Saving...' : 'Save Fleet Vehicle'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADD / EDIT DRIVER */}
      {driverModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="bg-[#0d1424] border-2 border-slate-700 rounded-2xl sm:rounded-3xl max-w-md w-full p-4 sm:p-6 text-slate-100 shadow-2xl max-h-[92vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4 pb-2.5 border-b border-slate-800">
              <h3 className="font-black text-white text-base sm:text-lg">
                {editingDriver ? `Edit Driver: ${editingDriver.name}` : 'Create Driver Account & Login'}
              </h3>
              <button onClick={() => setDriverModalOpen(false)}>
                <X className="w-5 h-5 text-slate-400 hover:text-white" />
              </button>
            </div>

            {errorMsg && (
              <div className="mb-4 p-3 rounded-xl bg-rose-950/80 border border-rose-800 text-rose-200 text-xs">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleSaveDriver} className="space-y-4">
              <div>
                <label className="block text-xs font-black text-white mb-1">Driver Full Name *</label>
                <input
                  type="text"
                  required
                  value={driverName}
                  onChange={(e) => setDriverName(e.target.value)}
                  placeholder="e.g. Ramesh Kumar"
                  className="w-full px-3.5 py-2.5 bg-[#090d16] rounded-xl border border-slate-700 text-xs text-white outline-none focus:border-emerald-400 font-semibold"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-black text-white">
                    Driver Phone Number (Used as Login ID) *
                  </label>
                  <span className="text-[10px] font-mono text-slate-400 font-bold">
                    {driverPhone.length}/10 digits
                  </span>
                </div>
                <input
                  type="tel"
                  required
                  maxLength={10}
                  value={driverPhone}
                  onChange={(e) => setDriverPhone(sanitizePhoneInput(e.target.value))}
                  placeholder="e.g. 9876543211"
                  className="w-full px-3.5 py-2.5 bg-[#090d16] rounded-xl border border-slate-700 text-xs text-emerald-400 font-mono font-bold outline-none focus:border-emerald-400 tracking-wider"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-black text-white">
                    Driver Password {editingDriver && '(Leave empty to keep current)'} *
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowDriverPassword(!showDriverPassword)}
                    className="text-[11px] text-emerald-400 hover:text-emerald-300 font-bold flex items-center space-x-1"
                  >
                    {showDriverPassword ? (
                      <>
                        <EyeOff className="w-3 h-3" />
                        <span>Hide</span>
                      </>
                    ) : (
                      <>
                        <Eye className="w-3 h-3" />
                        <span>Show</span>
                      </>
                    )}
                  </button>
                </div>
                <div className="relative">
                  <input
                    type={showDriverPassword ? 'text' : 'password'}
                    required={!editingDriver}
                    value={driverPassword}
                    onChange={(e) => setDriverPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full pl-3.5 pr-10 py-2.5 bg-[#090d16] rounded-xl border border-slate-700 text-xs text-white outline-none focus:border-emerald-400 font-semibold"
                  />
                  <button
                    type="button"
                    onClick={() => setShowDriverPassword(!showDriverPassword)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-emerald-400 p-1 rounded-lg transition-colors"
                    title={showDriverPassword ? 'Hide password' : 'Show password'}
                  >
                    {showDriverPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-black text-white mb-1">Driving License Number</label>
                <input
                  type="text"
                  value={driverLicense}
                  onChange={(e) => setDriverLicense(e.target.value)}
                  placeholder="e.g. TN33-2018-0044122"
                  className="w-full px-3.5 py-2.5 bg-[#090d16] rounded-xl border border-slate-700 text-xs text-white outline-none focus:border-emerald-400"
                />
              </div>

              <div>
                <label className="block text-xs font-black text-white mb-1">Driver Email (Optional)</label>
                <input
                  type="email"
                  value={driverEmail}
                  onChange={(e) => setDriverEmail(e.target.value)}
                  placeholder="driver@example.com"
                  className="w-full px-3.5 py-2.5 bg-[#090d16] rounded-xl border border-slate-700 text-xs text-white outline-none focus:border-emerald-400"
                />
              </div>


              <div className="flex items-center space-x-2 pt-2">
                <input
                  type="checkbox"
                  id="driverActive"
                  checked={driverActive}
                  onChange={(e) => setDriverActive(e.target.checked)}
                  className="rounded border-slate-700 bg-slate-950 text-emerald-500"
                />
                <label htmlFor="driverActive" className="text-xs font-bold text-white">
                  Active (Driver can sign in to mobile portal)
                </label>
              </div>

              <button
                type="submit"
                disabled={saving}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-black text-xs shadow-md mt-2"
              >
                {saving ? 'Saving...' : 'Save Driver Login'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
