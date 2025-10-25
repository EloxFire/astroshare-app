import {
  EquatorialCoordinate,
  GeographicCoordinate,
  TransitInstance,
  convertGreenwhichSiderealTimeToUniversalTime,
  convertLocalSiderealTimeToGreenwhichSiderealTime,
  getBodyNextRise,
  getBodyTransit,
  isBodyCircumpolar,
  isBodyVisible,
  isBodyVisibleForNight
} from "@observerly/astrometry"

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
  
  // console.log("Getting next rise time...");
  
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

  // If the object is circumpolar, or it is not visible from the observer's location, it never rises:
  if (isBodyCircumpolar(observer, target, horizon) || !isBodyVisible(observer, target, horizon)) {
    return false
  }

  const transit = getBodyTransit(observer, target)

  if (!transit) {
    // Get the next rise time for the next day:
    return getBodyNextRise(tomorrow, observer, target, horizon)
  }

  const LSTr = transit.LSTr

  // Convert the local sidereal time of rise to Greenwhich sidereal time:
  const GSTr = convertLocalSiderealTimeToGreenwhichSiderealTime(LSTr, observer)

  // Convert the Greenwhich sidereal time to universal coordinate time for the date specified:
  const rise = convertGreenwhichSiderealTimeToUniversalTime(GSTr, datetime)

  // If the rise is before the current time, then we know the next rise is tomorrow:
  if (rise.getTime() < datetime.getTime()) {
    console.log('[getBodyNextRise] Rise is before current time, checking tomorrow...');
    
    return getBodyNextRise(tomorrow, observer, target, horizon)
  }

  return {
    datetime: rise,
    LST: transit.LSTr,
    GST: GSTr,
    az: transit.R
  }
}