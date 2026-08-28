import { app_colors, gaps, radius, spacing, typography, withOpacity } from "../../helpers/variables";

export const inputWithIconStyles = {
  container: {
    flex: 1,
    flexDirection: "row" as const,
    alignItems: "center" as const,
    gap: gaps.iconToText,
    borderWidth: 1,
    borderColor: withOpacity(app_colors.grey, 0.5),
    borderRadius: radius.searchField,
    paddingVertical: spacing.banner.vertical,
    paddingHorizontal: spacing.banner.horizontal,

    withSuggestions: {
      borderBottomLeftRadius: 0,
      borderBottomRightRadius: 0,
      borderBottomWidth: 0,
    },
  },

  input: {
    flex: 1,
    padding: 0,
    color: app_colors.black,
    ...typography.dmMono.regular.searchPlaceholder,
  },

  suggestionsContainer: {
    borderWidth: 1,
    borderColor: withOpacity(app_colors.grey, 0.5),
    borderBottomLeftRadius: radius.searchField,
    borderBottomRightRadius: radius.searchField,
    zIndex: 1,
  },

  suggestionText: {
    paddingVertical: spacing.banner.vertical,
    paddingHorizontal: spacing.banner.horizontal,
    color: app_colors.black,
    ...typography.dmMono.regular.searchPlaceholder,
    
    withBorder: {
      borderBottomWidth: 1,
      borderBottomColor: app_colors.primary.light,

    }
  },
};
