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

  // Liste dans le flux, collée sous le champ (qui perd alors ses coins et sa bordure du bas, voir
  // container.withSuggestions). Pas en position absolute par-dessus l'écran : voir le composant.
  suggestionsContainer: {
    backgroundColor: app_colors.white,
    borderWidth: 1,
    borderColor: app_colors.accent.light,
    borderBottomLeftRadius: radius.searchField,
    borderBottomRightRadius: radius.searchField,
    overflow: "hidden" as const,
  },

  suggestion: {
    paddingVertical: spacing.banner.vertical,
    paddingHorizontal: spacing.banner.horizontal,

    withBorder: {
      borderBottomWidth: 1,
      borderBottomColor: app_colors.primary.light,
    },

    // Sur le <Text> lui-même : posé sur le bouton qui l'entoure, ce style ne s'appliquait pas
    // (police système au lieu de DM Mono).
    text: {
      color: app_colors.black,
      ...typography.dmMono.regular.searchPlaceholder,
    },
  },
};
