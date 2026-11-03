import { useSeo } from '@/lib/seo';
import { corePages } from '@/content/corePages';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Check, Briefcase, User, Heart, GraduationCap, Sparkles, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import SectionHeading from '../components/SectionHeading';
import GlassCard from '../components/GlassCard';
import PagePhotoBackground from '../components/PagePhotoBackground';

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-60px' },
  transition: { duration: 0.7, ease: 'easeOut', delay },
});

const services = [
  {
    category: 'Corporate',
    icon: Briefcase,
    description: 'Professional photography for businesses, brands, and organizations.',
    offerings: ['Executive & Team Headshots', 'Corporate Events & Conferences', 'Brand & Product Photography', 'Office Environment Shoots', 'Annual Report Imagery'],
    note: 'Half-day and full-day rates available',
    href: '/corporate-headshots-johannesburg',
    color: 'from-blue-900/30',
    images: [
      'https://media.base44.com/images/public/69cfd090f016bb0f1b452639/47ae0dc0f_DSC_4110.jpg',
      'https://media.base44.com/images/public/69cfd090f016bb0f1b452639/b6065684a_DSC_4113.jpg',
      'https://media.base44.com/images/public/69cfd090f016bb0f1b452639/405f66474_DSC_4043.jpg',
      'https://media.base44.com/images/public/69cfd090f016bb0f1b452639/9a4a9a794_DSC_4045.jpg',
      'https://media.base44.com/images/public/69cfd090f016bb0f1b452639/d0c463f82_DSC_4127.jpg',
    ],
  },
  {
    category: 'Portraits',
    icon: User,
    description: 'Intimate portrait sessions that reveal character and tell personal stories.',
    offerings: ['Individual Portraits', 'Family Portraits', 'Maternity Sessions', 'Lifestyle & Creative Shoots', 'Professional Headshots'],
    note: 'Studio & outdoor options available',
    href: '/photography-studio-johannesburg',
    color: 'from-purple-900/30',
    images: [
      'https://images.pixieset.com/224055201/7434a23374497b1b13cc0130da62472b-xlarge.jpg',
      'https://images.pixieset.com/224055201/8b064709835a34b21aba22f4a48f292b-xlarge.jpg',
      'https://images.pixieset.com/224055201/ba20179241b13dc570b3d7c663e22bf5-xlarge.jpg',
      'https://images.pixieset.com/224055201/fa1a43cc250efd88003bc5da98382de8-xlarge.jpg',
      'https://images.pixieset.com/224055201/e8913758e3894e34b8d1a0b20f196fc4-xlarge.jpg',
    ],
  },
  {
    category: 'Weddings',
    icon: Heart,
    description: 'Comprehensive wedding photography that preserves every precious moment.',
    offerings: ['Engagement Sessions', 'Full Wedding Day Coverage', 'Bridal Portraits', 'Rehearsal Dinner Coverage', 'High-Resolution Edited Gallery'],
    note: 'Packages customized to your needs',
    href: '/wedding-photographer-johannesburg',
    color: 'from-rose-900/30',
    images: [
      'https://media.base44.com/images/public/69cfd090f016bb0f1b452639/6690fe0fb_DSC_5010.jpg',
      'https://media.base44.com/images/public/69cfd090f016bb0f1b452639/1d785af91_DSC_5034.jpg',
      'https://media.base44.com/images/public/69cfd090f016bb0f1b452639/a5a2523e3_DSC_5077.jpg',
      'https://media.base44.com/images/public/69cfd090f016bb0f1b452639/cccedc2d2_DSC_5125.jpg',
      'https://media.base44.com/images/public/69cfd090f016bb0f1b452639/4ce78177c_DSC_5068.jpg',
      'https://media.base44.com/images/public/69cfd090f016bb0f1b452639/a76bd8a61_DSC_5009.jpg',
      'https://media.base44.com/images/public/69cfd090f016bb0f1b452639/04a50042b_DSC_5023.jpg',
      'https://media.base44.com/images/public/69cfd090f016bb0f1b452639/d7cafb2a1_DSC_5027.jpg',
      'https://media.base44.com/images/public/69cfd090f016bb0f1b452639/1154b3740_DSC_5060.jpg',
      'https://media.base44.com/images/public/69cfd090f016bb0f1b452639/23c7ac0b8_DSC_5061.jpg',
      'https://media.base44.com/images/public/69cfd090f016bb0f1b452639/55625f9db_DSC_5069.jpg',
      'https://media.base44.com/images/public/69cfd090f016bb0f1b452639/06f2d8a4d_DSC_5074.jpg',
      'https://media.base44.com/images/public/69cfd090f016bb0f1b452639/6328cf0e0_DSC_5075.jpg',
      'https://media.base44.com/images/public/69cfd090f016bb0f1b452639/af76b26dc_DSC_5081.jpg',
      'https://media.base44.com/images/public/69cfd090f016bb0f1b452639/114e78664_DSC_5088.jpg',
      'https://media.base44.com/images/public/69cfd090f016bb0f1b452639/beeb988be_DSC_5120.jpg',
      'https://media.base44.com/images/public/69cfd090f016bb0f1b452639/0bc25d936_DSC_5033.jpg',
    ],
  },
  {
    category: 'Graduations',
    icon: GraduationCap,
    description: 'Celebrate your milestone achievement with beautiful, lasting graduation photography.',
    offerings: ['Individual Graduation Portraits', 'Ceremony Coverage', 'Group & Family Photos', 'Academic Regalia Portraits', 'High-Resolution Edited Gallery'],
    note: 'On-location & studio sessions available',
    href: '/portfolio?category=graduations',
    color: 'from-amber-900/30',
    images: [
      'https://media.base44.com/images/public/69cfd090f016bb0f1b452639/922435be1_DSC_4228.jpg',
      'https://media.base44.com/images/public/69cfd090f016bb0f1b452639/be5ca11f3_DSC_4271.jpg',
      'https://media.base44.com/images/public/69cfd090f016bb0f1b452639/9adb2f002_DSC_4270.jpg',
      'https://media.base44.com/images/public/69cfd090f016bb0f1b452639/e7626e7ee_DSC_4273.jpg',
      'https://media.base44.com/images/public/69cfd090f016bb0f1b452639/7e13b32ad_DSC_4283.jpg',
      'https://media.base44.com/images/public/69cfd090f016bb0f1b452639/5786089f1_DSC_4285.jpg',
      'https://media.base44.com/images/public/69cfd090f016bb0f1b452639/3a9de990b_DSC_4282.jpg',
      'https://media.base44.com/images/public/69cfd090f016bb0f1b452639/a33532f67_DSC_4300.jpg',
      'https://media.base44.com/images/public/69cfd090f016bb0f1b452639/4280a2d77_DSC_4303.jpg',
      'https://media.base44.com/images/public/69cfd090f016bb0f1b452639/ac379ba61_DSC_4306.jpg',
      'https://media.base44.com/images/public/69cfd090f016bb0f1b452639/e8e6106de_DSC_4307.jpg',
      'https://media.base44.com/images/public/69cfd090f016bb0f1b452639/377e5a04f_DSC_4311.jpg',
      'https://media.base44.com/images/public/69cfd090f016bb0f1b452639/02c4d961b_DSC_4323.jpg',
      'https://media.base44.com/images/public/69cfd090f016bb0f1b452639/0af8c4363_DSC_4326.jpg',
      'https://media.base44.com/images/public/69cfd090f016bb0f1b452639/762c48de9_DSC_4345.jpg',
      'https://media.base44.com/images/public/69cfd090f016bb0f1b452639/62b1b995f_DSC_4347.jpg',
      'https://media.base44.com/images/public/69cfd090f016bb0f1b452639/7dbd77260_DSC_4354.jpg',
      'https://media.base44.com/images/public/69cfd090f016bb0f1b452639/b4612dbe0_DSC_4352.jpg',
      'https://media.base44.com/images/public/69cfd090f016bb0f1b452639/985c94caa_DSC_4359.jpg',
      'https://media.base44.com/images/public/69cfd090f016bb0f1b452639/c92ad5d0d_DSC_4376.jpg',
      'https://media.base44.com/images/public/69cfd090f016bb0f1b452639/3ec27dda8_DSC_4379.jpg',
      'https://media.base44.com/images/public/69cfd090f016bb0f1b452639/c07e6f7ad_DSC_4229.jpg',
      'https://media.base44.com/images/public/69cfd090f016bb0f1b452639/9aaba3aa2_DSC_4233.jpg',
    ],
  },
  {
    category: 'Matric Dance',
    icon: Sparkles,
    description: 'Glamorous matric dance photography that captures the excitement, style, and pride of this milestone night.',
    offerings: ['Couple & Group Portraits', 'Golden-Hour Location Shoots', 'Full-Length Formal Portraits', 'Family & Friends Photos', 'High-Resolution Edited Gallery'],
    note: 'Book early — matric season fills up fast',
    href: '/portfolio?category=matric dance',
    color: 'from-emerald-900/30',
    images: [
      'https://base44.app/api/apps/69cfd090f016bb0f1b452639/files/mp/public/69cfd090f016bb0f1b452639/23c6f23d5_m1.jpg',
      'https://base44.app/api/apps/69cfd090f016bb0f1b452639/files/mp/public/69cfd090f016bb0f1b452639/fb33a2eb4_m7.jpg',
      'https://base44.app/api/apps/69cfd090f016bb0f1b452639/files/mp/public/69cfd090f016bb0f1b452639/f17a7f633_m4.jpg',
      'https://base44.app/api/apps/69cfd090f016bb0f1b452639/files/mp/public/69cfd090f016bb0f1b452639/d7b28935b_m6.jpg',
      'https://base44.app/api/apps/69cfd090f016bb0f1b452639/files/mp/public/69cfd090f016bb0f1b452639/115657473_m9.jpg',
      'https://base44.app/api/apps/69cfd090f016bb0f1b452639/files/mp/public/69cfd090f016bb0f1b452639/ea0215502_m8.jpg',
      'https://base44.app/api/apps/69cfd090f016bb0f1b452639/files/mp/public/69cfd090f016bb0f1b452639/422cb06bd_m5.jpg',
      'https://base44.app/api/apps/69cfd090f016bb0f1b452639/files/mp/public/69cfd090f016bb0f1b452639/77706b7f6_m2.jpg',
      'https://base44.app/api/apps/69cfd090f016bb0f1b452639/files/mp/public/69cfd090f016bb0f1b452639/cc7fc8131_m3.jpg',
    ],
  },
];

const steps = [
  { step: '01', title: 'Consultation', desc: 'We discuss your vision, goals, and requirements in detail.' },
  { step: '02', title: 'Planning', desc: 'Location scouting, mood board creation, and logistics coordination.' },
  { step: '03', title: 'The Session', desc: 'Professional shoot with direction, creativity, and attention to detail.' },
  { step: '04', title: 'Delivery', desc: 'Carefully edited, high-resolution images delivered within agreed timeframe.' },
];

export default function Services() {
  useSeo(corePages.services);

   const [activeIndex, setActiveIndex] = useState(0);
   const [slideIndex, setSlideIndex] = useState(0);
   const active = services[activeIndex];

  // Auto-advance slideshow per service, reset when service changes
  useEffect(() => {
    setSlideIndex(0);
  }, [activeIndex]);

  useEffect(() => {
    if (active.images.length <= 1) return;
    const timer = setInterval(() => {
      setSlideIndex(i => (i + 1) % active.images.length);
    }, 3000);
    return () => clearInterval(timer);
  }, [activeIndex, active.images.length]);

  return (
    <div className="min-h-screen pt-32 pb-24 relative">
      <PagePhotoBackground src="https://media.base44.com/images/public/69cfd090f016bb0f1b452639/9a4a9a794_DSC_4045.jpg" />
      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-10">

        {/* Header */}
        <motion.div {...fadeUp(0)} className="mb-20 text-center flex flex-col items-center">
          <SectionHeading
            eyebrow="What's Offered"
            as="h1"
            title={corePages.services.h1}
            subtitle="Tailored photography services designed to meet your unique vision and requirements."
            center
          />
        </motion.div>

        {/* Interactive Service Explorer */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="mb-24"
        >
          <div className="flex flex-col lg:flex-row gap-0 border border-white/10 overflow-hidden rounded-sm">

            {/* Sidebar tabs — horizontal scroll on mobile, vertical on desktop */}
            <div className="flex lg:flex-col border-b lg:border-b-0 lg:border-r border-white/10 lg:w-64 shrink-0 overflow-x-auto">
              {services.map((svc, i) => {
                const Icon = svc.icon;
                const isActive = i === activeIndex;
                return (
                  <button
                    key={svc.category}
                    onClick={() => setActiveIndex(i)}
                    className={`relative shrink-0 flex items-center gap-3 px-5 py-4 text-left transition-all duration-300 group
                      ${isActive ? 'bg-gold/10' : 'hover:bg-white/5'}`}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="activeTab"
                        className="absolute left-0 bottom-0 lg:top-0 lg:bottom-0 h-[3px] lg:h-auto w-full lg:w-[3px] bg-gold"
                      />
                    )}
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center border shrink-0 transition-all duration-300
                      ${isActive ? 'border-gold bg-gold/20' : 'border-white/15 group-hover:border-white/30'}`}>
                      <Icon size={14} className={isActive ? 'text-gold' : 'text-white/50'} />
                    </div>
                    <span className={`font-montserrat font-semibold text-xs tracking-wider whitespace-nowrap lg:text-sm transition-colors duration-300
                      ${isActive ? 'text-gold' : 'text-white/50 group-hover:text-white/80'}`}>
                      {svc.category}
                    </span>
                    {isActive && <ChevronRight size={14} className="text-gold ml-auto hidden lg:block" />}
                  </button>
                );
              })}
            </div>

            {/* Content panel — stacks vertically on mobile */}
            <div className="flex-1 overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeIndex}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.4, ease: 'easeOut' }}
                  className="flex flex-col lg:flex-row"
                >
                  {/* Image slideshow — tall on mobile so photos are clearly visible */}
                  <div className="relative w-full lg:w-2/5 h-64 sm:h-80 lg:h-[600px] shrink-0 overflow-hidden">
                    {/* Scrollable image container on desktop */}
                    <div className="w-full h-full overflow-y-auto overflow-x-hidden" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                      <AnimatePresence mode="sync">
                        <motion.img
                          key={`${activeIndex}-${slideIndex}`}
                          src={active.images[slideIndex]}
                          alt={active.category}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.8, ease: 'easeInOut' }}
                          className="w-full h-auto block"
                          style={{ minHeight: '100%', objectFit: 'cover' }}
                        />
                      </AnimatePresence>
                    </div>
                    {/* Fixed overlays pinned to bottom of container */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent z-10 pointer-events-none" />
                    {active.images.length > 1 && (
                      <div className="absolute bottom-14 left-6 flex gap-1.5 z-20">
                        {active.images.map((_, i) => (
                          <button
                            key={i}
                            onClick={() => setSlideIndex(i)}
                            className={`rounded-full transition-all duration-300 ${i === slideIndex ? 'w-4 h-1.5 bg-gold' : 'w-1.5 h-1.5 bg-white/30'}`}
                          />
                        ))}
                      </div>
                    )}
                    <div className="absolute bottom-6 left-6 z-20">
                      <span className="text-gold/70 text-[10px] font-montserrat tracking-[0.3em] uppercase">0{activeIndex + 1}</span>
                      <h3 className="text-white text-3xl font-montserrat font-black mt-1">{active.category}</h3>
                    </div>
                  </div>

                  {/* Details side */}
                  <div className="flex-1 p-6 lg:p-12 flex flex-col gap-6 bg-white/2">
                    <p className="text-white/60 text-sm font-montserrat font-light leading-relaxed">{active.description}</p>

                    <div>
                      <p className="text-gold/70 text-[10px] font-montserrat tracking-[0.25em] uppercase mb-4">What's Included</p>
                      <ul className="flex flex-col gap-3">
                        {active.offerings.map((item, i) => (
                          <motion.li
                            key={item}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.07, duration: 0.35 }}
                            className="flex items-center gap-3"
                          >
                            <div className="w-5 h-5 rounded-full border border-gold/40 bg-gold/10 flex items-center justify-center shrink-0">
                              <Check size={10} className="text-gold" />
                            </div>
                            <span className="text-white/75 text-sm font-montserrat font-light tracking-wide">{item}</span>
                          </motion.li>
                        ))}
                      </ul>
                    </div>

                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-6 border-t border-white/10">
                      <p className="text-white/30 text-[10px] font-montserrat tracking-wider uppercase">{active.note}</p>
                      <Link
                        to="/booking"
                        className="inline-flex items-center gap-2 px-7 py-2.5 bg-gold/10 border border-gold/50 text-gold text-xs font-montserrat font-bold tracking-[0.15em] uppercase hover:bg-gold hover:text-black transition-all duration-300 rounded-sm whitespace-nowrap"
                      >
                        Book Now <ArrowRight size={12} />
                      </Link>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </motion.div>

        {/* Process section */}
        <div className="border-t border-white/10 pt-20">
          <motion.div {...fadeUp(0)} className="mb-14 text-center flex flex-col items-center">
            <SectionHeading eyebrow="How It Works" title="The Process" subtitle="From first contact to final delivery — a seamless, professional experience." center />
          </motion.div>

          <div className="relative">
            {/* Connecting line */}
            <div className="hidden md:block absolute top-10 left-[12.5%] right-[12.5%] h-[1px] bg-gradient-to-r from-transparent via-gold/30 to-transparent z-0" />

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative z-10">
              {steps.map((item, i) => (
                <motion.div
                  key={item.step}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: i * 0.12 }}
                  whileHover={{ y: -6 }}
                  className="cursor-default"
                >
                  <GlassCard className="p-8 flex flex-col gap-3 text-center items-center transition-all duration-300 hover:border-gold/30">
                    <div className="w-12 h-12 rounded-full border border-gold/30 bg-gold/5 flex items-center justify-center mb-1">
                      <span className="text-gold text-sm font-montserrat font-black">{item.step}</span>
                    </div>
                    <h4 className="text-white font-montserrat font-semibold text-sm tracking-wider uppercase">{item.title}</h4>
                    <p className="text-white/40 text-xs font-montserrat font-light leading-relaxed">{item.desc}</p>
                  </GlassCard>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* SEO Content Block — Photography Services in Sandton */}
        <div className="border-t border-white/6 pt-20 mb-0">
          <motion.div {...fadeUp(0)} className="mb-10">
            <span className="text-gold text-xs font-montserrat font-semibold tracking-[0.3em] uppercase">Photography Services in Sandton</span>
            <h2 className="text-2xl md:text-3xl font-montserrat font-bold text-white mt-4 mb-6 leading-tight">
              Why Clients in Sandton Choose Stills by Brooklyn
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 text-white/45 text-sm font-montserrat font-light leading-relaxed">
              <div className="flex flex-col gap-4">
                <p>
                  Sandton is home to South Africa's most ambitious professionals and businesses, and your photography should reflect that. Stills by Brooklyn provides photography services tailored specifically to the Sandton market — from executive headshots for the JSE-listed boardroom to intimate portrait sessions for families in Morningside and Bryanston.
                </p>
                <p>
                  Corporate clients in Sandton trust Stills by Brooklyn for fast-turnaround team headshots, consistent brand imagery for websites and press releases, and polished event photography that captures company milestones with impact. Half-day and full-day rates are available for organisations of all sizes.
                </p>
              </div>
              <div className="flex flex-col gap-4">
                <p>
                  Portrait and wedding photography in the Sandton area benefits from access to stunning locations — from the lush gardens of Melrose Arch to the clean architectural lines of Sandton City. Stills by Brooklyn offers both studio and on-location sessions, advising clients on the best settings for their specific vision.
                </p>
                <p>
                  Graduation photography for students at Wits, UJ, and other Gauteng institutions is another specialty, capturing milestone achievements with the care and quality they deserve. All sessions include professional retouching and high-resolution delivery within an agreed timeframe.
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* CTA */}
        <motion.div {...fadeUp(0)} className="mt-24 text-center">
          <GlassCard className="py-16 px-10 max-w-2xl mx-auto relative overflow-hidden">
            <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-64 h-24 bg-gold/10 blur-3xl rounded-full pointer-events-none" />
            <p className="text-gold text-xs font-montserrat tracking-[0.3em] uppercase mb-3">Ready to Begin?</p>
            <h3 className="text-white text-2xl font-montserrat font-bold mb-3">Let's Create Something Memorable</h3>
            <p className="text-white/40 text-xs font-montserrat font-light leading-relaxed mb-8 max-w-md mx-auto">
              Reach out for a personalized quote and let's discuss how to bring your vision to life.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link to="/contact" className="inline-flex items-center justify-center gap-3 px-10 py-3.5 border border-gold/60 bg-gold/10 text-gold text-xs font-montserrat font-bold tracking-[0.2em] uppercase transition-all duration-300 hover:bg-gold hover:text-black rounded-sm">
                Get a Quote <ArrowRight size={14} />
              </Link>
              <Link to="/booking" className="inline-flex items-center justify-center gap-3 px-10 py-3.5 border border-white/15 text-white/60 text-xs font-montserrat font-bold tracking-[0.2em] uppercase transition-all duration-300 hover:border-white/40 hover:text-white rounded-sm">
                Book a Session
              </Link>
            </div>
          </GlassCard>
        </motion.div>

      </div>
    </div>
  );
}