'use client';

import dynamic from 'next/dynamic';
import { usePathname } from 'next/navigation';

const EasterEgg = dynamic(() => import("../../components/EasterEgg"), { ssr: false });
const ChatWidget = dynamic(() => import("../../components/ChatWidget"), { ssr: false });

export default function DynamicWidgets() {
  const pathname = usePathname();

  if (pathname?.startsWith('/admin') || pathname === '/app' || pathname === '/mobile') {
    return null;
  }

  return (
    <>
      <EasterEgg />
      <ChatWidget />
    </>
  );
}
