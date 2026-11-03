export default function GlassCard({ children, className = '', hover = false }) {
  return (
    <div
      className={`
        relative rounded-2xl border border-white/10
        bg-white/5
        shadow-[0_8px_32px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.08)]
        ${hover ? 'transition-colors duration-300 hover:border-gold/30 hover:bg-white/8' : ''}
        ${className}
      `}
    >
      {children}
    </div>
  );
}