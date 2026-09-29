'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  CalendarCheck,
  Truck,
  Layers,
  Settings,
  LogOut,
  ExternalLink,
  Menu,
  X,
  ShieldCheck,
} from 'lucide-react';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [adminUser, setAdminUser] = useState<any>(null);

  useEffect(() => {
    async function checkAuth() {
      if (pathname === '/admin/login') return;
      try {
        const res = await fetch('/api/admin/me');
        const data = await res.json();
        if (data.success && data.admin) {
          setAdminUser(data.admin);
        }
      } catch {
        // ignore
      }
    }
    checkAuth();
  }, [pathname]);

  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  const handleLogout = async () => {
    await fetch('/api/admin/auth/logout', { method: 'POST' });
    router.push('/admin/login');
    router.refresh();
  };

  const navItems = [
    { label: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
    { label: 'Bookings', href: '/admin/bookings', icon: CalendarCheck },
    { label: 'Services & Pricing', href: '/admin/services', icon: Layers },
    { label: 'Vehicles', href: '/admin/vehicles', icon: Truck },
    { label: 'Settings', href: '/admin/settings', icon: Settings },
  ];

  return (
    <div
      className="min-h-screen w-full bg-[#090d16] text-slate-100 flex relative selection:bg-rose-500 selection:text-white"
      style={{ backgroundColor: '#090d16', color: '#f8fafc' }}
    >
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 bg-[#0d1424] border-r border-slate-800 p-5 justify-between flex-shrink-0">
        <div>
          {/* Logo */}
          <div className="flex items-center space-x-3 pb-6 border-b border-slate-800 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 via-rose-500 to-indigo-600 text-white flex items-center justify-center font-bold shadow-lg shadow-rose-500/25">
              <Truck className="w-6 h-6 stroke-[2.2]" />
            </div>
            <div>
              <div className="font-black text-sm text-white tracking-tight">SABARISAN TRANSPORT</div>
              <div className="text-[10px] text-amber-400 font-extrabold uppercase tracking-wider">Admin Control Portal</div>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href || (pathname.startsWith(item.href + '/') && item.href !== '/admin/dashboard');
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-rose-600 to-indigo-600 text-white shadow-lg shadow-rose-600/30 font-extrabold'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
                  }`}
                >
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom Section */}
        <div className="pt-6 border-t border-slate-800 space-y-2">
          <Link
            href="/"
            target="_blank"
            className="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs text-slate-300 hover:text-white hover:bg-slate-800 transition-colors font-semibold"
          >
            <span className="flex items-center space-x-2">
              <ExternalLink className="w-3.5 h-3.5 text-amber-400" />
              <span>View Public Website</span>
            </span>
          </Link>

          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-2.5 px-3.5 py-2.5 rounded-xl text-xs text-rose-400 hover:text-white hover:bg-rose-600/20 border border-rose-500/20 transition-colors font-bold"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 bg-[#090d16]" style={{ backgroundColor: '#090d16' }}>
        {/* Top Navbar */}
        <header className="h-16 bg-[#0d1424] border-b border-slate-800 px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30 shadow-md">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800"
            >
              {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs font-black text-amber-400 uppercase tracking-wider hidden sm:inline">
                Sabarisan Transport Operations Hub &bull; Erode Yard
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="text-right">
              <div className="text-xs font-bold text-white">{adminUser?.name || 'Operations Manager'}</div>
              <div className="text-[10px] text-amber-400 font-black">{adminUser?.role || 'SUPER_ADMIN'}</div>
            </div>
            <div className="w-9 h-9 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-xs font-bold text-amber-400 shadow-inner">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
        </header>

        {/* Mobile Navigation Drawer */}
        {sidebarOpen && (
          <div className="lg:hidden bg-[#0d1424] border-b border-slate-800 p-4 space-y-1.5 z-40 animate-in slide-in-from-top-2 duration-150">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-bold ${
                    isActive ? 'bg-rose-600 text-white font-extrabold' : 'text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
            <button
              onClick={handleLogout}
              className="w-full flex items-center space-x-2 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-rose-400 hover:bg-rose-950/40"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </div>
        )}

        {/* Content View */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto bg-[#090d16]" style={{ backgroundColor: '#090d16' }}>
          {children}
        </main>
      </div>
    </div>
  );
}
