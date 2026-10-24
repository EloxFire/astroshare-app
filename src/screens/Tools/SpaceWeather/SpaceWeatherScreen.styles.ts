import { app_colors, radius, typography, withOpacity } from "../../../helpers/variables";

export const spaceWeatherScreenStyles = {
  imageryContainer: {
    display: "flex" as const,
    flexDirection: "column" as const,
    alignItems: "center" as const,
    gap: 20,

    image: {
      width: 350,
      height: 350,
      resizeMode: "cover" as const,
      borderWidth: 1,
      borderColor: app_colors.accent.light,
      borderRadius: radius.badge44,
      borderStyle: "dashed" as const,

      caption: {
        fontFamily: "ZTNatureBold",
        fontSize: 16,
        color: app_colors.primary.main,
      }
    },

    imageActions: {
      position: "absolute" as const,
      bottom: 10,
      right: 10,
      display: "flex" as const,
      flexDirection: "row" as const,
      gap: 8,

      button: {
        width: 36,
        height: 36,
        borderRadius: 18,
        display: "flex" as const,
        alignItems: "center" as const,
        justifyContent: "center" as const,
        backgroundColor: withOpacity(app_colors.black, 0.55),
      },
    },
  },

  fullscreenModal: {
    flex: 1,
    backgroundColor: app_colors.black,
    display: "flex" as const,
    alignItems: "center" as const,
    justifyContent: "center" as const,

    imageWrapper: {
      flex: 1,
      width: "100%" as const,
      display: "flex" as const,
      alignItems: "center" as const,
      justifyContent: "center" as const,
      overflow: "hidden" as const, // le contenu zoomé/déplacé ne doit pas déborder sur le bouton de fermeture
    },

    image: {
      width: "100%" as const,
      aspectRatio: 1,
    },

    close: {
      position: "absolute" as const,
      top: 56,
      right: 20,
      width: 40,
      height: 40,
      borderRadius: 20,
      display: "flex" as const,
      alignItems: "center" as const,
      justifyContent: "center" as const,
      backgroundColor: withOpacity(app_colors.white, 0.15),
    },
  },

  wavelengthsRow: {
    content: {
      display: "flex" as const,
      flexDirection: "row" as const,
      gap: 14,
      paddingHorizontal: 2,
      paddingVertical: 4,
    },

    item: {
      display: "flex" as const,
      alignItems: "center" as const,
      gap: 4,
      width: 70,

      thumbnail: {
        width: 65,
        height: 65,
        resizeMode: "cover" as const,
        borderRadius: 65,
        borderWidth: 1.5,
        borderColor: app_colors.accent.light,
        borderStyle: "dashed" as const,
      },

      thumbnailActive: {
        borderColor: app_colors.accent.main,
        borderStyle: "solid" as const,
      },

      label: {
        ...typography.dmMono.regular.rowMeta,
        fontSize: 8,
        color: app_colors.primary.medium,
        textAlign: "center" as const,
      },
    },
  },
}