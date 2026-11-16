import { app_colors, typography } from "../../../../helpers/variables";

export const calculationDetailsScreenStyles = {
  notFound: {
    ...typography.dmMono.regular.cardBody,
    color: app_colors.primary.medium,
  },

  header: {
    gap: 4,
    marginBottom: 4,

    breadcrumb: {
      ...typography.dmMono.semiBold.sectionLabel,
      color: app_colors.accent.main,
      textTransform: "uppercase" as const,
    },

    title: {
      ...typography.ztNature.screenTitle,
      color: app_colors.primary.main,
    },
  },

  section: {
    gap: 10,
    marginTop: 10,

    fields: {
      gap: 8,
    },
  },
};
