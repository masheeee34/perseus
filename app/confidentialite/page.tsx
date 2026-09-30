'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Lock, EyeOff, ShieldCheck, Database, Key } from 'lucide-react';
import MotionSection from '../../components/MotionSection';

export default function ConfidentialitePage() {
  return (
    <div className="min-h-screen bg-black text-white pt-36 pb-32">
      <div className="max-w-[1200px] mx-auto px-6 lg:px-12">
        
        {/* Breadcrumb */}
        <div className="mb-12">
          <Link
            href="/"
            className="inline-flex items-center gap-3 text-white/40 hover:text-gold transition-colors text-[10px] font-bold tracking-[0.25em] uppercase group"
          >
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1.5 transition-transform" />
            Retour à l&apos;accueil
          </Link>
        </div>

        {/* Header */}
        <header className="mb-20 text-center">
          <MotionSection delay={0.1}>
            <p className="section-label mb-4">Protection & Discrétion</p>
            <h1 className="font-playfair text-4xl md:text-6xl font-bold uppercase tracking-widest mb-6">
              Politique de Confidentialité
            </h1>
            <p className="text-white/40 font-mont text-xs tracking-[0.3em] uppercase max-w-xl mx-auto">
              Le secret d&apos;affaires et la protection des données de nos acquéreurs
            </p>
            <div className="w-24 h-px bg-gold mx-auto mt-8" />
          </MotionSection>
        </header>

        {/* Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
          <div className="bg-dark-100/60 border border-white/5 p-8 flex flex-col items-center text-center">
            <Lock className="w-8 h-8 text-gold mb-4" />
            <h3 className="font-playfair text-base font-bold uppercase tracking-wider text-white mb-2">Chiffrement AES-256</h3>
            <p className="text-white/40 text-xs font-mont leading-relaxed">Toutes vos informations d&apos;acquisition et d&apos;identité sont cryptées avec des protocoles bancaires de haut niveau.</p>
          </div>
          <div className="bg-dark-100/60 border border-white/5 p-8 flex flex-col items-center text-center">
            <EyeOff className="w-8 h-8 text-gold mb-4" />
            <h3 className="font-playfair text-base font-bold uppercase tracking-wider text-white mb-2">Zéro Partage Tiers</h3>
            <p className="text-white/40 text-xs font-mont leading-relaxed">La Maison Perseus ne commercialise, ne loue et ne divulgue jamais les coordonnées de ses clients privilégiés.</p>
          </div>
          <div className="bg-dark-100/60 border border-white/5 p-8 flex flex-col items-center text-center">
            <Key className="w-8 h-8 text-gold mb-4" />
            <h3 className="font-playfair text-base font-bold uppercase tracking-wider text-white mb-2">Droit à l&apos;Oubli Élite</h3>
            <p className="text-white/40 text-xs font-mont leading-relaxed">Suppression immédiate et irréversible de l&apos;historique et des données sur simple demande à votre conseiller.</p>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-16 text-white/70 font-mont text-xs md:text-sm leading-relaxed tracking-wide bg-dark-100/30 border border-white/5 p-8 md:p-14">
          
          <section className="space-y-4">
            <h2 className="font-playfair text-2xl text-white uppercase tracking-wider text-gold">1. Engagement de Discrétion</h2>
            <p>
              Pour la Maison Perseus, la discrétion est la plus haute forme d&apos;élégance. Les données recueillies lors de la création de votre compte, de vos commandes ou de votre intégration au Cercle Perseus sont strictement réservées à l&apos;exécution de vos commandes et au service de conciergerie privée.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="font-playfair text-2xl text-white uppercase tracking-wider text-gold">2. Nature des Données Recueillies</h2>
            <p>
              Nous collectons exclusivement les éléments indispensables à la personnalisation de votre expérience : nom, adresse de livraison certifiée, historique des commandes et points de fidélité. Aucune coordonnée bancaire brute n&apos;est stockée sur nos serveurs.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="font-playfair text-2xl text-white uppercase tracking-wider text-gold">3. Cookies & Session</h2>
            <p>
              Notre site utilise uniquement des cookies de session strictement techniques (authentification, panier, maintien des préférences d&apos;affichage) afin d&apos;assurer une fluidité de navigation optimale sans traçage publicitaire intrusif.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="font-playfair text-2xl text-white uppercase tracking-wider text-gold">4. Contact Délégué à la Protection</h2>
            <p>
              Pour toute question relative à la gestion de vos données ou pour demander un export confidentiel de votre fiche client, vous pouvez contacter directement le pôle d&apos;intégrité à l&apos;adresse : <span className="text-gold font-bold">conciergerie@perseus-luxe.com</span>.
            </p>
          </section>

        </div>

      </div>
    </div>
  );
}
