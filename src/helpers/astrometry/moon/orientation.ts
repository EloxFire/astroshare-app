import {
  getLunarEclipticLatitude,
  getLunarEclipticLongitude,
  getLunarEquatorialCoordinate,
  getLunarMeanEclipticLongitudeOfTheAscendingNode,
  getLunarPhaseAngle,
  getNutation,
  getObliquityOfTheEcliptic,
  getParallacticAngle,
  getSolarEquatorialCoordinate,
  type GeographicCoordinate,
} from "@observerly/astrometry";

// Orientation de la Lune telle que vue depuis le centre de la Terre, nord céleste en haut (même
// convention que les images "Moon Phase and Libration" de la NASA) — tout ce qu'il faut pour
// dessiner son disque : quelle face est visible (libration), comment son axe est incliné dans le
// ciel (P) et d'où vient la lumière du Soleil (χ, angle de phase).
//
// Méthodes de Meeus (Astronomical Algorithms, chap. 48 et 53), à partir des positions fournies par
// @observerly/astrometry. Précision de l'ordre de 0,2 à 0,5° (la longitude de la Lune de la lib
// s'écarte de ~0,2° de celle de Meeus) : invisible sur les tailles affichées. Pour la voir depuis le
// ciel d'un observateur, voir getLunarSkyRotation. Non inclus : libration physique (±0,04°,
// négligeable) et libration diurne (~±1°, dépend du lieu d'observation).

const DEG_TO_RAD = Math.PI / 180;
const MS_PER_DAY = 24 * 60 * 60 * 1000;
const UNIX_EPOCH_JULIAN_DAY = 2440587.5;
const J2000_JULIAN_DAY = 2451545;
const DAYS_PER_JULIAN_CENTURY = 36525;

// Inclinaison de l'équateur lunaire sur l'écliptique (Meeus, chap. 53).
const LUNAR_EQUATOR_INCLINATION = 1.54242 * DEG_TO_RAD;

export interface LunarLibration {
  // Libration en longitude (°, positive vers l'est sélénographique : le bord côté Mare Crisium
  // devient plus visible).
  longitude: number;
  // Libration en latitude (°, positive vers le nord : le pôle Nord lunaire devient plus visible).
  latitude: number;
}

export interface LunarOrientation {
  libration: LunarLibration;
  // Angle de position de l'axe de rotation de la Lune (°, ~±25°) : de combien son pôle Nord est
  // incliné par rapport au nord céleste, compté vers l'est.
  axisPositionAngle: number;
  // Angle de position du milieu du bord éclairé (°, 0–360) : direction d'où vient la lumière du
  // Soleil sur le disque, comptée depuis le nord céleste vers l'est (270° = ouest, à droite).
  brightLimbPositionAngle: number;
  // Angle de phase (°) : 0 = pleine lune (Soleil derrière l'observateur), 180 = nouvelle lune.
  phaseAngle: number;
}

// Ramène un angle en degrés dans [-180, 180[.
const normalizeSignedDegrees = (degrees: number): number => ((((degrees + 180) % 360) + 360) % 360) - 180;

// Ramène un angle en degrés dans [0, 360[.
const normalizeDegrees = (degrees: number): number => ((degrees % 360) + 360) % 360;

// Argument de latitude moyen F de la Lune (Meeus, éq. 47.5). Pas getLunarArgumentOfLatitude de
// @observerly/astrometry : malgré son nom, c'est le F des calculs de phases et d'éclipses (Meeus,
// chap. 49), arrondi à la lunaison la plus proche — donc figé pendant tout un mois lunaire, ce qui
// fausse complètement la libration en longitude. ΔT (~1 min) négligé : sans effet visible ici.
const getMeanLunarArgumentOfLatitude = (date: Date): number => {
  const T = (date.getTime() / MS_PER_DAY + UNIX_EPOCH_JULIAN_DAY - J2000_JULIAN_DAY) / DAYS_PER_JULIAN_CENTURY;
  return 93.272095 + 483202.0175233 * T - 0.0036539 * T ** 2 - T ** 3 / 3526000 + T ** 4 / 863310000;
};

// Libration optique géocentrique (Meeus, chap. 53) : de combien la face visible depuis la Terre est
// décalée par rapport à sa position moyenne.
//
// Vérifié contre l'exemple 53.a de Meeus (12 avril 1992, 0h TD) : l = -1,02° / b = +4,22° pour
// -1,21° / +4,19° attendus. Amplitudes sur 2026 : longitude -8,4° → +7,0°, latitude ±6,7°
// (théorie : ~±7,9° et ±6,7°).
export const getLunarLibration = (date: Date): LunarLibration => {
  const longitude = getLunarEclipticLongitude(date) * DEG_TO_RAD;
  const latitude = getLunarEclipticLatitude(date) * DEG_TO_RAD;
  const ascendingNode = getLunarMeanEclipticLongitudeOfTheAscendingNode(date) * DEG_TO_RAD;
  const argumentOfLatitude = getMeanLunarArgumentOfLatitude(date) * DEG_TO_RAD;

  const W = longitude - ascendingNode;
  const A = Math.atan2(
    Math.sin(W) * Math.cos(latitude) * Math.cos(LUNAR_EQUATOR_INCLINATION) - Math.sin(latitude) * Math.sin(LUNAR_EQUATOR_INCLINATION),
    Math.cos(W) * Math.cos(latitude)
  );

  return {
    longitude: normalizeSignedDegrees((A - argumentOfLatitude) / DEG_TO_RAD),
    latitude: Math.asin(
      -Math.sin(W) * Math.cos(latitude) * Math.sin(LUNAR_EQUATOR_INCLINATION) - Math.sin(latitude) * Math.cos(LUNAR_EQUATOR_INCLINATION)
    ) / DEG_TO_RAD,
  };
};

// Angle de position de l'axe de la Lune P (Meeus, chap. 53 — termes de libration physique
// négligés). Vérifié contre l'exemple 53.a : P = 15,12° pour 15,08° attendus. Sur 2026 : ±22,3°.
export const getLunarAxisPositionAngle = (date: Date, librationLatitude: number = getLunarLibration(date).latitude): number => {
  const { Δψ, Δε } = getNutation(date);
  const V = (getLunarMeanEclipticLongitudeOfTheAscendingNode(date) + Δψ) * DEG_TO_RAD;
  // getObliquityOfTheEcliptic donne l'obliquité moyenne : + Δε pour l'obliquité vraie.
  const trueObliquity = (getObliquityOfTheEcliptic(date) + Δε) * DEG_TO_RAD;

  const X = Math.sin(LUNAR_EQUATOR_INCLINATION) * Math.sin(V);
  const Y = Math.sin(LUNAR_EQUATOR_INCLINATION) * Math.cos(V) * Math.cos(trueObliquity) - Math.cos(LUNAR_EQUATOR_INCLINATION) * Math.sin(trueObliquity);
  const omega = Math.atan2(X, Y);
  const rightAscension = getLunarEquatorialCoordinate(date).ra * DEG_TO_RAD;

  return Math.asin((Math.sqrt(X ** 2 + Y ** 2) * Math.cos(rightAscension - omega)) / Math.cos(librationLatitude * DEG_TO_RAD)) / DEG_TO_RAD;
};

// Angle de position du milieu du bord éclairé χ (Meeus, éq. 48.5), à partir des coordonnées
// équatoriales géocentriques de la Lune et du Soleil. Vérifié contre l'exemple 48.a (12 avril 1992) :
// χ = 285,07° pour 285,0° attendus.
export const getLunarBrightLimbPositionAngle = (date: Date): number => {
  const moon = getLunarEquatorialCoordinate(date);
  const sun = getSolarEquatorialCoordinate(date);
  const [moonRa, moonDec, sunRa, sunDec] = [moon.ra, moon.dec, sun.ra, sun.dec].map((degrees) => degrees * DEG_TO_RAD);

  const chi = Math.atan2(
    Math.cos(sunDec) * Math.sin(sunRa - moonRa),
    Math.sin(sunDec) * Math.cos(moonDec) - Math.cos(sunDec) * Math.sin(moonDec) * Math.cos(sunRa - moonRa)
  );
  return normalizeDegrees(chi / DEG_TO_RAD);
};

// Moment pour lequel orienter la Lune dans le ciel d'un observateur :
// - "instant" : à la date exacte (dépend de l'heure : le disque tourne au fil de la nuit) ;
// - "meridian" : quand elle passe au méridien, au plus haut dans le ciel — l'orientation
//   "typique" depuis ce lieu, pour une vue qui représente un jour ou une phase plutôt qu'un
//   moment d'observation précis.
export type LunarSkyOrientationTime = "instant" | "meridian";

// Angle (°) dont il faut faire tourner le disque — dessiné nord céleste en haut — pour le montrer
// tel que l'observateur le voit dans son ciel, zénith en haut : c'est l'angle parallactique, angle
// de position du zénith vu depuis la Lune (compté du nord vers l'est : négatif quand la Lune est à
// l'est, 0 au méridien, positif à l'ouest). Au méridien, il vaut 0 si la Lune passe au sud du
// zénith (déclinaison < latitude), 180 sinon — d'où le disque retourné vu de l'hémisphère Sud.
// Calculé pour le centre de la Terre (sans parallaxe, < 1° d'écart) : invisible à cette échelle.
export const getLunarSkyRotation = (date: Date, observer: GeographicCoordinate, time: LunarSkyOrientationTime = "instant"): number => {
  const moon = getLunarEquatorialCoordinate(date);
  if (time === "meridian") return moon.dec < observer.latitude ? 0 : 180;
  return getParallacticAngle(date, observer, moon);
};

export const getLunarOrientation = (date: Date): LunarOrientation => {
  const libration = getLunarLibration(date);
  return {
    libration,
    axisPositionAngle: getLunarAxisPositionAngle(date, libration.latitude),
    brightLimbPositionAngle: getLunarBrightLimbPositionAngle(date),
    phaseAngle: getLunarPhaseAngle(date),
  };
};
