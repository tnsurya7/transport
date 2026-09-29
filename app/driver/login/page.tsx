'use client';

import React, { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Truck, Phone, Lock, ArrowRight, ArrowLeft, AlertCircle, RefreshCw, CheckCircle2, Eye, EyeOff } from 'lucide-react';
import { isValidPhone, sanitizePhoneInput } from '@/lib/validators';

function DriverLoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect') || '/driver/dashboard';

  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    const cleanedPhone = sanitizePhoneInput(phone);
    if (!isValidPhone(cleanedPhone)) {
      setErrorMsg('Please enter a valid 10-digit driver mobile number starting with 6-9 (e.g. 9876543211).');
      setLoading(false);
      return;
    }

    if (!password || password.trim().length === 0) {
      setErrorMsg('Password is required.');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/driver/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: cleanedPhone, password }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Login failed. Invalid phone or password.');
      }

      router.push(redirect);
      router.refresh();
    } catch (err: any) {
      setErrorMsg(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen bg-[#090d16] flex flex-col justify-center items-center px-4 sm:px-6 relative overflow-hidden selection:bg-emerald-500 selection:text-white"
      style={{ backgroundColor: '#090d16' }}
    >
      {/* Background Ambient Glow */}
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-emerald-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-amber-600/15 rounded-full blur-3xl pointer-events-none" />

      {/* Top Back to Public Website button */}
      <div className="absolute top-6 left-6 z-20">
        <button
          onClick={() => router.push('/')}
          className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-[#0d1424] hover:bg-[#15203a] text-slate-200 hover:text-white text-xs font-black border border-slate-700 shadow-md transition-all active:scale-95"
        >
          <ArrowLeft className="w-4 h-4 text-emerald-400" />
          <span>Back to Public Website</span>
        </button>
      </div>

      <div className="w-full max-w-md relative z-10 my-8">
        {/* Logo & Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-500 via-teal-500 to-amber-500 text-white flex items-center justify-center mx-auto mb-4 shadow-xl shadow-emerald-500/30">
            <Truck className="w-9 h-9 stroke-[2.2]" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Driver Delivery Portal
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-1.5 font-medium">
            Sabarisan Transport &bull; Live Trip Status & Location Checkpoints
          </p>
        </div>

        {/* Login Form Card */}
        <div className="bg-[#0d1424] border-2 border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl">
          {errorMsg && (
            <div className="mb-5 p-3.5 rounded-xl bg-rose-950/80 border border-rose-800 text-rose-200 text-xs sm:text-sm flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-400" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-black text-slate-200 uppercase tracking-wider flex items-center space-x-1.5">
                  <Phone className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Driver Registered Phone Number</span>
                </label>
                <span className="text-[11px] font-mono text-slate-400 font-bold">
                  {phone.length}/10 digits
                </span>
              </div>
              <input
                type="tel"
                required
                maxLength={10}
                value={phone}
                onChange={(e) => setPhone(sanitizePhoneInput(e.target.value))}
                placeholder="10-digit mobile number"
                className="w-full px-4 py-3.5 bg-[#090d16] rounded-xl border border-slate-700 text-white focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20 text-sm outline-none transition-all font-mono font-bold tracking-wider"
              />
            </div>

            <div>
              <label className="block text-xs font-black text-slate-200 uppercase tracking-wider mb-2 flex items-center justify-between">
                <div className="flex items-center space-x-1.5">
                  <Lock className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Password</span>
                </div>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-[11px] text-emerald-400 hover:text-emerald-300 font-bold flex items-center space-x-1 transition-colors"
                >
                  {showPassword ? (
                    <>
                      <EyeOff className="w-3.5 h-3.5" />
                      <span>Hide</span>
                    </>
                  ) : (
                    <>
                      <Eye className="w-3.5 h-3.5" />
                      <span>Show</span>
                    </>
                  )}
                </button>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your driver password"
                  className="w-full pl-4 pr-11 py-3.5 bg-[#090d16] rounded-xl border border-slate-700 text-white focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20 text-sm outline-none transition-all font-semibold"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-emerald-400 p-1 rounded-lg transition-colors"
                  title={showPassword ? 'Hide password' : 'Show password'}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 px-6 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 active:scale-[0.99] text-white font-black text-sm sm:text-base shadow-lg shadow-emerald-500/25 flex items-center justify-center space-x-2 transition-all disabled:opacity-75 tap-target"
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Signing in...</span>
                  </>
                ) : (
                  <>
                    <span>Sign In to Driver Portal</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>

          <div className="mt-6 pt-5 border-t border-slate-800 text-center">
            <button
              type="button"
              onClick={() => router.push('/')}
              className="text-xs text-amber-400 hover:underline font-bold flex items-center justify-center space-x-1 mx-auto"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Return to Customer Website</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function DriverLoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#090d16] flex items-center justify-center text-slate-400 text-xs">
          Loading Driver Portal...
        </div>
      }
    >
      <DriverLoginContent />
    </Suspense>
  );
}

