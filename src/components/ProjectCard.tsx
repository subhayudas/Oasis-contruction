import Link from 'next/link';

import { Picture } from '@/components/Picture';
import { services } from '@/content/services';
import type { ProjectEntry } from '@/content/projects';
import type { Locale } from '@/lib/i18n';
import { source } from '@/lib/images';
import { projectPath } from '@/lib/routes';

function serviceName(key: string, locale: Locale): string {
  return services.find((s) => s.key === key)?.copy[locale].name ?? key;
}

/**
 * One project tile: a 4:3 crop, the service type as an overlay chip, and the
 * whole card clickable through a single anchor on the title.
 *
 * The chip carries the service rather than a municipality, because the
 * municipality is not verified for any of these photographs. A location label
 * invented from what a house looks like would be exactly the kind of small
 * fiction that costs a contractor a job when a customer notices.
 */
export function ProjectCard({ entry, locale }: { entry: ProjectEntry; locale: Locale }) {
  const imageId = entry.kind === 'before-after' ? entry.after : entry.image;
  const alt = entry.kind === 'before-after' ? entry.altAfter[locale] : entry.alt[locale];
  const variant = entry.kind === 'before-after' ? 'still' : 'square';
  const primaryTag = entry.tags[0];

  return (
    <div className="s-sample group relative flex h-full flex-col">
      <div className="relative">
        <div className="frame frame-keyline aspect-[4/3]">
          <Picture
            alt={alt}
            sizes="(min-width: 64rem) 30vw, (min-width: 40rem) 46vw, 92vw"
            sources={[source(imageId, variant)]}
            className="block h-full w-full"
            imgClassName="h-full w-full object-cover transition-transform duration-500 ease-[var(--ease-material)] group-hover:scale-[1.03]"
          />
        </div>
        {primaryTag ? (
          <span className="u-label bg-ink/85 text-paper absolute bottom-3 left-3 rounded-md px-2.5 py-1.5 text-[0.5625rem] tracking-[0.16em] backdrop-blur-sm">
            {serviceName(primaryTag, locale)}
          </span>
        ) : null}
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="u-h3 text-[1.0625rem]">
          <Link
            href={projectPath(locale, entry.id)}
            className="after:absolute after:inset-0 after:content-['']"
          >
            {entry.title[locale]}
          </Link>
        </h3>
        <p className="u-meta mt-2 line-clamp-3">{entry.caption[locale]}</p>
      </div>
    </div>
  );
}
