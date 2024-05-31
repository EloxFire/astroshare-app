import { EquatorialCoordinate, GeographicCoordinate, TransitInstance, convertGreenwhichSiderealTimeToUniversalTime, convertLocalSiderealTimeToGreenwhichSiderealTime, getBodyTransit, isBodyCircumpolar, isBodyVisible } from "@observerly/astrometry"

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
export const getBodyNextRise = (
  datetime: Date,
  observer: GeographicCoordinate,
  target: EquatorialCoordinate,
  horizon: number = 0
): TransitInstance | false => {
  const maxAttempts = 365; // Limit the number of attempts to prevent infinite recursion
  let attempts = 0;

  console.log({
    datetime,
    observer,
    target,
    horizon
  });
  
  
  while (attempts < maxAttempts) {
    console.log(`Attempt ${attempts}: Checking rise time for: ${datetime}`);

    const tomorrow = new Date(
      datetime.getFullYear(),
      datetime.getMonth(),
      datetime.getDate() + 1,
      0,
      0,
      0,
      0
    );

    if (isBodyCircumpolar(observer, target, horizon) || !isBodyVisible(observer, target, horizon)) {
      console.log(`Object is circumpolar or not visible from the observer's location.`);
      return false;
    }

    const transit = getBodyTransit(observer, target);

    

    if (!transit) {
      console.log(`No transit found, checking the next day: ${tomorrow}`);
      datetime = tomorrow;
      attempts++;
      continue;
    }

    const LSTr = transit.LSTr;
    const GSTr = convertLocalSiderealTimeToGreenwhichSiderealTime(LSTr, observer);
    const rise = convertGreenwhichSiderealTimeToUniversalTime(GSTr, datetime);

    if (rise < datetime) {      
      console.log(`Rise time ${rise} is before current time, checking the next day: ${tomorrow}`);
      datetime = tomorrow;
      attempts++;
      continue;
    }

    console.log(`Next rise time found: ${rise}`);
    return {
      datetime: rise,
      LST: transit.LSTr,
      GST: GSTr,
      az: transit.R
    };
  }

  console.log(`Exceeded maximum attempts (${maxAttempts}) to find the next rise time.`);
  return false;
};