import { app_colors, radius } from "../../../../../../helpers/variables";

export const funFactSectionStyles = {
  box: {
    backgroundColor: app_colors.yellow.light,
    borderRadius: radius.heroCard,
    padding: 14,
    gap: 4,

    label: {
      fontFamily: "DMMonoMedium",
      fontSize: 11,
      textTransform: "uppercase" as const,
      color: app_colors.primary.main,
    },

    text: {
      fontFamily: "ZTNatureRegular",
      fontSize: 13,
      color: app_colors.primary.main,
      lineHeight: 18,
    },
  },
};
