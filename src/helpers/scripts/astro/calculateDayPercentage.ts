import dayjs, { Dayjs } from "dayjs";

export const calculateDayPercentage = (sunrise: Dayjs, sunset: Dayjs): number => {
  if (!sunrise || !sunset) return 0;

  const now = dayjs();
  const sunriseToNow = now.diff(sunrise, "minute");
  const sunriseToSunset = sunset.diff(sunrise, "minute");
  const percentage = sunriseToNow / sunriseToSunset;
  const formated = percentage * 100;

  if (formated > 100) return 100;
  if (formated < 0) return 0;

  return Math.floor(Math.round(percentage * 100));
}