import { useState, useEffect } from 'react';
import { sendEmail } from '@/lib/sendEmail';

import { motion } from 'framer-motion';
import GlassCard from '../components/GlassCard';
import PagePhotoBackground from '../components/PagePhotoBackground';
import BookingStep1Service from '../components/booking/BookingStep1Service';
import BookingStep2Calendar from '../components/booking/BookingStep2Calendar';
import BookingStep3Time from '../components/booking/BookingStep3Time';
import BookingStep4Details from '../components/booking/BookingStep4Details';
import BookingSuccess from '../components/booking/BookingSuccess';

const STEPS = ['Service', 'Date', 'Time', 'Details'];

const emptyBooking = {
  service: '', date: '', time: '',
  full_name: '', email: '', phone: '', notes: '',
  location_type: '', location_address: '', venue_name: '',
};

function validateStep4(booking) {
  const errors = {};
  if (!booking.full_name.trim()) errors.full_name = 'Full name is required.';
  if (!booking.email.trim()) errors.email = 'Email is required.';
  else if (!/\S+@\S+\.\S+/.test(booking.email)) errors.email = 'Enter a valid email address.';
  if (!booking.phone.trim()) errors.phone = 'Phone number is required.';
  if (booking.service === 'Portraits') {
    if (!booking.location_address.trim())
      errors.location_address = 'Location address is required.';
  }
  if (booking.service === 'Weddings') {
    if (!booking.venue_name.trim()) errors.venue_name = 'Venue name is required.';
    if (!booking.location_address.trim()) errors.location_address = 'Venue address is required.';
  }
  return errors;
}

export default function Booking() {
  useEffect(() => {
    document.title = 'Book a Photography Session';
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute('content', 'Book a photography session with Stills by Brooklyn. Choose from corporate, portrait, wedding, and graduation packages. Available across Johannesburg and South Africa.');
  }, []);

   const [step, setStep] = useState(0);
   const [booking, setBooking] = useState(emptyBooking);
   const [errors, setErrors] = useState({});
   const [submitted, setSubmitted] = useState(false);
   const [submitting, setSubmitting] = useState(false);
   const [submitError, setSubmitError] = useState('');

  const updateField = (field, value) => {
    setBooking(prev => ({ ...prev, [field]: value }));
    setErrors(prev => ({ ...prev, [field]: undefined }));
  };

  const canAdvance = () => {
    if (step === 0) return !!booking.service;
    if (step === 1) return !!booking.date;
    if (step === 2) return !!booking.time;
    return true;
  };

  const handleNext = () => {
    if (step === 3) {
      const errs = validateStep4(booking);
      if (Object.keys(errs).length > 0) { setErrors(errs); return; }
      handleSubmit();
    } else {
      setStep(s => s + 1);
    }
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    setSubmitError('');
    try {
      await sendEmail('booking', booking);
    } catch (err) {
      console.error('Booking failed:', err);
      setSubmitError("Sorry, your booking couldn't be submitted. Please try again, or WhatsApp/call 067 786 0702.");
      setSubmitting(false);
      return;
    }
    setSubmitting(false);
    setSubmitted(true);
  };

  const handleServiceSelect = (service) => {
    setBooking(prev => ({ ...emptyBooking, service }));
  };

  return (
    <div className="min-h-screen pt-32 pb-24 relative">
      <PagePhotoBackground src="https://media.base44.com/images/public/69cfd090f016bb0f1b452639/922435be1_DSC_4228.jpg" />
      <div className="relative z-10 max-w-3xl mx-auto px-6">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-center mb-12"
        >
          <span className="text-gold text-xs font-montserrat font-semibold tracking-[0.3em] uppercase">Stills by Brooklyn</span>
          <h1 className="text-4xl font-montserrat font-bold text-white mt-3 mb-2">Book a Session</h1>
          <p className="text-white/40 font-montserrat text-sm">Midrand, South Africa — Available Nationwide</p>
        </motion.div>

        {!submitted ? (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}>
            {/* Progress indicator */}
            <div className="flex items-center justify-center mb-12">
              {STEPS.map((label, i) => (
                <div key={label} className="flex items-center">
                  <div className="flex flex-col items-center gap-1.5">
                    <div className={`w-8 h-8 flex items-center justify-center text-xs font-montserrat font-bold border transition-all duration-300 ${
                      i < step ? 'bg-gold border-gold text-black'
                      : i === step ? 'border-gold text-gold'
                      : 'border-white/15 text-white/30'
                    }`}>
                      {i < step ? '✓' : i + 1}
                    </div>
                    <span className={`text-[10px] font-montserrat uppercase tracking-wider hidden sm:block ${i === step ? 'text-gold' : 'text-white/30'}`}>
                      {label}
                    </span>
                  </div>
                  {i < STEPS.length - 1 && (
                    <div className={`w-12 sm:w-20 h-[1px] mb-4 mx-2 transition-all duration-300 ${i < step ? 'bg-gold' : 'bg-white/10'}`} />
                  )}
                </div>
              ))}
            </div>

            {/* Step content */}
            <GlassCard className="p-8 mb-8">
              {step === 0 && <BookingStep1Service selected={booking.service} onSelect={handleServiceSelect} />}
              {step === 1 && <BookingStep2Calendar selected={booking.date} onSelect={d => updateField('date', d)} />}
              {step === 2 && <BookingStep3Time service={booking.service} selected={booking.time} onSelect={t => updateField('time', t)} />}
              {step === 3 && <BookingStep4Details booking={booking} onChange={updateField} errors={errors} />}
            </GlassCard>

            {/* Navigation */}
            <div className="flex justify-between items-center">
              <button
                onClick={() => setStep(s => s - 1)}
                disabled={step === 0}
                className="px-6 py-3 border border-white/15 text-white/50 text-xs font-montserrat uppercase tracking-wider hover:border-white/40 hover:text-white transition-all duration-200 disabled:opacity-0 disabled:pointer-events-none rounded-sm"
              >
                ← Back
              </button>
              <button
                onClick={handleNext}
                disabled={!canAdvance() || submitting}
                className="px-10 py-3 border border-gold/60 bg-gold/10 text-gold text-xs font-montserrat font-bold uppercase tracking-[0.2em] hover:bg-gold hover:text-black transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed rounded-sm"
              >
                {submitting ? 'Submitting...' : step === 3 ? 'Confirm Booking' : 'Continue →'}
              </button>
            </div>
            {submitError && <p role="alert" className="text-red-400 text-xs font-montserrat text-right mt-4">{submitError}</p>}
          </motion.div>
        ) : (
          <BookingSuccess booking={booking} />
        )}
      </div>
    </div>
  );
}