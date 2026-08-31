import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

/**
 * The two regular expressions the whole lead pipeline rests on. They are
 * extracted from the source rather than re-typed, so this test fails if the
 * source drifts rather than quietly checking a stale copy.
 */
const source = readFileSync(new URL('../src/lib/contact.ts', import.meta.url), 'utf8');

function regexNamed(name) {
  const line = source.match(new RegExp(`^const ${name} = (/.*/[a-z]*);$`, 'm'));
  assert.ok(line, `${name} not found`);
  const body = line[1];
  const lastSlash = body.lastIndexOf('/');
  return new RegExp(body.slice(1, lastSlash), body.slice(lastSlash + 1));
}

const EMAIL_RE = regexNamed('EMAIL_RE');
const PHONE_RE = regexNamed('PHONE_RE');

test('accepts the phone formats a Quebec homeowner actually types', () => {
  for (const value of [
    '(438) 505-4846',
    '438-505-4846',
    '4385054846',
    '438 505 4846',
    '438.505.4846',
    '+1 514 702 0752',
    '1-514-702-0752',
    '(514)702-0752',
  ]) {
    assert.ok(PHONE_RE.test(value), `should accept ${value}`);
  }
});

test('rejects things that are not phone numbers', () => {
  for (const value of ['', '12345', 'appelez-moi', '438-505-484', '438-505-48466']) {
    assert.ok(!PHONE_RE.test(value), `should reject ${value}`);
  }
});

test('email validation is permissive but not useless', () => {
  for (const value of ['a@b.ca', 'marie.gagnon@exemple.qc.ca', "o'brien@test.com"]) {
    assert.ok(EMAIL_RE.test(value), `should accept ${value}`);
  }
  for (const value of ['', 'marie', 'marie@', '@exemple.ca', 'marie@exemple', 'a b@c.ca']) {
    assert.ok(!EMAIL_RE.test(value), `should reject ${value}`);
  }
});

test('the file-size and file-count limits match what the copy promises', () => {
  assert.match(source, /MAX_FILES = 3/);
  assert.match(source, /MAX_FILE_BYTES = 5 \* 1024 \* 1024/);
});
