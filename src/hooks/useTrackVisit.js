import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// Visit tracking loads the Base44 client lazily, after the page is idle,
// so it never adds weight or delay to the first paint.
export function useTrackVisit() {
  const location = useLocation();

  useEffect(() => {
    const referrer = document.referrer || 'direct';
    const screen_width = window.innerWidth;
    const run = () =>
      import('@/api/base44Client')
        .then(({ base44 }) => base44.functions.invoke('trackVisit', { page: location.pathname, referrer, screen_width }))
        .catch(() => {}); // silent — never break the UI
    const idle = window.requestIdleCallback || ((cb) => setTimeout(cb, 1500));
    const id = idle(run);
    return () => (window.cancelIdleCallback ? window.cancelIdleCallback(id) : clearTimeout(id));
  }, [location.pathname]);
}
