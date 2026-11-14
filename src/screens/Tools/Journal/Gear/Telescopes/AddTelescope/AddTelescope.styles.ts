import { globalStyles } from "../../../../../../helpers/globalStyles";
import { app_colors, radius, spacing } from "../../../../../../helpers/variables";

export const addTelescopeStyles = {
  form: {
    marginTop: 20,
    display: "flex" as const,
    flexDirection: "column" as const,
    gap: 10,

    formBlock: {
      display: "flex" as const,
      flexDirection: "column" as const,
      gap: 5,
      marginBottom: 20,
    },

    formRow: {
      display: "flex" as const,
      flexDirection: "row" as const,
      gap: 10,
    },

    // Même label que celui de InputWithIcon (globalStyles.categoryTitle en 12px), pour que "Type"
    // et "Usages" s'alignent visuellement avec "Nom"/"Marque"/"Modèle" au-dessus dans le formulaire.
    label: {
      ...globalStyles.categoryTitle,
      fontSize: 12,
    },

    // Sélecteur en pilules (Type : simple, Usages : multiple) — pas de composant partagé existant
    // pour ce pattern, voir chip.active pour l'état sélectionné (fond plein, inédit dans l'app :
    // les autres chips de l'app ne font qu'un contour, celui-ci reprend la maquette).
    chipsRow: {
      display: "flex" as const,
      flexDirection: "row" as const,
      flexWrap: "wrap" as const,
      gap: 10,

      chip: {
        backgroundColor: app_colors.white,
        borderWidth: 1,
        borderColor: app_colors.accent.light,
        borderRadius: radius.pill,
        paddingVertical: spacing.chip.vertical,
        paddingHorizontal: spacing.chip.horizontal + 4,

        text: {
          fontFamily: "DMMonoMedium",
          fontSize: 12,
          color: app_colors.primary.main,
        },

        active: {
          backgroundColor: app_colors.primary.main,
          borderColor: app_colors.primary.main,

          text: {
            color: app_colors.white,
          },
        },
      },
    },

    // Diamètre / Focale : même coquille que globalStyles.defaultCard, mais en ligne (label à
    // gauche, valeur numérique + unité à droite) plutôt qu'empilée.
    numberField: {
      ...globalStyles.defaultCard,
      flexDirection: "row" as const,
      alignItems: "center" as const,
      justifyContent: "space-between" as const,

      label: {
        fontFamily: "DMMonoMedium",
        fontSize: 14,
        color: app_colors.primary.main,

        required: {
          color: app_colors.red.main,
        },
      },

      valueContainer: {
        display: "flex" as const,
        flexDirection: "row" as const,
        alignItems: "flex-end" as const,
        gap: 4,

        value: {
          fontFamily: "ZTNatureBold",
          fontSize: 28,
          color: app_colors.primary.main,
          minWidth: 50,
          textAlign: "right" as const,
          padding: 0,
        },

        unit: {
          fontFamily: "DMMonoMedium",
          fontSize: 14,
          color: app_colors.primary.medium,
          marginBottom: 3,
        },
      },
    },

    actions: {
      marginTop: 20,
      display: "flex" as const,
      flexDirection: "column" as const,
      gap: 10,
    },
  }
}