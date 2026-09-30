/**
 * PERSEUS MAISON — DICTIONNAIRE CHROMATIQUE HAUTE JOAILLERIE (2026)
 * Canvas Lumineux Blanc Albâtre, Encre de Chine & Or Solaire Poli
 */

export const LUXURY_TOKENS = {
  colors: {
    // Toile de fond : Blanc Albâtre Lumineux & Soie d'Atelier
    canvas: {
      DEFAULT: '#FBF9F5',
      pure: '#FFFFFF',
      warm: '#F4EFE6',
      soft: '#EBE5D8',
    },
    // Encre Typographique Haute Couture
    ink: {
      DEFAULT: '#121110',
      pure: '#000000',
      muted: '#4A4845',
      faint: '#8A8680',
    },
    // Or Solaire Poli (Accents précieux & signatures)
    gold: {
      DEFAULT: '#B8861E',
      light: '#D4AF37',
      bright: '#E5B842',
      pale: 'rgba(184, 134, 30, 0.08)',
    },
    // Gemmes Vives (Accents de collection)
    gemstones: {
      sapphire: '#162F65',
      emerald: '#064E3B',
      ruby: '#881337',
    },
  },
  typography: {
    serifVogue: 'var(--font-bodoni), var(--font-playfair), serif',
    sansClean: 'var(--font-montserrat), sans-serif',
    scriptSignature: 'var(--font-pinyon-script), cursive',
  },
} as const;
