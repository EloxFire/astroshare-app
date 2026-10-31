import { useMemo, useState } from "react";
import { Text, View } from "react-native";
import Svg, { Circle, Defs, Line, LinearGradient, Path, Stop, Text as SvgText } from "react-native-svg";
import { useTranslation } from "react-i18next";
import { getLunarIllumination } from "@observerly/astrometry";
import { useAppUnits } from "../../../../../hooks/useAppUnits";
import { app_colors, withOpacity } from "../../../../../helpers/variables";
import { globalStyles } from "../../../../../helpers/globalStyles";
import { monthlyIlluminationChartStyles } from "./MonthlyIlluminationChart.styles";

interface MonthlyIlluminationChartProps {
  monthStart: Date;
}

const CHART_HEIGHT = 150;
const Y_AXIS_WIDTH = 30; // gouttière pour les libellés "0% / 50% / 100%"
const X_AXIS_HEIGHT = 16;
const PLOT_PADDING_TOP = 10;
const PLOT_PADDING_RIGHT = 6;
const Y_TICKS = [0, 25, 50, 75, 100];
const X_TICK_DAY_STEPS = [1, 2, 5, 10]; // "pas" candidats entre deux jours affichés sur l'axe X
const MAX_X_TICKS = 7;
const COLOR = app_colors.accent.main;

interface Vertex {
  x: number;
  y: number;
}

// Même technique que AltitudeChart (Catmull-Rom → Bézier) mais pour une seule série continue, sans
// scission de segments (pas de notion de seuil ici) — voir AltitudeChart.tsx pour le détail de
// pourquoi c'est fait main plutôt qu'avec react-native-gifted-charts.
const buildSmoothLinePath = (vertices: Vertex[]): string => {
  if (vertices.length < 2) return "";
  let d = `M ${vertices[0].x} ${vertices[0].y}`;
  for (let i = 0; i < vertices.length - 1; i++) {
    const p0 = vertices[i - 1] ?? vertices[i];
    const p1 = vertices[i];
    const p2 = vertices[i + 1];
    const p3 = vertices[i + 2] ?? p2;
    const cp1x = p1.x + (p2.x - p0.x) / 6;
    const cp1y = p1.y + (p2.y - p0.y) / 6;
    const cp2x = p2.x - (p3.x - p1.x) / 6;
    const cp2y = p2.y - (p3.y - p1.y) / 6;
    d += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`;
  }
  return d;
};

// Pas "rond" (1, 2, 5 ou 10 jours) entre deux ticks de l'axe X, le plus fin qui tienne en
// MAX_X_TICKS graduations sur le mois affiché — même esprit que buildHourTicks d'AltitudeChart.
const buildDayTicks = (daysInMonth: number): number[] => {
  const step = X_TICK_DAY_STEPS.find((s) => daysInMonth / s <= MAX_X_TICKS) ?? X_TICK_DAY_STEPS[X_TICK_DAY_STEPS.length - 1];
  const ticks: number[] = [];
  for (let day = 1; day <= daysInMonth; day += step) ticks.push(day);
  if (ticks[ticks.length - 1] !== daysInMonth) ticks.push(daysInMonth);
  return ticks;
};

// Carte indépendante : illumination lunaire (%) jour par jour sur le mois affiché, en ligne + aire
// — le mapping (100% en haut, 0% en creux vers le bas) fait ressortir naturellement la fenêtre de
// nouvelle lune comme un creux dans la courbe, la période la plus favorable à l'observation.
const MonthlyIlluminationChart = ({ monthStart }: MonthlyIlluminationChartProps) => {
  const { t } = useTranslation("moon");
  const { formatDate } = useAppUnits();
  const [chartWidth, setChartWidth] = useState(0);

  const points = useMemo(() => {
    const daysInMonth = new Date(monthStart.getFullYear(), monthStart.getMonth() + 1, 0).getDate();
    // Midi : l'illumination varie très peu sur 24h, l'heure exacte de l'échantillon n'a pas d'importance.
    return Array.from({ length: daysInMonth }, (_, index) => {
      const date = new Date(monthStart.getFullYear(), monthStart.getMonth(), index + 1, 12);
      return { date, illumination: getLunarIllumination(date) };
    });
  }, [monthStart]);

  const data = useMemo(() => {
    if (points.length < 2 || chartWidth === 0) return null;

    const plotLeft = Y_AXIS_WIDTH;
    const plotRight = chartWidth - PLOT_PADDING_RIGHT;
    const plotTop = PLOT_PADDING_TOP;
    const plotBottom = CHART_HEIGHT - X_AXIS_HEIGHT;
    const innerWidth = plotRight - plotLeft;
    const innerHeight = plotBottom - plotTop;

    const xFor = (index: number) => plotLeft + (index / (points.length - 1)) * innerWidth;
    const yFor = (illumination: number) => plotTop + ((100 - illumination) / 100) * innerHeight;

    const vertices: Vertex[] = points.map((point, index) => ({ x: xFor(index), y: yFor(point.illumination) }));
    const linePath = buildSmoothLinePath(vertices);
    const areaPath = `${linePath} L ${vertices[vertices.length - 1].x} ${plotBottom} L ${vertices[0].x} ${plotBottom} Z`;

    let minIndex = 0;
    for (let i = 1; i < points.length; i++) {
      if (points[i].illumination < points[minIndex].illumination) minIndex = i;
    }
    const bestNightDot = { x: xFor(minIndex), y: yFor(points[minIndex].illumination) };

    return {
      plotTop,
      plotBottom,
      linePath,
      areaPath,
      bestNightDate: points[minIndex].date,
      bestNightDot,
      yTicks: Y_TICKS.map((value) => ({ value, y: yFor(value) })),
      xTicks: buildDayTicks(points.length).map((day) => ({ day, x: xFor(day - 1) })),
    };
  }, [points, chartWidth]);

  const { plotTop = 0, plotBottom = CHART_HEIGHT - X_AXIS_HEIGHT, linePath, areaPath, bestNightDate, bestNightDot, yTicks = [], xTicks = [] } =
    data ?? {};

  return (
    <View style={monthlyIlluminationChartStyles.card}>
      <Text style={[globalStyles.categoryTitle, { fontSize: 13 }]}>{t("monthlyChart.title")}</Text>
      <View style={monthlyIlluminationChartStyles.chart} onLayout={(e) => setChartWidth(e.nativeEvent.layout.width)}>
        {data && (
          <Svg width={chartWidth} height={CHART_HEIGHT}>
            <Defs>
              <LinearGradient id="illuminationFill" x1="0" y1="0" x2="0" y2="1">
                <Stop offset="0" stopColor={COLOR} stopOpacity={0.35} />
                <Stop offset="1" stopColor={COLOR} stopOpacity={0.02} />
              </LinearGradient>
            </Defs>

            {yTicks.map((tick) => (
              <Line
                key={`grid-${tick.value}`}
                x1={Y_AXIS_WIDTH}
                y1={tick.y}
                x2={chartWidth - PLOT_PADDING_RIGHT}
                y2={tick.y}
                stroke={app_colors.grey}
                strokeWidth={1}
                opacity={0.4}
              />
            ))}
            {yTicks.map((tick) => (
              <SvgText
                key={`label-${tick.value}`}
                x={Y_AXIS_WIDTH - 6}
                y={tick.y + 3}
                fontSize={8.5}
                fontFamily="DMMonoRegular"
                fill={app_colors.primary.medium}
                textAnchor="end"
              >
                {tick.value}%
              </SvgText>
            ))}

            {xTicks.map((tick) => (
              <SvgText
                key={`day-${tick.day}`}
                x={tick.x}
                y={CHART_HEIGHT - 4}
                fontSize={8.5}
                fontFamily="DMMonoRegular"
                fill={app_colors.primary.medium}
                textAnchor="middle"
              >
                {tick.day}
              </SvgText>
            ))}

            {areaPath && <Path d={areaPath} fill="url(#illuminationFill)" />}
            {linePath && <Path d={linePath} fill="none" stroke={COLOR} strokeWidth={2.5} strokeLinecap="round" />}

            {bestNightDot && (
              <>
                <Line
                  x1={bestNightDot.x}
                  y1={plotTop}
                  x2={bestNightDot.x}
                  y2={plotBottom}
                  stroke={withOpacity(COLOR, 0.4)}
                  strokeWidth={1}
                  strokeDasharray="2,4"
                />
                <Circle cx={bestNightDot.x} cy={bestNightDot.y} r={4} fill={COLOR} stroke={app_colors.white} strokeWidth={1.5} />
              </>
            )}
          </Svg>
        )}
      </View>

      {bestNightDate && (
        <View style={monthlyIlluminationChartStyles.bestWindow}>
          <Text style={monthlyIlluminationChartStyles.bestWindow.text}>{t("monthlyChart.bestWindow")}</Text>
          <Text style={monthlyIlluminationChartStyles.bestWindow.value}>{formatDate(bestNightDate).format("D MMM")}</Text>
        </View>
      )}
    </View>
  );
};

export default MonthlyIlluminationChart;
