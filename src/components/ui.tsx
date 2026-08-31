import Link from 'next/link';

import { IconArrow } from './icons';

/* --------------------------------------------------------------- eyebrow */

export function Eyebrow({
  children,
  tone = 'umber',
  className = '',
}: {
  children: React.ReactNode;
  tone?: 'umber' | 'brass';
  className?: string;
}) {
  return (
    <p className={`u-label ${tone === 'umber' ? 'text-umber' : 'text-brass'} ${className}`}>
      {children}
    </p>
  );
}

/* -------------------------------------------------------- section heading */

export function SectionHeading({
  eyebrow,
  title,
  lede,
  accent,
  tone = 'light',
  align = 'start',
  action,
  className = '',
}: {
  eyebrow?: string;
  title: React.ReactNode;
  lede?: string;
  accent?: string;
  tone?: 'light' | 'dark';
  align?: 'start' | 'center';
  action?: React.ReactNode;
  className?: string;
}) {
  const dark = tone === 'dark';
  return (
    <div
      className={`reveal flex flex-col gap-6 ${
        align === 'center' ? 'items-center text-center' : ''
      } ${action ? 'md:flex-row md:items-end md:justify-between md:gap-10' : ''} ${className}`}
    >
      <div className={`max-w-2xl ${align === 'center' ? 'mx-auto' : ''}`}>
        {eyebrow ? (
          <>
            <Eyebrow tone={dark ? 'brass' : 'umber'}>{eyebrow}</Eyebrow>
            <span
              className={`u-tick mt-3 ${align === 'center' ? 'mx-auto' : ''}`}
              aria-hidden="true"
            />
          </>
        ) : null}
        <h2 className={`u-h2 mt-5 ${dark ? 'text-paper' : 'text-ink'}`}>{title}</h2>
        {accent ? (
          <p
            className={`u-accent mt-2.5 text-[clamp(1.25rem,2vw,1.625rem)] ${
              dark ? 'text-brass' : 'text-brass-deep'
            }`}
          >
            {accent}
          </p>
        ) : null}
        {lede ? <p className={`u-lede mt-5 ${dark ? 'text-dust' : ''}`}>{lede}</p> : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}

/* ------------------------------------------------------------ text button */

export function ArrowLink({
  href,
  children,
  tone = 'light',
  external = false,
  className = '',
}: {
  href: string;
  children: React.ReactNode;
  tone?: 'light' | 'dark';
  external?: boolean;
  className?: string;
}) {
  const cls = `link-rule min-h-11 ${
    tone === 'dark' ? 'text-paper hover:text-brass' : 'text-ink hover:text-brass-deep'
  } ${className}`;
  const content = (
    <>
      {children}
      <IconArrow className="h-4 w-4 shrink-0" />
    </>
  );

  if (external) {
    return (
      <a href={href} className={cls} target="_blank" rel="noopener noreferrer">
        {content}
      </a>
    );
  }
  return (
    <Link href={href} className={cls}>
      {content}
    </Link>
  );
}

/* --------------------------------------------------------------- plaque */

export type PlaqueItem = {
  label: string;
  value: React.ReactNode;
  href?: string;
  icon?: React.ReactNode;
};

/**
 * The mounted information plaque: engraved label above, value below, hairline
 * dividers between cells. Used for the hero contact block and page metadata.
 */
export function InfoPlaque({
  items,
  className = '',
}: {
  items: PlaqueItem[];
  className?: string;
}) {
  return (
    <dl
      className={`s-plaque grid divide-y divide-[var(--line)] sm:grid-cols-3 sm:divide-x sm:divide-y-0 ${className}`}
    >
      {items.map((item) => (
        <div key={item.label} className="relative z-10 px-4 py-3.5">
          <dt className="u-label text-ink-50 text-[0.625rem] tracking-[0.2em]">{item.label}</dt>
          <dd className="text-ink mt-1.5 text-[0.9375rem] font-[550] tracking-[-0.01em]">
            {item.href ? (
              <a
                href={item.href}
                className="link-rule inline-flex min-h-8 items-center text-[0.9375rem]"
              >
                {item.icon}
                {item.value}
              </a>
            ) : (
              <span className="inline-flex items-center gap-2">
                {item.icon}
                {item.value}
              </span>
            )}
          </dd>
        </div>
      ))}
    </dl>
  );
}

/* ------------------------------------------------------------ list marks */

export function CheckList({
  items,
  tone = 'light',
  className = '',
}: {
  items: string[];
  tone?: 'light' | 'dark';
  className?: string;
}) {
  return (
    <ul className={`flex flex-col ${className}`}>
      {items.map((item) => (
        <li
          key={item}
          className={`flex gap-3.5 border-b py-3.5 last:border-b-0 ${
            tone === 'dark' ? 'border-[var(--line-dark)]' : 'border-[var(--line)]'
          }`}
        >
          <span
            aria-hidden="true"
            className={`mt-[0.55rem] h-1.5 w-1.5 shrink-0 ${
              tone === 'dark' ? 'bg-brass' : 'bg-umber'
            }`}
          />
          <span className={tone === 'dark' ? 'text-dust' : 'u-body'}>{item}</span>
        </li>
      ))}
    </ul>
  );
}

/* ------------------------------------------------------------- note card */

export function NoteCard({
  label,
  children,
  className = '',
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <aside
      className={`s-plaque !border-l-umber border-l-2 px-5 py-4 ${className}`}
      aria-label={label}
    >
      <p className="u-label text-umber relative z-10">{label}</p>
      <p className="u-body relative z-10 mt-2 text-[0.9375rem]">{children}</p>
    </aside>
  );
}
