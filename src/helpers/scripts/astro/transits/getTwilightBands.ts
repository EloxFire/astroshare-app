import {GeographicCoordinate, getTwilightBandsForDay, TwilightBand} from "@observerly/astrometry";

export const getCurrentTwilightBand = (date: Date, observer: GeographicCoordinate) => {
  const twilightBands: TwilightBand[] = getTwilightBandsForDay(date, observer);
  const currentTime = date.getTime();

  for (const band of twilightBands) {
    if (currentTime >= band.interval.from.getTime() && currentTime <= band.interval.to.getTime()) {
      return band;
    }
  }
  return null; // No current band found
}