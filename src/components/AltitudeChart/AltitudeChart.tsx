import { View, Text } from "react-native";
import { useMemo, useState } from "react";
import { LineChart, type LineSegment } from "react-native-gifted-charts";
import { Sunrise, Sunset } from "lucide-react-native";
import { useTranslation } from "react-i18next";
import { altitudeChartStyles } from "./AltitudeChart.styles";
import { useAppUnits } from "../../hooks/useAppUnits";
import { app_colors, withOpacity } from "../../helpers/variables";
import type { AltitudePoint } from "../../helpers/astrometry/altitude/altitudeCurve";

interface AltitudeChartProps {
  points: AltitudePoint[];
  color?: string;
}

const CHART_HEIGHT = 120;
// Purement visuel : au-delà de ce plancher, la portion sous l'horizon est tronquée pour l'affichage
// (la fenêtre T-1h/T+12h de getAltitudeCurve peut plonger très bas en bord de courbe, ce qui écraserait
// la bosse au lieu de la mettre en valeur comme sur la maquette). La donnée réelle (points) n'est pas modifiée.
const ALTITUDE_FLOOR = -18;

// Instant (interpolé linéairement) où la droite reliant deux échantillons consécutifs croise alt = 0.
const interpolateCrossingDate = (prev: AltitudePoint, curr: AltitudePoint): Date => {
  const ratio = -prev.altitude / (curr.altitude - prev.altitude);
  return new Date(prev.date.getTime() + ratio * (curr.date.getTime() - prev.date.getTime()));
};

const nearestIndex = (points: AltitudePoint[], date: Date): number => {
  let closest = 0;
  let smallestDiff = Infinity;
  points.forEach((point, index) => {
    const diff = Math.abs(point.date.getTime() - date.getTime());
    if (diff < smallestDiff) {
      smallestDiff = diff;
      closest = index;
    }
  });
  return closest;
};

const AltitudeChart = ({ points, color = app_colors.accent.main }: AltitudeChartProps) => {
  const { t } = useTranslation("common");
  const { formatDate } = useAppUnits();
  const [chartWidth, setChartWidth] = useState(0);

  const data = useMemo(() => {
    if (points.length < 2) return null;

    const chartData = points.map((point) => ({ value: Math.max(point.altitude, ALTITUDE_FLOOR) }));

    let culminationIndex = 0;
    for (let i = 1; i < points.length; i++) {
      if (points[i].altitude > points[culminationIndex].altitude) culminationIndex = i;
    }

    // Un seul lever et un seul coucher sont attendus sur la fenêtre de getAltitudeCurve (13h), mais
    // la recherche reste générique plutôt que de supposer un unique changement de signe.
    let riseDate: Date | undefined;
    let setDate: Date | undefined;
    for (let i = 1; i < points.length; i++) {
      const prev = points[i - 1];
      const curr = points[i];
      if (prev.altitude < 0 && curr.altitude >= 0 && !riseDate) {
        riseDate = interpolateCrossingDate(prev, curr);
      } else if (prev.altitude >= 0 && curr.altitude < 0) {
        setDate = interpolateCrossingDate(prev, curr);
      }
    }

    // Segment plein tant que les deux échantillons qui l'encadrent sont au-dessus de l'horizon,
    // pointillé dès que l'un des deux est en dessous — fusionné par plages contiguës.
    const lineSegments: (LineSegment & { below: boolean })[] = [];
    for (let i = 1; i < points.length; i++) {
      const below = points[i - 1].altitude < 0 || points[i].altitude < 0;
      const last = lineSegments[lineSegments.length - 1];
      if (last && last.below === below) {
        last.endIndex = i;
      } else {
        lineSegments.push({
          startIndex: i - 1,
          endIndex: i,
          below,
          color: below ? withOpacity(color, 0.45) : color,
          ...(below ? { strokeDashArray: [5, 5] } : {}),
        });
      }
    }

    const dotIndices = new Set<number>([culminationIndex]);
    if (riseDate) dotIndices.add(nearestIndex(points, riseDate));
    if (setDate) dotIndices.add(nearestIndex(points, setDate));

    return {
      chartData,
      lineSegments,
      dotIndices,
      culminationIndex,
      culminationAltitude: points[culminationIndex].altitude,
      culminationDate: points[culminationIndex].date,
      riseDate,
      setDate,
    };
  }, [points, color]);

  if (!data) return null;

  const { chartData, lineSegments, dotIndices, culminationIndex, culminationAltitude, culminationDate, riseDate, setDate } = data;

  const renderDot = (_item: unknown, index: number) => {
    if (!dotIndices.has(index)) return null;
    return (
      <View
        style={[
          altitudeChartStyles.dot,
          index === culminationIndex && altitudeChartStyles.dotCulmination,
          { backgroundColor: color },
        ]}
      />
    );
  };

  return (
    <View style={altitudeChartStyles.container}>
      <View style={altitudeChartStyles.chart} onLayout={(e) => setChartWidth(e.nativeEvent.layout.width)}>
        {chartWidth > 0 && (
          <LineChart
            data={chartData}
            width={chartWidth}
            height={CHART_HEIGHT}
            curved
            thickness={2.5}
            color={color}
            hideAxesAndRules
            hideYAxisText
            yAxisThickness={0}
            xAxisThickness={0}
            initialSpacing={2}
            endSpacing={2}
            disableScroll
            dataPointsWidth={10}
            dataPointsHeight={10}
            customDataPoint={renderDot}
            lineSegments={lineSegments}
            showReferenceLine1
            referenceLine1Position={0}
            referenceLine1Config={{ color: app_colors.grey, thickness: 1 }}
          />
        )}
      </View>

      <View style={altitudeChartStyles.labelsRow}>
        <View style={altitudeChartStyles.labelsRow.edgeBloc}>
          <Sunrise style={altitudeChartStyles.labelsRow.edgeBloc.icon} />
          <Text style={altitudeChartStyles.labelsRow.edgeBloc.time}>
            {riseDate ? formatDate(riseDate).format("HH:mm") : "--:--"}
          </Text>
          <Text style={altitudeChartStyles.labelsRow.edgeBloc.caption}>{t("altitudeChart.rise")}</Text>
        </View>

        <View style={altitudeChartStyles.labelsRow.centerBloc}>
          <Text style={altitudeChartStyles.labelsRow.centerBloc.time}>
            {formatDate(culminationDate).format("HH:mm")}
          </Text>
          <Text style={altitudeChartStyles.labelsRow.centerBloc.caption}>
            {t("altitudeChart.culmination", { altitude: culminationAltitude.toFixed(1) })}
          </Text>
        </View>

        <View style={altitudeChartStyles.labelsRow.edgeBloc}>
          <Sunset style={altitudeChartStyles.labelsRow.edgeBloc.icon} />
          <Text style={altitudeChartStyles.labelsRow.edgeBloc.time}>
            {setDate ? formatDate(setDate).format("HH:mm") : "--:--"}
          </Text>
          <Text style={altitudeChartStyles.labelsRow.edgeBloc.caption}>{t("altitudeChart.set")}</Text>
        </View>
      </View>
    </View>
  );
};

export default AltitudeChart;
