import { app_colors } from "../../helpers/variables";

// Pour que le knob soit concentrique avec l'arrondi extérieur du rail (même centre de courbe,
// juste "en retrait" de l'inset), il faut : rayon du knob = rayon externe − inset total. L'inset
// total doit être IDENTIQUE quel que soit l'état — d'où borderWidth toujours réservé (transparent
// en "enabled") plutôt que présent seulement en "disabled" : sinon la bordure ajoute 1px d'inset
// en plus du padding dans un seul des deux états (borderWidth s'ajoute au padding en RN, comme
// box-sizing:border-box), et le knob ne matche plus le rail dans cet état-là.
const TRACK_HEIGHT = 30;
const TRACK_RADIUS = TRACK_HEIGHT / 2; // pilule parfaite (rayon = moitié de la hauteur)
const TRACK_PADDING = 2;
const TRACK_BORDER_WIDTH = 1;
const TRACK_INSET = TRACK_PADDING + TRACK_BORDER_WIDTH;
const KNOB_SIZE = TRACK_HEIGHT - 2 * TRACK_INSET;
const KNOB_RADIUS = KNOB_SIZE / 2; // = TRACK_RADIUS - TRACK_INSET, donc concentrique avec le rail

export const switchButtonStyles = {
  switchContainer: {
    width: 50,
    height: TRACK_HEIGHT,
    borderRadius: TRACK_RADIUS,
    padding: TRACK_PADDING,
    borderWidth: TRACK_BORDER_WIDTH,
    justifyContent: "center" as const,
  },
  enabled: {
    backgroundColor: app_colors.accent.main,
    borderColor: "transparent",
  },
  disabled: {
    backgroundColor: app_colors.accent.light,
    borderColor: app_colors.primary.light,
  },
  switchCircle: {
    width: KNOB_SIZE,
    height: KNOB_SIZE,
    borderRadius: KNOB_RADIUS,
    backgroundColor: app_colors.white,
  },
  circleEnabled: {
    alignSelf: "flex-end" as const,
  },
  circleDisabled: {
    alignSelf: "flex-start" as const,
  },
};