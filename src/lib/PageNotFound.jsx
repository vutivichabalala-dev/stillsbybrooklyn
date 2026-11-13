import { Link } from 'react-router-dom';
import { useEffect } from 'react';
import { serviceNav } from '@/content/seoPages';

/** Branded 404, rendered inside the site layout (navbar + footer). */
export default function PageNotFound() {
  // Keep this page out of search results
  useEffect(() => {
    document.title = 'Page not found | Stills by Brooklyn';
    const tag = document.createElement('meta');
    tag.name = 'robots';
    tag.content = 'noindex';
    tag.setAttribute('data-404', '');
    document.head.appendChild(tag);
    return () => tag.remove();
  }, []);

  return (
    <section className="min-h-[80vh] flex items-center px-5 sm:px-8 lg:px-12 pt-36 pb-24">
      <div className="mx-auto w-full max-w-[1360px] grid gap-14 lg:grid-cols-[1.1fr_1fr] items-end">
        <div>
          <p className="font-lato text-[11px] tracking-[0.3em] uppercase text-gold mb-6">Error 404</p>
          <h1 className="m-0 font-cormorant font-medium text-white leading-[0.95] text-[clamp(48px,7vw,104px)]">
            This frame <span className="italic text-gold">didn&rsquo;t make the edit.</span>
          </h1>
          <p className="mt-8 max-w-md font-lato text-[15px] leading-[1.8] text-white/60">
            The page you were looking for has moved or no longer exists. Here are a few places to pick up from.
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <Link to="/" className="bg-gold px-7 py-4 font-lato text-[12px] font-bold tracking-[0.24em] uppercase text-[#141213] hover:bg-white transition-colors">
              Back to home
            </Link>
            <Link to="/portfolio" className="border border-white/25 px-7 py-4 font-lato text-[12px] tracking-[0.24em] uppercase text-white hover:border-gold hover:text-gold transition-colors">
              See the portfolio
            </Link>
          </div>
        </div>
        <nav aria-label="Services">
          <p className="font-lato text-[11px] tracking-[0.3em] uppercase text-white/40 mb-4">Services</p>
          <ul className="m-0 list-none p-0 border-t border-white/10">
            {serviceNav.map((s) => (
              <li key={s.path} className="border-b border-white/10">
                <Link to={s.path} className="group flex items-center justify-between py-4 font-cormorant text-[24px] text-white hover:text-gold transition-colors">
                  {s.label}
                  <span className="text-gold text-lg transition-transform duration-500 group-hover:translate-x-2">→</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </section>
  );
}
