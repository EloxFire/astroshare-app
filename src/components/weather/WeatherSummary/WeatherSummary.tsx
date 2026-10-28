import { Image, Text, TouchableOpacity, View } from "react-native"
import { weatherSummaryStyles } from "./WeatherSummar.styles"
import { useWeatherData } from "../../../context/WeatherDataContext"
import { WeatherData } from "../../../types/weather/Weather"
import { useTranslation } from "react-i18next"
import { useLocation } from "../../../context/LocationContext"
import { GpsLocation } from "../../../types/gpsLocation"
import { Compass, Droplets, Repeat, Thermometer, ThermometerSnowflakeIcon, TrendingDown, TrendingUp, Wind } from "lucide-react-native"
import { app_colors } from "../../../helpers/variables"
import { getWeatherIcon } from "../../../helpers/weather/getWeatherIcon"
import { captitalizeFirstLetter, formatWindSpeed } from "../../../helpers/format"
import { useAppUnits } from "../../../hooks/useAppUnits"
import { convertAzimuthToCardinalDirection } from "../../../helpers/location/convert"

const WeatherSummary = () => {

  const { t, i18n } = useTranslation("tools/weather");
  const { location }: { location: GpsLocation | null} = useLocation();
  const { weather, refetch }: { weather: WeatherData | null, refetch: () => void } = useWeatherData()
  const { formatTemperatureCelsius } = useAppUnits()

  if(!location || !weather) {
    return (
      <View style={weatherSummaryStyles.card}>
        <View style={weatherSummaryStyles.card.header}>
          <View>
            <Text style={weatherSummaryStyles.card.header.title}>{t("summary.loading")}</Text>
          </View>
        </View>
      </View>
    )
  }

  return (
    <View style={weatherSummaryStyles.card}>
      <View style={weatherSummaryStyles.card.header}>
        <View style={{display: "flex", flexDirection: "column", gap: 2}}>
          <Text style={weatherSummaryStyles.card.header.title}>{location.local_names?.[i18n.language] || location.name}</Text>
          <Text style={weatherSummaryStyles.card.header.subtitle}>{location.state ? `${location.state}, ${location.country}` : location.country}</Text>
        </View>
        <TouchableOpacity style={weatherSummaryStyles.card.header.button} onPress={refetch}>
          <Repeat size={20} color={app_colors.white} />
        </TouchableOpacity>
      </View>

      <View style={weatherSummaryStyles.card.body}>
        <View style={weatherSummaryStyles.card.body.iconContainer}>
          <Image
            style={weatherSummaryStyles.card.body.iconContainer.icon}
            source={getWeatherIcon(weather.current.weather[0].icon)}
          />
          <Text style={weatherSummaryStyles.card.body.iconContainer.description}>{captitalizeFirstLetter(weather.current.weather[0].description)}</Text>
        </View>

        <View style={weatherSummaryStyles.card.body.conditions}>
          <View style={weatherSummaryStyles.card.body.conditions.main}>
            <Text style={weatherSummaryStyles.card.body.conditions.main.text}>{formatTemperatureCelsius(weather.current.temp)}</Text>
          </View>

          <View style={weatherSummaryStyles.card.body.conditions.row}>
            <View style={[weatherSummaryStyles.card.body.conditions.item, weatherSummaryStyles.card.body.conditions.item.reverse]}>
              <TrendingUp size={20} color={app_colors.white} />
              <Text style={weatherSummaryStyles.card.body.conditions.item.text}>{formatTemperatureCelsius(weather.daily[0].temp.max)}</Text>
            </View>
            <View style={weatherSummaryStyles.card.body.conditions.item}>
              <TrendingDown size={20} color={app_colors.white} />
              <Text style={weatherSummaryStyles.card.body.conditions.item.text}>{formatTemperatureCelsius(weather.daily[0].temp.min)}</Text>
            </View>
          </View>

          <View style={weatherSummaryStyles.card.body.conditions.row}>
            <View style={[weatherSummaryStyles.card.body.conditions.item, weatherSummaryStyles.card.body.conditions.item.reverse]}>
              <Droplets size={20} color={app_colors.white} />
              <Text style={weatherSummaryStyles.card.body.conditions.item.text}>{weather.current.humidity}%</Text>
            </View>
            <View style={weatherSummaryStyles.card.body.conditions.item}>
              <ThermometerSnowflakeIcon size={20} color={app_colors.white} />
              <Text style={weatherSummaryStyles.card.body.conditions.item.text}>{formatTemperatureCelsius(weather.current.feels_like)}</Text>
            </View>
          </View>

          <View style={weatherSummaryStyles.card.body.conditions.row}>
            <View style={[weatherSummaryStyles.card.body.conditions.item, weatherSummaryStyles.card.body.conditions.item.reverse]}>
              <Wind size={20} color={app_colors.white} />
              <Text style={weatherSummaryStyles.card.body.conditions.item.text}>{formatWindSpeed(weather.current.wind_speed)}</Text>
            </View>

            <View style={weatherSummaryStyles.card.body.conditions.item}>
              <Compass size={20} color={app_colors.white} />
              <Text style={weatherSummaryStyles.card.body.conditions.item.text}>{convertAzimuthToCardinalDirection(weather.current.wind_deg)}</Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  )
}

export default WeatherSummary