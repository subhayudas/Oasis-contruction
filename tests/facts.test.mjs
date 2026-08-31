import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const read = (path) => readFileSync(new URL(path, import.meta.url), 'utf8');

/**
 * The guardrail against the one failure mode that would cost this business
 * more than a broken page: a confident-sounding number nobody verified.
 */
test('no unverified business fact is hard-coded anywhere in the content', () => {
  const files = [
    '../src/content/fr.ts',
    '../src/content/en.ts',
    '../src/content/site.ts',
    '../src/content/testimonials.ts',
    '../src/content/faq.ts',
    '../src/content/areas.ts',
  ];

  // Phrases that would only appear if someone had invented a credential.
  const forbidden = [
    /RBQ\s*[:#]?\s*\d/i,
    /licence\s+n[°o]\s*\d/i,
    /\b\d+\s*(ans|years)\s+(d[’']expérience|of experience)/i,
    /\b\d[.,]\d\s*(étoiles|stars)\b/i,
    /\b\d+\s*(avis|reviews)\b/i,
    /\b\d{2,}\s*(projets|projects)\s*(complétés|completed)/i,
    /garantie\s+de\s+\d+\s*ans/i,
    /\b\d+\s*[- ]year\s+warranty/i,
  ];

  for (const file of files) {
    const text = read(file);
    for (const pattern of forbidden) {
      const match = text.match(pattern);
      assert.equal(match, null, `${file} states an unverified fact: "${match?.[0]}"`);
    }
  }
});

test('every placeholder token has a matching businessFacts entry', () => {
  const source = read('../src/content/placeholders.ts');
  const tokens = [...source.matchAll(/^\s*(\w+): '\[[^']+\]',$/gm)].map((m) => m[1]);
  const facts = [...source.matchAll(/^\s*(\w+): null,$/gm)].map((m) => m[1]);
  assert.ok(tokens.length >= 13, 'expected the brief’s full placeholder list');
  for (const token of tokens) {
    assert.ok(facts.includes(token), `${token} has no businessFacts entry`);
  }
});

test('only the two verified testimonials are published', () => {
  const source = read('../src/content/testimonials.ts');
  const ids = [...source.matchAll(/^\s{4}id: '([^']+)',$/gm)].map((m) => m[1]);
  assert.deepEqual(ids, ['david-2025-05', 'william-2025-05']);
});

test('both published phone numbers are the ones the business gave', () => {
  const source = read('../src/content/site.ts');
  assert.match(source, /tel:\+14385054846/);
  assert.match(source, /tel:\+15147020752/);
});
