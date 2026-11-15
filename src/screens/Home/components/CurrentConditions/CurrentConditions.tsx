import { View, Text, Image } from "react-native";
import { currentConditionsStyles } from "./CurrentConditions.styles";
import { getLunarIllumination } from "@observerly/astrometry";
import { useTranslation } from "react-i18next";
import { useWeatherData } from "../../../../context/WeatherDataContext";
import MoonPhase from "../../../../components/rendering/MoonPhase/MoonPhase";
import { getWeatherIcon } from "../../../../helpers/weather/getWeatherIcon";
import { getTemperatureDescriptionKey, getTemperatureIcon, getMoonIlluminationDescriptionKey } from "../../../../helpers/weather/conditionsDescriptions";
import { app_colors } from "../../../../helpers/variables";

export default function CurrentConditions() {
  const { t } = useTranslation();

  const { weather } = useWeatherData()

  const now = new Date();
  const moonIlluminationPercent = Math.round(getLunarIllumination(now));
  const temperatureDescriptionKey = weather ? getTemperatureDescriptionKey(weather.current.temp) : null;
  const TemperatureIcon = temperatureDescriptionKey ? getTemperatureIcon(temperatureDescriptionKey) : null;

  const blocs = [
    {
      // "home.conditions.loading" tant que la météo n'est pas encore arrivée (position GPS en
      // cours de résolution, puis appel API) — évite d'afficher une description figée qui n'a
      // jamais existé.
      title: temperatureDescriptionKey
        ? t(`home.conditions.temperature.${temperatureDescriptionKey}`)
        : t("home.conditions.loading"),
      value: weather ? `${Math.round(weather.current.temp)}°C` : "—",
      icon: TemperatureIcon ? <TemperatureIcon size={24} color={app_colors.primary.main} /> : null,
    },
    {
      title: weather ? weather.current.weather[0].description : t("home.conditions.loading"),
      value: weather ? `${weather.current.clouds}%` : "—",
      icon: weather ? <Image style={currentConditionsStyles.container.blocs.bloc.iconContainer.icon} source={getWeatherIcon(weather.current.weather[0].icon)} /> : null,
    },
    {
      title: t(`home.conditions.moonIllumination.${getMoonIlluminationDescriptionKey(moonIlluminationPercent)}`),
      // Pas de dépendance à la météo : calculée directement, comme MoonTonightCard.
      value: `${moonIlluminationPercent}%`,
      icon: <MoonPhase date={now} size={35} />
    }
  ]

  return (
    <View style={currentConditionsStyles.container}>
      <View style={currentConditionsStyles.container.blocs}>
        {blocs.map((bloc, index) => (
          <View key={index} style={[currentConditionsStyles.container.blocs.bloc, index !== blocs.length - 1 && currentConditionsStyles.container.blocs.bloc.withBorder]}>
            {bloc.icon}
            <View style={currentConditionsStyles.container.blocs.bloc.textContainer}>
              <Text style={currentConditionsStyles.container.blocs.bloc.textContainer.value}>{bloc.value}</Text>
              <Text style={currentConditionsStyles.container.blocs.bloc.textContainer.title}>{bloc.title}</Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  )
}