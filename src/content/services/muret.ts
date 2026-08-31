import type { Service } from './types';

export const muret: Service = {
  key: 'muret',
  hero: 'scene-muret-talus',
  detail: 'scene-muret-assise',
  related: ['drainage', 'pave-uni'],
  photoFirst: true,
  copy: {
    fr: {
      name: 'Muret / Mur de soutènement',
      short: 'Construction et réparation de murets, murs décoratifs et boîtes à fleurs.',
      material: 'Bloc de béton',
      eyebrow: 'Service',
      title: 'Muret et mur de soutènement : construction, réparation et entretien',
      lede: 'Un muret qui penche, qui fissure, ou qui s’effondre n’est pas qu’un problème esthétique. C’est un problème de sécurité. On construit et on répare des murets qui tiennent, avec une fondation solide et un drainage adéquat.',

      symptomsTitle: 'Ce que vous voyez',
      symptoms:
        'Votre muret penche? Des fissures apparaissent? Des blocs se déplacent? Le mur semble se pousser vers l’avant? Ce sont des signes que la fondation, le drainage, ou la pression du sol pose problème.',

      causesTitle: 'Ce qui cause le problème',
      causes: [
        'Un muret qui penche ou qui fissure est généralement causé par : un drainage insuffisant (la pression de l’eau pousse le mur), une fondation trop peu profonde, un sol instable, ou une hauteur de mur mal calculée par rapport à la base.',
        'Le mouvement est rarement uniforme. Une section descend, une autre reste en place, et les blocs finissent par ne plus s’appuyer les uns sur les autres comme ils le devraient. C’est à ce moment-là qu’un muret passe d’un problème d’apparence à un problème de sécurité.',
      ],

      solutionTitle: 'Ce qu’on fait',
      solution: [
        'On évalue la cause du mouvement. Si c’est un drainage, on le corrige. Si c’est la fondation, on reconstruit avec une base plus solide.',
        'On ne se contente pas de redresser le mur - on règle le problème qui cause le mouvement. Un muret redressé sur une fondation qui n’a pas changé va repencher.',
      ],

      includesTitle: 'Ce que les travaux peuvent comprendre',
      includes: [
        'Démontage de la section touchée',
        'Excavation et reprise de la fondation',
        'Installation ou correction du drainage derrière le mur',
        'Pierre nette et membrane géotextile',
        'Remontage des blocs, alignés et de niveau',
        'Reprise du couronnement',
        'Remblai, nivellement et nettoyage',
      ],

      surfacesTitle: 'Types d’ouvrages',
      surfaces: [
        'Murs de soutènement',
        'Murets décoratifs',
        'Muret-banquette',
        'Boîtes à fleurs et plates-bandes surélevées',
        'Murets le long d’une entrée',
      ],

      note: 'La hauteur d’un mur change ce qu’il doit supporter. Au-delà d’une certaine hauteur, ou en présence d’une charge à l’arrière (une entrée, un stationnement), un muret peut relever de l’ingénierie plutôt que de la maçonnerie seule. On vous le dit à l’évaluation plutôt qu’en cours de chantier.',

      localTitle: 'À Laval et sur la Rive-Nord',
      local:
        'Beaucoup de terrains de la Rive-Nord sont en pente et retenus par un muret de blocs monté il y a quinze ou vingt ans. Le gel, l’eau et la pression de la terre finissent par avoir raison de la fondation. C’est un des travaux qu’on reprend le plus souvent dans le secteur.',

      process: [
        {
          step: '01',
          title: 'Évaluation',
          text: 'On regarde le muret, la pente, l’écoulement de l’eau, et on identifie la cause du mouvement.',
        },
        {
          step: '02',
          title: 'Excavation',
          text: 'On démonte la section affectée pour voir ce qu’il y a derrière et dessous.',
        },
        {
          step: '03',
          title: 'Fondation',
          text: 'On prépare ou on renforce la base : c’est elle qui décide de la durée de vie du mur.',
        },
        {
          step: '04',
          title: 'Drainage',
          text: 'On installe ou on corrige le drainage : pierre nette et membrane, pour que l’eau descende au lieu de pousser.',
        },
        {
          step: '05',
          title: 'Reconstruction',
          text: 'On reconstruit le muret, on nivelle, on aligne et on fixe le couronnement.',
        },
        {
          step: '06',
          title: 'Finition',
          text: 'On remblaie, on nettoie, on vérifie, et on garantit le résultat.',
        },
      ],

      priceTitle: 'Ce qui influence le prix',
      priceLede: 'Le coût d’un muret dépend de plusieurs facteurs :',
      priceFactors: [
        'La longueur et la hauteur du muret',
        'Le type de matériaux (blocs, pierre naturelle)',
        'L’état de la fondation existante',
        'Le travail de drainage nécessaire',
        'L’accès au site pour la machinerie et les matériaux',
        'S’il s’agit d’une réparation ou d’une nouvelle construction',
      ],
      priceNote:
        'Évaluation gratuite sur place pour un devis précis. On ne peut pas chiffrer un muret sans voir ce qu’il retient.',

      faqTitle: 'Questions fréquentes',
      faq: [
        {
          q: 'Mon muret penche. Est-ce que je dois le remplacer?',
          a: 'Pas nécessairement. Si la cause est le drainage, on peut souvent corriger le drainage et redresser le muret. Si la fondation est le problème, une reconstruction partielle peut être nécessaire. On vous dira ce qu’on voit après l’évaluation.',
        },
        {
          q: 'Quelle hauteur de muret sans permis?',
          a: 'La hauteur permise sans permis varie d’une municipalité à l’autre sur la Rive-Nord, et les règles diffèrent selon que le muret est en cour avant, en cour arrière ou près d’une limite de terrain. Avant de commencer, vérifiez auprès de votre ville : c’est elle qui a la réponse qui compte. On peut vous indiquer ce qui est généralement demandé pour le type de mur que vous envisagez.',
        },
        {
          q: 'Pourquoi mettre de la pierre derrière un mur?',
          a: 'Parce que ce n’est pas la terre qui pousse le plus fort sur un muret : c’est l’eau retenue dedans. Une couche de pierre nette enveloppée d’une membrane laisse l’eau descendre et sortir au pied du mur, au lieu de s’accumuler derrière et de geler. C’est la partie du mur qu’on ne voit jamais et qui décide s’il tient.',
        },
        {
          q: 'Est-ce qu’on peut réparer seulement la section qui bouge?',
          a: 'Souvent oui, si le reste du mur est stable et bien drainé. On démonte la section touchée, on reprend la fondation et le drainage sous celle-ci, et on remonte. Si le drainage manque sur toute la longueur, une reprise partielle ne réglera rien à long terme.',
        },
      ],

      warrantyTitle: 'Garantie',
      warranty: '{warrantyTerms}',

      metaTitle: 'Muret et mur de soutènement Laval | Oasis Construction',
      metaDescription:
        'Construction et réparation de murets et murs de soutènement à Laval et sur la Rive-Nord. Évaluation gratuite. Appelez (438) 505-4846.',
    },

    en: {
      name: 'Retaining walls',
      short: 'Building and repairing retaining walls, decorative walls and planters.',
      material: 'Concrete block',
      eyebrow: 'Service',
      title: 'Retaining walls: building, repair and upkeep',
      lede: 'A wall that leans, cracks or gives way is not just a cosmetic problem. It is a safety problem. We build and repair walls that hold, on a proper footing with proper drainage.',

      symptomsTitle: 'What you are seeing',
      symptoms:
        'Is your wall leaning? Are cracks appearing? Are blocks shifting out of line? Does the wall look like it is being pushed forward? Those are signs that the footing, the drainage, or soil pressure is the problem.',

      causesTitle: 'What causes it',
      causes: [
        'A wall that leans or cracks is usually caused by insufficient drainage (water pressure pushing the wall), a footing that is too shallow, unstable soil, or a wall height that the base was never built for.',
        'The movement is rarely even. One section drops, another stays put, and the blocks stop bearing on each other the way they should. That is the point where a wall goes from a looks problem to a safety problem.',
      ],

      solutionTitle: 'What we do',
      solution: [
        'We work out what is causing the movement. If it is drainage, we correct the drainage. If it is the footing, we rebuild on a stronger base.',
        'We do not simply straighten the wall - we fix what is moving it. A wall straightened over an unchanged footing will lean again.',
      ],

      includesTitle: 'What the work can include',
      includes: [
        'Dismantling the affected section',
        'Excavating and rebuilding the footing',
        'Installing or correcting drainage behind the wall',
        'Clean stone and geotextile fabric',
        'Resetting the blocks, aligned and level',
        'Resetting the cap course',
        'Backfill, grading and clean-up',
      ],

      surfacesTitle: 'Types of wall',
      surfaces: [
        'Retaining walls',
        'Decorative walls',
        'Seat walls',
        'Planters and raised beds',
        'Walls along a driveway',
      ],

      note: 'Height changes what a wall has to carry. Past a certain height, or with a load behind it such as a driveway, a wall becomes an engineering question rather than a masonry one. We tell you that at the assessment rather than partway through the job.',

      localTitle: 'In Laval and the North Shore',
      local:
        'A lot of North Shore lots are sloped and held by a block wall built fifteen or twenty years ago. Frost, water and soil pressure eventually get the better of the footing. It is one of the jobs we redo most often in the area.',

      process: [
        {
          step: '01',
          title: 'Assessment',
          text: 'We look at the wall, the grade and where water goes, and identify what is causing the movement.',
        },
        {
          step: '02',
          title: 'Excavation',
          text: 'We take down the affected section to see what is behind and beneath it.',
        },
        {
          step: '03',
          title: 'Footing',
          text: 'We prepare or reinforce the base - it decides how long the wall lasts.',
        },
        {
          step: '04',
          title: 'Drainage',
          text: 'We install or correct the drainage: clean stone and fabric, so water drains instead of pushing.',
        },
        {
          step: '05',
          title: 'Rebuild',
          text: 'We rebuild the wall, level and aligned, and set the cap course.',
        },
        {
          step: '06',
          title: 'Finish',
          text: 'We backfill, clean up, check the work and stand behind it.',
        },
      ],

      priceTitle: 'What affects the price',
      priceLede: 'The cost of a wall depends on several things:',
      priceFactors: [
        'The length and height of the wall',
        'The material (block, natural stone)',
        'The condition of the existing footing',
        'How much drainage work is needed',
        'Access for machinery and materials',
        'Whether it is a repair or a new build',
      ],
      priceNote:
        'Free on-site assessment for an accurate quote. A wall cannot be priced without seeing what it is holding back.',

      faqTitle: 'Frequently asked questions',
      faq: [
        {
          q: 'My wall is leaning. Do I have to replace it?',
          a: 'Not necessarily. If drainage is the cause, we can often correct the drainage and reset the wall. If the footing is the problem, a partial rebuild may be needed. We will tell you what we see after the assessment.',
        },
        {
          q: 'How high can a wall be without a permit?',
          a: 'The height allowed without a permit varies from one North Shore municipality to the next, and the rules differ depending on whether the wall is in the front yard, the back yard, or near a property line. Check with your city before starting - theirs is the answer that counts. We can tell you what is usually asked for the kind of wall you have in mind.',
        },
        {
          q: 'Why put stone behind a wall?',
          a: 'Because soil is not what pushes hardest on a retaining wall - the water held in it is. A layer of clean stone wrapped in fabric lets water drop and exit at the base of the wall instead of collecting behind it and freezing. It is the part of the wall nobody ever sees, and it decides whether the wall holds.',
        },
        {
          q: 'Can you repair only the section that is moving?',
          a: 'Often yes, if the rest of the wall is stable and draining properly. We take down the affected section, redo the footing and drainage under it, and rebuild. If drainage is missing along the whole length, a partial repair will not solve anything long term.',
        },
      ],

      warrantyTitle: 'Warranty',
      warranty: '{warrantyTerms}',

      metaTitle: 'Retaining walls Laval - Repair and building | Oasis',
      metaDescription:
        'Retaining wall construction and repair in Laval and the North Shore. Free assessment. Call (438) 505-4846.',
    },
  },
};
