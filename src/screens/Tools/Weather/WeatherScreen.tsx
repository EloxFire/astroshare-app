import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native"
import { globalStyles } from "../../../helpers/globalStyles"
import { ScreenHeader } from "../../../components/ScreenHeader/ScreenHeader"
import { useTranslation } from "react-i18next"
import { weatherScreenStyles } from "./WeatherScreen.styles"
import { useWeatherData } from "../../../context/WeatherDataContext"
import ObservabilityScoreCard from "../../../components/ObservabilityScoreCard/ObservabilityScoreCard"
import UsefulNightCard from "../../../components/UsefulNightCard/UsefulNightCard"
import HourlyForecastCard from "../../../components/weather/HourlyForecastCard/HourlyForecastCard"
import HourlyDetailsCard from "../../../components/weather/HourlyDetailsCard/HourlyDetailsCard"
import WeatherSummary from "../../../components/weather/WeatherSummary/WeatherSummary"
import { useState } from "react"
import dayjs from "dayjs"
import { useAppUnits } from "../../../hooks/useAppUnits"

const WeatherScreen = () => {

  const { t } = useTranslation("tools/weather")
  const { weather, astroConditions } = useWeatherData()
  const { formatDate } = useAppUnits()

  const [selectedHourlyCard, setSelectedHourlyCard] = useState<number>(0)

  return (
    <View style={globalStyles.screen}>
      <ScreenHeader title={t("screen.title")} />

      <ScrollView>
        <View style={globalStyles.content}>
          {/* SUMMARY CARD */}
          <WeatherSummary />

          {/* HOURLY FORECAST */}
          <View style={weatherScreenStyles.hourlyForecastSection}>
            <View>
              <Text style={globalStyles.categoryTitle}>{t("hourlyForecast.title")}</Text>
              <Text style={globalStyles.categorySubtitle}>{t("hourlyForecast.subtitle")}</Text>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={weatherScreenStyles.hourlyForecastSection.hourlyForecastContainer}>
                {
                  weather?.hourly && weather.hourly.slice(0, 24).map((hour, index) => {
                    return (
                      <HourlyForecastCard
                        hourly={hour}
                        weather={weather}
                        astro={astroConditions}
                        key={index}
                        active={index === selectedHourlyCard}
                        onCardPress={() => setSelectedHourlyCard(index)}
                      />
                    )
                  })
                }
              </View>
            </ScrollView>
          </View>

          {/* DÉTAILS HEURE SÉLECTIONNÉE */}
          {
            weather?.hourly[selectedHourlyCard] && (
              <View style={weatherScreenStyles.selectedHourlyDetailsContainer}>
                <Text style={globalStyles.categoryTitle}>
                  {t("hourlyForecast.details.title", {time: formatDate(dayjs.unix(weather.hourly[selectedHourlyCard].dt)).format("HH")})}H
                </Text>

                <HourlyDetailsCard hourly={weather.hourly[selectedHourlyCard]} weather={weather} astro={astroConditions} />
              </View>
            )
          }
        </View>
      </ScrollView>
    </View>
  )
}

export default WeatherScreen