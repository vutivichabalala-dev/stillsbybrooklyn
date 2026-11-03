import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export default function MobileBookingBar() {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden px-4 pb-4 pt-2 bg-gradient-to-t from-black/90 to-transparent pointer-events-none">
      <Link
        to="/booking"
        className="pointer-events-auto flex items-center justify-center gap-2 w-full py-4 bg-gold text-black text-xs font-montserrat font-black tracking-[0.2em] uppercase rounded-sm shadow-[0_4px_24px_rgba(186,106,119,0.4)] hover:bg-gold/90 transition-colors duration-200"
      >
        Book a Session <ArrowRight size={14} />
      </Link>
    </div>
  );
}