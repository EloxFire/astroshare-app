import { EquatorialCoordinate, GeographicCoordinate, TransitInstance, convertGreenwhichSiderealTimeToUniversalTime, convertLocalSiderealTimeToGreenwhichSiderealTime, getBodyNextSet, getBodyTransit, isBodyCircumpolar, isBodyVisible } from "@observerly/astrometry"

/**
 *
 * getBodyNextSet()
 *
 * Determines the next set time for an object, if at all.
 *
 * @param date - The date to start searching for the next set.
 * @param observer - The geographic coordinate of the observer.
 * @param target - The equatorial coordinate of the observed object.
 * @param horizon - The observer's horizon (in degrees).
 * @returns The next set time or False if the object never sets, or True if the object is always above the horizon (circumpolar) for the observer.
 */
export const getBodyNextSetTime = (
  datetime: Date,
  observer: GeographicCoordinate,
  target: EquatorialCoordinate,
  horizon: number = 0
): TransitInstance | boolean => {

  // console.log("Getting next set time...");
  

  const tomorrow = new Date(
    Date.UTC(
      datetime.getUTCFullYear(),
      datetime.getUTCMonth(),
      datetime.getUTCDate() + 1,
      0,
      0,
      0,
      0
    )
  )

  // If the object is circumpolar, it never sets:
  if (isBodyCircumpolar(observer, target, horizon)) {
    return true
  }

  // If the object is never visible, it never sets:
  if (!isBodyVisible(observer, target, horizon)) {
    return false
  }

  const transit = getBodyTransit(observer, target)

  if (!transit) {
    // Get the next set time for the next day:
    return getBodyNextSet(tomorrow, observer, target, horizon)
  }

  const LSTs = transit.LSTs

  // Convert the local sidereal time of set to Greenwhich sidereal time:
  const GSTs = convertLocalSiderealTimeToGreenwhichSiderealTime(LSTs, observer)

  // Convert the Greenwhich sidereal time to universal coordinate time for the date specified:
  const set = convertGreenwhichSiderealTimeToUniversalTime(GSTs, datetime)

  // If the set is before the current time, then we know the next set is tomorrow:
  if (set < datetime) {
    console.log("Set is before current time, getting next set time...");
    
    return getBodyNextSet(tomorrow, observer, target, horizon)
  }

  return {
    datetime: set,
    LST: transit.LSTs,
    GST: GSTs,
    az: transit.S
  }
}