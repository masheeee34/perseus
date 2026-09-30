import React from 'react';
import Link from 'next/link';

interface GoldButtonProps {
  children: React.ReactNode;
  href?: string;
  onClick?: () => void;
  type?: 'button' | 'submit';
  className?: string;
  icon?: React.ReactNode;
}

export default function GoldButton({
  children,
  href,
  onClick,
  type = 'button',
  className = '',
  icon
}: GoldButtonProps) {
  const baseClasses = `ghost-btn-luxury ${className}`;

  if (href) {
    return (
      <Link href={href} className={baseClasses}>
        <span>{children}</span>
        {icon}
      </Link>
    );
  }

  return (
    <button type={type} onClick={onClick} className={baseClasses}>
      <span>{children}</span>
      {icon}
    </button>
  );
}
