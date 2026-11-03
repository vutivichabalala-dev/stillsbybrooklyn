import { motion } from 'framer-motion';
import GlassCard from './GlassCard';

const testimonials = [
  {
    quote: "Brooklyn captured our wedding day perfectly. Every photo tells a story — we've been showing them to everyone. Absolutely worth every cent.",
    name: "Nomsa & Sipho M.",
    service: "Wedding Photography",
  },
  {
    quote: "Our team headshots came out incredibly professional. Brooklyn made everyone feel relaxed and the turnaround was super fast. Will definitely book again.",
    name: "Thabo K.",
    service: "Corporate Photography",
  },
  {
    quote: "I was nervous about my portrait session but Brooklyn made it so easy. The photos are stunning — I finally have images I'm proud to use.",
    name: "Lerato D.",
    service: "Portrait Session",
  },
];

export default function TestimonialsSection() {
  return (
    <section className="py-20 px-6 lg:px-10 max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-40px' }}
        transition={{ duration: 0.6 }}
        className="text-center mb-12"
      >
        <span className="text-gold text-xs font-montserrat font-semibold tracking-[0.3em] uppercase block mb-3">Client Stories</span>
        <h2 className="text-2xl md:text-3xl font-montserrat font-bold text-white">What Clients Say</h2>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {testimonials.map((t, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.6, delay: i * 0.1 }}
          >
            <GlassCard hover className="p-8 h-full flex flex-col gap-5">
              <div className="flex gap-1">
                {[...Array(5)].map((_, j) => (
                  <span key={j} className="text-gold text-sm">★</span>
                ))}
              </div>
              <p className="text-white/65 text-sm font-montserrat font-light leading-relaxed flex-1 italic">
                "{t.quote}"
              </p>
              <div>
                <p className="text-white font-montserrat font-semibold text-sm">{t.name}</p>
                <p className="text-gold/60 text-[10px] font-montserrat tracking-[0.2em] uppercase mt-0.5">{t.service}</p>
              </div>
            </GlassCard>
          </motion.div>
        ))}
      </div>
    </section>
  );
}