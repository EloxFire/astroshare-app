import { globalStyles } from "../../../../../helpers/globalStyles";
import { app_colors, radius, withOpacity } from "../../../../../helpers/variables";

export const addNewObservatoryStepTwoStyles = {
  skyQualityContainer: {
    ...globalStyles.defaultCard,

    header: {
      display: "flex" as const,
      flexDirection: "row" as const,
      alignItems: "center" as const,
      justifyContent: "flex-start" as const,
      gap: 10,

      bortleNumber: {
        color: app_colors.accent.main,
        fontFamily: "ZTNatureBold",
        fontSize: 35,
        lineHeight: 35,
        marginHorizontal: 10,
      },
      
      bortleIndicator: {
        color: app_colors.primary.main,
        fontFamily: "ZTNatureBold",
        fontSize: 16,
      },
      
      bortleDescription: {
        color: app_colors.primary.medium,
        fontSize: 12,
        fontFamily: "DMMonoMedium",
      }
    },

    bortleScale: {
      display: "flex" as const,
      flexDirection: "row" as const,
      justifyContent: "space-between" as const,
      marginTop: 10,

      numberButton: {
        active: {
          borderWidth: 1,
          borderColor: app_colors.accent.main,
        },

        width: 32,
        height: 32,
        borderRadius: radius.badge32,
        backgroundColor: withOpacity(app_colors.grey, 0.5),
        alignItems: "center" as const,
        justifyContent: "center" as const,

        text: {
          fontFamily: "DMMonoMedium",
          fontSize: 16,

          active: {
            color: app_colors.accent.main,
          }
        },

      },

      colorLine: {
        width: '100%' as const,
        height: 5,
        borderRadius: radius.badge32,
      },

      scaleExtremes: {
        display: "flex" as const,
        flexDirection: "row" as const,
        justifyContent: "space-between" as const,

        text: {
          fontFamily: "DMMonoMedium",
          fontSize: 10,
          color: app_colors.primary.medium,
        }
      },

      sqmContainer: {
        display: "flex" as const,
        flexDirection: "row" as const,
        justifyContent: "space-between" as const,

        text: {
          fontFamily: "DMMonoMedium",
          fontSize: 12,
          color: app_colors.primary.medium,
        },

        value: {
          fontFamily: "DMMonoMedium",
          fontSize: 12,
          color: app_colors.primary.main,
        }
      }
    }
  },

  observatoryImagePicker: {
    borderWidth: 1,
    borderColor: app_colors.accent.light,
    borderRadius: radius.heroCard,
    borderStyle: "dashed" as const,
    height: 200,
    gap: 10,
    padding: 10,
    display: "flex" as const,
    alignItems: "center" as const,
    justifyContent: "center" as const,
    backgroundColor: app_colors.white,
    // overflow:"hidden" fait suivre à l'image le borderRadius du conteneur automatiquement
    // (le clip respecte le bord interne, juste sous la bordure) — pas besoin de recalculer un
    // rayon "inset" à la main sur l'<Image> elle-même.
    overflow: "hidden" as const,

    placeholder: {
      color: app_colors.primary.main,
      fontFamily: "DMMonoRegular",
      fontSize: 10,
      textDecorationLine: "underline" as const,
      textAlign: "center" as const,
    },

    imageContainer: {
      width: "100%" as const,
      height: "100%" as const,

      image: {
        width: "100%" as const,
        height: "100%" as const,
      },

      overlay: {
        position: "absolute" as const,
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.35)",
        display: "flex" as const,
        alignItems: "center" as const,
        justifyContent: "center" as const,

        text: {
          color: app_colors.white,
          fontFamily: "DMMonoMedium",
          fontSize: 12,
        }
      },

      deleteButton: {
        position: "absolute" as const,
        top: 8,
        right: 8,
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        display: "flex" as const,
        alignItems: "center" as const,
        justifyContent: "center" as const,
      }
    }
  },

  observatoryChipContainer: {
    display: "flex" as const,
    flexDirection: "row" as const,
    flexWrap: "wrap" as const,
    // La largeur exacte de chaque typeButton (2 colonnes) est calculée en JS à partir de la
    // largeur réelle mesurée de ce conteneur (onLayout, voir StepTwo.tsx) — (largeur - gap) / 2
    // — pour garantir un gap strict de 10px. Un width en "%" ne peut pas y arriver : le gap
    // s'ajoute par-dessus le %, il n'en est jamais déduit, donc deux éléments à 50%+gap
    // dépassent toujours 100% et se renvoient chacun à la ligne suivante.
    gap: 10,

    chipButton: {
      ...globalStyles.defaultCard,
      display: "flex" as const,
      flexDirection: "row" as const,
      alignItems: "center" as const,
      justifyContent: "center" as const,
      gap: 10,

      text: {
        fontFamily: "DMMonoMedium",
        fontSize: 12,
        textAlign: "center" as const,
      },

      active: {
        borderColor: app_colors.accent.main,
        borderWidth: 2,
      }
    }
  }
}