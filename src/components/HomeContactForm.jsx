import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, CheckCircle, User, Mail, Phone, ChevronDown } from 'lucide-react';
import { sendEmail } from '@/lib/sendEmail';

const SERVICES = ['Corporate', 'Portraits', 'Weddings', 'Graduations'];

const inputBase =
  'w-full bg-white/5 border border-white/10 text-foreground text-xs font-montserrat px-4 py-3.5 placeholder:text-foreground/20 focus:border-gold/60 focus:outline-none focus:bg-white/8 transition-all duration-300 rounded-sm';

const errorClass = 'border-red-500/60 bg-red-500/5';

function FieldWrapper({ label, error, children }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-foreground/40 text-[10px] font-montserrat tracking-[0.22em] uppercase">
        {label}
      </label>
      {children}
      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.2 }}
            className="text-red-400 text-[10px] font-montserrat"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

function validate(form) {
  const errors = {};
  if (!form.name.trim()) errors.name = 'Name is required.';
  if (!form.email.trim()) errors.email = 'Email is required.';
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errors.email = 'Please enter a valid email.';
  if (!form.message.trim()) errors.message = 'Please tell us about your project.';
  return errors;
}

export default function HomeContactForm() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', service: '', message: '' });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [sendError, setSendError] = useState('');

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    if (errors[e.target.name]) setErrors(prev => ({ ...prev, [e.target.name]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate(form);
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setSubmitting(true);
    setSendError('');
    try {
      await sendEmail('contact', form);
      setSubmitted(true);
    } catch (err) {
      console.error('Contact form failed:', err);
      setSendError("Sorry, your message couldn't be sent. Please try again, or WhatsApp/call 067 786 0702.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="py-24 px-6 relative z-10">
      <div className="max-w-5xl mx-auto">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.7 }}
          className="flex flex-col items-center text-center mb-12"
        >
          <span className="text-gold text-xs font-montserrat font-semibold tracking-[0.3em] uppercase mb-3">
            Start the Conversation
          </span>
          <h2 className="text-3xl md:text-4xl font-montserrat font-bold text-foreground mb-4 relative pb-4 after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-14 after:h-[2px] after:bg-gold">
            Get In Touch
          </h2>
          <p className="text-foreground/45 text-sm font-montserrat font-light leading-relaxed max-w-md mt-2">
            Ready to create something beautiful? Share a few details and Brooklyn will be in touch within 24–48 hours.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="relative rounded-2xl border border-white/10 bg-white/5 shadow-[0_8px_32px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.08)] overflow-hidden"
        >
          {/* Gold top accent */}
          <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-gold/60 to-transparent" />

          <AnimatePresence mode="wait">
            {submitted ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4 }}
                className="py-20 flex flex-col items-center gap-5 text-center px-8"
              >
                <motion.div
                  initial={{ scale: 0, rotate: -20 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ duration: 0.5, delay: 0.1, type: 'spring', stiffness: 200 }}
                  className="w-16 h-16 border border-gold/50 bg-gold/10 rounded-full flex items-center justify-center"
                >
                  <CheckCircle size={26} className="text-gold" />
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.25 }}
                >
                  <h3 className="text-foreground font-montserrat font-bold tracking-wider text-lg mb-2">
                    Message Sent
                  </h3>
                  <p className="text-foreground/50 text-xs font-montserrat font-light leading-relaxed max-w-xs">
                    Thank you for reaching out. Brooklyn will respond within 24–48 hours.
                  </p>
                </motion.div>
              </motion.div>
            ) : (
              <motion.form
                key="form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onSubmit={handleSubmit}
                className="p-8 md:p-12"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                  {/* Name */}
                  <FieldWrapper label="Full Name *" error={errors.name}>
                    <div className="relative">
                      <User size={13} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-foreground/25 pointer-events-none" />
                      <input
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        placeholder="Your name"
                        className={`${inputBase} pl-9 ${errors.name ? errorClass : ''}`}
                      />
                    </div>
                  </FieldWrapper>

                  {/* Email */}
                  <FieldWrapper label="Email Address *" error={errors.email}>
                    <div className="relative">
                      <Mail size={13} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-foreground/25 pointer-events-none" />
                      <input
                        name="email"
                        type="email"
                        value={form.email}
                        onChange={handleChange}
                        placeholder="your@email.com"
                        className={`${inputBase} pl-9 ${errors.email ? errorClass : ''}`}
                      />
                    </div>
                  </FieldWrapper>

                  {/* Phone */}
                  <FieldWrapper label="Phone Number">
                    <div className="relative">
                      <Phone size={13} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-foreground/25 pointer-events-none" />
                      <input
                        name="phone"
                        value={form.phone}
                        onChange={handleChange}
                        placeholder="Your phone number"
                        className={`${inputBase} pl-9`}
                      />
                    </div>
                  </FieldWrapper>

                  {/* Service */}
                  <FieldWrapper label="Service Interested In">
                    <div className="relative">
                      <select
                        name="service"
                        value={form.service}
                        onChange={handleChange}
                        className={`${inputBase} appearance-none pr-9`}
                        style={{ color: form.service ? 'inherit' : 'rgba(255,255,255,0.2)' }}
                      >
                        <option value="" className="bg-zinc-900 text-white/60">Select a service</option>
                        {SERVICES.map(s => (
                          <option key={s} value={s.toLowerCase()} className="bg-zinc-900 text-white">{s}</option>
                        ))}
                      </select>
                      <ChevronDown size={13} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-foreground/30 pointer-events-none" />
                    </div>
                  </FieldWrapper>
                </div>

                {/* Message */}
                <div className="mb-7">
                  <FieldWrapper label="Your Message *" error={errors.message}>
                    <textarea
                      name="message"
                      value={form.message}
                      onChange={handleChange}
                      rows={4}
                      placeholder="Tell me about your project, vision, date, location..."
                      className={`${inputBase} resize-none ${errors.message ? errorClass : ''}`}
                    />
                  </FieldWrapper>
                </div>

                {/* Submit */}
                <div className="flex items-center justify-between gap-4 flex-wrap">
                  <p className="text-foreground/25 text-[10px] font-montserrat tracking-wider">
                    * Required fields
                  </p>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="relative inline-flex items-center gap-2.5 px-10 py-3.5 border border-gold/60 bg-gold/10 text-gold text-xs font-montserrat font-bold tracking-[0.2em] uppercase rounded-sm hover:bg-gold hover:text-black transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden group"
                  >
                    {/* Shimmer */}
                    <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/10 to-transparent pointer-events-none" />
                    {submitting ? (
                      <>
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                          className="w-3.5 h-3.5 border border-gold/60 border-t-gold rounded-full"
                        />
                        <span>Sending…</span>
                      </>
                    ) : (
                      <>
                        <span>Send Message</span>
                        <Send size={12} />
                      </>
                    )}
                  </button>
                </div>
                {sendError && <p role="alert" className="text-red-400 text-xs font-montserrat mt-2">{sendError}</p>}
              </motion.form>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}