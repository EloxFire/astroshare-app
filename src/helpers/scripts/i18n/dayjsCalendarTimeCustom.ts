import dayjs, { Dayjs } from 'dayjs';
import {i18n} from "./index";

export function makeCalendarMapping() {
  const timeFormat = 'HH:mm';
  const dateFormat = 'DD/MM/YYYY';
  const weekdayFormat = 'dddd';

  const timeStr = (d: Dayjs) => d.format(timeFormat);
  const dateStr = (d: Dayjs) => d.format(dateFormat);
  const weekdayStr = (d: Dayjs) => d.format(weekdayFormat);

  return {
    sameDay(this: Dayjs) {
      return i18n.t('common.time.calendar.sameDay', { time: timeStr(this) });
    },
    nextDay(this: Dayjs) {
      return i18n.t('common.time.calendar.nextDay', { time: timeStr(this) });
    },
    nextWeek(this: Dayjs) {
      return i18n.t('common.time.calendar.nextWeek', { weekday: weekdayStr(this), time: timeStr(this) });
    },
    lastDay(this: Dayjs) {
      return i18n.t('common.time.calendar.lastDay', { time: timeStr(this) });
    },
    lastWeek(this: Dayjs) {
      return i18n.t('common.time.calendar.lastWeek', { weekday: weekdayStr(this), time: timeStr(this) });
    },
    sameElse(this: Dayjs) {
      return i18n.t('common.time.calendar.sameElse', { date: dateStr(this), time: timeStr(this) });
    },
  };
}