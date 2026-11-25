// Note de visibilité d'un astre (Soleil ou Lune) depuis un lieu donné, d'après sa seule altitude —
// port de astroshare-public-tools/src/helpers/visibilityRating.ts, adapté pour l'i18n : ce fichier
// ne renvoie que des données (niveau, altitude, direction), jamais de phrase déjà rédigée — c'est à
// l'écran de composer le texte via t() (voir CLAUDE.md : jamais traduire au chargement d'un module).

export type VisibilityLevel = "excellent" | "veryGood" | "good" | "medium" | "poor" | "veryPoor" | "blocked";

export type CompassDirection = "N" | "NE" | "E" | "SE" | "S" | "SW" | "W" | "NW";

const COMPASS_DIRECTIONS: CompassDirection[] = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];

export const azimuthToCompass = (azimuthDeg: number): CompassDirection => {
  const normalized = ((azimuthDeg % 360) + 360) % 360;
  return COMPASS_DIRECTIONS[Math.round(normalized / 45) % 8];
};

// Un azimut proche du nord/sud pur (marge de 15°) n'indique fiablement ni un lever ni un coucher —
// pas de précision ajoutée dans ce cas plutôt qu'une affirmation hasardeuse.
export type RiseSetHint = "rise" | "set" | null;

export const getRiseSetHint = (azimuthDeg: number): RiseSetHint => {
  const normalized = ((azimuthDeg % 360) + 360) % 360;
  if (normalized > 15 && normalized < 165) return "rise";
  if (normalized > 195 && normalized < 345) return "set";
  return null;
};

export type AltitudeVisibilityRating = {
  level: VisibilityLevel;
  altitudeDeg: number;
  azimuthDeg: number;
  compass: CompassDirection;
  riseSetHint: RiseSetHint;
};

// Seuils (hauteur au-dessus de l'horizon, en degrés) — une seule source de vérité partagée avec
// VISIBILITY_SCALE (l'échelle affichée à l'utilisateur), pour qu'elle corresponde toujours
// exactement au calcul réel.
const ALTITUDE_THRESHOLDS: { level: VisibilityLevel; minDeg: number }[] = [
  { level: "excellent", minDeg: 60 },
  { level: "veryGood", minDeg: 40 },
  { level: "good", minDeg: 22 },
  { level: "medium", minDeg: 10 },
  { level: "poor", minDeg: 4 },
  { level: "veryPoor", minDeg: -Infinity },
];

export const getAltitudeVisibilityRating = (altitudeDeg: number, azimuthDeg: number): AltitudeVisibilityRating => {
  const threshold = ALTITUDE_THRESHOLDS.find(({ minDeg }) => altitudeDeg >= minDeg) ?? ALTITUDE_THRESHOLDS[ALTITUDE_THRESHOLDS.length - 1];
  return {
    level: threshold.level,
    altitudeDeg,
    azimuthDeg,
    compass: azimuthToCompass(azimuthDeg),
    riseSetHint: getRiseSetHint(azimuthDeg),
  };
};

export const VISIBILITY_SCALE: { level: VisibilityLevel; thresholdLabel: string; color: string }[] = [
  { level: "excellent", thresholdLabel: "≥ 60°", color: "#43d17a" },
  { level: "veryGood", thresholdLabel: "40°–60°", color: "#8fd694" },
  { level: "good", thresholdLabel: "22°–40°", color: "#c3e86b" },
  { level: "medium", thresholdLabel: "10°–22°", color: "#f4c238" },
  { level: "poor", thresholdLabel: "4°–10°", color: "#ff9d4d" },
  { level: "veryPoor", thresholdLabel: "0°–4°", color: "#ff6b6b" },
  { level: "blocked", thresholdLabel: "—", color: "#ff3b3b" },
];
