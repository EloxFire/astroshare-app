import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native"
import { globalStyles } from "../../../helpers/globalStyles"
import { ScreenHeader } from "../../../components/ScreenHeader/ScreenHeader"
import { useTranslation } from "react-i18next"
import { weatherScreenStyles } from "./WeatherScreen.styles"
import { useLocation } from "../../../context/LocationContext"
import { useWeatherData } from "../../../context/WeatherDataContext"
import { Droplets, RepeatIcon, TrendingUp, TrendingDown, Wind, ThermometerSun, Compass } from "lucide-react-native"
import { getWeatherIcon } from "../../../helpers/weather/getWeatherIcon"
import { app_colors } from "../../../helpers/variables"
import { formatHumidity, formatWindSpeed } from "../../../helpers/format"
import { convertAzimuthToCardinalDirection } from "../../../helpers/location/convert"
import { useAppUnits } from "../../../hooks/useAppUnits"
import ObservabilityScoreCard from "../../../components/ObservabilityScoreCard/ObservabilityScoreCard"
import UsefulNightCard from "../../../components/UsefulNightCard/UsefulNightCard"
import HourlyForecastCard from "../../../components/weather/HourlyForecastCard/HourlyForecastCard"
import WeatherSummary from "../../../components/weather/WeatherSummary/WeatherSummary"

const WeatherScreen = () => {

  const { location } = useLocation()
  const { t, i18n } = useTranslation("tools/weather")
  const { formatTemperatureCelsius } = useAppUnits()
  const { weather, astroConditions, nightConditions, nightReference, observationScore, refetch } = useWeatherData()

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

              <TouchableOpacity style={weatherScreenStyles.cardDark.refreshButton} onPress={refetch}>
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

          <WeatherSummary
          
          />

          {/* NUIT UTILE */}
          <UsefulNightCard />

          {/* INFOS ASTRO ET SCORE D'OBSERVATION */}
          <ObservabilityScoreCard
            weather={nightConditions}
            astro={astroConditions}
            score={observationScore}
            nightReference={nightReference}
          />


          {/* HOURLY FORECAST */}
          <Text style={globalStyles.categoryTitle}>{t("hourlyForecast.title")}</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={weatherScreenStyles.hourlyForecastContainer}>
              {
                weather?.hourly && weather.hourly.slice(0, 24).map((hour, index) => {
                  return (
                    <HourlyForecastCard
                      hourly={hour}
                      weather={weather}
                      astro={astroConditions}
                      key={index}
                    />
                  )
                })
              }
            </View>
          </ScrollView>
        </View>
      </ScrollView>
    </View>
  )
}

export default WeatherScreen