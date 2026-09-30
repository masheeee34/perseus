'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, ShieldCheck, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import PerseusAPI from '../../lib/api';

function SelectCharacterContent() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [characters, setCharacters] = useState<string[]>([]);
  const [activeCharacter, setActiveCharacter] = useState<string>('');
  const [userData, setUserData] = useState<any>(null);
  const [submittingChar, setSubmittingChar] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      if (!PerseusAPI.isLoggedIn()) {
        router.push('/login');
        return;
      }
      try {
        const u = await PerseusAPI.getProfile();
        setUserData(u);
        let list: string[] = [];
        if (Array.isArray(u.characters) && u.characters.length > 0) {
          list = u.characters;
        } else if (u.character_name) {
          list = [u.character_name];
        } else if (u.name) {
          list = [u.name];
        }
        setCharacters(list);
        const stored = typeof window !== 'undefined' ? localStorage.getItem('perseus_character') : null;
        setActiveCharacter(stored || u.character_name || list[0] || u.name || '');
      } catch (err) {
        const u = PerseusAPI.getUser();
        if (u) {
          setUserData(u);
          let list: string[] = [];
          if (Array.isArray((u as any).characters) && (u as any).characters.length > 0) {
            list = (u as any).characters;
          } else if ((u as any).character_name) {
            list = [(u as any).character_name];
          }
          setCharacters(list);
          const stored = typeof window !== 'undefined' ? localStorage.getItem('perseus_character') : null;
          setActiveCharacter(stored || (u as any).character_name || list[0] || u.name || '');
        } else {
          router.push('/login');
        }
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [router]);

  const handleSelectCharacter = async (charName: string) => {
    const trimmed = charName.trim();
    if (!trimmed || submittingChar) return;
    setSubmittingChar(trimmed);
    setActiveCharacter(trimmed);

    if (typeof window !== 'undefined') {
      localStorage.setItem('perseus_character', trimmed);
    }

    if (userData) {
      const updatedUser = {
        ...userData,
        name: trimmed,
        character_name: trimmed,
      };
      if (typeof window !== 'undefined') {
        localStorage.setItem('perseus_user', JSON.stringify(updatedUser));
      }
    }

    try {
      await PerseusAPI.updateProfile({ name: trimmed, character_name: trimmed } as any);
    } catch (e) {
      console.warn('Could not update active character', e);
    }

    setTimeout(() => {
      router.push('/profil');
    }, 500);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAF8F5] flex items-center justify-center font-mont">
        <div className="w-8 h-8 border-2 border-[#C5A044] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF8F5] flex flex-col items-center justify-center p-6 text-zinc-900 font-mont">
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-2xl bg-white border border-zinc-200/90 rounded-3xl p-8 sm:p-12 shadow-[0_12px_45px_rgba(0,0,0,0.04)] text-center"
      >
        <div className="flex flex-col items-center space-y-3 mb-6">
          <div className="w-14 h-14 rounded-full bg-[#FAF8F5] border border-[#C5A044]/30 flex items-center justify-center text-zinc-900 shadow-sm">
            <ShieldCheck className="w-7 h-7 text-[#C5A044]" />
          </div>

          <div className="space-y-1">
            <span className="text-[10px] font-mont uppercase tracking-[0.35em] text-[#C5A044] font-bold block">
              Maison Perseus · Portola Drive
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl uppercase text-zinc-950 font-normal">
              Choix du Personnage
            </h1>
          </div>
        </div>

        <div className="space-y-6 pt-2">
          <div className="space-y-1.5 border-b border-zinc-100 pb-5">
            {userData?.ucp_username && (
              <span className="inline-block text-xs font-mont font-medium px-3.5 py-1 rounded-full bg-zinc-100 text-zinc-700 mb-2">
                Compte UCP : <strong className="text-zinc-950 font-bold">{userData.ucp_username}</strong>
              </span>
            )}
            <p className="font-serif italic text-zinc-600 text-sm sm:text-base">
              Sélectionnez le personnage avec lequel vous souhaitez continuer :
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
            {characters.map((char) => {
              const isCurrent = char.toLowerCase() === activeCharacter.toLowerCase();
              const isSubmitting = submittingChar === char;
              return (
                <button
                  key={char}
                  type="button"
                  disabled={!!submittingChar}
                  onClick={() => handleSelectCharacter(char)}
                  className={`p-5 rounded-2xl border transition-all duration-200 flex flex-col justify-between gap-4 cursor-pointer text-left group ${
                    isCurrent
                      ? 'bg-zinc-950 text-white border-zinc-950 shadow-xl scale-[1.01]'
                      : 'bg-[#FAF8F5] text-zinc-900 border-zinc-200/80 hover:border-zinc-950 hover:bg-white hover:shadow-lg'
                  }`}
                >
                  <div className="flex items-center gap-3.5">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-serif font-bold ${
                      isCurrent
                        ? 'bg-white/10 text-[#C5A044] border border-white/20'
                        : 'bg-white text-zinc-800 border border-zinc-200 shadow-xs'
                    }`}>
                      {char.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="font-serif text-lg uppercase font-semibold">
                        {char}
                      </h3>
                      <span className={`text-[10px] font-mont uppercase tracking-wider block mt-0.5 ${
                        isCurrent ? 'text-[#C5A044]' : 'text-zinc-400'
                      }`}>
                        {isCurrent ? 'Profil actif' : 'Personnage lié'}
                      </span>
                    </div>
                  </div>

                  <div className={`pt-2 border-t flex items-center justify-between text-xs font-mont font-bold uppercase tracking-wider ${
                    isCurrent ? 'border-white/10 text-white' : 'border-zinc-200/60 text-zinc-700 group-hover:text-zinc-950'
                  }`}>
                    <span>{isSubmitting ? 'Activation...' : isCurrent ? 'Actif' : 'Choisir ce profil'}</span>
                    {isSubmitting ? (
                      <Loader2 className="w-3.5 h-3.5 text-[#C5A044] animate-spin" />
                    ) : (
                      <ArrowRight className={`w-3.5 h-3.5 ${isCurrent ? 'text-[#C5A044]' : 'text-zinc-400 group-hover:text-zinc-950'}`} />
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          <p className="text-[11px] font-mont text-zinc-400 uppercase tracking-widest pt-2">
            Vous pourrez changer de profil à tout moment depuis votre Salon Privé
          </p>
        </div>
      </motion.div>
    </div>
  );
}

export default function SelectCharacterPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#FAF8F5] flex items-center justify-center font-mont">
        <div className="w-8 h-8 border-2 border-[#C5A044] border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <SelectCharacterContent />
    </Suspense>
  );
}
