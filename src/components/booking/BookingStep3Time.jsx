import { useState } from 'react';

const corporatePortraitSlots = ['09:00', '10:30', '12:00', '13:30', '15:00', '16:30'];
const weddingSlots = ['10:00', '12:00', '14:00'];

function formatTime(t) {
  if (!t) return '';
  const [h, m] = t.split(':').map(Number);
  const ampm = h >= 12 ? 'PM' : 'AM';
  const hour = h % 12 || 12;
  return `${hour}:${m.toString().padStart(2, '0')} ${ampm}`;
}

export default function BookingStep3Time({ service, selected, onSelect }) {
  const slots = service === 'Weddings' ? weddingSlots : corporatePortraitSlots;
  const [customTime, setCustomTime] = useState('');
  const isCustom = selected && !slots.includes(selected);

  const handleCustomChange = (e) => {
    setCustomTime(e.target.value);
    onSelect(e.target.value);
  };

  return (
    <div>
      <h2 className="text-2xl font-montserrat font-bold text-white mb-2">Choose a Time</h2>
      <p className="text-white/50 text-sm font-montserrat mb-8">All times are in South African Standard Time (SAST).</p>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-w-md mx-auto mb-4">
        {slots.map(slot => {
          const isSelected = selected === slot;
          return (
            <button
              key={slot}
              onClick={() => { setCustomTime(''); onSelect(slot); }}
              className={`py-4 text-center font-montserrat font-medium text-sm border transition-all duration-200 ${
                isSelected
                  ? 'bg-gold text-black border-gold font-bold'
                  : 'border-white/15 text-white/70 hover:border-gold/50 hover:text-white'
              }`}
            >
              {formatTime(slot)}
            </button>
          );
        })}
      </div>

      {/* Custom time option */}
      <div className="max-w-md mx-auto">
        <p className="text-white/40 text-xs font-montserrat uppercase tracking-wider mb-3 text-center">— or enter a custom time —</p>
        <div className="relative">
          <input
            type="time"
            value={customTime || (isCustom ? selected : '')}
            onChange={handleCustomChange}
            className={`w-full bg-white/5 border ${isCustom ? 'border-gold' : 'border-white/15'} text-white font-montserrat text-sm px-4 py-3 focus:outline-none focus:border-gold transition-colors`}
          />
          {isCustom && (
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gold text-xs font-montserrat font-bold">Selected</span>
          )}
        </div>
      </div>
    </div>
  );
}