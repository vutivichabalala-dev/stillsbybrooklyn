import { Link } from 'react-router-dom';
import { ArrowRight, Check, Briefcase, User, Heart, GraduationCap, Star } from 'lucide-react';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import SectionHeading from '../components/SectionHeading';
import GlassCard from '../components/GlassCard';
import PagePhotoBackground from '../components/PagePhotoBackground';

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-60px' },
  transition: { duration: 0.7, ease: 'easeOut', delay },
});

const categories = [
  { id: 'corporate', label: 'Corporate', icon: Briefcase },
  { id: 'portraits', label: 'Portraits', icon: User },
  { id: 'weddings', label: 'Weddings', icon: Heart },
  { id: 'graduations', label: 'Graduations', icon: GraduationCap },
];

const packages = {
  corporate: [
    {
      name: 'Essentials',
      tagline: 'Perfect for individuals & small teams',
      price: 'From R1 500',
      popular: false,
      includes: [
        '1-hour session',
        'Up to 5 professionals',
        '1 location / background',
        '10 fully edited high-res images',
        'Online delivery within 5 days',
        'Personal-use licence',
      ],
    },
    {
      name: 'Brand',
      tagline: 'Ideal for growing businesses',
      price: 'From R3 500',
      popular: true,
      includes: [
        'Half-day session (4 hours)',
        'Up to 15 professionals',
        '2 locations / setups',
        '30 fully edited high-res images',
        'Online delivery within 5 days',
        'Commercial-use licence',
        'Behind-the-scenes shots',
        'Express 48-hr turnaround (add-on)',
      ],
    },
    {
      name: 'Enterprise',
      tagline: 'Full-scale corporate coverage',
      price: 'Custom Quote',
      popular: false,
      includes: [
        'Full-day session (8 hours)',
        'Unlimited team members',
        'Multiple locations & setups',
        '60+ fully edited high-res images',
        'Online delivery within 5 days',
        'Full commercial-use licence',
        'Event & conference coverage',
        'Brand consultation included',
        'Dedicated editing & retouching',
      ],
    },
  ],
  portraits: [
    {
      name: 'Mini',
      tagline: 'Quick, beautiful portraits',
      price: 'From R800',
      popular: false,
      includes: [
        '30-minute session',
        '1 person',
        '1 outdoor or studio location',
        '5 fully edited high-res images',
        'Online delivery within 5 days',
        'Personal-use licence',
      ],
    },
    {
      name: 'Portrait',
      tagline: 'The classic portrait experience',
      price: 'From R1 800',
      popular: true,
      includes: [
        '1.5-hour session',
        'Up to 2 people',
        'Up to 2 locations / outfit changes',
        '20 fully edited high-res images',
        'Online delivery within 5 days',
        'Personal-use licence',
        'Wardrobe & location guidance',
        'Printed 4×6 keepsake included',
      ],
    },
    {
      name: 'Family / Creative',
      tagline: 'Extended storytelling session',
      price: 'From R3 000',
      popular: false,
      includes: [
        '3-hour session',
        'Up to 6 people / creative concept',
        'Multiple locations & setups',
        '40 fully edited high-res images',
        'Online delivery within 5 days',
        'Personal & limited commercial use',
        'Full creative direction & mood board',
        'Online proof gallery with download',
      ],
    },
  ],
  weddings: [
    {
      name: 'Intimate',
      tagline: 'Small ceremonies & elopements',
      price: 'From R6 500',
      popular: false,
      includes: [
        '4 hours of coverage',
        '1 photographer',
        'Ceremony & couple portraits',
        '150+ fully edited high-res images',
        'Private online gallery',
        'Online delivery within 3 weeks',
        'Personal-use licence',
      ],
    },
    {
      name: 'Classic',
      tagline: 'Full wedding day coverage',
      price: 'From R12 000',
      popular: true,
      includes: [
        '8 hours of coverage',
        '1 photographer',
        'Getting ready through first dance',
        '300+ fully edited high-res images',
        'Private online gallery',
        'Online delivery within 3 weeks',
        'Engagement session included',
        'High-resolution USB delivered',
        'Personal-use licence',
      ],
    },
    {
      name: 'Luxury',
      tagline: 'The full celebration experience',
      price: 'From R18 000',
      popular: false,
      includes: [
        'Full day + evening coverage',
        '2 photographers',
        'Pre-wedding shoot included',
        '500+ fully edited high-res images',
        'Private online gallery',
        'Online delivery within 2 weeks',
        'Fine-art printed album (30 pages)',
        'High-resolution USB delivered',
        'Rehearsal dinner coverage',
        'Full commercial & print licence',
      ],
    },
  ],
  graduations: [
    {
      name: 'Solo',
      tagline: 'Your milestone, your moment',
      price: 'From R700',
      popular: false,
      includes: [
        '30-minute session',
        '1 graduate',
        '1 location',
        '8 fully edited high-res images',
        'Online delivery within 5 days',
        'Personal-use licence',
        'Regalia & robe portraits',
      ],
    },
    {
      name: 'Celebration',
      tagline: 'Graduate + family memories',
      price: 'From R1 500',
      popular: true,
      includes: [
        '1-hour session',
        'Graduate + up to 5 family members',
        '2 locations / setups',
        '20 fully edited high-res images',
        'Online delivery within 5 days',
        'Personal-use licence',
        'Individual & group compositions',
        'Printed 5×7 keepsake included',
      ],
    },
    {
      name: 'Full Ceremony',
      tagline: 'Complete ceremony day coverage',
      price: 'From R3 500',
      popular: false,
      includes: [
        '3-hour coverage',
        'Ceremony & celebrations',
        'Unlimited graduates / family',
        '50+ fully edited high-res images',
        'Online delivery within 5 days',
        'Personal-use licence',
        'Candid & formal compositions',
        'Online proof gallery with download',
      ],
    },
  ],
};

export default function Pricing() {
  useEffect(() => {
    document.title = 'Photography Pricing';
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute('content', 'Transparent photography pricing — wedding, portrait and corporate packages from Stills by Brooklyn. No hidden fees, flexible packages to suit every budget.');
  }, []);

  const [activeCategory, setActiveCategory] = useState('corporate');
  const tiers = packages[activeCategory];

  return (
    <div className="min-h-screen pt-32 pb-24 relative">
      <PagePhotoBackground src="https://media.base44.com/images/public/69cfd090f016bb0f1b452639/47ae0dc0f_DSC_4110.jpg" />
      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-10">

        {/* Header */}
        <motion.div {...fadeUp(0)} className="mb-16 text-center flex flex-col items-center">
          <SectionHeading
            eyebrow="Investment"
            title="Pricing"
            subtitle="Transparent, tiered packages designed to fit every vision and budget — with no hidden fees."
            center
          />
        </motion.div>

        {/* Category Tabs */}
        <motion.div {...fadeUp(0.1)} className="mb-12 flex justify-center">
          <div className="flex flex-wrap justify-center gap-2 border border-white/10 rounded-sm p-1 bg-white/3 backdrop-blur-sm">
            {categories.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveCategory(id)}
                className={`relative flex items-center gap-2 px-5 py-2.5 rounded-sm text-xs font-montserrat font-bold tracking-[0.15em] uppercase transition-all duration-300
                  ${activeCategory === id
                    ? 'bg-gold text-black'
                    : 'text-white/50 hover:text-white/80 hover:bg-white/5'
                  }`}
              >
                <Icon size={12} />
                {label}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-20">
          {tiers.map((pkg, i) => (
            <motion.div
              key={`${activeCategory}-${pkg.name}`}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: i * 0.1 }}
              className="relative flex flex-col"
            >
              {pkg.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10 flex items-center gap-1 bg-gold text-black px-4 py-1 rounded-sm">
                  <Star size={9} className="fill-black" />
                  <span className="text-[9px] font-montserrat font-black tracking-[0.3em] uppercase">Most Popular</span>
                </div>
              )}
              <GlassCard
                className={`flex flex-col flex-1 p-8 gap-6 transition-all duration-300 ${pkg.popular ? 'border-gold/40 shadow-[0_0_40px_rgba(201,168,76,0.08)]' : 'hover:border-white/20'}`}
              >
                {/* Package header */}
                <div>
                  <h3 className={`font-montserrat font-black text-lg tracking-wide uppercase mb-1 ${pkg.popular ? 'text-gold' : 'text-white'}`}>
                    {pkg.name}
                  </h3>
                  <p className="text-white/40 text-[11px] font-montserrat font-light tracking-wider">{pkg.tagline}</p>
                </div>

                {/* Price */}
                <div className="border-t border-b border-white/8 py-5">
                  <span className={`text-2xl font-montserrat font-black tracking-tight ${pkg.popular ? 'text-gold' : 'text-white'}`}>
                    {pkg.price}
                  </span>
                  {!pkg.price.includes('Custom') && (
                    <span className="text-white/30 text-[10px] font-montserrat ml-2 tracking-wider">per session</span>
                  )}
                </div>

                {/* Inclusions */}
                <ul className="flex flex-col gap-3 flex-1">
                  {pkg.includes.map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <div className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 mt-0.5 border ${pkg.popular ? 'border-gold/50 bg-gold/15' : 'border-white/20 bg-white/5'}`}>
                        <Check size={8} className={pkg.popular ? 'text-gold' : 'text-white/60'} />
                      </div>
                      <span className="text-white/65 text-xs font-montserrat font-light leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <Link
                  to="/booking"
                  className={`mt-auto inline-flex items-center justify-center gap-2 py-3 px-6 text-xs font-montserrat font-bold tracking-[0.15em] uppercase transition-all duration-300 rounded-sm border
                    ${pkg.popular
                      ? 'bg-gold border-gold text-black hover:bg-gold/90'
                      : 'bg-transparent border-white/20 text-white/70 hover:border-gold/50 hover:text-gold'
                    }`}
                >
                  Book This Package <ArrowRight size={11} />
                </Link>
              </GlassCard>
            </motion.div>
          ))}
        </div>

        {/* Note */}
        <motion.div {...fadeUp(0.2)} className="mb-20 text-center">
          <p className="text-white/30 text-xs font-montserrat font-light tracking-wider leading-relaxed max-w-xl mx-auto">
            All prices are indicative and subject to confirmation based on your specific requirements, travel distance, and session complexity.
            Contact us for a personalised quote.
          </p>
        </motion.div>

        {/* Add-ons */}
        <motion.div {...fadeUp(0)} className="mb-20">
          <div className="mb-10 text-center flex flex-col items-center">
            <SectionHeading eyebrow="Extras" title="Add-Ons" subtitle="Enhance any package with these popular extras." center />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { title: 'Express Turnaround', desc: 'Delivery within 24–48 hours', price: '+R500' },
              { title: 'Extra Edited Images', desc: 'Additional 10 fully retouched photos', price: '+R400' },
              { title: 'Printed Album', desc: '20-page fine-art lay-flat album', price: '+R2 500' },
              { title: 'Second Shooter', desc: 'Additional photographer for events', price: '+R1 500' },
            ].map((addon, i) => (
              <motion.div key={addon.title} {...fadeUp(i * 0.08)}>
                <GlassCard hover className="p-6 flex flex-col gap-2 h-full">
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="text-white font-montserrat font-semibold text-sm tracking-wider">{addon.title}</h4>
                    <span className="text-gold text-xs font-montserrat font-black shrink-0">{addon.price}</span>
                  </div>
                  <p className="text-white/40 text-[11px] font-montserrat font-light leading-relaxed">{addon.desc}</p>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div {...fadeUp(0)} className="text-center">
          <GlassCard className="py-16 px-10 max-w-2xl mx-auto relative overflow-hidden">
            <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-64 h-24 bg-gold/10 blur-3xl rounded-full pointer-events-none" />
            <p className="text-gold text-xs font-montserrat tracking-[0.3em] uppercase mb-3">Not sure which package fits?</p>
            <h3 className="text-white text-2xl font-montserrat font-bold mb-3">Let's Build Your Perfect Package</h3>
            <p className="text-white/40 text-xs font-montserrat font-light leading-relaxed mb-8 max-w-md mx-auto">
              Every shoot is unique. Reach out and Brooklyn will put together a custom proposal tailored to your vision and budget.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a
                href="mailto:info@stillsbybrooklyn.co.za"
                className="inline-flex items-center justify-center gap-3 px-10 py-3.5 border border-gold/60 bg-gold/10 text-gold text-xs font-montserrat font-bold tracking-[0.2em] uppercase transition-all duration-300 hover:bg-gold hover:text-black rounded-sm"
              >
                Get a Custom Quote <ArrowRight size={14} />
              </a>
              <Link
                to="/booking"
                className="inline-flex items-center justify-center gap-3 px-10 py-3.5 border border-white/15 text-white/60 text-xs font-montserrat font-bold tracking-[0.2em] uppercase transition-all duration-300 hover:border-white/40 hover:text-white rounded-sm"
              >
                Book a Session
              </Link>
            </div>
          </GlassCard>
        </motion.div>

      </div>
    </div>
  );
}