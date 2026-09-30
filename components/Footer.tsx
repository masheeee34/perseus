'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Footer() {
  const pathname = usePathname();

  if (pathname?.startsWith('/admin') || pathname === '/app' || pathname === '/mobile') {
    return null;
  }
  return (
    <footer className="bg-canvas border-t-[0.5px] border-ink/10 py-28 lg:py-36 px-6 sm:px-12">
      <div className="max-w-[1500px] mx-auto">
        {/* Top Minimal Divider */}
        <div className="w-16 h-[0.5px] bg-ink/20 mx-auto mb-20" />

        {/* 4 Column Editorial Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-16">
          
          {/* Column 1: La Maison */}
          <div className="space-y-4">
            <Link
              href="/"
              className="font-serif text-2xl uppercase tracking-[0.35em] text-ink inline-block font-normal hover:opacity-75 transition-opacity"
            >
              PERSEUS
            </Link>
            <p className="font-mont text-ink-muted text-[10px] uppercase tracking-[0.3em] leading-relaxed font-light">
              Maison de Haute Joaillerie & Horlogerie <br />
              Portola Drive, Los Santos
            </p>
          </div>

          {/* Column 2: Collections */}
          <div className="space-y-4">
            <h4 className="font-mont uppercase text-[10px] font-medium tracking-[0.3em] text-ink">
              Collections
            </h4>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/boutique?category=bagues"
                  className="font-mont text-[11px] text-ink-muted hover:text-ink transition-colors duration-200 tracking-wider font-light"
                >
                  Joaillerie d&apos;Art
                </Link>
              </li>
              <li>
                <Link
                  href="/boutique?category=montres"
                  className="font-mont text-[11px] text-ink-muted hover:text-ink transition-colors duration-200 tracking-wider font-light"
                >
                  Haute Horlogerie
                </Link>
              </li>
              <li>
                <Link
                  href="/boutique?category=maroquinerie"
                  className="font-mont text-[11px] text-ink-muted hover:text-ink transition-colors duration-200 tracking-wider font-light"
                >
                  Maroquinerie Précieuse
                </Link>
              </li>
              <li>
                <Link
                  href="/boutique?category=pieces-uniques"
                  className="font-mont text-[11px] text-ink-muted hover:text-ink transition-colors duration-200 tracking-wider font-light"
                >
                  Pièces Uniques & Sur-Mesure
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Expérience */}
          <div className="space-y-4">
            <h4 className="font-mont uppercase text-[10px] font-medium tracking-[0.3em] text-ink">
              Expérience
            </h4>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/le-cercle"
                  className="font-mont text-[11px] text-ink-muted hover:text-ink transition-colors duration-200 tracking-wider font-light"
                >
                  Le Cercle Confidentiel
                </Link>
              </li>
              <li>
                <Link
                  href="/lookbook"
                  className="font-mont text-[11px] text-ink-muted hover:text-ink transition-colors duration-200 tracking-wider font-light"
                >
                  Lookbook Éditorial
                </Link>
              </li>
              <li>
                <Link
                  href="/magazine"
                  className="font-mont text-[11px] text-ink-muted hover:text-ink transition-colors duration-200 tracking-wider font-light"
                >
                  Magazine Perseus
                </Link>
              </li>
              <li>
                <Link
                  href="/la-maison"
                  className="font-mont text-[11px] text-ink-muted hover:text-ink transition-colors duration-200 tracking-wider font-light"
                >
                  L&apos;Héritage
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Confidentialité & Services */}
          <div className="space-y-4">
            <h4 className="font-mont uppercase text-[10px] font-medium tracking-[0.3em] text-ink">
              Services
            </h4>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/faq"
                  className="font-mont text-[11px] text-ink-muted hover:text-ink transition-colors duration-200 tracking-wider font-light"
                >
                  Conciergerie & FAQ
                </Link>
              </li>
              <li>
                <Link
                  href="/cgv"
                  className="font-mont text-[11px] text-ink-muted hover:text-ink transition-colors duration-200 tracking-wider font-light"
                >
                  Conditions Générales
                </Link>
              </li>
              <li>
                <Link
                  href="/confidentialite"
                  className="font-mont text-[11px] text-ink-muted hover:text-ink transition-colors duration-200 tracking-wider font-light"
                >
                  Confidentialité & Données
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t-[0.5px] border-ink/10 mt-20 pt-10 flex flex-col sm:flex-row items-center justify-between gap-6">
          <p className="font-mont text-[9px] text-ink-faint tracking-[0.3em] uppercase font-light">
            © 2026 PERSEUS MAISON. TOUS DROITS RÉSERVÉS.
          </p>
          <div className="flex items-center gap-8">
            <span className="font-mont text-[9px] text-ink-muted tracking-[0.3em] uppercase font-light">
              PORTOLA DRIVE • LOS SANTOS
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
