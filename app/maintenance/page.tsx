'use client';

import React from 'react';

export default function MaintenancePage() {
  return (
    <div className="fixed inset-0 z-[999999] bg-[#000000] text-[#FFFFFF] flex flex-col items-center justify-center p-6 select-none overflow-hidden font-sans">
      <div className="max-w-4xl mx-auto text-center px-4">
        {/* Brand Name */}
        <h1 className="font-serif text-5xl md:text-8xl tracking-[0.25em] uppercase text-white font-normal mb-8 leading-none">
          PERSEUS
        </h1>

        {/* Separator */}
        <div className="w-16 h-[1px] bg-white/30 mx-auto mb-10" />

        {/* The Exact Message Requested */}
        <p className="font-serif italic text-2xl md:text-4xl text-white mb-8 leading-relaxed max-w-3xl mx-auto font-light">
          « On modifie le site actuellement, on doit enculer la concurrence. »
        </p>

        {/* Subtitle */}
        <p className="text-[11px] md:text-xs text-white/50 tracking-[0.35em] uppercase">
          RÉOUVERTURE IMMINENTE
        </p>
      </div>
    </div>
  );
}
