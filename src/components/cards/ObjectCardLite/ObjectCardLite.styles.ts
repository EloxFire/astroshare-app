import { app_colors, radius } from "../../../helpers/variables";

export const objectCardLiteStyles = {
  card: {
    display: "flex" as const,
    flexDirection: "row" as const,
    justifyContent: "space-between" as const,
    alignItems: "center" as const,
    gap: 10,
    paddingVertical: 10,

    withBorder: {
      borderBottomWidth: 1,
      borderBottomColor: app_colors.primary.light,
    },

    texts: {
      display: "flex" as const,
      flexDirection: "column" as const,
      flex: 1,
      flexShrink: 1,
      gap: 2,

      title: {
        fontFamily: "ZTNatureBold",
        fontSize: 15,
        color: app_colors.primary.main,
      },

      subtitle: {
        fontFamily: "DMMonoRegular",
        fontSize: 11,
        color: app_colors.primary.medium,
      },
    },

    actions: {
      display: "flex" as const,
      flexDirection: "row" as const,
      alignItems: "center" as const,
      gap: 8,

      // Même paire fond/icône que la pastille de succès du Journal (iconContainer de
      // lastAchievementCard) : fond primary.main, icône ambre — repris ici pour l'état "actif".
      toggle: {
        width: 32,
        height: 32,
        borderRadius: radius.badge32,
        borderWidth: 1,
        borderColor: app_colors.accent.light,
        backgroundColor: app_colors.white,
        display: "flex" as const,
        alignItems: "center" as const,
        justifyContent: "center" as const,

        active: {
          backgroundColor: app_colors.primary.main,
          borderColor: app_colors.primary.main,
        },
      },

      // Léger surcroît d'espace avant le bouton de suppression : distinct des bascules par sa
      // nature (pas d'état actif/inactif, juste une action), pas la peine de l'aligner collé.
      remove: {
        marginLeft: 2,
      },
    },
  },
};
