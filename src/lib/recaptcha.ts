/**
 * reCAPTCHA v3, off until it is configured.
 *
 * The form already carries a honeypot, a minimum fill time and a per-IP rate
 * limit, which stop the bulk of drive-by spam without asking the visitor for
 * anything. reCAPTCHA is the layer on top for a determined scripted attack.
 *
 * With no keys set — the state this ships in — `enabled` is false, the client
 * loads no Google script, and the route handler does not reject submissions
 * for a missing token. That matters: a half-configured integration that
 * silently drops real leads is worse than no integration.
 */
export const RECAPTCHA_SITE_KEY = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY ?? '';

/** Below this, Google considers the interaction probably automated. */
export const RECAPTCHA_MIN_SCORE = 0.5;

export function recaptchaEnabled(): boolean {
  return RECAPTCHA_SITE_KEY.length > 0;
}

declare global {
  interface Window {
    grecaptcha?: {
      ready: (cb: () => void) => void;
      execute: (siteKey: string, options: { action: string }) => Promise<string>;
    };
  }
}

/**
 * Returns a token, or '' when reCAPTCHA is not configured or fails to load.
 * Never throws: a challenge that cannot run must not stop a real submission.
 */
export async function recaptchaToken(action: string): Promise<string> {
  if (!recaptchaEnabled() || typeof window === 'undefined') return '';
  try {
    const grecaptcha = window.grecaptcha;
    if (!grecaptcha) return '';
    await new Promise<void>((resolve) => grecaptcha.ready(resolve));
    return await grecaptcha.execute(RECAPTCHA_SITE_KEY, { action });
  } catch {
    return '';
  }
}

/* ------------------------------------------------------------------ server */

type VerifyResult = { ok: true } | { ok: false; reason: string };

/**
 * Server-side verification. Returns ok when reCAPTCHA is not configured, so
 * the site works exactly as before until the business supplies keys.
 */
export async function verifyRecaptcha(token: string, ip?: string): Promise<VerifyResult> {
  const secret = process.env.RECAPTCHA_SECRET_KEY;
  if (!secret || !process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY) return { ok: true };
  if (!token) return { ok: false, reason: 'missing token' };

  try {
    const body = new URLSearchParams({ secret, response: token });
    if (ip) body.set('remoteip', ip);

    const response = await fetch('https://www.google.com/recaptcha/api/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body,
    });
    const data = (await response.json()) as { success?: boolean; score?: number };

    if (!data.success) return { ok: false, reason: 'rejected by Google' };
    if (typeof data.score === 'number' && data.score < RECAPTCHA_MIN_SCORE) {
      return { ok: false, reason: `score ${data.score}` };
    }
    return { ok: true };
  } catch (error) {
    // Google being unreachable must not cost the business a lead.
    console.error('[contact] reCAPTCHA verification failed to run', error);
    return { ok: true };
  }
}
