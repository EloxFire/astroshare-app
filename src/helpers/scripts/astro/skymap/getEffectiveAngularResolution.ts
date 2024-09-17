export const getEffectiveAngularResolution = (FOV: number, NumPix: number) => {
  return ((FOV / NumPix) * Math.PI) / 180; // Angular resolution of a pixel in radians
}