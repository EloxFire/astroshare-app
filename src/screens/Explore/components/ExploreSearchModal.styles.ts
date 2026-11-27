import { app_colors } from "../../../helpers/variables";
import { DARK_GLASS_BORDER, DARK_GLASS_TEXT_MUTED } from "../../../helpers/planetarium/utils/darkGlass";

// Fond plein (pas translucide, contrairement aux panneaux flottants) : cette modale occupe tout
// l'écran, rien à laisser transparaître derrière — un noir profond cohérent avec le reste de
// l'écran planétarium plutôt que le fond clair du reste de l'app (voir le retour utilisateur).
export const exploreSearchModalStyles = {
  container: {
    flex: 1,
    backgroundColor: app_colors.black,
  },

  header: {
    display: "flex" as const,
    flexDirection: "row" as const,
    alignItems: "center" as const,
    gap: 10,
    paddingHorizontal: 16,

    input: {
      flex: 1,
    },

    closeButton: {
      width: 36,
      height: 36,
      borderRadius: 10,
      borderWidth: 1,
      borderColor: DARK_GLASS_BORDER,
      alignItems: "center" as const,
      justifyContent: "center" as const,
    },
  },

  results: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 12,
  },

  emptyText: {
    marginTop: 24,
    textAlign: "center" as const,
    fontFamily: "DMMonoRegular",
    fontSize: 13,
    color: DARK_GLASS_TEXT_MUTED,
  },
};
