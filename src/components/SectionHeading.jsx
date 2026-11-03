export default function SectionHeading({ eyebrow, title, subtitle, center = false, as: Heading = 'h2' }) {
  return (
    <div className={`flex flex-col gap-4 ${center ? 'items-center text-center' : 'items-start'}`}>
      {eyebrow && (
        <span className="text-gold text-xs font-montserrat font-semibold tracking-[0.3em] uppercase">
          {eyebrow}
        </span>
      )}
      <Heading className={`relative text-3xl md:text-4xl font-montserrat font-bold text-foreground pb-4 gold-underline ${center ? 'gold-underline-center' : ''}`}>
        {title}
      </Heading>
      {subtitle && (
        <p className="text-foreground/55 text-sm font-montserrat font-light leading-relaxed max-w-lg">
          {subtitle}
        </p>
      )}
    </div>
  );
}