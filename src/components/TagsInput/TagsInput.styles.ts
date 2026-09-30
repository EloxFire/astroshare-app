import { globalStyles } from "../../helpers/globalStyles";
import { app_colors, radius, spacing, typography } from "../../helpers/variables";

export const tagsInputStyles = {
  wrapper: {
    display: "flex" as const,
    flexDirection: "column" as const,
    gap: 5,
    width: "100%" as const,
  },

  label: {
    ...globalStyles.categoryTitle,
    fontSize: 12,
  },

  // Même habillage (bordure, radius, fond) que le container d'InputWithIcon, pour que ce champ
  // ait l'air d'un input classique même s'il contient des tags en plus du texte en cours de saisie.
  container: {
    display: "flex" as const,
    flexDirection: "row" as const,
    flexWrap: "wrap" as const,
    alignItems: "center" as const,
    gap: 6,
    borderWidth: 1,
    borderColor: app_colors.accent.light,
    borderRadius: radius.searchField,
    paddingVertical: spacing.banner.vertical,
    paddingHorizontal: spacing.banner.horizontal,
    backgroundColor: app_colors.white,

    tag: {
      display: "flex" as const,
      flexDirection: "row" as const,
      alignItems: "center" as const,
      gap: 4,
      backgroundColor: app_colors.accent.light,
      borderRadius: 12,
      paddingVertical: 4,
      paddingHorizontal: 8,

      text: {
        color: app_colors.primary.main,
        fontFamily: "DMMonoMedium",
        fontSize: 12,
      }
    },

    // flexGrow (et non flex:1) : le champ doit occuper l'espace restant sur sa ligne dans un
    // conteneur qui wrap, pas rivaliser en largeur avec les tags déjà posés.
    input: {
      flexGrow: 1,
      minWidth: 80,
      padding: 0,
      color: app_colors.black,
      ...typography.dmMono.regular.searchPlaceholder,
    }
  }
}
