import { app_colors } from "../../helpers/variables";

const BUTTON_SIZE = 44;
const BUTTON_GAP = 10;
const BUTTON_COUNT = 4; // calques, recherche, champ, horloge

export const exploreScreenStyles = {
  screen: {
    flex: 1,
    backgroundColor: app_colors.black,
  },

  loaderOverlay: {
    position: "absolute" as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: "center" as const,
    justifyContent: "center" as const,
    backgroundColor: app_colors.black,
  },

  loaderText: {
    marginTop: 12,
    fontFamily: "DMMonoRegular",
    fontSize: 13,
    color: app_colors.white,
  },

  topLeftActions: {
    position: "absolute" as const,
    left: 16,
  },

  // Pile de boutons statiques en haut à droite (calques/recherche/champ/horloge) — pas de dock/
  // éventail animé (retour explicite de l'utilisateur), chaque bouton reste toujours visible comme
  // sur `main`. `stackHeight` (hauteur totale occupée) sert à ancrer les panneaux qui s'ouvrent juste
  // en dessous (LayerSettingsPanel/FieldSimulatorPicker).
  topRightActions: {
    position: "absolute" as const,
    right: 16,
    gap: BUTTON_GAP,
    stackHeight: BUTTON_COUNT * BUTTON_SIZE + (BUTTON_COUNT - 1) * BUTTON_GAP + BUTTON_GAP,
  },
};
