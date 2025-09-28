import {ProFeature} from "../types/ProFeature";

const proFeaturesFr: ProFeature[] = [
  // {
  //   name: "Carte du ciel 3D",
  //   description: "Profitez d'un planétarium 3D complet, directement dans votre poche !",
  //   image: require('../../../assets/images/tools/skymap.png')
  // },
  {
    name: "Prédictions passages ISS",
    description: "Calculez les prochains passage de l'ISS au dessus de votre position",
    image: require('../../../assets/images/tools/isstracker.png')
  },
  {
    name: "Météo solaire avancée",
    description: "Analyser notre étoile avec des données encore plus précises et complètes.",
    image: require('../../../assets/images/tools/sun.png')
  },
  {
    name: "Outils de calculs d'éclipses",
    description: "Calculez les prochains transits, éclipses et plus encore avec nos outils de calculs.",
    image: require('../../../assets/images/tools/isstransit.png')
  },
  {
    name: "Et bien plus !",
    description: "Astroshare est mis à jour régulièrement avec de nouvelles fonctionnalités.",
    image: require('../../../assets/images/tools/skymap.png')
  },
]

const proFeaturesEn: ProFeature[] = [
  // {
  //   name: "3D Sky Map",
  //   description: "Enjoy a complete 3D planetarium, directly in your pocket!",
  //   image: require('../../../assets/images/tools/skymap.png')
  // },
  {
    name: "ISS Pass Predictions",
    description: "Calculate the next ISS passes over your location",
    image: require('../../../assets/images/tools/isstracker.png')
  },
  {
    name: "Advanced Solar Weather",
    description: "Analyze our star with even more precise and complete data.",
    image: require('../../../assets/images/tools/sun.png')
  },
  {
    name: "Eclipses calculation tools",
    description: "Calculate upcoming transits, eclipses and more with our calculation tools.",
    image: require('../../../assets/images/tools/isstransit.png')
  },
  {
    name: "And much more!",
    description: "Astroshare is regularly updated with new features.",
    image: require('../../../assets/images/tools/skymap.png')
  },
]

export const proFeaturesList: any = {
  'fr': proFeaturesFr,
  'en': proFeaturesEn
}