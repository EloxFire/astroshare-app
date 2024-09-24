import { GeographicCoordinate, getBodyNextRise, getSolarEquatorialCoordinate, isTransitInstance } from "@observerly/astrometry"
import dayjs from "dayjs"

export const isNightPastTwelve = (date: Date, observer: GeographicCoordinate): boolean => {
  const sunData = getSolarEquatorialCoordinate(date)
  const nextSunRise = getBodyNextRise(date, observer, sunData)

  // Si on obtient une instance valide pour le lever du soleil
  if(isTransitInstance(nextSunRise)){
    const nextSunRiseTime = dayjs(nextSunRise.datetime)
    const currentDate = dayjs(date)

    console.log('Prochain lever du soleil', nextSunRiseTime.format('YYYY-MM-DD HH:mm:ss'));

    // Vérifie si le prochain lever de soleil est bien le jour même et non au lendemain
    if (nextSunRiseTime.isAfter(currentDate, 'day')) {
      // Si le prochain lever de soleil est le lendemain, le soleil est déjà levé pour aujourd'hui
      return false
    }

    // Si la date est après minuit (00:00) mais avant le lever de soleil du jour actuel
    if (currentDate.hour() >= 0 && currentDate.isBefore(nextSunRiseTime)) {
      return true
    }
  }

  return false
}