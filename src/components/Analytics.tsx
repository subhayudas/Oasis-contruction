'use client';

import Script from 'next/script';
import { usePathname } from 'next/navigation';
import { useEffect, useRef } from 'react';

import { GA4_ID, GTM_ID, META_PIXEL_ID, track, trackPhone, trackCta } from '@/lib/analytics';

/**
 * Loads the measurement container (if one is configured) and wires the three
 * things that are easier to observe once, at the document level, than to
 * thread through every component: scroll depth, clicks on tel: links, and
 * clicks on anything marked as a call to action.
 *
 * With no NEXT_PUBLIC_GTM_ID / NEXT_PUBLIC_GA4_ID set - which is the state
 * this ships in - no third-party script is requested at all. The dataLayer is
 * still filled, so the events can be verified in the console before the
 * business hands over a container id.
 */

const DEPTHS = [25, 50, 75, 90] as const;

export function Analytics() {
  const pathname = usePathname();
  const seenDepths = useRef<Set<number>>(new Set());

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
  }, [pathname]);

  return (
    <>
      {GTM_ID ? (
        <Script id="gtm" strategy="afterInteractive">
          {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${GTM_ID}');`}
        </Script>
      ) : null}

      {!GTM_ID && GA4_ID ? (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${GA4_ID}`}
            strategy="afterInteractive"
          />
          <Script id="ga4" strategy="afterInteractive">
            {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${GA4_ID}',{send_page_view:true});`}
          </Script>
        </>
      ) : null}

      {META_PIXEL_ID ? (
        <Script id="meta-pixel" strategy="afterInteractive">
          {`!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${META_PIXEL_ID}');fbq('track','PageView');`}
        </Script>
      ) : null}
    </>
  );
}

/** The <noscript> half of a GTM install, rendered first inside <body>. */
export function GtmNoScript() {
  if (!GTM_ID) return null;
  return (
    <noscript>
      <iframe
        src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
        height="0"
        width="0"
        style={{ display: 'none', visibility: 'hidden' }}
        title="Google Tag Manager"
      />
    </noscript>
  );
}
