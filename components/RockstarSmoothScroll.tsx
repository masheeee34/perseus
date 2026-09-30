'use client';

import React, { useEffect, useRef } from 'react';

/**
 * Rockstar Games VI-style Inertia Smooth Scroll
 * Emulates Lenis / GSAP ScrollSmoother momentum scrolling
 */
export default function RockstarSmoothScroll({ children }: { children: React.ReactNode }) {
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Only apply on fine-pointer devices (desktop) for 60-120 FPS performance
    if (!window.matchMedia('(pointer: fine)').matches) return;

    let currentY = window.scrollY;
    let targetY = window.scrollY;
    let isRunning = false;
    const ease = 0.085; // Rockstar-style silky inertia damping

    const onWheel = (e: WheelEvent) => {
      // Prevent double scroll if inside an open modal or iframe
      if ((e.target as HTMLElement)?.closest('.no-smooth-scroll')) return;
    };

    const updateScroll = () => {
      targetY = window.scrollY;
      currentY += (targetY - currentY) * ease;

      if (Math.abs(targetY - currentY) > 0.5) {
        requestAnimationFrame(updateScroll);
        isRunning = true;
      } else {
        isRunning = false;
      }
    };

    const onScroll = () => {
      if (!isRunning) {
        isRunning = true;
        requestAnimationFrame(updateScroll);
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('wheel', onWheel, { passive: true });

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('wheel', onWheel);
    };
  }, []);

  return (
    <div ref={contentRef} className="w-full relative">
      {children}
    </div>
  );
}
