import { radius } from "../../../helpers/variables";

// Deux blocs collés qui forment une seule carte : la mini-carte (coins arrondis en haut seulement),
// puis la ListCard des coordonnées (coins du haut et bordure haute retirés pour s'y raccorder).
export const locationMapCardStyles = {
  mapContainer: {
    borderTopLeftRadius: radius.heroCard,
    borderTopRightRadius: radius.heroCard,
    overflow: "hidden" as const,
    height: 120,
    width: "100%" as const,

    map: {
      flex: 1,
    },
  },

  list: {
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    borderTopWidth: 0,
  },
};
