'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { Loader2, CheckCircle2, AlertCircle, ShieldCheck, ArrowRight, User, Smartphone } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import PerseusAPI from '../../../lib/api';

function CallbackContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const [status, setStatus] = useState<'loading' | 'select_character' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('Vérification de l\'autorisation GTA:World...');
  const [characters, setCharacters] = useState<string[]>([]);
  const [userData, setUserData] = useState<any>(null);
  const [targetUrl, setTargetUrl] = useState<string>('/profil');
  const [submittingChar, setSubmittingChar] = useState<string | null>(null);
  const [isMobileMode, setIsMobileMode] = useState<boolean>(false);

  useEffect(() => {
    const code = searchParams.get('code');
    const stateParam = searchParams.get('state');

    // Résolution de l'URL cible (priorité au state OAuth puis au redirect en mémoire)
    const storedRedirect = typeof window !== 'undefined' ? localStorage.getItem('perseus_auth_redirect') : null;
    const resolvedTarget = stateParam || storedRedirect || '/profil';
    setTargetUrl(resolvedTarget);

    const isMobile = resolvedTarget.startsWith('/app') || 
                     resolvedTarget.startsWith('/mobile') || 
                     (typeof window !== 'undefined' && (
                       localStorage.getItem('perseus_client_mode') === 'mobile' || 
                       window.innerWidth < 640
                     ));
    setIsMobileMode(isMobile);

    if (!code) {
      if (PerseusAPI.isLoggedIn()) {
        const u = PerseusAPI.getUser();
        if (u) {
          setUserData(u);
          let list: string[] = [];
          if (Array.isArray((u as any).characters) && (u as any).characters.length > 0) {
            list = (u as any).characters;
          } else if ((u as any).character_name) {
            list = [(u as any).character_name];
          }
          if (list.length > 0) {
            setCharacters(list);
            setStatus('select_character');
            return;
          }
        }
      }
      setStatus('error');
      setMessage('Code d\'autorisation introuvable ou session expirée.');
      return;
    }

    // Échange du code OAuth avec le backend Perseus
    fetch('/api/auth/gtaw/callback', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code }),
    })
      .then((res) => res.json())
      .then(async (data) => {
        if (data.ok || data.token) {
          if (data.token && typeof window !== 'undefined') {
            localStorage.setItem('perseus_token', data.token);
          }
          if (data.user && typeof window !== 'undefined') {
            localStorage.setItem('perseus_user', JSON.stringify(data.user));
            setUserData(data.user);
          }

          if (typeof window !== 'undefined') {
            localStorage.removeItem('perseus_auth_redirect');
          }

          // Extraction et nettoyage des personnages
          let charList: string[] = [];
          if (data.user && Array.isArray(data.user.characters) && data.user.characters.length > 0) {
            charList = data.user.characters;
          } else if (data.user?.character_name) {
            charList = [data.user.character_name];
          } else if (data.user?.name) {
            charList = [data.user.name];
          }

          const isPlaceholder = (n: string) => {
            if (!n) return true;
            const l = n.toLowerCase().trim();
            return l === '' || l.startsWith('gtaw-') || l.includes('@') || l.includes('membre gta');
          };
          charList = Array.from(new Set(charList)).filter(c => !isPlaceholder(c));

          setCharacters(charList);

          // Si on a des personnages, on affiche directement l'écran de sélection de personnage !
          if (charList.length > 0) {
            setStatus('select_character');
          } else {
            // Aucun personnage explicite détecté, on redirige directement
            setStatus('success');
            setMessage('Connexion réussie ! Redirection...');
            setTimeout(() => {
              router.push(resolvedTarget);
            }, 800);
          }
        } else {
          setStatus('error');
          setMessage(data.error || 'Échec de la validation du compte GTA:World.');
        }
      })
      .catch((err) => {
        console.error(err);
        setStatus('error');
        setMessage('Erreur de communication avec les services GTA:World.');
      });
  }, [searchParams, router]);

  const handleSelectCharacter = async (charName: string) => {
    const trimmed = charName.trim();
    if (!trimmed || submittingChar) return;
    setSubmittingChar(trimmed);

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
      console.warn('Could not update active character on server', e);
    }

    setStatus('success');
    setMessage(`Profil activé : ${trimmed}`);

    setTimeout(() => {
      router.push(targetUrl);
    }, 600);
  };

  // ─── RENDU SPÉCIFIQUE MOBILE / APPLICATION TÉLÉPHONE ───
  if (isMobileMode) {
    return (
      <div className="min-h-screen bg-[#0C0C0E] text-white flex flex-col justify-between p-4 sm:p-6 font-mont antialiased select-none">
        
        {/* Header Smartphone */}
        <div className="text-center pt-4 pb-2 space-y-2">
          <div className="w-12 h-12 rounded-full bg-[#18181B] border border-[#C5A044]/40 flex items-center justify-center mx-auto shadow-md">
            <ShieldCheck className="w-6 h-6 text-[#C5A044]" />
          </div>
          <span className="text-[9px] font-mont uppercase tracking-[0.3em] text-[#C5A044] font-bold block">
            Maison Perseus · Smartphone
          </span>
          <h1 className="font-serif text-2xl uppercase font-bold text-white tracking-wide">
            {status === 'select_character' ? 'Choix du Profil' : 'Espace Client'}
          </h1>
          {userData?.ucp_username && (
            <p className="text-[11px] font-mont text-white/50">
              Compte UCP : <strong className="text-white/90">{userData.ucp_username}</strong>
            </p>
          )}
        </div>

        {/* Contenu central */}
        <div className="my-auto w-full max-w-sm mx-auto space-y-4">
          
          {/* État Loading */}
          {status === 'loading' && (
            <div className="p-6 rounded-2xl bg-[#18181B] border border-white/10 text-center space-y-4 shadow-xl">
              <Loader2 className="w-8 h-8 text-[#C5A044] animate-spin mx-auto" />
              <p className="text-xs text-white/60 font-medium">{message}</p>
            </div>
          )}

          {/* État Choix de Personnage (Format Smartphone) */}
          {status === 'select_character' && (
            <div className="space-y-3">
              <p className="text-xs text-center text-white/60 font-serif italic mb-2">
                Sélectionnez le personnage avec lequel entrer dans l&apos;application :
              </p>

              {characters.map((char) => {
                const isCurrent = submittingChar === char;
                return (
                  <button
                    key={char}
                    type="button"
                    disabled={!!submittingChar}
                    onClick={() => handleSelectCharacter(char)}
                    className="w-full p-4 rounded-2xl bg-[#18181B] border border-white/10 active:border-[#C5A044] active:bg-[#202024] transition-all flex items-center justify-between text-left group shadow-lg cursor-pointer"
                  >
                    <div className="flex items-center gap-3.5">
                      <div className="w-12 h-12 rounded-full bg-black/70 border border-[#C5A044]/50 flex items-center justify-center text-lg font-serif font-bold text-[#C5A044] shadow-inner flex-shrink-0">
                        {char.charAt(0).toUpperCase()}
                      </div>
                      <div className="space-y-0.5">
                        <h3 className="font-serif text-base font-bold text-white uppercase group-hover:text-[#C5A044] transition-colors truncate">
                          {char}
                        </h3>
                        <span className="text-[9px] font-mont uppercase tracking-wider text-white/40 block">
                          Personnage GTA:World
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {isCurrent ? (
                        <Loader2 className="w-4 h-4 text-[#C5A044] animate-spin" />
                      ) : (
                        <span className="px-3 py-1.5 rounded-xl bg-white/10 group-hover:bg-[#C5A044] group-hover:text-black text-[10px] font-bold uppercase tracking-wider text-white transition-all flex items-center gap-1">
                          <span>Choisir</span>
                          <ArrowRight className="w-3 h-3" />
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          )}

          {/* État Succès */}
          {status === 'success' && (
            <div className="p-6 rounded-2xl bg-[#18181B] border border-emerald-500/30 text-center space-y-4 shadow-xl">
              <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
              <p className="text-xs text-white font-bold">{message}</p>
              <div className="w-5 h-5 border-2 border-[#C5A044] border-t-transparent rounded-full animate-spin mx-auto mt-2" />
            </div>
          )}

          {/* État Erreur */}
          {status === 'error' && (
            <div className="p-6 rounded-2xl bg-[#18181B] border border-red-500/30 text-center space-y-4 shadow-xl">
              <AlertCircle className="w-10 h-10 text-red-400 mx-auto" />
              <p className="text-xs text-red-300">{message}</p>
              <button
                onClick={() => router.push(targetUrl || '/app')}
                className="w-full py-3 bg-[#C5A044] text-black font-mont text-xs uppercase font-bold tracking-wider rounded-xl cursor-pointer"
              >
                Retour à l&apos;application
              </button>
            </div>
          )}

        </div>

        {/* Footer Smartphone */}
        <div className="text-center pb-4 pt-2">
          <p className="text-[9px] font-mont text-white/30 uppercase tracking-widest">
            Plateforme Roleplay GTA:World France · Connexion Sécurisée
          </p>
        </div>

      </div>
    );
  }

  // ─── RENDU DESKTOP SALON PRIVÉ ───
  return (
    <div className="min-h-screen bg-[#FAF8F5] flex flex-col items-center justify-center p-6 text-zinc-900 font-mont">
      <motion.div
        layout
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className={`w-full bg-white border border-zinc-200/90 rounded-3xl p-8 sm:p-12 shadow-[0_12px_45px_rgba(0,0,0,0.04)] text-center transition-all duration-500 ${
          status === 'select_character' ? 'max-w-2xl' : 'max-w-md'
        }`}
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
              {status === 'select_character' ? 'Choix du Personnage' : 'Salon Privé'}
            </h1>
          </div>
        </div>

        {status === 'loading' && (
          <div className="flex flex-col items-center gap-5 py-6">
            <Loader2 className="w-8 h-8 text-[#C5A044] animate-spin" />
            <p className="text-xs font-mont tracking-wider text-zinc-500 font-medium">
              {message}
            </p>
          </div>
        )}

        {status === 'select_character' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="space-y-6 pt-2"
          >
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
                const isCurrentSubmitting = submittingChar === char;
                return (
                  <button
                    key={char}
                    type="button"
                    disabled={!!submittingChar}
                    onClick={() => handleSelectCharacter(char)}
                    className="p-5 rounded-2xl bg-[#FAF8F5] border border-zinc-200/80 hover:border-zinc-950 hover:bg-white hover:shadow-lg transition-all duration-200 flex flex-col justify-between gap-4 cursor-pointer text-left group disabled:opacity-50"
                  >
                    <div className="flex items-center gap-3.5">
                      <div className="w-12 h-12 rounded-full bg-zinc-950 text-[#C5A044] border border-zinc-800 flex items-center justify-center text-lg font-serif font-bold group-hover:scale-105 transition-transform">
                        {char.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h3 className="font-serif text-lg text-zinc-950 uppercase font-semibold group-hover:text-[#C5A044] transition-colors">
                          {char}
                        </h3>
                        <span className="text-[10px] font-mont uppercase tracking-wider text-zinc-400 block mt-0.5">
                          Personnage GTA:World
                        </span>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-zinc-200/60 flex items-center justify-between text-xs font-mont font-bold uppercase tracking-wider text-zinc-700 group-hover:text-zinc-950">
                      <span>{isCurrentSubmitting ? 'Connexion...' : 'Choisir ce profil'}</span>
                      {isCurrentSubmitting ? (
                        <Loader2 className="w-3.5 h-3.5 text-[#C5A044] animate-spin" />
                      ) : (
                        <ArrowRight className="w-3.5 h-3.5 text-zinc-400 group-hover:text-zinc-950 group-hover:translate-x-1 transition-all" />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            <p className="text-[11px] font-mont text-zinc-400 uppercase tracking-widest pt-2">
              Vous pourrez changer de profil à tout moment depuis votre Salon Privé
            </p>
          </motion.div>
        )}

        {status === 'success' && (
          <div className="flex flex-col items-center gap-5 py-6">
            <CheckCircle2 className="w-10 h-10 text-emerald-600" />
            <p className="text-xs font-mont tracking-wider text-zinc-900 font-bold">
              {message}
            </p>
            <div className="w-5 h-5 border-2 border-[#C5A044] border-t-transparent rounded-full animate-spin mt-1" />
          </div>
        )}

        {status === 'error' && (
          <div className="flex flex-col items-center gap-4 py-6">
            <AlertCircle className="w-10 h-10 text-red-500" />
            <p className="text-xs font-mont tracking-wider text-red-600 font-medium">
              {message}
            </p>
            <button
              onClick={() => router.push('/login')}
              className="mt-4 px-6 py-3 bg-zinc-950 hover:bg-[#C5A044] text-white text-xs font-mont uppercase tracking-widest font-bold rounded-xl transition-colors cursor-pointer"
            >
              Retour à la page de connexion
            </button>
          </div>
        )}

      </motion.div>
    </div>
  );
}

export default function OAuthCallbackPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#FAF8F5] flex items-center justify-center font-mont">
        <div className="w-8 h-8 border-2 border-[#C5A044] border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <CallbackContent />
    </Suspense>
  );
}
