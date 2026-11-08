import { globalStyles } from "../../../helpers/globalStyles";
import { app_colors } from "../../../helpers/variables";

export const observationCardStyles = {
  // Carte blanche bordée (defaultCard) en ligne : illustration ronde, textes, chevron poussé à droite.
  card: {
    ...globalStyles.defaultCard,
    display: "flex" as const,
    flexDirection: "row" as const,
    alignItems: "center" as const,
    justifyContent: "space-between" as const,

    // Illustration ronde de l'objet : un disque sombre sert de repli tant qu'aucune image n'est
    // fournie. width/height explicites sur l'<Image> : ils l'emportent sur la taille intrinsèque
    // d'une image chargée par require() (voir docs/agents-reference.md §2).
    illustration: {
      width: 70,
      height: 70,
      borderRadius: 100,
      backgroundColor: app_colors.primary.main,
    },

    content: {
      display: "flex" as const,
      flexDirection: "column" as const,
      justifyContent: "center" as const,
      alignItems: "flex-start" as const,
      marginLeft: 10,
      gap: 5,

      label: {
        fontSize: 10,
        fontFamily: "DMMonoMedium" as const,
        color: app_colors.accent.main,
        textTransform: "uppercase" as const,
      },

      title: {
        fontSize: 25,
        lineHeight: 25,
        fontFamily: "ZTNatureBold" as const,
        color: app_colors.primary.main,
      },

      name: {
        fontSize: 14,
        lineHeight: 14,
        fontFamily: "ZTNatureBold" as const,
        color: app_colors.primary.main,
      },

      details: {
        fontSize: 10,
        fontFamily: "DMMonoRegular" as const,
        color: app_colors.primary.main,
        marginTop: 5,
      },
    },

    // flex:1 : occupe la place restante pour pousser le chevron contre le bord droit.
    chevronContainer: {
      display: "flex" as const,
      flexDirection: "row" as const,
      justifyContent: "flex-end" as const,
      alignItems: "center" as const,
      flex: 1,
    },
  },
};
