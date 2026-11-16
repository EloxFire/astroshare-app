import { app_colors } from "../../../helpers/variables";

export const launchesListStyles = {
  container: {
    display: "flex" as const,
    flexDirection: "column" as const,
    gap: 20,

    group: {
      display: "flex" as const,
      flexDirection: "column" as const,
      gap: 10,
      marginTop: 10,
      marginBottom: 50,

      title: {
        fontSize: 12,
        fontFamily: "ZTNatureBold" as const,
        color: app_colors.primary.medium,
        textTransform: "uppercase" as const,
      },
    },
  },

  empty: {
    fontSize: 14,
    fontFamily: "ZTNatureRegular" as const,
    color: app_colors.primary.medium,
    textAlign: "center" as const,
    paddingVertical: 30,
  },
};
