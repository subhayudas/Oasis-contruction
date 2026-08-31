import type { Locale } from '@/lib/i18n';
import type { ServiceKey } from '@/lib/routes';

export type ProcessStep = { step: string; title: string; text: string };

export type Faq = { q: string; a: string };

export type ServiceCopy = {
  /** Short label used in navigation and tiles. */
  name: string;
  /** One or two lines for the overview tile. */
  short: string;
  /** Material word shown on the service card's sample chip. */
  material: string;
  eyebrow: string;
  title: string;
  lede: string;

  /** What the homeowner is seeing. Written as the questions they'd ask. */
  symptomsTitle: string;
  symptoms: string;

  /** Why it is happening. The diagnostic half of the positioning. */
  causesTitle: string;
  causes: string[];

  /** What Oasis does about it. */
  solutionTitle: string;
  solution: string[];

  includesTitle: string;
  includes: string[];
  surfacesTitle: string;
  surfaces: string[];

  /** An honest limit on what the service can promise. Always shown. */
  note: string;

  localTitle: string;
  local: string;
  process: ProcessStep[];

  /** No prices - the factors that move them, and the free assessment. */
  priceTitle: string;
  priceLede: string;
  priceFactors: string[];
  priceNote: string;

  faqTitle: string;
  faq: Faq[];

  warrantyTitle: string;
  /** May carry a {warrantyTerms} hole filled by placeholders.fill(). */
  warranty: string;

  metaTitle: string;
  metaDescription: string;
};

export type Service = {
  key: ServiceKey;
  /** Scene ids from `imagery.ts` - illustrative, not jobsite photographs. */
  hero: string;
  detail: string;
  /** Technical drawing shown instead of a photograph where none is authentic. */
  diagram?: 'base' | 'drainage';
  related: ServiceKey[];
  /** Whether this service leads with the photo funnel as its second CTA. */
  photoFirst: boolean;
  copy: Record<Locale, ServiceCopy>;
};
