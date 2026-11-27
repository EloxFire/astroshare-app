import { radius } from "../../../helpers/variables";
import { DARK_GLASS_BG, DARK_GLASS_BORDER, DARK_GLASS_TEXT } from "../../../helpers/planetarium/utils/darkGlass";

export const layerSettingsPanelStyles = {
  backdrop: {
    position: "absolute" as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },

  card: {
    position: "absolute" as const,
    right: 16,
    width: 230,
    backgroundColor: DARK_GLASS_BG,
    borderRadius: radius.heroCard,
    borderWidth: 1,
    borderColor: DARK_GLASS_BORDER,
    paddingHorizontal: 14,
  },

  row: {
    display: "flex" as const,
    flexDirection: "row" as const,
    alignItems: "center" as const,
    justifyContent: "space-between" as const,
    paddingVertical: 12,

    withBorder: {
      borderBottomWidth: 1,
      borderBottomColor: DARK_GLASS_BORDER,
    },

    content: {
      display: "flex" as const,
      flexDirection: "row" as const,
      alignItems: "center" as const,
      gap: 10,

      title: {
        fontFamily: "DMMonoRegular",
        fontSize: 13,
        color: DARK_GLASS_TEXT,
      },
    },
  },
};
