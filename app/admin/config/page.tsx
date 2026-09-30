'use client';

import React, { useState, useEffect } from 'react';
import { Shield, Globe, Save, Loader2, CheckCircle2 } from 'lucide-react';

export default function AdminConfigPage() {
  const [maintenance, setMaintenance] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    async function fetchConfig() {
      try {
        const token = localStorage.getItem('perseus_token');
        const res = await fetch('/api/admin/config', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();
        if (data.maintenance_mode === 'true') {
          setMaintenance(true);
        }
      } catch (err) {
        console.error('Failed to load config');
      } finally {
        setLoading(false);
      }
    }
    fetchConfig();
  }, []);

  const handleToggleMaintenance = async () => {
    const newValue = !maintenance;
    setMaintenance(newValue);
    // On sauvegarde immédiatement pour ce switch critique
    saveSetting('maintenance_mode', String(newValue));
  };

  const saveSetting = async (key: string, value: string) => {
    setSaving(true);
    try {
      const token = localStorage.getItem('perseus_token');
      await fetch('/api/admin/config', {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ key, value })
      });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 2000);
    } catch (err) {
      console.error('Failed to save setting');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
     return (
       <div className="p-20 flex justify-center">
         <Loader2 className="w-6 h-6 animate-spin text-gold" />
       </div>
     );
  }

  return (
    <div className="space-y-12 animate-in fade-in duration-700">
      
      {/* Header Area */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="font-playfair text-3xl font-bold tracking-[0.1em] text-white">Configuration Système</h1>
          <p className="text-white/30 text-[10px] uppercase tracking-[0.4em] mt-3">
            Architecture & Sécurité de la Maison <span className="text-gold">Perseus</span>
          </p>
        </div>
        {success && (
          <div className="flex items-center gap-2 text-green-500 animate-in fade-in slide-in-from-right-4">
            <CheckCircle2 className="w-4 h-4" />
            <span className="text-[10px] font-bold uppercase tracking-widest">Modifications enregistrées</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        
        {/* General Settings */}
        <div className="space-y-8 bg-[#0A0A0A] border border-white/5 p-10 rounded-sm">
           <div className="flex items-center gap-4 text-white">
              <Globe className="w-5 h-5 text-gold" />
              <h3 className="text-xs font-bold uppercase tracking-widest italic">Paramètres Généraux</h3>
           </div>

           <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] uppercase font-bold text-white/20 tracking-widest">Nom de la Boutique</label>
                <input type="text" defaultValue="Perseus Haute Joaillerie" className="w-full bg-[#050505] border border-white/5 p-4 text-xs text-white/60 focus:border-gold/40 outline-none transition-colors" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase font-bold text-white/20 tracking-widest">Email de Contact Client</label>
                <input type="text" defaultValue="conciergerie@perseus.com" className="w-full bg-[#050505] border border-white/5 p-4 text-xs text-white/60 focus:border-gold/40 outline-none transition-colors" />
              </div>
           </div>
        </div>

        {/* Security Settings */}
        <div className="space-y-8 bg-[#0A0A0A] border border-white/5 p-10 rounded-sm">
           <div className="flex items-center gap-4 text-white">
              <Shield className="w-5 h-5 text-blue-500" />
              <h3 className="text-xs font-bold uppercase tracking-widest italic">Sécurité & API</h3>
           </div>

           <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] uppercase font-bold text-white/20 tracking-widest">Accès Client</label>
                <div 
                   onClick={handleToggleMaintenance}
                   className="flex items-center justify-between p-4 bg-white/[0.02] border border-white/5 cursor-pointer hover:bg-white/[0.04] transition-all group"
                >
                   <div>
                      <p className="text-[10px] font-bold text-white uppercase tracking-widest">Mode Maintenance</p>
                      <p className="text-[8px] text-white/30 uppercase mt-1">Désactiver l'accès public à la boutique</p>
                   </div>
                   <div className={`w-10 h-5 rounded-full relative transition-colors duration-500 ${maintenance ? 'bg-gold' : 'bg-white/10'}`}>
                      <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all duration-500 ${maintenance ? 'left-6 shadow-[0_0_10px_rgba(255,255,255,0.4)]' : 'left-1 opacity-40'}`} />
                   </div>
                </div>
              </div>
              <div className="space-y-2 pt-4 opacity-50">
                <label className="text-[10px] uppercase font-bold text-white/20 tracking-widest">Token Discord Bridge</label>
                <input type="password" value="••••••••••••••••" readOnly className="w-full bg-[#050505] border border-white/5 p-4 text-xs text-white/30 outline-none cursor-not-allowed" />
              </div>
           </div>
        </div>

      </div>

      {/* Footer Actions */}
      <div className="flex justify-end pt-12 border-t border-white/5">
         <button className="flex items-center gap-3 bg-white text-black px-12 py-4 rounded-sm font-bold text-[10px] tracking-[0.3em] uppercase hover:bg-gold hover:text-white transition-all shadow-2xl disabled:opacity-50" disabled={saving}>
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} 
            Sauvegarder les réglages
         </button>
      </div>

    </div>
  );
}
