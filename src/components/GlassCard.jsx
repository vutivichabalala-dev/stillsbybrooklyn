// Gallery edition: flat, square, hairline-bordered panels (no glass blur)
export default function GlassCard({ children, className = '', hover = false }) {
  return (
    <div
      className={`
        relative border border-white/10 bg-white/[0.025]
        ${hover ? 'transition-colors duration-500 hover:border-gold/40 hover:bg-white/[0.045]' : ''}
        ${className}
      `.replace(/rounded-(2xl|xl|lg)/g, '')}
    >
      {children}
    </div>
  );
}
