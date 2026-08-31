'use client';

import type { GuidedCopy, GuidedServiceKey } from '@/content/guided';
import { OptionCard } from './OptionCard';
import { StepHeader } from './StepHeader';

/**
 * Step 2, and the step that makes the whole form worth building.
 *
 * The question and the options both change with the service chosen a screen
 * earlier, so the visitor is never asked to translate their situation into
 * a generic vocabulary: someone who picked "muret" is asked whether it leans,
 * not what "type de problème" they have. Every option is phrased as the
 * symptom a homeowner would notice, which is also exactly what the crew needs
 * to know before the callback.
 */
export function StepProblem({
  copy,
  service,
  selected,
  pending,
  onSelect,
}: {
  copy: GuidedCopy;
  service: GuidedServiceKey;
  selected: string | null;
  pending: boolean;
  onSelect: (key: string) => void;
}) {
  const group = copy.problem.groups[service];

  return (
    <div className="flex flex-col gap-6">
      <StepHeader question={group.question} hint={copy.problem.hint} />
      <div className="flex flex-col gap-2.5">
        {group.options.map((option) => (
          <OptionCard
            key={option.key}
            label={option.label}
            hint={option.hint}
            selected={selected === option.key}
            disabled={pending}
            onSelect={() => onSelect(option.key)}
          />
        ))}
      </div>
    </div>
  );
}
