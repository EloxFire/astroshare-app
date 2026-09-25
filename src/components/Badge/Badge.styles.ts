import { app_colors } from "../../helpers/variables";

export const badgeStyles = {
  container: {
    backgroundColor: app_colors.accent.main,
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    display: "flex" as const,
    flexDirection: "row" as const,
    alignItems: "center" as const,
    justifyContent: "center" as const,
    // Sans ça, le badge hérite du alignItems:"stretch" par défaut d'un parent en colonne et
    // s'étire sur toute la largeur disponible au lieu de se limiter à son contenu.
    alignSelf: "flex-start" as const,
    gap: 4,
    
    text: {
      color: app_colors.white,
      fontFamily: "DMMonoMedium",
      fontSize: 10,
    }
  },
}