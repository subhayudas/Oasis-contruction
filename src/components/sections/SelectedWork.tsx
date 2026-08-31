import { ProjectCard } from '@/components/ProjectCard';
import { ArrowLink, SectionHeading } from '@/components/ui';
import { getDictionary } from '@/content/dictionary';
import { projectEntries } from '@/content/projects';
import type { Locale } from '@/lib/i18n';
import { pagePath } from '@/lib/routes';

/**
 * Six projects on the homepage, the two before/after transformations first
 * because they are the strongest proof the business has. The full set, with
 * filters and the comparator, lives on /projets.
 */
export function SelectedWork({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);
  const featured = projectEntries.slice(0, 6);

  return (
    <section className="u-section">
      <div className="u-wrap">
        <SectionHeading
          eyebrow={t.workSection.eyebrow}
          title={t.workSection.title}
          lede={t.workSection.lede}
          action={
            <ArrowLink href={pagePath(locale, 'projects')}>{t.common.allProjects}</ArrowLink>
          }
        />

        <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5">
          {featured.map((entry, index) => (
            <li
              key={entry.id}
              className="reveal"
              style={{ ['--reveal-delay' as string]: `${index * 60}ms` }}
            >
              <ProjectCard entry={entry} locale={locale} />
            </li>
          ))}
        </ul>

        <p className="u-meta reveal mt-8 max-w-2xl">{t.workSection.realPhotos}</p>
      </div>
    </section>
  );
}
