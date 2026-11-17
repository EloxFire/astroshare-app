import type { TFunction } from "i18next";
import { formatLocaleNumber } from "../format";

// Latitude/longitude décimales + point cardinal (ex: "44,10° S"), pas le format DMS de
// convertDecimalLatitudeToDMS (réservé à un lieu fixe précis, ex: LocationMapCard) : une position
// satellite qui défile en direct se lit mieux en décimal qu'en degrés/minutes/secondes. La lettre
// cardinale est traduite (clés `coordinates.north/south/east/west`, namespace tools/satelliteTracker)
// car "O" (ouest) diffère de l'anglais "W".
export const formatLatitude = (value: number, language: string, t: TFunction): string => {
  const direction = t(value >= 0 ? "coordinates.north" : "coordinates.south");
  return `${formatLocaleNumber(Math.abs(value), language, 2)}° ${direction}`;
};

export const formatLongitude = (value: number, language: string, t: TFunction): string => {
  const direction = t(value >= 0 ? "coordinates.east" : "coordinates.west");
  return `${formatLocaleNumber(Math.abs(value), language, 2)}° ${direction}`;
};
