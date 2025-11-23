export const calculationHomeTranslation = {
  title: "Calculs",
  subtitle: "Calculs astronomiques",
  intro: "Entrez les informations dont vous disposez. Le calculateur s'occupe du reste !",
  units: {
    mm: "mm",
    inch: "pouce",
  },
  actions: {
    compute: "Calculer",
    reset: "Effacer",
    missingValues: "Veuillez renseigner au moins deux valeurs",
  },
  sections: {
    instrument: {
      title: "Instrument",
      subtitle: "Focale, diamètre et unité",
      focalLabel: "Focale télescope",
      focalPlaceholder: "Saisir en {{unit}}",
      diameterLabel: "Diamètre télescope",
      unitLabel: "Unité",
    },
    eyepiece: {
      title: "Oculaire & champ",
      subtitle: "Paramètres visuels",
      focalLabel: "Focale oculaire",
      focalPlaceholder: "Focale (mm)",
      fieldLabel: "Champ oculaire",
      fieldPlaceholder: "Champ (°)",
    },
    camera: {
      title: "Caméra & confort",
      subtitle: "Taille de pixel et pupille de sortie",
      pixelLabel: "Taille pixel caméra",
      pixelPlaceholder: "µm",
      exitPupilLabel: "Pupille de sortie pour Gmin",
    },
    results: {
      title: "Résultats",
      subtitle: "Formules détaillées et valeurs numériques",
      cards: {
        focalRatio: {
          title: "Rapport focale",
          description: "Rapport f/D de l'instrument.",
          fallbackNote: "F = focale instrument et D = diamètre instrument",
        },
        magnification: {
          title: "Grossissement",
          description: "Grossissement obtenu avec l'oculaire choisi.",
          fallbackNote: "F = focale instrument et f = focale oculaire",
        },
        minMagnification: {
          title: "Grossissement minimum",
          description: "Grossissement associé à la pupille sélectionnée.",
          fallbackNote: "D = diamètre instrument et {{pupil}} mm = pupille de sortie choisie",
        },
        sampling: {
          title: "Échantillonnage",
          description: "Résolution en seconde d'arc par pixel.",
          fallbackNote: "p = taille pixel caméra (µm) et F = focale instrument (mm)",
        },
        fov: {
          title: "Champ réel",
          description: "Champ de vision obtenu (minutes d'arc).",
          fallbackNote: "C = champ oculaire (°) et G = grossissement",
        },
        exitPupil: {
          title: "Pupille de sortie",
          description: "Diamètre de la pupille de sortie (mm).",
          fallbackNote: "D = diamètre instrument (mm) et G = grossissement",
        },
        resolvingPower: {
          title: "Pouvoir séparateur",
          description: "Capacité à distinguer deux objets proches (secondes d'arc).",
          fallbackNote: "D = diamètre instrument (mm)",
        }
      }
    }
  }
}
