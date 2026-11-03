import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const PRICING = {
  weddings: { label: 'Weddings', from: 'R6,500', note: 'Full-day packages from R12,000' },
  portraits: { label: 'Portraits', from: 'R800', note: 'Family & creative sessions from R3,000' },
  corporate: { label: 'Corporate', from: 'R1,500', note: 'Half-day brand packages from R3,500' },
  graduations: { label: 'Graduations', from: 'R700', note: 'Celebration packages from R1,500' },
};

export default function ServicePricing({ service }) {
  const info = PRICING[service];
  if (!info) return null;

  return (
    <div className="flex items-center justify-center flex-wrap gap-4 mt-6 mb-2">
      <div className="flex items-center gap-2 px-5 py-2.5 border border-gold/30 bg-gold/5 rounded-sm">
        <span className="text-white/50 text-xs font-montserrat tracking-wider">{info.label} from</span>
        <span className="text-gold text-lg font-montserrat font-black">{info.from}</span>
        <span className="text-white/30 text-[10px] font-montserrat">· {info.note}</span>
      </div>
      <Link
        to="/pricing"
        className="inline-flex items-center gap-1.5 text-gold/70 text-xs font-montserrat font-semibold tracking-[0.15em] uppercase hover:text-gold transition-colors duration-200"
      >
        View full pricing <ArrowRight size={11} />
      </Link>
    </div>
  );
}