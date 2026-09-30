import React from 'react';
import Link from 'next/link';

interface GhostButtonProps {
  children: React.ReactNode;
  href?: string;
  onClick?: () => void;
  className?: string;
  icon?: React.ReactNode;
}

export default function GhostButton({
  children,
  href,
  onClick,
  className = '',
  icon
}: GhostButtonProps) {
  const baseClasses = `ghost-btn-subtle ${className}`;

  if (href) {
    return (
      <Link href={href} className={baseClasses}>
        <span>{children}</span>
        {icon}
      </Link>
    );
  }

  return (
    <button onClick={onClick} className={baseClasses}>
      <span>{children}</span>
      {icon}
    </button>
  );
}
