import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export default function MeetBrooklynSection() {
  return (
    <section className="py-20 px-6 lg:px-10 max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-40px' }}
        transition={{ duration: 0.7 }}
        className="flex flex-col md:flex-row items-center gap-10 lg:gap-16"
      >
        {/* Photo */}
        <div className="w-full md:w-72 lg:w-80 shrink-0">
          <div className="relative aspect-[3/4] rounded-sm overflow-hidden">
            <img
              src="https://media.base44.com/images/public/69cfd090f016bb0f1b452639/514f378f7_VRN_0023.jpg"
              alt="Brooklyn — Photographer"
              className="w-full h-full object-cover object-center"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
          </div>
        </div>

        {/* Text */}
        <div className="flex flex-col gap-5 max-w-xl">
          <span className="text-gold text-xs font-montserrat font-semibold tracking-[0.3em] uppercase">The Photographer</span>
          <h2 className="text-3xl md:text-4xl font-montserrat font-bold text-white leading-tight">
            Meet Brooklyn
          </h2>
          <p className="text-white/55 text-sm font-montserrat font-light leading-relaxed">
            Based in Midrand, Johannesburg, Brooklyn is a visual storyteller with a deep passion for capturing authentic moments. With over 3 years of professional experience across weddings, corporate, portrait, and graduation photography, every session is approached with intention, creativity, and care.
          </p>
          <p className="text-white/40 text-sm font-montserrat font-light leading-relaxed">
            Brooklyn's approach is rooted in building genuine connection with every client — because the best photos happen when people feel at ease, not posed. Available nationwide across South Africa.
          </p>
          <Link
            to="/about"
            className="inline-flex items-center gap-2 text-gold text-xs font-montserrat font-bold tracking-[0.2em] uppercase hover:gap-3 transition-all duration-200 w-fit"
          >
            Read More <ArrowRight size={13} />
          </Link>
        </div>
      </motion.div>
    </section>
  );
}