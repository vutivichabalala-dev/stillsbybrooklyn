import { Link, useLocation } from 'react-router-dom';

export default function MobileBookingBar() {
  const { pathname } = useLocation();
  if (pathname === '/booking') return null;
  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 md:hidden px-4 pb-4 pt-6 bg-gradient-to-t from-background via-background/80 to-transparent pointer-events-none">
      <Link
        to="/booking"
        className="pointer-events-auto flex items-center justify-center gap-3 w-full min-h-[52px] bg-white text-black font-lato text-[11px] font-bold tracking-[0.26em] uppercase"
      >
        Book a session <span className="text-gold text-base leading-none">→</span>
      </Link>
    </div>
  );
}
