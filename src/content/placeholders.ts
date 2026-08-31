/**
 * Business facts that Oasis Construction has not supplied yet.
 *
 * Every one of these is a claim a visitor could act on - a licence number, an
 * insurer, a warranty, a review score. None of them is invented. Until the
 * business confirms a value, the site renders the bracketed token so the gap
 * is impossible to miss in QA and trivial to find with a global search.
 *
 * TO FILL ONE IN: set the value below. Nothing else in the codebase changes -  * every component reads through `fact()` and `hasFact()`.
 *
 *   rbqNumber: null            →  rbqNumber: '5812-3456-01',
 *
 * `npm run placeholders` lists everything still outstanding.
 */

export const PLACEHOLDER_TOKENS = {
  rbqNumber: '[RBQ NUMBER]',
  insuranceProvider: '[INSURANCE PROVIDER]',
  insuranceCoverage: '[INSURANCE COVERAGE]',
  googleRating: '[GOOGLE RATING]',
  reviewCount: '[REVIEW COUNT]',
  projectCount: '[PROJECT COUNT]',
  warrantyTerms: '[WARRANTY TERMS]',
  yearsInBusiness: '[YEARS IN BUSINESS]',
  responseTime: '[RESPONSE TIME]',
  serviceAreas: '[SERVICE AREAS]',
  teamPhotos: '[TEAM PHOTOS]',
  founderName: '[FOUNDER NAME]',
  founderBio: '[FOUNDER BIO]',
} as const;

export type FactKey = keyof typeof PLACEHOLDER_TOKENS;

/**
 * Confirmed values. `null` means "not supplied by the business yet" - never
 * "zero", never "unknown but probably". A value here must come from the
 * client in writing.
 */
export const businessFacts: Record<FactKey, string | null> = {
  rbqNumber: null,
  insuranceProvider: null,
  insuranceCoverage: null,
  googleRating: null,
  reviewCount: null,
  projectCount: null,
  warrantyTerms: null,
  yearsInBusiness: null,
  responseTime: null,
  serviceAreas: null,
  teamPhotos: null,
  founderName: null,
  founderBio: null,
};

/** The confirmed value, or the bracketed token when there is not one. */
export function fact(key: FactKey): string {
  return businessFacts[key] ?? PLACEHOLDER_TOKENS[key];
}

/** True once the business has confirmed this fact. */
export function hasFact(key: FactKey): boolean {
  return businessFacts[key] !== null;
}

/** Every fact still outstanding - used by the QA script and the build check. */
export function outstandingFacts(): FactKey[] {
  return (Object.keys(businessFacts) as FactKey[]).filter((key) => !hasFact(key));
}

/**
 * Substitutes {rbqNumber}-style holes in a copy string. Lets a sentence in the
 * dictionary carry a fact without the dictionary importing this module.
 *
 *   fill('Notre numéro RBQ est {rbqNumber}.')
 */
export function fill(text: string): string {
  return text.replace(/\{(\w+)\}/g, (match, key: string) =>
    key in PLACEHOLDER_TOKENS ? fact(key as FactKey) : match,
  );
}

/* --------------------------------------------------------- credential lines */

/**
 * The credentials the site is allowed to display right now.
 *
 * A licence number and an insurer are the strongest trust signals a
 * contractor has - and `RBQ [RBQ NUMBER]` is the weakest, because it reads to
 * a homeowner as an unfinished website. So the credential strips ask this
 * what they may show rather than printing a token, and they grow on their own
 * the day the business supplies a fact.
 *
 * The two entries at the end are always included: they are things the
 * business states about itself that need no external verification.
 */
export function verifiedCredentials(locale: 'fr' | 'en'): string[] {
  const fr = locale === 'fr';
  const out: string[] = [];

  if (hasFact('rbqNumber')) out.push(`RBQ ${fact('rbqNumber')}`);
  if (hasFact('insuranceProvider')) {
    out.push(`${fr ? 'Assuré' : 'Insured'} ${fact('insuranceProvider')}`);
  }
  if (hasFact('yearsInBusiness')) {
    out.push(`${fact('yearsInBusiness')} ${fr ? 'ans d’expérience' : 'years in business'}`);
  }
  if (hasFact('projectCount')) {
    out.push(`${fact('projectCount')} ${fr ? 'projets complétés' : 'projects completed'}`);
  }

  out.push(fr ? 'Évaluation gratuite' : 'Free assessment');
  out.push(fr ? 'Laval et Rive-Nord' : 'Laval and the North Shore');
  return out;
}

/** The one-line version for the footer. Empty until something is verified. */
export function credentialLine(locale: 'fr' | 'en'): string {
  const parts: string[] = [];
  if (hasFact('rbqNumber')) parts.push(`RBQ ${fact('rbqNumber')}`);
  if (hasFact('insuranceProvider')) {
    parts.push(`${locale === 'fr' ? 'Assuré' : 'Insured'} ${fact('insuranceProvider')}`);
  }
  return parts.join(' · ');
}

/**
 * True when a string still carries a hole nobody has filled.
 *
 * Content that would render as "Notre numéro RBQ est [RBQ NUMBER]" is worse
 * than absent content: it answers a homeowner's trust question with evidence
 * that the site is unfinished. Render points use this to leave the item out
 * entirely until the fact exists - and because the FAQ's structured data is
 * built from the same filtered list, the schema can never claim an answer the
 * page does not show.
 */
export function hasUnresolved(text: string): boolean {
  return /\{(\w+)\}/.test(text) && /\[[A-Z][A-Z ]+\]/.test(fill(text));
}

/** Fills a string, or returns null when it still has an unfilled hole. */
export function fillOrNull(text: string): string | null {
  return hasUnresolved(text) ? null : fill(text);
}
