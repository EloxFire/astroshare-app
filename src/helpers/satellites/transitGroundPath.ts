import { getSolarEquatorialCoordinate } from "@observerly/astrometry";
import { eciPositionToGeodetic, getEciPosition, type EciVector, type SatrecHandle } from "./propagation";
import type { SolarTransit } from "./solarTransits";

// Ellipsoïde WGS84 — mêmes constantes que celles utilisées en interne par satellite.js
// (geodeticToEcf), pour rester cohérent avec la conversion géodésique qui interprète ensuite le
// point d'intersection (eciPositionToGeodetic).
const WGS84_EQUATORIAL_RADIUS_KM = 6378.137;
const WGS84_POLAR_RADIUS_KM = 6356.7523142;

// Vecteur unitaire ECI pointant de la Terre vers le Soleil, à partir de son ascension droite et
// déclinaison géocentriques (Observerly, déjà utilisé ailleurs dans l'app pour le Soleil).
const getSunDirection = (date: Date): EciVector => {
  const { ra, dec } = getSolarEquatorialCoordinate(date);
  const raRad = (ra * Math.PI) / 180;
  const decRad = (dec * Math.PI) / 180;
  return {
    x: Math.cos(decRad) * Math.cos(raRad),
    y: Math.cos(decRad) * Math.sin(raRad),
    z: Math.sin(decRad),
  };
};

// Point où la droite Soleil→ISS, prolongée, perce l'ellipsoïde terrestre : le Soleil étant à une
// distance immense devant l'ISS, cette droite est quasiment confondue avec la ligne de visée
// Terre→ISS→Soleil d'un observateur au sol — donc avec le point où cet observateur verrait l'ISS
// exactement centrée sur le Soleil. Même principe géométrique qu'un calcul de trajet d'ombre
// d'éclipse. Vérifié en direct contre un vrai transit calculé par l'app (findNextSolarTransit) :
// une intersection sur une SPHÈRE (rayon moyen ou équatorial) plaçait le point à 30-40 km de
// l'observateur réel selon la latitude (erreur due à l'aplatissement terrestre) ; l'ellipsoïde WGS84
// ramène l'écart à l'ordre de la distance de traversée elle-même (quelques km) — voir
// docs/agents-reference.md.
const intersectEarthEllipsoid = (issPosition: EciVector, sunDirection: EciVector): EciVector | null => {
  const a2 = WGS84_EQUATORIAL_RADIUS_KM ** 2;
  const b2 = WGS84_POLAR_RADIUS_KM ** 2;

  const quadraticA = (sunDirection.x ** 2 + sunDirection.y ** 2) / a2 + (sunDirection.z ** 2) / b2;
  const quadraticB = -2 * (
    (issPosition.x * sunDirection.x + issPosition.y * sunDirection.y) / a2
    + (issPosition.z * sunDirection.z) / b2
  );
  const quadraticC = (issPosition.x ** 2 + issPosition.y ** 2) / a2 + (issPosition.z ** 2) / b2 - 1;

  const discriminant = quadraticB ** 2 - 4 * quadraticA * quadraticC;
  if (discriminant < 0) return null; // ce prolongement ne touche pas la Terre à cet instant

  // Racine la plus petite : premier point de contact rencontré en s'éloignant de l'ISS vers la Terre
  // (l'autre racine ressortirait de l'autre côté du globe).
  const s = (-quadraticB - Math.sqrt(discriminant)) / (2 * quadraticA);
  if (s <= 0) return null;

  return {
    x: issPosition.x - s * sunDirection.x,
    y: issPosition.y - s * sunDirection.y,
    z: issPosition.z - s * sunDirection.z,
  };
};

export type TransitGroundPoint = { latitude: number; longitude: number };

export type TransitGroundPath = {
  // Ligne centrale : à chaque instant de cette portion du passage, le point au sol où le transit
  // serait vu exactement centré sur le Soleil — un point de la ligne = un instant différent, pas un
  // transit visible simultanément partout (même principe que transit-finder.com). Approximatif :
  // précision de l'ordre de quelques km (vérifié en direct, voir docs/agents-reference.md), pas une
  // frontière exacte.
  centerLine: TransitGroundPoint[];
  // Bords indicatifs de la bande où le transit reste au moins partiellement visible.
  leftEdge: TransitGroundPoint[];
  rightEdge: TransitGroundPoint[];
};

// Fenêtre explorée autour du transit : un choix indicatif (pas une borne physique) pour obtenir une
// ligne régionale comparable à ce qu'affichent les calculateurs grand public (transit-finder.com),
// sans tracer tout le passage orbital (l'ISS reste de toute façon rarement dans le ciel diurne local
// bien au-delà de quelques dizaines de secondes autour du transit).
const HALF_WINDOW_MS = 40_000;
const STEP_MS = 2_000;

export const getTransitGroundPath = (satrec: SatrecHandle, transit: SolarTransit): TransitGroundPath => {
  const centerLine: TransitGroundPoint[] = [];
  const centerMs = transit.midDate.getTime();

  for (let t = centerMs - HALF_WINDOW_MS; t <= centerMs + HALF_WINDOW_MS; t += STEP_MS) {
    const date = new Date(t);
    const issPosition = getEciPosition(satrec, date);
    if (!issPosition) continue;
    const groundPosition = intersectEarthEllipsoid(issPosition, getSunDirection(date));
    if (!groundPosition) continue;
    centerLine.push(eciPositionToGeodetic(groundPosition, date));
  }

  // Demi-largeur de la bande de visibilité : au premier ordre, un déplacement x (km) au sol,
  // perpendiculaire à la ligne de visée, décale la position apparente de l'ISS (bien plus proche que
  // le Soleil) d'un angle ≈ x / distance_ISS — le Soleil, lui, ne bouge quasiment pas dans le ciel sur
  // une si petite distance. La bande fait donc environ `thresholdRad × distance_ISS` de large, même
  // principe que la pénombre d'une éclipse (proportionnelle à la distance à l'objet occultant).
  const issAngularRadiusDeg = transit.angularSizeArcsec / 3600 / 2;
  const thresholdRad = ((transit.sunAngularRadiusArcmin / 60 + issAngularRadiusDeg) * Math.PI) / 180;
  const halfWidthKm = thresholdRad * transit.issRangeKm;

  const leftEdge: TransitGroundPoint[] = [];
  const rightEdge: TransitGroundPoint[] = [];

  for (let i = 0; i < centerLine.length; i++) {
    const previous = centerLine[Math.max(0, i - 1)];
    const next = centerLine[Math.min(centerLine.length - 1, i + 1)];
    const latRad = (centerLine[i].latitude * Math.PI) / 180;

    // Approximation en plan tangent local (valide à l'échelle de quelques km) — même principe que
    // d'autres approximations locales déjà en usage dans l'app (ex: getCulmination).
    const bearingRad = Math.atan2((next.longitude - previous.longitude) * Math.cos(latRad), next.latitude - previous.latitude);
    const perpRad = bearingRad + Math.PI / 2;

    const latOffset = (halfWidthKm / 111.32) * Math.cos(perpRad);
    const lonOffset = (halfWidthKm / (111.32 * Math.cos(latRad))) * Math.sin(perpRad);

    leftEdge.push({ latitude: centerLine[i].latitude + latOffset, longitude: centerLine[i].longitude + lonOffset });
    rightEdge.push({ latitude: centerLine[i].latitude - latOffset, longitude: centerLine[i].longitude - lonOffset });
  }

  return { centerLine, leftEdge, rightEdge };
};
