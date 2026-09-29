'use client';

import React, { useState, useEffect } from 'react';
import {
  Layers,
  Plus,
  Edit2,
  Trash2,
  CheckCircle,
  XCircle,
  RefreshCw,
  Truck,
  Home,
  Building2,
  DollarSign,
  X,
  AlertCircle,
} from 'lucide-react';

export default function AdminServicesPage() {
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Service Modal State
  const [serviceModalOpen, setServiceModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<any | null>(null);
  const [serviceName, setServiceName] = useState('');
  const [serviceDesc, setServiceDesc] = useState('');
  const [serviceIcon, setServiceIcon] = useState('Truck');
  const [servicePricingType, setServicePricingType] = useState('PER_KM');
  const [serviceIsActive, setServiceIsActive] = useState(true);

  // Pricing Rule Modal State
  const [ruleModalOpen, setRuleModalOpen] = useState(false);
  const [activeServiceForRule, setActiveServiceForRule] = useState<any | null>(null);
  const [editingRule, setEditingRule] = useState<any | null>(null);
  const [ruleName, setRuleName] = useState('');
  const [ruleMinLoad, setRuleMinLoad] = useState('');
  const [ruleMaxLoad, setRuleMaxLoad] = useState('');
  const [ruleRate, setRuleRate] = useState('');
  const [ruleMinDist, setRuleMinDist] = useState('0');
  const [ruleMinCharge, setRuleMinCharge] = useState('0');

  const [saving, setSaving] = useState(false);

  const fetchServices = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/services');
      const json = await res.json();
      if (json.success) setServices(json.data);
    } catch (err) {
      console.error('Failed to fetch services:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const openAddServiceModal = () => {
    setEditingService(null);
    setServiceName('');
    setServiceDesc('');
    setServiceIcon('Truck');
    setServicePricingType('PER_KM');
    setServiceIsActive(true);
    setServiceModalOpen(true);
  };

  const openEditServiceModal = (s: any) => {
    setEditingService(s);
    setServiceName(s.name);
    setServiceDesc(s.description);
    setServiceIcon(s.icon || 'Truck');
    setServicePricingType(s.pricingType || 'PER_KM');
    setServiceIsActive(s.isActive);
    setServiceModalOpen(true);
  };

  const handleSaveService = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const method = editingService ? 'PATCH' : 'POST';
      const url = editingService
        ? `/api/admin/services/${editingService.id}`
        : '/api/admin/services';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: serviceName,
          description: serviceDesc,
          icon: serviceIcon,
          pricingType: servicePricingType,
          isActive: serviceIsActive,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setServiceModalOpen(false);
        fetchServices();
      }
    } catch (err: any) {
      alert(err.message || 'Failed to save service');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteService = async (id: string) => {
    if (!confirm('Are you sure you want to delete this service?')) return;
    try {
      await fetch(`/api/admin/services/${id}`, { method: 'DELETE' });
      fetchServices();
    } catch (err: any) {
      alert('Delete failed');
    }
  };

  const openAddRuleModal = (srv: any) => {
    setActiveServiceForRule(srv);
    setEditingRule(null);
    setRuleName('');
    setRuleMinLoad('');
    setRuleMaxLoad('');
    setRuleRate('40');
    setRuleMinDist('20');
    setRuleMinCharge('800');
    setRuleModalOpen(true);
  };

  const openEditRuleModal = (srv: any, rule: any) => {
    setActiveServiceForRule(srv);
    setEditingRule(rule);
    setRuleName(rule.name);
    setRuleMinLoad(rule.minLoad !== null ? String(rule.minLoad) : '');
    setRuleMaxLoad(rule.maxLoad !== null ? String(rule.maxLoad) : '');
    setRuleRate(String(rule.ratePerKm));
    setRuleMinDist(String(rule.minDistanceKm || 0));
    setRuleMinCharge(String(rule.minCharge || 0));
    setRuleModalOpen(true);
  };

  const handleSaveRule = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeServiceForRule) return;
    setSaving(true);
    try {
      const method = editingRule ? 'PATCH' : 'POST';
      const url = editingRule
        ? `/api/admin/pricing-rules/${editingRule.id}`
        : '/api/admin/pricing-rules';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          serviceId: activeServiceForRule.id,
          name: ruleName,
          minLoad: ruleMinLoad ? parseFloat(ruleMinLoad) : null,
          maxLoad: ruleMaxLoad ? parseFloat(ruleMaxLoad) : null,
          ratePerKm: parseFloat(ruleRate),
          minDistanceKm: parseFloat(ruleMinDist) || 0,
          minCharge: parseFloat(ruleMinCharge) || 0,
          isActive: true,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setRuleModalOpen(false);
        fetchServices();
      }
    } catch (err: any) {
      alert(err.message || 'Failed to save pricing rule');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteRule = async (id: string) => {
    if (!confirm('Are you sure you want to delete this pricing rule?')) return;
    try {
      await fetch(`/api/admin/pricing-rules/${id}`, { method: 'DELETE' });
      fetchServices();
    } catch {
      alert('Delete failed');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Services & Dynamic Pricing Management
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Configure services, rate per KM, load tiers, minimum distances, and charges without writing code
          </p>
        </div>

        <button
          onClick={openAddServiceModal}
          className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-rose-500 hover:from-amber-600 hover:to-rose-600 text-white font-black text-xs transition-colors w-fit shadow-md"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Service</span>
        </button>
      </div>

      {/* Services List */}
      <div className="space-y-6">
        {loading ? (
          <div className="py-16 text-center text-slate-300 text-xs">
            <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-amber-400" />
            Loading services and pricing rules...
          </div>
        ) : (
          services.map((srv) => (
            <div key={srv.id} className="p-6 rounded-3xl bg-[#0d1424] border-2 border-slate-800 shadow-xl">
              {/* Service Header Row */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-5 border-b border-slate-800 gap-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-[#090d16] border border-slate-700 flex items-center justify-center text-amber-400 shadow-inner">
                    <Truck className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h3 className="text-lg font-black text-white">{srv.name}</h3>
                      <span
                        className={`text-[10px] font-black px-2.5 py-0.5 rounded-full ${
                          srv.isActive ? 'bg-emerald-950 text-emerald-300 border border-emerald-600' : 'bg-rose-950 text-rose-300 border border-rose-600'
                        }`}
                      >
                        {srv.isActive ? 'ACTIVE' : 'INACTIVE'}
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 mt-0.5 font-medium">{srv.description}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => openAddRuleModal(srv)}
                    className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-400 text-xs font-black border border-slate-700 flex items-center space-x-1 transition-all"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Pricing Rule</span>
                  </button>

                  <button
                    onClick={() => openEditServiceModal(srv)}
                    className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700"
                    title="Edit Service"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => handleDeleteService(srv.id)}
                    className="p-2 rounded-xl bg-rose-950/60 hover:bg-rose-900 text-rose-400 border border-rose-800"
                    title="Delete Service"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Pricing Rules for this service */}
              <div className="mt-4">
                <div className="text-[11px] font-black uppercase tracking-wider text-amber-400 mb-3">
                  Active Pricing Rules for {srv.name}
                </div>

                {!srv.pricingRules || srv.pricingRules.length === 0 ? (
                  <div className="p-4 rounded-xl bg-[#090d16] text-xs text-slate-400 text-center font-medium">
                    No pricing rules configured for this service yet.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {srv.pricingRules.map((r: any) => (
                      <div
                        key={r.id}
                        className="p-4 rounded-2xl bg-[#090d16] border border-slate-800 flex flex-col justify-between hover:border-slate-700 transition-all"
                      >
                        <div>
                          <div className="flex justify-between items-start mb-2">
                            <span className="font-bold text-white text-xs sm:text-sm">{r.name}</span>
                            <span className="text-sm font-black text-amber-400">
                              ₹{r.ratePerKm}/km
                            </span>
                          </div>

                          <div className="text-[11px] text-slate-300 space-y-1">
                            {r.minLoad !== null && r.maxLoad !== null && (
                              <div>
                                Capacity: <strong className="text-white">{r.minLoad}–{r.maxLoad} {r.loadUnit || 'Ton'}</strong>
                              </div>
                            )}
                            <div>Min Distance: <strong className="text-white">{r.minDistanceKm || 0} KM</strong></div>
                            <div>Min Charge: <strong className="text-emerald-400">₹{r.minCharge || 0}</strong></div>
                          </div>
                        </div>

                        <div className="mt-4 pt-3 border-t border-slate-800 flex justify-end space-x-3">
                          <button
                            onClick={() => openEditRuleModal(srv, r)}
                            className="text-[11px] font-bold text-slate-300 hover:text-white"
                          >
                            Edit Rule
                          </button>
                          <button
                            onClick={() => handleDeleteRule(r.id)}
                            className="text-[11px] font-bold text-rose-400 hover:text-rose-300"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Service Modal */}
      {serviceModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="bg-[#0d1424] border-2 border-slate-700 rounded-3xl max-w-md w-full p-6 text-slate-100 shadow-2xl">
            <div className="flex justify-between items-center mb-5 pb-3 border-b border-slate-800">
              <h3 className="font-black text-white text-lg">
                {editingService ? 'Edit Transport Service' : 'Add New Transport Service'}
              </h3>
              <button onClick={() => setServiceModalOpen(false)}>
                <X className="w-5 h-5 text-slate-400 hover:text-white" />
              </button>
            </div>

            <form onSubmit={handleSaveService} className="space-y-4">
              <div>
                <label className="block text-xs font-black text-white mb-1">Service Name</label>
                <input
                  type="text"
                  required
                  value={serviceName}
                  onChange={(e) => setServiceName(e.target.value)}
                  placeholder="e.g. Vehicle Transport"
                  className="w-full px-3.5 py-2.5 bg-[#090d16] rounded-xl border border-slate-700 text-xs text-white outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-xs font-black text-white mb-1">Description</label>
                <textarea
                  rows={3}
                  required
                  value={serviceDesc}
                  onChange={(e) => setServiceDesc(e.target.value)}
                  placeholder="Brief description of service offerings..."
                  className="w-full px-3.5 py-2.5 bg-[#090d16] rounded-xl border border-slate-700 text-xs text-white outline-none focus:border-amber-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-black text-white mb-1">Icon Style</label>
                  <select
                    value={serviceIcon}
                    onChange={(e) => setServiceIcon(e.target.value)}
                    className="w-full px-3 py-2 bg-[#090d16] rounded-xl border border-slate-700 text-xs text-white outline-none focus:border-amber-400"
                  >
                    <option value="Truck">Truck (Cargo)</option>
                    <option value="Home">Home (Household)</option>
                    <option value="Building2">Building (Office)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-black text-white mb-1">Pricing Model</label>
                  <select
                    value={servicePricingType}
                    onChange={(e) => setServicePricingType(e.target.value)}
                    className="w-full px-3 py-2 bg-[#090d16] rounded-xl border border-slate-700 text-xs text-white outline-none focus:border-amber-400"
                  >
                    <option value="PER_KM">Per KM</option>
                    <option value="LOAD_BASED">Load Capacity Based</option>
                    <option value="FLAT">Flat Rate</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center space-x-2 pt-2">
                <input
                  type="checkbox"
                  id="srvActive"
                  checked={serviceIsActive}
                  onChange={(e) => setServiceIsActive(e.target.checked)}
                  className="rounded border-slate-700 bg-slate-950 text-rose-500"
                />
                <label htmlFor="srvActive" className="text-xs font-bold text-white">
                  Active (Visible on booking website)
                </label>
              </div>

              <button
                type="submit"
                disabled={saving}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-rose-500 hover:from-amber-600 hover:to-rose-600 text-white font-black text-xs shadow-md mt-2"
              >
                {saving ? 'Saving...' : 'Save Service'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Pricing Rule Modal */}
      {ruleModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="bg-[#0d1424] border-2 border-slate-700 rounded-3xl max-w-md w-full p-6 text-slate-100 shadow-2xl">
            <div className="flex justify-between items-center mb-5 pb-3 border-b border-slate-800">
              <h3 className="font-black text-white text-lg">
                {editingRule ? 'Edit Pricing Rule' : `Add Rule to ${activeServiceForRule?.name}`}
              </h3>
              <button onClick={() => setRuleModalOpen(false)}>
                <X className="w-5 h-5 text-slate-400 hover:text-white" />
              </button>
            </div>

            <form onSubmit={handleSaveRule} className="space-y-4">
              <div>
                <label className="block text-xs font-black text-white mb-1">Rule Name</label>
                <input
                  type="text"
                  required
                  value={ruleName}
                  onChange={(e) => setRuleName(e.target.value)}
                  placeholder="e.g. 5–10 Ton or Standard Rate"
                  className="w-full px-3.5 py-2.5 bg-[#090d16] rounded-xl border border-slate-700 text-xs text-white outline-none focus:border-amber-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-black text-white mb-1">Min Load (Ton)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={ruleMinLoad}
                    onChange={(e) => setRuleMinLoad(e.target.value)}
                    placeholder="Optional"
                    className="w-full px-3.5 py-2.5 bg-[#090d16] rounded-xl border border-slate-700 text-xs text-white outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black text-white mb-1">Max Load (Ton)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={ruleMaxLoad}
                    onChange={(e) => setRuleMaxLoad(e.target.value)}
                    placeholder="Optional"
                    className="w-full px-3.5 py-2.5 bg-[#090d16] rounded-xl border border-slate-700 text-xs text-white outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-black text-white mb-1">Rate / KM (₹) *</label>
                  <input
                    type="number"
                    step="0.5"
                    required
                    value={ruleRate}
                    onChange={(e) => setRuleRate(e.target.value)}
                    placeholder="40"
                    className="w-full px-3.5 py-2.5 bg-[#090d16] rounded-xl border border-slate-700 text-xs text-amber-400 font-black outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black text-white mb-1">Min KM</label>
                  <input
                    type="number"
                    value={ruleMinDist}
                    onChange={(e) => setRuleMinDist(e.target.value)}
                    placeholder="20"
                    className="w-full px-3.5 py-2.5 bg-[#090d16] rounded-xl border border-slate-700 text-xs text-white outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black text-white mb-1">Min Charge (₹)</label>
                  <input
                    type="number"
                    value={ruleMinCharge}
                    onChange={(e) => setRuleMinCharge(e.target.value)}
                    placeholder="800"
                    className="w-full px-3.5 py-2.5 bg-[#090d16] rounded-xl border border-slate-700 text-xs text-white outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={saving}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-rose-500 hover:from-amber-600 hover:to-rose-600 text-white font-black text-xs shadow-md mt-2"
              >
                {saving ? 'Saving...' : 'Save Pricing Rule'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
