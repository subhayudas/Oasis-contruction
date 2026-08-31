import { OpenGuidedForm } from '@/components/guided/OpenGuidedForm';
import { SectionHeading } from '@/components/ui';
import { getDictionary } from '@/content/dictionary';
import type { Locale } from '@/lib/i18n';
import { pagePath } from '@/lib/routes';

/**
 * The section that names the visitor's problem back to them before the site
 * says a word about itself. It sits between the credentials strip and the
 * solution, which is the order the questions actually arrive in: are you
 * real, do you understand my problem, what do you do about it.
 */
export function Problem({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);

  return (
    <section className="u-section">
      <div className="u-wrap">
        <SectionHeading
          align="center"
          eyebrow={t.problemSection.eyebrow}
          title={t.problemSection.title}
        />
        <p className="u-lede reveal mx-auto mt-8 max-w-[44rem] text-center">
          {t.problemSection.body}
        </p>
        <div className="reveal mt-8 flex justify-center">
          <OpenGuidedForm
            href={pagePath(locale, 'contact')}
            label={t.common.quote}
            location="problem"
            className="btn btn-stone"
          />
        </div>
      </div>
    </section>
  );
}
