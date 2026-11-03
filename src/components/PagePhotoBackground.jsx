// One full-screen background image per page, blended into the dark theme
export default function PagePhotoBackground({ src }) {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none" aria-hidden="true">
      <img
        src={src}
        alt=""
        className="w-full h-full object-cover"
        draggable={false}
      />
      {/* Dark overlay — keeps site dark, image barely visible */}
      <div className="absolute inset-0 bg-background/95" />
      {/* Subtle vignette */}
      <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at center, transparent 30%, rgba(6,6,8,0.7) 100%)' }} />
    </div>
  );
}