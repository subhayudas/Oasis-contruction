import type { Service } from './types';

export const drainage: Service = {
  key: 'drainage',
  hero: 'scene-drainage-tranchee',
  detail: 'scene-drainage-drain',
  diagram: 'drainage',
  related: ['pave-uni', 'muret'],
  photoFirst: true,
  copy: {
    fr: {
      name: 'Drainage',
      short:
        'Solutions de drainage pour empêcher l’eau de s’accumuler et d’endommager vos surfaces.',
      material: 'Pierre nette',
      eyebrow: 'Service',
      title: 'Drainage extérieur : solutions pour empêcher l’eau de s’accumuler',
      lede: 'L’eau qui s’accumule sur votre entrée, près de votre fondation, ou dans votre cour, ce n’est pas qu’un désagrément. C’est un problème qui s’aggrave avec le gel-dégel et qui peut endommager vos surfaces et votre fondation. On évalue, on propose des solutions, on installe.',

      symptomsTitle: 'Ce que vous voyez',
      symptoms:
        'L’eau s’accumule sur votre pavé? Des flaques persistent après la pluie? L’eau se dirige vers votre maison? Votre pavé s’affaisse dans les zones où l’eau passe? Ce sont des signes de drainage déficient.',

      causesTitle: 'Ce qui cause le problème',
      causes: [
        'Le drainage déficient est généralement causé par : une pente insuffisante, un sol qui ne draine pas, l’absence de drain français, un drain existant bouché, ou une installation de pavé qui ne tenait pas compte du drainage.',
        'Une descente de gouttière qui déverse au mauvais endroit suffit souvent à elle seule à creuser un affaissement dans une entrée en quelques années.',
      ],

      solutionTitle: 'Ce qu’on fait',
      solution: [
        'On évalue d’où vient l’eau, où elle devrait aller, et ce qui l’empêche d’y arriver.',
        'Solutions possibles : correction de pente, installation de drain français, drain de surface, puisard, réfection de la base du pavé. On vous propose la solution qui règle le problème, pas un pansement.',
      ],

      includesTitle: 'Ce que les travaux peuvent comprendre',
      includes: [
        'Relevé des niveaux et repérage de l’écoulement',
        'Excavation de la tranchée',
        'Membrane géotextile et pierre nette',
        'Drain perforé, puisard ou drain de surface',
        'Correction de la pente de surface',
        'Remise en place du pavé ou de la pelouse',
        'Vérification de l’écoulement avant de quitter le chantier',
      ],

      surfacesTitle: 'Situations visées',
      surfaces: [
        'Entrées et stationnements',
        'Le long d’une fondation',
        'Cours arrière qui retiennent l’eau',
        'Derrière un muret',
        'Sorties de descentes de gouttière',
      ],

      note: 'Le drainage extérieur règle l’eau de surface et l’eau du terrain. Il ne remplace pas le drain français d’une fondation qui serait à refaire, ni l’imperméabilisation d’un sous-sol qui prend l’eau. Si le problème vient de là, on vous le dira plutôt que de vous vendre une tranchée qui n’y changera rien.',

      localTitle: 'À Laval et sur la Rive-Nord',
      local:
        'Sur une bonne partie de la Rive-Nord, le sol est argileux et draine mal : l’eau reste en surface au lieu de descendre. Combiné aux cycles de gel-dégel, c’est ce qui déforme les entrées et pousse les murets du secteur.',

      process: [
        {
          step: '01',
          title: 'Évaluation',
          text: 'On identifie la source du problème d’eau, les pentes et le point de sortie possible.',
        },
        {
          step: '02',
          title: 'Plan',
          text: 'On propose la solution adaptée au site, et on vous explique pourquoi c’est celle-là.',
        },
        {
          step: '03',
          title: 'Excavation',
          text: 'On ouvre la zone et on prépare la tranchée avec la pente nécessaire.',
        },
        {
          step: '04',
          title: 'Installation',
          text: 'Membrane, drain, pierre nette, puis remblai — dans cet ordre, c’est ce qui empêche le drain de se colmater.',
        },
        {
          step: '05',
          title: 'Restauration',
          text: 'On remet le pavé, la pelouse ou la surface en place.',
        },
        {
          step: '06',
          title: 'Vérification',
          text: 'On teste l’écoulement, on nettoie, et on garantit le résultat.',
        },
      ],

      priceTitle: 'Ce qui influence le prix',
      priceLede: 'Le coût d’un projet de drainage dépend de plusieurs facteurs :',
      priceFactors: [
        'La longueur et la profondeur de la tranchée',
        'Le type de drainage nécessaire',
        'La surface à démonter et à remettre en place',
        'L’endroit où l’eau peut être dirigée',
        'La nature du sol',
        'L’accès au site pour la machinerie',
      ],
      priceNote:
        'Évaluation gratuite sur place. Le point de sortie de l’eau est souvent ce qui détermine le coût, et ça ne se voit pas sur une photo.',

      faqTitle: 'Questions fréquentes',
      faq: [
        {
          q: 'L’eau s’accumule sur mon pavé. C’est normal?',
          a: 'Non. Un pavé bien installé avec une pente adéquate ne devrait pas accumuler d’eau. Si l’eau reste, c’est un signe de drainage ou de pente déficient.',
        },
        {
          q: 'Quelle est la différence entre un drain français et un drain de surface?',
          a: 'Un drain de surface capte l’eau qui court sur le dessus : une grille, un caniveau, un puisard. Un drain français est un tuyau perforé enterré dans de la pierre, qui capte l’eau contenue dans le sol avant qu’elle ne remonte ou ne pousse. Beaucoup de terrains ont besoin des deux, et l’un ne remplace pas l’autre.',
        },
        {
          q: 'Est-ce que je peux juste rallonger ma descente de gouttière?',
          a: 'Parfois, oui — et si c’est ce qui règle votre problème, on va vous le dire. Rediriger une descente qui déverse contre une fondation ou au milieu d’une entrée est la correction la moins chère qui existe. Ça ne règle pas un terrain qui retient l’eau sur toute sa surface, par contre.',
        },
        {
          q: 'Peut-on faire les travaux en automne?',
          a: 'Oui, tant que le sol n’est pas gelé. L’automne est souvent un bon moment : le terrain est sec, et le drain est en place avant les dégels du printemps, qui sont exactement le moment où le problème se voit le plus.',
        },
      ],

      warrantyTitle: 'Garantie',
      warranty: '{warrantyTerms}',

      metaTitle: 'Drainage extérieur Laval | Oasis Construction',
      metaDescription:
        'Solutions de drainage extérieur à Laval et sur la Rive-Nord. L’eau s’accumule? On peut aider. Évaluation gratuite. Appelez (438) 505-4846.',
    },

    en: {
      name: 'Drainage',
      short: 'Drainage that stops water collecting and damaging your surfaces.',
      material: 'Clean stone',
      eyebrow: 'Service',
      title: 'Exterior drainage: keeping water from collecting',
      lede: 'Water pooling on your driveway, against your foundation or in your yard is not just a nuisance. It is a problem that gets worse with freeze-thaw and can damage your surfaces and your foundation. We assess it, propose a solution, and install it.',

      symptomsTitle: 'What you are seeing',
      symptoms:
        'Is water pooling on your pavers? Do puddles sit there after rain? Is water running toward the house? Are your pavers settling exactly where the water travels? Those are signs of failing drainage.',

      causesTitle: 'What causes it',
      causes: [
        'Failing drainage is usually caused by insufficient slope, soil that does not drain, no French drain at all, a blocked existing drain, or paving that was laid without drainage in mind.',
        'A downspout discharging in the wrong place is often enough on its own to hollow out a driveway within a few years.',
      ],

      solutionTitle: 'What we do',
      solution: [
        'We work out where the water comes from, where it should go, and what is stopping it getting there.',
        'Possible solutions: regrading, a French drain, a surface drain, a catch basin, or rebuilding the paver base. We propose the one that solves the problem rather than a patch.',
      ],

      includesTitle: 'What the work can include',
      includes: [
        'Shooting the levels and tracing the flow',
        'Excavating the trench',
        'Geotextile fabric and clean stone',
        'Perforated pipe, catch basin or surface drain',
        'Correcting the surface grade',
        'Reinstating the pavers or the lawn',
        'Testing the flow before we leave',
      ],

      surfacesTitle: 'Where it applies',
      surfaces: [
        'Driveways and parking areas',
        'Along a foundation',
        'Back yards that hold water',
        'Behind a retaining wall',
        'Downspout outlets',
      ],

      note: 'Exterior drainage handles surface water and water in the ground. It does not replace a foundation French drain that needs redoing, or waterproofing a basement that is taking water. If that is where your problem is, we will say so rather than sell you a trench that will not change it.',

      localTitle: 'In Laval and the North Shore',
      local:
        'Across much of the North Shore the soil is clay and drains poorly: water sits on the surface instead of going down. Combined with freeze-thaw, that is what deforms driveways and pushes the area’s retaining walls over.',

      process: [
        {
          step: '01',
          title: 'Assessment',
          text: 'We identify the source of the water, the slopes, and where it can be sent.',
        },
        {
          step: '02',
          title: 'Plan',
          text: 'We propose the solution the site calls for, and explain why that one.',
        },
        {
          step: '03',
          title: 'Excavation',
          text: 'We open the area and dig the trench to the fall it needs.',
        },
        {
          step: '04',
          title: 'Installation',
          text: 'Fabric, pipe, clean stone, then backfill — in that order, which is what keeps the drain from silting up.',
        },
        {
          step: '05',
          title: 'Reinstatement',
          text: 'Pavers, lawn or surface go back in place.',
        },
        {
          step: '06',
          title: 'Testing',
          text: 'We test the flow, clean up, and stand behind the result.',
        },
      ],

      priceTitle: 'What affects the price',
      priceLede: 'The cost of a drainage project depends on several things:',
      priceFactors: [
        'The length and depth of the trench',
        'The type of drainage needed',
        'How much surface has to come up and go back',
        'Where the water can be discharged',
        'The soil type',
        'Access for machinery',
      ],
      priceNote:
        'Free on-site assessment. Where the water can exit is often what determines the cost, and that does not show up in a photo.',

      faqTitle: 'Frequently asked questions',
      faq: [
        {
          q: 'Water pools on my pavers. Is that normal?',
          a: 'No. Properly installed pavers with adequate slope should not pool water. If water sits there, it is a sign of failing drainage or grade.',
        },
        {
          q: 'What is the difference between a French drain and a surface drain?',
          a: 'A surface drain catches water running across the top: a grate, a channel, a catch basin. A French drain is perforated pipe buried in stone that catches water held in the soil before it rises or pushes. Many lots need both, and one does not replace the other.',
        },
        {
          q: 'Can I just extend my downspout?',
          a: 'Sometimes, yes — and if that solves your problem, we will tell you. Redirecting a downspout that discharges against a foundation or into the middle of a driveway is the cheapest correction there is. It will not fix a lot that holds water across its whole surface, though.',
        },
        {
          q: 'Can the work be done in the fall?',
          a: 'Yes, as long as the ground is not frozen. Fall is often a good time: the ground is dry, and the drain is in before the spring thaw, which is exactly when the problem shows itself most.',
        },
      ],

      warrantyTitle: 'Warranty',
      warranty: '{warrantyTerms}',

      metaTitle: 'Exterior drainage Laval | Oasis Construction',
      metaDescription:
        'Exterior drainage solutions in Laval and the North Shore. Water pooling? We can help. Free assessment. Call (438) 505-4846.',
    },
  },
};
