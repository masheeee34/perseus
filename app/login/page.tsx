'use client';

import React, { Suspense, useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowRight, ShieldCheck } from 'lucide-react';

const GTAW_CLIENT_ID = '40';
const REDIRECT_URI = 'https://perseusshopp.duckdns.org/oauth/callback';

function LoginFormContent() {
  const searchParams = useSearchParams();
  const redirectTarget = searchParams.get('redirect') || '/profil';
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mobile = redirectTarget.startsWith('/app') || 
                   redirectTarget.startsWith('/mobile') || 
                   searchParams.get('mode') === 'mobile' || 
                   (typeof window !== 'undefined' && (
                     localStorage.getItem('perseus_client_mode') === 'mobile' || 
                     window.innerWidth < 640
                   ));
    setIsMobile(mobile);
  }, [redirectTarget, searchParams]);

  const handleOAuthClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (typeof window !== 'undefined') {
      localStorage.setItem('perseus_auth_redirect', redirectTarget);
      if (isMobile) {
        localStorage.setItem('perseus_client_mode', 'mobile');
      }
    }
    const targetUrl = `https://ucp-fr.gta.world/oauth/authorize?client_id=${GTAW_CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&response_type=code&state=${encodeURIComponent(redirectTarget)}`;
    window.location.href = targetUrl;
  };

  if (isMobile) {
    return (
      <div className="min-h-screen bg-[#0C0C0E] text-white flex flex-col justify-between p-5 font-mont antialiased select-none">
        
        {/* Header Smartphone */}
        <div className="text-center pt-6 space-y-3">
          <div className="w-14 h-14 rounded-full bg-[#18181B] border border-[#C5A044]/40 flex items-center justify-center mx-auto shadow-lg">
            <ShieldCheck className="w-7 h-7 text-[#C5A044]" />
          </div>
          <span className="font-mont text-[10px] uppercase tracking-[0.35em] text-[#C5A044] font-bold block">
            Maison Perseus · Portola Drive
          </span>
          <h1 className="font-serif text-3xl uppercase font-bold text-white tracking-wide">
            Espace Client
          </h1>
        </div>

        {/* Corps central */}
        <div className="my-auto w-full max-w-sm mx-auto space-y-6 text-center">
          <p className="font-serif italic text-white/60 text-sm leading-relaxed px-2">
            Connectez votre compte GTA:World UCP pour synchroniser vos coordonnées bancaires Fleeca Bank et vos privilèges de haute joaillerie.
          </p>

          <button
            onClick={handleOAuthClick}
            className="w-full py-4.5 px-6 bg-gradient-to-r from-[#D4AF37] to-[#B8861E] text-black font-mont text-xs uppercase tracking-[0.2em] font-extrabold shadow-[0_10px_25px_rgba(212,175,55,0.3)] active:scale-[0.98] transition-all rounded-2xl flex items-center justify-center gap-2.5 cursor-pointer"
          >
            <span>Connexion GTA:World UCP</span>
            <ArrowRight className="w-4 h-4 stroke-[2.5]" />
          </button>

          <p className="text-[10px] font-mont uppercase tracking-widest text-white/40">
            Authentification Officielle Sécurisée · Aucun mot de passe requis
          </p>
        </div>

        {/* Footer Smartphone */}
        <div className="text-center pb-4 pt-2">
          <Link
            href="/app"
            className="text-[11px] font-mont uppercase tracking-wider text-[#C5A044] underline underline-offset-4"
          >
            Retour à l&apos;application
          </Link>
        </div>

      </div>
    );
  }

  // Rendu Desktop Salon Privé
  return (
    <div className="min-h-screen bg-[#FAF8F5] text-zinc-900 py-16 px-6 sm:px-12 flex flex-col items-center justify-center font-[-apple-system,BlinkMacSystemFont,'SF_Pro_Text',sans-serif]">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        className="max-w-xl w-full text-center space-y-10"
      >
        <div className="flex flex-col items-center space-y-4">
          <div className="w-14 h-14 relative opacity-80 mb-2">
            <Image
              src="/assets/logo/perseus_official.png"
              alt="Maison Perseus"
              fill
              className="object-contain"
              priority
            />
          </div>
          <span className="font-mont text-[10px] uppercase tracking-[0.4em] text-[#C5A044] font-bold">
            Maison Perseus · Portola Drive
          </span>
          <h1 className="font-serif text-4xl sm:text-6xl font-normal text-zinc-950 uppercase tracking-tight leading-[1.05]">
            Salon Privé
          </h1>
        </div>

        <div className="space-y-8 max-w-md mx-auto">
          <p className="font-serif italic text-zinc-600 text-lg sm:text-xl leading-relaxed font-light">
            Espace réservé aux collectionneurs et résidents de Los Santos. Accédez à votre coffre d&apos;atelier et vos privilèges de haute joaillerie.
          </p>

          <div className="pt-2 space-y-4">
            <button
              onClick={handleOAuthClick}
              className="inline-flex items-center justify-center gap-3 w-full py-5 px-10 bg-zinc-950 hover:bg-[#C5A044] text-white font-mont text-xs uppercase tracking-[0.28em] font-bold shadow-xl transition-all duration-300 cursor-pointer rounded-xl"
            >
              <span>Accéder via GTA:World UCP</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <p className="text-[10px] font-mont uppercase tracking-[0.25em] text-zinc-400 font-light pt-2">
              Authentification Officielle Sécurisée · Aucun mot de passe requis
            </p>
          </div>
        </div>

        <div className="pt-12 border-t border-zinc-200/80 max-w-xs mx-auto flex items-center justify-center gap-6 text-[10px] font-mont text-zinc-400 uppercase tracking-widest">
          <Link href="/boutique" className="hover:text-zinc-950 transition-colors">Boutique</Link>
          <span>·</span>
          <Link href="/la-maison" className="hover:text-zinc-950 transition-colors">L&apos;Héritage</Link>
          <span>·</span>
          <Link href="/faq" className="hover:text-zinc-950 transition-colors">Conciergerie</Link>
        </div>

      </motion.div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#FAF8F5]" />}>
      <LoginFormContent />
    </Suspense>
  );
}
