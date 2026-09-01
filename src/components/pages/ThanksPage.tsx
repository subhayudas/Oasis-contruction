'use client';

import { useEffect, useRef, useState } from 'react';

import { FormConfirmation } from '@/components/guided/FormConfirmation';
import { OpenGuidedForm } from '@/components/guided/OpenGuidedForm';
import { IconPhone } from '@/components/icons';
import { guidedCopy } from '@/content/guided';
import { site } from '@/content/site';
import { trackFormSubmit, trackGuidedLead } from '@/lib/analytics';
import type { Locale } from '@/lib/i18n';
import { takeLead, type LeadHandoff } from '@/lib/lead-handoff';
import { pagePath } from '@/lib/routes';

/**
 * The page a lead lands on once the server has accepted it.
 *
 * It exists because a conversion has to happen at a URL: the goals an ad
 * platform offers ("the page customers see after they schedule an
 * appointment") are all URL-based, and the guided form's confirmation used to
 * be step 7 of the same page. So the form stashes the lead, navigates here,
 * and this page renders the identical confirmation and fires the lead events
 * from the new URL - which is where the ad platform's tag is watching.
 *
 * Two states, decided by whether a submission is waiting in the tab:
 *
 *   With one: the confirmation, greeting included, and the events fire once.
 *   Without: a visitor who bookmarked, shared or guessed the URL, who is told
 *   plainly that there is nothing to confirm rather than being thanked for a
 *   request nobody received. The confirmation is a promise; it is not made to
 *   someone we owe nothing to.
 *
 * The server renders the confirmation, because all but a rounding error of
 * the traffic here has just converted. Swapping to the other state on hydrate
 * costs the rare direct visitor a frame; doing it the other way round would
 * show every real customer an empty page first.
 */
export function ThanksPage({ locale }: { locale: Locale }) {
  const copy = guidedCopy(locale);
  const [lead, setLead] = useState<LeadHandoff | null>(null);
  const [read, setRead] = useState(false);

  /* Read once per page load, never per effect run: React re-runs mount
     effects in development, and the second run would find the key already
     cleared and wipe the confirmation off a real customer's screen. */
  const taken = useRef(false);

  useEffect(() => {
    if (taken.current) return;
    taken.current = true;

    const payload = takeLead();
    setLead(payload);
    setRead(true);
    if (!payload) return;

    // The submission itself happened on the previous page; these fire here so
    // the events and the conversion URL belong to the same page view.
    trackFormSubmit(payload.formType);
    if (payload.lead) trackGuidedLead(payload.lead);
  }, []);

  const direct = read && lead === null;

  return (
    <section className="u-wrap-narrow pt-10 pb-24 lg:pt-14 lg:pb-28">
      <div className="glass-panel px-6 py-9 sm:px-9 sm:py-11">
        {direct ? (
          <div className="flex flex-col text-center">
            <h1 className="u-h2">{copy.confirmation.direct.title}</h1>
            <p className="u-body mx-auto mt-4 max-w-[32rem] text-[0.9375rem]">
              {copy.confirmation.direct.body}
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <OpenGuidedForm
                href={pagePath(locale, 'contact')}
                label={copy.confirmation.direct.cta}
                location="thanks-page"
                className="btn btn-stone"
              />
              <a
                href={site.phone.href}
                data-cta={copy.confirmation.callCta}
                data-cta-location="thanks-page"
                className="btn btn-quarry"
              >
                <IconPhone className="h-4.5 w-4.5" />
                {site.phone.display}
              </a>
            </div>
          </div>
        ) : (
          <FormConfirmation
            copy={copy}
            locale={locale}
            firstName={lead?.firstName ?? ''}
            titleAs="h1"
          />
        )}
      </div>
    </section>
  );
}
