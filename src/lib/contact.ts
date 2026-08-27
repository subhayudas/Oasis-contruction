import { serviceKeys, type ServiceKey } from './routes';

export const MAX_FILES = 3;
export const MAX_FILE_BYTES = 5 * 1024 * 1024;

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
  | 'city'
  | 'message'
  | 'consent'
  | 'fileType'
  | 'fileSize'
  | 'fileCount';

export type ContactPayload = {
  name: string;
  email: string;
  phone: string;
  service: string;
  city: string;
  message: string;
  preferred: PreferredContact;
  consent: boolean;
  locale: string;
  /** Honeypot — must stay empty. */
  website: string;
  /** Milliseconds the form was on screen before submission. */
  elapsed: number;
};

export type ContactVariant = 'compact' | 'full';

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
  if (!email && !phone) errors.push('contact');

  if (variant === 'full') {
    if (!payload.service || !(isServiceKey(payload.service) || payload.service === 'other')) {
      errors.push('service');
    }
    if (payload.city.trim().length < 2) errors.push('city');
  }

  if (payload.message.trim().length < 10) errors.push('message');
  if (!payload.consent) errors.push('consent');

  return errors;
}

export function validateFiles(files: File[]): ContactErrorKey[] {
  const errors: ContactErrorKey[] = [];
  if (files.length > MAX_FILES) errors.push('fileCount');
  if (files.some((f) => f.size > MAX_FILE_BYTES)) errors.push('fileSize');
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
