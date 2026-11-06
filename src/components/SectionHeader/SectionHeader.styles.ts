import { app_colors } from "../../helpers/variables";

export const sectionHeaderStyles = {
  header: {
    display: "flex" as const,
    flexDirection: "row" as const,
    alignItems: "center" as const,
    gap: 10,
    marginBottom: 10,

    title: {
      textTransform: "uppercase" as const,
      fontFamily: "DMMonoMedium",
      fontSize: 14,
      color: app_colors.primary.main,
    },

    separator: {
      flex: 1,
      height: 1,
      backgroundColor: app_colors.grey,
    },

    count: {
      fontFamily: "ZTNatureRegular",
      color: app_colors.primary.main,
      fontSize: 10,
    },
  },
};
