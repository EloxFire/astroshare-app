import { app_colors, radius, withOpacity } from "../../../../helpers/variables";

export const adddNewObservatoryScreenStyles = {
  mapContainer: {
    borderRadius: radius.heroCard,
    overflow: "hidden" as const,
    height: 250,

    map: {
      height: "100%" as const,
      width: "100%" as const,

      // Marqueur en "cible" : un halo semi-transparent (comme un cercle de précision GPS)
      // autour d'un point plein cerclé de blanc, pour ressortir sur n'importe quel fond de
      // carte plutôt qu'un simple point plat.
      marker: {
        outer: {
          width: 32,
          height: 32,
          borderRadius: 16,
          backgroundColor: withOpacity(app_colors.yellow.main, 0.25),
          alignItems: "center" as const,
          justifyContent: "center" as const,
        },

        inner: {
          width: 16,
          height: 16,
          borderRadius: 8,
          backgroundColor: app_colors.yellow.main,
          borderWidth: 3,
          borderColor: app_colors.white,
          shadowColor: app_colors.black,
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.3,
          shadowRadius: 3,
          elevation: 4,
        }
      }
    }
  },

  nextButton: {
    backgroundColor: app_colors.accent.main,
    padding: 10,
    borderRadius: radius.badge32,
    display: "flex" as const,
    flexDirection: "row" as const,
    gap: 10,
    alignItems: "center" as const,
    justifyContent: "center" as const,
  },

  validateButton: {
    backgroundColor: app_colors.accent.main,
    padding: 10,
    borderRadius: radius.badge32,
    display: "flex" as const,
    flexDirection: "row" as const,
    gap: 10,
    alignItems: "center" as const,
    justifyContent: "center" as const,

    text: {
      color: app_colors.white,
      fontFamily: "DMMonoMedium",
      fontSize: 16,
    }
  }
}