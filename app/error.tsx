'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { AlertCircle, RefreshCw, Home, ArrowLeft } from 'lucide-react';

export default function GlobalErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Unhandled Application Error:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 flex flex-col justify-center items-center px-4 sm:px-6 relative overflow-hidden selection:bg-rose-500 selection:text-white">
      {/* Background Ambient Glow */}
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-rose-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-amber-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-lg bg-[#0d1424] border-2 border-slate-800 rounded-3xl p-8 sm:p-10 shadow-2xl relative z-10 text-center space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-rose-500/20 text-rose-400 border border-rose-500/40 flex items-center justify-center mx-auto shadow-lg shadow-rose-500/20">
          <AlertCircle className="w-9 h-9 stroke-[2.2]" />
        </div>

        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Something Went Wrong
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-2 font-medium">
            We encountered an unexpected issue while loading this page. Our technical team has been notified.
          </p>
          {error?.message && !error.message.includes('invocation') && (
            <div className="mt-4 p-3 rounded-xl bg-[#090d16] border border-slate-800 text-xs text-rose-300 font-mono text-left overflow-x-auto">
              {error.message}
            </div>
          )}
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            onClick={() => reset()}
            className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-rose-500 hover:from-amber-600 hover:to-rose-600 text-white font-black text-xs sm:text-sm shadow-lg shadow-rose-500/20 flex items-center justify-center space-x-2 transition-all active:scale-95"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Try Again</span>
          </button>

          <Link
            href="/"
            className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs sm:text-sm font-black border border-slate-700 flex items-center justify-center space-x-2 transition-all"
          >
            <Home className="w-4 h-4" />
            <span>Return to Home</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
