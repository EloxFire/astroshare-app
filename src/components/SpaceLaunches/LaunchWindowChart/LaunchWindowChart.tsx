import { Text, View } from "react-native";
import { useTranslation } from "react-i18next";
import { Rocket } from "lucide-react-native";
import { app_colors } from "../../../helpers/variables";
import { useAppUnits } from "../../../hooks/useAppUnits";
import Badge from "../../Badges/Badge/Badge";
import { launchWindowChartStyles } from "./LaunchWindowChart.styles";

const TICK_COUNT = 5;

interface LaunchWindowChartProps {
  net: string;
  windowStart?: string | null;
  windowEnd?: string | null;
  precisionName?: string | null;
}

// Frise graphique de la fenêtre de tir : axe temporel, fenêtre ouverte→fermeture en surbrillance
// (si fournie par l'API) avec sa durée, repères de décollage (T-0) et de fermeture. Repose
// uniquement sur net/window_start/window_end — pas de fuseau du site de lancement (non confirmé
// côté API), tout est affiché dans le fuseau choisi par l'utilisateur (useAppUnits).
const LaunchWindowChart = ({ net, windowStart, windowEnd, precisionName }: LaunchWindowChartProps) => {
  const { t } = useTranslation("tools/spaceLaunches");
  const { formatDate } = useAppUnits();

  const netDate = new Date(net);
  const windowEndDate = windowEnd ? new Date(windowEnd) : null;
  const hasWindow = !!windowStart && !!windowEndDate && windowEndDate.getTime() > netDate.getTime();

  // Marge de chaque côté de l'axe : juste un repère visuel pour aérer le tracé, pas une mesure.
  const paddingMs = hasWindow && windowEndDate
    ? Math.max(windowEndDate.getTime() - netDate.getTime(), 10 * 60 * 1000)
    : 30 * 60 * 1000;
  const axisStart = netDate.getTime() - paddingMs;
  const axisEnd = (hasWindow && windowEndDate ? windowEndDate.getTime() : netDate.getTime()) + paddingMs;
  const axisSpan = axisEnd - axisStart;

  const toPercent = (time: number) => Math.min(Math.max(((time - axisStart) / axisSpan) * 100, 0), 100);
  const netPercent = toPercent(netDate.getTime());
  const windowEndPercent = hasWindow && windowEndDate ? toPercent(windowEndDate.getTime()) : null;

  const ticks = Array.from({ length: TICK_COUNT }, (_, index) => new Date(axisStart + (axisSpan * index) / (TICK_COUNT - 1)));

  const durationMinutes = hasWindow && windowEndDate ? Math.round((windowEndDate.getTime() - netDate.getTime()) / 60000) : 0;
  const durationLabel = durationMinutes >= 60
    ? t("details.launchWindow.durationLong", { hours: Math.floor(durationMinutes / 60), minutes: durationMinutes % 60 })
    : t("details.launchWindow.durationShort", { minutes: durationMinutes });


  // TODO : Si la fenetre n'est pas présice a la seconde, afficher un avertissement indiquant que la date et la fenetre sont approximatives et estimées seulement

  return (
    <View style={launchWindowChartStyles.card}>
      <View style={launchWindowChartStyles.card.header}>
        <View style={launchWindowChartStyles.card.header.badge}>
          <Rocket size={12} color={app_colors.white} />
          <Text style={launchWindowChartStyles.card.header.badge.text}>
            {t("details.launchWindow.liftoffBadge", { time: formatDate(netDate).format("HH:mm") })}
          </Text>
        </View>

        {hasWindow && windowEndDate && (
          <View style={[launchWindowChartStyles.card.header.badge, launchWindowChartStyles.card.header.badge.close]}>
            <Text style={launchWindowChartStyles.card.header.badge.text}>
              {t("details.launchWindow.closesBadge", { time: formatDate(windowEndDate).format("HH:mm") })}
            </Text>
          </View>
        )}

        {precisionName && (
          <Badge
            text={t(`details.precision.${precisionName}`, { defaultValue: precisionName })}
            backgroundColor={app_colors.accent.light}
            foregroundColor={app_colors.primary.main}
          />
        )}
      </View>

      <View style={launchWindowChartStyles.card.track}>
        <View style={launchWindowChartStyles.card.track.axis} />

        {hasWindow && windowEndPercent != null && (
          <View
            style={[
              launchWindowChartStyles.card.track.band,
              { left: `${netPercent}%`, width: `${windowEndPercent - netPercent}%` },
            ]}
          >
            <Text style={launchWindowChartStyles.card.track.band.text} numberOfLines={1}>{durationLabel}</Text>
          </View>
        )}

        <View style={[launchWindowChartStyles.card.track.marker, { left: `${netPercent}%` }]} />

        {hasWindow && windowEndPercent != null && (
          <View
            style={[
              launchWindowChartStyles.card.track.marker,
              launchWindowChartStyles.card.track.marker.dashed,
              { left: `${windowEndPercent}%` },
            ]}
          />
        )}
      </View>

      <View style={launchWindowChartStyles.card.ticks}>
        {ticks.map((tick, index) => (
          <Text key={index} style={launchWindowChartStyles.card.ticks.text}>
            {formatDate(tick).format("HH:mm")}
          </Text>
        ))}
      </View>

      <Text style={launchWindowChartStyles.card.note}>
        {hasWindow && windowEndDate
          ? t("details.launchWindow.note", { closeTime: formatDate(windowEndDate).format("HH:mm") })
          : t("details.launchWindow.noWindowNote")}
      </Text>
    </View>
  );
}

export default LaunchWindowChart;
