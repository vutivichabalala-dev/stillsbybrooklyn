import { Briefcase, User, Heart, GraduationCap } from 'lucide-react';

const services = [
  {
    id: 'Corporate',
    icon: Briefcase,
    duration: '90 min',
    description: 'Professional headshots, team portraits, and executive imagery that elevates your brand.',
  },
  {
    id: 'Portraits',
    icon: User,
    duration: '60 min',
    description: 'Intimate, expressive portraits for individuals, couples, and families.',
  },
  {
    id: 'Weddings',
    icon: Heart,
    duration: 'Full Day',
    description: 'Timeless storytelling for the most important day of your life.',
  },
  {
    id: 'Graduations',
    icon: GraduationCap,
    duration: '45 min',
    description: 'Celebrate your achievement with stunning graduation portraits and ceremony coverage.',
  },
];

export default function BookingStep1Service({ selected, onSelect }) {
  return (
    <div>
      <h2 className="text-2xl font-montserrat font-bold text-white mb-2">Choose Your Service</h2>
      <p className="text-white/50 text-sm font-montserrat mb-8">Select the photography experience you're looking for.</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {services.map((s) => {
          const Icon = s.icon;
          const isSelected = selected === s.id;
          return (
            <button
              key={s.id}
              onClick={() => onSelect(s.id)}
              className={`text-left p-8 border transition-all duration-300 flex flex-col gap-5 rounded-sm ${
                isSelected
                  ? 'border-gold bg-gold/10'
                  : 'border-white/10 bg-white/5 hover:border-gold/40 hover:bg-white/8'
              }`}
            >
              <div className={`w-12 h-12 rounded-full flex items-center justify-center border ${isSelected ? 'border-gold bg-gold/20' : 'border-white/20'}`}>
                <Icon size={20} className={isSelected ? 'text-gold' : 'text-white/60'} />
              </div>
              <div>
                <div className="flex items-center justify-between gap-3 mb-2">
                  <h3 className={`font-montserrat font-bold text-xl ${isSelected ? 'text-gold' : 'text-white'}`}>{s.id}</h3>
                  <span className="text-xs font-montserrat text-white/40 border border-white/10 px-3 py-1 whitespace-nowrap">{s.duration}</span>
                </div>
                <p className="text-white/50 text-sm font-montserrat leading-relaxed">{s.description}</p>
              </div>
              {isSelected && <div className="h-[2px] w-8 bg-gold mt-auto" />}
            </button>
          );
        })}
      </div>
    </div>
  );
}