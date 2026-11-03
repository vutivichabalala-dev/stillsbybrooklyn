import { Link } from 'react-router-dom';
import { ArrowRight, Heart, Camera, Star } from 'lucide-react';
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

const offerings = [
  { icon: <Heart size={16} className="text-gold" />, title: 'Full Day Coverage', desc: 'From getting ready to the last dance — every precious moment captured.' },
  { icon: <Camera size={16} className="text-gold" />, title: 'Engagement Sessions', desc: 'A relaxed pre-wedding shoot to celebrate your love story before the big day.' },
  { icon: <Star size={16} className="text-gold" />, title: 'Fine Art Editing', desc: 'Timeless, cinematic editing with a consistent aesthetic that ages beautifully.' },
];

export default function Weddings() {
  const page = corePages.weddings;
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
          <SectionHeading eyebrow="Gallery" title={page.galleryHeading} subtitle="A glimpse into real wedding sessions — every detail captured with intention." />
        </motion.div>
        <div className="columns-2 md:columns-3 gap-3 space-y-3">
          {[
            'https://media.base44.com/images/public/69cfd090f016bb0f1b452639/6690fe0fb_DSC_5010.jpg',
            'https://media.base44.com/images/public/69cfd090f016bb0f1b452639/1d785af91_DSC_5034.jpg',
            'https://media.base44.com/images/public/69cfd090f016bb0f1b452639/a5a2523e3_DSC_5077.jpg',
            'https://media.base44.com/images/public/69cfd090f016bb0f1b452639/cccedc2d2_DSC_5125.jpg',
            'https://media.base44.com/images/public/69cfd090f016bb0f1b452639/4ce78177c_DSC_5068.jpg',
            'https://media.base44.com/images/public/69cfd090f016bb0f1b452639/1154b3740_DSC_5060.jpg',
            'https://media.base44.com/images/public/69cfd090f016bb0f1b452639/23c7ac0b8_DSC_5061.jpg',
            'https://media.base44.com/images/public/69cfd090f016bb0f1b452639/55625f9db_DSC_5069.jpg',
            'https://media.base44.com/images/public/69cfd090f016bb0f1b452639/af76b26dc_DSC_5081.jpg',
          ].map((url, i) => (
            <motion.div key={i} {...fadeUp(i * 0.05)} className="break-inside-avoid mb-3 overflow-hidden rounded-sm group">
              <img src={url} alt={`Wedding photography in Johannesburg by Stills by Brooklyn, photo ${i + 1}`} className="w-full object-cover transition-transform duration-700 group-hover:scale-105" loading="lazy" />
            </motion.div>
          ))}
        </div>
      </section>

      <SeoContent sections={page.sections} faqs={page.faqs} />

      <TestimonialsSection />
      <ServiceCTA title="Your day deserves to last forever" subtitle="Let's chat about your wedding vision and how I can capture it beautifully." />
    </div>
  );
}