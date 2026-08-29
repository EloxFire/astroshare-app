import i18next from "../../i18n";

export const convertDecimalLatitudeToDMS = (decimalLatitude: number): string => {
  const absoluteLatitude = Math.abs(decimalLatitude);
  const degrees = Math.floor(absoluteLatitude);
  const minutes = Math.floor((absoluteLatitude - degrees) * 60);
  const seconds = Math.round(((absoluteLatitude - degrees) * 60 - minutes) * 60);

  const direction = decimalLatitude >= 0 ? "N" : "S";

  return `${degrees}°${minutes}'${seconds}" ${direction}`;
};

export const convertDecimalLongitudeToDMS = (decimalLongitude: number): string => {
  const absoluteLongitude = Math.abs(decimalLongitude);
  const degrees = Math.floor(absoluteLongitude);
  const minutes = Math.floor((absoluteLongitude - degrees) * 60);
  const seconds = Math.round(((absoluteLongitude - degrees) * 60 - minutes) * 60);

  const direction = decimalLongitude >= 0 ? "E" : "W";

  return `${degrees}°${minutes}'${seconds}" ${direction}`;
};

// Traduit via i18next (namespace "moon", clé "cardinalDirections", tableau de 16 valeurs)
// plutôt qu'un tableau FR en dur — voir src/i18n/locales/{fr,en,it}/moon.json. Seul
// consommateur actuel : l'affichage des lever/coucher de Lune (MoonCalendarScreen).
export const convertAzimuthToCardinalDirection = (azimuthDegrees: number): string => {
  const normalized = ((azimuthDegrees % 360) + 360) % 360;
  const index = Math.round(normalized / 22.5) % 16;
  const directions = i18next.t("cardinalDirections", { ns: "moon", returnObjects: true }) as string[];
  return directions[index];
};