import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        serif: ['var(--font-bodoni)', 'var(--font-playfair)', 'serif'],
        bodoni: ['var(--font-bodoni)', 'serif'],
        playfair: ['var(--font-playfair)', 'serif'],
        cormorant: ['var(--font-cormorant-garamond)', 'serif'],
        mont: ['var(--font-montserrat)', 'sans-serif'],
        pinyon: ['var(--font-pinyon-script)', 'cursive'],
      },
      colors: {
        canvas: {
          DEFAULT: '#FBF9F5',  // Blanc Albâtre / Soie d'Atelier
          pure: '#FFFFFF',     // Blanc Pur Galerie
          warm: '#F4EFE6',     // Écrin Chamois
          soft: '#EBE5D8',     // Bordure Douce
        },
        ink: {
          DEFAULT: '#121110',  // Noir Encre d'Imprimerie Vogue
          pure: '#000000',
          muted: '#4A4845',
          faint: '#8A8680',
        },
        gold: {
          DEFAULT: '#B8861E',  // Or Solaire Poli
          light: '#D4AF37',
          bright: '#E5B842',
          pale: 'rgba(184, 134, 30, 0.08)',
        },
        'liquid-gold': '#B8861E',
        sapphire: {
          DEFAULT: '#162F65',
          deep: '#0E1F42',
          vibrant: '#1D4ED8',
          pale: 'rgba(29, 78, 216, 0.08)',
        },
        ruby: {
          DEFAULT: '#881337',
          deep: '#4C0519',
          vibrant: '#BE123C',
          pale: 'rgba(190, 18, 60, 0.08)',
        },
        emerald: {
          DEFAULT: '#064E3B',
          deep: '#022C22',
          vibrant: '#047857',
          pale: 'rgba(4, 120, 87, 0.08)',
        },
      },
      letterSpacing: {
        'ultra-wide': '0.45em',
        'vogue': '0.3em',
        'editorial': '0.2em',
      },
    },
  },
  plugins: [],
};
export default config;
