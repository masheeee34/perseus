'use client';

import React from 'react';

export default function BoutiqueSkeleton() {
  return (
    <div className="min-h-screen bg-black text-white pt-36 pb-24 animate-pulse">
      <div className="max-w-[1700px] mx-auto px-6 lg:px-12 xl:px-20">
        
        {/* Header Skeleton */}
        <header className="mb-20">
          <div className="h-2 w-32 bg-white/5 mb-6" />
          <div className="h-16 w-full max-w-lg bg-white/5 mb-6" />
          <div className="h-3 w-64 bg-white/5" />
        </header>

        <div className="flex flex-col lg:flex-row gap-20">
          {/* Sidebar Skeleton */}
          <aside className="hidden lg:block w-60 space-y-12">
            <div className="space-y-4">
              <div className="h-2 w-20 bg-white/5 mb-6" />
              {[1, 2, 3, 4, 5].map(i => (
                <div key={i} className="h-4 w-full bg-white/5" />
              ))}
            </div>
            <div className="space-y-4 pt-10">
              <div className="h-2 w-20 bg-white/5 mb-6" />
              {[1, 2, 3].map(i => (
                <div key={i} className="h-4 w-full bg-white/5" />
              ))}
            </div>
          </aside>

          {/* Grid Skeleton */}
          <div className="flex-1 grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5">
            {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
              <div key={i} className="space-y-6">
                <div className="aspect-square bg-white/[0.02] border border-white/5" />
                <div className="space-y-3 px-2">
                  <div className="h-2 w-12 bg-gold/10" />
                  <div className="h-4 w-full bg-white/5" />
                  <div className="h-3 w-16 bg-white/5" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
