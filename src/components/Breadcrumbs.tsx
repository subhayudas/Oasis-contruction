import Link from 'next/link';

import { IconChevron } from './icons';

export type Crumb = { name: string; path: string };

export function Breadcrumbs({
  items,
  label,
  className = '',
}: {
  items: Crumb[];
  label: string;
  className?: string;
}) {
  return (
    <nav aria-label={label} className={className}>
      <ol className="flex flex-wrap items-center gap-x-1.5 gap-y-1 text-[0.8125rem]">
        {items.map((item, index) => {
          const last = index === items.length - 1;
          return (
            <li key={item.path} className="flex items-center gap-1.5">
              {index > 0 ? (
                <IconChevron className="text-ink-50 h-3 w-3" aria-hidden="true" />
              ) : null}
              {last ? (
                <span
                  aria-current="page"
                  className="text-ink-50 inline-flex min-h-11 items-center"
                >
                  {item.name}
                </span>
              ) : (
                <Link
                  href={item.path}
                  className="link-quiet inline-flex min-h-11 items-center px-1"
                >
                  {item.name}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
