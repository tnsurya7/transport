'use client';

import React, { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Truck, ShieldCheck, Lock, Mail, ArrowRight, ArrowLeft, AlertCircle, RefreshCw, Eye, EyeOff } from 'lucide-react';
import { isValidEmail } from '@/lib/validators';

function AdminLoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect') || '/admin/dashboard';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    if (!isValidEmail(email)) {
      setErrorMsg('Please enter a valid email address.');
      setLoading(false);
      return;
    }

    if (!password || password.trim().length === 0) {
      setErrorMsg('Password is required.');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/admin/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), password }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Login failed. Invalid credentials.');
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
    <div className="min-h-screen bg-[#090d16] flex flex-col justify-center items-center px-4 sm:px-6 relative overflow-hidden selection:bg-rose-500 selection:text-white" style={{ backgroundColor: '#090d16' }}>
      {/* Background Ambient Glow */}
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-rose-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none" />

      {/* Top Back to Public Website button */}
      <div className="absolute top-6 left-6 z-20">
        <button
          onClick={() => router.push('/')}
          className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-[#0d1424] hover:bg-[#15203a] text-slate-200 hover:text-white text-xs font-black border border-slate-700 shadow-md transition-all active:scale-95"
        >
          <ArrowLeft className="w-4 h-4 text-amber-400" />
          <span>Back to Public Website</span>
        </button>
      </div>

      <div className="w-full max-w-md relative z-10 my-8">
        {/* Logo & Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-500 via-rose-500 to-indigo-600 text-white flex items-center justify-center mx-auto mb-4 shadow-xl shadow-rose-500/30">
            <Truck className="w-9 h-9 stroke-[2.2]" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Sabarisan Transport Admin
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-1.5 font-medium">
            Operations & Booking Control Center &bull; Erode Hub
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
              <label className="block text-xs font-black text-slate-200 uppercase tracking-wider mb-2 flex items-center space-x-1.5">
                <Mail className="w-3.5 h-3.5 text-amber-400" />
                <span>Admin Email Address</span>
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@example.com"
                className="w-full px-4 py-3.5 bg-[#090d16] rounded-xl border border-slate-700 text-white focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 text-sm outline-none transition-all font-semibold"
              />

            </div>

            <div>
              <label className="block text-xs font-black text-slate-200 uppercase tracking-wider mb-2 flex items-center justify-between">
                <div className="flex items-center space-x-1.5">
                  <Lock className="w-3.5 h-3.5 text-amber-400" />
                  <span>Password</span>
                </div>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-[11px] text-amber-400 hover:text-amber-300 font-bold flex items-center space-x-1 transition-colors"
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
                  placeholder="Enter your admin password"
                  className="w-full pl-4 pr-11 py-3.5 bg-[#090d16] rounded-xl border border-slate-700 text-white focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 text-sm outline-none transition-all font-semibold"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-amber-400 p-1 rounded-lg transition-colors"
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
                className="w-full py-4 px-6 rounded-xl bg-emerald-500 hover:bg-emerald-600 active:scale-[0.99] text-slate-950 font-black text-sm sm:text-base shadow-lg shadow-emerald-500/25 flex items-center justify-center space-x-2 transition-all disabled:opacity-75 tap-target"
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Authenticating...</span>
                  </>
                ) : (
                  <>
                    <span>Sign In to Admin Portal</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>

          <div className="mt-6 pt-5 border-t border-slate-800 text-center flex flex-col items-center gap-3">
            <button
              type="button"
              onClick={() => router.push('/')}
              className="text-xs text-amber-400 hover:underline font-bold flex items-center space-x-1"
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

export default function AdminLoginPage() {
  return (
    <React.Suspense fallback={<div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-500 text-xs">Loading admin portal...</div>}>
      <AdminLoginContent />
    </React.Suspense>
  );
}

