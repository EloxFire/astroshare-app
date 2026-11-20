import { app_colors, radius, spacing } from "../../../../../helpers/variables";

// Mêmes tokens que AddSatelliteModal (panneau "feuille" standard de l'app) : pas de poignée de
// glissement (aucun précédent dans l'app), l'arrondi haut + le fond assombri suffisent à lire un
// bottom sheet.
export const createChecklistModalStyles = {
  backdrop: {
    flex: 1,
    backgroundColor: "#00000066",
    justifyContent: "flex-end" as const,
  },

  dismissArea: {
    position: "absolute" as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },

  sheet: {
    backgroundColor: app_colors.white,
    borderTopLeftRadius: radius.modalSheetTop,
    borderTopRightRadius: radius.modalSheetTop,
    paddingTop: spacing.modalSheet.top,
    paddingHorizontal: spacing.modalSheet.horizontal,
    paddingBottom: spacing.modalSheet.bottom,

    display: "flex" as const,
    flexDirection: "column" as const,
    gap: 14,
  },

  title: {
    fontFamily: "ZTNatureBold",
    fontSize: 20,
    color: app_colors.primary.main,
  },
};
