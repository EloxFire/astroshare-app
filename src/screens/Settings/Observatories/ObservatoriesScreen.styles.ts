import { globalStyles } from "../../../helpers/globalStyles";
import { gaps, radius, spacing } from "../../../helpers/variables";

export const observatoriesScreenStyles = {
  screen: globalStyles.screen,
  content: {
    flex: 1,
    padding: spacing.screenMargin,
    gap: gaps.sectionSeparator.after,
  },

  mapContainer: {
    borderRadius: radius.heroCard,
    overflow: "hidden" as const,
    height: 200,

    map: {
      height: "100%" as const,
      width: "100%" as const,
    }
  }
}