import React from "react";
import { View, Dimensions, StyleSheet } from "react-native";
import Svg, { Path, Line, Text as SvgText, Circle } from "react-native-svg";
import { scaleLinear } from "d3-scale";
import * as d3 from "d3-shape";
import { app_colors } from "../../helpers/constants";
import {formatKelvinShort} from "../../helpers/scripts/utils/formatters/formaters";
import {useTranslation} from "../../hooks/useTranslation";

interface LineGraphProps {
  data: { time_tag: string; density: number; speed: number; temperature: number }[];
  field: "density" | "speed" | "temperature"; // Champ à afficher
  lineColor?: string; // Couleur de la ligne
  leftMargin?: number;
  yMin?: number; // Valeur minimale personnalisée pour l'axe Y
  yMax?: number; // Valeur maximale personnalisée pour l'axe Y
  shortNumbers?: boolean; // Afficher les nombres en format court
}

const LineGraph: React.FC<LineGraphProps> = ({ data, field, lineColor, leftMargin, yMin, yMax, shortNumbers }) => {

  const {currentLCID} = useTranslation()

  const SCREEN_WIDTH = Dimensions.get("screen").width;
  const WIDTH = SCREEN_WIDTH - 20; // Largeur du graphique
  const HEIGHT = 150; // Hauteur du graphique
  const LEFT_MARGIN = leftMargin || 40; // Marge gauche pour les labels Y
  const RIGHT_MARGIN = 20; // Réduire la marge à droite
  const TOP_MARGIN = 10; // Réduire la marge en haut
  const BOTTOM_MARGIN = 20; // Marge pour les labels X

  // Extraire les valeurs du champ
  const values = data.map((item) => item[field]);

  // Calculer les valeurs minimale et maximale automatiques
  const computedYMin = yMin !== undefined ? yMin : Math.min(...values);
  const computedYMax = yMax !== undefined ? yMax : Math.max(...values);

  // Trouver les indices des valeurs maximales et minimales
  const maxValue = Math.max(...values);
  const minValue = Math.min(...values);
  const maxIndex = values.indexOf(maxValue);
  const minIndex = values.indexOf(minValue);

  // Configurer les échelles pour les axes
  const xScale = scaleLinear()
    .domain([0, data.length - 1]) // Indices des données
    .range([LEFT_MARGIN, WIDTH - RIGHT_MARGIN]); // Espace horizontal

  const yScale = scaleLinear()
    .domain([computedYMin, computedYMax]) // Plage strictement définie entre yMin et yMax
    .range([HEIGHT - BOTTOM_MARGIN, TOP_MARGIN]); // Inverser pour avoir 0 en bas

  // Générer le chemin de la ligne
  const lineGenerator = d3
    .line<number>()
    .x((_, index) => xScale(index))
    .y((value) => yScale(value))
    .curve(d3.curveMonotoneX); // Courbe lissée

  const pathData = lineGenerator(values) || "";

  // Filtrer les heures pour afficher uniquement celles correspondant aux 30 minutes
  const filteredTimestamps = data.filter((item) => {
    const minutes = new Date(item.time_tag).getMinutes();
    return minutes === 0 || minutes === 30; // Heures pile ou demi-heures
  });

  return (
    <View style={styles.container}>
      <Svg width={WIDTH} height={HEIGHT}>
        {/* Axe X */}
        <Line
          x1={LEFT_MARGIN}
          y1={HEIGHT - BOTTOM_MARGIN}
          x2={WIDTH - RIGHT_MARGIN}
          y2={HEIGHT - BOTTOM_MARGIN}
          stroke={app_colors.white}
          strokeWidth={1}
        />
        {/* Axe Y */}
        <Line
          x1={LEFT_MARGIN}
          y1={TOP_MARGIN}
          x2={LEFT_MARGIN}
          y2={HEIGHT - BOTTOM_MARGIN}
          stroke={app_colors.white}
          strokeWidth={1}
        />

        {/* Lignes horizontales et graduations des axes Y */}
        {yScale.ticks(5).map((yValue, index) => {
          const y = yScale(yValue);
          return (
            <React.Fragment key={`y-label-${index}`}>
              {/* Ligne horizontale */}
              <Line
                x1={LEFT_MARGIN}
                y1={y}
                x2={WIDTH - RIGHT_MARGIN}
                y2={y}
                stroke={app_colors.white_forty}
                strokeWidth={0.5}
              />
              {/* Label de l'axe Y */}
              <SvgText x={LEFT_MARGIN - 10} y={y + 3} fontSize={10} fill={app_colors.white} textAnchor="end">
                {shortNumbers ? formatKelvinShort(yValue, currentLCID).slice(0, -3) : yValue}
              </SvgText>
            </React.Fragment>
          );
        })}

        {/* Labels des heures sur l'axe X */}
        {filteredTimestamps.map((item, index) => {
          const originalIndex = data.findIndex((d) => d.time_tag === item.time_tag);
          const x = xScale(originalIndex);
          const label = item.time_tag.split(" ")[1].slice(0, 5); // Afficher hh:mm
          return (
            <SvgText key={`x-label-${index}`} x={x} y={HEIGHT - 5} fontSize={10} fill={app_colors.white} textAnchor="middle">
              {label}
            </SvgText>
          );
        })}

        {/* Ligne représentant les données */}
        <Path d={pathData} fill="none" stroke={lineColor || app_colors.green_eighty} strokeWidth={2} />

        {/* Point et label pour la valeur maximale */}
        {maxIndex !== -1 && maxValue >= computedYMin && maxValue <= computedYMax && (
          <>
            <Circle cx={xScale(maxIndex)} cy={yScale(maxValue)} r={4} fill={lineColor || app_colors.red} />
            <SvgText x={xScale(maxIndex)} y={yScale(maxValue) - 8} fontSize={10} fill={app_colors.white} textAnchor="middle">
              {maxValue}
            </SvgText>
          </>
        )}

        {/* Point et label pour la valeur minimale */}
        {minIndex !== -1 && minValue >= computedYMin && minValue <= computedYMax && (
          <>
            <Circle cx={xScale(minIndex)} cy={yScale(minValue)} r={4} fill={lineColor || app_colors.blue} />
            <SvgText x={xScale(minIndex)} y={yScale(minValue) + 15} fontSize={10} fill={app_colors.white} textAnchor="middle">
              {minValue}
            </SvgText>
          </>
        )}
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
    alignItems: "center" as "center",
    backgroundColor: app_colors.white_no_opacity,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: app_colors.white_twenty,
  },
});

export default LineGraph;
