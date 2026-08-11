import { StatusBar } from "expo-status-bar";
import { app_colors, gaps, spacing } from "./variables";

export const globalStyles = {
  screen: {
    backgroundColor: app_colors.background,
    flex: 1,

    content: {
      padding: spacing.screen.horizontal,
      display: "flex" as const,
      flexDirection: "column" as const,
      gap: gaps.sectionSeparator.after,
    }
  }
}