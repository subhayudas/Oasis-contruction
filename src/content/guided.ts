import type { Locale } from '@/lib/i18n';
import type { ServiceKey } from '@/lib/routes';

/**
 * The guided lead form's data model and copy.
 *
 * Everything the visitor sees in the six-step flow is here, in both
 * languages, as data - so the components below it are a rendering of a list
 * and never a place where a French string lives. The shape is a
 * `Record<Locale, …>`, which means a missing English option is a type error
 * rather than a blank card on the English site.
 *
 * The one rule this file exists to enforce: the visitor taps, they do not
 * type. Every question is a closed list of plausible answers written the way
 * a homeowner would describe the problem - "le pavé s'affaisse", not
 * "affaissement de la fondation" - plus an escape hatch, because a list that
 * does not admit "none of these" pushes people into the wrong answer or out
 * of the form entirely.
 */

/** The six real services, plus the homeowner who does not know which it is. */
export type GuidedServiceKey = ServiceKey | 'unsure';

export type TimelineKey = 'asap' | 'weeks' | 'months' | 'exploring';

export type LocationKey =
  | 'laval'
  | 'terrebonne'
  | 'blainville'
  | 'boisbriand'
  | 'rosemere'
  | 'sainte-therese'
  | 'mirabel'
  | 'montreal'
  | 'other';

/** Icon names resolved to components in `components/guided/icon-for.ts`. */
export type GuidedIcon =
  | 'paver'
  | 'wall'
  | 'steps'
  | 'drain'
  | 'wash'
  | 'yard'
  | 'question'
  | 'bolt'
  | 'calendar'
  | 'eye'
  | 'pin';

export type Choice<K extends string> = {
  key: K;
  label: string;
  /** The second line on the card: what the option means in plain words. */
  hint: string;
  icon?: GuidedIcon;
};

export type ProblemGroup = {
  /** The question, phrased around the service the visitor just picked. */
  question: string;
  options: Choice<string>[];
};

export type GuidedCopy = {
  /** Announced when the modal opens; also the modal's accessible name. */
  formLabel: string;
  close: string;
  back: string;
  progressLabel: string;
  /** "Étape 3 sur 6" - announced, never printed. */
  stepAnnouncement: (current: number, total: number) => string;

  intro: {
    eyebrow: string;
    title: string;
    body: string;
    start: string;
    trust: string;
  };

  service: {
    question: string;
    hint: string;
    options: Choice<GuidedServiceKey>[];
  };

  problem: {
    hint: string;
    /** One entry per service, including `unsure`. */
    groups: Record<GuidedServiceKey, ProblemGroup>;
  };

  location: {
    question: string;
    hint: string;
    options: Choice<LocationKey>[];
    otherLabel: string;
    otherPlaceholder: string;
    otherContinue: string;
    otherError: string;
  };

  timeline: {
    question: string;
    hint: string;
    options: Choice<TimelineKey>[];
  };

  photos: {
    question: string;
    hint: string;
    dropDesktop: string;
    dropMobile: string;
    constraints: string;
    disclaimer: string;
    addMore: string;
    remove: string;
    previewLabel: string;
    continue: string;
    skip: string;
    counter: (count: number, max: number) => string;
    errors: { type: string; size: string; count: string };
  };

  contact: {
    question: string;
    hint: string;
    name: string;
    namePlaceholder: string;
    phone: string;
    phonePlaceholder: string;
    email: string;
    emailPlaceholder: string;
    optional: string;
    submit: string;
    submitting: string;
    consent: string;
    consentLink: string;
    privacy: string;
    errorSummary: string;
    errors: { name: string; phone: string; email: string };
    failureTitle: string;
    failureBody: string;
    rateLimitTitle: string;
    rateLimitBody: string;
    offlineTitle: string;
    offlineBody: string;
  };

  /** The recap strip on the contact step, so the visitor sees what they said. */
  summaryLabel: string;

  confirmation: {
    title: (firstName: string) => string;
    body: string;
    nextTitle: string;
    next: [string, string, string];
    waitTitle: string;
    callCta: string;
    testimonialTitle: string;
    projectsCta: string;
    closeCta: string;
  };
};

/* ------------------------------------------------------------------ french */

const fr: GuidedCopy = {
  formLabel: 'Demande d’évaluation gratuite',
  close: 'Fermer le formulaire',
  back: 'Retour',
  progressLabel: 'Progression du formulaire',
  stepAnnouncement: (current, total) => `Étape ${current} sur ${total}.`,

  intro: {
    eyebrow: 'Évaluation gratuite',
    title: 'Quelques questions rapides pour comprendre votre projet.',
    body: 'Environ 60 secondes. Évaluation gratuite, sans obligation.',
    start: 'Commencer',
    trust: 'Vos informations sont confidentielles.',
  },

  service: {
    question: 'Qu’est-ce qu’on peut faire pour vous?',
    hint: 'Choisissez le service qui vous intéresse. Si vous n’êtes pas certain, choisissez « Je ne suis pas certain » - c’est correct.',
    options: [
      { key: 'pave-uni', label: 'Pavé uni', hint: 'Entrée, terrasse, trottoir', icon: 'paver' },
      {
        key: 'muret',
        label: 'Muret ou mur de soutènement',
        hint: 'Muret, mur décoratif',
        icon: 'wall',
      },
      {
        key: 'margelle',
        label: 'Margelle ou marches',
        hint: 'Marches, bordures',
        icon: 'steps',
      },
      { key: 'drainage', label: 'Drainage', hint: 'Problème d’eau', icon: 'drain' },
      {
        key: 'lavage-sous-pression',
        label: 'Lavage sous pression',
        hint: 'Nettoyage de surface',
        icon: 'wash',
      },
      {
        key: 'amenagement-exterieur',
        label: 'Aménagement extérieur',
        hint: 'Cour, foyer, terrasse',
        icon: 'yard',
      },
      {
        key: 'unsure',
        label: 'Je ne suis pas certain',
        hint: 'On vous aidera à voir clair',
        icon: 'question',
      },
    ],
  },

  problem: {
    hint: 'Choisissez ce qui ressemble le plus à votre situation. Si rien ne correspond exactement, choisissez « Autre chose ».',
    groups: {
      'pave-uni': {
        question: 'Qu’est-ce qui se passe avec votre pavé?',
        options: [
          { key: 'sinking', label: 'Le pavé s’affaisse', hint: 'Des endroits sont plus bas' },
          {
            key: 'moving',
            label: 'Le pavé bouge ou se déplace',
            hint: 'Ça bouge quand on marche dessus',
          },
          {
            key: 'cracks',
            label: 'Des fissures apparaissent',
            hint: 'Dans le pavé ou les joints',
          },
          {
            key: 'water',
            label: 'L’eau s’accumule sur la surface',
            hint: 'Des flaques après la pluie',
          },
          { key: 'joints', label: 'Les joints s’effritent', hint: 'Le sable polymère part' },
          {
            key: 'replacement',
            label: 'Je veux refaire mon pavé',
            hint: 'Remplacement complet',
          },
          {
            key: 'new-install',
            label: 'Je veux une nouvelle installation',
            hint: 'Nouveau projet',
          },
          { key: 'other', label: 'Autre chose', hint: 'Rien de tout ça ne correspond' },
        ],
      },
      muret: {
        question: 'Qu’est-ce qui vous inquiète avec votre muret?',
        options: [
          { key: 'leaning', label: 'Le muret penche', hint: 'Il n’est plus droit' },
          {
            key: 'moving',
            label: 'Des blocs bougent ou se déplacent',
            hint: 'Les blocs ne tiennent plus en place',
          },
          { key: 'cracks', label: 'Il y a des fissures', hint: 'Dans les blocs ou les joints' },
          {
            key: 'crumbling',
            label: 'Le mur s’effrite ou se détériore',
            hint: 'La surface se dégrade',
          },
          { key: 'unstable', label: 'Ça semble instable', hint: 'Pas sécuritaire' },
          {
            key: 'new-install',
            label: 'Je veux en construire un nouveau',
            hint: 'Nouveau muret',
          },
          { key: 'other', label: 'Autre chose', hint: 'Rien de tout ça ne correspond' },
        ],
      },
      margelle: {
        question: 'Qu’est-ce qui se passe avec vos marches?',
        options: [
          { key: 'moving', label: 'Les marches bougent', hint: 'Ça bouge en montant' },
          {
            key: 'sinking',
            label: 'Les marches s’affaissent',
            hint: 'Elles ne sont plus au niveau',
          },
          { key: 'unsafe', label: 'C’est instable ou dangereux', hint: 'Risque de chute' },
          { key: 'replacement', label: 'Je veux remplacer les marches', hint: 'Remplacement' },
          {
            key: 'new-install',
            label: 'Je veux une nouvelle installation',
            hint: 'Nouvelles marches',
          },
          { key: 'other', label: 'Autre chose', hint: 'Rien de tout ça ne correspond' },
        ],
      },
      drainage: {
        question: 'Quel problème d’eau avez-vous?',
        options: [
          {
            key: 'pooling',
            label: 'L’eau s’accumule sur le pavé ou dans la cour',
            hint: 'Des flaques qui restent',
          },
          {
            key: 'toward-house',
            label: 'L’eau se dirige vers la maison',
            hint: 'Vers la fondation',
          },
          { key: 'basement', label: 'J’ai de l’eau au sous-sol', hint: 'Infiltration' },
          { key: 'soggy', label: 'Le terrain est toujours humide', hint: 'Sol détrempé' },
          {
            key: 'unknown-source',
            label: 'Je ne sais pas d’où vient le problème',
            hint: 'De l’eau quelque part, source incertaine',
          },
          { key: 'other', label: 'Autre chose', hint: 'Rien de tout ça ne correspond' },
        ],
      },
      'lavage-sous-pression': {
        question: 'Qu’est-ce qui vous amène aujourd’hui?',
        options: [
          { key: 'dirty', label: 'Mon pavé est sale ou taché', hint: 'Nettoyage général' },
          { key: 'moss', label: 'De la mousse s’est installée', hint: 'Mousse verte' },
          {
            key: 'weeds',
            label: 'Des mauvaises herbes poussent dans les joints',
            hint: 'Herbes dans les joints',
          },
          { key: 'faded', label: 'La surface est décolorée', hint: 'Le pavé a pâli' },
          { key: 'seasonal', label: 'Entretien annuel', hint: 'Nettoyage de saison' },
          { key: 'other', label: 'Autre chose', hint: 'Autre besoin de nettoyage' },
        ],
      },
      'amenagement-exterieur': {
        question: 'Quel type d’aménagement avez-vous en tête?',
        options: [
          { key: 'driveway', label: 'Nouvelle entrée', hint: 'Nouvelle entrée en pavé uni' },
          { key: 'patio', label: 'Terrasse', hint: 'Terrasse en pavé uni' },
          { key: 'backyard', label: 'Cour arrière', hint: 'Aménagement de cour' },
          { key: 'firepit', label: 'Foyer', hint: 'Foyer extérieur' },
          { key: 'outdoor-kitchen', label: 'Cuisine extérieure', hint: 'Cuisine d’été' },
          { key: 'fountain', label: 'Fontaine', hint: 'Fontaine ou bassin' },
          { key: 'heated', label: 'Pavé uni chauffant', hint: 'Système de déneigement' },
          { key: 'other', label: 'Autre projet', hint: 'Quelque chose d’autre' },
        ],
      },
      unsure: {
        question: 'Qu’est-ce qui vous préoccupe présentement?',
        options: [
          {
            key: 'surface',
            label: 'Mon pavé ou ma terrasse a un problème',
            hint: 'Surface extérieure',
          },
          { key: 'wall', label: 'Mon muret ou mon mur a un problème', hint: 'Mur ou muret' },
          {
            key: 'steps',
            label: 'Mes marches ou mes margelles ont un problème',
            hint: 'Marches et accès',
          },
          { key: 'water', label: 'J’ai un problème d’eau', hint: 'Drainage ou accumulation' },
          { key: 'dirty', label: 'Mes surfaces sont sales', hint: 'Nettoyage' },
          {
            key: 'new-project',
            label: 'Je veux aménager mon extérieur',
            hint: 'Nouveau projet',
          },
          { key: 'unknown', label: 'Je ne sais pas trop', hint: 'Aidez-moi à comprendre' },
        ],
      },
    },
  },

  location: {
    question: 'Votre projet se trouve où?',
    hint: 'On dessert Laval et la Rive-Nord. Choisissez votre secteur.',
    options: [
      { key: 'laval', label: 'Laval', hint: '' },
      { key: 'terrebonne', label: 'Terrebonne', hint: '' },
      { key: 'blainville', label: 'Blainville', hint: '' },
      { key: 'boisbriand', label: 'Boisbriand', hint: '' },
      { key: 'rosemere', label: 'Rosemère', hint: '' },
      { key: 'sainte-therese', label: 'Sainte-Thérèse', hint: '' },
      { key: 'mirabel', label: 'Mirabel', hint: '' },
      { key: 'montreal', label: 'Montréal', hint: '' },
      { key: 'other', label: 'Autre secteur', hint: '', icon: 'pin' },
    ],
    otherLabel: 'Votre ville',
    otherPlaceholder: 'Ex. : Saint-Eustache',
    otherContinue: 'Continuer',
    otherError: 'Indiquez votre ville.',
  },

  timeline: {
    question: 'Quand aimeriez-vous réaliser votre projet?',
    hint: 'Ça nous aide à planifier. Pas de pression.',
    options: [
      { key: 'asap', label: 'Dès que possible', hint: 'C’est pressant', icon: 'bolt' },
      {
        key: 'weeks',
        label: 'Dans les prochaines semaines',
        hint: 'D’ici un mois',
        icon: 'calendar',
      },
      {
        key: 'months',
        label: 'Dans les 1 à 3 prochains mois',
        hint: 'Cette saison',
        icon: 'calendar',
      },
      {
        key: 'exploring',
        label: 'Je regarde mes options',
        hint: 'Pas pressé, je m’informe',
        icon: 'eye',
      },
    ],
  },

  photos: {
    question: 'Vous voulez nous montrer votre projet?',
    hint: 'Une ou deux photos nous aideront à mieux comprendre. C’est optionnel - vous pouvez passer cette étape.',
    dropDesktop: 'Glissez vos photos ici ou cliquez pour les choisir',
    dropMobile: 'Cliquez pour prendre ou choisir une photo',
    constraints: 'JPEG, PNG, HEIC ou WebP. Jusqu’à 5 photos, 10 Mo chacune.',
    disclaimer:
      'Une photo nous donne une première impression. Pour un diagnostic précis et un devis, on doit voir le site sur place. L’évaluation sur place est gratuite.',
    addMore: 'Ajouter une autre photo',
    remove: 'Retirer',
    previewLabel: 'Aperçu de la photo',
    continue: 'Continuer',
    skip: 'Passer cette étape',
    counter: (count, max) => `${count} photo${count > 1 ? 's' : ''} sur ${max}`,
    errors: {
      type: 'On accepte seulement les images (JPG, PNG, HEIC, WebP).',
      size: 'La photo est trop grosse. Maximum 10 Mo par photo.',
      count: 'Maximum 5 photos. Retirez-en une pour en ajouter d’autres.',
    },
  },

  contact: {
    question: 'Comment peut-on vous rejoindre?',
    hint: 'On vous rappelle pour une première impression de votre projet. Sans obligation.',
    name: 'Votre nom',
    namePlaceholder: 'Jean Tremblay',
    phone: 'Votre numéro de téléphone',
    phonePlaceholder: '(438) 555-1234',
    email: 'Courriel',
    emailPlaceholder: 'jean@courriel.ca',
    optional: 'optionnel',
    submit: 'Recevoir mon évaluation gratuite',
    submitting: 'Envoi en cours…',
    consent:
      'En envoyant votre demande, vous acceptez qu’Oasis Construction utilise ces renseignements pour communiquer avec vous à propos de votre projet.',
    consentLink: 'Politique de confidentialité',
    privacy:
      'Vos informations sont confidentielles et ne seront utilisées que pour vous contacter au sujet de votre projet.',
    errorSummary: 'Il manque quelque chose :',
    errors: {
      name: 'Entrez votre nom.',
      phone: 'Entrez un numéro de téléphone valide à 10 chiffres.',
      email: 'Ce courriel ne semble pas valide. Vérifiez le format.',
    },
    failureTitle: 'Oups, quelque chose s’est mal passé',
    failureBody:
      'Votre demande n’a pas pu être envoyée. Réessayez, ou appelez-nous au (438) 505-4846.',
    rateLimitTitle: 'Demande déjà reçue',
    rateLimitBody:
      'Plusieurs demandes ont déjà été envoyées depuis cet appareil. Réessayez dans quelques minutes ou appelez-nous au (438) 505-4846.',
    offlineTitle: 'Pas de connexion',
    offlineBody: 'Vérifiez votre internet et réessayez. Vos réponses sont conservées.',
  },

  summaryLabel: 'Votre demande',

  confirmation: {
    title: (firstName) => `Merci, ${firstName}! On a bien reçu votre demande.`,
    body: 'Un membre de l’équipe Oasis Construction communiquera avec vous dans les {responseTime} pour une première impression de votre projet.',
    nextTitle: 'Ce qui se passe maintenant',
    next: [
      'On regarde votre demande et vos photos, si vous en avez envoyées.',
      'On vous appelle pour une première impression et pour planifier une évaluation sur place.',
      'L’évaluation sur place est gratuite. Sans obligation.',
    ],
    waitTitle: 'Pas envie d’attendre?',
    callCta: 'Appelez-nous',
    testimonialTitle: 'Pendant que vous attendez',
    projectsCta: 'Voir nos projets',
    closeCta: 'Fermer',
  },
};

/* ----------------------------------------------------------------- english */

const en: GuidedCopy = {
  formLabel: 'Free assessment request',
  close: 'Close the form',
  back: 'Back',
  progressLabel: 'Form progress',
  stepAnnouncement: (current, total) => `Step ${current} of ${total}.`,

  intro: {
    eyebrow: 'Free assessment',
    title: 'A few quick questions so we understand your project.',
    body: 'About 60 seconds. Free assessment, no obligation.',
    start: 'Get started',
    trust: 'Your information stays confidential.',
  },

  service: {
    question: 'What can we do for you?',
    hint: 'Pick the service you are interested in. If you are not sure, choose “I’m not sure” - that’s fine.',
    options: [
      {
        key: 'pave-uni',
        label: 'Interlocking pavers',
        hint: 'Driveway, patio, walkway',
        icon: 'paver',
      },
      {
        key: 'muret',
        label: 'Retaining wall',
        hint: 'Garden or structural wall',
        icon: 'wall',
      },
      { key: 'margelle', label: 'Steps and coping', hint: 'Steps, edging', icon: 'steps' },
      { key: 'drainage', label: 'Drainage', hint: 'A water problem', icon: 'drain' },
      {
        key: 'lavage-sous-pression',
        label: 'Pressure washing',
        hint: 'Surface cleaning',
        icon: 'wash',
      },
      {
        key: 'amenagement-exterieur',
        label: 'Landscape construction',
        hint: 'Yard, fire pit, patio',
        icon: 'yard',
      },
      {
        key: 'unsure',
        label: 'I’m not sure',
        hint: 'We’ll help you figure it out',
        icon: 'question',
      },
    ],
  },

  problem: {
    hint: 'Pick whatever is closest to your situation. If nothing fits exactly, choose “Something else”.',
    groups: {
      'pave-uni': {
        question: 'What is happening with your pavers?',
        options: [
          { key: 'sinking', label: 'The pavers are sinking', hint: 'Some spots sit lower' },
          {
            key: 'moving',
            label: 'The pavers move or shift',
            hint: 'They move when you walk on them',
          },
          { key: 'cracks', label: 'Cracks are showing', hint: 'In the pavers or the joints' },
          { key: 'water', label: 'Water pools on the surface', hint: 'Puddles after the rain' },
          {
            key: 'joints',
            label: 'The joints are washing out',
            hint: 'Polymeric sand is leaving',
          },
          { key: 'replacement', label: 'I want my pavers redone', hint: 'Full replacement' },
          { key: 'new-install', label: 'I want a new installation', hint: 'A new project' },
          { key: 'other', label: 'Something else', hint: 'None of these fit' },
        ],
      },
      muret: {
        question: 'What worries you about your wall?',
        options: [
          { key: 'leaning', label: 'The wall is leaning', hint: 'It is no longer straight' },
          {
            key: 'moving',
            label: 'Blocks are moving or shifting',
            hint: 'They no longer hold',
          },
          { key: 'cracks', label: 'There are cracks', hint: 'In the blocks or the joints' },
          {
            key: 'crumbling',
            label: 'The wall is crumbling',
            hint: 'The surface is breaking down',
          },
          { key: 'unstable', label: 'It feels unstable', hint: 'It does not feel safe' },
          { key: 'new-install', label: 'I want to build a new one', hint: 'A new wall' },
          { key: 'other', label: 'Something else', hint: 'None of these fit' },
        ],
      },
      margelle: {
        question: 'What is happening with your steps?',
        options: [
          { key: 'moving', label: 'The steps move', hint: 'They shift as you climb' },
          { key: 'sinking', label: 'The steps are sinking', hint: 'No longer level' },
          { key: 'unsafe', label: 'They are unstable or unsafe', hint: 'A fall risk' },
          { key: 'replacement', label: 'I want the steps replaced', hint: 'Replacement' },
          { key: 'new-install', label: 'I want a new installation', hint: 'New steps' },
          { key: 'other', label: 'Something else', hint: 'None of these fit' },
        ],
      },
      drainage: {
        question: 'What water problem do you have?',
        options: [
          {
            key: 'pooling',
            label: 'Water pools on the pavers or in the yard',
            hint: 'Puddles that stay',
          },
          {
            key: 'toward-house',
            label: 'Water runs toward the house',
            hint: 'Toward the foundation',
          },
          { key: 'basement', label: 'I have water in the basement', hint: 'Seepage' },
          { key: 'soggy', label: 'The ground is always wet', hint: 'Waterlogged soil' },
          {
            key: 'unknown-source',
            label: 'I don’t know where it comes from',
            hint: 'Water somewhere, source unclear',
          },
          { key: 'other', label: 'Something else', hint: 'None of these fit' },
        ],
      },
      'lavage-sous-pression': {
        question: 'What brings you here today?',
        options: [
          { key: 'dirty', label: 'My pavers are dirty or stained', hint: 'General cleaning' },
          { key: 'moss', label: 'Moss has taken hold', hint: 'Green moss' },
          {
            key: 'weeds',
            label: 'Weeds are growing in the joints',
            hint: 'Weeds in the joints',
          },
          { key: 'faded', label: 'The surface has faded', hint: 'The colour has gone pale' },
          { key: 'seasonal', label: 'Yearly upkeep', hint: 'Seasonal cleaning' },
          { key: 'other', label: 'Something else', hint: 'Another cleaning need' },
        ],
      },
      'amenagement-exterieur': {
        question: 'What kind of project do you have in mind?',
        options: [
          { key: 'driveway', label: 'A new driveway', hint: 'New interlocking driveway' },
          { key: 'patio', label: 'A patio', hint: 'Interlocking patio' },
          { key: 'backyard', label: 'The back yard', hint: 'Yard landscaping' },
          { key: 'firepit', label: 'A fire pit', hint: 'Outdoor fireplace' },
          { key: 'outdoor-kitchen', label: 'An outdoor kitchen', hint: 'Summer kitchen' },
          { key: 'fountain', label: 'A fountain', hint: 'Fountain or water feature' },
          { key: 'heated', label: 'Heated pavers', hint: 'Snow-melt system' },
          { key: 'other', label: 'Another project', hint: 'Something else' },
        ],
      },
      unsure: {
        question: 'What is on your mind right now?',
        options: [
          {
            key: 'surface',
            label: 'Something is wrong with my pavers or patio',
            hint: 'An outdoor surface',
          },
          {
            key: 'wall',
            label: 'Something is wrong with my wall',
            hint: 'Wall or garden wall',
          },
          {
            key: 'steps',
            label: 'Something is wrong with my steps or coping',
            hint: 'Steps and access',
          },
          { key: 'water', label: 'I have a water problem', hint: 'Drainage or pooling' },
          { key: 'dirty', label: 'My surfaces are dirty', hint: 'Cleaning' },
          { key: 'new-project', label: 'I want to landscape my yard', hint: 'A new project' },
          { key: 'unknown', label: 'I really don’t know', hint: 'Help me work it out' },
        ],
      },
    },
  },

  location: {
    question: 'Where is your project?',
    hint: 'We serve Laval and the North Shore. Choose your area.',
    options: [
      { key: 'laval', label: 'Laval', hint: '' },
      { key: 'terrebonne', label: 'Terrebonne', hint: '' },
      { key: 'blainville', label: 'Blainville', hint: '' },
      { key: 'boisbriand', label: 'Boisbriand', hint: '' },
      { key: 'rosemere', label: 'Rosemère', hint: '' },
      { key: 'sainte-therese', label: 'Sainte-Thérèse', hint: '' },
      { key: 'mirabel', label: 'Mirabel', hint: '' },
      { key: 'montreal', label: 'Montréal', hint: '' },
      { key: 'other', label: 'Another area', hint: '', icon: 'pin' },
    ],
    otherLabel: 'Your city',
    otherPlaceholder: 'e.g. Saint-Eustache',
    otherContinue: 'Continue',
    otherError: 'Enter your city.',
  },

  timeline: {
    question: 'When would you like the work done?',
    hint: 'It helps us plan. No pressure.',
    options: [
      { key: 'asap', label: 'As soon as possible', hint: 'It is urgent', icon: 'bolt' },
      {
        key: 'weeks',
        label: 'In the next few weeks',
        hint: 'Within a month',
        icon: 'calendar',
      },
      {
        key: 'months',
        label: 'In the next 1 to 3 months',
        hint: 'This season',
        icon: 'calendar',
      },
      {
        key: 'exploring',
        label: 'I’m looking at my options',
        hint: 'No rush, just looking',
        icon: 'eye',
      },
    ],
  },

  photos: {
    question: 'Would you like to show us the project?',
    hint: 'One or two photos help us understand. It’s optional - you can skip this step.',
    dropDesktop: 'Drag your photos here, or click to choose them',
    dropMobile: 'Tap to take or choose a photo',
    constraints: 'JPEG, PNG, HEIC or WebP. Up to 5 photos, 10 MB each.',
    disclaimer:
      'A photo gives us a first impression. For a precise diagnosis and a quote we have to see the site in person. The on-site assessment is free.',
    addMore: 'Add another photo',
    remove: 'Remove',
    previewLabel: 'Photo preview',
    continue: 'Continue',
    skip: 'Skip this step',
    counter: (count, max) => `${count} of ${max} photos`,
    errors: {
      type: 'We only accept images (JPG, PNG, HEIC, WebP).',
      size: 'That photo is too large. 10 MB per photo maximum.',
      count: 'Five photos maximum. Remove one to add another.',
    },
  },

  contact: {
    question: 'How can we reach you?',
    hint: 'We call you back with a first impression of your project. No obligation.',
    name: 'Your name',
    namePlaceholder: 'John Tremblay',
    phone: 'Your phone number',
    phonePlaceholder: '(438) 555-1234',
    email: 'Email',
    emailPlaceholder: 'john@email.ca',
    optional: 'optional',
    submit: 'Get my free assessment',
    submitting: 'Sending…',
    consent:
      'By sending your request you agree that Oasis Construction may use this information to contact you about your project.',
    consentLink: 'Privacy policy',
    privacy:
      'Your information stays confidential and is only used to contact you about your project.',
    errorSummary: 'Something is missing:',
    errors: {
      name: 'Enter your name.',
      phone: 'Enter a valid 10-digit phone number.',
      email: 'That email doesn’t look valid. Check the format.',
    },
    failureTitle: 'Something went wrong',
    failureBody: 'Your request could not be sent. Try again, or call us at (438) 505-4846.',
    rateLimitTitle: 'We already have your request',
    rateLimitBody:
      'Several requests have already been sent from this device. Try again in a few minutes, or call us at (438) 505-4846.',
    offlineTitle: 'No connection',
    offlineBody: 'Check your internet and try again. Your answers are kept.',
  },

  summaryLabel: 'Your request',

  confirmation: {
    title: (firstName) => `Thank you, ${firstName}! We have your request.`,
    body: 'Someone from the Oasis Construction team will get in touch within {responseTime} with a first impression of your project.',
    nextTitle: 'What happens now',
    next: [
      'We look at your request and your photos, if you sent any.',
      'We call you with a first impression and to book an on-site assessment.',
      'The on-site assessment is free. No obligation.',
    ],
    waitTitle: 'Don’t want to wait?',
    callCta: 'Call us',
    testimonialTitle: 'While you wait',
    projectsCta: 'See our projects',
    closeCta: 'Close',
  },
};

const copy: Record<Locale, GuidedCopy> = { fr, en };

export function guidedCopy(locale: Locale): GuidedCopy {
  return copy[locale];
}

/* ------------------------------------------------------------------ lookup */

/** The label a key carries in `locale`, for the lead payload and the recap. */
export function serviceChoice(locale: Locale, key: GuidedServiceKey) {
  return copy[locale].service.options.find((option) => option.key === key);
}

export function problemChoice(locale: Locale, service: GuidedServiceKey, key: string) {
  return copy[locale].problem.groups[service].options.find((option) => option.key === key);
}

export function locationChoice(locale: Locale, key: LocationKey) {
  return copy[locale].location.options.find((option) => option.key === key);
}

export function timelineChoice(locale: Locale, key: TimelineKey) {
  return copy[locale].timeline.options.find((option) => option.key === key);
}
