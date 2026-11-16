import { app_colors, radius, withOpacity } from "../../../helpers/variables";

export const nextLaunchCountdownStyles = {
  // Carte claire autonome : reste lisible qu'elle soit posée sur le fond clair de la fiche détail
  // ou imbriquée dans le hero sombre de NextLaunchCard.
  container: {
    backgroundColor: app_colors.primary.main,
    borderRadius: radius.heroCard,
    padding: 14,
    display: "flex" as const,
    flexDirection: "column" as const,
    gap: 10,
    borderWidth: 1,
    borderColor: app_colors.accent.light,

    topRow: {
      display: "flex" as const,
      flexDirection: "row" as const,
      justifyContent: "space-between" as const,
      alignItems: "center" as const,

      label: {
        color: app_colors.accent.light,
        fontFamily: "DMMonoMedium",
        fontSize: 12,
        textTransform: "uppercase" as const,
      },

      date: {
        color: app_colors.accent.light,
        fontFamily: "DMMonoRegular",
        fontSize: 11,
      },
    },

    readoutRow: {
      display: "flex" as const,
      flexDirection: "row" as const,
      alignItems: "center" as const,
      gap: 10,

      dayChip: {
        backgroundColor: app_colors.yellow.main,
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: radius.pill,

        text: {
          color: app_colors.primary.main,
          fontFamily: "ZTNatureBold",
          fontSize: 16,
        },
      },

      // Même gabarit que dayChip mais rond et centré sur une icône (issue connue : Success/Failure/
      // Partial Failure) plutôt que sur un texte "J-N".
      outcomeChip: {
        width: 34,
        height: 34,
        borderRadius: 17,
        alignItems: "center" as const,
        justifyContent: "center" as const,
      },

      time: {
        display: "flex" as const,
        flexDirection: "row" as const,
        alignItems: "baseline" as const,

        hours: {
          color: app_colors.yellow.main,
          fontFamily: "DMMonoMedium",
          fontSize: 32,
          fontVariant: ["tabular-nums" as const],
        },

        rest: {
          color: app_colors.accent.light,
          fontFamily: "DMMonoMedium",
          fontSize: 32,
          fontVariant: ["tabular-nums" as const],
        },

        // Libellé de statut final ("Échec", "Succès"...) à la place des chiffres : même ligne de
        // base, même rythme visuel que le compte à rebours.
        outcomeLabel: {
          fontFamily: "ZTNatureBold",
          fontSize: 24,
        },
      },
    },

    timeline: {
      marginTop: 4,

      track: {
        height: 3,
        borderRadius: 2,
        backgroundColor: app_colors.accent.light,
        overflow: "visible" as const,
        justifyContent: "center" as const,
        marginBottom: 10,

        fill: {
          height: 3,
          borderRadius: 2,
          backgroundColor: app_colors.accent.main,
        },

        marker: {
          position: "absolute" as const,
          top: -11,
          width: 24,
          height: 24,
          borderRadius: 12,
          backgroundColor: app_colors.accent.main,
          alignItems: "center" as const,
          justifyContent: "center" as const,
          // Pour centrer le marqueur sur son `left` en %, plutôt que de le faire déborder à droite.
          marginLeft: -12,
        },
      },

      labels: {
        marginTop: 2,
        display: "flex" as const,
        flexDirection: "row" as const,
        justifyContent: "space-between" as const,

        text: {
          color: app_colors.accent.light,
          fontFamily: "DMMonoRegular",
          fontSize: 10,
          textTransform: "uppercase" as const,
        },
      },
    },
  },

  // Surcharges pour variant="inline" (posé directement sur le hero sombre de NextLaunchCard,
  // sans sa propre carte blanche) : seules les couleurs changent, la structure reste celle de
  // `container` ci-dessus — fusionnées via des tableaux de styles dans le composant.
  inline: {
    container: {
      backgroundColor: "transparent",
      borderWidth: 0,
      padding: 0,
    },

    mutedText: {
      color: withOpacity(app_colors.white, 0.55),
    },

    restText: {
      color: withOpacity(app_colors.white, 0.75),
    },

    track: {
      backgroundColor: withOpacity(app_colors.white, 0.2),
    },
  },
};
