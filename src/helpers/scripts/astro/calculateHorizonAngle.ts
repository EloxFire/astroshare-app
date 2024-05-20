export const calculateHorizonAngle = (altitudeMeters: number): number => {
  const R = 6371; // Rayon de la Terre en kilomètres
  const h = altitudeMeters / 1000; // Convertir l'altitude de mètres en kilomètres

  // Calculer la dépression de l'horizon en radians
  const thetaRadians = Math.sqrt(2 * h / R);

  // Convertir la dépression en degrés
  const thetaDegrees = thetaRadians * (180 / Math.PI);

  return thetaDegrees;
};