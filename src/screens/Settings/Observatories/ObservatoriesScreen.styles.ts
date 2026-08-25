import { globalStyles } from "../../../helpers/globalStyles";
import { gaps, spacing } from "../../../helpers/variables";

export const observatoriesScreenStyles = {
  screen: globalStyles.screen,
  content: {
    flex: 1,
    padding: spacing.screenMargin,
    gap: gaps.sectionSeparator.after,
  },
}