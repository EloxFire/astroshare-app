import { app_colors, gaps, radius, spacing, typography, withOpacity } from "../../helpers/variables";

export const inputWithIconStyles = {
  container: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    gap: gaps.iconToText,
    borderWidth: 1,
    borderColor: withOpacity(app_colors.grey, 0.5),
    borderRadius: radius.searchField,
    paddingVertical: spacing.banner.vertical,
    paddingHorizontal: spacing.banner.horizontal,
  },

  input: {
    flex: 1,
    padding: 0,
    color: app_colors.black,
    ...typography.dmMono.regular.searchPlaceholder,
  },
};
