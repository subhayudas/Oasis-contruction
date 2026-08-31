import { serviceKeys, type ServiceKey } from './routes';

export const MAX_FILES = 3;
export const MAX_FILE_BYTES = 5 * 1024 * 1024;

/**
 * The guided form is allowed more, and larger, photographs than the classic
 * forms: it asks for them at the point where the visitor has already told us
 * what is wrong, so a fifth photograph is context rather than noise, and a
 * modern phone camera clears 5 Mo on a single unedited shot.
 */
export const GUIDED_MAX_FILES = 5;
export const GUIDED_MAX_FILE_BYTES = 10 * 1024 * 1024;

export const ACCEPTED_IMAGE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/heic',
  'image/heif',
] as const;

export const ACCEPTED_EXTENSIONS = '.jpg,.jpeg,.png,.webp,.heic,.heif';

export type PreferredContact = 'phone' | 'email' | 'either';

export type ContactErrorKey =
  | 'name'
  | 'email'
  | 'phone'
  | 'contact'
  | 'service'
  | 'subject'
  | 'city'
  | 'message'
  | 'consent'
  | 'fileType'
  | 'fileSize'
  | 'fileCount'
  | 'fileRequired';

export type ContactSubject = 'quote' | 'question' | 'other';

export type ContactPayload = {
  name: string;
  email: string;
  phone: string;
  service: string;
  /** Only used by the contact-page form. */
  subject: string;
  city: string;
  message: string;
  /** Photo funnel only: how long the problem has been there. */
  duration: string;
  preferred: PreferredContact;
  consent: boolean;
  locale: string;
  /** Honeypot — must stay empty. */
  website: string;
  /** Milliseconds the form was on screen before submission. */
  elapsed: number;
};

/**
 * The forms on the site:
 *
 *   general  the classic quote form — name + phone required, the rest optional
 *   photo    the photo funnel — at least one photograph plus name and phone
 *   contact  the contact page — a fuller enquiry with a subject
 *   guided   the six-step tap-through form — name + phone, everything else
 *            arrives as structured selections the visitor never typed
 */
export type ContactVariant = 'general' | 'photo' | 'contact' | 'guided';

/** What a given form is allowed to upload. */
export function fileLimits(variant?: ContactVariant): { maxFiles: number; maxBytes: number } {
  return variant === 'guided'
    ? { maxFiles: GUIDED_MAX_FILES, maxBytes: GUIDED_MAX_FILE_BYTES }
    : { maxFiles: MAX_FILES, maxBytes: MAX_FILE_BYTES };
}

export function isSubject(value: string): value is ContactSubject {
  return value === 'quote' || value === 'question' || value === 'other';
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i;
/** North-American numbers, tolerant of spaces, dots, dashes and brackets. */
const PHONE_RE = /^\+?1?[\s.-]*\(?\d{3}\)?[\s.-]*\d{3}[\s.-]*\d{4}$/;

export function isValidEmail(value: string): boolean {
  return EMAIL_RE.test(value.trim());
}

export function isValidPhone(value: string): boolean {
  return PHONE_RE.test(value.trim());
}

export function isServiceKey(value: string): value is ServiceKey {
  return (serviceKeys as string[]).includes(value);
}

/**
 * One validator shared by the browser and the route handler, so the two can
 * never drift apart and the server never trusts the client's word for it.
 */
export function validateContact(
  payload: ContactPayload,
  variant: ContactVariant,
): ContactErrorKey[] {
  const errors: ContactErrorKey[] = [];
  const email = payload.email.trim();
  const phone = payload.phone.trim();

  if (payload.name.trim().length < 2) errors.push('name');
  if (email && !isValidEmail(email)) errors.push('email');
  if (phone && !isValidPhone(phone)) errors.push('phone');

  // The phone number is the field that matters for this business, so every
  // form requires it outright rather than accepting an email in its place.
  if (!phone) errors.push('phone');

  if (variant === 'contact') {
    if (!email) errors.push('email');
    if (!isSubject(payload.subject)) errors.push('subject');
    if (payload.message.trim().length < 10) errors.push('message');
  }

  // The general and photo forms do not require a message: the whole point of
  // the photo funnel is that the visitor does not have to know what to say.

  if (!payload.consent) errors.push('consent');

  return [...new Set(errors)];
}

export function validateFiles(files: File[], variant?: ContactVariant): ContactErrorKey[] {
  const errors: ContactErrorKey[] = [];
  const { maxFiles, maxBytes } = fileLimits(variant);
  if (variant === 'photo' && files.length === 0) errors.push('fileRequired');
  if (files.length > maxFiles) errors.push('fileCount');
  if (files.some((f) => f.size > maxBytes)) errors.push('fileSize');
  if (files.some((f) => !(ACCEPTED_IMAGE_TYPES as readonly string[]).includes(f.type))) {
    errors.push('fileType');
  }
  return errors;
}

export type ContactResponse =
  | { ok: true }
  | {
      ok: false;
      code: 'validation' | 'rate_limited' | 'not_configured' | 'delivery_failed' | 'rejected';
      errors?: ContactErrorKey[];
    };
