import { Link } from 'react-router-dom';
import { ArrowRight, User, Heart, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { useSeo } from '@/lib/seo';
import { corePages } from '@/content/corePages';
import SeoContent from '../components/SeoContent';
import SectionHeading from '../components/SectionHeading';
import GlassCard from '../components/GlassCard';
import TestimonialsSection from '../components/TestimonialsSection';
import ServiceCTA from '../components/ServiceCTA';

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-60px' },
  transition: { duration: 0.7, ease: 'easeOut', delay },
});

const portraitImages = [
  { id: 1, url: 'https://images.pixieset.com/224055201/7434a23374497b1b13cc0130da62472b-xlarge.jpg', alt: 'Portrait photoshoot in Johannesburg - natural light' },
  { id: 2, url: 'https://images.pixieset.com/224055201/ba20179241b13dc570b3d7c663e22bf5-xlarge.jpg', alt: 'Portrait photoshoot in Johannesburg - candid moment' },
  { id: 3, url: 'https://images.pixieset.com/224055201/fa1a43cc250efd88003bc5da98382de8-xlarge.jpg', alt: 'Portrait photoshoot in Johannesburg - expressive' },
  { id: 4, url: 'https://images.pixieset.com/224055201/2cf20d4a9d00d86934d0adb64a70c03f-xlarge.jpg', alt: 'Portrait photoshoot in Johannesburg - lifestyle' },
  { id: 5, url: 'https://images.pixieset.com/224055201/8b064709835a34b21aba22f4a48f292b-xlarge.jpg', alt: 'Portrait photoshoot in Johannesburg - dramatic light' },
  { id: 6, url: 'https://images.pixieset.com/224055201/e8913758e3894e34b8d1a0b20f196fc4-xlarge.jpg', alt: 'Portrait photoshoot in Johannesburg - intimate' },
];

const offerings = [
  { icon: <User size={16} className="text-gold" />, title: 'Individual Portraits', desc: 'Authentic, carefully composed portraits that capture your true personality and spirit.' },
  { icon: <Heart size={16} className="text-gold" />, title: 'Family Sessions', desc: 'Natural, relaxed sessions that celebrate the bonds and joy of your family.' },
  { icon: <Sparkles size={16} className="text-gold" />, title: 'Lifestyle Portraits', desc: 'Editorial-style imagery that tells your story in your own environment.' },
];

export default function Portraits() {
  const page = corePages.studio;
  useSeo(page);

   return (
     <div className="min-h-screen">
      {/* Hero */}
      <section className="relative pt-44 pb-28 px-6 lg:px-10 flex flex-col items-center text-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-transparent" />
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 max-w-3xl mx-auto"
        >
          <span className="text-gold text-xs font-montserrat font-semibold tracking-[0.3em] uppercase mb-4 block">{page.eyebrow}</span>
          <h1 className="text-4xl md:text-6xl font-montserrat font-black text-white mb-4 tracking-tight leading-[1.05]">{page.h1}</h1>
          <div className="h-[2px] w-20 bg-gold mx-auto mb-6" />
          <p className="text-white/55 text-sm font-montserrat font-light leading-relaxed max-w-xl mx-auto">
            {page.intro}
          </p>
        </motion.div>
      </section>

      {/* Offerings */}
      <section className="pb-20 px-6 lg:px-10 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-20">
          {offerings.map((o, i) => (
            <motion.div key={o.title} {...fadeUp(i * 0.1)}>
              <GlassCard hover className="p-8 flex flex-col gap-3 h-full">
                <div className="w-9 h-9 border border-gold/30 flex items-center justify-center">{o.icon}</div>
                <h3 className="text-white font-montserrat font-semibold text-sm tracking-wider uppercase">{o.title}</h3>
                <p className="text-white/45 text-xs font-montserrat font-light leading-relaxed">{o.desc}</p>
              </GlassCard>
            </motion.div>
          ))}
        </div>

        {/* Gallery */}
        <motion.div {...fadeUp(0)} className="mb-14 flex flex-col items-start">
          <SectionHeading eyebrow="Gallery" title={page.galleryHeading} />
        </motion.div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {portraitImages.map((img) => (
            <div key={img.id} className="hover-zoom relative group cursor-pointer overflow-hidden bg-zinc-900 aspect-[3/4]">
              <img src={img.url} alt={img.alt} className="absolute inset-0 w-full h-full object-cover object-center" />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-500" />
            </div>
          ))}
        </div>
      </section>

      <SeoContent sections={page.sections} faqs={page.faqs} />

      <TestimonialsSection />
      <ServiceCTA title="Let's tell your story" subtitle="Book a portrait session and walk away with images you'll treasure for a lifetime." />
    </div>
  );
}