'use client';

import Script from 'next/script';

import { RECAPTCHA_SITE_KEY, recaptchaEnabled } from '@/lib/recaptcha';

/** Loads the v3 script, and only when a site key is configured. */
export function Recaptcha() {
  if (!recaptchaEnabled()) return null;
  return (
    <Script
      src={`https://www.google.com/recaptcha/api.js?render=${RECAPTCHA_SITE_KEY}`}
      strategy="afterInteractive"
    />
  );
}
