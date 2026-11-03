import { CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';

function formatTime(t) {
  if (!t) return '';
  const [h, m] = t.split(':').map(Number);
  const ampm = h >= 12 ? 'PM' : 'AM';
  const hour = h % 12 || 12;
  return `${hour}:${m.toString().padStart(2, '0')} ${ampm}`;
}

export default function BookingSuccess({ booking }) {
  return (
    <div className="text-center py-8">
      <div className="flex justify-center mb-6">
        <div className="w-20 h-20 rounded-full bg-gold/15 border border-gold/40 flex items-center justify-center">
          <CheckCircle size={40} className="text-gold" />
        </div>
      </div>
      <h2 className="text-3xl font-montserrat font-bold text-white mb-3">Booking Request Sent!</h2>
      <p className="text-white/50 font-montserrat text-sm mb-8 max-w-sm mx-auto leading-relaxed">
        Thank you, <span className="text-white font-medium">{booking.full_name}</span>. We've received your request and will confirm within 24 hours.
      </p>

      <div className="bg-white/5 border border-white/10 p-6 max-w-sm mx-auto text-left space-y-3 mb-8">
        <SummaryRow label="Service" value={booking.service} />
        <SummaryRow label="Date" value={booking.date ? format(new Date(booking.date), 'EEE, MMMM d yyyy') : '—'} />
        <SummaryRow label="Time" value={formatTime(booking.time)} />
        <SummaryRow label="Email" value={booking.email} />
        {booking.venue_name && <SummaryRow label="Venue" value={booking.venue_name} />}
        {booking.location_address && <SummaryRow label="Address" value={booking.location_address} />}
        {booking.location_type && <SummaryRow label="Location" value={booking.location_type} />}
      </div>

      <Link
        to="/"
        className="inline-flex items-center gap-2 px-8 py-3 bg-gold text-black text-xs font-montserrat font-bold tracking-[0.2em] uppercase hover:bg-white transition-colors duration-300"
      >
        Back to Home
      </Link>
    </div>
  );
}

function SummaryRow({ label, value }) {
  return (
    <div className="flex justify-between gap-4">
      <span className="text-white/40 text-xs font-montserrat uppercase tracking-wider">{label}</span>
      <span className="text-white text-sm font-montserrat text-right">{value}</span>
    </div>
  );
}