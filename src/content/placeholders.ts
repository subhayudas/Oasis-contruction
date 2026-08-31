/**
 * Business facts that Oasis Construction has not supplied yet.
 *
 * Every one of these is a claim a visitor could act on — a licence number, an
 * insurer, a warranty, a review score. None of them is invented. Until the
 * business confirms a value, the site renders the bracketed token so the gap
 * is impossible to miss in QA and trivial to find with a global search.
 *
 * TO FILL ONE IN: set the value below. Nothing else in the codebase changes —
 * every component reads through `fact()` and `hasFact()`.
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
 * Confirmed values. `null` means "not supplied by the business yet" — never
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

/** Every fact still outstanding — used by the QA script and the build check. */
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
