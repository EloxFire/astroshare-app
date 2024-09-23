import { GeographicCoordinate, getBodyNextRise, getSolarEquatorialCoordinate, isTransitInstance } from "@observerly/astrometry"
import dayjs from "dayjs"

export const isNightPastTwelve = (date: Date, observer: GeographicCoordinate): boolean => {
  const sunData = getSolarEquatorialCoordinate(date)
  const nextSunRise = getBodyNextRise(date, observer, sunData)

  // If thr date is after 12AM and the next sunrise time it is still an ongoing night
  if(isTransitInstance(nextSunRise)){
    if (date.getHours() >= 0 && (dayjs().isBefore(nextSunRise.datetime))) {
      return true
    }
  }

  return false
}