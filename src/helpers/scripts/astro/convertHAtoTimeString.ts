export const convertAngleToTime = (angle: number): string => {
  // Calculer le nombre total d'heures à partir de l'angle donné
  const totalHours = angle / 15; // 1 heure = 15 degrés

  // Extraire les heures, minutes et secondes
  const hours = Math.floor(totalHours);
  const minutes = Math.floor((totalHours - hours) * 60);
  const seconds = Math.floor(((totalHours - hours) * 60 - minutes) * 60);

  // Formater les heures, minutes et secondes en ajoutant des zéros si nécessaire
  const formattedHours = hours.toString().padStart(2, '0');
  const formattedMinutes = minutes.toString().padStart(2, '0');
  const formattedSeconds = seconds.toString().padStart(2, '0');

  // Retourner la chaîne de caractères formatée
  return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
}