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