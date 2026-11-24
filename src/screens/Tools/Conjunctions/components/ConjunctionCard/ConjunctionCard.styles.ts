import { globalStyles } from "../../../../../helpers/globalStyles";
import { app_colors, radius } from "../../../../../helpers/variables";

export const conjunctionCardStyles = {
  card: {
    ...globalStyles.defaultCard,
    display: "flex" as const,
    flexDirection: "row" as const,
    alignItems: "center" as const,
    gap: 12,

    icons: {
      display: "flex" as const,
      flexDirection: "row" as const,

      badge: {
        width: 36,
        height: 36,
        borderRadius: radius.badge38,
        backgroundColor: app_colors.accent.light,
        alignItems: "center" as const,
        justifyContent: "center" as const,

        // Le second badge chevauche légèrement le premier (même esprit qu'un groupe d'avatars) :
        // les deux objets d'une conjonction se rapprochent par définition, le picto le suggère.
        overlap: {
          marginLeft: -10,
          borderWidth: 2,
          borderColor: app_colors.white,
        },
      },
    },

    texts: {
      flex: 1,
      display: "flex" as const,
      flexDirection: "column" as const,
      gap: 2,

      title: {
        fontFamily: "ZTNatureBold",
        fontSize: 15,
        color: app_colors.primary.main,
      },

      date: {
        fontFamily: "DMMonoMedium",
        fontSize: 11.5,
        color: app_colors.primary.main,
        textTransform: "capitalize" as const,
      },

      subtitle: {
        fontFamily: "DMMonoRegular",
        fontSize: 11,
        color: app_colors.primary.medium,
      },
    },
  },
};
