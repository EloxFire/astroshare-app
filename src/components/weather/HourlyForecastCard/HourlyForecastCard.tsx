import { Image, Text, View } from "react-native";
import { HourlyWeather, WeatherData } from "../../../types/weather/Weather";
import { AstroConditionsData } from "../../../types/weather/AstroConditions";
import { hourlyForecastCardStyles } from "./HourlyForecastCard.styles";
import dayjs from "dayjs";
import { useAppUnits } from "../../../hooks/useAppUnits";
import { getObservabilityScoreColor, withOpacity } from "../../../helpers/variables";
import { computeObservabilityScore } from "../../../helpers/weather/observabilityScore";
import { getWeatherIcon } from "../../../helpers/weather/getWeatherIcon";

interface HourlyForecastCardProps {
  hourly: HourlyWeather;
  weather: WeatherData; // nécessaire pour `daily` (facteur lune, voir computeObservabilityScore)
  astro: AstroConditionsData | null;
}

const HourlyForecastCard = ({ hourly, weather, astro }: HourlyForecastCardProps) => {

  const { formatDate } = useAppUnits();

  // computeObservabilityScore attend un WeatherData complet (il lit `daily[0]` pour le facteur
  // lune) : on reprend `weather` tel quel et on substitue juste `current` par ce point horaire —
  // même construction que `nightConditions` dans WeatherScreen.tsx. `hourly.dt` est un timestamp
  // Unix (secondes) : on le convertit en Date native, pas en objet dayjs (qui n'a pas .getTime(),
  // utilisée en interne par isMoonUp/findClosestAstroPoint).
  const hourDate = new Date(hourly.dt * 1000);
  const hourScore = computeObservabilityScore({ ...weather, current: hourly }, astro, hourDate);
  const scoreColor = getObservabilityScoreColor(hourScore?.total);

  return (
    <View style={[hourlyForecastCardStyles.card, { borderColor: withOpacity(scoreColor, 0.4) }]}>
      <Text style={hourlyForecastCardStyles.card.time}>{formatDate(dayjs.unix(hourly.dt)).format("HH")}H</Text>
      <Image source={getWeatherIcon(hourly.weather[0].icon)} style={hourlyForecastCardStyles.card.weatherIcon} />
      <Text style={hourlyForecastCardStyles.card.temp}>{Math.round(hourly.temp)}°</Text>
      {
        hourScore && (
          <>
            <View style={hourlyForecastCardStyles.card.scoreBar}>
              <View style={[hourlyForecastCardStyles.card.scoreBar.fill, { height: `${hourScore.total}%`, backgroundColor: scoreColor }]} />
            </View>
            <Text style={[hourlyForecastCardStyles.card.score, { color: scoreColor }]}>{hourScore.total}</Text>
          </>
        )
      }
    </View>
  )
}

export default HourlyForecastCard;