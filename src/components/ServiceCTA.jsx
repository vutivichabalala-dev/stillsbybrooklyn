import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import GlassCard from './GlassCard';

export default function ServiceCTA({ title, subtitle }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.6 }}
      className="py-20 px-6"
    >
      <div className="max-w-2xl mx-auto text-center">
        <GlassCard className="px-10 py-14">
          <h2 className="text-2xl md:text-3xl font-montserrat font-bold text-white mb-4">
            {title || 'Ready to book your session?'}
          </h2>
          <p className="text-white/45 text-sm font-montserrat font-light leading-relaxed mb-8">
            {subtitle || "Let's create something beautiful together."}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to="/booking"
              className="inline-flex items-center justify-center gap-2 px-10 py-4 bg-gold text-black text-xs font-montserrat font-black tracking-[0.2em] uppercase transition-all duration-300 hover:bg-gold/90 rounded-sm"
            >
              Book a Session <ArrowRight size={13} />
            </Link>
            <Link
              to="/pricing"
              className="inline-flex items-center justify-center gap-2 px-10 py-4 border border-white/20 text-white/60 text-xs font-montserrat font-bold tracking-[0.2em] uppercase transition-all duration-300 hover:border-gold/50 hover:text-gold rounded-sm"
            >
              View Pricing
            </Link>
          </div>
        </GlassCard>
      </div>
    </motion.section>
  );
}