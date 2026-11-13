import { useEffect, useRef } from 'react';

/**
 * Contextual cursor label. Anywhere on the site, an element with
 * data-cursor="View" (or "Sound", "Mute", …) swaps the system arrow for an
 * orange pill carrying that word while the pointer is over it.
 *
 * Unlike a full custom cursor, nothing runs while the pointer is elsewhere:
 * the animation loop starts when a labelled element is entered and stops once
 * the pill has caught up after leaving. Mouse/trackpad only; touch devices and
 * reduced-motion users keep the normal cursor.
 */
export default function CursorLabel() {
  const pillRef = useRef(null);
  const textRef = useRef(null);

  useEffect(() => {
    if (typeof window.matchMedia !== 'function') return undefined;
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return undefined;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;

    const pill = pillRef.current;
    const text = textRef.current;
    if (!pill || !text) return undefined;

    const root = document.documentElement;
    root.classList.add('sb-cursor-label-on');

    let mx = 0, my = 0; // pointer
    let px = 0, py = 0; // pill
    let label = '';
    let target = null;
    let raf = 0;
    let idleFrames = 0;

    const place = () => {
      pill.style.transform = `translate3d(${px}px, ${py}px, 0)`;
    };

    const loop = () => {
      px += (mx - px) * 0.22;
      py += (my - py) * 0.22;
      place();
      const settled = Math.abs(mx - px) < 0.3 && Math.abs(my - py) < 0.3;
      // Keep running while labelled; after leaving, run ~0.4s more for the fade, then stop
      idleFrames = label ? 0 : idleFrames + 1;
      raf = label || !settled || idleFrames < 24 ? requestAnimationFrame(loop) : 0;
    };
    const start = () => { if (!raf) raf = requestAnimationFrame(loop); };

    const update = () => {
      const live = target instanceof Element && target.isConnected;
      const el = live ? target.closest('[data-cursor]') : null;
      const next = el ? el.getAttribute('data-cursor') || '' : '';
      if (next && text.textContent !== next) text.textContent = next;
      if (next === label) return;
      if (next && !label) { px = mx; py = my; place(); } // appear under the pointer, not fly in
      label = next;
      pill.classList.toggle('is-on', !!label);
      if (label) start();
    };

    const onMove = (e) => {
      if (e.pointerType !== 'mouse') return;
      mx = e.clientX;
      my = e.clientY;
      if (label) start();
    };
    const onOver = (e) => {
      if (e.pointerType !== 'mouse') return;
      target = e.target;
      update();
    };
    const onDown = () => pill.classList.add('is-down');
    const onUp = () => pill.classList.remove('is-down');
    // A click can change the label (Sound → Mute) or navigate away entirely
    const onClick = () => {
      requestAnimationFrame(update);
      setTimeout(update, 450);
    };
    const onLeaveWindow = () => { target = null; update(); };

    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('pointerover', onOver, { passive: true });
    window.addEventListener('pointerdown', onDown, { passive: true });
    window.addEventListener('pointerup', onUp, { passive: true });
    window.addEventListener('click', onClick, { passive: true });
    document.addEventListener('mouseleave', onLeaveWindow);

    return () => {
      cancelAnimationFrame(raf);
      root.classList.remove('sb-cursor-label-on');
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerover', onOver);
      window.removeEventListener('pointerdown', onDown);
      window.removeEventListener('pointerup', onUp);
      window.removeEventListener('click', onClick);
      document.removeEventListener('mouseleave', onLeaveWindow);
    };
  }, []);

  return (
    <div ref={pillRef} className="sb-cursor-pill" aria-hidden="true">
      <span ref={textRef} className="sb-cursor-pill-inner" />
    </div>
  );
}
