'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, ShieldCheck, Landmark, FileText, Info } from 'lucide-react';

export default function CGVPage() {
  return (
    <div className="min-h-screen bg-[#FAF8F5] text-zinc-900 pt-36 pb-36 px-6 sm:px-12 lg:px-24">
      <div className="max-w-4xl mx-auto space-y-12">
        
        {/* Navigation */}
        <div>
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-zinc-500 hover:text-zinc-950 text-[10px] font-mont uppercase tracking-[0.25em] transition-colors mb-6"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Retour à l&apos;accueil</span>
          </Link>
          
          <p className="font-mont text-[9px] uppercase tracking-[0.35em] text-[#C5A044] font-medium mb-2">
            Maison Perseus · Portola Drive
          </p>
          <h1 className="font-serif text-3xl sm:text-5xl uppercase tracking-tight text-zinc-950">
            Conditions Générales <span className="italic font-light text-zinc-600">de Vente</span>
          </h1>
        </div>

        {/* GTA:World Disclaimer Notice */}
        <div className="p-6 bg-white border border-[#C5A044]/40 rounded-2xl shadow-sm space-y-3">
          <div className="flex items-center gap-2 text-[#C5A044]">
            <Info className="w-5 h-5" />
            <h2 className="font-mont text-xs font-bold uppercase tracking-wider text-zinc-950">
              (( Mentions Légales &amp; Nature Fictive du Site — GTA:World ))
            </h2>
          </div>
          <p className="font-mont text-xs text-zinc-600 leading-relaxed">
            Le présent site web <strong>perseusshop.duckdns.org</strong> est une vitrine commerciale strictement <strong>fictive et roleplay</strong> opérée dans le cadre du serveur de jeu <strong>GTA:World</strong>.
          </p>
          <ul className="font-mont text-xs text-zinc-600 space-y-2 list-disc list-inside">
            <li><strong>Monnaie virtuelle :</strong> L&apos;ensemble des prix et transactions sont libellés en dollars virtuels GTA:World ($). Aucune monnaie réelle (EUR, USD, crypto) n&apos;est acceptée ni échangée.</li>
            <li><strong>Biens virtuels :</strong> Les bijoux, montres et maroquineries acquis sur cette plateforme correspondent à des objets virtuels créés et délivrés in-game sur le serveur GTA:World.</li>
            <li><strong>Données personnelles :</strong> Les informations demandées (nom de personnage, e-mail fictif, identifiant Discord, adresse Los Santos) sont purement destinées au bon déroulement du jeu de rôle (Roleplay) et au suivi de commande.</li>
          </ul>
        </div>

        {/* Articles */}
        <div className="space-y-8 font-mont text-xs text-zinc-700 leading-relaxed">
          
          <section className="space-y-3 bg-white p-8 rounded-2xl border border-zinc-200/80 shadow-sm">
            <h3 className="font-serif text-xl uppercase tracking-wider text-zinc-950">
              Article 1 — Commandes &amp; Acquisitions
            </h3>
            <p>
              Toute commande passée sur la boutique en ligne Perseus engage l&apos;acheteur à disposer des fonds nécessaires sur son compte bancaire Fleeca Bank in-game. Les commandes peuvent être passées avec un compte membre Perseus ou en mode Invité avec un identifiant Discord valide.
            </p>
          </section>

          <section className="space-y-3 bg-white p-8 rounded-2xl border border-zinc-200/80 shadow-sm">
            <h3 className="font-serif text-xl uppercase tracking-wider text-zinc-950">
              Article 2 — Modalités de Règlement Fleeca
            </h3>
            <p>
              Les règlements s&apos;effectuent automatiquement via la passerelle sécurisée <strong>Fleeca Bank V2</strong> ou par virement bancaire manuel vers l&apos;IBAN de l&apos;entreprise : <strong>0300 1458 1</strong>. Les transactions sont enregistrées et auditées par les services comptables de la Maison Perseus.
            </p>
          </section>

          <section className="space-y-3 bg-white p-8 rounded-2xl border border-zinc-200/80 shadow-sm">
            <h3 className="font-serif text-xl uppercase tracking-wider text-zinc-950">
              Article 3 — Livraison &amp; Remise des Pièces
            </h3>
            <p>
              La remise des pièces s&apos;effectue soit par remise en main propre dans nos salons privés sur <strong>Portola Drive, Los Santos</strong>, soit par coursier sécurisé à l&apos;adresse de livraison renseignée lors de la validation.
            </p>
          </section>

        </div>

      </div>
    </div>
  );
}
