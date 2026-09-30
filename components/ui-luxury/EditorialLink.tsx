import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

interface EditorialLinkProps {
  href: string;
  children: React.ReactNode;
  variant?: 'gold' | 'light' | 'dark';
  className?: string;
}

export default function EditorialLink({
  href,
  children,
  variant = 'gold',
  className = '',
}: EditorialLinkProps) {
  const variantStyles = {
    gold: 'text-gold border-gold/40 hover:border-gold hover:text-gold-light',
    light: 'text-white/90 border-white/40 hover:border-white hover:text-white',
    dark: 'text-ink border-ink/30 hover:border-ink hover:text-black',
  };

  return (
    <Link
      href={href}
      className={`group inline-flex items-center gap-3 font-mont uppercase tracking-[0.35em] text-[10px] sm:text-[11px] font-light border-b-[0.5px] pb-1.5 transition-all duration-300 ${variantStyles[variant]} ${className}`}
    >
      <span>{children}</span>
      <ArrowRight className="w-3.5 h-3.5 stroke-[1.5] transition-transform duration-300 group-hover:translate-x-1.5" />
    </Link>
  );
}
