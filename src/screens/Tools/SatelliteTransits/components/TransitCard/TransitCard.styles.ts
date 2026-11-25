import { globalStyles } from "../../../../../helpers/globalStyles";
import { app_colors } from "../../../../../helpers/variables";

export const transitCardStyles = {
  card: {
    ...globalStyles.defaultCard,
    display: "flex" as const,
    flexDirection: "row" as const,
    alignItems: "center" as const,
    gap: 12,

    texts: {
      flex: 1,
      display: "flex" as const,
      flexDirection: "column" as const,
      gap: 2,

      dateRow: {
        display: "flex" as const,
        flexDirection: "row" as const,
        alignItems: "center" as const,
        gap: 5,
      },

      date: {
        fontFamily: "ZTNatureBold",
        fontSize: 15,
        color: app_colors.primary.main,
        textTransform: "capitalize" as const,
      },

      subtitle: {
        fontFamily: "DMMonoRegular",
        fontSize: 11,
        color: app_colors.primary.medium,
      },
    },
  },
};
