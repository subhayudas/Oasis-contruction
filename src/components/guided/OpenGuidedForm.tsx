'use client';

import Link from 'next/link';

import type { GuidedServiceKey } from '@/content/guided';
import { trackCta } from '@/lib/analytics';
import { useGuidedForm } from './GuidedFormProvider';

type Props = {
  /** Where this button lands with JavaScript off. Always a real page. */
  href: string;
  label: string;
  /** Recorded on the CTA and the form_view event. */
  location: string;
  service?: GuidedServiceKey;
  className?: string;
  children?: React.ReactNode;
};

/**
 * A CTA that opens the guided form - and is still a working link without it.
 *
 * It renders as a real anchor to the contact or photo page and only cancels
 * the navigation once the provider has answered, so a visitor with a blocked
 * or failed script bundle gets a page instead of a dead button. That is the
 * difference between a form that converts 70% of openers and one that
 * converts none of them because it never opened.
 */
export function OpenGuidedForm({
  href,
  label,
  location,
  service,
  className = '',
  children,
}: Props) {
  const guided = useGuidedForm();

  return (
    <Link
      href={href}
      data-cta={label}
      data-cta-location={location}
      onClick={(event) => {
        if (!guided) return;
        if (event.metaKey || event.ctrlKey || event.shiftKey || event.button !== 0) return;
        event.preventDefault();
        trackCta(label, location);
        guided.open({ source: location, service });
      }}
      className={className}
    >
      {children}
      {label}
    </Link>
  );
}
