import { useEffect, useRef } from 'react';

/**
 * Lightweight custom cursor: writes GPU transforms straight to the DOM inside a
 * single requestAnimationFrame loop. No React state, so it never re-renders the app.
 */
export default function CustomCursor() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);

  useEffect(() => {
    // Mouse/trackpad only — never on touch devices
    if (typeof window.matchMedia !== 'function') return;
    if (!window.matchMedia('(pointer: fine)').matches) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    let mx = -200, my = -200;
    let rx = -200, ry = -200;
    let hovering = false;
    let pressed = false;
    let visible = false;
    let raf = 0;

    const show = (v) => {
      if (visible === v) return;
      visible = v;
      dot.style.opacity = v ? '1' : '0';
      ring.style.opacity = v ? '1' : '0';
    };

    const render = () => {
      rx += (mx - rx) * 0.2;
      ry += (my - ry) * 0.2;
      dot.style.transform = `translate3d(${mx}px, ${my}px, 0) translate(-50%, -50%) scale(${pressed ? 0.55 : hovering ? 0.7 : 1})`;
      ring.style.transform = `translate3d(${rx}px, ${ry}px, 0) translate(-50%, -50%) scale(${hovering ? 1.6 : 1})`;
      raf = requestAnimationFrame(render);
    };

    const onMove = (e) => {
      mx = e.clientX;
      my = e.clientY;
      show(true);
    };

    const onOver = (e) => {
      const target = e.target;
      const next = !!(target instanceof Element && target.closest('a, button, [role="button"], input, textarea, select, label'));
      if (next !== hovering) {
        hovering = next;
        ring.classList.toggle('cursor-hover', next);
      }
    };

    const onDown = () => { pressed = true; ring.classList.add('cursor-click'); };
    const onUp = () => { pressed = false; ring.classList.remove('cursor-click'); };
    const onLeave = () => show(false);
    const onEnter = () => show(true);

    window.addEventListener('mousemove', onMove, { passive: true });
    window.addEventListener('mouseover', onOver, { passive: true });
    window.addEventListener('mousedown', onDown, { passive: true });
    window.addEventListener('mouseup', onUp, { passive: true });
    document.addEventListener('mouseleave', onLeave);
    document.addEventListener('mouseenter', onEnter);
    raf = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseover', onOver);
      window.removeEventListener('mousedown', onDown);
      window.removeEventListener('mouseup', onUp);
      document.removeEventListener('mouseleave', onLeave);
      document.removeEventListener('mouseenter', onEnter);
    };
  }, []);

  return (
    <div aria-hidden="true" className="pointer-events-none">
      <div
        ref={ringRef}
        className="fixed left-0 top-0 z-[99998] h-7 w-7 rounded-full border border-gold/30 opacity-0 will-change-transform"
        style={{ transition: 'opacity 0.2s ease', transform: 'translate3d(-200px, -200px, 0)' }}
      />
      <div
        ref={dotRef}
        className="fixed left-0 top-0 z-[99999] h-2 w-2 rounded-full bg-gold opacity-0 shadow-[0_0_8px_rgba(217,154,165,0.8)] will-change-transform"
        style={{ transition: 'opacity 0.2s ease', transform: 'translate3d(-200px, -200px, 0)' }}
      />
    </div>
  );
}