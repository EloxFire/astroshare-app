import { radius } from "../../../helpers/variables";
import { DARK_GLASS_BG, DARK_GLASS_BORDER, DARK_GLASS_ICON_ACTIVE, DARK_GLASS_TEXT } from "../../../helpers/planetarium/utils/darkGlass";

export const timeControlPanelStyles = {
  container: {
    position: "absolute" as const,
    bottom: 28,
    left: 0,
    right: 0,
    alignItems: "center" as const,
  },

  card: {
    backgroundColor: DARK_GLASS_BG,
    borderRadius: radius.heroCard,
    borderWidth: 1,
    borderColor: DARK_GLASS_BORDER,
    paddingHorizontal: 16,
    paddingVertical: 10,
    alignItems: "center" as const,
  },

  dateText: {
    fontFamily: "DMMonoRegular",
    fontSize: 13,
    color: DARK_GLASS_TEXT,
  },

  buttons: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    gap: 4,
    marginTop: 10,

    button: {
      width: 30,
      height: 30,
      borderRadius: 15,
      alignItems: "center" as const,
      justifyContent: "center" as const,
    },

    // Lecture/pause : seule action "principale" de la carte, cerclée pour ressortir parmi les
    // boutons de pas +/-, comme sur `main` (iconButton à bordure).
    playButton: {
      borderWidth: 1,
      borderColor: DARK_GLASS_ICON_ACTIVE,
    },
  },
};
