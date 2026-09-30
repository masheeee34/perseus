'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingBag, 
  Settings, 
  LogOut, 
  ChevronRight,
  Menu,
  X,
  Bell,
  Clock,
  ExternalLink
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import PerseusAPI from '../../lib/api';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [showNotifications, setShowNotifications] = useState(false);
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const router = useRouter();
  const pathname = usePathname();
  const notifRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function checkAuth() {
      try {
        const u = await PerseusAPI.getProfile();
        if (!u || u.role !== 'admin') {
          router.push('/login?redirect=/admin');
          return;
        }
        setUser(u);
        setLoading(false);
        
        // Fetch recent orders for notifications
        const token = localStorage.getItem('perseus_token');
        const res = await fetch('/api/admin/orders', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();
        if (Array.isArray(data)) {
          setRecentOrders(data.slice(0, 5));
        }
      } catch (err) {
        router.push('/login?redirect=/admin');
      }
    }
    checkAuth();
  }, [router]);

  // Close notifications on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-gold/20 border-t-gold rounded-full animate-spin" />
      </div>
    );
  }

  const menuItems = [
    { name: 'Vue d\'ensemble', icon: LayoutDashboard, href: '/admin' },
    { name: 'Produits', icon: Package, href: '/admin/products' },
    { name: 'Commandes', icon: ShoppingBag, href: '/admin/orders' },
    { name: 'Configuration', icon: Settings, href: '/admin/config' },
  ];

  return (
    <div className="min-h-screen bg-[#050505] text-white flex overflow-hidden">
      
      {/* Sidebar */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-[100]
        w-80 bg-black border-r border-white/5 
        transition-transform duration-500 ease-[cubic-bezier(0.2,0.8,0.2,1)]
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="h-full flex flex-col">
          {/* Brand Header */}
          <div className="p-10 border-b border-white/5">
            <Link href="/" className="group inline-block">
              <div className="flex flex-col">
                <div className="relative h-12 w-auto mb-2">
                   <Image 
                     src="/asset/1.png" 
                     alt="Perseus" 
                     width={120} 
                     height={48} 
                     unoptimized 
                     className="h-full w-auto object-contain transition-all duration-500 group-hover:opacity-80" 
                   />
                </div>
                <div className="flex items-center gap-3 mt-1">
                   <div className="h-[1px] w-8 bg-gold/40" />
                   <span className="text-[9px] tracking-[0.4em] text-white/30 uppercase font-bold whitespace-nowrap">Admin Module</span>
                </div>
              </div>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-6 py-10 space-y-3 overflow-y-auto custom-scrollbar">
            {menuItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`
                    flex items-center gap-5 px-6 py-4 rounded-sm transition-all duration-300 group
                    ${isActive 
                      ? 'bg-white text-black shadow-[0_10px_30px_rgba(255,255,255,0.1)]' 
                      : 'text-white/30 hover:text-white hover:bg-white/5'}
                  `}
                >
                  <item.icon className={`w-5 h-5 ${isActive ? 'text-black' : 'group-hover:text-gold transition-colors duration-300'}`} />
                  <span className="text-[10px] font-bold tracking-[0.2em] uppercase">{item.name}</span>
                  {isActive && <motion.div layoutId="active-pill" className="ml-auto w-1.5 h-1.5 bg-black rounded-full" />}
                </Link>
              );
            })}
          </nav>

          {/* Footer User */}
          <div className="p-8 border-t border-white/5 bg-white/[0.01]">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-black border border-white/10 flex items-center justify-center font-playfair text-gold text-xl font-bold shadow-2xl">
                {user.name?.[0] || 'A'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[11px] font-bold tracking-[0.1em] truncate text-white uppercase">{user.name}</p>
                <div className="flex items-center gap-2 mt-1">
                   <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                   <p className="text-[8px] text-white/30 uppercase tracking-widest font-bold">Session Active</p>
                </div>
              </div>
            </div>
            <button 
              onClick={() => { PerseusAPI.logout(); router.push('/login'); }}
              className="w-full flex items-center justify-center gap-3 py-4 bg-red-500/5 hover:bg-red-500/10 border border-red-500/20 text-red-500/60 hover:text-red-500 transition-all text-[9px] font-bold tracking-[0.2em] uppercase"
            >
              <LogOut className="w-3.5 h-3.5" /> Terminer la session
            </button>
          </div>
        </div>
      </aside>

      {/* Main Container */}
      <main className="flex-1 flex flex-col min-w-0 bg-[#050505] relative h-screen">
        
        {/* Top Header */}
        <header className="h-24 border-b border-white/5 px-10 flex items-center justify-between z-40 bg-black/40 backdrop-blur-md">
          <div className="flex items-center gap-8">
            <button className="lg:hidden text-white/40 hover:text-white transition-colors" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
              {isSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
            
            <div className="hidden md:flex items-center gap-4">
              <Clock className="w-3.5 h-3.5 text-gold/50" />
              <p className="text-[10px] text-white/30 uppercase tracking-[0.3em] font-medium">
                {new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-8 relative" ref={notifRef}>
            <button 
              onClick={() => setShowNotifications(!showNotifications)}
              className={`relative p-3 rounded-full transition-all duration-300 ${showNotifications ? 'bg-gold text-black' : 'bg-white/5 text-white/40 hover:text-white hover:bg-white/10'}`}
            >
              <Bell className="w-5 h-5" />
              {recentOrders.length > 0 && !showNotifications && (
                <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-gold rounded-full border-2 border-black" />
              )}
            </button>

            {/* Notification Dropdown */}
            <AnimatePresence>
              {showNotifications && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute right-0 top-full mt-4 w-96 bg-[#0A0A0A] border border-white/10 shadow-2xl overflow-hidden rounded-sm"
                >
                  <div className="p-6 border-b border-white/5 bg-white/[0.02] flex items-center justify-between">
                    <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/60">Activités Récentes</h3>
                    <span className="text-[8px] px-2 py-1 bg-gold/10 text-gold font-bold rounded-sm uppercase tracking-widest">{recentOrders.length} Alertes</span>
                  </div>
                  <div className="max-h-96 overflow-y-auto divide-y divide-white/5">
                    {recentOrders.length === 0 ? (
                      <div className="p-10 text-center text-[10px] text-white/20 uppercase tracking-widest">Aucune notification</div>
                    ) : (
                      recentOrders.map((order: any) => (
                        <div key={order.id} className="p-5 hover:bg-white/[0.02] transition-colors cursor-pointer group" onClick={() => { router.push('/admin/orders'); setShowNotifications(false); }}>
                          <div className="flex justify-between items-start mb-1">
                            <p className="text-[10px] font-bold text-white group-hover:text-gold transition-colors">NOUVELLE COMMANDE</p>
                            <span className="text-[8px] text-white/20 font-mont px-1">{new Date(order.createdAt).toLocaleDateString()}</span>
                          </div>
                          <p className="text-[11px] text-white/50 leading-relaxed truncate uppercase tracking-tighter italic">Client: {order.user_name}</p>
                          <div className="flex items-center gap-2 mt-2">
                             <span className="text-gold font-bold text-xs">${Number(order.total).toLocaleString()}</span>
                             <div className="h-[1px] flex-1 bg-white/5" />
                             <ExternalLink className="w-3 h-3 text-white/20 group-hover:text-white" />
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                  <Link href="/admin/orders" onClick={() => setShowNotifications(false)} className="block p-4 text-center bg-white/[0.05] hover:bg-white text-[9px] hover:text-black font-bold uppercase tracking-[0.4em] transition-all">
                    Voir tout l&apos;historique
                  </Link>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </header>

        {/* Content View */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-12">
          <div className="max-w-[1400px] mx-auto animate-in fade-in duration-1000">
            {children}
          </div>
        </div>

      </main>
    </div>
  );
}
