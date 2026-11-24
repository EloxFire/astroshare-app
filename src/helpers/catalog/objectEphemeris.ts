import { getLunarEquatorialCoordinate, getPlanetaryPositions, getSolarEquatorialCoordinate, type EquatorialCoordinate, type GeographicCoordinate } from "@observerly/astrometry";
import type { CatalogObjectDetail } from "../../types/catalog/CatalogObject";

// Résout la position équatoriale d'un objet du catalogue à une date donnée — extrait
// d'ObjectDetailsScreen (courbe d'altitude), réutilisé tel quel par tout calcul qui a besoin de la
// position d'un objet au fil du temps (ex: recherche de conjonctions). Position fixe
// (`object.position`, étoile/DSO) si présente ; sinon l'éphéméride du système solaire
// (`object.solar_system.ephemeris.body`) : le catalogue ne donne jamais ni position ni magnitude
// pour ces objets (ils bougent, voir CatalogObjectKind), à recalculer localement.
// `ephemeris.provider` n'est géré que pour `"observerly"` (seul fournisseur actuel, voir
// CatalogObjectEphemeris) — un autre provider (comètes/astéroïdes à éléments orbitaux) renvoie
// `null`, pas d'erreur.
// `null` si l'objet n'a ni position fixe ni éphéméride exploitable (ex: objet à provider inconnu).
export const getObjectEquatorialCoordinateResolver = (
  object: CatalogObjectDetail | null | undefined,
  observer: GeographicCoordinate
): ((atDate: Date) => EquatorialCoordinate) | null => {
  if (object?.position) {
    const position = object.position;
    return () => ({ ra: position.ra, dec: position.dec });
  }

  const ephemeris = object?.solar_system?.ephemeris;
  if (ephemeris?.provider !== "observerly") return null;

  if (ephemeris.body === "sun") return getSolarEquatorialCoordinate;
  if (ephemeris.body === "moon") return getLunarEquatorialCoordinate;
  if (ephemeris.body === "planet") {
    // getPlanetaryPositions calcule les 7 planètes autres que la Terre d'un coup : on ne garde que
    // celle qui correspond à cet objet, identifiée par ephemeris.name/uid (les seuls identifiants
    // stables renvoyés par le catalogue pour ce body — le nom affiché `object.name` peut être
    // traduit et ne matche pas forcément celui d'observerly).
    return (atDate) => {
      const planet = getPlanetaryPositions(atDate, observer).find(
        (p) => (ephemeris.name && p.name.toLowerCase() === ephemeris.name.toLowerCase()) || (ephemeris.uid && p.uid === ephemeris.uid)
      );
      return planet ? { ra: planet.ra, dec: planet.dec } : { ra: 0, dec: 0 };
    };
  }

  return null;
};
