import { globalStyles } from "../../helpers/globalStyles";
import { app_colors, gaps, radius, spacing, typography, withOpacity } from "../../helpers/variables";

export const inputWithIconStyles = {
  container: {
    flex: 1,
    flexDirection: "row" as const,
    alignItems: "center" as const,
    gap: gaps.iconToText,
    borderWidth: 1,
    borderColor: app_colors.accent.light,
    borderRadius: radius.searchField,
    paddingVertical: spacing.banner.vertical,
    paddingHorizontal: spacing.banner.horizontal,
    backgroundColor: app_colors.white,

    withSuggestions: {
      borderBottomLeftRadius: 0,
      borderBottomRightRadius: 0,
      borderBottomWidth: 0,
    },
  },

  label: {
    ...globalStyles.categoryTitle,
    fontSize: 12,

    required: {
      color: app_colors.red.main,
    },
  },

  input: {
    flex: 1,
    padding: 0,
    color: app_colors.black,
    ...typography.dmMono.regular.searchPlaceholder,
  },

  // Superposé au reste de l'écran (position absolute, ancré au bas du champ) plutôt qu'en flux
  // normal : sinon, dans un formulaire, son apparition pousserait tout le contenu en dessous.
  suggestionsContainer: {
    position: "absolute" as const,
    top: "100%" as const,
    left: 0,
    right: 0,
    backgroundColor: app_colors.white,
    borderWidth: 1,
    borderColor: app_colors.accent.light,
    borderBottomLeftRadius: radius.searchField,
    borderBottomRightRadius: radius.searchField,
    zIndex: 10,
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
