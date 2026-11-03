import { app_colors, radius, withOpacity } from "../../../helpers/variables";

export const illustratedButtonCardStyles = {
  card: {
    display: "flex" as const,
    flexDirection: "column" as const,
    borderRadius: radius.heroCard,
    backgroundColor: app_colors.white,
    padding: 10,

    // Une <Image> chargée par require() garde par défaut la taille du fichier, qui l'emporte sur un
    // simple width:"100%"+aspectRatio (voir docs/agents-reference.md §2) — d'où ce conteneur
    // intermédiaire, borné et avec overflow:"hidden", plutôt que la contrainte posée sur l'Image
    // elle-même.
    imageContainer: {
      width: "100%" as const,
      aspectRatio: 1,
      borderRadius: radius.badge44,
      overflow: "hidden" as const,
    },

    image: {
      width: "100%" as const,
      height: "100%" as const,
      backgroundColor: withOpacity(app_colors.white, 0.5),
    },

    title: {
      fontFamily: "ZTNatureBold",
      fontSize: 16,
      color: app_colors.primary.main,
      marginTop: 10,
    },

    subtitle: {
      fontFamily: "ZTNatureRegular",
      fontSize: 12,
      color: app_colors.grey
    }
  }
}