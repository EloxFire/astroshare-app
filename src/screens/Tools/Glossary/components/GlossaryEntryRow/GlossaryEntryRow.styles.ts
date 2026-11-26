import { app_colors, radius } from "../../../../../helpers/variables";

export const glossaryEntryRowStyles = {
  card: {
    backgroundColor: app_colors.white,
    borderRadius: radius.mediumCard,
    borderWidth: 1,
    borderColor: "transparent",
    padding: 14,
    display: "flex" as const,
    flexDirection: "column" as const,
    gap: 12,

    expanded: {
      borderColor: app_colors.accent.main,
    },
  },

  header: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    gap: 10,

    dot: {
      width: 9,
      height: 9,
      borderRadius: 4.5,
    },

    texts: {
      flex: 1,
      display: "flex" as const,
      flexDirection: "column" as const,
      gap: 2,
    },

    term: {
      fontFamily: "ZTNatureBold",
      fontSize: 16,
      color: app_colors.primary.main,
    },

    shortDefinition: {
      fontFamily: "DMMonoRegular",
      fontSize: 11.5,
      color: app_colors.primary.medium,
    },
  },

  illustrationBox: {
    backgroundColor: app_colors.primary.main,
    borderRadius: radius.mediumCard,
    padding: 16,
    alignItems: "center" as const,
    justifyContent: "center" as const,
  },

  fullDefinition: {
    fontFamily: "DMMonoRegular",
    fontSize: 12.5,
    lineHeight: 12.5 * 1.5,
    color: app_colors.primary.main,
  },

  related: {
    flexDirection: "row" as const,
    flexWrap: "wrap" as const,
    alignItems: "center" as const,
    gap: 8,

    label: {
      fontFamily: "DMMonoRegular",
      fontSize: 10.5,
      color: app_colors.primary.medium,
      textTransform: "uppercase" as const,
    },
  },

  cta: {
    backgroundColor: app_colors.yellow.main,
    borderRadius: radius.pill,
    paddingVertical: 12,
    alignItems: "center" as const,
    justifyContent: "center" as const,

    text: {
      fontFamily: "ZTNatureBold",
      fontSize: 13,
      color: app_colors.primary.main,
    },
  },
};
