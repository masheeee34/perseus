'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle2, ArrowRight, ShieldCheck, Landmark } from 'lucide-react';

export default function CheckoutSuccessPage() {
  const searchParams = useSearchParams();
  const paymentId = searchParams.get('payment_id') || 'PAIEMENT-CONFIRMÉ';

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col items-center justify-center p-6 selection:bg-zinc-800 antialiased">
      <div className="w-full max-w-lg bg-zinc-900/80 border border-zinc-800 rounded-3xl p-8 sm:p-12 text-center shadow-2xl backdrop-blur-md space-y-8">
        
        <div className="w-20 h-20 rounded-3xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto shadow-inner">
          <CheckCircle2 className="w-10 h-10 text-emerald-400" />
        </div>

        <div>
          <span className="text-[10px] font-mont uppercase tracking-[0.35em] text-zinc-400 font-light block mb-2">
            Maison Perseus · Portola Drive
          </span>
          <h1 className="font-cormorant text-4xl sm:text-5xl text-zinc-100 font-light tracking-wide">
            Paiement Validé
          </h1>
          <p className="text-xs text-zinc-400 mt-2 leading-relaxed">
            Votre virement bancaire Fleeca a été traité et crédité avec succès.
          </p>
        </div>

        <div className="bg-zinc-950 border border-zinc-800/80 rounded-2xl p-6 text-left space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-zinc-800/60">
            <span className="text-xs text-zinc-500">Identifiant Transaction</span>
            <span className="font-mono text-xs font-bold text-zinc-200">{paymentId}</span>
          </div>

          <div className="flex items-center justify-between pb-3 border-b border-zinc-800/60">
            <span className="text-xs text-zinc-500">Statut du Règlement</span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              Encaissé
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-xs text-zinc-500">Mode de Paiement</span>
            <span className="text-xs font-medium text-zinc-300 flex items-center gap-1.5">
              <Landmark className="w-3.5 h-3.5 text-zinc-400" />
              Fleeca Bank V2 Gateway
            </span>
          </div>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row gap-3">
          <Link
            href="/boutique"
            className="flex-1 h-12 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-zinc-950 font-mont text-xs font-bold uppercase tracking-[0.2em] flex items-center justify-center gap-2 transition-colors shadow-lg"
          >
            <span>Retourner aux Collections</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="flex items-center justify-center gap-2 text-[11px] text-zinc-600">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Certifié &amp; Sécurisé par le protocole Perseus</span>
        </div>

      </div>
    </div>
  );
}
