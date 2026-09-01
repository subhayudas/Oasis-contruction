import type { FormType } from './analytics';

/**
 * How an accepted lead crosses the navigation to the thank-you page.
 *
 * A lead has to end at a URL. Every conversion goal an ad platform offers a
 * campaign is URL-based - "the page a customer sees after they schedule an
 * appointment" - so a form that only swaps a panel in place produces leads
 * the platform cannot count, and pointing it at the homepage instead would
 * count every visitor as a conversion. So the form hands the lead off here
 * and does a real document navigation to /merci.
 *
 * Two rules hold this together:
 *
 *   It travels in sessionStorage, never in the query string. The payload
 *   carries the visitor's first name, and a query string is copied into
 *   referrers, analytics page paths and server logs. The one place it may
 *   live is the tab that created it.
 *
 *   It is read once and deleted. A refresh of the thank-you page must not
 *   count the same lead a second time.
 */
export const LEAD_HANDOFF_KEY = 'oasis_lead';

export type LeadHandoff = {
  formType: FormType;
  /** For the greeting on the confirmation. Never sent to analytics. */
  firstName: string;
  /** Guided leads only - the structured answers behind the `form_lead` event. */
  lead?: {
    service: string;
    problem: string;
    location: string;
    timeline: string;
    photoCount: number;
    seconds: number;
  };
};

/**
 * Stores the lead for the next page.
 *
 * Returns false when the browser refused - private modes and locked-down
 * settings both throw here. The caller must then keep the visitor where they
 * are and count the lead itself, because a confirmation the visitor never
 * sees is worse than a conversion the ad platform cannot attribute.
 */
export function stashLead(payload: LeadHandoff): boolean {
  try {
    window.sessionStorage.setItem(LEAD_HANDOFF_KEY, JSON.stringify(payload));
    return true;
  } catch {
    return false;
  }
}

/** Reads and clears in one step, so the same lead can only be counted once. */
export function takeLead(): LeadHandoff | null {
  try {
    const raw = window.sessionStorage.getItem(LEAD_HANDOFF_KEY);
    window.sessionStorage.removeItem(LEAD_HANDOFF_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as LeadHandoff;
    return typeof parsed?.formType === 'string' ? parsed : null;
  } catch {
    return null;
  }
}
