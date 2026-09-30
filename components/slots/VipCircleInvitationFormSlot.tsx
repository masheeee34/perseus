'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, X, Check } from 'lucide-react';

export default function VipCircleInvitationFormSlot() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', contact: '', note: '' });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
    setTimeout(() => {
      setIsDrawerOpen(false);
      setIsSubmitted(false);
      setFormData({ name: '', contact: '', note: '' });
    }, 2500);
  };

  return (
    <>
      <section className="w-full bg-[#FAF8F5] py-28 sm:py-36 px-6 sm:px-12 text-center select-none">
        <div className="max-w-4xl mx-auto space-y-6">
          <span className="text-[10px] sm:text-xs font-mont uppercase tracking-[0.45em] text-[#C5A044] font-bold block">
            Cercle Confidentiel · Sur Agrément
          </span>

          <h2 className="font-serif text-4xl sm:text-6xl lg:text-7xl uppercase tracking-[0.14em] text-zinc-950 font-light leading-tight">
            Le Cercle Perseus
          </h2>

          <p className="font-mont text-xs sm:text-sm text-zinc-600 font-light leading-relaxed max-w-xl mx-auto">
            Réservé aux collectionneurs et acquéreurs de pièces uniques. Bénéficiez d&apos;un accès prioritaire aux ventes privées et d&apos;un salon dédié sur Portola Drive.
          </p>

          <div className="pt-6">
            <button
              onClick={() => setIsDrawerOpen(true)}
              className="inline-flex items-center gap-3 px-10 py-4 border-2 border-zinc-950 text-zinc-950 hover:bg-zinc-950 hover:text-white text-[10px] uppercase tracking-[0.3em] font-bold transition-all duration-300 font-mont cursor-pointer"
            >
              <span>Solliciter un Entretien Privé</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#C5A044]" />
            </button>
          </div>
        </div>
      </section>

      {/* Drawer */}
      <AnimatePresence>
        {isDrawerOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsDrawerOpen(false)}
              className="fixed inset-0 bg-zinc-950/60 backdrop-blur-sm z-[990]"
            />

            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="fixed inset-y-0 right-0 w-full sm:w-[520px] bg-[#FAF8F5] border-l border-zinc-300 text-zinc-900 p-8 sm:p-14 z-[999] flex flex-col justify-between overflow-y-auto shadow-2xl"
            >
              <div>
                <div className="flex items-center justify-between mb-12 border-b border-zinc-200 pb-6">
                  <span className="font-serif uppercase tracking-[0.3em] text-base text-zinc-950 font-normal">
                    PERSEUS · CERCLE PRIVÉ
                  </span>
                  <button
                    onClick={() => setIsDrawerOpen(false)}
                    className="p-2 text-zinc-500 hover:text-zinc-950 transition-colors cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-3 mb-10">
                  <span className="text-[9px] font-mont uppercase tracking-[0.35em] text-[#C5A044] font-bold block">
                    Protocole d&apos;Agrément
                  </span>
                  <h3 className="font-serif text-2xl sm:text-3xl text-zinc-950 font-light leading-tight">
                    Demande de Rendez-vous Privé
                  </h3>
                  <p className="font-mont text-xs text-zinc-600 leading-relaxed font-light">
                    Veuillez renseigner vos coordonnées. Un officier de liaison de la Maison prendra contact de manière strictement confidentielle.
                  </p>
                </div>

                {isSubmitted ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="py-16 text-center border border-[#C5A044] bg-white p-8 shadow-sm"
                  >
                    <div className="w-12 h-12 rounded-full border border-[#C5A044] text-[#C5A044] mx-auto flex items-center justify-center mb-4">
                      <Check className="w-6 h-6" />
                    </div>
                    <p className="font-serif text-xl text-zinc-950 mb-2">Demande Transmise</p>
                    <p className="font-mont text-xs text-zinc-500">
                      Votre officier de liaison privée vous contactera sous 24h.
                    </p>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                      <label className="block text-[9px] font-mont uppercase tracking-widest text-zinc-500 mb-2 font-bold">
                        Nom &amp; Titre (Personnage) *
                      </label>
                      <input
                        type="text"
                        placeholder="EX: LORD A. VANCE"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full bg-white border border-zinc-300 text-zinc-900 placeholder:text-zinc-400 font-mont text-xs tracking-wider px-4 py-3.5 focus:border-[#C5A044] outline-none transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-[9px] font-mont uppercase tracking-widest text-zinc-500 mb-2 font-bold">
                        Coordonnées Sécurisées (Numéro GTAW) *
                      </label>
                      <input
                        type="text"
                        placeholder="EX: 555-0192"
                        required
                        value={formData.contact}
                        onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                        className="w-full bg-white border border-zinc-300 text-zinc-900 placeholder:text-zinc-400 font-mont text-xs tracking-wider px-4 py-3.5 focus:border-[#C5A044] outline-none transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-[9px] font-mont uppercase tracking-widest text-zinc-500 mb-2 font-bold">
                        Création Souhaitée ou Parrainage
                      </label>
                      <textarea
                        placeholder="Précisez votre demande..."
                        rows={3}
                        value={formData.note}
                        onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                        className="w-full bg-white border border-zinc-300 text-zinc-900 placeholder:text-zinc-400 font-mont text-xs tracking-wider px-4 py-3.5 focus:border-[#C5A044] outline-none transition-colors resize-none"
                      />
                    </div>

                    <div className="pt-2">
                      <button
                        type="submit"
                        className="w-full py-4 bg-zinc-950 hover:bg-[#C5A044] text-white font-mont uppercase tracking-[0.25em] text-[10px] transition-all duration-300 font-bold shadow-md cursor-pointer"
                      >
                        Transmettre la Demande
                      </button>
                    </div>
                  </form>
                )}
              </div>

              <div className="pt-8 border-t border-zinc-200 mt-10">
                <p className="font-mont text-[8px] uppercase tracking-[0.3em] text-zinc-400 text-center">
                  Portola Drive · Salon Privé · Los Santos
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
