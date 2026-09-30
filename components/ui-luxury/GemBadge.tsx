type GemColor = 'sapphire' | 'ruby' | 'emerald' | 'gold';

const colorMap: Record<GemColor, string> = {
  sapphire: 'bg-sapphire/20 text-sapphire-light border-sapphire/30',
  ruby: 'bg-ruby/20 text-ruby-light border-ruby/30',
  emerald: 'bg-emerald/20 text-emerald-light border-emerald/30',
  gold: 'bg-gold/10 text-gold border-gold/30',
};

interface GemBadgeProps {
  color: GemColor;
  children: React.ReactNode;
}

export default function GemBadge({ color, children }: GemBadgeProps) {
  return (
    <span className={`inline-block px-3 py-1 rounded-full border text-[9px] font-mont uppercase tracking-[0.2em] ${colorMap[color]}`}>
      {children}
    </span>
  );
}
