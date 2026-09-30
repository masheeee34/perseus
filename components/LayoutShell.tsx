'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import Header from './Header';
import Footer from './Footer';

export default function LayoutShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isMaintenance = pathname === '/maintenance';
  const isHome = pathname === '/';
  const isApp = pathname?.startsWith('/app') || pathname?.startsWith('/mobile');

  // App in-game (CEF GTA:World) ou Maintenance : ecran brut sans Header/Footer desktop lourd
  if (isMaintenance || isApp) {
    return <>{children}</>;
  }

  // Home: handles its own Header and Showcase seamlessly
  if (isHome) {
    return <>{children}</>;
  }

  // All other pages: standard luxury layout
  return (
    <>
      <Header />
      <main className="min-h-screen">
        {children}
      </main>
      <Footer />
    </>
  );
}
