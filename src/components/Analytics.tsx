'use client';

import Script from 'next/script';
import { usePathname } from 'next/navigation';
import { useEffect, useRef } from 'react';

import {
  CONSENT_KEY,
  GA4_ID,
  GOOGLE_ADS_ID,
  GTM_ID,
  META_PIXEL_ID,
  track,
  trackPhone,
  trackCta,
} from '@/lib/analytics';
import { useBrowserValue } from '@/lib/use-browser-value';

/**
 * Loads the measurement container (if one is configured, and only once the
 * visitor has accepted) and wires the three things that are easier to observe
 * once, at the document level, than to thread through every component: scroll
 * depth, clicks on tel: links, and clicks on anything marked as a call to
 * action.
 *
 * With no NEXT_PUBLIC_GTM_ID / NEXT_PUBLIC_GA4_ID / NEXT_PUBLIC_GOOGLE_ADS_ID
 * set - which is the state this ships in - no third-party script is requested
 * at all. The dataLayer is still filled, so the events can be verified in the
 * console before the business hands over a container id.
 *
 * A GTM container, when there is one, is the only thing loaded: GA4 and Google
 * Ads are then configured inside it. Without a container, gtag.js is loaded
 * directly for whichever of the two has an id, which is the shorter path for a
 * site that only needs to count leads.
 *
 * Nothing here loads before an explicit accept. Consent Mode would let these
 * tags load under a denial and redact what they send, which is what Google
 * recommends and what earns the modelled conversions - but the banner tells
 * the visitor the measurement scripts are not loaded unless they say yes, so
 * they are not loaded. Deleting the `granted &&` guards below is all it takes
 * to switch to the modelling behaviour, along with the banner's copy.
 */

const DEPTHS = [25, 50, 75, 90] as const;

/**
 * gtag.js is loaded once, under whichever id is present. Google Ads first: if
 * the business is paying for clicks, the conversion tag is the one that must
 * not be missing.
 */
const GTAG_ID = GOOGLE_ADS_ID || GA4_ID;

export function Analytics() {
  const pathname = usePathname();
  const seenDepths = useRef<Set<number>>(new Set());

  // Re-renders when the banner writes, so an accept loads the tags in the same
  // visit rather than on the next page.
  const [consent] = useBrowserValue(CONSENT_KEY);
  const granted = consent === 'granted';

  /* ------------------------------------------------------- scroll depth */

  useEffect(() => {
    seenDepths.current = new Set();

    function onScroll() {
      const doc = document.documentElement;
      const scrollable = doc.scrollHeight - window.innerHeight;
      if (scrollable <= 0) return;
      const percent = ((window.scrollY / scrollable) * 100) as number;

      for (const depth of DEPTHS) {
        if (percent >= depth && !seenDepths.current.has(depth)) {
          seenDepths.current.add(depth);
          track({ event: 'scroll_depth', depth });
        }
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [pathname]);

  /* ----------------------------------------------- delegated click events */

  useEffect(() => {
    function onClick(event: MouseEvent) {
      const target = event.target as HTMLElement | null;
      const anchor = target?.closest?.('a');
      if (!anchor) return;

      const href = anchor.getAttribute('href') ?? '';

      if (href.startsWith('tel:')) {
        trackPhone(href.replace('tel:', ''));
      } else if (/^https?:/i.test(href)) {
        try {
          const url = new URL(href);
          if (url.host !== window.location.host) {
            track({ event: 'external_link_click', link_domain: url.host });
          }
        } catch {
          /* a malformed href is not worth an exception */
        }
      }

      const cta = anchor.closest<HTMLElement>('[data-cta]');
      if (cta) {
        trackCta(
          cta.dataset.cta || anchor.textContent?.trim().slice(0, 60) || '',
          cta.dataset.ctaLocation || 'unknown',
        );
      }
    }

    // Buttons that open the photo funnel are not anchors.
    function onButtonClick(event: MouseEvent) {
      const button = (event.target as HTMLElement | null)?.closest?.(
        'button[data-cta], [data-cta] > button',
      );
      if (!button) return;
      const cta = button.closest<HTMLElement>('[data-cta]');
      if (!cta) return;
      trackCta(
        cta.dataset.cta || button.textContent?.trim().slice(0, 60) || '',
        cta.dataset.ctaLocation || 'unknown',
      );
    }

    document.addEventListener('click', onClick);
    document.addEventListener('click', onButtonClick);
    return () => {
      document.removeEventListener('click', onClick);
      document.removeEventListener('click', onButtonClick);
    };
  }, []);

  /* ------------------------------------------- virtual page views (SPA nav) */

  const first = useRef(true);
  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    if (typeof window === 'undefined') return;
    window.dataLayer = window.dataLayer ?? [];
    window.dataLayer.push({ event: 'page_view', page_url: pathname });

    // gtag.js ignores a bare dataLayer entry - only a container reads those -
    // so a direct install needs the command form as well, or every route
    // change after the first is invisible to GA4.
    if (!GTM_ID && GA4_ID) {
      window.gtag?.('event', 'page_view', {
        send_to: GA4_ID,
        page_path: pathname,
        page_location: window.location.href,
        // No page_title. The framework sets document.title in the same commit
        // as this effect and not reliably before it, so reading it here sends
        // an empty one - which overrides the title gtag.js would otherwise
        // read for itself when the parameter is absent.
      });
    }
  }, [pathname]);

  return (
    <>
      {granted && GTM_ID ? (
        <Script id="gtm" strategy="afterInteractive">
          {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${GTM_ID}');`}
        </Script>
      ) : null}

      {granted && !GTM_ID && GTAG_ID ? (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${GTAG_ID}`}
            strategy="afterInteractive"
          />
          <Script id="gtag" strategy="afterInteractive">
            {[
              `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}`,
              `gtag('js',new Date());`,
              GA4_ID ? `gtag('config','${GA4_ID}',{send_page_view:true});` : '',
              // allow_enhanced_conversions is off: the forms collect a name,
              // an email and a phone number, and hashing those into an ad
              // platform is a separate decision for the business to make under
              // Law 25, not a default this file should take on its behalf.
              GOOGLE_ADS_ID ? `gtag('config','${GOOGLE_ADS_ID}');` : '',
            ]
              .filter(Boolean)
              .join('')}
          </Script>
        </>
      ) : null}

      {granted && META_PIXEL_ID ? (
        <Script id="meta-pixel" strategy="afterInteractive">
          {`!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${META_PIXEL_ID}');fbq('track','PageView');`}
        </Script>
      ) : null}
    </>
  );
}

/**
 * Consent Mode v2 defaults, rendered inside <head>.
 *
 * This has to be the first thing on the page that touches gtag, and it has to
 * be synchronous: a default that arrives after the tag has loaded is a default
 * the tag has already ignored once. Everything is denied until the visitor
 * answers the banner.
 *
 * The stored answer is read straight from localStorage rather than waiting for
 * React, so someone who accepted months ago is not measured as a refusal for
 * the first few hundred milliseconds of every visit.
 *
 * `ads_data_redaction` keeps the click id out of any call made while consent
 * is denied; `url_passthrough` lets the gclid survive an internal navigation
 * so a lead submitted three pages in still attributes to the ad.
 */
export function ConsentDefaults() {
  if (!GTM_ID && !GTAG_ID) return null;
  return (
    <script
      dangerouslySetInnerHTML={{
        __html: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}var c='denied';try{if(localStorage.getItem('${CONSENT_KEY}')==='granted')c='granted'}catch(e){}gtag('consent','default',{ad_storage:c,ad_user_data:c,ad_personalization:c,analytics_storage:c,functionality_storage:'granted',security_storage:'granted',wait_for_update:500});gtag('set','ads_data_redaction',c!=='granted');gtag('set','url_passthrough',true);`,
      }}
    />
  );
}
