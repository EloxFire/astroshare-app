/**
 * Convertit une valeur en heures décimales en une chaîne de caractères au format HH:MM:SS
 * @param decimalHours - La valeur en heures décimales à convertir
 * @returns Une chaîne de caractères représentant la valeur au format HH:MM:SS
 */
export const convertDecimalHoursToTime = (decimalHours: number): string => {
  // Séparer la partie entière des heures de la partie décimale
  const hours = Math.floor(decimalHours);
  const decimalPart = decimalHours - hours;

  // Convertir la partie décimale en minutes
  const totalMinutes = decimalPart * 60;
  const minutes = Math.floor(totalMinutes);
  const decimalMinutes = totalMinutes - minutes;

  // Convertir la partie décimale des minutes en secondes
  const totalSeconds = decimalMinutes * 60;
  const seconds = Math.round(totalSeconds);

  // Combiner les heures, minutes et secondes en une chaîne de caractères
  const timeString = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

  return timeString;
}