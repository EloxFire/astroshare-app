// Transformation équatoriale → horizontale (RA/DEC → altitude/azimut) pour un lieu et un instant
// donnés — port de astroshare-public-tools/src/helpers/celestialPosition.ts. Utilisé pour les
// éclipses LUNAIRES : contrairement au solaire, l'API renvoie les mêmes circonstances partout sur
// Terre quel que soit l'`observer` passé (vérifié en direct : même magnitude pour Aix-en-Provence et
// pour un point antipodal où la Lune est forcément sous l'horizon) — la visibilité locale (la Lune
// est-elle levée à cet instant ?) se calcule donc ici, côté app, à partir de la RA/DEC de la Lune à
// chaque contact plutôt que d'être fournie par l'API.
// Formule GMST : approximation IAU standard (Meeus), largement suffisante pour une altitude au
// degré près (même marge que le reste de l'app pour ce genre de calcul).
const toJulianDate = (isoDateUtc: string): number => {
  const date = new Date(isoDateUtc.endsWith("Z") ? isoDateUtc : `${isoDateUtc}Z`);
  return date.getTime() / 86400000 + 2440587.5;
};

const gmstDegrees = (jd: number): number => {
  const T = (jd - 2451545.0) / 36525;
  let gmst = 280.46061837 + 360.98564736629 * (jd - 2451545.0) + 0.000387933 * T * T - (T * T * T) / 38710000;
  gmst %= 360;
  if (gmst < 0) gmst += 360;
  return gmst;
};

export type HorizontalPosition = { altitude: number; azimuth: number };

/**
 * @param dateUtc date ISO (UTC, avec ou sans suffixe Z) de l'événement
 * @param raHours ascension droite en HEURES (0-24, convention IMCCE — pas des degrés)
 * @param decDeg déclinaison en degrés
 * @param latitude de l'observateur, en degrés
 * @param longitude de l'observateur, en degrés (est positif)
 */
export const equatorialToHorizontal = (dateUtc: string, raHours: number, decDeg: number, latitude: number, longitude: number): HorizontalPosition => {
  const jd = toJulianDate(dateUtc);
  const gmst = gmstDegrees(jd);
  const lst = (gmst + longitude) % 360;
  let hourAngleDeg = lst - raHours * 15;
  hourAngleDeg = (((hourAngleDeg + 180) % 360) + 360) % 360 - 180;

  const hourAngleRad = (hourAngleDeg * Math.PI) / 180;
  const decRad = (decDeg * Math.PI) / 180;
  const latRad = (latitude * Math.PI) / 180;

  const sinAltitude = Math.sin(decRad) * Math.sin(latRad) + Math.cos(decRad) * Math.cos(latRad) * Math.cos(hourAngleRad);
  const altitude = (Math.asin(Math.max(-1, Math.min(1, sinAltitude))) * 180) / Math.PI;

  const cosAzimuth =
    (Math.sin(decRad) - Math.sin(latRad) * Math.sin((altitude * Math.PI) / 180)) /
    (Math.cos(latRad) * Math.cos((altitude * Math.PI) / 180));
  let azimuth = (Math.acos(Math.max(-1, Math.min(1, cosAzimuth))) * 180) / Math.PI;
  if (Math.sin(hourAngleRad) > 0) azimuth = 360 - azimuth;

  return { altitude, azimuth };
};
