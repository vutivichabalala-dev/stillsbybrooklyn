import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import React from 'react';
import { useSeo } from '@/lib/seo';
import { corePages } from '@/content/corePages';
import { locationNav } from '@/content/seoPages';
import SectionHeading from '../components/SectionHeading';
import GlassCard from '../components/GlassCard';
import HeroSlider from '../components/HeroSlider';
import BackToTop from '../components/BackToTop';
import WhatsAppButton from '../components/WhatsAppButton';
import HomeContactForm from '../components/HomeContactForm';
import TestimonialsSection from '../components/TestimonialsSection';
import MeetBrooklynSection from '../components/MeetBrooklynSection';

// Simple fade-up — works great on mobile too, no scroll-hijacking
const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-40px' },
  transition: { duration: 0.55, ease: 'easeOut', delay },
});

const categories = [
  {
    title: 'Corporate',
    description: 'Professional imagery that elevates your brand identity and communicates excellence.',
    slug: 'corporate',
    href: '/corporate-headshots-johannesburg',
  },
  {
    title: 'Portraits',
    description: 'Intimate, expressive portraits that reveal the authentic spirit of every individual.',
    slug: 'portraits',
    href: '/photography-studio-johannesburg',
  },
  {
    title: 'Weddings',
    description: 'Timeless storytelling for the most important day of your life.',
    slug: 'weddings',
    href: '/wedding-photographer-johannesburg',
  },
  {
    title: 'Graduations',
    description: 'Celebrate your milestone with beautiful, lasting graduation photography.',
    slug: 'graduations',
    href: '/graduation-photoshoot-johannesburg',
  },
];

const recentShots = [
  {
    url: 'https://media.base44.com/images/public/69cfd090f016bb0f1b452639/d0c463f82_DSC_4127.jpg',
    alt: 'Corporate executive portrait in luxury interior',
    category: 'Corporate',
  },
  {
    url: 'https://media.base44.com/images/public/69cfd090f016bb0f1b452639/a33532f67_DSC_4300.jpg',
    alt: 'Graduation portrait — cap and gown',
    category: 'Graduations',
  },
  {
    url: 'https://images.pixieset.com/224055201/8b064709835a34b21aba22f4a48f292b-large.jpg',
    alt: 'Portrait session — dramatic natural light',
    category: 'Portraits',
  },
];

export default function Home() {
  useSeo(corePages.home);

  return (
    <div className="bg-background relative">
      <BackToTop />
      <WhatsAppButton />
      <HeroSlider />

      {/* Specialties */}
      <section className="py-24 px-6 lg:px-10 max-w-7xl mx-auto relative z-10">
        <motion.div {...fadeUp(0)}>
          <span className="text-gold text-xs font-montserrat font-semibold tracking-[0.3em] uppercase">What I Do</span>
          <h2 className="text-3xl md:text-4xl font-montserrat font-bold text-white mb-10 mt-4">Photography and Video for Every Milestone</h2>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {categories.map((cat, i) => (
            <motion.div key={cat.slug} {...fadeUp(i * 0.07)}>
              <GlassCard hover className="p-8 h-full flex flex-col gap-4">
                <span className="text-gold text-2xl font-montserrat font-light">0{i + 1}</span>
                <div>
                  <h3 className="text-xl font-montserrat font-bold text-white mb-3">{cat.title}</h3>
                  <p className="text-white/50 text-xs font-montserrat font-light leading-relaxed">{cat.description}</p>
                </div>
                <Link
                  to={cat.href}
                  className="mt-auto inline-flex items-center justify-center px-5 py-2 border border-white/15 text-white/60 text-xs font-montserrat tracking-wider uppercase hover:border-gold/50 hover:text-gold transition-all duration-300 rounded-sm w-fit"
                >
                  Explore
                </Link>
              </GlassCard>
            </motion.div>
          ))}
        </div>

        <motion.div {...fadeUp(0.15)}>
          <p className="text-white/35 text-sm font-montserrat font-light text-center tracking-wider">
            Four disciplines, one singular vision — to create images that resonate long after the moment has passed.
          </p>
        </motion.div>
      </section>

      {/* Featured Work */}
      <section className="py-24 relative z-10">
        <div className="px-6 lg:px-10 max-w-7xl mx-auto">
          <motion.div {...fadeUp(0)} className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
            <div>
              <span className="text-gold text-xs font-montserrat font-semibold tracking-[0.3em] uppercase block mb-1">Featured Work</span>
              <h2 className="text-2xl font-montserrat font-bold text-white">Recent Sessions</h2>
              <p className="text-white/40 text-xs font-montserrat font-light mt-1 tracking-wider">A curated selection from recent projects.</p>
            </div>
            <Link
              to="/portfolio"
              className="inline-flex items-center gap-2 px-6 py-2.5 border border-white/20 text-white/70 text-xs font-montserrat tracking-[0.15em] uppercase hover:border-gold hover:text-gold transition-all duration-300 backdrop-blur-sm bg-white/3 rounded-sm"
            >
              Full Portfolio <ArrowRight size={12} />
            </Link>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {recentShots.map((shot, i) => (
              <motion.div key={i} {...fadeUp(i * 0.08)}>
                <div className="relative w-full aspect-[3/4] overflow-hidden rounded-sm group">
                  <img
                    src={shot.url}
                    alt={shot.alt}
                    className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <div className="absolute bottom-4 left-4">
                    <span className="text-gold text-[10px] font-montserrat tracking-[0.3em] uppercase">{shot.category}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Portfolio CTA */}
          <motion.div {...fadeUp(0.1)} className="mt-10 text-center">
            <Link
              to="/booking"
              className="inline-flex items-center gap-2 px-10 py-4 bg-gold text-black text-xs font-montserrat font-black tracking-[0.2em] uppercase rounded-sm hover:bg-gold/90 transition-colors duration-200 shadow-[0_4px_20px_rgba(198,191,180,0.3)]"
            >
              Book a Session <ArrowRight size={13} />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Meet Brooklyn */}
      <MeetBrooklynSection />

      {/* Testimonials */}
      <TestimonialsSection />

      {/* SEO Content Block */}
      <section className="py-20 px-6 lg:px-10 max-w-5xl mx-auto relative z-10">
        <div className="border-t border-white/6 pt-16">
          <motion.div {...fadeUp(0)}>
            <span className="text-gold text-xs font-montserrat font-semibold tracking-[0.3em] uppercase">Photographer in Johannesburg</span>
            <h2 className="text-2xl md:text-3xl font-montserrat font-bold text-white mt-4 mb-6 leading-tight">
              Professional Photography Across Johannesburg & Gauteng
            </h2>
          </motion.div>
          <motion.div {...fadeUp(0.05)} className="grid grid-cols-1 md:grid-cols-2 gap-10 text-white/45 text-sm font-montserrat font-light leading-relaxed">
            <div className="flex flex-col gap-4">
              <p>
                Stills by Brooklyn is a professional photographer based in Midrand, Johannesburg, offering premium photography services to individuals, families, and businesses across Gauteng. With a focus on authentic storytelling and technical excellence, every session is crafted to produce images that resonate far beyond the moment.
              </p>
              <p>
                Whether you need sharp corporate headshots for your LinkedIn profile, intimate portrait photography that captures your personality, or comprehensive wedding coverage from ceremony to reception — Stills by Brooklyn brings a refined eye and calm professionalism to every shoot.
              </p>
            </div>
            <div className="flex flex-col gap-4">
              <p>
                Serving clients in Johannesburg, Sandton, Midrand, Rosebank, Randburg, Pretoria, and available for destination shoots nationwide, Stills by Brooklyn understands the diverse visual needs of South African professionals, families, and couples.
              </p>
              <p>
                From fast-turnaround executive headshots for Sandton corporate teams to full-day wedding photography across the Highveld, every project receives the same meticulous attention to light, composition, and post-processing.
              </p>
            </div>
          </motion.div>
          <motion.div {...fadeUp(0.1)} className="mt-14">
            <h2 className="text-xl md:text-2xl font-montserrat font-bold text-white mb-5">Areas We Cover</h2>
            <p className="text-white/45 text-sm font-montserrat font-light leading-relaxed mb-5">
              Based in Midrand and shooting regularly across Johannesburg and Pretoria. For weddings and traditional ceremonies, we travel nationwide.
            </p>
            <div className="flex flex-wrap gap-2">
              {locationNav.map((l) => (
                <Link key={l.path} to={l.path} className="px-4 py-2 border border-white/15 text-white/60 text-xs font-montserrat tracking-wider uppercase hover:border-gold/50 hover:text-gold transition-all duration-300 rounded-sm">
                  Photographer in {l.label}
                </Link>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <HomeContactForm />

      {/* Final CTA */}
      <section className="py-24 px-6 relative z-10">
        <motion.div {...fadeUp(0)} className="max-w-2xl mx-auto">
          <GlassCard className="px-8 md:px-14 py-16 text-center relative overflow-hidden">
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-white/5 to-transparent pointer-events-none" />
            <h2 className="text-3xl md:text-4xl font-montserrat font-bold text-white mb-5 leading-tight">
              Ready to Create Something Beautiful?
            </h2>
            <p className="text-white/50 text-sm font-montserrat font-light tracking-wide leading-relaxed mb-10 max-w-lg mx-auto">
              Let's collaborate on your next project. Reach out to discuss your vision and we'll make it a reality.
            </p>
            <Link
              to="/booking"
              className="inline-flex items-center justify-center gap-3 px-10 md:px-14 py-4 bg-gold text-black text-xs font-montserrat font-black tracking-[0.2em] uppercase rounded-sm hover:bg-gold/90 transition-all duration-200 shadow-[0_4px_20px_rgba(198,191,180,0.3)]"
            >
              Book a Session <ArrowRight size={13} />
            </Link>
          </GlassCard>
        </motion.div>
      </section>
    </div>
  );
}