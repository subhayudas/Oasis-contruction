import type { Locale } from '@/lib/i18n';

type Copy = Record<Locale, string>;

export type Scene = {
  /** Image id in the generated manifest. */
  id: string;
  alt: Copy;
  /** A short line describing the technique shown — never a claim about a job. */
  caption: Copy;
};

/**
 * Illustrative photography generated for the site (OpenArt / GPT Image 2).
 *
 * These frames show the trades Oasis Construction performs and carry the site
 * everywhere outside the project galleries. They are NOT photographs of the
 * company's own work: every real jobsite photograph lives in `projects.ts` and
 * is shown only on the projects page and the "selected work" band, which are
 * the two places the site claims to be showing completed Oasis projects.
 *
 * Captions here therefore describe the technique in the frame, never a
 * particular project, client, or location.
 */
export const scenes: Scene[] = [
  {
    id: 'scene-entree-crepuscule',
    alt: {
      fr: 'Entrée résidentielle au crépuscule : stationnement en pavé uni, muret de blocs, marches de pierre et porte d’entrée éclairée.',
      en: 'Residential entrance at dusk: interlocking paver driveway, block retaining wall, stone steps and a lit front door.',
    },
    caption: {
      fr: 'Stationnement en pavé uni, muret de soutènement et marches — les trois ouvrages qui composent la plupart des entrées.',
      en: 'Paver driveway, retaining wall and steps — the three pieces that make up most entrances.',
    },
  },
  {
    id: 'scene-pave-uni-allee',
    alt: {
      fr: 'Stationnement en pavé uni posé en chevrons, avec une bordure de pavés perpendiculaires et un joint net contre la pelouse.',
      en: 'Interlocking paver driveway laid in a herringbone pattern with a soldier-course border and a clean edge against the lawn.',
    },
    caption: {
      fr: 'Pose en chevrons avec bordure périmétrique : le motif qui répartit le mieux la charge d’un véhicule.',
      en: 'Herringbone laid against a soldier course — the pattern that spreads a vehicle’s load best.',
    },
  },
  {
    id: 'scene-pave-uni-pose',
    alt: {
      fr: 'Mains gantées plaçant un pavé de béton sur un lit de sable nivelé, avec cordeau, règle d’aluminium et maillet de caoutchouc.',
      en: 'Gloved hands setting a concrete paver on a screeded sand bed, with a string line, an aluminium screed rail and a rubber mallet.',
    },
    caption: {
      fr: 'Le pavé se place sur un lit de sable réglé au cordeau, jamais directement sur le sol.',
      en: 'Pavers are set on a screeded sand bed run off a string line, never straight onto soil.',
    },
  },
  {
    id: 'scene-muret-talus',
    alt: {
      fr: 'Muret de blocs de béton texturé retenant une pelouse en pente le long d’une entrée, avec des marches de pierre à une extrémité.',
      en: 'Textured concrete block retaining wall holding a sloped lawn along a driveway, with stone steps at one end.',
    },
    caption: {
      fr: 'Un muret de blocs reprend la pente et libère la surface utile au-dessus comme en dessous.',
      en: 'A block wall takes up the grade and frees usable ground above and below it.',
    },
  },
  {
    id: 'scene-muret-assise',
    alt: {
      fr: 'Rang supérieur d’un muret de blocs vérifié au niveau, avec pierre de drainage et membrane géotextile visibles derrière le mur.',
      en: 'Top course of a block wall checked with a spirit level, drainage stone and geotextile fabric visible behind the wall.',
    },
    caption: {
      fr: 'Derrière un muret : pierre nette et membrane, pour que l’eau descende au lieu de pousser.',
      en: 'Behind a wall: clean stone and fabric, so water drains instead of pushing.',
    },
  },
  {
    id: 'scene-drainage-tranchee',
    alt: {
      fr: 'Tranchée de drainage ouverte le long d’une fondation de béton, avec membrane géotextile, drain perforé et pierre nette.',
      en: 'Open drainage trench along a concrete foundation, with geotextile fabric, perforated pipe and clean stone.',
    },
    caption: {
      fr: 'Une tranchée le long de la fondation : membrane, drain perforé, pierre nette, puis remblai.',
      en: 'A trench along the foundation: fabric, perforated pipe, clean stone, then backfill.',
    },
  },
  {
    id: 'scene-drainage-drain',
    alt: {
      fr: 'Drain perforé enveloppé de membrane géotextile et posé dans la pierre lavée, avec un puisard carré à fleur de la pelouse.',
      en: 'Perforated drain pipe wrapped in geotextile and bedded in washed stone, with a square catch basin flush with the lawn.',
    },
    caption: {
      fr: 'Le drain reste enveloppé et entouré de pierre : c’est ce qui l’empêche de se colmater.',
      en: 'The pipe stays wrapped and surrounded by stone — that is what keeps it from silting up.',
    },
  },
  {
    id: 'scene-nettoyage-allee',
    alt: {
      fr: 'Nettoyage à pression d’une allée en pavé : une ligne nette sépare la surface encrassée de la portion déjà lavée.',
      en: 'Pressure washing a paver driveway: a sharp line separates the grimy surface from the section already cleaned.',
    },
    caption: {
      fr: 'La ligne de démarcation montre ce que la surface avait perdu sous les dépôts.',
      en: 'The demarcation line shows what the surface had lost under the build-up.',
    },
  },
  {
    id: 'scene-nettoyage-jet',
    alt: {
      fr: 'Jet d’eau à haute pression en éventail sur des dalles de pierre, dégageant une bande propre entre les joints.',
      en: 'A high-pressure fan of water on stone slabs, opening a clean strip between the joints.',
    },
    caption: {
      fr: 'Un jet en éventail, tenu à bonne distance : assez pour décoller, pas assez pour creuser le joint.',
      en: 'A fan tip held at the right distance — enough to lift the grime, not enough to cut the joint.',
    },
  },
  {
    id: 'scene-equipe-chantier',
    alt: {
      fr: 'Deux ouvriers en dossard posent du pavé sur un chantier résidentiel, avec plaque vibrante, règles de nivellement et palettes de pavés.',
      en: 'Two workers in high-visibility vests laying pavers on a residential site, with a plate compactor, screed rails and pallets of pavers.',
    },
    caption: {
      fr: 'La moitié du travail se joue avant la pose : fondation, nivellement, compaction.',
      en: 'Half the work happens before the first paver: base, levelling, compaction.',
    },
  },
  {
    id: 'scene-terrasse-finie',
    alt: {
      fr: 'Terrasse arrière en dalles de béton de grand format, bordée d’un muret-banquette et d’une pelouse tondue, en fin de journée.',
      en: 'Backyard terrace of large-format concrete slabs, edged by a low seat wall and a mown lawn, late in the day.',
    },
    caption: {
      fr: 'Une surface de grand format demande une fondation plus régulière — c’est là que se joue la planéité.',
      en: 'Large-format surfaces need a flatter base — that is where the finished level is won or lost.',
    },
  },
  {
    id: 'scene-cordeau-sable',
    alt: {
      fr: 'Cordeau tendu entre deux piquets au-dessus d’un lit de sable fraîchement réglé, avec une règle d’aluminium et un maillet, à la tombée du jour.',
      en: 'A string line stretched between two pins over a freshly screeded sand bed, with an aluminium rail and a mallet, at dusk.',
    },
    caption: {
      fr: 'Le cordeau donne la ligne et le niveau. Tout ce qui suit s’aligne dessus.',
      en: 'The string line sets the line and the level. Everything after it follows.',
    },
  },
  {
    id: 'scene-releve-niveau',
    alt: {
      fr: 'Niveau laser sur trépied posé sur un stationnement en pavé affaissé, avec mire, ruban à mesurer et marques de peinture au sol.',
      en: 'A laser level on a tripod standing on a settled paver driveway, with a levelling rod, a tape measure and paint marks on the surface.',
    },
    caption: {
      fr: 'Avant de démonter quoi que ce soit : relever les niveaux et repérer où l’eau s’en va.',
      en: 'Before anything comes up: shoot the levels and find out where the water goes.',
    },
  },
  {
    id: 'scene-entree-pierre',
    alt: {
      fr: 'Allée en dalles de pierre naturelle irrégulières menant à une entrée couverte, bordée d’une plate-bande et d’un muret bas.',
      en: 'Walkway of irregular natural stone slabs leading to a covered entrance, edged by a planting bed and a low wall.',
    },
    caption: {
      fr: 'Pierre naturelle et bordure retenue : deux façons d’empêcher une allée de s’étaler avec les années.',
      en: 'Natural stone with a held edge — two ways of keeping a walkway from spreading over the years.',
    },
  },
];

export function sceneById(id: string): Scene | undefined {
  return scenes.find((scene) => scene.id === id);
}
