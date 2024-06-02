import {
  EquatorialCoordinate,
  GeographicCoordinate,
  TransitInstance,
  convertGreenwhichSiderealTimeToUniversalTime,
  convertLocalSiderealTimeToGreenwhichSiderealTime,
  getBodyTransit,
  isBodyCircumpolar,
  isBodyVisible,
  isBodyVisibleForNight
} from "@observerly/astrometry"
import { Dayjs } from "dayjs"

/**
 *
 * getBodyNextRise()
 *
 * Determines the next rise time for an object, if at all.
 *
 * @param date - The date to start searching for the next rise.
 * @param observer - The geographic coordinate of the observer.
 * @param target - The equatorial coordinate of the observed object.
 * @param horizon - The observer's horizon (in degrees).
 * @returns The next rise time or False if the object never rises, or True if the object is always above the horizon (circumpolar) for the observer.
 */
export const getBodyNextRiseTime = (
  datetime: Date,
  observer: GeographicCoordinate,
  target: EquatorialCoordinate,
  horizon: number = 0
): TransitInstance | boolean => {

  console.log("Searching rise time for :", datetime);
  

  const tomorrow = new Date(
    datetime.getFullYear(),
    datetime.getMonth(),
    datetime.getDate() + 1,
    2,
    0,
    0,
    1
  )

  if (isBodyCircumpolar(observer, target, horizon)) {
    return true
  }

  if (!isBodyVisible(observer, target, horizon)) {
    return false
  }

  // Here we know the object is visible and not circumpolar, so we can find the next transit
  const transit = getBodyTransit(observer, target)

  if (!transit) {
    // Get the next rise time for the next day:
    return getBodyNextRiseTime(tomorrow, observer, target, horizon)
  }

  const LSTr = transit.LSTr

  // Convert the local sidereal time of rise to Greenwhich sidereal time:
  const GSTr = convertLocalSiderealTimeToGreenwhichSiderealTime(LSTr, observer)
  // Convert the Greenwhich sidereal time to universal coordinate time for the date specified:
  const rise = convertGreenwhichSiderealTimeToUniversalTime(GSTr, datetime)
  

  // If the rise is before the current time, then we know the next rise is tomorrow:
  // if (rise < datetime) {
  //   return getBodyNextRiseTime(tomorrow, observer, target, horizon)
  // }

  return {
    datetime: rise,
    LST: transit.LSTr,
    GST: GSTr,
    az: transit.R
  }
}