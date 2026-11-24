import { app_colors } from "../../../../../helpers/variables";

export const objectPickerStyles = {
  container: {
    display: "flex" as const,
    flexDirection: "column" as const,
    gap: 5,
  },

  label: {
    fontFamily: "DMMonoRegular",
    fontSize: 12.5,
    color: app_colors.primary.main,
    textTransform: "uppercase" as const,
  },
};
