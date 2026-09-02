import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

/**
 * The guided form's data model, checked against the source rather than a
 * re-typed copy of it.
 *
 * The three failure modes this catches are the ones that would be invisible
 * in a build: a service whose problem list only exists in French, an option
 * key that drifts between the two languages so a lead arrives labelled in one
 * and keyed in the other, and an invented callback time replacing the
 * placeholder on the confirmation screen.
 */

const guided = readFileSync(new URL('../src/content/guided.ts', import.meta.url), 'utf8');
const lib = readFileSync(new URL('../src/lib/guided.ts', import.meta.url), 'utf8');
const route = readFileSync(new URL('../src/app/api/contact/route.ts', import.meta.url), 'utf8');
const contact = readFileSync(new URL('../src/lib/contact.ts', import.meta.url), 'utf8');
const form = readFileSync(
  new URL('../src/components/guided/GuidedForm.tsx', import.meta.url),
  'utf8',
);
const landing = readFileSync(
  new URL('../src/app/lp/[campaign]/page.tsx', import.meta.url),
  'utf8',
);

const SERVICES = [
  'pave-uni',
  'muret',
  'margelle',
  'drainage',
  'lavage-sous-pression',
  'amenagement-exterieur',
  'unsure',
];

/**
 * Balanced-delimiter extraction, because the copy is prettier-formatted and
 * an option object may be one line or six. Anything regex-only would pass on
 * the short form and quietly skip the long one.
 */
function balanced(source, from, open, close) {
  const start = source.indexOf(open, from);
  assert.ok(start !== -1, `${open} not found`);
  let depth = 0;
  for (let i = start; i < source.length; i += 1) {
    if (source[i] === open) depth += 1;
    else if (source[i] === close) {
      depth -= 1;
      if (depth === 0) return source.slice(start, i + 1);
    }
  }
  assert.fail(`unbalanced ${open}`);
}

/** The body of `const fr: GuidedCopy = {…}` / `const en: GuidedCopy = {…}`. */
function localeBlock(name) {
  const marker = `const ${name}: GuidedCopy = `;
  const at = guided.indexOf(marker);
  assert.ok(at !== -1, `${name} block not found`);
  return balanced(guided, at, '{', '}');
}

/** One named object inside a block, whatever its formatting. */
function member(block, name) {
  const quoted = /^[a-z][\w]*$/i.test(name) ? name : `'${name}'`;
  const at = block.indexOf(`${quoted}: {`);
  assert.ok(at !== -1, `member ${name} not found`);
  return balanced(block, at, '{', '}');
}

function optionKeys(block) {
  const list = balanced(block, block.indexOf('options:'), '[', ']');
  return [...list.matchAll(/key:\s*'([^']+)'/g)].map((match) => match[1]);
}

function problemKeys(block, service) {
  return optionKeys(member(member(member(block, 'problem'), 'groups'), service));
}

const fr = localeBlock('fr');
const en = localeBlock('en');

test('every service has a problem list in both languages', () => {
  for (const service of SERVICES) {
    assert.ok(problemKeys(fr, service).length >= 6, `${service} is thin in French`);
    assert.ok(problemKeys(en, service).length >= 6, `${service} is thin in English`);
  }
});

test('the two languages agree on every problem key', () => {
  for (const service of SERVICES) {
    assert.deepEqual(
      problemKeys(en, service),
      problemKeys(fr, service),
      `${service} keys drifted between languages`,
    );
  }
});

test('every problem list offers a way out', () => {
  for (const service of SERVICES) {
    const keys = problemKeys(fr, service);
    assert.ok(
      keys.includes('other') || keys.includes('unknown'),
      `${service} traps a visitor whose problem is not on the list`,
    );
  }
});

test('the service step offers all six services plus "not sure"', () => {
  assert.deepEqual(new Set(optionKeys(member(fr, 'service'))), new Set(SERVICES));
  assert.deepEqual(new Set(optionKeys(member(en, 'service'))), new Set(SERVICES));
});

test('the location step covers the service area and admits the rest', () => {
  const keys = optionKeys(member(fr, 'location'));
  for (const city of ['laval', 'terrebonne', 'blainville', 'mirabel', 'montreal']) {
    assert.ok(keys.includes(city), `${city} is missing from the location step`);
  }
  assert.ok(keys.includes('other'), 'a visitor outside the list has nowhere to go');
  assert.deepEqual(optionKeys(member(en, 'location')), keys);
});

test('the timeline step ranks urgency without rejecting anyone', () => {
  assert.deepEqual(optionKeys(member(fr, 'timeline')), [
    'asap',
    'weeks',
    'months',
    'exploring',
  ]);
});

test('the confirmation never invents a callback time', () => {
  for (const [name, block] of [
    ['fr', fr],
    ['en', en],
  ]) {
    const body = member(block, 'confirmation');
    assert.ok(body.includes('{responseTime}'), `the placeholder is gone from ${name}`);
    assert.ok(
      !/\b\d+\s*(h|heures?|hours?|jours?|days?)\b/i.test(body),
      `a callback window has been invented on the ${name} confirmation screen`,
    );
  }
});

test('the photo step promises an impression, never a diagnosis', () => {
  const body = member(fr, 'photos');
  assert.ok(body.includes('première impression'), 'the honest framing is gone');
  assert.ok(
    !/diagnostic (précis )?(à partir|de la photo)/i.test(body),
    'the form claims to diagnose from a photograph',
  );
});

/* ------------------------------------------------------------ phone format */

/** `formatPhone` lifted from the source, with its type annotations removed. */
const formatPhone = (() => {
  const match = lib.match(
    /export function formatPhone\(value: string\): string \{([\s\S]*?)\n\}/,
  );
  assert.ok(match, 'formatPhone not found');
  return new Function('value', match[1]);
})();

test('the phone field formats as a Quebec number while it is typed', () => {
  assert.equal(formatPhone(''), '');
  assert.equal(formatPhone('4'), '(4');
  assert.equal(formatPhone('438'), '(438');
  assert.equal(formatPhone('438505'), '(438) 505');
  assert.equal(formatPhone('4385054846'), '(438) 505-4846');
  assert.equal(formatPhone('(438) 505-4846'), '(438) 505-4846');
  assert.equal(formatPhone('14385054846'), '(438) 505-4846');
});

test('the phone field never grows past ten digits', () => {
  assert.equal(formatPhone('43850548469999'), '(438) 505-4846');
});

/* -------------------------------------------------------------- plumbing */

test('the API accepts the guided variant and its own file limits', () => {
  assert.match(route, /'general', 'photo', 'contact', 'guided'/);
  assert.match(contact, /GUIDED_MAX_FILES = 5/);
  assert.match(contact, /GUIDED_MAX_FILE_BYTES = 10 \* 1024 \* 1024/);
  assert.match(route, /fileLimits\(variant\)/);
});

test('the six steps are the six the progress bar counts', () => {
  assert.match(lib, /GUIDED_TOTAL_STEPS = 6/);
  for (const name of ['service', 'problem', 'location', 'timeline', 'photos', 'contact']) {
    assert.ok(lib.includes(`${name}:`), `step ${name} is missing from the router`);
  }
});

/**
 * The conversion has to happen at a URL. An accepted submission hands the
 * lead over and loads the thank-you page; if that turns back into a panel
 * swapped in place, or into a client-side transition, the campaign pointed at
 * /merci silently stops recording anything and nobody finds out from the site.
 */
test('an accepted submission lands on the thank-you URL', () => {
  const success = form.slice(form.indexOf('if (data.ok) {'));
  assert.ok(success.includes('stashLead('), 'the lead is no longer handed off');
  assert.ok(
    success.includes("pagePath(locale, 'thanks')"),
    'the confirmation URL is no longer built from the route map',
  );
  assert.match(
    success,
    /window\.location\.assign/,
    'a client-side transition would not load the conversion URL',
  );
});

test('paid landing pages load measurement and ask for consent', () => {
  assert.match(landing, /<GtmNoScript \/>/, 'the GTM noscript fallback is missing');
  assert.match(landing, /<Analytics \/>/, 'the GTM loader is missing');
  assert.match(landing, /<CookieBanner/, 'the consent choice is missing');
});

test('the confirmation greeting survives a missing name', () => {
  for (const [name, block] of [
    ['fr', fr],
    ['en', en],
  ]) {
    assert.ok(
      member(block, 'confirmation').includes('titlePlain'),
      `the nameless greeting is gone from ${name}`,
    );
  }
});
