import { app_colors, radius, withOpacity } from "../../../helpers/variables";

export const weatherRadarMapStyles = {
  section: {
    display: "flex" as const,
    flexDirection: "column" as const,
    gap: 10,
  },

  mapContainer: {
    height: 220,
    borderRadius: radius.heroCard,
    overflow: "hidden" as const,
    position: "relative" as const,

    map: {
      height: "100%" as const,
      width: "100%" as const,
    },

    placeholder: {
      flex: 1,
      display: "flex" as const,
      alignItems: "center" as const,
      justifyContent: "center" as const,
      backgroundColor: app_colors.accent.light,
      gap: 8,

      text: {
        color: app_colors.primary.medium,
        fontSize: 12,
        fontFamily: "DMMonoRegular",
      },
    },
  },

  // Boutons posés directement sur la carte (couches, plein écran) — même convention visuelle que
  // les contrôles de SpaceWeatherScreen sur l'imagerie solaire (cercle translucide noir, icône
  // blanche), pour rester cohérent ailleurs dans l'app.
  floatingControls: {
    layerToggles: {
      position: "absolute" as const,
      top: 10,
      left: 10,
      display: "flex" as const,
      flexDirection: "row" as const,
      gap: 8,
    },

    // Style "visuel" seul (pas de position) : utilisé tel quel pour les boutons de couche (déjà
    // disposés en ligne par `layerToggles` ci-dessus), et combiné à `fullscreenToggle` ci-dessous
    // pour le bouton plein écran isolé — séparer les deux évite qu'un `position:absolute` commun
    // ne fasse s'empiler les boutons de couche au lieu de les aligner en ligne.
    buttonBase: {
      width: 36,
      height: 36,
      borderRadius: 18,
      display: "flex" as const,
      alignItems: "center" as const,
      justifyContent: "center" as const,
      backgroundColor: withOpacity(app_colors.black, 0.55),

      active: {
        backgroundColor: app_colors.accent.main,
      },
    },

    fullscreenToggle: {
      position: "absolute" as const,
      top: 10,
      right: 10,
    },

    closeButton: {
      position: "absolute" as const,
      top: 10,
      right: 10,
      width: 40,
      height: 40,
      borderRadius: 20,
      display: "flex" as const,
      alignItems: "center" as const,
      justifyContent: "center" as const,
      backgroundColor: withOpacity(app_colors.black, 0.55),
    },
  },

  // Panneau de légende, affiché/masqué par le bouton "Info" de `floatingControls` — sous la rangée
  // de boutons (top:56 ≈ hauteur de bouton + marge) plutôt qu'en bas, pour ne pas chevaucher le
  // badge horaire du plein écran.
  legend: {
    position: "absolute" as const,
    top: 56,
    left: 10,
    right: 10,
    display: "flex" as const,
    flexDirection: "column" as const,
    backgroundColor: withOpacity(app_colors.black, 0.75),
    borderRadius: radius.mediumCard,
    padding: 10,
    gap: 6,

    title: {
      color: app_colors.white,
      fontSize: 12,
      fontFamily: "ZTNatureBold",
      textTransform: "uppercase" as const,
    },

    label: {
      color: withOpacity(app_colors.white, 0.8),
      fontSize: 11,
      fontFamily: "DMMonoMedium",
    },

    gradient: {
      height: 8,
      borderRadius: 4,
    },

    scale: {
      display: "flex" as const,
      flexDirection: "row" as const,
      justifyContent: "space-between" as const,

      text: {
        color: withOpacity(app_colors.white, 0.6),
        fontSize: 10,
        fontFamily: "DMMonoRegular",
      },
    },

    note: {
      color: withOpacity(app_colors.white, 0.6),
      fontSize: 10,
      fontFamily: "DMMonoRegular",
      marginTop: 4,
    },
  },

  // Vue plein écran : la même carte en plus grand, dans un Modal plutôt qu'un composant à part —
  // partage l'état (couches, frame) du composant parent, pas de slider dupliqué ici (on referme
  // le modal pour revenir à la barre de contrôles normale).
  fullscreen: {
    flex: 1,
    backgroundColor: app_colors.black,
    position: "relative" as const,

    map: {
      flex: 1,
    },

    // Barre de contrôles du bas en plein écran : même contenu qu'en carte normale (voir
    // renderControls dans le composant), en carte flottante arrondie (même langage visuel que les
    // boutons de couches/plein écran) plutôt que collée bord à bord — une barre pleine largeur,
    // touchant les bords de l'écran, entre en conflit avec le geste "retour" du téléphone (zone de
    // detection système sur les bords) quand on essaie de glisser dessus ; la marge latérale (voir
    // `left`/`right`) éloigne la zone tactile de cette zone.
    controls: {
      position: "absolute" as const,
      left: 20,
      right: 20,
      borderRadius: 200,
      paddingHorizontal: 16,
      paddingVertical: 14,
      backgroundColor: withOpacity(app_colors.black, 0.7),
    },
  },

  // Lecture/pause de l'animation + heure de la frame affichée + position dans la séquence,
  // sous la carte plutôt qu'en overlay dessus (pas de lecture automatique, voir le composant).
  controls: {
    display: "flex" as const,
    flexDirection: "row" as const,
    alignItems: "center" as const,
    gap: 10,

    button: {
      width: 32,
      height: 32,
      borderRadius: 16,
      backgroundColor: app_colors.primary.main,
      display: "flex" as const,
      alignItems: "center" as const,
      justifyContent: "center" as const,
    },

    time: {
      color: app_colors.primary.main,
      fontSize: 12,
      fontFamily: "DMMonoMedium",
      minWidth: 36,
    },

    // Zone tactile plus grande que la piste visible (plus facile à attraper du doigt) — le padding
    // vertical agrandit la cible sans changer sa largeur (même largeur que `track`, pour que le
    // ratio touché/largeur utilisé par le composant reste cohérent avec le rendu visuel).
    trackTouchArea: {
      flex: 1,
      paddingVertical: 10,
      justifyContent: "center" as const,
      position: "relative" as const,
    },

    track: {
      height: 4,
      borderRadius: 2,
      backgroundColor: withOpacity(app_colors.primary.main, 0.12),
      overflow: "hidden" as const,

      fill: {
        height: "100%" as const,
        borderRadius: 2,
        backgroundColor: app_colors.accent.main,
      },

      // Poignée : sibling de `fill` dans le JSX (pas un enfant de `track`, dont l'overflow:hidden
      // la découperait) — même ratio (progressRatio) que le remplissage, recentrée via translateX.
      thumb: {
        position: "absolute" as const,
        top: "90%" as const,
        width: 14,
        height: 14,
        borderRadius: 7,
        backgroundColor: app_colors.accent.main,
        borderWidth: 2,
        borderColor: app_colors.white,
        transform: [{ translateX: -7 }, { translateY: -7 }],
      },
    },
  },
};
