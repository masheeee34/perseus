import PerseusFiveMApp from '../../components/mobile/PerseusFiveMApp';
import type { Metadata, Viewport } from 'next';

export const metadata: Metadata = {
  title: 'Perseus Mobile — Portola Drive',
  description: 'Application officielle Maison Perseus pour smartphone FiveM GTA:W',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
};

export default function MobilePage() {
  return (
    <div className="min-h-screen bg-[#0C0C0E] flex items-center justify-center sm:py-6 sm:px-4">
      {/* Container smartphone : 100% plein écran sur téléphone in-game (<640px), et cadre iPhone réaliste sur PC */}
      <div className="w-full sm:max-w-[420px] min-h-screen sm:min-h-[850px] sm:max-h-[900px] bg-white sm:rounded-[50px] sm:border-[8px] sm:border-[#222225] sm:shadow-[0_25px_80px_rgba(0,0,0,0.85)] relative overflow-hidden flex flex-col">
        {/* Dynamic Island / Encoche haut sur aperçu PC */}
        <div className="hidden sm:block absolute top-3 left-1/2 -translate-x-1/2 w-28 h-6 bg-black rounded-full z-50 pointer-events-none shadow-xs" />
        <PerseusFiveMApp />
      </div>
    </div>
  );
}
