import {ProFeature} from "../types/ProFeature";

const proFeaturesFr: ProFeature[] = [
  {
    name: "Planétarium 3D",
    description: "Explorez le ciel en temps réel avec un planétarium 3D complet : étoiles, planètes, DSO, constellations.",
    icon: require('../../../assets/icons/FiConstellation.png'),
  },
  {
    name: "Prédictions passages ISS",
    description: "Calculez les prochains passages de la Station Spatiale Internationale au-dessus de votre position.",
    icon: require('../../../assets/icons/FiSatellite.png'),
  },
  // {
  //   name: "Météo solaire avancée",
  //   description: "Accédez aux données complètes de la NASA/SOHO : coronographe CME, taches solaires et images multi-longueurs d'onde.",
  //   icon: require('../../../assets/icons/FiSun.png'),
  // },
  {
    name: "Index Kp & activité géomagnétique",
    description: "Suivez l'activité géomagnétique en temps réel et anticipez les aurores boréales avec l'historique Kp.",
    icon: require('../../../assets/icons/FiZap.png'),
  },
  {
    name: "Vent solaire en temps réel",
    description: "Vitesse, densité et température du vent solaire, mis à jour en continu depuis les capteurs NOAA.",
    icon: require('../../../assets/icons/SolarWind.png'),
  },
  {
    name: "Éclipses solaires & lunaires",
    description: "Calculez les prochaines éclipses avec trajectoire, magnitude et durée de totalité précises.",
    icon: require('../../../assets/icons/FiTransit.png'),
  },
  {
    name: "Conjonctions planétaires",
    description: "Retrouvez les dates et conditions d'observation des prochaines conjonctions entre planètes.",
    icon: require('../../../assets/icons/FiEarth.png'),
  },
  {
    name: "Carte de pollution lumineuse",
    description: "Visualisez les zones de ciel noir autour de vous et trouvez le meilleur site d'observation.",
    icon: require('../../../assets/icons/FiViewPoint.png'),
  },
  {
    name: "Satellites personnalisés",
    description: "Ajoutez n'importe quel satellite via son TLE et suivez sa trajectoire en temps réel.",
    icon: require('../../../assets/icons/FiDatabase.png'),
  },
  // {
  //   name: "Cartes des constellations",
  //   description: "Explorez des cartes détaillées de chaque constellation avec ses étoiles et leur histoire.",
  //   icon: require('../../../assets/icons/FiConstellation.png'),
  // },
]

const proFeaturesEn: ProFeature[] = [
  {
    name: "3D Planetarium",
    description: "Explore the sky in real time with a full 3D planetarium: stars, planets, DSO, constellations.",
    icon: require('../../../assets/icons/FiConstellation.png'),
  },
  {
    name: "ISS Pass Predictions",
    description: "Calculate the next International Space Station passes over your exact location.",
    icon: require('../../../assets/icons/FiSatellite.png'),
  },
  // {
  //   name: "Advanced Solar Weather",
  //   description: "Access full NASA/SOHO data: CME coronagraph, sunspots, and multi-wavelength solar images.",
  //   icon: require('../../../assets/icons/FiSun.png'),
  // },
  {
    name: "Kp Index & Geomagnetic Activity",
    description: "Track geomagnetic activity in real time and anticipate auroras with Kp history charts.",
    icon: require('../../../assets/icons/FiZap.png'),
  },
  {
    name: "Real-time Solar Wind",
    description: "Speed, density and temperature of the solar wind, updated continuously from NOAA sensors.",
    icon: require('../../../assets/icons/SolarWind.png'),
  },
  {
    name: "Solar & Lunar Eclipses",
    description: "Calculate upcoming eclipses with precise path, magnitude and totality duration.",
    icon: require('../../../assets/icons/FiTransit.png'),
  },
  {
    name: "Planetary Conjunctions",
    description: "Find the dates and observation conditions for upcoming conjunctions between planets.",
    icon: require('../../../assets/icons/FiEarth.png'),
  },
  {
    name: "Light Pollution Map",
    description: "Visualize dark-sky zones around you and find the best observation site nearby.",
    icon: require('../../../assets/icons/FiViewPoint.png'),
  },
  {
    name: "Custom Satellites",
    description: "Add any satellite via its TLE and track its trajectory in real time.",
    icon: require('../../../assets/icons/FiDatabase.png'),
  },
  // {
  //   name: "Constellation Maps",
  //   description: "Explore detailed maps of each constellation with its stars and their history.",
  //   icon: require('../../../assets/icons/FiConstellation.png'),
  // },
]

export const proFeaturesList: any = {
  'fr': proFeaturesFr,
  'en': proFeaturesEn
}
