import {
  DARK_GLASS_BG,
  DARK_GLASS_BG_ACTIVE,
  DARK_GLASS_BORDER,
  DARK_GLASS_BORDER_ACTIVE,
} from "../../../helpers/planetarium/utils/darkGlass";

export const planetariumIconButtonStyles = {
  button: {
    width: 44,
    height: 44,
    borderRadius: 10,
    alignItems: "center" as const,
    justifyContent: "center" as const,
    backgroundColor: DARK_GLASS_BG,
    borderWidth: 1,
    borderColor: DARK_GLASS_BORDER,
  },

  buttonActive: {
    backgroundColor: DARK_GLASS_BG_ACTIVE,
    borderColor: DARK_GLASS_BORDER_ACTIVE,
  },
};
