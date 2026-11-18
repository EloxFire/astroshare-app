import { app_colors, radius, spacing } from "../../../../../helpers/variables";

export const addSatelliteModalStyles = {
  backdrop: {
    flex: 1,
    backgroundColor: "#00000066", // withOpacity(app_colors.black, 0.4) — valeur déjà utilisée ailleurs (DayDetailModal)
    justifyContent: "flex-end" as const,
  },

  // Derrière le panneau (et non autour de lui, qui intercepterait les appuis destinés au panneau
  // et à ses listes de suggestions) — même principe que SelectInput.
  dismissArea: {
    position: "absolute" as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },

  sheet: {
    backgroundColor: app_colors.white,
    borderTopLeftRadius: radius.modalSheetTop,
    borderTopRightRadius: radius.modalSheetTop,
    paddingTop: spacing.modalSheet.top,
    paddingHorizontal: spacing.modalSheet.horizontal,
    paddingBottom: spacing.modalSheet.bottom,

    display: "flex" as const,
    flexDirection: "column" as const,
    gap: 14,
  },

  title: {
    fontFamily: "ZTNatureBold",
    fontSize: 20,
    color: app_colors.primary.main,
  },

  helper: {
    fontFamily: "DMMonoRegular",
    fontSize: 10.5,
    color: app_colors.primary.medium,
    marginTop: -6,
  },

  nameLoader: {
    alignSelf: "flex-start" as const,
  },

  orDivider: {
    textAlign: "center" as const,
    fontFamily: "DMMonoMedium",
    fontSize: 10,
    letterSpacing: 10 * 0.1,
    textTransform: "uppercase" as const,
    color: app_colors.primary.medium,
  },

  preview: {
    backgroundColor: app_colors.accent.light,
    borderRadius: radius.mediumCard,
    padding: spacing.toolCard,
    display: "flex" as const,
    flexDirection: "row" as const,
    alignItems: "center" as const,
    gap: 10,

    badge: {
      width: 38,
      height: 38,
      borderRadius: radius.badge38,
      backgroundColor: app_colors.white,
      display: "flex" as const,
      alignItems: "center" as const,
      justifyContent: "center" as const,
    },

    texts: {
      flex: 1,
      display: "flex" as const,
      flexDirection: "column" as const,
      gap: 1,

      title: {
        fontFamily: "ZTNatureBold",
        fontSize: 14,
        color: app_colors.primary.main,
      },

      subtitle: {
        fontFamily: "DMMonoRegular",
        fontSize: 10.5,
        color: app_colors.primary.medium,
      },
    },
  },

  notFound: {
    fontFamily: "DMMonoRegular",
    fontSize: 10.5,
    color: app_colors.red.main,
  },
};
