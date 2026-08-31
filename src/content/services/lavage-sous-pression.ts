import type { Service } from './types';

export const lavageSousPression: Service = {
  key: 'lavage-sous-pression',
  hero: 'scene-nettoyage-allee',
  detail: 'scene-nettoyage-jet',
  related: ['pave-uni', 'margelle'],
  photoFirst: false,
  copy: {
    fr: {
      name: 'Lavage sous pression',
      short: 'Nettoyage en profondeur de vos surfaces extérieures.',
      material: 'Surface lavée',
      eyebrow: 'Service',
      title: 'Lavage sous pression : nettoyage en profondeur de vos surfaces',
      lede: 'Le lavage sous pression, c’est plus qu’un nettoyage esthétique. C’est l’entretien qui prolonge la vie de votre pavé, enlève la mousse et les mauvaises herbes, et prépare la surface pour le ressablage si nécessaire.',

      symptomsTitle: 'Ce que vous voyez',
      symptoms:
        'Votre pavé est décoloré? De la mousse pousse entre les morceaux? Des taches persistent? La surface paraît vieille et terne?',

      causesTitle: 'Ce qui cause le problème',
      causes: [
        'La décoloration et la croissance de mousse sont causées par l’accumulation de saleté, de pollen, et d’humidité au fil des saisons.',
        'Le gel-dégel et l’humidité créent un environnement favorable à la mousse, surtout dans les zones ombragées et là où l’eau reste après la pluie.',
      ],

      solutionTitle: 'Ce qu’on fait',
      solution: [
        'On nettoie en profondeur avec un équipement professionnel, on enlève la mousse et les mauvaises herbes.',
        'Si nécessaire, on applique un produit de protection et on ressable les joints — parce qu’un lavage qui vide les joints sans les remplir laisse la surface plus vulnérable qu’avant.',
      ],

      includesTitle: 'Ce que les travaux peuvent comprendre',
      includes: [
        'Évaluation du type de surface et de la pression appropriée',
        'Nettoyage à pression de la surface',
        'Retrait de la mousse et des mauvaises herbes dans les joints',
        'Traitement anti-mousse si nécessaire',
        'Ressablage des joints au sable polymère',
        'Rinçage et nettoyage du périmètre',
      ],

      surfacesTitle: 'Surfaces visées',
      surfaces: [
        'Entrées et stationnements en pavé',
        'Terrasses et patios',
        'Trottoirs et allées',
        'Murets et margelles',
        'Contours de piscine',
      ],

      note: 'Un lavage redonne à une surface sa couleur, mais il ne corrige rien de structurel : un pavé qui s’affaisse restera affaissé, propre. Si on voit que le vrai problème est la base ou le drainage, on vous le dira plutôt que de laver et de partir.',

      localTitle: 'À Laval et sur la Rive-Nord',
      local:
        'Après un hiver de sel et d’abrasifs, la plupart des surfaces en pavé de la région sortent du printemps ternes et les joints vidés. C’est le moment de l’année où le lavage et le ressablage font le plus de différence.',

      process: [
        {
          step: '01',
          title: 'Évaluation',
          text: 'On regarde la surface, le type de matériau et le niveau de saleté.',
        },
        {
          step: '02',
          title: 'Lavage',
          text: 'On nettoie avec la pression appropriée au type de surface.',
        },
        {
          step: '03',
          title: 'Traitement',
          text: 'On applique un anti-mousse si nécessaire.',
        },
        {
          step: '04',
          title: 'Ressablage',
          text: 'On remet du sable polymère dans les joints si nécessaire.',
        },
        {
          step: '05',
          title: 'Vérification',
          text: 'On vérifie le résultat et on nettoie le site.',
        },
      ],

      priceTitle: 'Ce qui influence le prix',
      priceLede: 'Le coût d’un lavage sous pression dépend de plusieurs facteurs :',
      priceFactors: [
        'La surface à nettoyer',
        'Le niveau de saleté et de mousse',
        'Le type de surface',
        'Le ressablage des joints, s’il est nécessaire',
        'L’accès à l’eau et au site',
      ],
      priceNote:
        'C’est le service le plus simple à chiffrer des six : dans bien des cas, une photo et les dimensions suffisent pour un devis. L’évaluation reste gratuite.',

      faqTitle: 'Questions fréquentes',
      faq: [
        {
          q: 'Le lavage sous pression endommage-t-il le pavé?',
          a: 'Avec la bonne pression et la bonne technique, non. On adapte la pression au type de surface pour ne pas endommager le pavé ou les joints. C’est un jet trop serré, tenu trop près, qui creuse la surface d’un pavé de béton et vide les joints inutilement.',
        },
        {
          q: 'Faut-il ressabler après un lavage?',
          a: 'Presque toujours, sur du pavé. Un lavage enlève une partie du sable des joints en même temps que la saleté. Des joints laissés vides laissent les pavés bouger et l’eau descendre. Le ressablage n’est pas un extra décoratif, c’est ce qui referme la surface.',
        },
        {
          q: 'À quelle fréquence faut-il laver une surface en pavé?',
          a: 'Ça dépend de l’ombre, des arbres et de l’exposition. Une entrée ensoleillée peut tenir plusieurs années; une terrasse sous les arbres verdit chaque saison. Un lavage tous les deux ou trois ans est un rythme courant dans la région.',
        },
      ],

      warrantyTitle: 'Garantie',
      warranty: '{warrantyTerms}',

      metaTitle: 'Lavage sous pression Laval | Oasis Construction',
      metaDescription:
        'Lavage sous pression pour pavé uni, terrasses et surfaces extérieures à Laval et sur la Rive-Nord. Évaluation gratuite. Appelez (438) 505-4846.',
    },

    en: {
      name: 'Pressure washing',
      short: 'A deep clean for your exterior surfaces.',
      material: 'Washed surface',
      eyebrow: 'Service',
      title: 'Pressure washing: a deep clean for your surfaces',
      lede: 'Pressure washing is more than a cosmetic clean. It is the upkeep that extends the life of your pavers, removes moss and weeds, and prepares the surface for re-sanding where that is needed.',

      symptomsTitle: 'What you are seeing',
      symptoms:
        'Are your pavers discoloured? Is moss growing between them? Are there stains that will not come off? Does the surface just look old and dull?',

      causesTitle: 'What causes it',
      causes: [
        'Discolouration and moss come from dirt, pollen and moisture building up season after season.',
        'Freeze-thaw and damp create good conditions for moss, particularly in shaded areas and anywhere water lingers after rain.',
      ],

      solutionTitle: 'What we do',
      solution: [
        'We clean thoroughly with professional equipment and remove the moss and weeds.',
        'Where it is needed we apply a protective treatment and re-sand the joints — because a wash that empties the joints without refilling them leaves the surface more exposed than it was.',
      ],

      includesTitle: 'What the work can include',
      includes: [
        'Assessing the surface type and the right pressure for it',
        'Pressure washing the surface',
        'Removing moss and weeds from the joints',
        'Moss treatment where needed',
        'Re-sanding the joints with polymeric sand',
        'Rinsing and clearing the perimeter',
      ],

      surfacesTitle: 'Suitable surfaces',
      surfaces: [
        'Paver driveways and parking areas',
        'Patios and terraces',
        'Walkways',
        'Walls and coping',
        'Pool surrounds',
      ],

      note: 'A wash brings a surface’s colour back, but it corrects nothing structural: pavers that have settled will still be settled, just clean. If we can see the real problem is the base or the drainage, we will tell you rather than wash it and leave.',

      localTitle: 'In Laval and the North Shore',
      local:
        'After a winter of salt and grit, most paver surfaces in the region come out of spring dull with their joints emptied. It is the time of year when washing and re-sanding make the most difference.',

      process: [
        {
          step: '01',
          title: 'Assessment',
          text: 'We look at the surface, the material and how much build-up there is.',
        },
        {
          step: '02',
          title: 'Washing',
          text: 'We clean at the pressure that the surface can take.',
        },
        {
          step: '03',
          title: 'Treatment',
          text: 'We apply a moss treatment where it is needed.',
        },
        {
          step: '04',
          title: 'Re-sanding',
          text: 'We put polymeric sand back in the joints where that is needed.',
        },
        {
          step: '05',
          title: 'Check',
          text: 'We check the result and clear the site.',
        },
      ],

      priceTitle: 'What affects the price',
      priceLede: 'The cost of a pressure wash depends on several things:',
      priceFactors: [
        'The area to be cleaned',
        'How much dirt and moss there is',
        'The type of surface',
        'Joint re-sanding, where it is needed',
        'Access to water and to the site',
      ],
      priceNote:
        'It is the most straightforward of the six services to price: in many cases a photo and the dimensions are enough for a quote. The assessment is still free.',

      faqTitle: 'Frequently asked questions',
      faq: [
        {
          q: 'Does pressure washing damage pavers?',
          a: 'With the right pressure and technique, no. We match the pressure to the surface so the pavers and the joints are not damaged. It is a tight jet held too close that erodes the face of a concrete paver and empties joints needlessly.',
        },
        {
          q: 'Do the joints need re-sanding afterwards?',
          a: 'Almost always, on pavers. Washing takes some of the joint sand out along with the dirt. Joints left empty let the pavers move and let water down. Re-sanding is not a decorative extra; it is what closes the surface back up.',
        },
        {
          q: 'How often should a paver surface be washed?',
          a: 'It depends on shade, trees and exposure. A sunny driveway can go several years; a patio under trees greens up every season. Every two or three years is a common rhythm in this area.',
        },
      ],

      warrantyTitle: 'Warranty',
      warranty: '{warrantyTerms}',

      metaTitle: 'Pressure washing Laval — Surface cleaning | Oasis',
      metaDescription:
        'Pressure washing for pavers, patios and exterior surfaces in Laval and the North Shore. Free assessment. Call (438) 505-4846.',
    },
  },
};
