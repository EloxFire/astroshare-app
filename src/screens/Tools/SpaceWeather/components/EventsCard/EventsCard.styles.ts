import { app_colors } from "../../../../../helpers/variables";

// Pas de coquille blanche, même raison que NoaaScalesCard : SpaceWeatherEvents gère déjà ses
// propres lignes/cartes d'évènement.
export const eventsCardStyles = {
  container: {
    display: "flex" as const,
    flexDirection: "column" as const,
    gap: 10,
  },

  link: {
    color: app_colors.accent.main,
    fontFamily: "DMMonoRegular",
    fontSize: 12,
  },

  list: {
    display: "flex" as const,
    flexDirection: "column" as const,
    gap: 10,
  },
};
