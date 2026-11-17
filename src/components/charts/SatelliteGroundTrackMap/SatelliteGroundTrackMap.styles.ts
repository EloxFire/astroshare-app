import { app_colors, radius, withOpacity } from "../../../helpers/variables";

export const satelliteGroundTrackMapStyles = {
  // Fond sombre dédié (comme CalculationResultCard/GearSummaryBar) : les pointillés blancs des
  // continents et les traces de couleur n'ont de contraste que sur ce fond précis.
  container: {
    backgroundColor: app_colors.primary.main,
    borderRadius: radius.mediumCard,
    overflow: "hidden" as const,
    padding: 10,
  },

  map: {
    width: "100%" as const,
  },

  legend: {
    display: "flex" as const,
    flexDirection: "row" as const,
    gap: 14,
    paddingTop: 8,

    item: {
      display: "flex" as const,
      flexDirection: "row" as const,
      alignItems: "center" as const,
      gap: 5,

      swatch: {
        width: 14,
        height: 2,
        borderRadius: 1,
      },

      label: {
        fontFamily: "DMMonoRegular",
        fontSize: 8.5,
        color: withOpacity(app_colors.white, 0.7),
      },
    },
  },
};
