interface GoldDividerProps {
  width?: string;
  className?: string;
}

export default function GoldDivider({ width = 'w-16', className = '' }: GoldDividerProps) {
  return <div className={`${width} h-px bg-gold/25 mx-auto ${className}`} />;
}
