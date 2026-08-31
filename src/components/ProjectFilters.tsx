'use client';

import { useMemo, useState } from 'react';

import { ProjectCard } from '@/components/ProjectCard';
import type { ProjectEntry } from '@/content/projects';
import type { Locale } from '@/lib/i18n';
import type { ServiceKey } from '@/lib/routes';

type Filter = { value: ServiceKey | 'all'; label: string };

/**
 * Client-side filtering over a fixed, small set of projects.
 *
 * Every project stays in the DOM and is hidden with `hidden` rather than
 * unmounted, so the whole gallery is still crawlable and still findable with
 * the browser's own find-in-page - a filter that empties the document is a
 * filter that costs the page its indexable content.
 */
export function ProjectFilters({
  entries,
  locale,
  filters,
  labels,
}: {
  entries: ProjectEntry[];
  locale: Locale;
  filters: Filter[];
  labels: { legend: string; empty: string; count: string };
}) {
  const [active, setActive] = useState<ServiceKey | 'all'>('all');

  const visible = useMemo(
    () => entries.filter((entry) => active === 'all' || entry.tags.includes(active)),
    [entries, active],
  );

  return (
    <>
      <fieldset className="m-0 border-0 p-0">
        <legend className="u-label text-umber mb-4">{labels.legend}</legend>
        <div className="flex flex-wrap gap-2">
          {filters.map((filter) => {
            const selected = filter.value === active;
            return (
              <label
                key={filter.value}
                className={`btn btn-compact text-[0.875rem] ${
                  selected ? 'btn-stone' : 'btn-quarry'
                }`}
              >
                <input
                  type="radio"
                  name="project-filter"
                  value={filter.value}
                  checked={selected}
                  onChange={() => setActive(filter.value)}
                  className="sr-only-focusable absolute"
                />
                {filter.label}
              </label>
            );
          })}
        </div>
      </fieldset>

      <p className="u-meta mt-4" role="status" aria-live="polite">
        {visible.length} {labels.count}
      </p>

      {visible.length === 0 ? (
        <p className="u-body mt-8">{labels.empty}</p>
      ) : (
        <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5">
          {entries.map((entry) => (
            <li
              key={entry.id}
              hidden={!visible.includes(entry)}
              className={visible.includes(entry) ? '' : 'hidden'}
            >
              <ProjectCard entry={entry} locale={locale} />
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
