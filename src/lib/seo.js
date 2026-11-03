import { useEffect } from 'react';

export const SITE_URL = 'https://www.stillsbybrooklyn.co.za';

function setMeta(attr, key, content) {
  if (!content) return;
  let tag = document.head.querySelector(`meta[${attr}="${key}"]`);
  if (!tag) {
    tag = document.createElement('meta');
    tag.setAttribute(attr, key);
    document.head.appendChild(tag);
  }
  tag.setAttribute('content', content);
}

function setCanonical(href) {
  let link = document.head.querySelector('link[rel="canonical"]');
  if (!link) {
    link = document.createElement('link');
    link.setAttribute('rel', 'canonical');
    document.head.appendChild(link);
  }
  link.setAttribute('href', href);
}

function setJsonLd(id, data) {
  const existing = document.head.querySelector(`script[data-seo="${id}"]`);
  if (existing) existing.remove();
  if (!data) return;
  const script = document.createElement('script');
  script.type = 'application/ld+json';
  script.setAttribute('data-seo', id);
  script.textContent = JSON.stringify(data);
  document.head.appendChild(script);
}

/**
 * Sets the page's title tag, meta description, keywords, canonical URL and
 * social tags. `path` is the page's own URL path, e.g. "/photographer-pretoria".
 * `faqs` (optional) adds FAQPage structured data for Google rich results.
 */
export function useSeo({ title, description, keywords, path = '/', faqs }) {
  useEffect(() => {
    const url = SITE_URL + (path === '/' ? '/' : path);
    document.title = title;
    setMeta('name', 'description', description);
    setMeta('name', 'keywords', Array.isArray(keywords) ? keywords.join(', ') : keywords);
    setCanonical(url);
    setMeta('property', 'og:url', url);
    setMeta('property', 'og:title', title);
    setMeta('property', 'og:description', description);
    setMeta('name', 'twitter:title', title);
    setMeta('name', 'twitter:description', description);

    setJsonLd(
      'faq',
      faqs && faqs.length
        ? {
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: faqs.map((f) => ({
              '@type': 'Question',
              name: f.q,
              acceptedAnswer: { '@type': 'Answer', text: f.a },
            })),
          }
        : null
    );
    return () => setJsonLd('faq', null);
  }, [title, description, keywords, path, faqs]);
}
