import type { Locale } from '@/lib/i18n';
import type { ServiceKey } from '@/lib/routes';

type Copy = Record<Locale, string>;

export type Project = {
  id: string;
  /** Image id in the generated manifest. */
  image: string;
  title: Copy;
  /** One short factual line about what is visible in the photograph. */
  caption: Copy;
  alt: Copy;
  tags: ServiceKey[];

  /**
   * Everything below is detail-page metadata the business has not supplied
   * yet: which municipality the job was in, how long it took, what was wrong
   * before, what was done. `null` means "not verified" and the detail page
   * renders a labelled gap rather than a plausible-sounding invention.
   *
   * A photograph shows what a surface looks like. It cannot tell you where it
   * is, when it was built, or what the customer's problem was — so none of
   * that is written here from looking at the frame.
   */
  location: Copy | null;
  /** Month and year the work was completed, e.g. { fr: 'Mai 2025', … }. */
  completedAt: Copy | null;
  /** How long the job took on site, e.g. { fr: '3 jours', … }. */
  duration: Copy | null;
  /** What was wrong before the work. */
  problem: Copy | null;
  /** What Oasis did about it. */
  solution: Copy | null;
  /** Surface area, materials, notable features. */
  scope: Copy | null;
};

export type BeforeAfter = {
  id: string;
  before: string;
  after: string;
  title: Copy;
  caption: Copy;
  altBefore: Copy;
  altAfter: Copy;
  /** Which services the transformation demonstrates. */
  tags: ServiceKey[];
  /** Unverified detail-page metadata — see the note on Project above. */
  location: Copy | null;
  completedAt: Copy | null;
  duration: Copy | null;
  problem: Copy | null;
  solution: Copy | null;
  scope: Copy | null;
};

/**
 * Every entry below is one of the client's own photographs. Titles and captions
 * describe only what is visible in the frame — no client names, no addresses,
 * no dates, no budgets, and no claims about scope that the photo cannot show.
 */
export const projects: Project[] = [
  {
    id: 'allee-pave-uni-entree',
    image: 'allee-pave-uni-entree',
    title: {
      fr: 'Allée d’entrée en pavé uni',
      en: 'Interlocking paver front walkway',
    },
    caption: {
      fr: 'Allée en pavé uni bordée de dalles de béton et d’un lit de galets, entre le stationnement et la porte d’entrée.',
      en: 'Interlocking paver walkway edged with concrete slabs and a river-rock bed, running from the driveway to the front door.',
    },
    alt: {
      fr: 'Allée résidentielle en pavé uni gris, bordée d’un lit de galets noirs et de larges dalles de béton, menant à la porte d’entrée d’une maison blanche.',
      en: 'Grey interlocking paver walkway bordered by a bed of black river rock and wide concrete slabs, leading to the front door of a white house.',
    },
    tags: ['pave-uni'],
    location: null,
    completedAt: null,
    duration: null,
    problem: null,
    solution: null,
    scope: null,
  },
  {
    id: 'palier-pave-uni-entree',
    image: 'palier-pave-uni-entree',
    title: {
      fr: 'Palier d’entrée en dalles',
      en: 'Slab entrance landing',
    },
    caption: {
      fr: 'Palier en dalles posé au pied d’un escalier de béton existant, raccordé au nouvel asphalte du stationnement.',
      en: 'Slab landing laid at the foot of an existing concrete stairway and tied into the driveway’s new asphalt.',
    },
    alt: {
      fr: 'Palier en dalles de béton beige installé devant un escalier de béton arrondi, avec un stationnement en asphalte neuf à côté.',
      en: 'Beige concrete slab landing installed in front of a curved concrete stairway, with freshly laid asphalt driveway alongside.',
    },
    tags: ['pave-uni'],
    location: null,
    completedAt: null,
    duration: null,
    problem: null,
    solution: null,
    scope: null,
  },
  {
    id: 'muret-stationnement-pave',
    image: 'muret-stationnement-pave',
    title: {
      fr: 'Muret et stationnement en pavé',
      en: 'Retaining wall and paver driveway',
    },
    caption: {
      fr: 'Muret de blocs retenant la pente du terrain le long d’un stationnement en pavé uni.',
      en: 'Block retaining wall holding the grade along an interlocking paver driveway.',
    },
    alt: {
      fr: 'Muret de blocs de béton texturé retenant une pelouse en pente, le long d’un stationnement en pavé uni menant à un garage.',
      en: 'Textured concrete block retaining wall holding back a sloped lawn beside an interlocking paver driveway leading to a garage.',
    },
    tags: ['muret', 'pave-uni'],
    location: null,
    completedAt: null,
    duration: null,
    problem: null,
    solution: null,
    scope: null,
  },
  {
    id: 'escalier-pierre-talus',
    image: 'escalier-pierre-talus',
    title: {
      fr: 'Escalier extérieur en pierre',
      en: 'Cut-stone exterior stairway',
    },
    caption: {
      fr: 'Marches de pierre installées dans un talus, en cours de chantier, avec le muret déjà monté à l’arrière.',
      en: 'Stone steps set into a slope during construction, with the retaining wall already built behind.',
    },
    alt: {
      fr: 'Escalier extérieur en marches de pierre grise installé dans un talus de terre, avec des feuilles d’automne au sol et un muret en arrière-plan.',
      en: 'Exterior stairway of grey stone steps set into an earth slope, autumn leaves on the ground and a retaining wall in the background.',
    },
    tags: ['muret'],
    location: null,
    completedAt: null,
    duration: null,
    problem: null,
    solution: null,
    scope: null,
  },
  {
    id: 'allee-pierre-naturelle',
    image: 'allee-pierre-naturelle',
    title: {
      fr: 'Allée latérale en pierre naturelle',
      en: 'Natural stone side walkway',
    },
    caption: {
      fr: 'Allée en pierre naturelle raccordée à une terrasse en pavé, photographiée après rinçage.',
      en: 'Natural stone walkway tied into a paver terrace, photographed just after rinsing.',
    },
    alt: {
      fr: 'Allée en dalles de pierre naturelle irrégulières, encore mouillée, passant entre deux maisons de pierre et rejoignant une terrasse en pavé.',
      en: 'Walkway of irregular natural stone slabs, still wet, running between two stone houses and meeting a paver terrace.',
    },
    tags: ['lavage-sous-pression', 'pave-uni'],
    location: null,
    completedAt: null,
    duration: null,
    problem: null,
    solution: null,
    scope: null,
  },
  {
    id: 'allee-pave-bordure-jardin',
    image: 'allee-pave-bordure-jardin',
    title: {
      fr: 'Allée en dalles et bordure de plate-bande',
      en: 'Slab walkway and planting-bed edge',
    },
    caption: {
      fr: 'Allée en dalles de grand format avec bordure de béton contre une plate-bande, sous l’ombre d’un érable.',
      en: 'Large-format slab walkway with a concrete edge against a planting bed, under the shade of a maple.',
    },
    alt: {
      fr: 'Allée en dalles de béton de grand format longeant une bordure sombre et une plate-bande, avec l’ombre du feuillage projetée sur la surface.',
      en: 'Large-format concrete slab walkway running along a dark edge restraint and a planting bed, dappled with leaf shadow.',
    },
    tags: ['pave-uni', 'drainage'],
    location: null,
    completedAt: null,
    duration: null,
    problem: null,
    solution: null,
    scope: null,
  },
  {
    id: 'dalles-beton-cour-laterale',
    image: 'dalles-beton-cour-laterale',
    title: {
      fr: 'Cour latérale en dalles de béton',
      en: 'Concrete slab side courtyard',
    },
    caption: {
      fr: 'Passage latéral en dalles de béton posé entre la maison et la clôture, avec bordure et plate-bande.',
      en: 'Concrete slab side passage laid between the house and the fence, with edge restraint and planting bed.',
    },
    alt: {
      fr: 'Passage latéral pavé de grandes dalles de béton entre le mur d’une maison et une clôture de bois, avec une rampe métallique et une plate-bande.',
      en: 'Side passage paved with large concrete slabs between a house wall and a wooden fence, with a metal handrail and a planting bed.',
    },
    tags: ['pave-uni', 'drainage'],
    location: null,
    completedAt: null,
    duration: null,
    problem: null,
    solution: null,
    scope: null,
  },
  {
    id: 'contour-piscine-beton',
    image: 'contour-piscine-beton',
    title: {
      fr: 'Contour de piscine en béton estampé',
      en: 'Stamped concrete pool surround',
    },
    caption: {
      fr: 'Surface de béton estampé aménagée autour d’une piscine creusée existante. Oasis Construction intervient sur les surfaces extérieures, pas sur la piscine elle-même.',
      en: 'Stamped concrete surface around an existing in-ground pool. Oasis Construction works on the surrounding surfaces, not on the pool itself.',
    },
    alt: {
      fr: 'Contour de piscine en béton estampé imitant la pierre, bordant une piscine creusée entourée de haies de cèdres.',
      en: 'Stamped concrete pool surround imitating stone, edging an in-ground pool framed by cedar hedges.',
    },
    tags: ['lavage-sous-pression'],
    location: null,
    completedAt: null,
    duration: null,
    problem: null,
    solution: null,
    scope: null,
  },
];

export const beforeAfters: BeforeAfter[] = [
  {
    id: 'avant-apres-entree',
    before: 'avant-apres-entree-avant',
    after: 'avant-apres-entree-apres',
    title: {
      fr: 'Entrée refaite : murets, escalier et allée',
      en: 'Rebuilt entrance: walls, steps and walkway',
    },
    caption: {
      fr: 'Travaux extérieurs sur une entrée résidentielle : murets de soutènement de chaque côté du stationnement, escalier et allée en dalles, et nouvel asphalte.',
      en: 'Exterior work on a residential entrance: retaining walls on both sides of the driveway, slab steps and walkway, and new asphalt.',
    },
    altBefore: {
      fr: 'Avant les travaux : stationnement en asphalte fissuré, bordure de béton affaissée et plate-bande envahie devant un garage.',
      en: 'Before the work: cracked asphalt driveway, a sagging concrete edge and an overgrown planting bed in front of a garage.',
    },
    altAfter: {
      fr: 'Après les travaux : murets de béton de chaque côté de l’entrée, escalier et allée en dalles vers la porte, et asphalte neuf.',
      en: 'After the work: concrete retaining walls on both sides of the entrance, slab steps and walkway to the door, and new asphalt.',
    },
    tags: ['muret', 'margelle', 'pave-uni'],
    location: null,
    completedAt: null,
    duration: null,
    problem: null,
    solution: null,
    scope: null,
  },
  {
    id: 'avant-apres-allee',
    before: 'avant-apres-allee-avant',
    after: 'avant-apres-allee-apres',
    title: {
      fr: 'Allée latérale en pierre naturelle',
      en: 'Natural stone side walkway',
    },
    caption: {
      fr: 'Un passage latéral en terre et en gravier, remplacé par une allée en pierre naturelle raccordée à la terrasse en pavé existante.',
      en: 'A bare earth-and-gravel side passage replaced by a natural stone walkway tied into the existing paver terrace.',
    },
    altBefore: {
      fr: 'Avant les travaux : passage latéral en terre battue et gravier, envahi de végétation, entre une maison et une haie.',
      en: 'Before the work: a bare earth and gravel side passage overgrown with vegetation, between a house and a hedge.',
    },
    altAfter: {
      fr: 'Après les travaux : allée en dalles de pierre naturelle posée entre la maison et la haie, raccordée à une terrasse en pavé.',
      en: 'After the work: a natural stone slab walkway laid between the house and the hedge, tied into a paver terrace.',
    },
    tags: ['pave-uni', 'amenagement-exterieur'],
    location: null,
    completedAt: null,
    duration: null,
    problem: null,
    solution: null,
    scope: null,
  },
];

export function projectById(id: string): Project | undefined {
  return projects.find((p) => p.id === id);
}

export function beforeAfterById(id: string): BeforeAfter | undefined {
  return beforeAfters.find((b) => b.id === id);
}

/**
 * Everything that gets a detail page: the standalone photographs plus the two
 * before/after transformations, which are the strongest proof on the site and
 * deserve a page each rather than only a slot in a slider.
 */
export type ProjectEntry =
  ({ kind: 'photo' } & Project) | ({ kind: 'before-after' } & BeforeAfter);

export const projectEntries: ProjectEntry[] = [
  ...beforeAfters.map((b) => ({ kind: 'before-after' as const, ...b })),
  ...projects.map((p) => ({ kind: 'photo' as const, ...p })),
];

export function projectEntryById(id: string): ProjectEntry | undefined {
  return projectEntries.find((entry) => entry.id === id);
}
