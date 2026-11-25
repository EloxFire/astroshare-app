import { useEffect, useState } from "react";
import { ActivityIndicator, Image, Text, View } from "react-native";
import { useTranslation } from "react-i18next";
import { Cloud, Droplets, Thermometer, Wind } from "lucide-react-native";
import { app_colors } from "../../../../../helpers/variables";
import { captitalizeFirstLetter, formatWindSpeed } from "../../../../../helpers/format";
import { useAppUnits } from "../../../../../hooks/useAppUnits";
import { getWeather } from "../../../../../helpers/api/weather/weather";
import { getWeatherIcon } from "../../../../../helpers/weather/getWeatherIcon";
import { azimuthToCompass } from "../../../../../helpers/eclipses/visibilityRating";
import { getCloudCoverRating } from "../../../../../helpers/eclipses/cloudCoverRating";
import { getHourlyWindow, matchWeatherToEclipse, type EclipseWeatherMatch } from "../../../../../helpers/eclipses/weatherMatch";
import { eclipseWeatherForecastStyles as styles } from "./EclipseWeatherForecast.styles";

interface EclipseWeatherForecastProps {
  latitude: number;
  longitude: number;
  // Date d'un évènement de l'éclipse (le maximum) au format renvoyé par l'API, UTC sans 'Z' — sert de
  // référence pour trouver la prévision la plus proche (voir weatherMatch.ts). Le temps ne dépend pas
  // du lieu (contrairement à la visibilité), donc le même évènement convient quel que soit `latitude`/
  // `longitude`.
  eventDateIsoNoZ: string;
}

type LoadState = { status: "loading" } | { status: "error" } | { status: "ready"; match: EclipseWeatherMatch };

const EclipseWeatherForecast = ({ latitude, longitude, eventDateIsoNoZ }: EclipseWeatherForecastProps) => {
  const { t, i18n } = useTranslation("tools/eclipses");
  const { formatDate, formatTemperatureCelsius } = useAppUnits();
  const [state, setState] = useState<LoadState>({ status: "loading" });

  useEffect(() => {
    let cancelled = false;
    setState({ status: "loading" });

    getWeather(latitude, longitude, i18n.language).then((weather) => {
      if (cancelled) return;
      if (!weather) {
        setState({ status: "error" });
        return;
      }
      setState({ status: "ready", match: matchWeatherToEclipse(weather, eventDateIsoNoZ) });
    });

    return () => { cancelled = true; };
  }, [latitude, longitude, eventDateIsoNoZ, i18n.language]);

  if (state.status === "loading") {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>{t("details.weather.title")}</Text>
        <ActivityIndicator color={app_colors.accent.main} />
      </View>
    );
  }

  if (state.status === "error") {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>{t("details.weather.title")}</Text>
        <Text style={styles.message}>{t("details.weather.error")}</Text>
      </View>
    );
  }

  const { match } = state;

  if (match.status === "unavailable") {
    if (match.reason === "past") return null;
    return (
      <View style={styles.container}>
        <Text style={styles.title}>{t("details.weather.title")}</Text>
        <Text style={styles.message}>{t("details.weather.tooFar", { count: Math.max(0, match.daysUntilAvailable) })}</Text>
      </View>
    );
  }

  const condition = match.entry.weather[0];
  const clouds = Math.round(match.entry.clouds);
  const pop = Math.round(match.entry.pop * 100);
  const temp = match.status === "hourly" ? match.entry.temp : match.entry.temp.day;
  const windDirection = azimuthToCompass(match.entry.wind_deg);
  const rating = getCloudCoverRating(clouds);
  const hourlyWindow = match.status === "hourly" ? getHourlyWindow(match.hourly, match.entry) : null;
  // "Jour J" seulement confirmé si la date calendaire (UTC) de l'entrée retenue correspond à celle de
  // l'éclipse — la mise en correspondance ("l'entrée la plus proche") peut exceptionnellement retomber
  // sur le jour suivant/précédent près de minuit UTC : mieux vaut alors ne rien afficher.
  const isDayOfEclipse = eventDateIsoNoZ.slice(0, 10) === new Date(match.entry.dt * 1000).toISOString().slice(0, 10);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t("details.weather.title")}</Text>

      <View style={styles.header}>
        <View style={styles.header.iconWrap}>
          {condition && <Image style={styles.header.iconWrap.icon} source={getWeatherIcon(condition.icon)} />}
        </View>
        <View style={styles.header.texts}>
          <View style={styles.header.texts.row}>
            <Text style={styles.header.texts.condition}>
              {condition ? captitalizeFirstLetter(condition.description) : t("details.weather.title")}
            </Text>
            <View style={[styles.badge, { backgroundColor: `${rating.color}30` }]}>
              <Text style={[styles.badge.text, { color: rating.color }]}>{t(`details.weather.rating.${rating.level}`)}</Text>
            </View>
          </View>
          {isDayOfEclipse && <Text style={styles.header.texts.dayLabel}>{t("details.weather.dayOfEclipse")}</Text>}
        </View>
      </View>

      <View style={styles.statsRow}>
        <View style={styles.statsRow.stat}>
          <View style={styles.statsRow.stat.label}>
            <Cloud size={11} color={app_colors.primary.medium} />
            <Text style={styles.statsRow.stat.label.text}>{t("details.weather.stats.clouds")}</Text>
          </View>
          <Text style={[styles.statsRow.stat.value, { color: rating.color }]}>{clouds}%</Text>
        </View>
        <View style={styles.statsRow.stat}>
          <View style={styles.statsRow.stat.label}>
            <Thermometer size={11} color={app_colors.primary.medium} />
            <Text style={styles.statsRow.stat.label.text}>{t("details.weather.stats.temperature")}</Text>
          </View>
          <Text style={styles.statsRow.stat.value}>{formatTemperatureCelsius(temp)}</Text>
        </View>
        <View style={styles.statsRow.stat}>
          <View style={styles.statsRow.stat.label}>
            <Droplets size={11} color={app_colors.primary.medium} />
            <Text style={styles.statsRow.stat.label.text}>{t("details.weather.stats.precipitation")}</Text>
          </View>
          <Text style={styles.statsRow.stat.value}>{pop}%</Text>
        </View>
        <View style={styles.statsRow.stat}>
          <View style={styles.statsRow.stat.label}>
            <Wind size={11} color={app_colors.primary.medium} />
            <Text style={styles.statsRow.stat.label.text}>{t("details.weather.stats.wind")}</Text>
          </View>
          <Text style={styles.statsRow.stat.value}>{formatWindSpeed(match.entry.wind_speed)} {windDirection}</Text>
        </View>
      </View>

      {hourlyWindow && hourlyWindow.length > 1 && (
        <View style={styles.hourly}>
          <Text style={styles.hourly.title}>{t("details.weather.hourlyTitle")}</Text>
          <View style={styles.hourly.track}>
            {hourlyWindow.map((hour) => {
              const hourCondition = hour.weather[0];
              const hourRating = getCloudCoverRating(Math.round(hour.clouds));
              const active = hour.dt === match.entry.dt;
              return (
                <View key={hour.dt} style={[styles.hourly.chip, active && styles.hourly.chip.active]}>
                  <Text style={styles.hourly.chip.time}>{formatDate(new Date(hour.dt * 1000)).format("HH:mm")}</Text>
                  {hourCondition && <Image style={styles.hourly.chip.icon} source={getWeatherIcon(hourCondition.icon)} />}
                  <Text style={styles.hourly.chip.temp}>{formatTemperatureCelsius(hour.temp)}</Text>
                  <Text style={[styles.hourly.chip.clouds, { color: hourRating.color }]}>{Math.round(hour.clouds)}%</Text>
                </View>
              );
            })}
          </View>
        </View>
      )}
    </View>
  );
};

export default EclipseWeatherForecast;
