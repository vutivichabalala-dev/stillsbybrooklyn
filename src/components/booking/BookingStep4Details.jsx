import { format } from 'date-fns';
import { Briefcase, User, Heart, Calendar, Clock, MapPin } from 'lucide-react';

const serviceIcons = { Corporate: Briefcase, Portraits: User, Weddings: Heart };

function formatTime(t) {
  if (!t) return '';
  const [h, m] = t.split(':').map(Number);
  const ampm = h >= 12 ? 'PM' : 'AM';
  const hour = h % 12 || 12;
  return `${hour}:${m.toString().padStart(2, '0')} ${ampm}`;
}

export default function BookingStep4Details({ booking, onChange, errors }) {
  const Icon = serviceIcons[booking.service] || Calendar;

  return (
    <div>
      <h2 className="text-2xl font-montserrat font-bold text-white mb-2">Your Details</h2>
      <p className="text-white/50 text-sm font-montserrat mb-8">Almost done — just a few more details to confirm your booking.</p>

      {/* Summary */}
      <div className="bg-gold/10 border border-gold/30 p-5 mb-8 flex flex-wrap gap-4">
        <div className="flex items-center gap-2 text-gold text-sm font-montserrat">
          <Icon size={15} /> <span className="font-semibold">{booking.service}</span>
        </div>
        <div className="flex items-center gap-2 text-white/70 text-sm font-montserrat">
          <Calendar size={15} /> <span>{booking.date ? format(new Date(booking.date), 'EEE, MMM d yyyy') : '—'}</span>
        </div>
        <div className="flex items-center gap-2 text-white/70 text-sm font-montserrat">
          <Clock size={15} /> <span>{formatTime(booking.time) || '—'}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Full Name */}
        <div className="flex flex-col gap-1.5">
          <label className="text-white/60 text-xs font-montserrat uppercase tracking-wider">Full Name *</label>
          <input
            type="text"
            value={booking.full_name || ''}
            onChange={e => onChange('full_name', e.target.value)}
            placeholder="Jane Smith"
            className={`bg-white/5 border ${errors.full_name ? 'border-red-500' : 'border-white/15'} text-white font-montserrat text-sm px-4 py-3 focus:outline-none focus:border-gold transition-colors placeholder:text-white/25`}
          />
          {errors.full_name && <span className="text-red-400 text-xs font-montserrat">{errors.full_name}</span>}
        </div>

        {/* Email */}
        <div className="flex flex-col gap-1.5">
          <label className="text-white/60 text-xs font-montserrat uppercase tracking-wider">Email Address *</label>
          <input
            type="email"
            value={booking.email || ''}
            onChange={e => onChange('email', e.target.value)}
            placeholder="jane@example.com"
            className={`bg-white/5 border ${errors.email ? 'border-red-500' : 'border-white/15'} text-white font-montserrat text-sm px-4 py-3 focus:outline-none focus:border-gold transition-colors placeholder:text-white/25`}
          />
          {errors.email && <span className="text-red-400 text-xs font-montserrat">{errors.email}</span>}
        </div>

        {/* Phone */}
        <div className="flex flex-col gap-1.5">
          <label className="text-white/60 text-xs font-montserrat uppercase tracking-wider">Phone Number *</label>
          <input
            type="tel"
            value={booking.phone || ''}
            onChange={e => onChange('phone', e.target.value)}
            placeholder="+27 82 000 0000"
            className={`bg-white/5 border ${errors.phone ? 'border-red-500' : 'border-white/15'} text-white font-montserrat text-sm px-4 py-3 focus:outline-none focus:border-gold transition-colors placeholder:text-white/25`}
          />
          {errors.phone && <span className="text-red-400 text-xs font-montserrat">{errors.phone}</span>}
        </div>

        {/* Notes */}
        <div className="flex flex-col gap-1.5">
          <label className="text-white/60 text-xs font-montserrat uppercase tracking-wider">Notes (Optional)</label>
          <input
            type="text"
            value={booking.notes || ''}
            onChange={e => onChange('notes', e.target.value)}
            placeholder="Any special requests..."
            className="bg-white/5 border border-white/15 text-white font-montserrat text-sm px-4 py-3 focus:outline-none focus:border-gold transition-colors placeholder:text-white/25"
          />
        </div>

        {/* PORTRAITS: on location address */}
        {booking.service === 'Portraits' && (
          <div className="md:col-span-2 flex flex-col gap-1.5">
            <label className="text-white/60 text-xs font-montserrat uppercase tracking-wider">Location Address *</label>
            <input
              type="text"
              value={booking.location_address || ''}
              onChange={e => onChange('location_address', e.target.value)}
              placeholder="123 Main Street, Midrand"
              className={`bg-white/5 border ${errors.location_address ? 'border-red-500' : 'border-white/15'} text-white font-montserrat text-sm px-4 py-3 focus:outline-none focus:border-gold transition-colors placeholder:text-white/25`}
            />
            {errors.location_address && <span className="text-red-400 text-xs font-montserrat">{errors.location_address}</span>}
          </div>
        )}

        {/* WEDDINGS: venue fields */}
        {booking.service === 'Weddings' && (
          <>
            <div className="flex flex-col gap-1.5">
              <label className="text-white/60 text-xs font-montserrat uppercase tracking-wider">Venue Name *</label>
              <input
                type="text"
                value={booking.venue_name || ''}
                onChange={e => onChange('venue_name', e.target.value)}
                placeholder="The Grand Palace"
                className={`bg-white/5 border ${errors.venue_name ? 'border-red-500' : 'border-white/15'} text-white font-montserrat text-sm px-4 py-3 focus:outline-none focus:border-gold transition-colors placeholder:text-white/25`}
              />
              {errors.venue_name && <span className="text-red-400 text-xs font-montserrat">{errors.venue_name}</span>}
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-white/60 text-xs font-montserrat uppercase tracking-wider">Venue Address *</label>
              <input
                type="text"
                value={booking.location_address || ''}
                onChange={e => onChange('location_address', e.target.value)}
                placeholder="456 Wedding Ave, Sandton"
                className={`bg-white/5 border ${errors.location_address ? 'border-red-500' : 'border-white/15'} text-white font-montserrat text-sm px-4 py-3 focus:outline-none focus:border-gold transition-colors placeholder:text-white/25`}
              />
              {errors.location_address && <span className="text-red-400 text-xs font-montserrat">{errors.location_address}</span>}
            </div>
          </>
        )}
      </div>
    </div>
  );
}