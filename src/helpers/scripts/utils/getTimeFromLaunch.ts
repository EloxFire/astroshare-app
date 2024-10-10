import dayjs from "dayjs";

export const getTimeFromLaunch = (timeTo: Date) => {
  const now = dayjs();
  const targetTime = dayjs(timeTo);

  const diff = targetTime.diff(now, 'second');
  const absDiff = Math.abs(diff); // Get the absolute difference

  const timer = dayjs.duration(absDiff, 'seconds').format('D[j] HH[h] mm[m] ss[s]');

  return timer;
};