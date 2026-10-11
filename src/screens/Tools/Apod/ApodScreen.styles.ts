import { app_colors, radius, withOpacity } from "../../../helpers/variables";

export const apodScreenStyles = {
  screen: {
    backgroundColor: app_colors.primary.main,

    image: {
      width: "100%" as const,
      // Ratio de secours tant que les dimensions réelles de l'image ne sont pas connues
      // (Image.getSize est async) — remplacé dynamiquement par le vrai ratio une fois récupéré,
      // voir ApodScreen.tsx. aspectRatio (plutôt qu'une hauteur en pixels calculée à la main)
      // laisse React Native dériver la hauteur directement de la largeur dispo.
      aspectRatio: 16 / 9,
      resizeMode: "cover" as const,
      borderRadius: radius.heroCard,
    },

    // Vidéos/iframes : pas d'équivalent à Image.getSize pour connaître un ratio réel à l'avance,
    // on se cale donc sur un ratio 16:9 classique pour ce type de contenu.
    video: {
      width: "100%" as const,
      aspectRatio: 16 / 9,
      borderRadius: radius.heroCard,
      overflow: "hidden" as const,
    },

    content: {
      display: "flex" as const,
      flexDirection: "column" as const,
      gap: 10,

      header: {
        display: "flex" as const,
        flexDirection: "column" as const,
        marginTop: 20,

        date: {
          color: app_colors.yellow.main,
          fontFamily: "DMMonoMedium",
          fontSize: 12,
          textTransform: "uppercase" as const,
        },

        title: {
          color: app_colors.white,
          fontFamily: "ZTNatureBold",
          fontSize: 30,
        },

        copyright: {
          color: withOpacity(app_colors.white, 0.7),
          fontFamily: "DMMonoMedium",
          fontSize: 10,
        }
      },

      buttons: {
        display: "flex" as const,
        flexDirection: "row" as const,
        justifyContent: "space-between" as const,
        alignItems: "center" as const,
        gap: 10,
        marginVertical: 10,

        button: {
          display: "flex" as const,
          flexDirection: "row" as const,
          justifyContent: "center" as const,
          alignItems: "center" as const,
          gap: 5,
          paddingVertical: 10,
          paddingHorizontal: 20,
          borderRadius: radius.badge44,
          borderWidth: 1,
          borderColor: withOpacity(app_colors.white, 0.2),
          flex: 1,


          active: {
            borderColor: app_colors.accent.main,
            backgroundColor: app_colors.accent.main,
          },

          text: {
            color: app_colors.white,
            fontFamily: "ZTNatureBold",
            fontSize: 12,
          }
        }
      },

      description: {
        display: "flex" as const,
        flexDirection: "column" as const,
        gap: 10,
        padding: 10,
        backgroundColor: app_colors.accent.light,
        borderRadius: radius.heroCard,

        header: {
          display: "flex" as const,
          flexDirection: "row" as const,
          justifyContent: "space-between" as const,
          alignItems: "center" as const,
          
          title: {
            flex: 1,
            color: app_colors.primary.main,
            fontFamily: "ZTNatureBold",
            fontSize: 16,
            textTransform: "uppercase" as const,
          },

          translate: {
            display: "flex" as const,
            flexDirection: "row" as const,
            alignItems: "center" as const,
            gap: 5,

            text: {
              color: app_colors.primary.medium,
              fontFamily: "ZTNatureRegular",
            }
          }
        },

        text: {
          color: app_colors.primary.main,
          fontFamily: "ZTNatureRegular",
          fontSize: 16,
          lineHeight: 28,
        }
      },

      nextImage: {
        display: "flex" as const,
        flexDirection: "row" as const,
        alignItems: "center" as const,
        gap: 10,
        marginTop: 10,
        borderWidth: 1,
        borderColor: withOpacity(app_colors.white, 0.5),
        borderRadius: radius.heroCard,
        borderStyle: "dashed" as const,
        padding: 10,

        iconContainer: {
          width: 60,
          height: 60,
          borderRadius: radius.badge44,
          backgroundColor: withOpacity(app_colors.accent.light, 0.2),
          display: "flex" as const,
          justifyContent: "center" as const,
          alignItems: "center" as const,
        },
        textContainer: {
          flex: 1,
          display: "flex" as const,
          flexDirection: "column" as const,
          gap: 5,
        },
        date: {
          color: withOpacity(app_colors.white, 0.5),
          fontFamily: "DMMonoMedium",
          fontSize: 12,
        },
        title: {
          color: app_colors.white,
          fontFamily: "ZTNatureBold",
          fontSize: 16,
        }
      }
    }
  }
}