export const convertRadiansToDMS = (radians: number) => {
  // Conversion des radians en degrés
  const degreesFloat = radians * (180 / Math.PI);
  
  // Extraire les degrés, minutes, et secondes
  const degrees = Math.floor(degreesFloat);
  const minutesFloat = (degreesFloat - degrees) * 60;
  const minutes = Math.floor(minutesFloat);
  const seconds = Math.round((minutesFloat - minutes) * 60);
  
  return `${degrees}° ${minutes}' ${seconds}"`;
}