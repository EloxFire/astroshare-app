import { View, Text } from "react-native";
import { useMemo, useState } from "react";
import Svg, { Circle, Line, Path, Text as SvgText } from "react-native-svg";
import { Sunrise, Sunset } from "lucide-react-native";
import { useTranslation } from "react-i18next";
import { altitudeChartStyles } from "./AltitudeChart.styles";
import { useAppUnits, type FormatDate } from "../../hooks/useAppUnits";
import { app_colors, withOpacity } from "../../helpers/variables";
import type { AltitudePoint } from "../../helpers/astrometry/altitude/altitudeCurve";

interface AltitudeChartProps {
  points: AltitudePoint[];
  color?: string;
  // Lever/coucher "officiels" (ex. getBodyNextRise/getBodyNextSet), à passer quand l'écran les
  // affiche déjà ailleurs (ex. ListCard) : évite d'afficher deux heures différentes pour le même
  // évènement selon qu'elles viennent d'Observerly ou de l'interpolation interne du graphique.
  // Si absent (ou si l'évènement tombe hors de la fenêtre T-1h/T+12h tracée), le composant retombe
  // sur sa propre interpolation à partir de `points`.
  riseDate?: Date;
  setDate?: Date;
}

const CHART_HEIGHT = 150;
const Y_AXIS_WIDTH = 26; // gouttière réservée à gauche pour les libellés d'altitude
const X_AXIS_HEIGHT = 16; // gouttière réservée en bas pour les libellés d'heure
const PLOT_PADDING_TOP = 8;
const PLOT_PADDING_RIGHT = 6;
const PLOT_PADDING_BOTTOM = 4; // espace entre le bas de la courbe et la rangée d'heures
// Domaine vertical fixe : l'altitude est bornée physiquement à [-90°, 90°] (zénith/nadir), et le
// 0 (horizon) reste toujours strictement centré verticalement — plutôt qu'un domaine qui s'adapte
// au pic de la nuit, ce qui aplatissait la courbe de comparaison entre nuits/objets différents.
const ALTITUDE_DOMAIN_MAX = 90;
const ALTITUDE_DOMAIN_MIN = -90;
const Y_TICK_STEPS = [10, 15, 20, 30, 45, 60]; // "pas" candidats, du plus fin au plus large
const X_TICK_HOUR_STEPS = [1, 2, 3, 4, 6, 12]; // idem pour l'axe des heures
const MAX_Y_TICKS = 4; // par côté de l'horizon (donc ~8 graduations au total avec le domaine symétrique)
const MAX_X_TICKS = 8; // plus fin que l'axe Y : chaque tick porte aussi sa ligne verticale repère

interface Vertex {
  x: number;
  y: number;
  altitude: number;
}

// Rendu entièrement fait main en SVG plutôt que via react-native-gifted-charts : la lib calcule mal
// le domaine vertical dès qu'il y a des valeurs négatives (ligne d'horizon mal placée, bosse
// positive qui sort du cadre). Ici chaque pixel est calculé par nous, donc prévisible et simple à
// corriger — au prix de redessiner nous-mêmes la courbe lissée (Catmull-Rom → Bézier, algorithme
// standard) plutôt que de la déléguer à la lib.
const buildSmoothPath = (vertices: Vertex[]): { below: boolean; d: string }[] => {
  const runs: { below: boolean; d: string }[] = [];
  for (let i = 0; i < vertices.length - 1; i++) {
    const p0 = vertices[i - 1] ?? vertices[i];
    const p1 = vertices[i];
    const p2 = vertices[i + 1];
    const p3 = vertices[i + 2] ?? p2;
    const cp1x = p1.x + (p2.x - p0.x) / 6;
    const cp1y = p1.y + (p2.y - p0.y) / 6;
    const cp2x = p2.x - (p3.x - p1.x) / 6;
    const cp2y = p2.y - (p3.y - p1.y) / 6;

    const below = p1.altitude < 0 || p2.altitude < 0;
    const segment = `C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`;
    const last = runs[runs.length - 1];
    if (last && last.below === below) {
      last.d += ` ${segment}`;
    } else {
      runs.push({ below, d: `M ${p1.x} ${p1.y} ${segment}` });
    }
  }
  return runs;
};

// Ticks d'altitude "ronds" (0°, ±20°, ±40°...) de part et d'autre de l'horizon : le premier pas de
// Y_TICK_STEPS qui tient en MAX_Y_TICKS graduations ou moins entre 0° et un bord du domaine.
const buildAltitudeTicks = (maxValue: number, minValue: number): number[] => {
  const span = Math.max(maxValue, -minValue);
  const step = Y_TICK_STEPS.find((s) => span / s <= MAX_Y_TICKS) ?? Y_TICK_STEPS[Y_TICK_STEPS.length - 1];
  const ticks: number[] = [];
  for (let value = 0; value <= maxValue; value += step) ticks.push(value);
  for (let value = -step; value >= minValue; value -= step) ticks.push(value);
  return ticks;
};

// Ticks d'heure "ronds" (18:00, 21:00...), alignés sur le fuseau d'affichage de l'utilisateur
// (formatDate) plutôt que sur le fuseau de l'appareil — sinon ils seraient incohérents avec les
// heures de lever/culmination/coucher affichées juste en dessous.
const buildHourTicks = (start: Date, end: Date, formatDate: FormatDate): Date[] => {
  const totalHours = (end.getTime() - start.getTime()) / 3_600_000;
  const step = X_TICK_HOUR_STEPS.find((s) => totalHours / s <= MAX_X_TICKS) ?? X_TICK_HOUR_STEPS[X_TICK_HOUR_STEPS.length - 1];

  let cursor = formatDate(start).startOf("hour");
  if (cursor.toDate().getTime() < start.getTime()) cursor = cursor.add(1, "hour");
  while (cursor.hour() % step !== 0) cursor = cursor.add(1, "hour");

  const ticks: Date[] = [];
  while (cursor.toDate().getTime() <= end.getTime()) {
    ticks.push(cursor.toDate());
    cursor = cursor.add(step, "hour");
  }
  return ticks;
};

const AltitudeChart = ({ points, color = app_colors.accent.main, riseDate: riseDateProp, setDate: setDateProp }: AltitudeChartProps) => {
  const { t } = useTranslation("common");
  const { formatDate } = useAppUnits();
  const [chartWidth, setChartWidth] = useState(0);

  const data = useMemo(() => {
    if (points.length < 2 || chartWidth === 0) return null;

    const plotLeft = Y_AXIS_WIDTH;
    const plotRight = chartWidth - PLOT_PADDING_RIGHT;
    const plotTop = PLOT_PADDING_TOP;
    const plotBottom = CHART_HEIGHT - X_AXIS_HEIGHT - PLOT_PADDING_BOTTOM;
    const innerWidth = plotRight - plotLeft;
    const innerHeight = plotBottom - plotTop;

    const windowStart = points[0].date.getTime();
    const windowEnd = points[points.length - 1].date.getTime();

    let culminationIndex = 0;
    for (let i = 1; i < points.length; i++) {
      if (points[i].altitude > points[culminationIndex].altitude) culminationIndex = i;
    }
    const culminationAltitude = points[culminationIndex].altitude;

    const maxValue = ALTITUDE_DOMAIN_MAX;
    const minValue = ALTITUDE_DOMAIN_MIN;

    const xFor = (index: number) => plotLeft + (index / (points.length - 1)) * innerWidth;
    const xForTime = (time: number) => plotLeft + ((time - windowStart) / (windowEnd - windowStart)) * innerWidth;
    const yFor = (altitude: number) => {
      const clamped = Math.min(Math.max(altitude, minValue), maxValue);
      return plotTop + ((maxValue - clamped) / (maxValue - minValue)) * innerHeight;
    };

    // Un seul lever et un seul coucher sont attendus sur la fenêtre de getAltitudeCurve (13h), mais
    // la recherche reste générique plutôt que de supposer un unique changement de signe. Ces dates
    // "dérivées" (et leur position pixel) ne servent qu'à ancrer un point sur la courbe tracée :
    // elles tombent forcément dans la fenêtre, contrairement à riseDate/setDate reçus en props qui
    // peuvent correspondre à un évènement hors fenêtre (ex. coucher le lendemain matin).
    const vertices: Vertex[] = [];
    let derivedRiseDate: Date | undefined;
    let derivedSetDate: Date | undefined;
    let riseDot: { x: number; y: number } | undefined;
    let setDot: { x: number; y: number } | undefined;

    points.forEach((point, index) => {
      vertices.push({ x: xFor(index), y: yFor(point.altitude), altitude: point.altitude });

      const next = points[index + 1];
      if (!next) return;
      const rising = point.altitude < 0 && next.altitude >= 0;
      const setting = point.altitude >= 0 && next.altitude < 0;
      if (!rising && !setting) return;

      const ratio = -point.altitude / (next.altitude - point.altitude);
      const crossingDate = new Date(point.date.getTime() + ratio * (next.date.getTime() - point.date.getTime()));
      const crossingX = xFor(index) + ratio * (xFor(index + 1) - xFor(index));
      const crossingDot = { x: crossingX, y: yFor(0) };
      vertices.push({ x: crossingX, y: yFor(0), altitude: 0 });

      if (rising && !derivedRiseDate) {
        derivedRiseDate = crossingDate;
        riseDot = crossingDot;
      } else if (setting) {
        derivedSetDate = crossingDate;
        setDot = crossingDot;
      }
    });

    const now = Date.now();
    const nowX = now >= windowStart && now <= windowEnd ? xForTime(now) : undefined;

    return {
      plotTop,
      plotBottom,
      pathRuns: buildSmoothPath(vertices),
      horizonY: yFor(0),
      culminationDot: { x: xFor(culminationIndex), y: yFor(culminationAltitude) },
      culminationAltitude,
      culminationDate: points[culminationIndex].date,
      riseDot,
      setDot,
      // Les labels affichent l'heure "officielle" reçue en props quand elle existe (cohérence avec
      // le reste de l'écran), et ne retombent sur l'interpolation interne que si elle est absente.
      riseDate: riseDateProp ?? derivedRiseDate,
      setDate: setDateProp ?? derivedSetDate,
      nowX,
      altitudeTicks: buildAltitudeTicks(maxValue, minValue).map((value) => ({ value, y: yFor(value) })),
      hourTicks: buildHourTicks(points[0].date, points[points.length - 1].date, formatDate).map((date) => ({
        date,
        x: xForTime(date.getTime()),
      })),
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- formatDate n'est pas mémoïsé par useAppUnits (nouvelle closure à chaque render) ; l'inclure invaliderait ce memo à chaque rendu pour un recalcul par ailleurs négligeable (53 points).
  }, [points, chartWidth, riseDateProp, setDateProp]);

  const {
    plotTop = 0,
    plotBottom = CHART_HEIGHT - X_AXIS_HEIGHT,
    pathRuns = [],
    horizonY = 0,
    culminationDot,
    culminationAltitude = 0,
    culminationDate,
    riseDot,
    setDot,
    riseDate,
    setDate,
    nowX,
    altitudeTicks = [],
    hourTicks = [],
  } = data ?? {};

  return (
    <View style={altitudeChartStyles.container}>
      <View style={altitudeChartStyles.chart} onLayout={(e) => setChartWidth(e.nativeEvent.layout.width)}>
        {data && (
          <Svg width={chartWidth} height={CHART_HEIGHT}>
            {altitudeTicks.map((tick) => (
              <SvgText
                key={tick.value}
                x={Y_AXIS_WIDTH - 6}
                y={tick.y + 3}
                fontSize={8.5}
                fontFamily="DMMonoRegular"
                fill={app_colors.primary.medium}
                textAnchor="end"
              >
                {tick.value}°
              </SvgText>
            ))}

            {hourTicks.map((tick) => (
              <Line
                key={`grid-${tick.date.getTime()}`}
                x1={tick.x}
                y1={plotTop}
                x2={tick.x}
                y2={plotBottom}
                stroke={app_colors.grey}
                strokeWidth={1}
                opacity={0.5}
              />
            ))}

            {hourTicks.map((tick) => (
              <SvgText
                key={tick.date.getTime()}
                x={tick.x}
                y={CHART_HEIGHT - 4}
                fontSize={8.5}
                fontFamily="DMMonoRegular"
                fill={app_colors.primary.medium}
                textAnchor="middle"
              >
                {formatDate(tick.date).format("HH:mm")}
              </SvgText>
            ))}

            {nowX !== undefined && (
              <Line x1={nowX} y1={plotTop} x2={nowX} y2={plotBottom} stroke={withOpacity(app_colors.primary.main, 0.3)} strokeWidth={1} />
            )}

            <Line
              x1={Y_AXIS_WIDTH}
              y1={horizonY}
              x2={chartWidth - PLOT_PADDING_RIGHT}
              y2={horizonY}
              stroke={app_colors.grey}
              strokeWidth={1}
              strokeDasharray="2,4"
            />
            {pathRuns.map((run, index) => (
              <Path
                key={index}
                d={run.d}
                fill="none"
                stroke={run.below ? withOpacity(color, 0.45) : color}
                strokeWidth={run.below ? 2 : 2.5}
                strokeDasharray={run.below ? "5,5" : undefined}
                strokeLinecap="round"
              />
            ))}
            {riseDot && <Circle cx={riseDot.x} cy={riseDot.y} r={4} fill={color} stroke={app_colors.white} strokeWidth={1.5} />}
            {setDot && <Circle cx={setDot.x} cy={setDot.y} r={4} fill={color} stroke={app_colors.white} strokeWidth={1.5} />}
            {culminationDot && (
              <Circle cx={culminationDot.x} cy={culminationDot.y} r={5} fill={color} stroke={app_colors.white} strokeWidth={1.5} />
            )}
          </Svg>
        )}
      </View>

      <View style={altitudeChartStyles.legend}>
        <View style={altitudeChartStyles.legend.item}>
          <View style={[altitudeChartStyles.legend.item.swatch, { backgroundColor: color }]} />
          <Text style={altitudeChartStyles.legend.item.label}>{t("altitudeChart.visible")}</Text>
        </View>
        <View style={altitudeChartStyles.legend.item}>
          <View
            style={[
              altitudeChartStyles.legend.item.swatch,
              altitudeChartStyles.legend.item.swatchDashed,
              { borderColor: withOpacity(color, 0.45) },
            ]}
          />
          <Text style={altitudeChartStyles.legend.item.label}>{t("altitudeChart.belowHorizon")}</Text>
        </View>
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
            {culminationDate ? formatDate(culminationDate).format("HH:mm") : "--:--"}
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
