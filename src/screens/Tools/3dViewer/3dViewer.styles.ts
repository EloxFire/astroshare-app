import { app_colors, radius } from "../../../helpers/variables";

export const threeDViewerScreenStyles = {
  modelsList: {
    display: "flex" as const,
    flexDirection: "row" as const,
    gap: 10,

    modelCard: {
      borderRadius: radius.badge44,
      width: 100,
      height: 100,
      backgroundColor: app_colors.accent.light,
      padding: 10,
  
      title: {
        fontFamily: "ZTNatureBold",
        fontSize: 16
      }
    }
  }
}