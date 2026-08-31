import { fact } from '@/content/placeholders';
import { getDictionary } from '@/content/dictionary';
import type { Locale } from '@/lib/i18n';
import { IconCheck, IconPin, IconShield } from './icons';

/**
 * The credentials strip, directly under the hero.
 *
 * Three of the four cells depend on facts the business has not supplied. They
 * render the bracketed token rather than a plausible number, which is the
 * whole point: a visitor can tell the difference between a site that has not
 * been filled in and a site that is making things up, and only one of those
 * is recoverable.
 */
export function TrustBar({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);

  const items = [
    { icon: <IconShield className="h-4 w-4" />, text: fact('rbqNumber'), label: 'RBQ' },
    {
      icon: <IconCheck className="h-4 w-4" />,
      text: fact('insuranceProvider'),
      label: locale === 'fr' ? 'Assuré' : 'Insured',
    },
    {
      icon: <IconCheck className="h-4 w-4" />,
      text: fact('projectCount'),
      label: locale === 'fr' ? 'Projets complétés' : 'Projects completed',
    },
    {
      icon: <IconPin className="h-4 w-4" />,
      text: t.trustBar.area,
      label: t.common.serviceArea,
    },
  ];

  return (
    <section aria-label={t.trustBar.label} className="bg-sand border-y border-[var(--line)]">
      <div className="u-wrap">
        <ul className="grid grid-cols-2 divide-x divide-y divide-[var(--line)] md:grid-cols-4 md:divide-y-0">
          {items.map((item, index) => (
            <li
              key={item.label}
              className={`flex min-h-[5rem] flex-col items-center justify-center gap-1 px-4 py-4 text-center ${
                index % 2 === 0 ? 'border-l-0' : ''
              } md:border-l md:first:border-l-0`}
            >
              <span className="text-brass-deep flex items-center gap-1.5">
                {item.icon}
                <span className="u-label text-ink-50 text-[0.5625rem] tracking-[0.18em]">
                  {item.label}
                </span>
              </span>
              <span className="text-ink text-[0.9375rem] font-[560] tracking-[-0.01em]">
                {item.text}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
