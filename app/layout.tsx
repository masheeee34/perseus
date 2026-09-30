import type { Metadata, Viewport } from 'next';
import { Bodoni_Moda, Playfair_Display, Cormorant_Garamond, Montserrat, Pinyon_Script } from 'next/font/google';
import './globals.css';
import { CartProvider } from '../lib/contexts/CartContext';
import { WishlistProvider } from '../lib/contexts/WishlistContext';
import ExperienceProvider from '../lib/providers/ExperienceProvider';
import Header from '../components/Header';
import Footer from '../components/Footer';
import DynamicWidgets from '../lib/providers/DynamicWidgets';

const bodoni = Bodoni_Moda({
  subsets: ['latin'],
  variable: '--font-bodoni',
  weight: ['400', '500', '600', '700', '800', '900'],
  style: ['normal', 'italic'],
  display: 'swap',
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  weight: ['400', '500', '600', '700', '800', '900'],
  style: ['normal', 'italic'],
  display: 'swap',
});

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  variable: '--font-cormorant-garamond',
  weight: ['300', '400', '500', '600', '700'],
  style: ['normal', 'italic'],
  display: 'swap',
});

const montserrat = Montserrat({
  subsets: ['latin'],
  variable: '--font-montserrat',
  weight: ['100', '300', '400', '500', '700', '900'],
  display: 'swap',
});

const pinyon = Pinyon_Script({
  subsets: ['latin'],
  variable: '--font-pinyon-script',
  weight: '400',
  display: 'swap',
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
};

export const metadata: Metadata = {
  title: 'PERSEUS — Haute Joaillerie & Horlogerie | Portola Drive',
  description:
    'Maison de haute joaillerie, horlogerie et maroquinerie de luxe sur Portola Drive, Los Santos.',
  icons: { icon: '/favicon.ico' },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="fr"
      className={`${bodoni.variable} ${playfair.variable} ${cormorant.variable} ${montserrat.variable} ${pinyon.variable} scroll-smooth`}
    >
      <body className="antialiased bg-canvas text-ink relative min-h-screen selection:bg-gold-light selection:text-white">
        <ExperienceProvider>
          <WishlistProvider>
            <CartProvider>
              <Header />
              <main className="min-h-screen">{children}</main>
              <Footer />
              <DynamicWidgets />
            </CartProvider>
          </WishlistProvider>
        </ExperienceProvider>
      </body>
    </html>
  );
}
