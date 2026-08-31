import type { Locale } from '@/lib/i18n';

export type FaqItem = { q: string; a: string };

/**
 * The homepage FAQ.
 *
 * Answers that depend on a business fact carry a {placeholder} hole rather
 * than a guess — `fill()` in placeholders.ts resolves them at render time, so
 * an unanswered question reads as an obvious gap rather than as an invented
 * promise. Every one of these is also emitted as FAQPage structured data,
 * which is exactly why none of them may be fiction.
 */
export const homeFaq: Record<Locale, FaqItem[]> = {
  fr: [
    {
      q: 'L’évaluation est-elle vraiment gratuite?',
      a: 'Oui. On se déplace, on regarde le problème, on vous explique ce qu’on voit. Sans frais, sans obligation. Si on constate que ce n’est pas un travail pour nous, on vous le dira aussi.',
    },
    {
      q: 'Combien de temps avant de recevoir un devis?',
      a: 'On vous revient dans les {responseTime} suivant l’évaluation sur place, avec un devis écrit et détaillé.',
    },
    {
      q: 'Êtes-vous licenciés RBQ?',
      a: 'Oui. Notre numéro RBQ est {rbqNumber}. Vous pouvez le vérifier vous-même dans le registre des détenteurs de licence de la Régie du bâtiment du Québec.',
    },
    {
      q: 'Est-ce que vous offrez une garantie?',
      a: '{warrantyTerms}',
    },
    {
      q: 'Quels secteurs desservez-vous?',
      a: 'Laval et la Rive-Nord de Montréal. Si vous n’êtes pas certain d’être dans le secteur, appelez : la réponse prend trente secondes.',
    },
    {
      q: 'Combien ça coûte?',
      a: 'Le coût dépend de plusieurs facteurs : la surface à couvrir, l’état de la base existante, les matériaux choisis, l’accès au site, et le drainage. C’est pour ça qu’on fait une évaluation gratuite sur place. On vous remet un devis transparent après l’évaluation.',
    },
    {
      q: 'Est-ce que je dois être présent pour l’évaluation?',
      a: 'C’est préférable. On peut regarder le terrain sans vous, mais l’évaluation sert autant à comprendre ce que vous voulez obtenir qu’à voir ce qui ne va pas — et c’est le moment où vous pouvez poser vos questions directement.',
    },
    {
      q: 'Acceptez-vous les petits projets?',
      a: 'Oui. Une section d’allée qui s’est affaissée, quelques marches à reprendre, un bout de muret : ce sont des travaux qu’on fait régulièrement. Appelez-nous ou envoyez une photo, on vous dira franchement s’il vaut mieux réparer maintenant ou attendre.',
    },
  ],

  en: [
    {
      q: 'Is the assessment really free?',
      a: 'Yes. We come out, look at the problem, and explain what we see. No charge, no obligation. If we find it is not work for us, we will tell you that too.',
    },
    {
      q: 'How long before I get a quote?',
      a: 'We come back to you within {responseTime} of the on-site assessment, with a written, itemised quote.',
    },
    {
      q: 'Are you RBQ licensed?',
      a: 'Yes. Our RBQ number is {rbqNumber}. You can verify it yourself in the Régie du bâtiment du Québec licence holder registry.',
    },
    {
      q: 'Do you offer a warranty?',
      a: '{warrantyTerms}',
    },
    {
      q: 'What areas do you serve?',
      a: 'Laval and Montreal’s North Shore. If you are not sure whether you are in the area, call — the answer takes thirty seconds.',
    },
    {
      q: 'What does it cost?',
      a: 'The cost depends on several things: the area to be covered, the condition of the existing base, the materials chosen, access to the site, and drainage. That is why the on-site assessment is free. You get a transparent quote after the assessment.',
    },
    {
      q: 'Do I need to be there for the assessment?',
      a: 'It is better if you are. We can look at the site without you, but the assessment is as much about understanding what you want as about seeing what is wrong — and it is your chance to ask questions directly.',
    },
    {
      q: 'Do you take on small jobs?',
      a: 'Yes. A section of walkway that has settled, a few steps to reset, a short run of wall: that is work we do regularly. Call us or send a photo, and we will tell you honestly whether it is worth repairing now or leaving.',
    },
  ],
};
