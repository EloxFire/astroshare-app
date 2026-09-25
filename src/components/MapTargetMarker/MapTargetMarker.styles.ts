import { app_colors, withOpacity } from "../../helpers/variables";

// Marqueur en "cible" : un halo semi-transparent (comme un cercle de précision GPS)
// autour d'un point plein cerclé de blanc, pour ressortir sur n'importe quel fond de carte
// plutôt qu'un simple point plat.
export const mapTargetMarkerStyles = {
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
