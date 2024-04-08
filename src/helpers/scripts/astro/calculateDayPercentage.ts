import dayjs, { Dayjs } from "dayjs";

// Mode 0: day, 1: night
export const calculateDayPercentage = (sunrise: Dayjs, sunset: Dayjs, mode: number): number => {
  if (!sunrise || !sunset) return 0;

  const now = dayjs();
  let startTime: Dayjs;
  let endTime: Dayjs;

  if (mode === 0) {
    startTime = sunrise;
    endTime = sunset;
  } else {
    const nextSunrise = sunrise.add(1, "day");
    startTime = sunset;
    endTime = nextSunrise;
  }

  const timeToNow = now.diff(startTime, "minute");
  const totalTime = endTime.diff(startTime, "minute");
  const percentage = timeToNow / totalTime;
  const formatted = percentage * 100;

  if (formatted > 100) return 100;
  if (formatted < 0) return 0;

  return Math.round(formatted);
}