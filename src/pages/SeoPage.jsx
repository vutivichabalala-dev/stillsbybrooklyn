import { motion } from 'framer-motion';
import { useSeo } from '@/lib/seo';
import SeoContent, { RichText } from '../components/SeoContent';
import ServiceCTA from '../components/ServiceCTA';

/** Generic keyword landing page (service, location or blog post) driven by src/content/seoPages.js */
export default function SeoPage({ page }) {
  useSeo({
    title: page.title,
    description: page.description,
    keywords: page.keywords,
    path: page.path,
    faqs: page.faqs,
  });

  return (
    <div className="min-h-screen">
      <section className="relative pt-44 pb-20 px-6 lg:px-10 flex flex-col items-center text-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-transparent" />
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 max-w-3xl mx-auto"
        >
          <span className="text-gold text-xs font-montserrat font-semibold tracking-[0.3em] uppercase mb-4 block">{page.eyebrow}</span>
          <h1 className="text-4xl md:text-5xl font-montserrat font-black text-white mb-4 tracking-tight leading-[1.05]">{page.h1}</h1>
          <div className="h-[2px] w-20 bg-gold mx-auto mb-6" />
          <p className="text-white/60 text-sm md:text-base font-montserrat font-light leading-relaxed max-w-2xl mx-auto">
            <RichText text={page.intro} />
          </p>
        </motion.div>
      </section>

      <SeoContent sections={page.sections} faqs={page.faqs} />

      <ServiceCTA title={page.cta?.title} subtitle={page.cta?.subtitle} />
    </div>
  );
}
