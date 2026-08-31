'use client';

import type { GuidedCopy } from '@/content/guided';
import { IconArrow } from '@/components/icons';
import { Eyebrow } from '@/components/ui';

/**
 * Sets the price of the interaction before the visitor pays it: how long it
 * takes, what they get, and that nothing is owed at the end. A form that
 * opens straight onto a question makes the visitor guess how deep it goes.
 */
export function FormIntro({ copy, onStart }: { copy: GuidedCopy; onStart: () => void }) {
  return (
    <div className="flex flex-col">
      <Eyebrow>{copy.intro.eyebrow}</Eyebrow>
      <span className="u-tick mt-3" aria-hidden="true" />
      <h2 className="text-ink mt-5 text-[clamp(1.5rem,5vw,1.875rem)] leading-[1.15] font-[700] tracking-[-0.022em]">
        {copy.intro.title}
      </h2>
      <p className="u-body mt-4 text-[1rem]">{copy.intro.body}</p>

      <button type="button" onClick={onStart} className="btn btn-stone mt-8 w-full">
        {copy.intro.start}
        <IconArrow className="h-4 w-4" />
      </button>

      <p className="u-meta mt-4 text-center">{copy.intro.trust}</p>
    </div>
  );
}
