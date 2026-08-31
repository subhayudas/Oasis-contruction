'use client';

import type { GuidedIcon } from '@/content/guided';
import { IconCheck } from '@/components/icons';
import { GuidedGlyph } from './icon-for';

type Props = {
  label: string;
  hint?: string;
  icon?: GuidedIcon;
  selected: boolean;
  onSelect: () => void;
  /** Blocks a second tap while the 300ms confirmation is playing. */
  disabled?: boolean;
};

/**
 * One tappable answer.
 *
 * A real `<button>`, not a div with `role="button"`: it is then keyboard
 * operable, Enter- and Space-activated and focus-ringed by the platform,
 * with no ARIA to keep in sync. The tick on the right is the confirmation
 * the visitor sees for 300ms before the next question replaces the screen.
 */
export function OptionCard({ label, hint, icon, selected, onSelect, disabled }: Props) {
  return (
    <button
      type="button"
      onClick={onSelect}
      disabled={disabled}
      data-selected={selected ? 'true' : 'false'}
      aria-pressed={selected}
      className="g-card"
    >
      {icon ? (
        <span className="g-card-icon" aria-hidden="true">
          <GuidedGlyph name={icon} className="h-5 w-5" />
        </span>
      ) : null}

      <span className="flex min-w-0 flex-1 flex-col gap-0.5">
        <span className="text-ink text-[1rem] leading-[1.3] font-[600]">{label}</span>
        {hint ? <span className="u-meta text-[0.8125rem]">{hint}</span> : null}
      </span>

      <IconCheck className="g-card-tick text-brass-deep h-5 w-5 shrink-0" />
    </button>
  );
}
