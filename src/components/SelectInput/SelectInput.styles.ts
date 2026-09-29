import { globalStyles } from "../../helpers/globalStyles";
import { app_colors, gaps, radius, spacing, typography, withOpacity } from "../../helpers/variables";

// Même apparence que InputWithIcon (bordure, rayon, paddings, typo), pour que les deux types de
// champ se côtoient dans un formulaire sans différence visuelle.
export const selectInputStyles = {
  wrapper: {
    display: "flex" as const,
    flexDirection: "column" as const,
    gap: 5,
  },

  label: {
    ...globalStyles.categoryTitle,
    fontSize: 12,
  },

  field: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    gap: gaps.iconToText,
    borderWidth: 1,
    borderColor: app_colors.accent.light,
    borderRadius: radius.searchField,
    paddingVertical: spacing.banner.vertical,
    paddingHorizontal: spacing.banner.horizontal,
    backgroundColor: app_colors.white,

    // Liste ouverte : le champ et la liste forment un seul bloc (coins du bas repris par la liste).
    open: {
      borderBottomLeftRadius: 0,
      borderBottomRightRadius: 0,
    },

    value: {
      flex: 1,
      color: app_colors.black,
      ...typography.dmMono.regular.searchPlaceholder,

      placeholder: {
        color: app_colors.primary.medium,
      },
    },
  },

  options: {
    borderWidth: 1,
    // La bordure basse du champ sert de séparation avec la première option.
    borderTopWidth: 0,
    borderColor: app_colors.accent.light,
    borderBottomLeftRadius: radius.searchField,
    borderBottomRightRadius: radius.searchField,
    backgroundColor: app_colors.white,
    overflow: "hidden" as const,

    option: {
      flexDirection: "row" as const,
      alignItems: "center" as const,
      gap: gaps.iconToText,
      paddingVertical: spacing.banner.vertical,
      paddingHorizontal: spacing.banner.horizontal,

      withBorder: {
        borderBottomWidth: 1,
        borderBottomColor: app_colors.primary.light,
      },

      label: {
        flex: 1,
        color: app_colors.black,
        ...typography.dmMono.regular.searchPlaceholder,

        selected: {
          color: app_colors.accent.main,
        },
      },
    },
  },

  // Panneau (presentation "sheet") : même base que les autres panneaux de l'app (voir
  // DayDetailModal) — fond assombri, coins hauts arrondis, marges modalSheet.
  sheet: {
    backdrop: {
      flex: 1,
      justifyContent: "flex-end" as const,
      backgroundColor: withOpacity(app_colors.black, 0.4),
    },

    dismissArea: {
      position: "absolute" as const,
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
    },

    container: {
      maxHeight: "75%" as const,
      backgroundColor: app_colors.white,
      borderTopLeftRadius: radius.modalSheetTop,
      borderTopRightRadius: radius.modalSheetTop,
      paddingTop: spacing.modalSheet.top,
      paddingHorizontal: spacing.modalSheet.horizontal,
      // paddingBottom : calculé dans le composant (marge + inset bas de l'appareil).
      gap: 12,
    },

    header: {
      flexDirection: "row" as const,
      alignItems: "center" as const,
      gap: gaps.iconToText,

      title: {
        ...globalStyles.categoryTitle,
        flex: 1,
      },
    },

    // Quand les options dépassent la hauteur max du panneau, c'est la liste qui se réduit (et
    // défile), pas l'en-tête ni la recherche.
    list: {
      flexShrink: 1,
    },

    // Le panneau a déjà ses marges horizontales : pas de retrait supplémentaire sur les lignes.
    option: {
      paddingHorizontal: 0,
    },
  },
};
