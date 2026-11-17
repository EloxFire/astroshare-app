import { useState } from "react";
import { View, Text } from "react-native";
import Svg, { Circle, Line, Path, Text as SvgText } from "react-native-svg";
import { passArcChartStyles } from "./PassArcChart.styles";
import { app_colors, withOpacity } from "../../../helpers/variables";
import { useAppUnits } from "../../../hooks/useAppUnits";
import type { SatellitePass } from "../../../types/satellites/SatelliteTracking";

interface PassArcChartProps {
  pass: SatellitePass;
  color?: string;
}

const CHART_HEIGHT = 110;
const PADDING_X = 8;
const PADDING_TOP = 26; // place pour le libellé du pic au-dessus de la courbe
const ELEVATION_TICK_STEP = 30;

/**
 * <PassArcChart pass={nextPass} />
 *
 * Arc d'un passage : élévation en fonction du temps, du lever (gauche) au coucher (droite), avec
 * le pic d'élévation annoté. Courbe passant exactement par les 3 points connus (début/pic/fin) via
 * deux quadratiques qui se rejoignent au pic — l'API ne donne que ces 3 points, pas de courbe
 * continue, donc la forme entre eux est une approximation lissée plutôt qu'une mesure réelle.
 */
const PassArcChart = ({ pass, color = app_colors.accent.main }: PassArcChartProps) => {
  const { formatDate } = useAppUnits();
  const [width, setWidth] = useState(0);

  const domainMax = Math.max(ELEVATION_TICK_STEP, Math.ceil(pass.maxEl / ELEVATION_TICK_STEP) * ELEVATION_TICK_STEP);
  const ticks: number[] = [];
  for (let value = ELEVATION_TICK_STEP; value <= domainMax; value += ELEVATION_TICK_STEP) ticks.push(value);

  const innerWidth = width - PADDING_X * 2;
  const plotBottom = CHART_HEIGHT - 4;
  const plotTop = PADDING_TOP;
  const innerHeight = plotBottom - plotTop;

  const totalDuration = pass.endUTC - pass.startUTC;
  const peakRatio = totalDuration > 0 ? (pass.maxUTC - pass.startUTC) / totalDuration : 0.5;

  const xFor = (ratio: number) => PADDING_X + ratio * innerWidth;
  const yFor = (elevation: number) => plotBottom - (Math.max(elevation, 0) / domainMax) * innerHeight;

  const start = { x: xFor(0), y: yFor(pass.startEl) };
  const peak = { x: xFor(peakRatio), y: yFor(pass.maxEl) };
  const end = { x: xFor(1), y: yFor(pass.endEl) };

  // Deux quadratiques se rejoignant exactement au pic (point sur la courbe, pas juste un point de
  // contrôle) : garantit que la courbe passe par les 3 valeurs connues, avec un point de contrôle
  // choisi pour une montée/descente adoucie plutôt qu'un angle droit.
  const pathD = `M${start.x},${start.y} Q${start.x},${peak.y} ${peak.x},${peak.y} Q${end.x},${peak.y} ${end.x},${end.y}`;

  return (
    <View style={passArcChartStyles.container}>
      <View onLayout={(e) => setWidth(e.nativeEvent.layout.width)}>
        {width > 0 && (
          <Svg width={width} height={CHART_HEIGHT}>
            {ticks.map((tick) => (
              <Line
                key={tick}
                x1={PADDING_X}
                y1={yFor(tick)}
                x2={width - PADDING_X}
                y2={yFor(tick)}
                stroke={app_colors.grey}
                strokeWidth={1}
                strokeDasharray="2,4"
                opacity={0.6}
              />
            ))}

            <Line x1={PADDING_X} y1={plotBottom} x2={width - PADDING_X} y2={plotBottom} stroke={app_colors.grey} strokeWidth={1} />

            <Path d={pathD} fill="none" stroke={color} strokeWidth={2.5} strokeLinecap="round" />

            <Circle cx={start.x} cy={start.y} r={3.5} fill={color} stroke={app_colors.white} strokeWidth={1.5} />
            <Circle cx={end.x} cy={end.y} r={3.5} fill={color} stroke={app_colors.white} strokeWidth={1.5} />
            <Circle cx={peak.x} cy={peak.y} r={5} fill={color} stroke={app_colors.white} strokeWidth={1.5} />

            <SvgText x={peak.x} y={peak.y - 11} fontSize={11} fontFamily="ZTNatureBold" fill={app_colors.primary.main} textAnchor="middle">
              {`${Math.round(pass.maxEl)}°`}
            </SvgText>
            <SvgText x={peak.x} y={peak.y - 1} fontSize={8.5} fontFamily="DMMonoRegular" fill={withOpacity(app_colors.primary.main, 0.6)} textAnchor="middle">
              {formatDate(pass.maxUTC * 1000).format("HH:mm")}
            </SvgText>
          </Svg>
        )}
      </View>

      <View style={passArcChartStyles.endLabels}>
        <View style={passArcChartStyles.endLabels.bloc}>
          <Text style={passArcChartStyles.endLabels.bloc.compass}>{pass.startAzCompass}</Text>
          <Text style={passArcChartStyles.endLabels.bloc.time}>{formatDate(pass.startUTC * 1000).format("HH:mm")}</Text>
        </View>
        <View style={passArcChartStyles.endLabels.bloc}>
          <Text style={passArcChartStyles.endLabels.bloc.compass}>{pass.endAzCompass}</Text>
          <Text style={passArcChartStyles.endLabels.bloc.time}>{formatDate(pass.endUTC * 1000).format("HH:mm")}</Text>
        </View>
      </View>
    </View>
  );
};

export default PassArcChart;
