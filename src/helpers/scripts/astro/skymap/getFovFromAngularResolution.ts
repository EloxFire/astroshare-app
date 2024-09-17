export const getFovFromAngularResolution = (angleRes: number, NumPix: number): number => {
  return (angleRes * (180 / Math.PI) * NumPix); //calcul du FOV de la caméra à partir de la résolution angulaire d'un pixel
}