'use client';

import React from 'react';
import Link from 'next/link';

export default function GlobalRootError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[#090d16] text-slate-100 flex flex-col justify-center items-center p-6 font-sans">
        <div className="max-w-md w-full bg-[#0d1424] border border-slate-800 rounded-3xl p-8 text-center space-y-5 shadow-2xl">
          <div className="w-14 h-14 rounded-2xl bg-rose-500/20 text-rose-400 border border-rose-500/40 flex items-center justify-center mx-auto">
            ⚠️
          </div>
          <h2 className="text-xl font-black text-white">Application Error Occurred</h2>
          <p className="text-xs text-slate-300">
            A critical error interrupted page rendering. Please retry or navigate to the main dashboard.
          </p>
          <div className="flex gap-3 justify-center pt-2">
            <button
              onClick={() => reset()}
              className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs"
            >
              Reload Page
            </button>
            <a
              href="/"
              className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs"
            >
              Go to Home
            </a>
          </div>
        </div>
      </body>
    </html>
  );
}
