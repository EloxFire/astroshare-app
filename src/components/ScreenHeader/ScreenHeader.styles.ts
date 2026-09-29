import { app_colors, spacing, typography, withOpacity } from "../../helpers/variables";

// Exporté pour ImageHeaderScrollView, qui cale sa parallaxe et sa barre compacte dessus.
export const IMAGE_HEADER_HEIGHT = 250;

export const screenHeaderStyles = {
  container: {
    flexDirection: "column" as const,
    paddingHorizontal: spacing.screen.horizontal,
    paddingBottom: 12,
    gap: 12,
    backgroundColor: app_colors.primary.main,

    light: {
      backgroundColor: app_colors.background,
      paddingBottom: 0,
    },

    // Variante avec image de fond (header secondaire uniquement) : hauteur fixe ; le contenu garde
    // la mise en page du header secondaire, seules ses couleurs passent en blanc (voir onImage).
    // Image et calques sont positionnés en absolu derrière le contenu (safe area comprise).
    withImage: {
      height: IMAGE_HEADER_HEIGHT,

      // Deux pièges évités par ce conteneur :
      // - sur un enfant en absolu, RN calcule les width/height en % sur la zone de contenu du parent
      //   (paddings horizontaux et safe area déduits), alors que top/left/right/bottom se calculent
      //   sur la boîte entière : ici, uniquement les 4 bords à 0 ;
      // - une <Image> en require() reçoit d'office la taille du fichier (ex: 1074×600) en
      //   width/height, qui l'emporte sur les 4 bords à 0 : l'image débordait alors sur tout
      //   l'écran (pas de souci avec { uri }, qui n'a pas de taille intrinsèque).
      // Le conteneur prend donc le cadre exact du header, et l'image le remplit en 100% — ce qui
      // remplace sa taille intrinsèque, sans risque cette fois puisque le conteneur n'a pas de padding.
      imageContainer: {
        position: "absolute" as const,
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,

        image: {
          width: "100%" as const,
          height: "100%" as const,
          resizeMode: "cover" as const,
        },
      },

      // Dégradé sombre sous le texte (voir IMAGE_SCRIM_STOPS dans ScreenHeader.tsx), sur toute la
      // hauteur — mêmes règles que imageContainer : les 4 bords à 0, pas de %.
      overlay: {
        position: "absolute" as const,
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
      },
    },

    homeHeader: {
      flexDirection: "row" as const,
      justifyContent: "space-between" as const,
    },
    
    titleContainer: {
      flexDirection: "row" as const,
      alignItems: "center" as const,
      marginTop: 10,

      title: {
        ...typography.ztNature.screenTitle,
        color: app_colors.white,
        whiteSpace: "pre-line" as const,

        light: {
          fontSize: 20,
          color: app_colors.primary.main,
        },

        // Header avec image : seule la couleur change (taille/police de la variante d'origine).
        onImage: {
          color: app_colors.white,
        }
      },

      subtitle: {
        fontFamily: "DMMonoMedium",
        fontSize: 12,
        textTransform: "uppercase" as const,
        color: app_colors.primary.medium,
        whiteSpace: "pre-line" as const,

        light: {
          fontSize: 16,
          color: app_colors.primary.main,
        },

        // Même logique que title.onImage ; blanc atténué pour garder la hiérarchie titre/sous-titre
        // (équivalent de primary.medium sur fond clair).
        onImage: {
          color: withOpacity(app_colors.white, 0.8),
        }
      }
    },
  },
  backButton: {
    width: 24,
    height: 24,
    borderRadius: 18,
    marginRight: 8,
    alignItems: "center" as const,
    justifyContent: "center" as const,
  },
};
