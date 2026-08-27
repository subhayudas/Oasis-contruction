import type { Locale } from '@/lib/i18n';
import { fr } from './fr';
import { en } from './en';

/**
 * French is authored first and defines the shape; English must match it
 * exactly, so a missing or misspelled key fails type-checking rather than
 * silently rendering nothing.
 */
export type Dictionary = typeof fr;

const dictionaries: Record<Locale, Dictionary> = { fr, en };

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale];
}
