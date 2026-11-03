import { useSeo } from '@/lib/seo';
import { corePages } from '@/content/corePages';
import { Link } from 'react-router-dom';
import { ArrowRight, Camera, Award, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';
import GlassCard from '../components/GlassCard';

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-60px' },
  transition: { duration: 0.7, ease: 'easeOut', delay },
});

export default function About() {
  useSeo(corePages.about);

  return (
    <div className="min-h-screen bg-background">

      {/* ── HERO SPLIT ─────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex items-center overflow-hidden">

        {/* Subtle gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#1A1718] via-background to-[#141213]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_60%_50%,rgba(198,191,180,0.06),transparent)]" />

        {/* Portrait — right side, full height */}
        <motion.div
          initial={{ opacity: 0, x: 60 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="absolute right-0 top-0 bottom-0 w-[52%] hidden md:block"
        >
          <img
            src="https://media.base44.com/images/public/69cfd090f016bb0f1b452639/514f378f7_VRN_0023.jpg"
            alt="Brooklyn — Photographer"
            className="w-full h-full object-cover object-center"
          />
          {/* Fade left edge into background */}
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/30 to-transparent" />
          {/* Fade bottom */}
          <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent" />
        </motion.div>

        {/* Text — left side */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-10 py-40 w-full">
          <div className="max-w-xl">

            <motion.h1
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-gold text-xs font-montserrat font-semibold tracking-[0.35em] uppercase block mb-6 leading-relaxed"
            >
              {corePages.about.h1}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="text-5xl md:text-6xl lg:text-7xl font-montserrat font-black text-white leading-[1.05] mb-8"
            >
              We create images<br />
              <span className="text-gold">that tell your</span><br />
              story.
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.35 }}
              className="text-white/55 text-sm font-montserrat font-light leading-relaxed mb-4"
            >
              Based in Midrand, South Africa, Brooklyn is a passionate visual storyteller with a keen eye for authentic moments and cinematic light. With expertise spanning corporate, portrait, and wedding photography, every session is approached with intentionality and artistic precision.
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.45 }}
              className="text-white/40 text-sm font-montserrat font-light leading-relaxed mb-10"
            >
              Great photography is not about equipment — it's about connection. By building genuine rapport with every client, Brooklyn captures the real, unscripted moments that define a story.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.55 }}
              className="flex items-center gap-4 flex-wrap"
            >
              <Link
                to="/booking"
                className="inline-flex items-center gap-2 px-8 py-3.5 bg-gold text-black text-xs font-montserrat font-bold tracking-[0.2em] uppercase hover:bg-gold/90 transition-colors duration-300"
              >
                Book a Session <ArrowRight size={13} />
              </Link>
              <Link
                to="/portfolio"
                className="inline-flex items-center gap-2 px-8 py-3.5 border border-white/20 text-white/70 text-xs font-montserrat font-medium tracking-[0.2em] uppercase hover:border-gold/50 hover:text-gold transition-all duration-300"
              >
                View Portfolio
              </Link>
            </motion.div>

            {/* Stats row */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
              className="flex gap-10 mt-16 pt-10 border-t border-white/10"
            >
              {[
                { value: '3+', label: 'Years Experience' },
                { value: '200+', label: 'Sessions' },
                { value: '100%', label: 'Satisfaction' },
              ].map((stat) => (
                <div key={stat.label} className="flex flex-col gap-1">
                  <span className="text-gold text-2xl font-montserrat font-black">{stat.value}</span>
                  <span className="text-white/35 text-[10px] font-montserrat tracking-widest uppercase">{stat.label}</span>
                </div>
              ))}
            </motion.div>

            {/* Location badge */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="flex items-center gap-2 mt-8 text-white/30 text-xs font-montserrat tracking-wider"
            >
              <MapPin size={12} className="text-gold" />
              Midrand, South Africa · Available Nationwide
            </motion.div>
          </div>
        </div>

        {/* Mobile portrait */}
        <div className="absolute bottom-0 right-0 w-full h-72 md:hidden">
          <img
            src="https://media.base44.com/images/public/69cfd090f016bb0f1b452639/514f378f7_VRN_0023.jpg"
            alt="Brooklyn"
            className="w-full h-full object-cover object-top"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-transparent" />
        </div>
      </section>

      {/* ── VALUES ─────────────────────────────────────────────────── */}
      <section className="py-24 px-6 lg:px-10 max-w-7xl mx-auto">
        <motion.div {...fadeUp(0)} className="mb-14 text-center flex flex-col items-center">
          <span className="text-gold text-xs font-montserrat font-semibold tracking-[0.35em] uppercase block mb-4">Core Values</span>
          <h2 className="text-3xl md:text-4xl font-montserrat font-bold text-white mb-4">The Approach</h2>
          <p className="text-white/40 text-sm font-montserrat font-light max-w-md">Every photograph is a collaboration. Here's what you can always expect.</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { icon: <Camera size={18} className="text-gold" />, title: 'Artistic Vision', desc: 'A consistent aesthetic rooted in cinematic light, natural tones, and meaningful composition.' },
            { icon: <Award size={18} className="text-gold" />, title: 'Professional Excellence', desc: 'Punctual, prepared, and fully equipped. Every session executed to the highest standard.' },
            { icon: <MapPin size={18} className="text-gold" />, title: 'Nationwide Reach', desc: 'Based in Midrand, but available across South Africa for any project, any location.' },
          ].map((item, i) => (
            <motion.div key={item.title} {...fadeUp(i * 0.12)}>
              <GlassCard hover className="p-10 flex flex-col gap-4 h-full">
                <div className="w-10 h-10 border border-gold/30 flex items-center justify-center">
                  {item.icon}
                </div>
                <h4 className="text-white font-montserrat font-semibold tracking-wider text-sm uppercase">{item.title}</h4>
                <p className="text-white/50 text-xs font-montserrat font-light leading-relaxed">{item.desc}</p>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}