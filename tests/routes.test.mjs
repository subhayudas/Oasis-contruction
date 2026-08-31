import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

/**
 * The route map is plain data, so it is checked by reading the source rather
 * than by standing up a TypeScript toolchain for three object literals.
 * What matters here is the properties, not the mechanism: no slug may collide
 * with another in the same language, and every service must exist in both.
 */
const source = readFileSync(new URL('../src/lib/routes.ts', import.meta.url), 'utf8');

function slugMap(name) {
  const start = source.indexOf(`export const ${name} = {`);
  assert.ok(start > -1, `${name} not found`);
  const body = source.slice(start, source.indexOf('} as const satisfies', start));
  const out = {};
  for (const [, key, fr, en] of body.matchAll(
    /^\s*'?([\w-]+)'?:\s*\{\s*fr:\s*'([^']*)',\s*en:\s*'([^']*)'\s*\},/gm,
  )) {
    out[key] = { fr, en };
  }
  return out;
}

const pages = slugMap('pageSlugs');
const services = slugMap('serviceSlugs');

test('every page and service is defined in both languages', () => {
  for (const [key, value] of Object.entries({ ...pages, ...services })) {
    assert.equal(typeof value.fr, 'string', `${key} has no French slug`);
    assert.equal(typeof value.en, 'string', `${key} has no English slug`);
  }
});

test('the brief’s six services are all present', () => {
  const expected = [
    'pave-uni',
    'muret',
    'margelle',
    'drainage',
    'lavage-sous-pression',
    'amenagement-exterieur',
  ];
  assert.deepEqual(Object.keys(services).sort(), [...expected].sort());
});

test('no two routes share a slug within a language', () => {
  for (const locale of ['fr', 'en']) {
    const slugs = [
      ...Object.values(pages).map((p) => p[locale]),
      ...Object.values(services).map((s) => s[locale]),
    ].filter(Boolean);
    const seen = new Set();
    for (const slug of slugs) {
      assert.ok(!seen.has(slug), `duplicate ${locale} slug: ${slug}`);
      seen.add(slug);
    }
  }
});

test('French service slugs sit at the root, as the brief specifies', () => {
  for (const [key, value] of Object.entries(services)) {
    assert.ok(!value.fr.includes('/'), `${key} is nested: ${value.fr}`);
  }
});

test('slugs are URL-safe and unaccented', () => {
  for (const value of [...Object.values(pages), ...Object.values(services)]) {
    for (const slug of [value.fr, value.en]) {
      if (!slug) continue;
      assert.match(slug, /^[a-z0-9-]+$/, `not URL-safe: ${slug}`);
    }
  }
});
