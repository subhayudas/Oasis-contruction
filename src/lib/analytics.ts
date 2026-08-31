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

export type AnalyticsEvent =
  | { event: 'form_submit'; form_type: 'general' | 'photo' | 'contact'; page_url: string }
  | { event: 'form_start'; form_type: 'general' | 'photo' | 'contact'; page_url: string }
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
  }
}

export const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID ?? '';
export const GA4_ID = process.env.NEXT_PUBLIC_GA4_ID ?? '';
export const META_PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID ?? '';

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

export function trackFormStart(formType: 'general' | 'photo' | 'contact'): void {
  track({ event: 'form_start', form_type: formType });
}

export function trackFormSubmit(formType: 'general' | 'photo' | 'contact'): void {
  track({ event: 'form_submit', form_type: formType });
}

export function trackPhotoUpload(count: number): void {
  track({ event: 'photo_upload', photo_count: count });
}

export function trackFaq(question: string): void {
  track({ event: 'faq_expand', question_text: question.slice(0, 120) });
}
