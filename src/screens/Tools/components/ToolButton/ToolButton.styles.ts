import { Dimensions } from "react-native";
import { app_colors, gaps, radius, typography } from "../../../../helpers/variables";


const GAP = 20;

const getItemWidth = (
  screenWidth: number,
  itemsPerRow: number,
  padding: number
): number => {
  const availableWidth = screenWidth - padding * 2 - GAP * (itemsPerRow - 1);
  return availableWidth / itemsPerRow;
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
      height: getItemWidth(Dimensions.get("window").width, 5, 20),
      width: getItemWidth(Dimensions.get("window").width, 5, 20),
      display: "flex" as const,
      justifyContent: "center" as const,
      alignItems: "center" as const,
    },

    squarePinned: {
      backgroundColor: app_colors.primary.main,
    },

    name: {
      ...typography.dmMono.regular.cardBody,
      fontSize: 10,
      width: 54,
      textAlign: "center" as const,
    }
  }
}