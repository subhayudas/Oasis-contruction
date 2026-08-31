import type { Locale } from '@/lib/i18n';

export type Testimonial = {
  id: string;
  /** Exactly as the client left it. Never edited, never translated. */
  quote: string;
  /** The language the review was actually written in. */
  language: Locale;
  /** First name only, as published on the existing site. */
  author: string;
  /** ISO date, as published. */
  date: string;
  rating: 5;
};

/**
 * Verified reviews only.
 *
 * These two are the reviews the business has published. There is no third,
 * no aggregate score and no review count anywhere on the site, because none
 * has been verified — inventing social proof is the one thing that would cost
 * more trust than having little of it.
 *
 * The quotes are reproduced verbatim, in the language they were written in.
 * The English site shows the same French quotes with a translation offered
 * underneath rather than replacing a customer's words with our own.
 */
export const testimonials: Testimonial[] = [
  {
    id: 'david-2025-05',
    quote:
      'Mes marches n’étaient plus sécuritaires, heureusement Oasis Construction sont venus remettre le tout comme neuf.',
    language: 'fr',
    author: 'David',
    date: '2025-05-02',
    rating: 5,
  },
  {
    id: 'william-2025-05',
    quote:
      'Travail propre, rapide et très professionnel. Le résultat dépasse nos attentes, je recommande sans hésiter.',
    language: 'fr',
    author: 'William',
    date: '2025-05-23',
    rating: 5,
  },
];

/**
 * Offered under the original on the English site, marked as a translation so
 * a reader is never left thinking the customer wrote this.
 */
export const testimonialTranslations: Record<string, string> = {
  'david-2025-05':
    'My steps were no longer safe. Thankfully Oasis Construction came and put the whole thing back like new.',
  'william-2025-05':
    'Clean, fast, very professional work. The result is beyond what we expected — I recommend them without hesitation.',
};

export function formatReviewDate(date: string, locale: Locale): string {
  return new Intl.DateTimeFormat(locale === 'fr' ? 'fr-CA' : 'en-CA', {
    year: 'numeric',
    month: 'long',
  }).format(new Date(`${date}T12:00:00`));
}
