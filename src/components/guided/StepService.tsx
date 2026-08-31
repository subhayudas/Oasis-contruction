'use client';

import type { GuidedCopy, GuidedServiceKey } from '@/content/guided';
import { OptionCard } from './OptionCard';
import { StepHeader } from './StepHeader';

/**
 * Step 1. Seven cards in one column on a phone, two on a wide screen.
 *
 * "Je ne suis pas certain" is a first-class answer rather than a fallback at
 * the bottom of a dropdown, because a homeowner who does not know the trade
 * word for their problem is the single most common visitor this business
 * gets - and the one most likely to abandon a form that assumes they do.
 */
export function StepService({
  copy,
  selected,
  pending,
  onSelect,
}: {
  copy: GuidedCopy;
  selected: GuidedServiceKey | null;
  pending: boolean;
  onSelect: (key: GuidedServiceKey) => void;
}) {
  return (
    <div className="flex flex-col gap-6">
      <StepHeader question={copy.service.question} hint={copy.service.hint} />
      <div className="grid gap-2.5 sm:grid-cols-2">
        {copy.service.options.map((option) => (
          <OptionCard
            key={option.key}
            label={option.label}
            hint={option.hint}
            icon={option.icon}
            selected={selected === option.key}
            disabled={pending}
            onSelect={() => onSelect(option.key)}
          />
        ))}
      </div>
    </div>
  );
}
