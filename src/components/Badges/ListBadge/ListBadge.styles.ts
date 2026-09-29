import { app_colors } from "../../../helpers/variables";

export const listBadgeStyles = {
  container: {
    backgroundColor: app_colors.accent.main,
    borderRadius: 12,
    padding: 10,
    display: "flex" as const,
    flexDirection: "row" as const,
    alignItems: "center" as const,
    justifyContent: "center" as const,
    // Volontairement aucune largeur ni alignSelf ici : c'est le conteneur qui décide. Dans un
    // parent en colonne (alignItems:"stretch" par défaut), le badge prend toute la largeur ;
    // pour qu'il se limite à son contenu, le parent passe alignItems:"flex-start".
    gap: 10,
    
    text: {
      color: app_colors.white,
      fontFamily: "DMMonoMedium",
      fontSize: 10,
    }
  },
}