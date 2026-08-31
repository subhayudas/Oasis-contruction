/**
 * Verified business facts only.
 *
 * Everything here is confirmed by the client: the two mobile numbers, the
 * shared inbox, the street address, the social pages and the service area.
 * Anything NOT confirmed — licence number, insurer, warranty, review score,
 * project count, years in business, response time — lives in
 * `placeholders.ts` as a bracketed token and is never guessed here.
 */

export const site = {
  name: 'Oasis Construction',
  url: 'https://oasis-construction.ca',
  taglineFr: 'Pour un oasis à votre image',
  taglineEn: 'An oasis made for you',

  /**
   * Hugo's line is the number on every button: it is the one the business
   * asked to be reached on first. Guillaume's is published as a second way
   * through, not as an alternative CTA.
   */
  phone: {
    display: '(438) 505-4846',
    href: 'tel:+14385054846',
    e164: '+1-438-505-4846',
    name: 'Hugo',
  },

  phoneSecondary: {
    display: '(514) 702-0752',
    href: 'tel:+15147020752',
    e164: '+1-514-702-0752',
    name: 'Guillaume',
  },

  email: {
    display: 'contact@oasis-construction.ca',
    href: 'mailto:contact@oasis-construction.ca',
  },

  address: {
    street: '10955 avenue Massé',
    locality: 'Montréal',
    region: 'QC',
    postalCode: 'H1G 4G5',
    country: 'CA',
    /** One line, the way it goes on an envelope. */
    display: '10955 avenue Massé, Montréal, QC H1G 4G5',
  },

  hours: {
    opens: '09:00',
    closes: '20:00',
    days: [
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
      'Sunday',
    ] as const,
    displayFr: 'Tous les jours, 9 h à 20 h',
    displayEn: 'Every day, 9 AM–8 PM',
  },

  areaServed: ['Laval', 'Rive-Nord'] as const,

  social: {
    instagram: 'https://www.instagram.com/oasisconstruction_/',
    facebook: 'https://www.facebook.com/profile.php?id=61573970215653',
  },
} as const;

/** Both published numbers, in the order they should be offered. */
export const phones = [site.phone, site.phoneSecondary] as const;

export type Site = typeof site;
