import { Image, ImageSourcePropType, InteractionManager, ScrollView, Text, TouchableOpacity, View } from "react-native"
import { globalStyles } from "../../../helpers/globalStyles"
import { ScreenHeader } from "../../../components/ScreenHeader/ScreenHeader"
import { useTranslation } from "react-i18next"
import { weatherScreenStyles } from "./WeatherScreen.styles"
import { useLocation } from "../../../context/GpsContext"
import { Droplets, RepeatIcon, TrendingUp, TrendingDown, Wind, ThermometerSun, Compass } from "lucide-react-native"
import { GpsLocation } from "../../../types/gpsLocation"
import { useEffect, useState } from "react"
import { getWeather } from "../../../helpers/api/weather/weather"
import { getAstroConditions } from "../../../helpers/api/weather/astroConditions"
import { HourlyWeather, WeatherData } from "../../../types/weather/Weather"
import { AstroConditionsData } from "../../../types/weather/AstroConditions"
import { getWeatherIcon } from "../../../helpers/weather/getWeatherIcon"
import { app_colors } from "../../../helpers/variables"
import { formatHumidity, formatWindSpeed } from "../../../helpers/format"
import { convertAzimuthToCardinalDirection } from "../../../helpers/location/convert"
import { useAppUnits } from "../../../hooks/useAppUnits"
import { computeObservabilityScore, ObservabilityScore } from "../../../helpers/weather/observabilityScore"
import ObservabilityScoreCard, { ObservabilityNightReference } from "../../../components/ObservabilityScoreCard/ObservabilityScoreCard"
import { convertEquatorialToHorizontal, getSolarEquatorialCoordinate } from "@observerly/astrometry"
import { findNextHorizonCrossing } from "../../../helpers/astrometry/altitude/altitudeCurve"

// Seuil de la nuit astronomique (même seuil que SpaceWeatherScreen) : en dessous, le ciel est assez
// sombre pour que l'observation ait un sens — une bonne observabilité en plein jour ne veut rien dire.
const ASTRONOMICAL_NIGHT_THRESHOLD = -18;

// Point le plus proche de `date` dans la série horaire OpenWeather (dt en secondes Unix), même
// principe que findClosestAstroPoint côté 7Timer — utilisé pour afficher/scorer les conditions
// prévues pour la nuit plutôt que l'instant présent.
const findClosestHourlyWeather = (hourly: HourlyWeather[], date: Date): HourlyWeather | undefined => {
  if (hourly.length === 0) return undefined;
  const targetSeconds = Math.floor(date.getTime() / 1000);
  return hourly.reduce((closest, point) =>
    Math.abs(point.dt - targetSeconds) < Math.abs(closest.dt - targetSeconds) ? point : closest
  );
};

const WeatherScreen = () => {

  const { location }: {location: GpsLocation} = useLocation()
  const { t, i18n } = useTranslation("tools/weather")
  const { formatTemperatureCelsius } = useAppUnits()

  const [weather, setWeather] = useState<WeatherData | null>(null)
  const [astroConditions, setAstroConditions] = useState<AstroConditionsData | null>(null)
  const [observationScore, setObservationScore] = useState<ObservabilityScore | null>(null)
  const [nightConditions, setNightConditions] = useState<WeatherData | null>(null)
  const [nightReference, setNightReference] = useState<ObservabilityNightReference | null>(null)

  useEffect(() => {
    const task = InteractionManager.runAfterInteractions(async () => {
      const wd = await getWeather(location?.latitude, location?.longitude, i18n.language)
      const ac = await getAstroConditions(location?.latitude, location?.longitude)

      if(!wd) {
        console.log(`[weatherScreen] Error fetching weather data`)
        return
      }

      if(!ac) {
        console.log(`[weatherScreen] Error fetching astro conditions data`)
        return
      }

      const now = new Date()
      const observer = {
        latitude: location?.latitude ?? 0,
        longitude: location?.longitude ?? 0,
        altitude: location?.elevation ?? 0,
      }
      const sunEqCoords = getSolarEquatorialCoordinate(now)
      const { alt: sunAltitude } = convertEquatorialToHorizontal(now, observer, sunEqCoords)
      const isCurrentlyNight = sunAltitude < ASTRONOMICAL_NIGHT_THRESHOLD
      // Si la nuit astronomique ne commence/ne finit jamais aujourd'hui (été/haute latitude),
      // on retombe sur "maintenant" plutôt que de ne rien afficher.
      const nightDate = isCurrentlyNight
        ? now
        : findNextHorizonCrossing(now, observer, getSolarEquatorialCoordinate, "set", ASTRONOMICAL_NIGHT_THRESHOLD) ?? now

      const nightCurrent = isCurrentlyNight ? wd.current : (findClosestHourlyWeather(wd.hourly, nightDate) ?? wd.current)
      const nd: WeatherData = { ...wd, current: nightCurrent }
      const obsScore = computeObservabilityScore(nd, ac, nightDate)

      setWeather(wd)
      setAstroConditions(ac)
      setNightConditions(nd)
      setNightReference({ date: nightDate, isCurrentlyNight })
      setObservationScore(obsScore)
    });

    return () => task.cancel();
  }, [])

  return (
    <View style={globalStyles.screen}>
      <ScreenHeader title={t("screen.title")} />

      <ScrollView>
        <View style={globalStyles.content}>
          {/* SUMMARY CARD */}
          <View style={[globalStyles.defaultCard, weatherScreenStyles.cardDark]}>
            <View style={globalStyles.defaultCard.header}>
              <View>
                <Text style={weatherScreenStyles.cardDark.header.title}>{location?.local_names ? location.local_names[i18n.language] ?? location.name : location?.name}</Text>
                <Text style={weatherScreenStyles.cardDark.header.subtitle}>{location?.state ? `${location.state}, ${location.country}` : location?.country}</Text>
              </View>

              <TouchableOpacity style={weatherScreenStyles.cardDark.refreshButton}>
                <RepeatIcon size={20} color={app_colors.white} />
              </TouchableOpacity>
            </View>

            <View style={weatherScreenStyles.cardDark.body}>
              <View style={weatherScreenStyles.cardDark.body.currentConditions}>
                <Image
                  style={weatherScreenStyles.cardDark.body.currentConditions.icon}
                  source={getWeatherIcon(weather?.current?.weather[0]?.icon ?? "01d")}
                />
                <Text style={weatherScreenStyles.cardDark.body.currentConditions.label}>{weather?.current?.weather[0]?.description ?? "--"}</Text>
              </View>
              <View style={weatherScreenStyles.cardDark.body.current}>
                <Text style={weatherScreenStyles.cardDark.body.current.temperature}>
                  {weather?.current ? formatTemperatureCelsius(weather.current.temp) : "--"}
                </Text>

                <View style={weatherScreenStyles.cardDark.body.current.conditions}>
                  {/* HUMIDITY */}
                  <View style={weatherScreenStyles.cardDark.body.current.conditions.item}>
                    <Droplets size={16} color={app_colors.white} />
                    <Text style={weatherScreenStyles.cardDark.body.current.conditions.item.value}>
                      {weather?.current ? formatHumidity(weather.current.humidity) : "--"}
                    </Text>
                  </View>

                  {/* MAX TEMP */}
                  <View style={weatherScreenStyles.cardDark.body.current.conditions.item}>
                    <TrendingUp size={16} color={app_colors.white} />
                    <Text style={weatherScreenStyles.cardDark.body.current.conditions.item.value}>
                      {weather?.daily[0] ? formatTemperatureCelsius(weather.daily[0].temp.max) : "--"}
                    </Text>
                  </View>

                  {/* MIN TEMP */}
                  <View style={weatherScreenStyles.cardDark.body.current.conditions.item}>
                    <TrendingDown size={16} color={app_colors.white} />
                    <Text style={weatherScreenStyles.cardDark.body.current.conditions.item.value}>
                      {weather?.daily[0] ? formatTemperatureCelsius(weather.daily[0].temp.min) : "--"}
                    </Text>
                  </View>
                </View>
                <View style={weatherScreenStyles.cardDark.body.current.conditions}>
                  {/* FEELS LIKE */}
                  <View style={weatherScreenStyles.cardDark.body.current.conditions.item}>
                    <ThermometerSun size={16} color={app_colors.white} />
                    <Text style={weatherScreenStyles.cardDark.body.current.conditions.item.value}>
                      {weather?.current ? formatTemperatureCelsius(weather.current.feels_like) : "--"}
                    </Text>
                  </View>
                  
                  {/* WIND SPEED */}
                  <View style={weatherScreenStyles.cardDark.body.current.conditions.item}>
                    <Wind size={16} color={app_colors.white} />
                    <Text style={weatherScreenStyles.cardDark.body.current.conditions.item.value}>
                      {weather?.current ? formatWindSpeed(weather.current.wind_speed) : "--"}
                    </Text>
                  </View>

                  {/* WIND DIRECTION */}
                  <View style={weatherScreenStyles.cardDark.body.current.conditions.item}>
                    <Compass size={16} color={app_colors.white} />
                    <Text style={weatherScreenStyles.cardDark.body.current.conditions.item.value}>
                      {weather?.current ? convertAzimuthToCardinalDirection(weather.current.wind_deg) : "--"}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          </View>

          {/* INFOS ASTRO ET SCORE D'OBSERVATION */}
          <ObservabilityScoreCard
            weather={nightConditions}
            astro={astroConditions}
            score={observationScore}
            nightReference={nightReference}
          />
        </View>
      </ScrollView>
    </View>
  )
}

export default WeatherScreen