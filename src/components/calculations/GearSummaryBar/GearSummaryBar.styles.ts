import { app_colors, radius, spacing, typography } from "../../../helpers/variables";

export const gearSummaryBarStyles = {
  card: {
    backgroundColor: app_colors.primary.main,
    borderRadius: radius.heroCard,
    padding: spacing.toolCard,
    gap: 14,

    row: {
      display: "flex" as const,
      flexDirection: "row" as const,
      alignItems: "center" as const,
      gap: 10,

      iconBadge: {
        width: 38,
        height: 38,
        borderRadius: radius.badge38,
        backgroundColor: app_colors.accent.light,
        alignItems: "center" as const,
        justifyContent: "center" as const,
      },

      texts: {
        flex: 1,
        gap: 2,

        eyebrow: {
          ...typography.dmMono.semiBold.sectionLabel,
          color: app_colors.white,
          opacity: 0.7,
          textTransform: "uppercase" as const,
        },

        summary: {
          ...typography.ztNature.cardTitle,
          color: app_colors.white,
        },
      },

      changeButton: {
        backgroundColor: app_colors.white,
        borderRadius: radius.pill,
        paddingVertical: spacing.chip.vertical,
        paddingHorizontal: spacing.chip.horizontal,

        text: {
          ...typography.dmMono.semiBold.chip,
          color: app_colors.primary.main,
          textTransform: "uppercase" as const,
        },
      },
    },

    editor: {
      gap: 10,

      // SelectInput a son propre `label`, mais en primary.main (pensé pour un champ sur fond
      // clair) : invisible sur cette carte sombre. On préfère ce texte maison, déjà blanc.
      heading: {
        ...typography.dmMono.semiBold.sectionLabel,
        color: app_colors.white,
        opacity: 0.6,
        textTransform: "uppercase" as const,
      },

      divider: {
        height: 1,
        backgroundColor: app_colors.white,
        opacity: 0.16,
        marginVertical: 2,
      },

      pickers: {
        gap: 6,
      },

      // Une ligne compacte par pièce de matériel : pastille + libellé court à gauche (même code
      // couleur que les sections de l'écran principal — instrument/oculaire/photo), le champ à
      // droite (`fill`, partage la ligne). Pensé pour rester léger même si d'autres pièces
      // (monture, filtre...) s'ajoutent un jour — pas de carte/fond par ligne, juste cet en-tête.
      pickerRow: {
        display: "flex" as const,
        flexDirection: "row" as const,
        alignItems: "center" as const,
        gap: 8,

        badge: {
          width: 22,
          height: 22,
          borderRadius: radius.badge32,
          alignItems: "center" as const,
          justifyContent: "center" as const,
        },

        label: {
          ...typography.dmMono.semiBold.chip,
          color: app_colors.white,
          opacity: 0.8,
          textTransform: "uppercase" as const,
          width: 56,
        },
      },
    },
  },
};
