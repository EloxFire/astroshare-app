import { radius } from "../../../helpers/variables";
import {
  DARK_GLASS_BG,
  DARK_GLASS_BORDER,
  DARK_GLASS_TEXT,
  DARK_GLASS_TEXT_MUTED,
} from "../../../helpers/planetarium/utils/darkGlass";

export const fieldSimulatorPickerStyles = {
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
    width: 260,
    maxHeight: 320,
    backgroundColor: DARK_GLASS_BG,
    borderRadius: radius.heroCard,
    borderWidth: 1,
    borderColor: DARK_GLASS_BORDER,
    paddingVertical: 6,
  },

  row: {
    display: "flex" as const,
    flexDirection: "row" as const,
    alignItems: "center" as const,
    gap: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,

    iconBloc: {
      width: 30,
      height: 30,
      borderRadius: 15,
      backgroundColor: DARK_GLASS_BORDER,
      alignItems: "center" as const,
      justifyContent: "center" as const,
    },

    texts: {
      flex: 1,

      label: {
        fontFamily: "DMMonoMedium",
        fontSize: 12.5,
        color: DARK_GLASS_TEXT,
      },

      value: {
        fontFamily: "DMMonoRegular",
        fontSize: 11,
        color: DARK_GLASS_TEXT_MUTED,
      },
    },
  },

  emptyText: {
    paddingHorizontal: 14,
    paddingVertical: 14,
    fontFamily: "DMMonoRegular",
    fontSize: 12,
    color: DARK_GLASS_TEXT_MUTED,
    textAlign: "center" as const,
  },
};
