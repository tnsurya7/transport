'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Truck, LogOut, User, ShieldCheck, MapPin, Phone } from 'lucide-react';

export default function DriverLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [driverUser, setDriverUser] = useState<any>(null);

  useEffect(() => {
    async function checkAuth() {
      if (pathname === '/driver/login') return;
      try {
        const res = await fetch('/api/driver/me');
        const data = await res.json();
        if (data.success && data.driver) {
          setDriverUser(data.driver);
        }
      } catch {
        // ignore
      }
    }
    checkAuth();
  }, [pathname]);

  if (pathname === '/driver/login') {
    return <>{children}</>;
  }

  const handleLogout = async () => {
    await fetch('/api/driver/auth/logout', { method: 'POST' });
    router.push('/driver/login');
    router.refresh();
  };

  return (
    <div
      className="min-h-screen w-full bg-[#090d16] text-slate-100 flex flex-col relative selection:bg-emerald-500 selection:text-white"
      style={{ backgroundColor: '#090d16', color: '#f8fafc' }}
    >
      {/* Top Header */}
      <header className="bg-[#0d1424] border-b border-slate-800 px-4 sm:px-6 py-3.5 sticky top-0 z-30 shadow-md">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-600 text-white flex items-center justify-center font-bold shadow-md shadow-emerald-500/20">
              <Truck className="w-6 h-6 stroke-[2.2]" />
            </div>
            <div>
              <div className="font-black text-sm text-white tracking-tight">
                SABARISAN TRANSPORT
              </div>
              <div className="text-[10px] text-emerald-400 font-extrabold uppercase tracking-wider flex items-center space-x-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>Driver Delivery Portal</span>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <div className="text-right hidden sm:block">
              <div className="text-xs font-bold text-white">{driverUser?.name || 'Driver'}</div>
              <div className="text-[10px] font-mono text-amber-400 font-bold">{driverUser?.phone}</div>
            </div>

            <button
              onClick={handleLogout}
              className="flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-rose-950/60 hover:text-rose-300 text-slate-300 text-xs font-bold border border-slate-700 transition-colors"
              title="Sign Out"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Driver Content */}
      <main className="flex-1 p-4 sm:p-6 max-w-5xl w-full mx-auto">
        {children}
      </main>
    </div>
  );
}
