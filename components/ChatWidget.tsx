'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, User, ShieldCheck } from 'lucide-react';
import { usePathname } from 'next/navigation';
import PerseusAPI from '../lib/api';
import { User as UserType } from '../lib/types';

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ author: string; text: string; timestamp: string; isSelf: boolean }[]>([]);
  const [input, setInput] = useState('');
  const [sessionId, setSessionId] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [currentUser, setCurrentUser] = useState<UserType | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  // Masquer le chat sur l'app mobile FiveM, la page de présentation et de maintenance
  if (pathname === '/presentation' || pathname === '/app' || pathname === '/mobile') return null;
  
  if (pathname === '/maintenance') {
     const user = PerseusAPI.getUser();
     if (user?.role !== 'admin') return null;
  }

  // Initial setup
  useEffect(() => {
    // Generate simple sessionId
    let sid = localStorage.getItem('perseus_chat_sid');
    if (!sid) {
      sid = Math.random().toString(36).substring(7);
      localStorage.setItem('perseus_chat_sid', sid);
    }
    setSessionId(sid);

    // Get user info
    const user = PerseusAPI.getUser();
    setCurrentUser(user);

    // Initial Welcome
    setMessages([{
      author: 'PERSEUS Support',
      text: user 
        ? `Bienvenue M. ${user.name}. Un conseiller est à votre disposition en priorité. Comment puis-je vous aider ?` 
        : 'Bienvenue chez Perseus. Un conseiller est à votre disposition. Comment puis-je vous aider ?',
      timestamp: new Date().toISOString(),
      isSelf: false
    }]);
  }, []);

  // Polling for replies
  useEffect(() => {
    if (!sessionId) return;
    
    let failCount = 0;
    const interval = isOpen ? 3000 : 10000; // 3s si ouvert, 10s si fermé

    const poll = async () => {
      if (failCount > 5) return; // Arrête de spammer si le bridge est offline

      try {
        const isLocal = typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');
        const bridgeUrl = isLocal ? 'http://127.0.0.1:3001' : '/bridge';
        
        const res = await fetch(`${bridgeUrl}/poll/${sessionId}`, {
          signal: AbortSignal.timeout(3000)
        });
        
        if (!res.ok) throw new Error('Bridge unreachable');
        
        const data = await res.json();
        failCount = 0; // Reset au succès

        if (data.messages && data.messages.length > 0) {
          setMessages(prev => [...prev, ...data.messages.map((m: any) => ({ ...m, isSelf: false }))]);
        }
      } catch (e) {
        failCount++;
      }
    };

    const timer = setInterval(poll, interval);
    if (isOpen) poll(); 

    return () => clearInterval(timer);
  }, [isOpen, sessionId]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const newMsg = {
      author: 'Client',
      text: input,
      timestamp: new Date().toISOString(),
      isSelf: true
    };

    setMessages(prev => [...prev, newMsg]);
    const currentInput = input;
    setInput('');

    try {
      const bridgeUrl = typeof window !== 'undefined' && window.location.hostname === 'localhost' 
        ? 'http://127.0.0.1:3001' 
        : '/bridge';

      await fetch(`${bridgeUrl}/send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          userName: currentUser ? currentUser.name : 'Invité Anonyme',
          message: currentInput
        })
      });
    } catch (e) {
      console.error('Chat Bridge Offline');
    }
  };

  return (
    <div className="fixed bottom-8 right-8 z-[900] font-mont">
      {/* Floating Toggle Bubble */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.05 }}
            onClick={() => setIsOpen(true)}
            className="w-12 h-12 rounded-full bg-black/60 backdrop-blur-md flex items-center justify-center text-gold border-[0.5px] border-gold/60 hover:border-gold hover:bg-gold/10 transition-all duration-500"
          >
            <MessageSquare className="w-5 h-5 stroke-[1.5]" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ y: 100, opacity: 0, scale: 0.9 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 100, opacity: 0, scale: 0.9 }}
            className="fixed bottom-6 right-4 sm:bottom-8 sm:right-8 w-[calc(100vw-32px)] sm:w-[380px] h-[550px] max-h-[80vh] bg-black/80 backdrop-blur-2xl border border-white/10 shadow-[0_20px_60px_rgba(0,0,0,0.8)] flex flex-col overflow-hidden rounded-2xl"
          >
            {/* Header */}
            <header className="p-6 bg-dark-100 border-b border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-gold/10 border border-gold/40 flex items-center justify-center">
                  <User className="w-5 h-5 text-gold" />
                </div>
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-widest text-white">Conciergerie</h3>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-[9px] uppercase tracking-wider text-green-500/80 font-bold">Conseiller en ligne</span>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="text-white/40 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </header>

            {/* Messages Body */}
            <div 
              ref={scrollRef}
              className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar bg-gradient-to-b from-transparent to-black/20"
            >
              <div className="flex items-center gap-2 mb-6 p-3 bg-gold/5 border border-gold/10 rounded-lg">
                <ShieldCheck className="w-4 h-4 text-gold flex-shrink-0" />
                <p className="text-[8px] uppercase tracking-widest text-gold/60 leading-relaxed font-bold">
                  Discussion confidentielle • Chiffrée par le protocole Perseus
                </p>
              </div>

              {messages.map((m, i) => (
                <motion.div
                  initial={{ x: m.isSelf ? 20 : -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  key={i}
                  className={`flex ${m.isSelf ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[85%] p-4 text-[11px] leading-relaxed tracking-wider shadow-xl ${
                    m.isSelf 
                      ? 'bg-white text-black font-medium' 
                      : 'bg-dark-100/50 border border-white/5 text-gray-200 backdrop-blur-sm'
                  } rounded-xl`}>
                    {m.text}
                  </div>
                </motion.div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                   <div className="bg-dark-100 p-4 rounded-xl flex gap-1">
                      <div className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce" />
                      <div className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce delay-100" />
                      <div className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce delay-200" />
                   </div>
                </div>
              )}
            </div>

            {/* Input Area */}
            <div className="p-6 bg-dark-100/30 border-t border-white/5">
              <div className="relative flex items-center">
                <input 
                  type="text" 
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Votre demande..."
                  className="w-full bg-black/40 border border-white/10 text-white text-xs px-6 py-4 outline-none focus:border-gold transition-all font-mont pr-14"
                />
                <button 
                  onClick={handleSend}
                  className="absolute right-4 text-gray-500 hover:text-gold transition-colors"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
              <p className="text-[7px] uppercase tracking-[0.2em] text-center mt-4 text-white/20 font-bold">
                Maison Perseus — Support en direct
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
