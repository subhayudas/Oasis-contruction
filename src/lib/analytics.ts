/**
 * One place that knows what the site measures.
 *
 * Events are pushed to `window.dataLayer`, which is what both Google Tag
 * Manager and a gtag.js GA4 install read. Nothing here loads a vendor script;
 * `<Analytics>` does that, and only when a container id is configured. With no
 * id set, every call below is a no-op that costs one array push, so the call
 * sites never have to ask whether tracking is on.
 *
 * Nothing that identifies a person is ever sent: no name, no phone number, no
 * email, no message text, no photograph. Only which button, on which page.
 */

export type FormType = 'general' | 'photo' | 'contact' | 'guided';

/**
 * The guided form's funnel.
 *
 * The six steps are measured individually because the only useful question
 * about a multi-step form is *where* people leave it - a single submit rate
 * tells you it is leaking without telling you which screen is the hole.
 * `form_abandon` carries the furthest step seen for exactly that reason.
 *
 * Nothing that identifies a person is sent here either: a step records which
 * option key was tapped, never the name, the number or the photograph.
 */
export type AnalyticsEvent =
  | { event: 'form_submit'; form_type: FormType; page_url: string }
  | { event: 'form_start'; form_type: FormType; page_url: string }
  | {
      event: 'form_view';
      form_type: FormType;
      source_page: string;
      cta_text: string;
      page_url: string;
    }
  | {
      event: 'form_step_complete';
      form_type: FormType;
      step_number: number;
      step_name: string;
      selected_value: string;
      page_url: string;
    }
  | {
      event: 'form_step_back';
      form_type: FormType;
      from_step: number;
      to_step: number;
      page_url: string;
    }
  | { event: 'form_photo_upload'; form_type: FormType; photo_count: number; page_url: string }
  | { event: 'form_photo_skip'; form_type: FormType; page_url: string }
  | { event: 'form_contact_started'; form_type: FormType; page_url: string }
  | {
      event: 'form_abandon';
      form_type: FormType;
      last_step_seen: number;
      time_on_form: number;
      page_url: string;
    }
  | {
      event: 'form_error';
      form_type: FormType;
      step: number;
      field: string;
      error_type: string;
      page_url: string;
    }
  | {
      event: 'form_lead';
      form_type: FormType;
      service: string;
      problem: string;
      location: string;
      timeline: string;
      photo_count: number;
      time_to_complete: number;
      page_url: string;
    }
  | { event: 'phone_click'; phone_number: string; page_url: string }
  | { event: 'photo_upload'; photo_count: number; page_url: string }
  | { event: 'cta_click'; cta_text: string; cta_location: string; page_url: string }
  | { event: 'scroll_depth'; depth: 25 | 50 | 75 | 90; page_url: string }
  | { event: 'service_page_view'; service_name: string; page_url: string }
  | { event: 'project_view'; project_name: string; page_url: string }
  | { event: 'faq_expand'; question_text: string; page_url: string }
  | { event: 'external_link_click'; link_domain: string; page_url: string };

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
    /** Defined by <ConsentDefaults>, ahead of any measurement script. */
    gtag?: (...args: unknown[]) => void;
  }
}

export const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID ?? '';
export const GA4_ID = process.env.NEXT_PUBLIC_GA4_ID ?? '';
export const META_PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID ?? '';

/**
 * Google Ads conversion tracking.
 *
 * `NEXT_PUBLIC_GOOGLE_ADS_ID` is the account tag (AW-XXXXXXXXXX) and
 * `NEXT_PUBLIC_GOOGLE_ADS_LEAD_LABEL` the conversion label Google Ads hands
 * over when the conversion action is created. Both are needed: the id alone
 * loads the tag and records nothing, the label alone has nowhere to send.
 *
 * Kept separate from GA4_ID on purpose. The two are different products with
 * different retention and different consent consequences, and the business
 * may well run ads long before it wants analytics.
 */
// The production Google Ads account tag. An environment value remains
// available for previews or a future account migration.
export const GOOGLE_ADS_ID = process.env.NEXT_PUBLIC_GOOGLE_ADS_ID ?? 'AW-18390225010';
export const GOOGLE_ADS_LEAD_LABEL = process.env.NEXT_PUBLIC_GOOGLE_ADS_LEAD_LABEL ?? '';

/** The `send_to` Google Ads expects, or '' when either half is unconfigured. */
export const ADS_LEAD_SEND_TO =
  GOOGLE_ADS_ID && GOOGLE_ADS_LEAD_LABEL ? `${GOOGLE_ADS_ID}/${GOOGLE_ADS_LEAD_LABEL}` : '';

/** Where the Law 25 banner stores the visitor's answer. */
export const CONSENT_KEY = 'oasis_consent';

/**
 * The standing answer, read at the moment of the event rather than captured in
 * a render. Nothing that reaches a third party may fire on a false here.
 */
export function hasConsent(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    return window.localStorage.getItem(CONSENT_KEY) === 'granted';
  } catch {
    // Private mode, or site data blocked. No stored answer is not an answer.
    return false;
  }
}

/** The path the visitor is actually on, never the query string. */
export function currentPageUrl(): string {
  if (typeof window === 'undefined') return '';
  return window.location.pathname;
}

/**
 * `Omit` over a union collapses it to the members' common keys, which would
 * make every event's own parameters an error. The conditional distributes it
 * over each member instead, so each event keeps exactly its own shape.
 */
type WithOptionalUrl<T> = T extends unknown
  ? Omit<T, 'page_url'> & { page_url?: string }
  : never;

export function track(event: WithOptionalUrl<AnalyticsEvent>): void {
  if (typeof window === 'undefined') return;
  window.dataLayer = window.dataLayer ?? [];
  window.dataLayer.push({ ...event, page_url: event.page_url ?? currentPageUrl() });
}

/* --------------------------------------------------------------- shortcuts */

export function trackCta(text: string, location: string): void {
  track({ event: 'cta_click', cta_text: text, cta_location: location });
}

export function trackPhone(phoneNumber: string): void {
  track({ event: 'phone_click', phone_number: phoneNumber });
}

export function trackFormStart(formType: FormType): void {
  track({ event: 'form_start', form_type: formType });
}

export function trackFormSubmit(formType: FormType): void {
  track({ event: 'form_submit', form_type: formType });
  trackAdsLead();
}

/**
 * The Google Ads conversion.
 *
 * Every form on the site ends in `trackFormSubmit`, so hanging the conversion
 * off that one call is what keeps the quote form, the contact form and the
 * guided funnel from drifting apart - a new form is counted the day it is
 * written, without anyone remembering to add a second line.
 *
 * Fired only on a delivered lead, never on a submit attempt: an Ads conversion
 * that counts failures teaches Smart Bidding the wrong lesson and is worse
 * than no conversion at all.
 *
 * The consent check has to be here and not only in the component that loads
 * the tag. gtag.js is absent until the visitor accepts, so this call would
 * merely sit in the dataLayer - and a later accept replays that queue, which
 * would deliver a conversion the visitor had refused at the time it happened.
 *
 * Silent as well when the tag is unconfigured, or when a GTM container is in
 * charge instead: there the `form_submit` push above is the trigger the
 * container listens for, and firing here too would double-count the lead.
 */
export function trackAdsLead(): void {
  if (typeof window === 'undefined') return;
  if (GTM_ID || !ADS_LEAD_SEND_TO) return;
  if (!hasConsent()) return;
  window.gtag?.('event', 'conversion', {
    // No value: a quote request is a lead, not a sale, and inventing a dollar
    // figure here would put a made-up number into the bidding model. No
    // form_type either - Google Ads drops parameters it was not configured
    // for, and `form_submit` on the dataLayer already carries it.
    send_to: ADS_LEAD_SEND_TO,
  });
}

/* ------------------------------------------------------- guided form funnel */

export function trackGuidedView(sourcePage: string, ctaText: string): void {
  track({
    event: 'form_view',
    form_type: 'guided',
    source_page: sourcePage,
    cta_text: ctaText,
  });
}

export function trackGuidedStep(stepNumber: number, stepName: string, value: string): void {
  track({
    event: 'form_step_complete',
    form_type: 'guided',
    step_number: stepNumber,
    step_name: stepName,
    selected_value: value,
  });
}

export function trackGuidedBack(from: number, to: number): void {
  track({ event: 'form_step_back', form_type: 'guided', from_step: from, to_step: to });
}

export function trackGuidedPhotos(count: number): void {
  track({ event: 'form_photo_upload', form_type: 'guided', photo_count: count });
}

export function trackGuidedPhotoSkip(): void {
  track({ event: 'form_photo_skip', form_type: 'guided' });
}

export function trackGuidedContactStarted(): void {
  track({ event: 'form_contact_started', form_type: 'guided' });
}

export function trackGuidedAbandon(lastStep: number, seconds: number): void {
  track({
    event: 'form_abandon',
    form_type: 'guided',
    last_step_seen: lastStep,
    time_on_form: seconds,
  });
}

export function trackGuidedError(step: number, field: string, errorType: string): void {
  track({ event: 'form_error', form_type: 'guided', step, field, error_type: errorType });
}

/** The qualified-lead event: everything the sales team sorts a callback by. */
export function trackGuidedLead(lead: {
  service: string;
  problem: string;
  location: string;
  timeline: string;
  photoCount: number;
  seconds: number;
}): void {
  track({
    event: 'form_lead',
    form_type: 'guided',
    service: lead.service,
    problem: lead.problem,
    location: lead.location,
    timeline: lead.timeline,
    photo_count: lead.photoCount,
    time_to_complete: lead.seconds,
  });
}

export function trackPhotoUpload(count: number): void {
  track({ event: 'photo_upload', photo_count: count });
}

export function trackFaq(question: string): void {
  track({ event: 'faq_expand', question_text: question.slice(0, 120) });
}
