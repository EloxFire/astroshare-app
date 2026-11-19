import { getLunarAngularDiameter } from "@observerly/astrometry";
import { CatalogObjectDetail } from "../../types/catalog/CatalogObject";
import { getStaticSolarSystemAngularDiameter } from "./solarSystemAngularSizes";

export type ObjectAngularSize = {
  majorDegrees: number;
  minorDegrees: number;
  positionAngleDegrees: number;
};

// Taille apparente utilisable pour dessiner un objet à l'échelle dans le champ. Fiable uniquement
// pour : les objets du ciel profond qui ont une taille mesurée (dso.size, en arcminutes — vérifié
// en direct sur l'API, ex. M42 → major:90, minor:60), et la Lune (calcul en direct, voir
// solarSystemAngularSizes.ts pour les autres objets du système solaire). Les étoiles et petits
// corps n'ont pas de taille angulaire exploitable ici ; retourne null, à gérer par l'appelant (état
// vide plutôt qu'un champ simulé sur une valeur inventée).
export const getObjectAngularSize = (object: CatalogObjectDetail): ObjectAngularSize | null => {
  if (object.kind === "dso" && object.dso?.size.major) {
    return {
      majorDegrees: object.dso.size.major / 60,
      // Un axe secondaire absent (ex: amas globulaire, taille donnée par un seul rayon) : objet
      // traité comme circulaire plutôt que de laisser un null se propager dans les calculs de champ.
      minorDegrees: (object.dso.size.minor ?? object.dso.size.major) / 60,
      positionAngleDegrees: object.dso.size.pa ?? 0,
    };
  }

  if (object.kind === "solar_system" && object.id === "SS-MOON") {
    const diameterDegrees = getLunarAngularDiameter(new Date());
    return { majorDegrees: diameterDegrees, minorDegrees: diameterDegrees, positionAngleDegrees: 0 };
  }

  if (object.kind === "solar_system") {
    const diameterDegrees = getStaticSolarSystemAngularDiameter(object.id);
    if (diameterDegrees != null) {
      return { majorDegrees: diameterDegrees, minorDegrees: diameterDegrees, positionAngleDegrees: 0 };
    }
  }

  return null;
};
