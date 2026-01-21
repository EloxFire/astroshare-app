export const observationPlannerTranslations = {
  window: {
    title: "Fenêtre d'observation",
    subtitle: "Choisissez le créneau pendant lequel vous serez dehors.",
    start: "Début",
    end: "Fin",
    resetTonight: "Revenir à maintenant +3h",
  },
  filters: {
    title: "Affiner les suggestions",
    subtitle: "Limitez les objets selon votre instrument et la qualité du ciel.",
    magnitude: "Magnitude limite",
    minAltitude: "Altitude min (°)",
    maxSize: "Taille max (arcmin)",
    helper: "Ajoutez votre champ pour vérifier si l'objet rentre dans le capteur.",
    reset: "Réinitialiser les filtres",
    refresh: "Mettre à jour la liste",
    targets: {
      planets: "Planètes",
      stars: "Étoiles brillantes",
      dso: "Objets du ciel profond",
    },
    fov: {
      width: "Champ (°) - largeur",
      height: "Champ (°) - hauteur",
    },
  },
  results: {
    title: "Ordre optimisé",
    subtitle: "Classé par meilleur passage pendant le créneau choisi.",
    empty: "Aucun objet ne correspond à ce créneau avec ces filtres.",
    order: "Ordre",
    altitude: "Alt.",
    bestAt: "Max",
    visibility: "Visible %{percent}%",
    magnitude: "Mag",
    size: "Taille",
    fov: {
      ok: "Dans le champ",
      ko: "Trop grand",
    },
    details: "Voir le détail",
  },
  screen: {
    modal: {
      sunAboveHorizon: {
        title: "Attention",
        text: "Le Soleil sera au-dessus de l'horizon au début de votre session d'observation.\n\nCela peut affecter la visibilité des objets célestes. Voulez-vous continuer ?",
        cancel: "Annuler",
        continue: "Continuer",
      },
    },
    steps: {
      sessionDuration: "1. Durée de la session",
      objectTypes: "2. Type d'objets",
      otherFilters: "3. Autres filtres (optionnels)",
      results: "4. Résultats",
    },
    labels: {
      startDateTime: "Date et heure de début",
      endDateTime: "Date et heure de fin",
      magnitude: "Magnitude",
      altitude: "Altitude",
      maxResults: "Nombre max de résultats",
      perObjectTime: "Temps par objet (minutes)",
    },
    placeholders: {
      minMag: "Mag min",
      maxMag: "Mag max",
      minAlt: "Alt min (°)",
      maxAlt: "Alt max (°)",
      maxResults: "Résultats max (10 par défaut)",
      perObjectTime: "5 min par défaut",
    },
    buttons: {
      search: "Lancer la recherche",
      searchAgain: "Relancer la recherche",
      clear: "Supprimer la recherche",
    },
    messages: {
      empty: "Aucun résultat ne correspond à vos critères",
      recommended: "Objets recommandés pour votre session d'observation :",
    },
    errors: {
      planning: "Une erreur est survenue lors de la planification de l'observation.",
    },
  },
};
