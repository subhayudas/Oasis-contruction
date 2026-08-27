import type { Locale } from '@/lib/i18n';
import type { ServiceKey } from '@/lib/routes';

export type ServiceCopy = {
  /** Short label used in navigation and tiles. */
  name: string;
  /** One or two lines for the overview tile. */
  short: string;
  /** Material word shown on the service card's sample chip. */
  material: string;
  eyebrow: string;
  title: string;
  lede: string;
  problemTitle: string;
  problem: string[];
  approachTitle: string;
  approach: string[];
  includesTitle: string;
  includes: string[];
  surfacesTitle: string;
  surfaces: string[];
  /** An honest limit on what the service can promise. Always shown. */
  note: string;
  localTitle: string;
  local: string;
  process: { step: string; title: string; text: string }[];
  metaTitle: string;
  metaDescription: string;
};

export type Service = {
  key: ServiceKey;
  /** Scene ids from `imagery.ts` — illustrative, not jobsite photographs. */
  hero: string;
  detail: string;
  /** Technical drawing shown instead of a photograph where none is authentic. */
  diagram?: 'base' | 'drainage';
  related: ServiceKey[];
  copy: Record<Locale, ServiceCopy>;
};

export const services: Service[] = [
  {
    key: 'pave-uni',
    hero: 'scene-pave-uni-allee',
    detail: 'scene-pave-uni-pose',
    diagram: 'base',
    related: ['muret', 'drainage'],
    copy: {
      fr: {
        name: 'Réparation de pavé uni',
        short:
          'Pavé affaissé, déplacé ou inégal : correction de la fondation, remise à niveau et nouveau sable polymère.',
        material: 'Pavé de béton',
        eyebrow: 'Service',
        title: 'Réparation de pavé uni',
        lede: 'Un pavé qui s’affaisse ou qui se déplace, c’est presque toujours la fondation qui parle. On corrige ce qu’il y a dessous avant de replacer ce qui se voit.',
        problemTitle: 'Ce qui se passe',
        problem: [
          'Avec les cycles de gel et de dégel, l’eau qui circule mal et une fondation qui se compacte inégalement, un pavé uni finit par bouger. Des creux se forment près des descentes de gouttière, les joints se vident, une bordure se soulève, une marche n’est plus de niveau.',
          'La surface devient inégale, parfois inconfortable à marcher, et l’eau commence à s’accumuler aux mauvais endroits — ce qui accélère le mouvement.',
        ],
        approachTitle: 'Notre approche',
        approach: [
          'On regarde d’abord la cause du mouvement plutôt que le mouvement lui-même : la fondation, la pente, l’écoulement de l’eau, l’état des bordures.',
          'Les travaux ciblent ensuite les zones problématiques pour prolonger la durée de vie de l’aménagement, sans tout remplacer quand ce n’est pas nécessaire.',
        ],
        includesTitle: 'Ce que les travaux peuvent comprendre',
        includes: [
          'Retrait des pavés dans les sections touchées',
          'Correction et compactage de la fondation',
          'Remise à niveau des surfaces',
          'Réinstallation des pavés selon le motif d’origine',
          'Reprise ou remplacement des bordures',
          'Application de nouveau sable polymère',
        ],
        surfacesTitle: 'Surfaces visées',
        surfaces: [
          'Stationnements',
          'Entrées',
          'Trottoirs et allées',
          'Paliers et marches',
          'Terrasses',
        ],
        note: 'Selon l’état de la fondation et l’étendue des dommages, certaines surfaces demandent une réfection plus large qu’une réparation ponctuelle. On vous le dit dès la visite, avant de commencer.',
        localTitle: 'À Laval et sur la Rive-Nord',
        local:
          'Les hivers d’ici sont durs sur le pavé uni : le gel soulève, le dégel affaisse, et le sel finit par vider les joints. C’est le genre de travaux qu’on réalise régulièrement à Laval et sur la Rive-Nord, sur des entrées, des trottoirs et des terrasses résidentielles.',
        process: [
          {
            step: '01',
            title: 'Comprendre',
            text: 'On regarde la surface, les pentes et les points d’accumulation d’eau, et on discute de ce que vous voulez corriger.',
          },
          {
            step: '02',
            title: 'Préparer',
            text: 'Les pavés des zones touchées sont retirés et numérotés au besoin, puis la fondation est corrigée et compactée.',
          },
          {
            step: '03',
            title: 'Réaliser',
            text: 'Les pavés sont remis en place selon le motif d’origine, alignés sur les surfaces adjacentes.',
          },
          {
            step: '04',
            title: 'Finaliser',
            text: 'Nivellement final, nouveau sable polymère dans les joints, et nettoyage du chantier.',
          },
        ],
        metaTitle: 'Réparation de pavé uni à Laval et sur la Rive-Nord',
        metaDescription:
          'Réparation et remise à niveau de pavé uni affaissé, déplacé ou inégal : correction de la fondation, réinstallation des pavés et nouveau sable polymère. Laval et Rive-Nord.',
      },
      en: {
        name: 'Interlocking paver repair',
        short:
          'Sunken, shifted or uneven pavers: base correction, re-levelling and fresh polymeric sand.',
        material: 'Concrete paver',
        eyebrow: 'Service',
        title: 'Interlocking paver repair',
        lede: 'When pavers sink or shift, the base is usually the one talking. We correct what sits underneath before putting back what you see.',
        problemTitle: 'What happens',
        problem: [
          'Between freeze-thaw cycles, water that drains poorly and a base that settles unevenly, interlocking pavers eventually move. Dips form near downspouts, joints empty out, an edge lifts, a step is no longer level.',
          'The surface turns uneven, sometimes awkward to walk on, and water starts pooling in the wrong places — which speeds the movement up.',
        ],
        approachTitle: 'How we work',
        approach: [
          'We look at the cause of the movement before the movement itself: the base, the slope, how water leaves the surface, the condition of the edge restraints.',
          'The work then targets the problem areas to extend the life of the installation, without replacing everything when that is not warranted.',
        ],
        includesTitle: 'What the work can include',
        includes: [
          'Lifting the pavers in the affected sections',
          'Correcting and compacting the base',
          'Re-levelling the surface',
          'Reinstalling the pavers in the original pattern',
          'Resetting or replacing edge restraints',
          'Applying new polymeric sand',
        ],
        surfacesTitle: 'Suitable surfaces',
        surfaces: ['Driveways', 'Entrances', 'Walkways', 'Landings and steps', 'Patios'],
        note: 'Depending on the condition of the base and how far the damage extends, some surfaces need a broader rebuild rather than a spot repair. We tell you that at the visit, before anything starts.',
        localTitle: 'In Laval and the North Shore',
        local:
          'Winters here are hard on interlocking pavers: frost lifts them, thaw settles them, and road salt slowly empties the joints. This is work we carry out regularly across Laval and the North Shore, on residential driveways, walkways and patios.',
        process: [
          {
            step: '01',
            title: 'Understand',
            text: 'We look at the surface, the slopes and where water collects, and talk through what you want corrected.',
          },
          {
            step: '02',
            title: 'Prepare',
            text: 'Pavers in the affected areas are lifted and mapped where needed, then the base is corrected and compacted.',
          },
          {
            step: '03',
            title: 'Build',
            text: 'The pavers go back in the original pattern, aligned with the surfaces around them.',
          },
          {
            step: '04',
            title: 'Finish',
            text: 'Final levelling, fresh polymeric sand in the joints, and the site left clean.',
          },
        ],
        metaTitle: 'Interlocking paver repair in Laval and the North Shore',
        metaDescription:
          'Repair and re-levelling of sunken, shifted or uneven interlocking pavers: base correction, paver reinstallation and new polymeric sand. Laval and the North Shore.',
      },
    },
  },
  {
    key: 'muret',
    hero: 'scene-muret-talus',
    detail: 'scene-muret-assise',
    related: ['drainage', 'pave-uni'],
    copy: {
      fr: {
        name: 'Réparation de muret',
        short:
          'Muret affaissé ou incliné : démontage, reprise de la fondation et du drainage, remise à niveau des blocs.',
        material: 'Bloc de béton',
        eyebrow: 'Service',
        title: 'Réparation de muret',
        lede: 'Un muret qui penche retient encore de la terre, mais plus pour longtemps. On le reprend à la base pour lui redonner sa stabilité.',
        problemTitle: 'Ce qui se passe',
        problem: [
          'Un muret retient une pression constante : la terre derrière, l’eau qui s’y accumule, et le gel qui pousse. Quand la fondation cède ou que le drainage ne fait plus son travail, les rangs se décalent, le muret bombe ou s’incline vers l’avant.',
          'Le mouvement est rarement uniforme. Une section descend, une autre reste en place, et les blocs finissent par ne plus s’appuyer les uns sur les autres comme ils le devraient.',
        ],
        approachTitle: 'Notre approche',
        approach: [
          'On démonte la section touchée pour voir ce qui se passe derrière et dessous : fondation, pierre nette, membrane, écoulement de l’eau.',
          'La réparation vise à restaurer la stabilité du muret, son apparence et sa durabilité — pas seulement à replacer les blocs visibles.',
        ],
        includesTitle: 'Ce que les travaux peuvent comprendre',
        includes: [
          'Démontage des blocs existants',
          'Correction et compactage de la fondation',
          'Ajustement du drainage derrière le muret',
          'Réinstallation et mise à niveau des blocs',
          'Reprise des rangs et des joints',
        ],
        surfacesTitle: 'Situations visées',
        surfaces: [
          'Murets de soutènement',
          'Murets d’aménagement paysager',
          'Bordures de stationnement',
          'Murets d’escalier et de palier',
          'Plates-bandes surélevées',
        ],
        note: 'Certains murets ont bougé au point qu’une reconstruction complète de la section coûte moins cher et tient mieux qu’une réparation. On évalue les deux options avec vous.',
        localTitle: 'À Laval et sur la Rive-Nord',
        local:
          'Beaucoup de terrains de Laval et de la Rive-Nord sont en pente ou en paliers, et les murets y travaillent fort. Le gel et l’eau de ruissellement sont presque toujours dans le portrait quand un muret commence à bouger.',
        process: [
          {
            step: '01',
            title: 'Comprendre',
            text: 'On évalue l’ampleur du mouvement, la hauteur du muret et ce qu’il retient réellement.',
          },
          {
            step: '02',
            title: 'Préparer',
            text: 'La section touchée est démontée, la fondation corrigée et compactée, le drainage ajusté.',
          },
          {
            step: '03',
            title: 'Réaliser',
            text: 'Les blocs sont réinstallés rang par rang, mis à niveau et alignés sur les sections conservées.',
          },
          {
            step: '04',
            title: 'Finaliser',
            text: 'Remblai, finition du dessus du muret et nettoyage des abords.',
          },
        ],
        metaTitle: 'Réparation de muret à Laval et sur la Rive-Nord',
        metaDescription:
          'Réparation de murets affaissés, déplacés ou inclinés : démontage des blocs, correction de la fondation, ajustement du drainage et remise à niveau. Laval et Rive-Nord.',
      },
      en: {
        name: 'Retaining wall repair',
        short:
          'Leaning or sunken walls: dismantling, base and drainage correction, blocks reset to level.',
        material: 'Concrete block',
        eyebrow: 'Service',
        title: 'Retaining wall repair',
        lede: 'A leaning wall is still holding back soil — just not for much longer. We take it back to the base and give it its stability back.',
        problemTitle: 'What happens',
        problem: [
          'A retaining wall carries constant pressure: the soil behind it, the water that collects there, and frost pushing outward. When the base gives way or the drainage stops doing its job, courses shift out of line and the wall bulges or leans forward.',
          'The movement is rarely even. One section drops, another stays put, and the blocks stop bearing on each other the way they should.',
        ],
        approachTitle: 'How we work',
        approach: [
          'We take the affected section apart to see what is happening behind and beneath it: base, clear stone, membrane, and how water moves through.',
          'The repair aims to restore the wall’s stability, appearance and durability — not simply to put the visible blocks back.',
        ],
        includesTitle: 'What the work can include',
        includes: [
          'Dismantling the existing blocks',
          'Correcting and compacting the base',
          'Adjusting the drainage behind the wall',
          'Reinstalling and levelling the blocks',
          'Resetting courses and joints',
        ],
        surfacesTitle: 'Suitable situations',
        surfaces: [
          'Retaining walls',
          'Landscape walls',
          'Driveway edges',
          'Stair and landing walls',
          'Raised planting beds',
        ],
        note: 'Some walls have moved far enough that rebuilding the section outright costs less and lasts longer than repairing it. We weigh both options with you.',
        localTitle: 'In Laval and the North Shore',
        local:
          'A lot of Laval and North Shore lots are sloped or terraced, and their walls work hard. Frost and surface run-off are almost always part of the picture when a wall starts to move.',
        process: [
          {
            step: '01',
            title: 'Understand',
            text: 'We assess how far the wall has moved, how tall it is, and what it is actually holding back.',
          },
          {
            step: '02',
            title: 'Prepare',
            text: 'The affected section comes apart, the base is corrected and compacted, the drainage adjusted.',
          },
          {
            step: '03',
            title: 'Build',
            text: 'Blocks go back course by course, set level and aligned with the sections left in place.',
          },
          {
            step: '04',
            title: 'Finish',
            text: 'Backfill, cap the wall, and clean up the surrounding ground.',
          },
        ],
        metaTitle: 'Retaining wall repair in Laval and the North Shore',
        metaDescription:
          'Repair of sunken, shifted or leaning retaining walls: dismantling blocks, correcting the base, adjusting drainage and resetting to level. Laval and the North Shore.',
      },
    },
  },
  {
    key: 'nettoyage-pression',
    hero: 'scene-nettoyage-allee',
    detail: 'scene-nettoyage-jet',
    related: ['pave-uni', 'muret'],
    copy: {
      fr: {
        name: 'Nettoyage à pression',
        short:
          'Pavé, dalles, murets et marches : retrait de la saleté accumulée, des taches et des dépôts.',
        material: 'Pierre et béton',
        eyebrow: 'Service',
        title: 'Nettoyage à pression',
        lede: 'La plupart des surfaces extérieures ne sont pas usées : elles sont sales. Un nettoyage à pression bien fait leur redonne beaucoup.',
        problemTitle: 'Ce qui se passe',
        problem: [
          'Une surface extérieure accumule de tout : poussière, terre, mousse, sel de déglaçage, résidus de feuilles, traces de rouille ou de pot de fleurs. La couleur du pavé disparaît graduellement sous une couche grise qu’on finit par ne plus voir.',
          'Les joints et les zones ombragées sont souvent les premiers à noircir, surtout du côté nord d’une maison.',
        ],
        approachTitle: 'Notre approche',
        approach: [
          'On ajuste la pression et la méthode au matériau : un pavé de béton, une dalle de pierre naturelle et un muret ne se nettoient pas de la même façon.',
          'L’objectif est de retirer ce qui s’est accumulé sans abîmer la surface ni vider les joints inutilement.',
        ],
        includesTitle: 'Ce que les travaux peuvent comprendre',
        includes: [
          'Nettoyage à pression des surfaces de pavé uni et de dalles',
          'Nettoyage des murets, des marches et des bordures',
          'Nettoyage des surfaces de béton',
          'Retrait de la saleté accumulée, des dépôts et des taches de surface',
        ],
        surfacesTitle: 'Surfaces visées',
        surfaces: [
          'Pavé uni',
          'Dalles et pierre naturelle',
          'Murets',
          'Marches et paliers',
          'Autres surfaces de béton',
        ],
        note: 'Toutes les taches ne partent pas. Certaines sont incrustées dans le béton — rouille, huile, décoloration profonde — et un nettoyage ne les retirera pas complètement. On vous le dit avant de commencer plutôt qu’après.',
        localTitle: 'À Laval et sur la Rive-Nord',
        local:
          'Après un hiver de sel et d’abrasif, la plupart des entrées de Laval et de la Rive-Nord ont besoin d’un bon nettoyage au printemps. C’est aussi le meilleur moment pour voir l’état réel du pavé et des joints avant d’envisager une réparation.',
        process: [
          {
            step: '01',
            title: 'Comprendre',
            text: 'On identifie les matériaux et l’état des joints, et on regarde ce qu’il est réaliste de retirer.',
          },
          {
            step: '02',
            title: 'Préparer',
            text: 'Les abords sont dégagés et protégés, et la pression est ajustée au matériau.',
          },
          {
            step: '03',
            title: 'Réaliser',
            text: 'La surface est nettoyée section par section, de façon uniforme, sans zones marquées.',
          },
          {
            step: '04',
            title: 'Finaliser',
            text: 'Rinçage, ramassage des résidus et remise en ordre des lieux.',
          },
        ],
        metaTitle: 'Nettoyage à pression de pavé et de béton — Laval et Rive-Nord',
        metaDescription:
          'Nettoyage à pression professionnel de pavé uni, de dalles, de murets, de marches et de surfaces de béton. Retrait de la saleté accumulée et des dépôts. Laval et Rive-Nord.',
      },
      en: {
        name: 'Pressure washing',
        short:
          'Pavers, slabs, walls and steps: built-up dirt, stains and deposits taken back off.',
        material: 'Stone and concrete',
        eyebrow: 'Service',
        title: 'Pressure washing',
        lede: 'Most outdoor surfaces are not worn out — they are dirty. A properly done pressure wash gives a great deal back.',
        problemTitle: 'What happens',
        problem: [
          'An outdoor surface collects everything: dust, soil, moss, de-icing salt, leaf residue, rust marks, planter rings. The colour of the paver slowly disappears under a grey film you eventually stop noticing.',
          'Joints and shaded areas usually darken first, especially on the north side of a house.',
        ],
        approachTitle: 'How we work',
        approach: [
          'Pressure and method are matched to the material: a concrete paver, a natural stone slab and a block wall do not get cleaned the same way.',
          'The goal is to lift what has built up without damaging the surface or needlessly emptying the joints.',
        ],
        includesTitle: 'What the work can include',
        includes: [
          'Pressure washing paver and slab surfaces',
          'Cleaning walls, steps and edge courses',
          'Cleaning concrete surfaces',
          'Removing built-up dirt, deposits and surface staining',
        ],
        surfacesTitle: 'Suitable surfaces',
        surfaces: [
          'Interlocking pavers',
          'Slabs and natural stone',
          'Retaining walls',
          'Steps and landings',
          'Other concrete surfaces',
        ],
        note: 'Not every stain comes out. Some are embedded in the concrete — rust, oil, deep discolouration — and washing will not remove them completely. We say so before starting rather than after.',
        localTitle: 'In Laval and the North Shore',
        local:
          'After a winter of salt and grit, most Laval and North Shore driveways want a proper spring wash. It is also the best moment to see the true condition of the pavers and joints before deciding on any repair.',
        process: [
          {
            step: '01',
            title: 'Understand',
            text: 'We identify the materials and the state of the joints, and look at what is realistic to remove.',
          },
          {
            step: '02',
            title: 'Prepare',
            text: 'The surroundings are cleared and protected, and pressure is matched to the material.',
          },
          {
            step: '03',
            title: 'Build',
            text: 'The surface is cleaned section by section, evenly, with no banding left behind.',
          },
          {
            step: '04',
            title: 'Finish',
            text: 'Rinse down, collect the residue and put the site back in order.',
          },
        ],
        metaTitle: 'Paver and concrete pressure washing — Laval and the North Shore',
        metaDescription:
          'Professional pressure washing of interlocking pavers, slabs, retaining walls, steps and concrete surfaces. Built-up dirt and deposits removed. Laval and the North Shore.',
      },
    },
  },
  {
    key: 'drainage',
    hero: 'scene-drainage-tranchee',
    detail: 'scene-drainage-drain',
    diagram: 'drainage',
    related: ['pave-uni', 'muret'],
    copy: {
      fr: {
        name: 'Drainage',
        short:
          'Accumulations d’eau et érosion : installation ou modification du drainage, correction des pentes.',
        material: 'Pierre nette',
        eyebrow: 'Service',
        title: 'Drainage',
        lede: 'L’eau finit toujours par trouver un chemin. Le travail consiste à lui en donner un bon avant qu’elle en choisisse un mauvais.',
        problemTitle: 'Ce qui se passe',
        problem: [
          'Une mauvaise gestion de l’eau entraîne des accumulations sur les surfaces, de l’érosion dans les plates-bandes et des dommages aux aménagements. Une flaque qui revient toujours au même endroit après la pluie, c’est un signe.',
          'À long terme, l’eau qui stagne sous une surface finit par affaisser le pavé, pousser un muret ou creuser un talus.',
        ],
        approachTitle: 'Notre approche',
        approach: [
          'On observe le terrain là où l’eau arrive, où elle passe et où elle s’arrête : pentes, descentes de gouttière, points bas, sortie du terrain.',
          'La solution est adaptée à la problématique et au terrain, pas appliquée de la même façon partout.',
        ],
        includesTitle: 'Ce que les travaux peuvent comprendre',
        includes: [
          'Installation de systèmes de drainage',
          'Modification d’un drainage existant',
          'Correction des pentes du terrain',
          'Reprise de l’écoulement autour des surfaces pavées',
          'Ajustement du drainage derrière un muret',
        ],
        surfacesTitle: 'Situations visées',
        surfaces: [
          'Accumulations d’eau sur une surface pavée',
          'Érosion dans les plates-bandes et les talus',
          'Eau qui stagne au bas d’une pente',
          'Descentes de gouttière mal dirigées',
          'Murets qui poussent vers l’avant',
        ],
        note: 'Nos travaux de drainage sont des travaux d’aménagement extérieur. Oasis Construction n’est pas une firme d’ingénierie : lorsque la structure ou les fondations du bâtiment sont en cause, un professionnel du domaine doit être consulté.',
        localTitle: 'À Laval et sur la Rive-Nord',
        local:
          'Les terrains argileux et les redoux d’hiver rendent le drainage particulièrement important dans la région. Une entrée qui gèle en plaque ou un muret qui bombe cachent souvent un problème d’eau plutôt qu’un problème de matériau.',
        process: [
          {
            step: '01',
            title: 'Comprendre',
            text: 'On suit le parcours de l’eau sur le terrain et on identifie les points d’accumulation.',
          },
          {
            step: '02',
            title: 'Préparer',
            text: 'Excavation des sections visées, préparation du lit et vérification des pentes.',
          },
          {
            step: '03',
            title: 'Réaliser',
            text: 'Installation ou modification du drainage et correction des pentes vers une sortie appropriée.',
          },
          {
            step: '04',
            title: 'Finaliser',
            text: 'Remblai, remise en état des surfaces touchées et nettoyage du chantier.',
          },
        ],
        metaTitle: 'Drainage de terrain à Laval et sur la Rive-Nord',
        metaDescription:
          'Solutions de drainage extérieur adaptées à votre terrain : installation ou modification de systèmes de drainage et correction des pentes. Laval et Rive-Nord.',
      },
      en: {
        name: 'Drainage',
        short:
          'Pooling and erosion: drainage installed or modified, grades and slopes corrected.',
        material: 'Clear stone',
        eyebrow: 'Service',
        title: 'Drainage',
        lede: 'Water always finds a way through. The work is giving it a good one before it picks a bad one.',
        problemTitle: 'What happens',
        problem: [
          'Poor water management leads to pooling on surfaces, erosion in planting beds and damage to the landscaping. A puddle that keeps coming back to the same spot after rain is telling you something.',
          'Over time, water sitting under a surface settles pavers, pushes on walls and cuts channels into a slope.',
        ],
        approachTitle: 'How we work',
        approach: [
          'We read the property where water arrives, where it travels and where it stops: slopes, downspouts, low points, and where it leaves the lot.',
          'The solution is matched to the problem and the ground, not applied the same way everywhere.',
        ],
        includesTitle: 'What the work can include',
        includes: [
          'Installing drainage systems',
          'Modifying existing drainage',
          'Correcting grades and slopes',
          'Reworking run-off around paved surfaces',
          'Adjusting drainage behind a retaining wall',
        ],
        surfacesTitle: 'Suitable situations',
        surfaces: [
          'Water pooling on a paved surface',
          'Erosion in beds and on slopes',
          'Standing water at the bottom of a grade',
          'Downspouts discharging in the wrong place',
          'Retaining walls pushing forward',
        ],
        note: 'Our drainage work is landscaping work. Oasis Construction is not an engineering firm: where the building’s structure or foundation is involved, a qualified professional in that field should be consulted.',
        localTitle: 'In Laval and the North Shore',
        local:
          'Clay soils and mid-winter thaws make drainage particularly important around here. A driveway that ices over in sheets, or a wall that bulges, usually hides a water problem rather than a material one.',
        process: [
          {
            step: '01',
            title: 'Understand',
            text: 'We follow the path water takes across the property and pin down where it collects.',
          },
          {
            step: '02',
            title: 'Prepare',
            text: 'Excavate the sections concerned, prepare the bed and check the slopes.',
          },
          {
            step: '03',
            title: 'Build',
            text: 'Install or modify the drainage and correct grades toward an appropriate outlet.',
          },
          {
            step: '04',
            title: 'Finish',
            text: 'Backfill, restore the surfaces that were opened up, and leave the site clean.',
          },
        ],
        metaTitle: 'Property drainage in Laval and the North Shore',
        metaDescription:
          'Outdoor drainage solutions matched to your property: drainage systems installed or modified and slopes corrected. Laval and the North Shore.',
      },
    },
  },
];

export function serviceByKey(key: ServiceKey): Service {
  const found = services.find((s) => s.key === key);
  if (!found) throw new Error(`Unknown service "${key}"`);
  return found;
}
