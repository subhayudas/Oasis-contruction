import type { Service } from './types';

export const amenagementExterieur: Service = {
  key: 'amenagement-exterieur',
  hero: 'scene-terrasse-finie',
  detail: 'scene-equipe-chantier',
  related: ['pave-uni', 'muret'],
  photoFirst: false,
  copy: {
    fr: {
      name: 'Aménagement extérieur',
      short:
        'Aménagement complet : foyers, fontaines, cuisines extérieures, pavé uni chauffant.',
      material: 'Projet complet',
      eyebrow: 'Service',
      title: 'Aménagement extérieur : transformez votre cour en oasis',
      lede: 'Au-delà du pavé uni et des murets, on aménage des espaces extérieurs complets. Foyers, fontaines, cuisines extérieures, pavé uni chauffant pour des entrées sans neige ni glace. On conçoit, on construit, on livre.',

      symptomsTitle: 'Ce que vous cherchez',
      symptoms:
        'Vous voulez profiter de votre cour plus longtemps dans l’année? Vous voulez un espace extérieur qui ressemble à quelque chose? Vous en avez marre de déneiger votre entrée chaque hiver?',

      causesTitle: 'Ce dont il s’agit',
      causes: [
        'L’aménagement extérieur, c’est l’art de créer un espace qui vous ressemble et qui fonctionne pour votre style de vie.',
        'La différence entre une cour qu’on traverse et une cour qu’on habite tient rarement à une seule chose : c’est la circulation, les niveaux, l’ombre, le rangement et l’entretien, réglés ensemble.',
      ],

      solutionTitle: 'Ce qu’on fait',
      solution: [
        'On vous aide à concevoir un plan d’aménagement qui maximise votre espace, qui respecte votre budget, et qui est conçu pour les conditions québécoises.',
        'Ensuite on construit : les mêmes fondations, le même drainage et le même souci du détail que sur une réparation, appliqués à un projet complet.',
      ],

      includesTitle: 'Ce qu’un projet peut comprendre',
      includes: [
        'Terrasses et patios en pavé ou en dalles de grand format',
        'Murets, muret-banquettes et plates-bandes surélevées',
        'Foyers extérieurs',
        'Fontaines et éléments d’eau',
        'Cuisines extérieures',
        'Pavé uni chauffant pour entrées et marches',
        'Escaliers et paliers de pierre',
        'Drainage et nivellement du terrain',
      ],

      surfacesTitle: 'Espaces visés',
      surfaces: [
        'Cours arrière',
        'Entrées et façades',
        'Contours de piscine',
        'Terrasses sur plusieurs niveaux',
        'Cours latérales étroites',
      ],

      note: 'Un aménagement complet se planifie. Selon l’ampleur du projet, il peut demander des permis municipaux, la localisation des services enfouis, ou la collaboration d’autres corps de métier. On établit ça avec vous à la consultation, avant que quoi que ce soit ne commence.',

      localTitle: 'À Laval et sur la Rive-Nord',
      local:
        'Ici, un aménagement doit survivre à sept mois de froid, à la neige et au sel. Ça change les matériaux, les fondations, les pentes et la façon dont on place un foyer ou une cuisine extérieure. C’est la contrainte qui oriente le plus le design.',

      process: [
        {
          step: '01',
          title: 'Consultation',
          text: 'On discute de vos besoins, de vos idées et de la façon dont vous voulez utiliser l’espace.',
        },
        {
          step: '02',
          title: 'Conception',
          text: 'On élabore un plan d’aménagement adapté au terrain, au budget et aux conditions d’ici.',
        },
        {
          step: '03',
          title: 'Devis',
          text: 'On vous remet un devis transparent, détaillé par poste.',
        },
        {
          step: '04',
          title: 'Réalisation',
          text: 'On construit votre projet, en respectant les étapes et les délais convenus.',
        },
        {
          step: '05',
          title: 'Livraison',
          text: 'On nettoie, on vérifie, et on vous livre votre nouvel espace.',
        },
      ],

      priceTitle: 'Ce qui influence le prix',
      priceLede:
        'L’aménagement extérieur complet varie énormément selon le projet. Ce qui pèse le plus :',
      priceFactors: [
        'La surface totale aménagée',
        'Les éléments choisis (foyer, cuisine, eau, chauffage)',
        'Les matériaux et leur format',
        'Le nivellement et le drainage nécessaires',
        'L’accès au site pour la machinerie',
        'Le nombre de niveaux et de murets',
      ],
      priceNote:
        'On fait une consultation gratuite pour comprendre vos besoins et vous proposer un plan et un devis. C’est le seul moyen honnête de chiffrer un projet de ce genre.',

      faqTitle: 'Questions fréquentes',
      faq: [
        {
          q: 'Qu’est-ce que le pavé uni chauffant?',
          a: 'C’est un système de chauffage installé sous le pavé uni qui fait fondre la neige et la glace automatiquement. Plus de déneigement, plus de sel, plus de glissade. Il s’installe pendant la construction de la surface, pas après - c’est pour ça qu’il faut en parler au moment du plan.',
        },
        {
          q: 'Combien coûte un pavé uni chauffant?',
          a: 'Le coût dépend de la surface chauffée, du type de système et du raccordement électrique disponible. C’est un élément qu’on chiffre séparément dans le devis, pour que vous puissiez décider de le garder ou non en voyant son coût réel. On en discute à la consultation.',
        },
        {
          q: 'Peut-on faire le projet en plusieurs phases?',
          a: 'Oui, et c’est souvent la bonne façon de faire. On planifie l’ensemble dès le départ - surtout le drainage, les niveaux et tout ce qui passe sous terre - puis on réalise par étapes, sur une ou plusieurs saisons. Ce qu’il ne faut pas faire, c’est construire une phase sans savoir ce que la suivante exigera.',
        },
        {
          q: 'Est-ce que vous faites la plantation et le gazon?',
          a: 'On fait la construction : surfaces, murets, escaliers, drainage, nivellement. Pour le volet horticole d’un projet, on vous dira franchement ce qu’on prend en charge et ce qui gagne à être confié à un spécialiste.',
        },
      ],

      warrantyTitle: 'Garantie',
      warranty: '{warrantyTerms}',

      metaTitle: 'Aménagement extérieur Laval | Oasis Construction',
      metaDescription:
        'Aménagement extérieur complet à Laval et sur la Rive-Nord : foyers, fontaines, cuisines extérieures, pavé uni chauffant. Évaluation gratuite.',
    },

    en: {
      name: 'Landscape construction',
      short:
        'Complete outdoor builds: fire features, water features, outdoor kitchens, heated pavers.',
      material: 'Full project',
      eyebrow: 'Service',
      title: 'Landscape construction: turning your yard into an oasis',
      lede: 'Beyond pavers and walls, we build complete outdoor spaces. Fire features, water features, outdoor kitchens, heated pavers for driveways that stay clear of snow and ice. We design it, we build it, we hand it over.',

      symptomsTitle: 'What you are after',
      symptoms:
        'Do you want more of the year out in your yard? Do you want an outdoor space that actually looks like something? Are you tired of clearing your driveway every winter?',

      causesTitle: 'What this is',
      causes: [
        'Landscape construction is the craft of making a space that fits you and works for how you live.',
        'The difference between a yard you cross and a yard you use is rarely one thing: it is circulation, levels, shade, storage and upkeep, all solved together.',
      ],

      solutionTitle: 'What we do',
      solution: [
        'We help you develop a plan that makes the most of the space, respects your budget, and is built for Quebec conditions.',
        'Then we build it: the same footings, the same drainage and the same attention to detail as on a repair, applied to a complete project.',
      ],

      includesTitle: 'What a project can include',
      includes: [
        'Patios and terraces in pavers or large-format slabs',
        'Retaining walls, seat walls and raised beds',
        'Outdoor fireplaces and fire pits',
        'Fountains and water features',
        'Outdoor kitchens',
        'Heated pavers for driveways and steps',
        'Stone stairways and landings',
        'Drainage and site grading',
      ],

      surfacesTitle: 'Spaces we work on',
      surfaces: [
        'Back yards',
        'Driveways and frontages',
        'Pool surrounds',
        'Multi-level terraces',
        'Narrow side yards',
      ],

      note: 'A full build needs planning. Depending on the scale, it may require municipal permits, utility locates, or coordination with other trades. We establish that with you at the consultation, before anything begins.',

      localTitle: 'In Laval and the North Shore',
      local:
        'Here, an outdoor build has to survive seven months of cold, snow and salt. That changes the materials, the footings, the slopes and where a fire feature or an outdoor kitchen can sensibly go. It is the constraint that shapes the design most.',

      process: [
        {
          step: '01',
          title: 'Consultation',
          text: 'We talk through your needs, your ideas and how you want to use the space.',
        },
        {
          step: '02',
          title: 'Design',
          text: 'We develop a plan suited to the site, the budget and the climate.',
        },
        {
          step: '03',
          title: 'Quote',
          text: 'We give you a transparent quote, itemised line by line.',
        },
        {
          step: '04',
          title: 'Build',
          text: 'We build the project, to the stages and the schedule we agreed.',
        },
        {
          step: '05',
          title: 'Handover',
          text: 'We clean up, check the work, and hand you the finished space.',
        },
      ],

      priceTitle: 'What affects the price',
      priceLede: 'A full outdoor build varies enormously by project. What weighs most:',
      priceFactors: [
        'The total area being built',
        'The features chosen (fire, kitchen, water, heating)',
        'The materials and their format',
        'How much grading and drainage is needed',
        'Access for machinery',
        'The number of levels and walls',
      ],
      priceNote:
        'We do a free consultation to understand what you need and propose a plan and a quote. It is the only honest way to price a project like this.',

      faqTitle: 'Frequently asked questions',
      faq: [
        {
          q: 'What are heated pavers?',
          a: 'A heating system installed under the pavers that melts snow and ice automatically. No shovelling, no salt, no slipping. It goes in while the surface is being built, not afterwards - which is why it has to be raised at the planning stage.',
        },
        {
          q: 'What do heated pavers cost?',
          a: 'It depends on the heated area, the type of system and the electrical supply available. We price it as a separate line in the quote so you can decide whether to keep it once you see what it actually costs. We discuss it at the consultation.',
        },
        {
          q: 'Can the project be done in phases?',
          a: 'Yes, and it is often the right way to do it. We plan the whole thing up front - especially drainage, levels and everything that goes underground - then build in stages over one or more seasons. What you should not do is build a phase without knowing what the next one will require.',
        },
        {
          q: 'Do you do planting and lawns?',
          a: 'We do the construction: surfaces, walls, stairways, drainage, grading. For the horticultural side of a project, we will tell you plainly what we take on and what is better handed to a specialist.',
        },
      ],

      warrantyTitle: 'Warranty',
      warranty: '{warrantyTerms}',

      metaTitle: 'Landscape construction Laval | Oasis Construction',
      metaDescription:
        'Complete landscape construction in Laval and the North Shore: fire features, water features, outdoor kitchens, heated pavers. Free consultation.',
    },
  },
};
