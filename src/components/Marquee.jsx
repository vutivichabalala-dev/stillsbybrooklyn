/**
 * Slow, endless strip of short phrases. The track is rendered twice and the CSS
 * animation (sb-marquee in index.css) slides it by exactly half its width, so
 * the loop is seamless. Pauses on hover; reduced-motion users see it still.
 */
export default function Marquee({ items, className = '' }) {
  const row = [...items, ...items];
  return (
    <div
      className={`sb-marquee overflow-hidden border-y border-white/10 py-5 select-none ${className}`}
      aria-label={items.join(', ')}
      role="marquee"
    >
      <div className="sb-marquee-track flex w-max items-center" aria-hidden="true">
        {row.map((item, i) => (
          <span key={i} className="flex items-center">
            <span className="font-cormorant italic text-[clamp(22px,2.6vw,34px)] text-white/80 whitespace-nowrap px-6">{item}</span>
            <span className="h-1.5 w-1.5 rounded-full bg-gold" />
          </span>
        ))}
      </div>
    </div>
  );
}
