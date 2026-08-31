'use client';

import { useEffect, useId, useRef } from 'react';

import type { GuidedCopy, LocationKey } from '@/content/guided';
import { OptionCard } from './OptionCard';
import { StepHeader } from './StepHeader';

/**
 * Step 3. A city, not a postal code and not an address.
 *
 * A city is one tap and answers the only question that matters at this
 * stage - is this inside the service area. A postal code would be typing, and
 * a street address is a question the crew asks on the call anyway, when the
 * visitor is already talking to a person rather than deciding whether to.
 *
 * "Autre secteur" is the single free-text field in the entire flow, and it
 * only exists so a lead from Saint-Eustache is not turned away by a list.
 */
export function StepLocation({
  copy,
  selected,
  custom,
  customError,
  pending,
  onSelect,
  onCustomChange,
  onCustomConfirm,
}: {
  copy: GuidedCopy;
  selected: LocationKey | null;
  custom: string;
  customError: boolean;
  pending: boolean;
  onSelect: (key: LocationKey) => void;
  onCustomChange: (value: string) => void;
  onCustomConfirm: () => void;
}) {
  const uid = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const isOther = selected === 'other';

  useEffect(() => {
    if (isOther) inputRef.current?.focus();
  }, [isOther]);

  return (
    <div className="flex flex-col gap-6">
      <StepHeader question={copy.location.question} hint={copy.location.hint} />

      <div className="grid grid-cols-2 gap-2.5">
        {copy.location.options.map((option) => (
          <div key={option.key} className={option.key === 'other' ? 'col-span-2' : ''}>
            <OptionCard
              label={option.label}
              hint={option.hint}
              icon={option.icon}
              selected={selected === option.key}
              disabled={pending}
              onSelect={() => onSelect(option.key)}
            />
          </div>
        ))}
      </div>

      {isOther ? (
        <div className="panel-in">
          <label
            htmlFor={`${uid}-city`}
            className="u-label text-ink-70 mb-2 block text-[0.625rem] tracking-[0.16em]"
          >
            {copy.location.otherLabel}
          </label>
          <input
            ref={inputRef}
            id={`${uid}-city`}
            type="text"
            autoComplete="address-level2"
            enterKeyHint="go"
            placeholder={copy.location.otherPlaceholder}
            value={custom}
            onChange={(event) => onCustomChange(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                event.preventDefault();
                onCustomConfirm();
              }
            }}
            aria-invalid={customError}
            aria-describedby={customError ? `${uid}-city-error` : undefined}
            className="field"
          />
          {customError ? (
            <p
              id={`${uid}-city-error`}
              role="alert"
              className="mt-1.5 text-[0.8125rem] text-[var(--color-danger-deep)]"
            >
              {copy.location.otherError}
            </p>
          ) : null}
          <button type="button" onClick={onCustomConfirm} className="btn btn-stone mt-4 w-full">
            {copy.location.otherContinue}
          </button>
        </div>
      ) : null}
    </div>
  );
}
