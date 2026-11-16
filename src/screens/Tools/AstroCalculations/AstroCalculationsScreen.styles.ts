import { app_colors, typography } from "../../../helpers/variables";

export const astroCalculationsScreenStyles = {
  header: {
    gap: 4,

    title: {
      ...typography.ztNature.screenTitle,
      color: app_colors.primary.main,
    },

    subtitle: {
      ...typography.dmMono.regular.subline,
      color: app_colors.primary.medium,
    },
  },

  section: {
    gap: 10,
    marginTop: 10,

    grid: {
      display: "flex" as const,
      flexDirection: "row" as const,
      flexWrap: "wrap" as const,
      gap: 10,
    },
  },
};
