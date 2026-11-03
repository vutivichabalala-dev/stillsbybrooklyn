import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, getDay, isSameDay, isBefore, startOfDay, addMonths, subMonths } from 'date-fns';

export default function BookingStep2Calendar({ selected, onSelect }) {
  const [viewMonth, setViewMonth] = useState(new Date());
  const today = startOfDay(new Date());

  const days = eachDayOfInterval({ start: startOfMonth(viewMonth), end: endOfMonth(viewMonth) });
  const startPad = getDay(startOfMonth(viewMonth)); // 0=Sun

  return (
    <div>
      <h2 className="text-2xl font-montserrat font-bold text-white mb-2">Pick a Date</h2>
      <p className="text-white/50 text-sm font-montserrat mb-8">Choose your preferred date. Sundays and past dates are unavailable.</p>

      <div className="max-w-md mx-auto">
        {/* Month nav */}
        <div className="flex items-center justify-between mb-6">
          <button onClick={() => setViewMonth(subMonths(viewMonth, 1))} className="p-2 text-white/50 hover:text-gold transition-colors">
            <ChevronLeft size={20} />
          </button>
          <span className="font-montserrat font-semibold text-white tracking-wider">
            {format(viewMonth, 'MMMM yyyy')}
          </span>
          <button onClick={() => setViewMonth(addMonths(viewMonth, 1))} className="p-2 text-white/50 hover:text-gold transition-colors">
            <ChevronRight size={20} />
          </button>
        </div>

        {/* Day headers */}
        <div className="grid grid-cols-7 mb-2">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
            <div key={d} className="text-center text-[10px] font-montserrat text-white/30 tracking-widest uppercase py-2">{d}</div>
          ))}
        </div>

        {/* Days grid */}
        <div className="grid grid-cols-7 gap-1">
          {Array.from({ length: startPad }).map((_, i) => <div key={`pad-${i}`} />)}
          {days.map(day => {
            const isPast = isBefore(day, today);
            const isSun = getDay(day) === 0;
            const disabled = isPast || isSun;
            const isSelected = selected && isSameDay(day, new Date(selected));

            return (
              <button
                key={day.toString()}
                disabled={disabled}
                onClick={() => onSelect(format(day, 'yyyy-MM-dd'))}
                className={`aspect-square flex items-center justify-center text-sm font-montserrat transition-all duration-200 ${
                  isSelected
                    ? 'bg-gold text-black font-bold'
                    : disabled
                    ? 'text-white/15 cursor-not-allowed'
                    : 'text-white/70 hover:bg-white/10 hover:text-white'
                }`}
              >
                {format(day, 'd')}
              </button>
            );
          })}
        </div>

        {selected && (
          <p className="text-center text-gold text-sm font-montserrat mt-6">
            Selected: {format(new Date(selected), 'EEEE, MMMM d yyyy')}
          </p>
        )}
      </div>
    </div>
  );
}