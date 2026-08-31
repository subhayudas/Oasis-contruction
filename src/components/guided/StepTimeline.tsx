'use client';

import type { GuidedCopy, TimelineKey } from '@/content/guided';
import { OptionCard } from './OptionCard';
import { StepHeader } from './StepHeader';

/**
 * Step 4. Urgency, asked without pressure.
 *
 * This is the field that lets the crew call the right person first. "Je
 * regarde mes options" is written as a legitimate answer rather than a
 * disqualifier — a visitor who feels punished for picking it will pick
 * something else, and then the ordering the question exists to produce is
 * wrong for every lead in the list.
 */
export function StepTimeline({
  copy,
  selected,
  pending,
  onSelect,
}: {
  copy: GuidedCopy;
  selected: TimelineKey | null;
  pending: boolean;
  onSelect: (key: TimelineKey) => void;
}) {
  return (
    <div className="flex flex-col gap-6">
      <StepHeader question={copy.timeline.question} hint={copy.timeline.hint} />
      <div className="flex flex-col gap-2.5">
        {copy.timeline.options.map((option) => (
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
