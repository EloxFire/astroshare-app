import { app_colors, typography, withOpacity } from "../../../helpers/variables";

export const rangeBandGaugeStyles = {
  container: {
    gap: 6,

    track: {
      height: 10,
      borderRadius: 99,
      // Cette jauge n'est utilisée que dans CalculationResultCard, à fond sombre (primary.main) :
      // app_colors.primary.light est une teinte FONCÉE à faible opacité (pensée pour un fond
      // clair), donc quasi invisible ici — piste et libellés passent en blanc translucide.
      backgroundColor: withOpacity(app_colors.white, 0.16),
      // Pas d'overflow:"hidden" ici : le repère (marker) est volontairement plus haut que la piste
      // (16px contre 10px, pour dépasser comme un vrai curseur) — le masquer aurait tronqué son
      // rond en deux demi-cercles aplatis en haut et en bas.
      position: "relative" as const,

      ideal: {
        position: "absolute" as const,
        top: 0,
        bottom: 0,
        backgroundColor: app_colors.white,
        borderRadius: 99,
      },

      marker: {
        position: "absolute" as const,
        top: -3,
        width: 16,
        height: 16,
        marginLeft: -8,
        borderRadius: 99,
        backgroundColor: app_colors.ambre.main,
        borderWidth: 2,
        borderColor: app_colors.white,
      },
    },

    labels: {
      display: "flex" as const,
      flexDirection: "row" as const,
      justifyContent: "space-between" as const,

      text: {
        ...typography.dmMono.regular.rowMeta,
        color: app_colors.white,
        opacity: 0.7,
      },
    },

    sliderHint: {
      ...typography.dmMono.regular.footnote,
      color: app_colors.white,
      opacity: 0.5,
      fontStyle: "italic" as const,
    },
  },
};
