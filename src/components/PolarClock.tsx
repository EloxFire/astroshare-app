import React from 'react'
import { Dimensions, Image, StyleSheet, Text, View } from 'react-native'
import { Circle, Line, Svg, Text as SvgText } from 'react-native-svg';
import { convertHMSToDegreeFromString } from '../helpers/scripts/astro/HmsToDegree';
import { getHourAngle, getLocalSiderealTime } from '@observerly/astrometry';
import { useSettings } from '../contexts/AppSettingsContext';
import { polarClockStyles } from '../styles/components/polarClock';
import { app_colors } from '../helpers/constants';
import { scopeAlignmentStyles } from '../styles/screens/scopeAlignment';
import dayjs from 'dayjs';

export default function PolarClock() {

  const {currentUserLocation} = useSettings()

  const polaris = {
    ra: "03:01:03.6",
    dec: "+89:21:50.4",
    degRa: 45.265,
    degDec: 89.364,
  }

  // console.log(convertHMSToDegreeFromString(polaris.ra));
    
  const LST = getLocalSiderealTime(new Date(), currentUserLocation.lon)
  // const HA = LST - 2.9667 // 2.9667 = 3h 01m 03.6s
  const HA = getHourAngle(new Date(), currentUserLocation.lon, polaris.degRa)

  console.log(HA);
  

  const { width } = Dimensions.get('screen');
  const centerX = width / 2;
  const centerY = width / 2;
  const outerRadius = width / 2 - 50; // Radius of the outer circle
  const longLineLength = 45; // Length of the separating lines
  const shortLineLength = 25; // Length of the lines within each tier
  const pointRadius = 5; // Radius of the point circle

  const calculateLinePoints = (angle: number, radius: number, length: number) => {
    const halfLength = length / 2;
    const startX = centerX + (radius - halfLength) * Math.cos(angle * Math.PI / 180);
    const startY = centerY + (radius - halfLength) * Math.sin(angle * Math.PI / 180);
    const endX = centerX + (radius + halfLength) * Math.cos(angle * Math.PI / 180);
    const endY = centerY + (radius + halfLength) * Math.sin(angle * Math.PI / 180);
    return { startX, startY, endX, endY };
  };

  const calculatePointPosition = (hours: number, minutes: number, radius: number) => {
    const anglePerHour = 360 / 24; // 360 degrees / 24 hours
    const anglePerMinute = anglePerHour / 60; // Degrees per minute
    const totalAngle = (hours % 24) * anglePerHour + minutes * anglePerMinute;
    const angleInRadians = (totalAngle + 90) * Math.PI / 180; // Adding 90 degrees to adjust for SVG coordinate system
    const x = centerX + radius * Math.cos(angleInRadians);
    const y = centerY + radius * Math.sin(angleInRadians);
    return { x, y };
  };


  const { x, y } = calculatePointPosition(parseInt(HA.toString().split('.')[0]), parseInt(HA.toString().split('.')[1][0]), outerRadius - 5);

  // Prompt GPT
  // Voici une précision pour le calcul de la position du point. Le quadrant que nous avons déssiné plus haut exprime sur 360° des heures au format decimal, peut tu ajuster le calcul de la position du point ?

  return (
    <View>
      <Text style={scopeAlignmentStyles.content.infoText}>Longitude : {currentUserLocation.lon}</Text>
      <Text style={scopeAlignmentStyles.content.infoText}>LST : {LST}</Text>
      <Text style={scopeAlignmentStyles.content.infoText}>Heure locale : {dayjs().format('HH:mm').replace(':', 'h')}</Text>
      <View style={polarClockStyles.container}>
        <Svg width={width} height={width}>
          <Circle cx={centerX} cy={centerY} r={outerRadius} fill="none" stroke={app_colors.red_eighty} strokeWidth={1} />
          <Circle cx={centerX} cy={centerY} r={outerRadius - 10} fill="none" stroke={app_colors.red_eighty} strokeWidth={1} />
          <SvgText x={centerX} y={20} fill={app_colors.red_eighty} fontSize={20} textAnchor="middle">0</SvgText>
          <SvgText x={centerX} y={width - 10} fill={app_colors.red_eighty} fontSize={20} textAnchor="middle">6</SvgText>
          <SvgText x={20} y={centerY + 7} fill={app_colors.red_eighty} fontSize={20} textAnchor="middle">9</SvgText>
          <SvgText x={width - 20} y={centerY + 7} fill={app_colors.red_eighty} fontSize={20} textAnchor="middle">3</SvgText>

          {Array.from({ length: 4 }).map((_, i) => {
            const angleOffset = i * 90;
            return (
              <View key={`${i}_angle_${angleOffset}`}>
                {/* Add two separating lines of 50 units for each tier */}
                {[30, 60].map((angle) => {
                  const { startX, startY, endX, endY } = calculateLinePoints(angle + angleOffset, outerRadius - 5, longLineLength);
                  return (
                    <Line
                      key={`line-sep-${i}-${angle}`}
                      x1={startX}
                      y1={startY}
                      x2={endX}
                      y2={endY}
                      stroke={app_colors.red_eighty}
                      strokeWidth={2}
                    />
                  );
                })}

                {/* Add five lines within each tier, each 20 units long */}
                {[5, 10, 15, 20, 25].map((subAngle) => {
                  const { startX, startY, endX, endY } = calculateLinePoints(subAngle + angleOffset, outerRadius - 5, shortLineLength);
                  return (
                    <Line
                      key={`line-short-${i}-${subAngle}`}
                      x1={startX}
                      y1={startY}
                      x2={endX}
                      y2={endY}
                      stroke={app_colors.red_eighty}
                      strokeWidth={1}
                    />
                  );
                })}

                {[35, 40, 45, 50, 55].map((subAngle) => {
                  const { startX, startY, endX, endY } = calculateLinePoints(subAngle + angleOffset, outerRadius - 5, shortLineLength);
                  return (
                    <Line
                      key={`line-short-${i}-${subAngle}`}
                      x1={startX}
                      y1={startY}
                      x2={endX}
                      y2={endY}
                      stroke={app_colors.red_eighty}
                      strokeWidth={1}
                    />
                  );
                })}

                {[65, 70, 75, 80, 85].map((subAngle) => {
                  const { startX, startY, endX, endY } = calculateLinePoints(subAngle + angleOffset, outerRadius - 5, shortLineLength);
                  return (
                    <Line
                      key={`line-short-${i}-${subAngle}`}
                      x1={startX}
                      y1={startY}
                      x2={endX}
                      y2={endY}
                      stroke={app_colors.red_eighty}
                      strokeWidth={1}
                    />
                  );
                })}
              </View>
            );
          })}
          <Circle cx={centerX} cy={centerY} r={outerRadius - 5} fill="none" stroke={app_colors.black} strokeWidth={10} />
          <Line x1={centerX} y1={30} x2={centerX} y2={width - 30} stroke={app_colors.red_eighty} strokeWidth={2} />
          <Line x1={30} y1={centerY} x2={width - 30} y2={centerY} stroke={app_colors.red_eighty} strokeWidth={2} />
          <Circle cx={x} cy={y} r={pointRadius} fill={app_colors.white_eighty} />
        </Svg>
      </View>
    </View>
  )
}