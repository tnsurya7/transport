'use client';

import React, { useState, useEffect } from 'react';
import { Settings, Save, CheckCircle, RefreshCw } from 'lucide-react';

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<Record<string, string>>({
    business_name: 'Erode Roadlines & Transport',
    business_address: 'Near Bus Stand, Bhavani Main Road, Erode, Tamil Nadu 638004',
    owner_email: 'owner@erodetransport.in',
    owner_phone: '+919876543210',
    owner_whatsapp: '919876543210',
    service_areas: 'Tamil Nadu, Karnataka, Kerala',
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/settings');
      const json = await res.json();
      if (json.success && json.data) {
        setSettings((prev) => ({ ...prev, ...json.data }));
      }
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMsg(null);
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });
      const json = await res.json();
      if (json.success) {
        setSuccessMsg('Business settings updated successfully.');
      }
    } catch {
      alert('Save failed');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-2xl space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
          Business & Operations Settings
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Manage business name, contact helpline, WhatsApp gateway number, and notification email
        </p>
      </div>

      {successMsg && (
        <div className="p-3.5 rounded-xl bg-emerald-950/80 border border-emerald-800 text-emerald-300 text-xs flex items-center space-x-2">
          <CheckCircle className="w-4 h-4 flex-shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSave} className="p-6 sm:p-8 rounded-3xl bg-[#0d1424] border-2 border-slate-800 shadow-2xl space-y-4 text-xs sm:text-sm">
        <div>
          <label className="block text-xs font-black text-white uppercase tracking-wider mb-1.5">
            Business Display Name
          </label>
          <input
            type="text"
            required
            value={settings.business_name}
            onChange={(e) => setSettings({ ...settings, business_name: e.target.value })}
            className="w-full px-3.5 py-2.5 bg-[#090d16] rounded-xl border border-slate-700 text-white outline-none focus:border-amber-400 font-semibold"
          />
        </div>

        <div>
          <label className="block text-xs font-black text-white uppercase tracking-wider mb-1.5">
            Operations Head Office Address
          </label>
          <input
            type="text"
            required
            value={settings.business_address}
            onChange={(e) => setSettings({ ...settings, business_address: e.target.value })}
            className="w-full px-3.5 py-2.5 bg-[#090d16] rounded-xl border border-slate-700 text-white outline-none focus:border-amber-400 font-semibold"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-black text-white uppercase tracking-wider mb-1.5">
              Owner Alert Email (English Only)
            </label>
            <input
              type="email"
              required
              value={settings.owner_email}
              onChange={(e) => setSettings({ ...settings, owner_email: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-[#090d16] rounded-xl border border-slate-700 text-white outline-none focus:border-amber-400 font-semibold"
            />
          </div>

          <div>
            <label className="block text-xs font-black text-white uppercase tracking-wider mb-1.5">
              Helpline Phone Number
            </label>
            <input
              type="text"
              required
              value={settings.owner_phone}
              onChange={(e) => setSettings({ ...settings, owner_phone: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-[#090d16] rounded-xl border border-slate-700 text-white outline-none focus:border-amber-400 font-semibold"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-black text-white uppercase tracking-wider mb-1.5">
            WhatsApp Contact Number (No spaces or + sign)
          </label>
          <input
            type="text"
            required
            value={settings.owner_whatsapp}
            onChange={(e) => setSettings({ ...settings, owner_whatsapp: e.target.value })}
            placeholder="e.g. 919876543210"
            className="w-full px-3.5 py-2.5 bg-[#090d16] rounded-xl border border-slate-700 text-white outline-none focus:border-amber-400 font-semibold"
          />
        </div>

        <div>
          <label className="block text-xs font-black text-white uppercase tracking-wider mb-1.5">
            Covered Service Areas
          </label>
          <input
            type="text"
            required
            value={settings.service_areas}
            onChange={(e) => setSettings({ ...settings, service_areas: e.target.value })}
            className="w-full px-3.5 py-2.5 bg-[#090d16] rounded-xl border border-slate-700 text-white outline-none focus:border-amber-400 font-semibold"
          />
        </div>

        <button
          type="submit"
          disabled={saving}
          className="py-3 px-6 rounded-xl bg-gradient-to-r from-amber-500 to-rose-500 hover:from-amber-600 hover:to-rose-600 text-white font-black text-xs shadow-md transition-all flex items-center space-x-1.5 mt-4"
        >
          {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          <span>{saving ? 'Saving...' : 'Save Business Settings'}</span>
        </button>
      </form>
    </div>
  );
}
