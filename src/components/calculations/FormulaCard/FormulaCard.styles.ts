import { app_colors, radius, spacing, typography } from "../../../helpers/variables";

export const formulaCardStyles = {
  card: {
    backgroundColor: app_colors.yellow.light,
    borderRadius: radius.heroCard,
    padding: spacing.toolCard,
    gap: 8,

    formula: {
      // Pas de hauteur fixe : react-native-mathjax ajuste automatiquement la hauteur de sa WebView
      // au contenu rendu (voir message posté par la page HTML interne du package).
      minHeight: 28,
    },

    description: {
      ...typography.dmMono.regular.cardBody,
      color: app_colors.primary.main,
      fontSize: 12,
      lineHeight: 12 * 1.4,
    },
  },
};
