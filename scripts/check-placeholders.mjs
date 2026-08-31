#!/usr/bin/env node
/**
 * Lists every business fact the site is still waiting on.
 *
 * Run it before a launch, and again after the client sends anything over. A
 * non-empty list is not a build failure — the site is designed to ship with
 * these visible — but nobody should be able to launch without having seen it.
 */
import { readFileSync } from 'node:fs';

const source = readFileSync(new URL('../src/content/placeholders.ts', import.meta.url), 'utf8');

const factsBlock = source.slice(
  source.indexOf('export const businessFacts'),
  source.indexOf('/** The confirmed value'),
);

const outstanding = [];
const filled = [];
for (const [, key, value] of factsBlock.matchAll(/^\s*(\w+):\s*(.+?),\s*$/gm)) {
  (value === 'null' ? outstanding : filled).push(key);
}

const tokens = Object.fromEntries(
  [...source.matchAll(/^\s*(\w+): '(\[[^']+\])',$/gm)].map((m) => [m[1], m[2]]),
);

if (filled.length > 0) {
  console.log(`\n✓ ${filled.length} confirmed: ${filled.join(', ')}`);
}

if (outstanding.length === 0) {
  console.log('\n✓ Every business fact has been supplied. Nothing left to fill in.\n');
  process.exit(0);
}

console.log(`\n${outstanding.length} business fact(s) still needed from Oasis Construction:\n`);
for (const key of outstanding) {
  console.log(`  ${(tokens[key] ?? key).padEnd(24)} → businessFacts.${key}`);
}
console.log('\nSet them in src/content/placeholders.ts. Nothing else needs to change.\n');
