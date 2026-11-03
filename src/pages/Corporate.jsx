import { Link } from 'react-router-dom';
import { ArrowRight, Briefcase, Users, Award } from 'lucide-react';
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

const corporateImages = [
  { id: 1, url: 'https://media.base44.com/images/public/69cfd090f016bb0f1b452639/405f66474_DSC_4043.jpg', alt: 'Corporate portrait of a professional woman in a houndstooth blazer' },
  { id: 2, url: 'https://media.base44.com/images/public/69cfd090f016bb0f1b452639/9a4a9a794_DSC_4045.jpg', alt: 'Corporate headshot' },
  { id: 3, url: 'https://media.base44.com/images/public/69cfd090f016bb0f1b452639/34c2c0a6b_DSC_4046.jpg', alt: 'Professional corporate portrait' },
  { id: 4, url: 'https://media.base44.com/images/public/69cfd090f016bb0f1b452639/afcabb77e_DSC_4047.jpg', alt: 'Smiling professional' },
  { id: 5, url: 'https://media.base44.com/images/public/69cfd090f016bb0f1b452639/7e598f7ce_DSC_4048.jpg', alt: 'Professional headshot' },
  { id: 6, url: 'https://media.base44.com/images/public/69cfd090f016bb0f1b452639/47ae0dc0f_DSC_4110.jpg', alt: 'Corporate executive portrait' },
  { id: 7, url: 'https://media.base44.com/images/public/69cfd090f016bb0f1b452639/41b4604fd_DSC_4111.jpg', alt: 'Executive in suit' },
  { id: 8, url: 'https://media.base44.com/images/public/69cfd090f016bb0f1b452639/768fc2296_DSC_4112.jpg', alt: 'Laughing executive' },
  { id: 9, url: 'https://media.base44.com/images/public/69cfd090f016bb0f1b452639/b6065684a_DSC_4113.jpg', alt: 'Man in navy suit' },
  { id: 10, url: 'https://media.base44.com/images/public/69cfd090f016bb0f1b452639/dc6d72f24_DSC_4123.jpg', alt: 'Executive with eagle sculpture' },
  { id: 11, url: 'https://media.base44.com/images/public/69cfd090f016bb0f1b452639/e574d7a44_DSC_4124.jpg', alt: 'Thoughtful professional' },
  { id: 12, url: 'https://media.base44.com/images/public/69cfd090f016bb0f1b452639/e5dfaf3c0_DSC_4125.jpg', alt: 'Man in grey suit' },
  { id: 13, url: 'https://media.base44.com/images/public/69cfd090f016bb0f1b452639/1f3139dc3_DSC_4126.jpg', alt: 'Executive in luxury interior' },
  { id: 14, url: 'https://media.base44.com/images/public/69cfd090f016bb0f1b452639/d0c463f82_DSC_4127.jpg', alt: 'Corporate portrait in luxury space' },
  { id: 15, url: 'https://media.base44.com/images/public/69cfd090f016bb0f1b452639/191144890_DSC_4132.jpg', alt: 'Woman near eagle sculpture' },
  { id: 16, url: 'https://media.base44.com/images/public/69cfd090f016bb0f1b452639/a71db76ec_DSC_4133.jpg', alt: 'Professional woman in blazer' },
  { id: 17, url: 'https://media.base44.com/images/public/69cfd090f016bb0f1b452639/fd69eadf5_DSC_4134.jpg', alt: 'Smiling woman in houndstooth blazer' },
  { id: 18, url: 'https://media.base44.com/images/public/69cfd090f016bb0f1b452639/53fd1db74_DSC_4135.jpg', alt: 'Elegant corporate portrait' },
];

const offerings = [
  { icon: <Briefcase size={16} className="text-gold" />, title: 'Executive Headshots', desc: 'Polished, authoritative portraits for C-suite and leadership teams.' },
  { icon: <Users size={16} className="text-gold" />, title: 'Team Photography', desc: 'Cohesive group and individual portraits for your entire organisation.' },
  { icon: <Award size={16} className="text-gold" />, title: 'Brand Imagery', desc: 'On-brand visuals for websites, press kits, and marketing materials.' },
];

export default function Corporate() {
  const page = corePages.headshots;
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
          {corporateImages.map((img) => (
            <div key={img.id} className="hover-zoom relative group cursor-pointer overflow-hidden bg-zinc-900 aspect-[3/4]">
              <img src={img.url} alt={img.alt} className="absolute inset-0 w-full h-full object-cover object-center" />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-500" />
            </div>
          ))}
        </div>
      </section>

      <SeoContent sections={page.sections} faqs={page.faqs} />

      <TestimonialsSection />
      <ServiceCTA title="Ready to elevate your brand?" subtitle="Let's create professional imagery that sets you apart." />
    </div>
  );
}