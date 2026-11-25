import { getLunarEquatorialCoordinate, getSolarEquatorialCoordinate } from "@observerly/astrometry";
import { eciPositionToGeodetic, getEciPosition, type EciVector, type SatrecHandle } from "./propagation";
import type { BodyTransit, TargetBodyKey } from "./transits";

// Ellipsoïde WGS84 — mêmes constantes que celles utilisées en interne par satellite.js
// (geodeticToEcf), pour rester cohérent avec la conversion géodésique qui interprète ensuite le
// point d'intersection (eciPositionToGeodetic).
const WGS84_EQUATORIAL_RADIUS_KM = 6378.137;
const WGS84_POLAR_RADIUS_KM = 6356.7523142;

// Vecteur unitaire ECI pointant (approximativement, voir plus bas pour la Lune) de la Terre vers le
// corps visé, à partir de son ascension droite et déclinaison géocentriques.
const getBodyDirection = (date: Date, body: TargetBodyKey): EciVector => {
  const { ra, dec } = body === "moon" ? getLunarEquatorialCoordinate(date) : getSolarEquatorialCoordinate(date);
  const raRad = (ra * Math.PI) / 180;
  const decRad = (dec * Math.PI) / 180;
  return {
    x: Math.cos(decRad) * Math.cos(raRad),
    y: Math.cos(decRad) * Math.sin(raRad),
    z: Math.sin(decRad),
  };
};

// Point où la droite corps visé→satellite, prolongée, perce l'ellipsoïde terrestre : pour le
// Soleil, à une distance immense devant le satellite, cette droite est quasiment confondue avec la
// ligne de visée Terre→satellite→Soleil d'un observateur au sol — donc avec le point où cet
// observateur verrait le satellite exactement centré sur le Soleil. Même principe géométrique qu'un
// calcul de trajet d'ombre d'éclipse. Vérifié en direct contre un vrai transit solaire calculé par
// l'app (findNextBodyTransit) : une intersection sur une SPHÈRE (rayon moyen ou équatorial) plaçait
// le point à 30-40 km de l'observateur réel selon la latitude (erreur due à l'aplatissement
// terrestre) ; l'ellipsoïde WGS84 ramène l'écart à l'ordre de la distance de traversée elle-même
// (quelques km) — voir docs/agents-reference.md.
// Pour la Lune, bien plus proche (~384 000 km, pas "à l'infini" comme le Soleil), cette même
// approximation (direction fixe depuis le centre de la Terre, sans corriger la parallaxe lunaire
// selon le point d'où on regarde) introduit une erreur plus grande, non vérifiée en direct — la
// ligne de visibilité d'un transit lunaire reste donc indicative à plus gros grain que pour le Soleil.
const intersectEarthEllipsoid = (satellitePosition: EciVector, bodyDirection: EciVector): EciVector | null => {
  const a2 = WGS84_EQUATORIAL_RADIUS_KM ** 2;
  const b2 = WGS84_POLAR_RADIUS_KM ** 2;

  const quadraticA = (bodyDirection.x ** 2 + bodyDirection.y ** 2) / a2 + (bodyDirection.z ** 2) / b2;
  const quadraticB = -2 * (
    (satellitePosition.x * bodyDirection.x + satellitePosition.y * bodyDirection.y) / a2
    + (satellitePosition.z * bodyDirection.z) / b2
  );
  const quadraticC = (satellitePosition.x ** 2 + satellitePosition.y ** 2) / a2 + (satellitePosition.z ** 2) / b2 - 1;

  const discriminant = quadraticB ** 2 - 4 * quadraticA * quadraticC;
  if (discriminant < 0) return null; // ce prolongement ne touche pas la Terre à cet instant

  // Racine la plus petite : premier point de contact rencontré en s'éloignant du satellite vers la
  // Terre (l'autre racine ressortirait de l'autre côté du globe).
  const s = (-quadraticB - Math.sqrt(discriminant)) / (2 * quadraticA);
  if (s <= 0) return null;

  return {
    x: satellitePosition.x - s * bodyDirection.x,
    y: satellitePosition.y - s * bodyDirection.y,
    z: satellitePosition.z - s * bodyDirection.z,
  };
};

export type TransitGroundPoint = { latitude: number; longitude: number };

export type TransitGroundPath = {
  // Ligne centrale : à chaque instant de cette portion du passage, le point au sol où le transit
  // serait vu exactement centré sur le corps visé — un point de la ligne = un instant différent,
  // pas un transit visible simultanément partout (même principe que transit-finder.com).
  // Approximatif : précision de l'ordre de quelques km pour un transit solaire (vérifié en direct,
  // voir docs/agents-reference.md) ; plus grossière pour un transit lunaire (voir le commentaire de
  // intersectEarthEllipsoid), pas une frontière exacte dans tous les cas.
  centerLine: TransitGroundPoint[];
  // Bords indicatifs de la bande où le transit reste au moins partiellement visible.
  leftEdge: TransitGroundPoint[];
  rightEdge: TransitGroundPoint[];
};

// Fenêtre explorée autour du transit : un choix indicatif (pas une borne physique) pour obtenir une
// ligne régionale comparable à ce qu'affichent les calculateurs grand public (transit-finder.com),
// sans tracer tout le passage orbital (le satellite reste de toute façon rarement dans le ciel
// diurne local bien au-delà de quelques dizaines de secondes autour du transit).
const HALF_WINDOW_MS = 40_000;
const STEP_MS = 2_000;

export const getTransitGroundPath = (satrec: SatrecHandle, transit: BodyTransit): TransitGroundPath => {
  const centerLine: TransitGroundPoint[] = [];
  const centerMs = transit.midDate.getTime();

  for (let t = centerMs - HALF_WINDOW_MS; t <= centerMs + HALF_WINDOW_MS; t += STEP_MS) {
    const date = new Date(t);
    const satellitePosition = getEciPosition(satrec, date);
    if (!satellitePosition) continue;
    const groundPosition = intersectEarthEllipsoid(satellitePosition, getBodyDirection(date, transit.body));
    if (!groundPosition) continue;
    centerLine.push(eciPositionToGeodetic(groundPosition, date));
  }

  // Demi-largeur de la bande de visibilité : au premier ordre, un déplacement x (km) au sol,
  // perpendiculaire à la ligne de visée, décale la position apparente du satellite (bien plus
  // proche que le corps visé) d'un angle ≈ x / distance_satellite — le corps visé, lui, ne bouge
  // quasiment pas dans le ciel sur une si petite distance. La bande fait donc environ
  // `thresholdRad × distance_satellite` de large, même principe que la pénombre d'une éclipse
  // (proportionnelle à la distance à l'objet occultant).
  const satelliteAngularRadiusDeg = transit.angularSizeArcsec / 3600 / 2;
  const thresholdRad = ((transit.bodyAngularRadiusArcmin / 60 + satelliteAngularRadiusDeg) * Math.PI) / 180;
  const halfWidthKm = thresholdRad * transit.satelliteRangeKm;

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
