#!/usr/bin/env node
/**
 * A launch checklist that runs.
 *
 * Crawls every route against a running server and asserts the things that
 * quietly break a lead-generation site: a missing title, two H1s, an image
 * with no alt text, a phone number that is not a tel: link, a page with no way
 * to convert, a broken internal link. Prints a report and exits non-zero if
 * anything fails.
 *
 *   node scripts/qa-crawl.mjs [baseUrl]
 */
const BASE = process.argv[2] ?? 'http://localhost:3000';

const ROUTES = [
  '/',
  '/services',
  '/pave-uni',
  '/muret',
  '/margelle',
  '/drainage',
  '/lavage-sous-pression',
  '/amenagement-exterieur',
  '/projets',
  '/projets/avant-apres-entree',
  '/projets/allee-pave-uni-entree',
  '/a-propos',
  '/contact',
  '/secteurs-desservis',
  '/envoyer-une-photo',
  '/confidentialite',
  '/lp/pave-uni-reparation',
  '/lp/muret-reparation',
  '/en',
  '/en/services',
  '/en/interlocking-pavers',
  '/en/retaining-walls',
  '/en/steps-and-coping',
  '/en/drainage',
  '/en/pressure-washing',
  '/en/landscape-construction',
  '/en/projects',
  '/en/about',
  '/en/contact',
  '/en/service-areas',
  '/en/send-a-photo',
  '/en/privacy',
];

const REDIRECTS = [
  ['/fr', '/'],
  ['/fr/services/reparation-pave-uni', '/pave-uni'],
  ['/fr/services/reparation-muret', '/muret'],
  ['/fr/services/nettoyage-pression', '/lavage-sous-pression'],
  ['/fr/realisations', '/projets'],
  ['/fr/a-propos', '/a-propos'],
  ['/en/services/interlocking-paver-repair', '/en/interlocking-pavers'],
];

const failures = [];
const warnings = [];
const titles = new Map();
const descriptions = new Map();

function fail(route, message) {
  failures.push(`${route}: ${message}`);
}
function warn(route, message) {
  warnings.push(`${route}: ${message}`);
}

const text = (html, re) => (html.match(re) ?? [])[1]?.trim();
const all = (html, re) => [...html.matchAll(re)];

async function checkRoute(route) {
  const response = await fetch(BASE + route, { redirect: 'manual' });
  if (response.status !== 200) {
    fail(route, `status ${response.status}`);
    return;
  }
  const html = await response.text();
  const isLanding = route.startsWith('/lp/');

  /* ------------------------------------------------------------- metadata */

  const title = text(html, /<title>([^<]*)<\/title>/);
  if (!title) fail(route, 'no <title>');
  else if (title.length > 65) warn(route, `title ${title.length} chars: "${title}"`);
  if (title) {
    if (titles.has(title)) fail(route, `title duplicated with ${titles.get(title)}`);
    titles.set(title, route);
  }

  const description = text(html, /<meta name="description" content="([^"]*)"/);
  if (!description) fail(route, 'no meta description');
  else {
    if (description.length > 165) warn(route, `description ${description.length} chars`);
    if (descriptions.has(description))
      fail(route, `description duplicated with ${descriptions.get(description)}`);
    descriptions.set(description, route);
  }

  /* ------------------------------------------------------------- headings */

  const h1s = all(html, /<h1[^>]*>([\s\S]*?)<\/h1>/g);
  if (h1s.length === 0) fail(route, 'no <h1>');
  if (h1s.length > 1) fail(route, `${h1s.length} <h1> elements`);

  /* ---------------------------------------------------------------- images */

  for (const [tag] of all(html, /<img\b[^>]*>/g)) {
    if (!/\salt="/.test(tag)) fail(route, `<img> without alt: ${tag.slice(0, 90)}`);
  }

  /* ------------------------------------------------------------ conversion */

  if (!/href="tel:\+1438505484 6?|href="tel:\+14385054846"/.test(html)) {
    fail(route, 'no tel: link to the primary number');
  }
  if (!isLanding && !/lang="(fr-CA|en-CA)"/.test(html)) fail(route, 'no html lang');

  /* -------------------------------------------------------------- indexing */

  const canonical = text(html, /<link rel="canonical" href="([^"]*)"/);
  if (isLanding) {
    if (!/name="robots"[^>]*content="[^"]*noindex/.test(html))
      fail(route, 'landing page is not noindex');
  } else {
    if (!canonical) fail(route, 'no canonical');
    if (!/hreflang="fr-CA"/i.test(html) || !/hreflang="en-CA"/i.test(html))
      fail(route, 'missing hreflang alternates');
  }

  /* ------------------------------------------------------ structured data */

  const ld = all(html, /<script type="application\/ld\+json">([\s\S]*?)<\/script>/g);
  for (const [, body] of ld) {
    try {
      JSON.parse(body);
    } catch {
      fail(route, 'invalid JSON-LD');
    }
  }
  if (!isLanding && ld.length === 0) fail(route, 'no structured data');

  /* ---------------------------------------------------------- placeholders */

  const tokens = [...html.matchAll(/\[([A-Z][A-Z ]+)\]/g)].map((m) => m[1]);
  if (tokens.length > 0) {
    warn(route, `placeholders visible: ${[...new Set(tokens)].join(', ')}`);
  }

  return html;
}

async function checkRedirect(from, to) {
  const response = await fetch(BASE + from, { redirect: 'manual' });
  if (response.status !== 301 && response.status !== 308) {
    fail(from, `expected 301, got ${response.status}`);
    return;
  }
  const location = new URL(response.headers.get('location'), BASE).pathname;
  if (location !== to) fail(from, `redirects to ${location}, expected ${to}`);
}

async function checkLinks(htmlByRoute) {
  const internal = new Set();
  for (const html of htmlByRoute.values()) {
    for (const [, href] of all(html, /href="(\/[^"#?]*)"/g)) {
      if (href.startsWith('/_next') || href.startsWith('/api')) continue;
      if (/\.(png|jpg|jpeg|webp|avif|svg|ico|xml|txt)$/.test(href)) continue;
      internal.add(href);
    }
  }
  for (const href of internal) {
    const response = await fetch(BASE + href, { redirect: 'follow' });
    if (!response.ok) fail('link', `${href} → ${response.status}`);
  }
  return internal.size;
}

const htmlByRoute = new Map();
for (const route of ROUTES) {
  const html = await checkRoute(route);
  if (html) htmlByRoute.set(route, html);
}
for (const [from, to] of REDIRECTS) await checkRedirect(from, to);
const linkCount = await checkLinks(htmlByRoute);

/* ----------------------------------------------------------- sitemap/robots */

const sitemap = await (await fetch(`${BASE}/sitemap.xml`)).text();
const sitemapUrls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
if (sitemapUrls.some((u) => u.includes('/lp/'))) fail('sitemap', 'contains a noindex /lp/ URL');
if (sitemapUrls.some((u) => u.includes('/fr/'))) fail('sitemap', 'contains a legacy /fr/ URL');

const robots = await (await fetch(`${BASE}/robots.txt`)).text();
if (!robots.includes('Disallow: /lp/')) fail('robots.txt', '/lp/ is not disallowed');
if (!robots.includes('Sitemap:')) fail('robots.txt', 'no sitemap reference');

/* --------------------------------------------------------------- 404 page */

const notFound = await fetch(`${BASE}/cette-page-nexiste-pas`);
if (notFound.status !== 404) fail('/404', `expected 404, got ${notFound.status}`);
const notFoundHtml = await notFound.text();
if (!/n’existe pas|does not exist/.test(notFoundHtml)) fail('/404', 'not the branded 404');

/* ---------------------------------------------------------------- report */

console.log(
  `\nChecked ${ROUTES.length} routes, ${REDIRECTS.length} redirects, ${linkCount} internal links.`,
);
console.log(`Sitemap lists ${sitemapUrls.length} URLs.\n`);

if (warnings.length > 0) {
  console.log(`${warnings.length} warning(s):`);
  for (const w of warnings) console.log(`  ! ${w}`);
  console.log('');
}

if (failures.length > 0) {
  console.log(`${failures.length} FAILURE(S):`);
  for (const f of failures) console.log(`  ✗ ${f}`);
  console.log('');
  process.exit(1);
}

console.log('✓ All checks passed.\n');
