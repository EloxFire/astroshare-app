import React from 'react'
import { Circle, Line, Polyline, Svg, Text as SvgText } from 'react-native-svg';
import { app_colors } from '../../helpers/constants';
import { Text } from 'react-native';
import { polarClockStyles } from '../../styles/components/polarClock';

export default function SouthenPolarScope() {

  // SVG dimensions
  const svgWidth = 350;
  const svgHeight = 350;
  const centerX = svgWidth / 2;
  const centerY = svgHeight / 2;
  const radius = (svgWidth / 2) - 30;
  const strokeColor = app_colors.red_eighty;

  return (
    <>
      <Text style={polarClockStyles.south.text}>Bientôt disponible</Text>
      {/* <Svg style={{ backgroundColor: 'transparent' }} height={svgHeight} width={svgWidth}>
        <Circle cx={centerX} cy={centerY} r={radius} stroke={strokeColor} strokeWidth="1" fill="none" />
      </Svg> */}
    </>
  )
}

export const test = {
  "metadta": {
    "title": "Southen polar scope",
  }
}