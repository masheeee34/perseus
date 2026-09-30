/**
 * Logic centralisée pour le programme de fidélité Perseus
 */

export const VIP_TIERS = [
  { 
    id: 'standard', 
    name: 'Initié', 
    minPoints: 0, 
    color: 'text-gray-400', 
    border: 'border-gray-800', 
    gradient: 'from-gray-800 to-gray-900' 
  },
  { 
    id: 'silver', 
    name: 'Argent', 
    minPoints: 1000, 
    color: 'text-gray-300', 
    border: 'border-gray-500', 
    gradient: 'from-gray-400 to-gray-600' 
  },
  { 
    id: 'gold', 
    name: 'Or', 
    minPoints: 5000, 
    color: 'text-gold', 
    border: 'border-gold', 
    gradient: 'from-yellow-400 to-yellow-600' 
  },
  { 
    id: 'black', 
    name: 'Perseus Noir', 
    minPoints: 20000, 
    color: 'text-white', 
    border: 'border-white', 
    gradient: 'from-gray-100 to-gray-300' 
  },
] as const;

export type VIPLevel = typeof VIP_TIERS[number]['id'];

/**
 * Calcule le niveau VIP en fonction des points
 */
export function calculateVIPLevel(points: number): VIPLevel {
  const tier = [...VIP_TIERS].reverse().find(t => points >= t.minPoints);
  return (tier?.id as VIPLevel) || 'standard';
}

/**
 * Récupère les détails d'un palier par son ID
 */
export function getTierById(id: string) {
  return VIP_TIERS.find(t => t.id === id) || VIP_TIERS[0];
}

/**
 * Récupère le palier actuel
 */
export function getCurrentTier(points: number) {
  return [...VIP_TIERS].reverse().find((t) => points >= t.minPoints) || VIP_TIERS[0];
}

/**
 * Récupère le prochain palier
 */
export function getNextTier(points: number) {
  return VIP_TIERS.find(t => points < t.minPoints) || null;
}
