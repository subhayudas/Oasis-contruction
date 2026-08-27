/**
 * Verified business facts only.
 *
 * Everything here comes from the client's intake form. Nothing is inferred:
 * no years in business, no project counts, no review scores, no licence
 * numbers, no response-time promises. If a field is not in the intake, it is
 * not in this file and it is not on the site.
 */

export const site = {
  name: 'Oasis Construction',
  url: 'https://oasis-construction.ca',
  taglineFr: 'Pour un oasis à votre image',
  taglineEn: 'An oasis made for you',

  phone: {
    display: '514-702-0752',
    href: 'tel:+15147020752',
    e164: '+1-514-702-0752',
  },

  email: {
    display: 'contact@oasis-construction.ca',
    href: 'mailto:contact@oasis-construction.ca',
  },

  /**
   * The intake gives a street address with no municipality or postal code, so
   * neither is invented here or emitted in structured data.
   */
  address: {
    street: '10955 rue Massé',
    region: 'QC',
    country: 'CA',
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

export type Site = typeof site;
