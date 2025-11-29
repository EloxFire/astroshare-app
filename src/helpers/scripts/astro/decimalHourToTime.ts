import dayjs, { Dayjs } from "dayjs";

const decimalHoursToHMS = (decimalHours: number) => {
  // Wrap inside 24 hours and convert to seconds to keep rounding consistent
  const totalSeconds = Math.round(decimalHours * 3600);
  const wrappedSeconds = ((totalSeconds % 86400) + 86400) % 86400;

  const hours = Math.floor(wrappedSeconds / 3600);
  const minutes = Math.floor((wrappedSeconds % 3600) / 60);
  const seconds = wrappedSeconds % 60;

  return { hours, minutes, seconds };
};

/**
 * Convertit une valeur en heures décimales en une chaîne de caractères au format HH:MM:SS
 * @param decimalHours - La valeur en heures décimales à convertir
 * @returns Une chaîne de caractères représentant la valeur au format HH:MM:SS
 */
export const convertDecimalHoursToTime = (decimalHours: number): string => {
  const { hours, minutes, seconds } = decimalHoursToHMS(decimalHours);

  // Combiner les heures, minutes et secondes en une chaîne de caractères
  const timeString = `${hours.toString().padStart(2, '0')}:${minutes
    .toString()
    .padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

  return timeString;
}

/**
 * Convert decimal hours into a Dayjs date with today's date and the matching time.
 * Useful when only the time-of-day matters but a date object is required.
 */
export const convertDecimalHoursToDate = (decimalHours: number): Dayjs => {
  const { hours, minutes, seconds } = decimalHoursToHMS(decimalHours);

  return dayjs()
    .hour(hours)
    .minute(minutes)
    .second(seconds)
    .millisecond(0);
};
