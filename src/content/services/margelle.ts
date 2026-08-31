import type { Service } from './types';

export const margelle: Service = {
  key: 'margelle',
  hero: 'scene-entree-pierre',
  detail: 'scene-cordeau-sable',
  related: ['pave-uni', 'muret'],
  photoFirst: true,
  copy: {
    fr: {
      name: 'Margelle',
      short:
        'Installation de margelles et marches pour un accès sécuritaire et un bon drainage.',
      material: 'Pierre reconstituée',
      eyebrow: 'Service',
      title: 'Margelle : installation de marches et bordures sécuritaires',
      lede: 'Les margelles et marches ne sont pas qu’un détail esthétique. Des marches qui bougent, qui s’affaissent, ou qui sont instables, c’est un risque de chute. On installe des margelles solides, bien ancrées, avec un drainage adéquat.',

      symptomsTitle: 'Ce que vous voyez',
      symptoms:
        'Vos marches bougent quand vous montez? Elles s’affaissent? L’espace entre les marches et le pavé s’élargit? C’est souvent un problème d’ancrage, de base, ou de drainage.',

      causesTitle: 'Ce qui cause le problème',
      causes: [
        'Les margelles qui bougent sont généralement causées par une base insuffisante, un ancrage déficient, ou un mouvement du sol dû au gel-dégel.',
        'Le drainage joue aussi un rôle - l’eau qui s’accumule sous les marches gèle, prend de l’expansion et soulève. C’est ce cycle, répété chaque hiver, qui finit par déchausser une marche.',
      ],

      solutionTitle: 'Ce qu’on fait',
      solution: [
        'On démonte les marches affectées, on prépare une base solide, on installe un ancrage approprié, on corrige le drainage, et on repose les margelles.',
        'Le but n’est pas seulement que ce soit droit le jour de la pose : c’est que les marches ne bougent plus l’hiver suivant.',
      ],

      includesTitle: 'Ce que les travaux peuvent comprendre',
      includes: [
        'Retrait des marches ou margelles affectées',
        'Excavation et préparation d’une base compactée',
        'Correction du drainage sous et derrière les marches',
        'Ancrage et fixation des éléments',
        'Pose et mise à niveau des margelles',
        'Raccord avec le pavé ou la surface adjacente',
        'Nettoyage et vérification de la stabilité',
      ],

      surfacesTitle: 'Types d’ouvrages',
      surfaces: [
        'Marches d’entrée',
        'Paliers',
        'Margelles de piscine',
        'Bordures de terrasse',
        'Marches dans un talus',
      ],

      note: 'Quand un escalier de béton coulé s’est fissuré ou a basculé, remettre des margelles par-dessus ne règle rien : c’est la structure en dessous qui bouge. On vous le dira franchement à l’évaluation, même si ça veut dire que le travail est plus gros que prévu.',

      localTitle: 'À Laval et sur la Rive-Nord',
      local:
        'Des marches instables l’hiver, sur une entrée en pente et enneigée, c’est le genre de détail qui envoie quelqu’un à l’urgence. C’est un des travaux qu’on nous demande le plus souvent au printemps, après une saison où la marche a bougé.',

      process: [
        {
          step: '01',
          title: 'Évaluation',
          text: 'On regarde les marches, on cherche d’où vient le mouvement, et on vous explique ce qu’on voit.',
        },
        {
          step: '02',
          title: 'Démontage',
          text: 'On retire les marches affectées pour accéder à la base.',
        },
        {
          step: '03',
          title: 'Base et ancrage',
          text: 'On prépare une base compactée et un ancrage correct.',
        },
        {
          step: '04',
          title: 'Drainage',
          text: 'On corrige le drainage sous les marches pour que l’eau ne reste pas emprisonnée.',
        },
        {
          step: '05',
          title: 'Pose',
          text: 'On repose les margelles, on nivelle, on fixe.',
        },
        {
          step: '06',
          title: 'Finition',
          text: 'On nettoie, on vérifie la stabilité de chaque marche, et on garantit le résultat.',
        },
      ],

      priceTitle: 'Ce qui influence le prix',
      priceLede: 'Le coût d’un projet de margelles dépend de plusieurs facteurs :',
      priceFactors: [
        'Le nombre de marches',
        'Le type de margelle et le matériau choisi',
        'L’état de la base et de la structure existantes',
        'Le drainage, si une correction est nécessaire',
        'L’accès au site',
      ],
      priceNote:
        'Évaluation gratuite sur place. Le prix dépend surtout de ce qu’on trouve sous la première marche.',

      faqTitle: 'Questions fréquentes',
      faq: [
        {
          q: 'Mes marches bougent. Est-ce dangereux?',
          a: 'Des marches instables sont un risque de chute, surtout en hiver. Si vos marches bougent, on recommande de les faire évaluer rapidement.',
        },
        {
          q: 'Peut-on poser des margelles sur un escalier de béton existant?',
          a: 'Oui, quand l’escalier de béton est encore structurellement sain : les margelles l’habillent et donnent une surface régulière et antidérapante. Mais si le béton est fissuré ou a basculé, poser des margelles par-dessus cache le problème sans le régler, et le mouvement va reprendre. On vérifie l’escalier avant de proposer quoi que ce soit.',
        },
        {
          q: 'Quelle est la différence entre une margelle et une marche de pavé?',
          a: 'Une margelle est une pièce pleine, plus épaisse, faite pour former un nez de marche ou une bordure d’un seul tenant. Une marche montée en pavé est composée de plusieurs pièces. La margelle donne une ligne plus nette et moins de joints à entretenir; le pavé s’adapte mieux aux formes courbes.',
        },
        {
          q: 'Est-ce que ça se fait en une journée?',
          a: 'Un ensemble de quelques marches se fait souvent dans la journée, une fois la base réglée. Ce qui allonge le travail, c’est presque toujours ce qu’on trouve dessous : une base à refaire, ou un drainage à corriger.',
        },
      ],

      warrantyTitle: 'Garantie',
      warranty: '{warrantyTerms}',

      metaTitle: 'Margelle Laval - Marches et bordures | Oasis Construction',
      metaDescription:
        'Installation de margelles et marches sécuritaires à Laval et sur la Rive-Nord. Évaluation gratuite. Appelez (438) 505-4846.',
    },

    en: {
      name: 'Steps and coping',
      short: 'Steps and coping installed for safe footing and proper drainage.',
      material: 'Cast stone',
      eyebrow: 'Service',
      title: 'Steps and coping: safe treads and edges',
      lede: 'Steps and coping are not a finishing detail. Steps that move, settle or feel unsteady are a fall risk. We install solid, properly anchored steps with drainage that works.',

      symptomsTitle: 'What you are seeing',
      symptoms:
        'Do your steps move when you walk up them? Have they settled? Is the gap between the steps and the pavers opening up? That is usually an anchoring, base or drainage problem.',

      causesTitle: 'What causes it',
      causes: [
        'Steps that move are usually the result of an insufficient base, poor anchoring, or ground movement from freeze-thaw.',
        'Drainage plays a part too - water collecting under the steps freezes, expands and lifts. It is that cycle, repeated every winter, that eventually works a tread loose.',
      ],

      solutionTitle: 'What we do',
      solution: [
        'We take out the affected steps, build a solid base, anchor them properly, correct the drainage and reset the units.',
        'The goal is not just that it is straight on the day it is laid: it is that the steps do not move the following winter.',
      ],

      includesTitle: 'What the work can include',
      includes: [
        'Removing the affected steps or coping',
        'Excavating and preparing a compacted base',
        'Correcting drainage under and behind the steps',
        'Anchoring and fixing the units',
        'Setting and levelling the coping',
        'Tying into the adjacent paving',
        'Clean-up and a stability check',
      ],

      surfacesTitle: 'Types of work',
      surfaces: [
        'Front steps',
        'Landings',
        'Pool coping',
        'Patio edging',
        'Steps set into a slope',
      ],

      note: 'When a poured concrete stairway has cracked or tipped, laying coping over it does not fix anything - the structure underneath is what is moving. We will say so plainly at the assessment, even when that means the job is bigger than you hoped.',

      localTitle: 'In Laval and the North Shore',
      local:
        'Unsteady steps in winter, on a sloped and snow-covered entrance, are the kind of detail that sends someone to the emergency room. It is one of the jobs we are asked about most in spring, after a season of the tread shifting.',

      process: [
        {
          step: '01',
          title: 'Assessment',
          text: 'We look at the steps, find where the movement is coming from, and explain what we see.',
        },
        {
          step: '02',
          title: 'Removal',
          text: 'We take out the affected steps to reach the base.',
        },
        {
          step: '03',
          title: 'Base and anchoring',
          text: 'We build a compacted base and anchor the units properly.',
        },
        {
          step: '04',
          title: 'Drainage',
          text: 'We correct drainage under the steps so water is not trapped there.',
        },
        {
          step: '05',
          title: 'Setting',
          text: 'We reset the coping, level it and fix it in place.',
        },
        {
          step: '06',
          title: 'Finish',
          text: 'We clean up, check every tread for movement, and stand behind the result.',
        },
      ],

      priceTitle: 'What affects the price',
      priceLede: 'The cost of a steps project depends on several things:',
      priceFactors: [
        'The number of steps',
        'The type of coping and material chosen',
        'The condition of the existing base and structure',
        'Drainage, if it needs correcting',
        'Access to the site',
      ],
      priceNote:
        'Free on-site assessment. The price mostly depends on what we find under the bottom step.',

      faqTitle: 'Frequently asked questions',
      faq: [
        {
          q: 'My steps move. Is that dangerous?',
          a: 'Unsteady steps are a fall risk, especially in winter. If your steps are moving, we recommend having them looked at soon.',
        },
        {
          q: 'Can coping be laid over an existing concrete stairway?',
          a: 'Yes, when the concrete is still structurally sound: the coping dresses it and gives an even, slip-resistant surface. But if the concrete is cracked or has tipped, laying coping over it hides the problem without solving it and the movement will return. We check the stairway before proposing anything.',
        },
        {
          q: 'What is the difference between coping and a paver step?',
          a: 'A coping unit is a solid, thicker piece made to form a nosing or edge in one length. A paver-built step is made of several pieces. Coping gives a cleaner line and fewer joints to maintain; pavers follow curved shapes better.',
        },
        {
          q: 'Is it a one-day job?',
          a: 'A short flight is often done within the day once the base is sorted. What lengthens the work is almost always what we find underneath: a base to rebuild, or drainage to correct.',
        },
      ],

      warrantyTitle: 'Warranty',
      warranty: '{warrantyTerms}',

      metaTitle: 'Steps and coping Laval - Safe steps | Oasis Construction',
      metaDescription:
        'Safe steps and coping installed in Laval and the North Shore. Free assessment. Call (438) 505-4846.',
    },
  },
};
