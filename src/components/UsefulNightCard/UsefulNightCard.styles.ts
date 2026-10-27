import { app_colors, withOpacity } from "../../helpers/variables";

const ROW_TRACK_HEIGHT = 8;
const ROW_ICON_SIZE = 18;
const ROW_GAP = 8;

export const usefulNightCardStyles = {
  title: {
    color: app_colors.primary.main,
    fontSize: 16,
    fontFamily: "ZTNatureBold",
    textTransform: "uppercase" as const,
  },

  header: {
    display: "flex" as const,
    flexDirection: "row" as const,
    justifyContent: "space-between" as const,
    alignItems: "flex-end" as const,
    marginTop: 14,

    duration: {
      fontFamily: "ZTNatureBold",
      fontSize: 32,
      lineHeight: 32,
      color: app_colors.primary.main,
    },

    range: {
      fontFamily: "DMMonoMedium",
      fontSize: 13,
      color: app_colors.primary.main,
    },
  },

  unavailable: {
    fontFamily: "DMMonoRegular",
    fontSize: 12,
    color: app_colors.primary.medium,
    marginTop: 14,
  },

  // Icône + piste dans la MÊME rangée (alignItems:"center"), plutôt que deux colonnes parallèles
  // séparées : avec des hauteurs différentes (icône 18px, piste 8px) et le même `gap` entre lignes,
  // deux colonnes indépendantes dérivent l'une de l'autre au fil des lignes (chaque ligne décale un
  // peu plus). Ici l'alignement vertical de chaque icône avec SA piste est garanti par construction.
  //
  // Le repère "maintenant" ne peut alors plus être positionné en % par rapport à une colonne de
  // pistes dédiée (il n'y en a plus) : il est posé dans un calque à part (`overlay`), décalé d'un
  // `left` fixe égal à la largeur icône+gap — exactement l'espace qu'occupe aussi chaque piste dans
  // sa rangée (icône taille fixe, piste flex:1) — ce qui fait coïncider la largeur de l'overlay avec
  // celle des pistes, et rend son `left:X%` interne cohérent avec elles.
  tracks: {
    marginTop: 22,
    position: "relative" as const,

    rows: {
      display: "flex" as const,
      flexDirection: "column" as const,
      gap: ROW_GAP,
    },

    row: {
      display: "flex" as const,
      flexDirection: "row" as const,
      alignItems: "center" as const,
      gap: ROW_GAP,

      icon: {
        width: ROW_ICON_SIZE,
        height: ROW_ICON_SIZE,
        borderRadius: ROW_ICON_SIZE / 2,
        display: "flex" as const,
        alignItems: "center" as const,
        justifyContent: "center" as const,
      },

      track: {
        flex: 1,
        height: ROW_TRACK_HEIGHT,
        borderRadius: ROW_TRACK_HEIGHT / 2,
        backgroundColor: withOpacity(app_colors.primary.main, 0.06),
        overflow: "hidden" as const,
        position: "relative" as const,

        segment: {
          position: "absolute" as const,
          top: 0,
          bottom: 0,
          borderRadius: ROW_TRACK_HEIGHT / 2,
        },
      },
    },

    overlay: {
      position: "absolute" as const,
      top: 0,
      bottom: 0,
      left: ROW_ICON_SIZE + ROW_GAP,
      right: 0,

      now: {
        position: "absolute" as const,
        top: -16,
        bottom: 0,
        alignItems: "center" as const,

        label: {
          position: "absolute" as const,
          top: 0,
          fontFamily: "DMMonoMedium",
          fontSize: 10,
          color: app_colors.accent.main,
        },

        marker: {
          position: "absolute" as const,
          top: 14,
          bottom: 0,
          width: 2,
          borderRadius: 1,
          backgroundColor: app_colors.accent.main,
        },
      },
    },
  },

  axis: {
    display: "flex" as const,
    flexDirection: "row" as const,
    justifyContent: "space-between" as const,
    marginTop: 6,
    paddingLeft: ROW_ICON_SIZE + ROW_GAP, // s'aligne avec le début de la colonne des pistes

    label: {
      fontFamily: "DMMonoRegular",
      fontSize: 9,
      color: app_colors.primary.medium,
    },
  },

  pills: {
    display: "flex" as const,
    flexDirection: "row" as const,
    gap: 8,
    marginTop: 14,

    pill: {
      flex: 1,
    },
  },
};
