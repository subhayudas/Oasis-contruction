import type { Locale } from '@/lib/i18n';

type Copy = Record<Locale, string>;

export type AreaGroup = {
  id: string;
  name: Copy;
  /** The municipalities the business names as its territory. */
  places: string[];
  note: Copy;
};

/**
 * The service area, as the business states it: Laval and the North Shore.
 *
 * The municipalities listed under each group are the ones that make up those
 * two territories — they are geography, not a claim about where work has been
 * completed. The page says so in as many words, and there is no separate page
 * per city: one honest service-area page beats a dozen doorway pages, and
 * Google treats the latter as spam.
 */
export const areaGroups: AreaGroup[] = [
  {
    id: 'laval',
    name: { fr: 'Laval', en: 'Laval' },
    places: [
      'Chomedey',
      'Sainte-Rose',
      'Vimont',
      'Auteuil',
      'Duvernay',
      'Laval-des-Rapides',
      'Pont-Viau',
      'Fabreville',
      'Sainte-Dorothée',
      'Saint-François',
      'Saint-Vincent-de-Paul',
    ],
    note: {
      fr: 'Laval au complet, d’un secteur à l’autre.',
      en: 'All of Laval, from one sector to the next.',
    },
  },
  {
    id: 'rive-nord',
    name: { fr: 'Rive-Nord', en: 'North Shore' },
    places: [
      'Terrebonne',
      'Blainville',
      'Boisbriand',
      'Sainte-Thérèse',
      'Rosemère',
      'Lorraine',
      'Bois-des-Filion',
      'Mascouche',
      'Repentigny',
      'Mirabel',
      'Saint-Eustache',
      'Deux-Montagnes',
    ],
    note: {
      fr: 'Les municipalités de la Rive-Nord de Montréal.',
      en: 'The municipalities of Montreal’s North Shore.',
    },
  },
];
