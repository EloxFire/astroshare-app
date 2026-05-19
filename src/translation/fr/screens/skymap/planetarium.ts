const loadingStepsTranslations = {
  scene: {
    WAIT: {
      title: "Initialisation de la scène",
      detail: "En attente du contexte WebGL",
    },
    LIVE: {
      title: "Initialisation de la scène",
      detail: "Création de la scène 3D, de la caméra et du renderer",
    },
    DONE: {
      title: "Initialisation de la scène",
      detail: "Scène 3D, caméra et renderer prêts",
    },
    ERROR: {
      title: "Initialisation de la scène",
      detail: "Échec pendant l'initialisation de la scène 3D",
    },
  },
  background: {
    WAIT: {
      title: "Dôme d'arrière-plan",
      detail: "Le chargement de la texture de la Voie lactée n'a pas encore commencé",
    },
    LIVE: {
      title: "Dôme d'arrière-plan",
      detail: "Chargement et préparation de la texture de la Voie lactée",
    },
    DONE: {
      title: "Dôme d'arrière-plan",
      detail: "Texture de la Voie lactée appliquée au dôme céleste",
    },
    ERROR: {
      title: "Dôme d'arrière-plan",
      detail: "Impossible de charger ou préparer la texture de la Voie lactée",
    },
  },
  ground: {
    WAIT: {
      title: "Masque d'horizon",
      detail: "Le dôme de sol local n'a pas encore été généré",
    },
    LIVE: {
      title: "Masque d'horizon",
      detail: "Calcul de l'horizon local à partir de la position de l'observateur",
    },
    DONE: {
      title: "Masque d'horizon",
      detail: "Horizon local aligné avec le zénith et le nord",
    },
    ERROR: {
      title: "Masque d'horizon",
      detail: "Échec lors de la construction ou de l'alignement du masque d'horizon",
    },
  },
  atmosphere: {
    WAIT: {
      title: "Shader d'atmosphère",
      detail: "La préparation du ciel atmosphérique n'a pas encore commencé",
    },
    LIVE: {
      title: "Shader d'atmosphère",
      detail: "Calcul des uniforms solaires et création du dôme atmosphérique",
    },
    DONE: {
      title: "Shader d'atmosphère",
      detail: "Atmosphère initialisée avec les couleurs et l'opacité du ciel",
    },
    ERROR: {
      title: "Shader d'atmosphère",
      detail: "Impossible d'initialiser le shader ou le dôme d'atmosphère",
    },
  },
  constellations: {
    WAIT: {
      title: "Surcouches des constellations",
      detail: "Les lignes et labels des constellations n'ont pas encore été préparés",
    },
    LIVE: {
      title: "Surcouches des constellations",
      detail: "Génération des tracés et chargement des labels des constellations",
    },
    DONE: {
      title: "Surcouches des constellations",
      detail: "Lignes et labels des constellations prêts",
    },
    ERROR: {
      title: "Surcouches des constellations",
      detail: "Échec lors du chargement des tracés ou labels des constellations",
    },
  },
  compass: {
    WAIT: {
      title: "Repères du compas",
      detail: "Les repères cardinaux n'ont pas encore été chargés",
    },
    LIVE: {
      title: "Repères du compas",
      detail: "Chargement et positionnement des marqueurs N, E, S et W",
    },
    DONE: {
      title: "Repères du compas",
      detail: "Repères cardinaux positionnés sur l'horizon",
    },
    ERROR: {
      title: "Repères du compas",
      detail: "Impossible de charger ou positionner les repères du compas",
    },
  },
  stars: {
    WAIT: {
      title: "Champ d'étoiles",
      detail: "Le catalogue d'étoiles n'a pas encore été projeté",
    },
    LIVE: {
      title: "Champ d'étoiles",
      detail: "Projection des étoiles et création des buffers GPU",
    },
    DONE: {
      title: "Champ d'étoiles",
      detail: "Nuage d'étoiles généré et shader prêt",
    },
    ERROR: {
      title: "Champ d'étoiles",
      detail: "Échec lors de la création du champ d'étoiles",
    },
  },
  planets: {
    WAIT: {
      title: "Planètes",
      detail: "Les maillages planétaires n'ont pas encore été créés",
    },
    LIVE: {
      title: "Planètes",
      detail: "Création des maillages et textures des planètes",
    },
    DONE: {
      title: "Planètes",
      detail: "Maillages planétaires prêts",
    },
    ERROR: {
      title: "Planètes",
      detail: "Impossible de créer les maillages des planètes",
    },
  },
  moon: {
    WAIT: {
      title: "Lune",
      detail: "Le maillage lunaire n'a pas encore été préparé",
    },
    LIVE: {
      title: "Lune",
      detail: "Création du maillage lunaire et chargement de ses textures",
    },
    DONE: {
      title: "Lune",
      detail: "Maillage lunaire et normal map prêts",
    },
    ERROR: {
      title: "Lune",
      detail: "Échec lors de la création de la Lune",
    },
  },
  sun: {
    WAIT: {
      title: "Soleil",
      detail: "Le maillage solaire n'a pas encore été préparé",
    },
    LIVE: {
      title: "Soleil",
      detail: "Création du disque solaire et de sa lueur",
    },
    DONE: {
      title: "Soleil",
      detail: "Soleil et halo lumineux initialisés",
    },
    ERROR: {
      title: "Soleil",
      detail: "Impossible de créer le Soleil ou son halo",
    },
  },
  dso: {
    WAIT: {
      title: "Objets du ciel profond",
      detail: "Les textures et maillages DSO n'ont pas encore été préparés",
    },
    LIVE: {
      title: "Objets du ciel profond",
      detail: "Création des billboards DSO et mise en file des textures distantes",
    },
    DONE: {
      title: "Objets du ciel profond",
      detail: "Groupe des objets du ciel profond prêt",
    },
    ERROR: {
      title: "Objets du ciel profond",
      detail: "Échec lors de la création des objets du ciel profond",
    },
  },
  grids: {
    WAIT: {
      title: "Grilles de coordonnées",
      detail: "Les grilles azimutales et équatoriales n'ont pas encore été générées",
    },
    LIVE: {
      title: "Grilles de coordonnées",
      detail: "Génération des grilles azimutales et équatoriales",
    },
    DONE: {
      title: "Grilles de coordonnées",
      detail: "Grilles de coordonnées prêtes",
    },
    ERROR: {
      title: "Grilles de coordonnées",
      detail: "Impossible de générer les grilles de coordonnées",
    },
  },
  finalize: {
    WAIT: {
      title: "Assemblage final",
      detail: "La scène n'a pas encore été assemblée",
    },
    LIVE: {
      title: "Assemblage final",
      detail: "Assemblage du graphe de scène et préparation du premier rendu",
    },
    DONE: {
      title: "Assemblage final",
      detail: "Scène prête pour le premier affichage interactif",
    },
    ERROR: {
      title: "Assemblage final",
      detail: "Échec lors de l'assemblage final de la scène",
    },
  },
} as const;

export const planetariumTranslations = {
  title: "Planétarium 3D",
  subTitle: "// Visualisez les étoiles et les planètes en 3D",
  loading: {
    title: "Chargement du planétarium",
    subtitle: "Préparation en cours, merci de patienter...",
    progressMeta: "Progression : {{progress}}%",
    completedSteps: "Étapes complétées : {{completed}} / {{total}}",
    detailedSteps: "Détails des étapes",
    liveActivity: "Activité en direct",
    failedTitle: "Échec de l'initialisation du planétarium",
    badges: {
      WAIT: "ATTENTE",
      LIVE: "EN COURS",
      DONE: "TERMINÉ",
      ERROR: "ERREUR",
    },
    steps: loadingStepsTranslations,
  },
}
