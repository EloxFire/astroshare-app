export const astroDataInfosTranslations = {
  dso: {
    title: "Objets du ciel profond",
    text1: "Toutes les données relatives aux objets du ciel profond proviennent d'une base de données sur-mesure, créée à partir de données des catalogues suivants :",
  },
  stars: {
    title: "Étoiles",
    text1: "Toutes les données relatives aux étoiles proviennent d'un export de la base de données du SIMBAD réalisé en juillet 2024",
  },
  planets: {
    title: "Planètes",
    text1: "Toutes les données relatives aux planètes sont le résultat de calculs astronomiques réalisés en interne dans l'application avec l'aide d'un outil indépendant : Observerly",
  },
  satellites: {
    title: "Satellites",
    iss: {
      title: "Station spatiale internationale (ISS)",
      text1: "Toutes les données relatives à l'ISS proviennent de l'API 'Where The Iss At (WTIA)' qui regroupe des données formattés en temps réel sur l'ISS.",
      text2: "WTIA utilise les données de la NASA, Space-track.com et CelesTrak.com pour fournir des informations précises sur la position de l'ISS.",
    },
    starlink: {
      title: "Starlink",
      text1: "Les données relatives à la visualisation du positionnement des satellites Starlink proviennent de l'API : starlinkapi (NPM)",
      text2: "Les données des lancements de satellites Starlink proviennent de l'API : Launch Library 2 (The Space Devs)"
    }
  },
  launchData: {
    title: "Données de lancements de fusées",
    text1: "Toutes les données des lancements de fusées sont récupérées en temps réel depuis l'API : Launch Library 2 (The Space Devs)"
  },
  solarWeather: {
    title: "Météo solaire",
    text1: "Toutes les données relatives à la météo solaire proviennent des sites suivants :",
    text2: "- Solar Dynamics Observatory (sdo.gsfc.nasa.gov)\n- Solar And Heliospheric Observatory (soho.nascom.nasa.gov)\n- National Oceanic and Atmospheric Administration (noaa.gov)"
  },
  apod: {
    title: "Image du jour (APOD)",
    text1: "Les images et textes de la fonctionnalité d'Image du jour proviennent de l'API officielle de la NASA : Astronomy Picture of the Day (APOD).",
  },
  skymap: {
    title: "Cartes du ciel",
    text1: "Les cartes du ciel générées par l'application sont réalisées à partir des calculs internes dans l'application grâce à l'outil indépendant : Observerly",
  },
  moonPhases: {
    title: "Phases de la Lune",
    text1: "Les informations et phases de la Lune affichées sont calculées en interne dans l'application grâce à l'outil indépendant : Observerly",
  },
  conjunctions: {
    title: "Conjonctions planétaires",
    text1: "Les informations sur les conjonctions planétaires affichées sont calculées en interne dans l'application grâce à l'outil indépendant : Observerly",
  },
  eclipses: {
    title: "Éclipses solaires et lunaires",
    text1: "Les informations sur les éclipses affichées dans l'application sont calculées grâce à l'API de l'IMCCE (Institut de Mécanique Céleste et de Calcul des Éphémérides)",
  }
}