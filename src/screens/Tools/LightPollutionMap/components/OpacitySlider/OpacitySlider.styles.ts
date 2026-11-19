import { app_colors, withOpacity } from "../../../../../helpers/variables";

// Même langage visuel que la piste de WeatherRadarMap (track/thumb), en continu plutôt que calée
// sur des frames.
export const opacitySliderStyles = {
  touchArea: {
    flex: 1,
    paddingVertical: 10,
    justifyContent: "center" as const,
    position: "relative" as const,
  },

  track: {
    height: 4,
    borderRadius: 2,
    backgroundColor: withOpacity(app_colors.primary.main, 0.12),
    overflow: "hidden" as const,

    fill: {
      height: "100%" as const,
      borderRadius: 2,
      backgroundColor: app_colors.accent.main,
    },
  },

  thumb: {
    position: "absolute" as const,
    top: "50%" as const,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: app_colors.accent.main,
    borderWidth: 2,
    borderColor: app_colors.white,
    transform: [{ translateX: -7 }, { translateY: -7 }],
  },
};
