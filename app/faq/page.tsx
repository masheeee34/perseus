'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, MessageCircle, Phone, Mail, Clock } from 'lucide-react';
import Link from 'next/link';

const FAQ_DATA = [
  {
    category: "L'Acquisition",
    questions: [
      {
        q: "Comment puis-je acquérir une pièce Perseus ?",
        a: "Nos pièces sont disponibles exclusivement sur notre boutique en ligne et via nos conseillers privés. Chaque acquisition est traitée avec la plus grande discrétion et fait l'objet d'un certificat d'authenticité scellé."
      },
      {
        q: "Quels sont les délais de livraison pour la Haute Joaillerie ?",
        a: "Pour nos pièces en stock, la livraison sécurisée prend entre 2 et 5 jours ouvrés. Pour les créations sur-mesure, un délai de 4 à 8 semaines est à prévoir, incluant la sélection des gemmes et le forgeage artisanal."
      },
      {
        q: "Proposez-vous des facilités de paiement ?",
        a: "Oui, Perseus collabore avec des partenaires financiers d'élite pour proposer des solutions de financement adaptées à nos clients privilégiés, permettant des règlements en plusieurs échéances sans frais."
      }
    ]
  },
  {
    category: "Savoir-Faire & Garantie",
    questions: [
      {
        q: "D'où proviennent vos diamants ?",
        a: "Tous nos diamants sont rigoureusement sélectionnés selon le processus de Kimberley. Nous n'utilisons que des pierres de conflit-free, certifiées GIA, avec une pureté minimale VVS1 pour nos collections 'Elite'."
      },
      {
        q: "Quelle est la durée de la garantie Perseus ?",
        a: "Chaque pièce Perseus bénéficie d'une garantie à vie sur les défauts de fabrication. De plus, nous offrons un service d'entretien annuel gratuit incluant le nettoyage par ultrasons et la vérification des sertis."
      },
      {
        q: "Puis-je faire graver ma pièce après l'achat ?",
        a: "Absolument. Le service de personnalisation et de gravure est offert gracieusement lors de l'achat et reste disponible à tout moment pour nos membres Or et Perseus Noir."
      }
    ]
  },
  {
    category: "Le Cercle Perseus",
    questions: [
      {
        q: "Comment rejoindre le Cercle Perseus ?",
        a: "L'adhésion est automatique dès votre première acquisition. Vos points s'accumulent pour vous faire progresser à travers nos différents rangs : Initié, Argent, Or et enfin l'exclusif rang Perseus Noir."
      },
      {
        q: "Quels sont les avantages du rang Perseus Noir ?",
        a: "Le rang Noir offre un accès illimité à notre conciergerie 24/7, des invitations prioritaires à nos galas annuels, l'accès aux ventes privées d'archives et la possibilité de collaborer directement avec nos designers pour des pièces uniques."
      }
    ]
  }
];

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<string | null>("0-0");

  const toggle = (idx: string) => setOpenIndex(openIndex === idx ? null : idx);

  return (
    <div className="min-h-screen bg-black text-white pt-32 pb-24">
      <div className="max-w-[1200px] mx-auto px-6 lg:px-12">
        
        {/* Header Style Vogue */}
        <header className="mb-24 text-center">
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="section-label mb-6"
          >
            Assistance & Privilèges
          </motion.p>
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="font-playfair text-5xl md:text-7xl font-bold uppercase tracking-widest mb-10"
          >
            QUESTIONS <br /> FRÉQUENTES
          </motion.h1>
          <motion.div 
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.5, duration: 1 }}
            className="w-24 h-px bg-gold mx-auto"
          />
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          
          {/* Sidebar Contact */}
          <aside className="lg:col-span-4 space-y-12">
            <div className="bg-dark-100/50 border border-white/5 p-10 backdrop-blur-xl">
              <h3 className="font-playfair text-xl font-bold mb-8 uppercase tracking-widest">Conciergerie</h3>
              <div className="space-y-8">
                <div className="flex items-start gap-5 group cursor-pointer">
                  <Phone className="w-5 h-5 text-gold mt-1 group-hover:scale-110 transition-transform" />
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-white/40 mb-1">Téléphone Ligne Or</p>
                    <p className="text-sm font-mont font-bold">+33 (0) 1 84 25 36 00</p>
                  </div>
                </div>
                <div className="flex items-start gap-5 group cursor-pointer">
                  <Mail className="w-5 h-5 text-gold mt-1 group-hover:scale-110 transition-transform" />
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-white/40 mb-1">E-mail Directeur</p>
                    <p className="text-sm font-mont font-bold">concierge@perseus-luxury.com</p>
                  </div>
                </div>
                <div className="flex items-start gap-5">
                  <Clock className="w-5 h-5 text-gold mt-1" />
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-white/40 mb-1">Disponibilité</p>
                    <p className="text-sm font-mont font-bold">24h/24 • 7j/7 pour les membres VIP</p>
                  </div>
                </div>
              </div>
              
              <button className="w-full mt-12 bg-white text-black font-bold text-[9px] uppercase tracking-[0.3em] py-5 hover:bg-gold hover:text-white transition-all shadow-xl">
                 Lancer le chat privé
              </button>
            </div>
            
            <div className="p-8 border border-gold/20 bg-gold/5 flex items-center justify-between group cursor-pointer">
                <div>
                   <p className="text-gold text-[10px] font-black uppercase tracking-widest leading-loose">Devenez membre</p>
                   <p className="text-white/60 text-[9px] uppercase tracking-widest font-bold">Accédez à l'exclusivité</p>
                </div>
                <ChevronDown className="w-5 h-5 text-gold -rotate-90 group-hover:translate-x-2 transition-transform" />
            </div>
          </aside>

          {/* Accordion Vogue Style */}
          <main className="lg:col-span-8">
            <div className="space-y-16">
              {FAQ_DATA.map((section, sIdx) => (
                <div key={section.category}>
                  <h2 className="text-gold text-[11px] font-black uppercase tracking-[0.5em] mb-8 border-b border-white/5 pb-4">
                    {section.category}
                  </h2>
                  <div className="divide-y divide-white/5">
                    {section.questions.map((item, qIdx) => {
                      const id = `${sIdx}-${qIdx}`;
                      const isOpen = openIndex === id;
                      return (
                        <div key={id} className="py-8 first:pt-0 last:pb-0">
                          <button 
                            onClick={() => toggle(id)}
                            className="w-full flex justify-between items-center text-left group"
                          >
                            <span className={`font-playfair text-xl md:text-2xl tracking-widest uppercase transition-colors ${isOpen ? 'text-white' : 'text-white/60 group-hover:text-white'}`}>
                              {item.q}
                            </span>
                            <div className={`w-8 h-8 rounded-full border border-white/10 flex items-center justify-center transition-all ${isOpen ? 'bg-gold border-gold rotate-180' : 'group-hover:border-white/30'}`}>
                              <ChevronDown className={`w-4 h-4 transition-colors ${isOpen ? 'text-black' : 'text-white/30'}`} />
                            </div>
                          </button>
                          <AnimatePresence>
                            {isOpen && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                                className="overflow-hidden"
                              >
                                <p className="pt-8 pb-4 text-white/50 font-mont text-sm leading-relaxed max-w-2xl tracking-wide">
                                  {item.a}
                                </p>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </main>

        </div>
      </div>
    </div>
  );
}
