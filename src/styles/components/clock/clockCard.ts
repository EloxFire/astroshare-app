import { StyleSheet } from "react-native";
import { app_colors } from "../../../helpers/constants";

export const clockCardStyles = StyleSheet.create({
  card: {
    width: '100%',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: app_colors.white_twenty,
    paddingVertical: 14,
    paddingHorizontal: 16,
    backgroundColor: app_colors.white_no_opacity,
    overflow: 'hidden',
    position: 'relative',
  },

  overlay: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  },

  content: {
    position: 'relative',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 14,
    zIndex: 1,
  },

  left: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: 6,
  },

  title: {
    fontSize: 16,
    textTransform: 'uppercase',
    color: app_colors.white,
    fontFamily: 'GilroyBlack',
    letterSpacing: 1.2,
  },

  subtitle: {
    fontSize: 12,
    color: app_colors.white_eighty,
    fontFamily: 'GilroyRegular',
    letterSpacing: 1.2,
  },

  time: {
    fontSize: 34,
    lineHeight: 34,
    color: app_colors.white,
    fontFamily: 'DMMonoRegular',
    letterSpacing: -0.5,
  },

  meta: {
    fontSize: 13,
    color: app_colors.white_eighty,
    fontFamily: 'GilroyRegular',
  },

  analogWrapper: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 1,
    borderColor: app_colors.white_twenty,
    backgroundColor: app_colors.black,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
  },
});
