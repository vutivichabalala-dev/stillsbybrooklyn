// The "sb." monogram and spaced wordmark from the rate card, set in type so it
// stays crisp at any size and works on dark or light backgrounds.
export default function Logo({ compact = false, className = '' }) {
  return (
    <span className={`inline-flex items-baseline gap-3 sm:gap-[18px] ${className}`}>
      <span
        className={`font-lato font-black leading-none tracking-[-0.05em] ${compact ? 'text-[34px]' : 'text-[38px] md:text-[44px]'}`}
      >
        sb<span className="text-gold">.</span>
      </span>
      <span className="hidden sm:inline font-lato text-[11px] md:text-[12px] tracking-[0.42em] whitespace-nowrap">
        STILLS BY BR<span className="text-gold">OO</span>KLYN
      </span>
    </span>
  );
}
