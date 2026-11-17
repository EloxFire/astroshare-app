import { app_colors, radius, spacing } from "../../../../../helpers/variables";

export const locationBannerStyles = {
  banner: {
    backgroundColor: app_colors.accent.light,
    borderRadius: radius.pill,
    paddingVertical: spacing.banner.vertical,
    paddingHorizontal: spacing.banner.horizontal,
    display: "flex" as const,
    flexDirection: "row" as const,
    alignItems: "center" as const,
    gap: 6,
    flexWrap: "wrap" as const,
  },

  text: {
    fontFamily: "DMMonoRegular",
    fontSize: 10.5,
    color: app_colors.primary.main,
    flexShrink: 1,
  },

  link: {
    fontFamily: "DMMonoMedium",
    fontSize: 10.5,
    color: app_colors.accent.main,
  },
};
