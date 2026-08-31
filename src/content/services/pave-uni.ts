import type { Service } from './types';

export const paveUni: Service = {
  key: 'pave-uni',
  hero: 'scene-pave-uni-allee',
  detail: 'scene-pave-uni-pose',
  diagram: 'base',
  related: ['muret', 'drainage'],
  photoFirst: true,
  copy: {
    fr: {
      name: 'Pavé uni',
      short:
        'Installation et réparation de pavé uni. Entrées, terrasses, trottoirs. Conçu pour les hivers québécois.',
      material: 'Pavé de béton',
      eyebrow: 'Service',
      title: 'Pavé uni : installation, réparation et entretien à Laval et sur la Rive-Nord',
      lede: 'Que vous ayez besoin d’une nouvelle entrée en pavé uni, d’une terrasse, ou d’une réparation de pavé qui s’affaisse, on s’occupe de tout. De la préparation de la base à la pose finale, chaque projet est conçu pour les hivers québécois.',

      symptomsTitle: 'Ce que vous voyez',
      symptoms:
        'Votre pavé s’affaisse par endroits? Des morceaux bougent quand vous marchez? Des fissures apparaissent? L’eau s’accumule sur la surface? Ce sont des signes que la base ou le drainage pose problème.',

      causesTitle: 'Ce qui cause le problème',
      causes: [
        'L’affaissement du pavé uni est presque toujours causé par un problème de base : préparation insuffisante, drainage déficient, ou mouvement du sol dû au gel-dégel. Réparer la surface sans régler la cause, c’est remettre le même problème dans quelques années.',
        'Les joints qui se vident, une bordure qui se soulève, un creux qui se creuse toujours au même endroit près d’une descente de gouttière : ce sont rarement des hasards. C’est de l’eau qui passe où elle ne devrait pas.',
      ],

      solutionTitle: 'Ce qu’on fait',
      solution: [
        'On commence par comprendre ce qui se passe sous la surface. On dépose le pavé, on évalue la base, on corrige le drainage si nécessaire, on recompacte, et on repose le pavé.',
        'Pour les nouvelles installations, on prépare la base correctement dès le départ : c’est la seule partie du travail qu’on ne voit plus une fois terminée, et c’est celle qui décide si l’aménagement tient dix ans ou trois hivers.',
      ],

      includesTitle: 'Ce que les travaux peuvent comprendre',
      includes: [
        'Retrait des pavés dans les sections touchées',
        'Correction et compactage de la fondation',
        'Vérification et correction du drainage',
        'Remise à niveau des surfaces',
        'Réinstallation des pavés selon le motif d’origine',
        'Reprise ou remplacement des bordures',
        'Application de nouveau sable polymère',
        'Nettoyage final du chantier',
      ],

      surfacesTitle: 'Surfaces visées',
      surfaces: [
        'Entrées et stationnements',
        'Terrasses',
        'Trottoirs et allées',
        'Paliers et marches',
        'Contours de piscine',
      ],

      note: 'Selon l’état de la fondation et l’étendue des dommages, certaines surfaces demandent une réfection plus large qu’une réparation ponctuelle. On vous le dit dès la visite, avant de commencer. Ce qui est compris et ce qui est en supplément - démolition et disposition de l’ancienne surface, profondeur d’excavation, membrane géotextile, bordures de retenue - est détaillé dans le devis.',

      localTitle: 'À Laval et sur la Rive-Nord',
      local:
        'Les hivers d’ici sont durs sur le pavé uni : le gel soulève, le dégel affaisse, et le sel finit par vider les joints. C’est le genre de travaux qu’on réalise régulièrement à Laval et sur la Rive-Nord, sur des entrées, des trottoirs et des terrasses résidentielles.',

      process: [
        {
          step: '01',
          title: 'Évaluation sur place',
          text: 'On regarde le problème, les pentes et les points d’accumulation d’eau, et on vous explique ce qu’on voit.',
        },
        {
          step: '02',
          title: 'Préparation',
          text: 'On dépose le pavé si nécessaire, on prépare et on compacte la base.',
        },
        {
          step: '03',
          title: 'Drainage',
          text: 'On vérifie et on corrige le drainage avant de remettre quoi que ce soit en place.',
        },
        {
          step: '04',
          title: 'Pose',
          text: 'On repose le pavé selon le motif d’origine, on compacte, on ajoute le sable polymère.',
        },
        {
          step: '05',
          title: 'Finition',
          text: 'On nettoie, on vérifie les niveaux, et on garantit le résultat.',
        },
      ],

      priceTitle: 'Ce qui influence le prix',
      priceLede: 'Le coût d’un projet de pavé uni dépend de plusieurs facteurs :',
      priceFactors: [
        'La surface en pieds carrés',
        'Le type de pavé choisi',
        'L’état de la base existante',
        'Le drainage, si une correction est nécessaire',
        'L’accès au site',
        'S’il s’agit d’une nouvelle installation ou d’une réparation',
      ],
      priceNote:
        'C’est pour ça qu’on fait une évaluation gratuite sur place - on ne peut pas vous donner un prix juste sans avoir vu le site.',

      faqTitle: 'Questions fréquentes',
      faq: [
        {
          q: 'Quelle est la différence entre le pavé uni et l’asphalte?',
          a: 'L’asphalte est une surface continue : moins chère à installer, mais quand elle fissure ou s’affaisse, on répare en rapiéçant et ça paraît. Le pavé uni est fait de pièces indépendantes posées sur une base de pierre et un lit de sable. Ça coûte plus cher au départ, mais une section peut être démontée et remise en place sans qu’on voie la réparation, et l’eau peut descendre par les joints au lieu de rester en surface. Sur une entrée qui subit le gel-dégel et le déneigement, c’est ce qui fait la différence à long terme.',
        },
        {
          q: 'Combien de temps dure une installation de pavé uni?',
          a: 'Une installation bien faite, avec une base correctement préparée et un drainage qui fonctionne, dure très longtemps - le pavé lui-même s’use beaucoup moins vite que la base sur laquelle il repose. La clé, c’est la préparation de la base. C’est aussi pourquoi la majorité des réparations qu’on fait ne sont pas des problèmes de pavé, mais des problèmes de fondation.',
        },
        {
          q: 'Le pavé uni résiste-t-il au gel-dégel?',
          a: 'Oui, s’il est bien installé. C’est justement pour ça qu’on insiste sur la préparation de la base et le drainage : c’est l’eau emprisonnée sous la surface qui cause les dommages du gel, pas le froid lui-même.',
        },
        {
          q: 'Est-ce qu’on peut réparer juste une section?',
          a: 'Souvent, oui. Si la base est saine ailleurs et que le problème est localisé, on démonte seulement la section touchée, on corrige ce qu’il y a dessous et on repose les mêmes pavés. Si la base est compromise sur l’ensemble de la surface, une réparation ponctuelle ne ferait que déplacer le problème. On vous dit lequel des deux cas s’applique après l’évaluation.',
        },
        {
          q: 'Faut-il refaire le sable polymère?',
          a: 'Le sable polymère finit par se vider avec les années, le lavage et le déneigement. Des joints vides laissent les pavés bouger et l’eau descendre au mauvais endroit. Un ressablage fait partie de l’entretien normal d’une surface en pavé uni.',
        },
      ],

      warrantyTitle: 'Garantie',
      warranty: '{warrantyTerms}',

      metaTitle: 'Pavé uni Laval - Installation et réparation | Oasis Construction',
      metaDescription:
        'Installation et réparation de pavé uni à Laval et sur la Rive-Nord. Évaluation gratuite, devis transparent. Appelez (438) 505-4846.',
    },

    en: {
      name: 'Interlocking pavers',
      short:
        'Paver installation and repair. Driveways, patios, walkways. Built for Quebec winters.',
      material: 'Concrete paver',
      eyebrow: 'Service',
      title:
        'Interlocking pavers: installation, repair and upkeep in Laval and the North Shore',
      lede: 'Whether you need a new paver driveway, a patio, or a repair to pavers that have settled, we handle all of it. From base preparation to the final course, every project is built for Quebec winters.',

      symptomsTitle: 'What you are seeing',
      symptoms:
        'Are your pavers sinking in places? Do pieces move when you walk on them? Are cracks opening up? Is water pooling on the surface? Those are signs that the base or the drainage is the problem.',

      causesTitle: 'What causes it',
      causes: [
        'Settling pavers are almost always a base problem: insufficient preparation, poor drainage, or ground movement from freeze-thaw. Repairing the surface without addressing the cause just books the same problem for a few years from now.',
        'Joints that empty out, an edge that lifts, a dip that always forms in the same place near a downspout - these are rarely coincidences. That is water travelling where it should not.',
      ],

      solutionTitle: 'What we do',
      solution: [
        'We start by understanding what is happening under the surface. We lift the pavers, assess the base, correct the drainage if it needs it, recompact, and reset the pavers.',
        'On new installations we prepare the base properly from the start: it is the one part of the job nobody ever sees again, and it is the part that decides whether the work lasts ten years or three winters.',
      ],

      includesTitle: 'What the work can include',
      includes: [
        'Lifting the pavers in the affected sections',
        'Correcting and compacting the base',
        'Checking and correcting drainage',
        'Re-levelling the surface',
        'Reinstalling the pavers in the original pattern',
        'Resetting or replacing edge restraints',
        'Applying new polymeric sand',
        'Final site clean-up',
      ],

      surfacesTitle: 'Suitable surfaces',
      surfaces: [
        'Driveways and parking areas',
        'Patios',
        'Walkways',
        'Landings and steps',
        'Pool surrounds',
      ],

      note: 'Depending on the condition of the base and how far the damage extends, some surfaces need a broader rebuild rather than a spot repair. We tell you that at the visit, before anything starts. What is included and what is extra - demolition and disposal of the old surface, excavation depth, geotextile fabric, edge restraints - is itemised in the quote.',

      localTitle: 'In Laval and the North Shore',
      local:
        'Winters here are hard on interlocking pavers: frost lifts them, thaw settles them, and road salt slowly empties the joints. This is work we carry out regularly across Laval and the North Shore, on residential driveways, walkways and patios.',

      process: [
        {
          step: '01',
          title: 'On-site assessment',
          text: 'We look at the problem, the slopes and where water collects, and explain what we see.',
        },
        {
          step: '02',
          title: 'Preparation',
          text: 'We lift the pavers where needed, then prepare and compact the base.',
        },
        {
          step: '03',
          title: 'Drainage',
          text: 'We check and correct the drainage before anything goes back down.',
        },
        {
          step: '04',
          title: 'Laying',
          text: 'Pavers go back in the original pattern, compacted, with fresh polymeric sand.',
        },
        {
          step: '05',
          title: 'Finish',
          text: 'We clean up, check the levels, and stand behind the result.',
        },
      ],

      priceTitle: 'What affects the price',
      priceLede: 'The cost of a paver project depends on several things:',
      priceFactors: [
        'The area in square feet',
        'The paver you choose',
        'The condition of the existing base',
        'Drainage, if it needs correcting',
        'Access to the site',
        'Whether it is a new installation or a repair',
      ],
      priceNote:
        'That is why the on-site assessment is free - we cannot give you an honest price without seeing the site.',

      faqTitle: 'Frequently asked questions',
      faq: [
        {
          q: 'What is the difference between pavers and asphalt?',
          a: 'Asphalt is a continuous surface: cheaper to install, but when it cracks or settles you patch it, and the patch shows. Interlocking pavers are individual units set on a stone base and a sand bed. They cost more up front, but a section can be lifted and reset without the repair showing, and water can drain through the joints instead of sitting on top. On a driveway that takes freeze-thaw and snow clearing, that is what makes the difference over time.',
        },
        {
          q: 'How long does a paver installation last?',
          a: 'A properly built installation, with a correctly prepared base and drainage that works, lasts a very long time - the pavers themselves wear far more slowly than the base under them. The base is the whole game. It is also why most of the repairs we do are not paver problems at all; they are base problems.',
        },
        {
          q: 'Do pavers hold up to freeze-thaw?',
          a: 'Yes, when they are installed properly. That is exactly why we are so insistent about base preparation and drainage: it is water trapped under the surface that causes frost damage, not the cold itself.',
        },
        {
          q: 'Can you repair just one section?',
          a: 'Often, yes. If the base is sound elsewhere and the problem is localised, we lift only the affected section, correct what is underneath and reset the same pavers. If the base is compromised across the whole surface, a spot repair would only move the problem along. We tell you which of the two you have after the assessment.',
        },
        {
          q: 'Does the polymeric sand need redoing?',
          a: 'Polymeric sand empties out over the years with washing and snow clearing. Empty joints let the pavers move and let water down into the wrong place. Re-sanding is part of the normal upkeep of a paver surface.',
        },
      ],

      warrantyTitle: 'Warranty',
      warranty: '{warrantyTerms}',

      metaTitle: 'Interlocking pavers Laval - Repair | Oasis Construction',
      metaDescription:
        'Interlocking paver installation and repair in Laval and the North Shore. Free assessment, transparent quote. Call (438) 505-4846.',
    },
  },
};
