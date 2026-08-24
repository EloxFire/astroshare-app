import { app_colors, gaps, radius, typography } from "../../../../helpers/variables";

export const TOOL_BUTTON_WIDTH = 54;

export const getRowGap = (
  containerWidth: number,
  itemsPerRow: number
): number => {
  const totalItemsWidth = TOOL_BUTTON_WIDTH * itemsPerRow;
  return (containerWidth - totalItemsWidth) / (itemsPerRow - 1);
};

export const toolButtonStyles = {
  button: {
    display: "flex" as const,
    flexDirection: "column" as const,
    alignItems: "center" as const,
    gap: gaps.gridTile.columns,

    square: {
      backgroundColor: app_colors.accent.light,
      borderRadius: radius.badge44,
      width: TOOL_BUTTON_WIDTH,
      height: TOOL_BUTTON_WIDTH,
      display: "flex" as const,
      justifyContent: "center" as const,
      alignItems: "center" as const,
    },

    squarePinned: {
      backgroundColor: app_colors.primary.main,
    },

    name: {
      ...typography.dmMono.regular.cardBody,
      fontSize: 9,
      width: TOOL_BUTTON_WIDTH,
      textAlign: "center" as const,
    }
  }
}