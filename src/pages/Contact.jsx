import { useState, useEffect } from 'react';
import { Mail, Phone, MapPin, Send, MessageCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import SectionHeading from '../components/SectionHeading';
import GlassCard from '../components/GlassCard';
import { base44 } from '@/api/base44Client';
import PagePhotoBackground from '../components/PagePhotoBackground';

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-60px' },
  transition: { duration: 0.7, ease: 'easeOut', delay },
});

export default function Contact() {
  useEffect(() => {
    document.title = 'Contact Brooklyn | Get a Quote for Photography Services';
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute('content', 'Get in touch with Stills by Brooklyn. Request a quote, ask about availability, or discuss your next photography project. Based in Midrand, serving all of South Africa.');
  }, []);

   const [form, setForm] = useState({ name: '', email: '', phone: '', service: '', message: '' });
   const [submitted, setSubmitted] = useState(false);
   const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    await base44.functions.invoke('sendEmails', { type: 'contact', data: form });
    setSubmitting(false);
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen pt-32 pb-24 relative">
      <PagePhotoBackground src="https://media.base44.com/images/public/69cfd090f016bb0f1b452639/47ae0dc0f_DSC_4110.jpg" />
      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-10">
        {/* Header */}
        <motion.div {...fadeUp(0)} className="mb-20 text-center flex flex-col items-center">
          <SectionHeading eyebrow="Let's Connect" title="Get In Touch" subtitle="Ready to create something beautiful together? Reach out and let's start the conversation." center />
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
          {/* Contact info */}
          <motion.div {...fadeUp(0.1)} className="lg:col-span-2">
            <GlassCard className="p-10 flex flex-col gap-8 h-full">
              <div>
                <h3 className="text-white font-montserrat font-semibold tracking-wider text-sm uppercase mb-6">Contact Details</h3>
                <div className="flex flex-col gap-6">
                  <a href="mailto:info@stillsbybrooklyn.co.za" className="flex items-start gap-4 group">
                    <div className="w-9 h-9 border border-gold/30 flex items-center justify-center shrink-0 group-hover:bg-gold/10 transition-colors duration-300">
                      <Mail size={14} className="text-gold" />
                    </div>
                    <div>
                      <p className="text-white/30 text-[10px] font-montserrat tracking-[0.2em] uppercase mb-1">Email</p>
                      <p className="text-white/80 text-xs font-montserrat hover:text-gold transition-colors duration-200">info@stillsbybrooklyn.co.za</p>
                    </div>
                  </a>
                  <a href="tel:0677860702" className="flex items-start gap-4 group">
                    <div className="w-9 h-9 border border-gold/30 flex items-center justify-center shrink-0 group-hover:bg-gold/10 transition-colors duration-300">
                      <Phone size={14} className="text-gold" />
                    </div>
                    <div>
                      <p className="text-white/30 text-[10px] font-montserrat tracking-[0.2em] uppercase mb-1">Phone</p>
                      <p className="text-white/80 text-xs font-montserrat hover:text-gold transition-colors duration-200">067 786 0702</p>
                    </div>
                  </a>
                  <a href="https://wa.me/27663492811?text=Hi%20Brooklyn%2C%20I%27d%20like%20to%20inquire%20about%20your%20photography%20services.%20Could%20you%20tell%20me%20more%3F" target="_blank" rel="noopener noreferrer" className="flex items-start gap-4 group">
                    <div className="w-9 h-9 border border-gold/30 flex items-center justify-center shrink-0 group-hover:bg-gold/10 transition-colors duration-300">
                      <MessageCircle size={14} className="text-gold" />
                    </div>
                    <div>
                      <p className="text-white/30 text-[10px] font-montserrat tracking-[0.2em] uppercase mb-1">WhatsApp</p>
                      <p className="text-white/80 text-xs font-montserrat hover:text-gold transition-colors duration-200">Message on WhatsApp</p>
                    </div>
                  </a>
                  <div className="flex items-start gap-4">
                    <div className="w-9 h-9 border border-gold/30 flex items-center justify-center shrink-0">
                      <MapPin size={14} className="text-gold" />
                    </div>
                    <div>
                      <p className="text-white/30 text-[10px] font-montserrat tracking-[0.2em] uppercase mb-1">Location</p>
                      <p className="text-white/80 text-xs font-montserrat leading-relaxed">
                        Midrand, South Africa<br />
                        <span className="text-gold/70">Available Nationwide</span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="border-t border-white/10 pt-8">
                <p className="text-white/30 text-[10px] font-montserrat tracking-[0.2em] uppercase mb-4">Response Time</p>
                <p className="text-white/50 text-xs font-montserrat font-light leading-relaxed">
                  All enquiries are responded to within 24–48 hours. For urgent bookings, please call directly.
                </p>
              </div>
            </GlassCard>
          </motion.div>

          {/* Form */}
          <motion.div {...fadeUp(0.2)} className="lg:col-span-3">
            <GlassCard className="p-10 h-full">
              {submitted ? (
                <div className="h-full flex flex-col items-center justify-center gap-4 text-center py-12">
                  <div className="w-12 h-12 border border-gold flex items-center justify-center">
                    <Send size={18} className="text-gold" />
                  </div>
                  <h3 className="text-white font-montserrat font-semibold tracking-wider text-base">Message Sent</h3>
                  <p className="text-white/50 text-xs font-montserrat font-light leading-relaxed max-w-xs">
                    Thank you for reaching out. Brooklyn will be in touch within 24–48 hours.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-2">
                      <label className="text-white/40 text-[10px] font-montserrat tracking-[0.2em] uppercase">Full Name</label>
                      <input name="name" value={form.name} onChange={handleChange} required placeholder="Your name"
                        className="bg-black/40 border border-white/10 text-white text-xs font-montserrat px-4 py-3 placeholder:text-white/20 focus:border-gold/50 focus:outline-none transition-colors duration-200 rounded-sm" />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-white/40 text-[10px] font-montserrat tracking-[0.2em] uppercase">Email Address</label>
                      <input name="email" type="email" value={form.email} onChange={handleChange} required placeholder="your@email.com"
                        className="bg-black/40 border border-white/10 text-white text-xs font-montserrat px-4 py-3 placeholder:text-white/20 focus:border-gold/50 focus:outline-none transition-colors duration-200 rounded-sm" />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-2">
                      <label className="text-white/40 text-[10px] font-montserrat tracking-[0.2em] uppercase">Phone Number</label>
                      <input name="phone" value={form.phone} onChange={handleChange} placeholder="Your phone number"
                        className="bg-black/40 border border-white/10 text-white text-xs font-montserrat px-4 py-3 placeholder:text-white/20 focus:border-gold/50 focus:outline-none transition-colors duration-200 rounded-sm" />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-white/40 text-[10px] font-montserrat tracking-[0.2em] uppercase">Service</label>
                      <select name="service" value={form.service} onChange={handleChange}
                        className="bg-black/40 border border-white/10 text-white text-xs font-montserrat px-4 py-3 focus:border-gold/50 focus:outline-none transition-colors duration-200 appearance-none rounded-sm">
                        <option value="" className="bg-zinc-900">Select a service</option>
                        <option value="corporate" className="bg-zinc-900">Corporate</option>
                        <option value="portraits" className="bg-zinc-900">Portraits</option>
                        <option value="weddings" className="bg-zinc-900">Weddings</option>
                      </select>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-white/40 text-[10px] font-montserrat tracking-[0.2em] uppercase">Message</label>
                    <textarea name="message" value={form.message} onChange={handleChange} required rows={5} placeholder="Tell me about your project, date, location..."
                      className="bg-black/40 border border-white/10 text-white text-xs font-montserrat px-4 py-3 placeholder:text-white/20 focus:border-gold/50 focus:outline-none transition-colors duration-200 resize-none rounded-sm" />
                  </div>
                  <button type="submit" disabled={submitting}
                    className="mt-2 px-10 py-4 border border-gold/60 bg-gold/10 text-gold text-xs font-montserrat font-bold tracking-[0.2em] uppercase transition-all duration-300 hover:bg-gold hover:text-black flex items-center justify-center gap-2 self-start rounded-sm disabled:opacity-50 disabled:cursor-not-allowed">
                    {submitting ? 'Sending...' : <><span>Send Message</span><Send size={13} /></>}
                  </button>
                </form>
              )}
            </GlassCard>
          </motion.div>
        </div>
      </div>
    </div>
  );
}