import { app_colors, radius, spacing, typography, withOpacity } from "../../../helpers/variables";

// Mêmes tokens que InfoTooltip (seule modale centrée existante dans l'app) : fond assombri,
// carte blanche centrée, radius.heroCard.
export const confirmModalStyles = {
  backdrop: {
    flex: 1,
    backgroundColor: withOpacity(app_colors.black, 0.4),
    justifyContent: "center" as const,
    alignItems: "center" as const,
    padding: spacing.screenMargin,
  },

  card: {
    width: "100%" as const,
    maxWidth: 340,
    backgroundColor: app_colors.white,
    borderRadius: radius.heroCard,
    padding: 18,
    display: "flex" as const,
    flexDirection: "column" as const,
    gap: 10,

    title: {
      color: app_colors.primary.main,
      ...typography.ztNature.cardTitle,
      fontSize: 17,
    },

    message: {
      fontFamily: "DMMonoRegular",
      fontSize: 13,
      lineHeight: 18,
      color: app_colors.primary.medium,
    },

    actions: {
      display: "flex" as const,
      flexDirection: "column" as const,
      gap: 8,
      marginTop: 6,
    },
  },
};
