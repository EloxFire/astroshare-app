import { app_colors, radius, typography, withOpacity } from "../../helpers/variables";

export const observabilityScoreCardStyles = {
  title: {
    color: app_colors.primary.main,
    fontSize: 16,
    fontFamily: "ZTNatureBold",
    textTransform: "uppercase" as const,
  },

  subtitle: {
    color: app_colors.primary.medium,
    fontSize: 14,
    fontFamily: "ZTNatureRegular",
  },

  body: {
    marginTop: 12,

    // Anneau de score + verdict en ligne (pas empilés) : remplit la largeur de la carte au lieu de
    // laisser un vide au centre, et reste compact en hauteur.
    hero: {
      display: "flex" as const,
      flexDirection: "row" as const,
      alignItems: "center" as const,
      gap: 14,
      marginBottom: 20,

      gauge: {
        main: {
          fontFamily: "ZTNatureBold",
          fontSize: 28,
          lineHeight: 28,
          color: app_colors.primary.main,
        },
        secondary: {
          fontFamily: "ZTNatureRegular",
          fontSize: 12,
          color: app_colors.primary.medium,
        },
      },

      info: {
        flex: 1,
        display: "flex" as const,
        flexDirection: "column" as const,
        gap: 5,

        advice: {
          fontFamily: "ZTNatureRegular",
          fontSize: 12,
          color: app_colors.primary.medium,
        },
      },
    },

    // Ligne "lune" : même traitement visuel que les tuiles (fond + pastille d'icône teintés par la
    // couleur de bonté du facteur), mais en chip pleine largeur plutôt qu'en tuile de grille — pour
    // rester "juste en dessous" du conseil sans lui ressembler à une donnée de plus dans la grille.
    moonNote: {
      display: "flex" as const,
      flexDirection: "row" as const,
      alignItems: "center" as const,
      gap: 6,
      borderRadius: radius.badge32,
      paddingVertical: 5,
      paddingHorizontal: 8,
      marginTop: 4,

      text: {
        flex: 1,
        fontFamily: "ZTNatureRegular",
        fontSize: 12,
        color: app_colors.primary.main,
      },
    },

    // Grille de tuiles (2 colonnes) plutôt qu'une liste de lignes empilées : chaque donnée a sa
    // propre carte teintée par sa couleur de "bonté" (voir getObservabilityScoreColor), avec une
    // pastille d'icône colorée — pour casser le côté plat d'une simple liste texte. Les styles des
    // enfants de la tuile (valeur, header, barre) sont des entrées à plat ici (tileXxx), pas
    // imbriquées dans `tile` lui-même, pour que `tile` reste un objet de style simple passé tel
    // quel à la View (pas de risque qu'une clé non-style parasite l'application du borderRadius).
    metricsGrid: {
      display: "flex" as const,
      flexDirection: "row" as const,
      flexWrap: "wrap" as const,
      gap: 8,
    },

    tile: {
      flexBasis: "47%" as const,
      flexGrow: 1,
      borderRadius: radius.mediumCard,
      padding: 8,
      gap: 5,
    },

    tileValueRow: {
      display: "flex" as const,
      flexDirection: "row" as const,
      alignItems: "baseline" as const,
      gap: 5,

      secondary: {
        fontFamily: "ZTNatureRegular",
        fontSize: 12,
        color: app_colors.primary.medium,
      },
    },

    tileValue: {
      fontFamily: "ZTNatureBold",
      fontSize: 16,
      color: app_colors.primary.main,
    },

    tileHeader: {
      display: "flex" as const,
      flexDirection: "row" as const,
      alignItems: "center" as const,
      gap: 6,

      iconBadge: {
        width: 25,
        height: 25,
        borderRadius: 50,
        display: "flex" as const,
        alignItems: "center" as const,
        justifyContent: "center" as const,
      },

      label: {
        fontFamily: "ZTNatureRegular",
        fontSize: 12,
        color: app_colors.primary.medium,
      },
    },

    tileBarTrack: {
      height: 3,
      borderRadius: 2,
      backgroundColor: withOpacity(app_colors.primary.main, 0.08),
      overflow: "hidden" as const,

      fill: {
        height: "100%" as const,
        borderRadius: 2,
      },
    },
  },
};
