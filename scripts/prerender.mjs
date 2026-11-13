// Build-time pre-rendering for SEO.
//
// Vite emits a single dist/index.html whose <head> carries the homepage title,
// description and canonical. Every route was served from that same file, so
// Googlebot's first (HTML-only) pass saw 24 pages that all claimed to be the
// homepage and parked them in "Discovered – currently not indexed".
//
// This script runs after `vite build` and writes dist/<route>/index.html for
// every public page, with that page's own <title>, meta description, keywords,
// canonical, Open Graph / Twitter tags, FAQ structured data and the real page
// copy (H1, intro, H2 sections, FAQs) rendered as plain HTML inside #root.
// React then mounts on top of it in the browser exactly as before.
//
// Vercel serves a matching static file before any rewrite, so /about is
// answered by dist/about/index.html. Only /portal/* is rewritten to the SPA;
// every other unknown URL gets dist/404.html with a real 404 status. A new
// public route must therefore be listed in corePages.js or seoPages.js.

import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { seoPages, serviceNav, locationNav } from '../src/content/seoPages.js';
import { corePages } from '../src/content/corePages.js';

const SITE_URL = 'https://www.stillsbybrooklyn.co.za';
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const dist = resolve(root, 'dist');
const template = readFileSync(resolve(dist, 'index.html'), 'utf8');

// ───────────────────────── helpers ─────────────────────────

const esc = (s = '') =>
  String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

// Same inline grammar as <RichText>: [text](/path) links and **bold**
function rich(text = '') {
  let out = '';
  const re = /\[([^\]]+)\]\(([^)]+)\)|\*\*([^*]+)\*\*/g;
  let last = 0;
  let m;
  while ((m = re.exec(text))) {
    out += esc(text.slice(last, m.index));
    if (m[1]) {
      const href = m[2];
      const external = !href.startsWith('/');
      out += `<a href="${esc(href)}"${external ? ' target="_blank" rel="noopener noreferrer"' : ''}>${esc(m[1])}</a>`;
    } else {
      out += `<strong>${esc(m[3])}</strong>`;
    }
    last = re.lastIndex;
  }
  return out + esc(text.slice(last));
}

function block(b) {
  if (typeof b === 'string') return `<p>${rich(b)}</p>`;
  const items = b.ul || b.ol;
  const tag = b.ol ? 'ol' : 'ul';
  return `<${tag}>${items.map((i) => `<li>${rich(i)}</li>`).join('')}</${tag}>`;
}

function sections(list = []) {
  return list
    .map((s) => `<section><h2>${esc(s.h2)}</h2>${(s.body || []).map(block).join('')}</section>`)
    .join('');
}

function faqs(list = []) {
  if (!list.length) return '';
  return `<section><h2>Frequently asked questions</h2>${list
    .map((f) => `<details><summary><h3>${esc(f.q)}</h3></summary><p>${rich(f.a)}</p></details>`)
    .join('')}</section>`;
}

function faqJsonLd(list = []) {
  if (!list.length) return '';
  const data = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: list.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };
  return `<script type="application/ld+json" data-seo="faq">${JSON.stringify(data).replace(/</g, '\\u003c')}</script>`;
}

function breadcrumbJsonLd(page) {
  if (page.path === '/') return '';
  const data = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL + '/' },
      { '@type': 'ListItem', position: 2, name: page.h1 || page.title, item: SITE_URL + page.path },
    ],
  };
  return `<script type="application/ld+json" data-seo="breadcrumb">${JSON.stringify(data)}</script>`;
}

// ───────────────────────── page list ─────────────────────────

const allNav = [
  { label: 'Home', path: '/' },
  { label: 'Services', path: '/services' },
  ...serviceNav,
  ...locationNav,
  { label: 'Portfolio', path: '/portfolio' },
  { label: 'Reels', path: '/reels' },
  { label: 'About', path: '/about' },
  { label: 'Contact', path: '/contact' },
  { label: 'Book a shoot', path: '/booking' },
];

const blogNav = seoPages.filter((p) => p.kind === 'blog').map((p) => ({ label: p.navLabel, path: p.path }));

const navHtml = `<nav aria-label="Site"><ul>${allNav
  .map((l) => `<li><a href="${l.path}">${esc(l.label)}</a></li>`)
  .join('')}</ul></nav>`;

const blogHtml = blogNav.length
  ? `<section><h2>From the journal</h2><ul>${blogNav
      .map((l) => `<li><a href="${l.path}">${esc(l.label)}</a></li>`)
      .join('')}</ul></section>`
  : '';

const footerHtml = `<footer><p>Stills by Brooklyn · Photographer &amp; videographer, Johannesburg · Est. 2018 · <a href="tel:+27677860702">067 786 0702</a> · <a href="mailto:info@stillsbybrooklyn.co.za">info@stillsbybrooklyn.co.za</a></p></footer>`;

const pages = [
  ...Object.values(corePages),
  ...seoPages,
];

// ───────────────────────── render ─────────────────────────

const STYLE =
  '<style data-prerender>' +
  '[data-prerender]{background:#141213;color:#fff;font-family:Lato,system-ui,sans-serif;min-height:100vh;padding:48px 24px 64px;max-width:48rem;margin:0 auto;line-height:1.65}' +
  '[data-prerender] a{color:#e8873a}' +
  '[data-prerender] h1{font-family:"Cormorant Garamond",Georgia,serif;font-size:2.4rem;line-height:1.1;margin:.5em 0}' +
  '[data-prerender] h2{font-size:1.4rem;margin:1.8em 0 .5em}' +
  '[data-prerender] nav ul{display:flex;flex-wrap:wrap;gap:.75rem 1.25rem;list-style:none;padding:0;margin:0 0 2rem;font-size:.9rem}' +
  '[data-prerender] .eyebrow{color:#e8873a;letter-spacing:.3em;text-transform:uppercase;font-size:.7rem}' +
  '[data-prerender] footer{margin-top:3rem;font-size:.85rem;color:#ffffff99}' +
  '</style>';

function renderBody(page) {
  const h1 = page.h1 || page.title;
  const intro = page.intro || page.description;
  return (
    `<div data-prerender>` +
    navHtml +
    `<main>` +
    (page.eyebrow ? `<p class="eyebrow">${esc(page.eyebrow)}</p>` : '') +
    `<h1>${esc(h1)}</h1>` +
    `<p>${rich(intro)}</p>` +
    sections(page.sections) +
    faqs(page.faqs) +
    (page.cta ? `<section><h2>${esc(page.cta.title)}</h2><p>${esc(page.cta.subtitle || '')} <a href="/contact">Request a quote</a> or <a href="/booking">book online</a>.</p></section>` : '') +
    (page.kind !== 'blog' ? blogHtml : '') +
    `</main>` +
    footerHtml +
    `</div>`
  );
}

function setTag(html, pattern, replacement, label) {
  if (!pattern.test(html)) throw new Error(`prerender: could not find ${label} in dist/index.html`);
  return html.replace(pattern, replacement);
}

function renderHead(html, page) {
  const url = SITE_URL + (page.path === '/' ? '/' : page.path);
  const title = esc(page.title);
  const desc = esc(page.description);
  const kw = esc(Array.isArray(page.keywords) ? page.keywords.join(', ') : page.keywords || '');

  html = setTag(html, /<title>[^<]*<\/title>/, `<title>${title}</title>`, '<title>');
  html = setTag(html, /<meta name="description" content="[^"]*" \/>/, `<meta name="description" content="${desc}" />`, 'description');
  html = setTag(html, /<meta name="keywords" content="[^"]*" \/>/, `<meta name="keywords" content="${kw}" />`, 'keywords');
  html = setTag(html, /<link rel="canonical" href="[^"]*" \/>/, `<link rel="canonical" href="${url}" />`, 'canonical');
  html = setTag(html, /<meta property="og:url" content="[^"]*" \/>/, `<meta property="og:url" content="${url}" />`, 'og:url');
  html = setTag(html, /<meta property="og:title" content="[^"]*" \/>/, `<meta property="og:title" content="${title}" />`, 'og:title');
  html = setTag(html, /<meta property="og:description" content="[^"]*" \/>/, `<meta property="og:description" content="${desc}" />`, 'og:description');
  html = setTag(html, /<meta name="twitter:title" content="[^"]*" \/>/, `<meta name="twitter:title" content="${title}" />`, 'twitter:title');
  html = setTag(html, /<meta name="twitter:description" content="[^"]*" \/>/, `<meta name="twitter:description" content="${desc}" />`, 'twitter:description');
  if (page.kind === 'blog') {
    html = html.replace(/<meta property="og:type" content="website" \/>/, '<meta property="og:type" content="article" />');
  }
  html = html.replace('</head>', `${faqJsonLd(page.faqs)}${breadcrumbJsonLd(page)}${STYLE}</head>`);
  return html;
}

function render(page) {
  let html = renderHead(template, page);
  html = setTag(html, /<div id="root"><\/div>/, `<div id="root">${renderBody(page)}</div>`, '#root');
  return html;
}

const written = [];
for (const page of pages) {
  const html = render(page);
  const outDir = page.path === '/' ? dist : resolve(dist, '.' + page.path);
  mkdirSync(outDir, { recursive: true });
  writeFileSync(resolve(outDir, 'index.html'), html);
  written.push(page.path);
}

// 404.html: Vercel serves this with a real 404 status for any URL that has no
// file. It boots the app, which renders the branded not-found page in the layout.
{
  let html = template;
  html = setTag(html, /<title>[^<]*<\/title>/, '<title>Page not found | Stills by Brooklyn</title>', '<title>');
  html = setTag(html, /<meta name="robots" content="[^"]*" \/>/, '<meta name="robots" content="noindex" />', 'robots');
  html = html.replace(/\s*<link rel="canonical" href="[^"]*" \/>/, '');
  writeFileSync(resolve(dist, '404.html'), html);
}

// Keep the sitemap honest: every URL in it must have a pre-rendered page.
const sitemap = readFileSync(resolve(dist, 'sitemap.xml'), 'utf8');
const inSitemap = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].replace(SITE_URL, '') || '/');
const missing = inSitemap.filter((p) => !written.includes(p));
const unlisted = written.filter((p) => !inSitemap.includes(p));
if (missing.length) throw new Error(`prerender: sitemap lists pages that were not rendered: ${missing.join(', ')}`);
if (unlisted.length) console.warn(`prerender: rendered pages missing from sitemap.xml: ${unlisted.join(', ')}`);

console.log(`prerender: wrote ${written.length} pages`);
