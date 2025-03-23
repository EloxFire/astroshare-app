import React from "react";
import { View, Dimensions } from "react-native";
import Svg, { Path, Line, Text as SvgText } from "react-native-svg";
import { scaleLinear } from "d3-scale";
import * as d3 from "d3-shape";

interface VisibilityGraphProps {
  visibilityGraph: {
    altitudes: number[];
    hours: string[];
  };
}

export default function VisibilityGraph({ visibilityGraph }: VisibilityGraphProps) {
  const { altitudes, hours } = visibilityGraph;

  const WIDTH = Dimensions.get("screen").width - 40; // Marge et padding
  const HEIGHT = 100;

  // Trouver les valeurs min et max pour les axes
  const minAltitude = Math.min(...altitudes, -90); // Inclure -90 pour l'axe Y
  const maxAltitude = Math.max(...altitudes, 90) + 15; // Inclure +90 et ajouter +15 pour marge

  // Générer les échelles pour les axes
  const xScale = scaleLinear()
    .domain([0, hours.length - 1]) // Indices des heures
    .range([30, WIDTH]); // Largeur du graphique

  const yScale = scaleLinear()
    .domain([minAltitude, maxAltitude]) // Altitudes min/max étendues
    .range([HEIGHT, 0]); // Inverser pour avoir 0 en bas

  // Générer le chemin de la courbe lissée
  const line = d3
    .line<number>()
    .x((_, i) => xScale(i)) // Index des heures pour l'axe X
    .y((altitude) => yScale(altitude)) // Altitudes pour l'axe Y
    .curve(d3.curveMonotoneX); // Courbe lissée

  const pathData = line(altitudes) || "";

  return (
    <View style={{ height: HEIGHT + 40, width: "100%", marginTop: 20 }}>
      <Svg height={HEIGHT + 40} width={WIDTH}>
        {/* Axe X */}
        <Line x1={30} y1={HEIGHT} x2={WIDTH} y2={HEIGHT} stroke="gray" strokeWidth={1} />
        {/* Axe Y */}
        <Line x1={30} y1={0} x2={30} y2={HEIGHT} stroke="gray" strokeWidth={1} />

        {/* Ligne en pointillés à l'heure actuelle */}
        <Line
          x1={xScale(hours.length / 2)}
          y1={0}
          x2={xScale(hours.length / 2)}
          y2={HEIGHT}
          stroke="gray"
          strokeWidth={1}
          strokeDasharray="4 4" // Pointillés
        />

        {/* Lignes des heures sur l'axe X */}
        {hours.map((hour, index) => {
          // Afficher uniquement les labels toutes les 30 minutes
          if (index % 2 === 0) {
            return (
              <SvgText
                fontFamily={'DMMonoRegular'}
                key={`hour-${index}`}
                x={xScale(index)} // Décalage pour marge
                y={HEIGHT + 15} // Sous l'axe X
                fill="gray"
                fontSize="10"
                textAnchor="middle"
              >
                {hour}
              </SvgText>
            );
          }
          return null;
        })}

        {/* Graduations et labels des altitudes sur l'axe Y */}
        {[-90, -60, -30, 0, 30, 60, 90].map((altitude, index) => (
          <React.Fragment key={`altitude-${index}`}>
            {/* Ligne de la graduation */}
            <Line
              x1={30}
              y1={yScale(altitude)}
              x2={WIDTH}
              y2={yScale(altitude)}
              stroke={altitude === 0 ? "red" : "gray"} // Ligne rouge pour 0
              strokeWidth={altitude === 0 ? 1.5 : 0.5}
              opacity={0.5}
            />
            {/* Label de la graduation */}
            <SvgText
              fontFamily={'DMMonoRegular'}
              x={0} // Décalage pour marge
              y={yScale(altitude) + 5} // Ajuster pour centrer le texte
              fill="gray"
              fontSize="10"
              textAnchor="start"
            >
              {altitude}°
            </SvgText>
          </React.Fragment>
        ))}

        {/* Courbe représentant l'altitude */}
        <Path d={pathData} fill="none" stroke="blue" strokeWidth={2} />
      </Svg>
    </View>
  );
}
