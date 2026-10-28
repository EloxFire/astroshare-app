import { Image, Text, View } from "react-native";
import { useTranslation } from "react-i18next";
import {
  Cloud,
  CloudRain,
  CloudSnow,
  Compass,
  Droplet,
  Droplets,
  Eye,
  Gauge,
  Sparkles,
  Sun,
  ThermometerSun,
  Wind,
  Zap,
  type LucideIcon,
} from "lucide-react-native";
import { hourlyDetailsCardStyles } from "./HourlyDetailsCard.styles";
import { app_colors, getObservabilityScoreColor } from "../../../helpers/variables";
import { getWeatherIcon } from "../../../helpers/weather/getWeatherIcon";
import { computeObservabilityScore, findClosestAstroPoint } from "../../../helpers/weather/observabilityScore";
import { captitalizeFirstLetter, formatDistanceInKm, formatHumidity, formatWindSpeed } from "../../../helpers/format";
import { convertAzimuthToCardinalDirection } from "../../../helpers/location/convert";
import { useAppUnits } from "../../../hooks/useAppUnits";
import CircularGauge from "../../CircularGauge/CircularGauge";
import type { HourlyWeather, WeatherData } from "../../../types/weather/Weather";
import type { AstroConditionsData } from "../../../types/weather/AstroConditions";

interface HourlyDetailsCardProps {
  hourly: HourlyWeather;
  weather: WeatherData; // nécessaire pour `daily` (facteur lune du score, voir computeObservabilityScore)
  astro: AstroConditionsData | null;
}

interface DetailItem {
  icon: LucideIcon;
  label: string;
  value: string;
}

// Carte sombre avec le détail complet d'une heure (toutes les données météo, précipitations
// incluses) + les conditions astro 7Timer les plus proches de cette heure si elles sont
// disponibles — même palette/typo que WeatherSummary pour rester cohérent sur l'écran.
const HourlyDetailsCard = ({ hourly, weather, astro }: HourlyDetailsCardProps) => {
  const { t, i18n } = useTranslation("tools/weather");
  const { formatTemperatureCelsius } = useAppUnits();

  const hourDate = new Date(hourly.dt * 1000);
  const astroPoint = astro ? findClosestAstroPoint(astro.data, hourDate) : undefined;
  // Même construction que HourlyForecastCard : score de CETTE heure (current repointé dessus),
  // affiché en rappel dans le coin de la carte.
  const hourScore = computeObservabilityScore({ ...weather, current: hourly }, astro, hourDate);
  const scoreColor = getObservabilityScoreColor(hourScore?.total);

  const weatherItems: DetailItem[] = [
    { icon: ThermometerSun, label: t("hourlyForecast.details.feelsLike"), value: formatTemperatureCelsius(hourly.feels_like) },
    { icon: Droplets, label: t("observability.humidity"), value: formatHumidity(hourly.humidity) },
    { icon: Droplet, label: t("hourlyForecast.details.dewPoint"), value: formatTemperatureCelsius(hourly.dew_point) },
    { icon: Cloud, label: t("observability.clouds"), value: `${Math.round(hourly.clouds)}%` },
    { icon: Wind, label: t("observability.windSpeed"), value: formatWindSpeed(hourly.wind_speed) },
    ...(hourly.wind_gust != null ? [{ icon: Wind, label: t("observability.gusts"), value: formatWindSpeed(hourly.wind_gust) }] : []),
    { icon: Compass, label: t("hourlyForecast.details.windDirection"), value: convertAzimuthToCardinalDirection(hourly.wind_deg) },
    { icon: Gauge, label: t("hourlyForecast.details.pressure"), value: `${hourly.pressure} hPa` },
    { icon: Eye, label: t("hourlyForecast.details.visibility"), value: formatDistanceInKm(hourly.visibility, i18n.language, 1) },
    { icon: Sun, label: t("hourlyForecast.details.uvIndex"), value: hourly.uvi.toFixed(1) },
    { icon: CloudRain, label: t("hourlyForecast.details.precipitationChance"), value: `${Math.round(hourly.pop * 100)}%` },
    ...(hourly.rain?.["1h"] ? [{ icon: CloudRain, label: t("hourlyForecast.details.rain"), value: `${hourly.rain["1h"]} mm` }] : []),
    ...(hourly.snow?.["1h"] ? [{ icon: CloudSnow, label: t("hourlyForecast.details.snow"), value: `${hourly.snow["1h"]} mm` }] : []),
  ];

  // Pas de couverture nuageuse 7Timer ici : moins précise que celle d'OpenWeather déjà affichée
  // dans la section météo (même choix que pour le score d'observabilité, voir observabilityScore.ts).
  const astroItems: DetailItem[] = astroPoint ? [
    { icon: Eye, label: t("observability.seeing"), value: astroPoint.seeing.label },
    { icon: Sparkles, label: t("observability.transparency"), value: astroPoint.transparency.label },
    { icon: Zap, label: t("hourlyForecast.details.instability"), value: astroPoint.instability.label },
  ] : [];

  return (
    <View style={hourlyDetailsCardStyles.card}>
      <View style={hourlyDetailsCardStyles.card.header}>
        <View style={hourlyDetailsCardStyles.card.header.info}>
          <Image style={hourlyDetailsCardStyles.card.header.icon} source={getWeatherIcon(hourly.weather[0].icon)} />
          <View>
            <Text style={hourlyDetailsCardStyles.card.header.temp}>{formatTemperatureCelsius(hourly.temp)}</Text>
            <Text style={hourlyDetailsCardStyles.card.header.description}>{captitalizeFirstLetter(hourly.weather[0].description)}</Text>
          </View>
        </View>

        {/* Rappel du score d'observation de cette heure */}
        <CircularGauge value={hourScore?.total ?? 0} size={46} strokeWidth={5} progressColor={scoreColor}>
          <Text style={[hourlyDetailsCardStyles.card.header.score, { color: scoreColor }]}>{hourScore?.total ?? "--"}</Text>
        </CircularGauge>
      </View>

      <View>
        <Text style={hourlyDetailsCardStyles.card.sectionTitle}>{t("hourlyForecast.details.weatherSection")}</Text>
        <View style={hourlyDetailsCardStyles.card.grid}>
          {
            weatherItems.map((item, index) => (
              <View key={index} style={hourlyDetailsCardStyles.card.grid.item}>
                <View style={hourlyDetailsCardStyles.card.grid.item.icon}>
                  <item.icon size={16} color={app_colors.white} />
                </View>
                <View>
                  <Text style={hourlyDetailsCardStyles.card.grid.item.label}>{item.label}</Text>
                  <Text style={hourlyDetailsCardStyles.card.grid.item.value}>{item.value}</Text>
                </View>
              </View>
            ))
          }
        </View>
      </View>

      <View>
        <Text style={hourlyDetailsCardStyles.card.sectionTitle}>{t("hourlyForecast.details.astroSection")}</Text>
        {
          astroPoint ? (
            <View style={hourlyDetailsCardStyles.card.grid}>
              {
                astroItems.map((item, index) => (
                  <View key={index} style={hourlyDetailsCardStyles.card.grid.item}>
                    <View style={hourlyDetailsCardStyles.card.grid.item.icon}>
                      <item.icon size={16} color={app_colors.white} />
                    </View>
                    <View>
                      <Text style={hourlyDetailsCardStyles.card.grid.item.label}>{item.label}</Text>
                      <Text style={hourlyDetailsCardStyles.card.grid.item.value}>{item.value}</Text>
                    </View>
                  </View>
                ))
              }
            </View>
          ) : (
            <Text style={hourlyDetailsCardStyles.card.noData}>{t("hourlyForecast.details.noAstroData")}</Text>
          )
        }
      </View>
    </View>
  );
};

export default HourlyDetailsCard;
