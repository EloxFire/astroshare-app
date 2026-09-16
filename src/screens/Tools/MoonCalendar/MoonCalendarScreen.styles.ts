import { globalStyles } from "../../../helpers/globalStyles";

export const moonCalendarScreenStyles = {
  screen: globalStyles.screen,
  content: globalStyles.screen.content,

  tonightView: {
    display: "flex" as const,
    flexDirection: "column" as const,
    gap: 10,

    cardRow: {
      display: "flex" as const,
      flexDirection: "row" as const,
      justifyContent: "space-between" as const,
      alignItems: "center" as const,
      gap: 10,
    }
  }
};
