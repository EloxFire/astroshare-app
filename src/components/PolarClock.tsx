import React, { useEffect, useState } from 'react'
import { Dimensions, Text, View } from 'react-native'
import { Circle, Line, Svg, Text as SvgText } from 'react-native-svg';
import { useSettings } from '../contexts/AppSettingsContext';
import { polarClockStyles } from '../styles/components/polarClock';
import { Polaris, app_colors } from '../helpers/constants';
import { scopeAlignmentStyles } from '../styles/screens/scopeAlignment';
import { shortDmsCoord } from '../helpers/scripts/shortenDmsCoord';
import dayjs from 'dayjs';
import { convertEquatorialToHorizontal } from '@observerly/astrometry';
import { convertHMSToDegreeFromString } from '../helpers/scripts/astro/HmsToDegree';
import { convertDMSToDegreeFromString } from '../helpers/scripts/astro/DmsToDegree';


export default function PolarClock() {

  const { currentUserLocation } = useSettings()

  const [polarisX, setPolarisX] = useState<number>(0);
  const [polarisY, setPolarisY] = useState<number>(0);

  useEffect(() => {
    updatePosition();
    const update = setInterval(() => {
      updatePosition();
    }, 1000)

    return () => clearInterval(update);
  }, [])

  const updatePosition = () => {
    polarisParams()
  }

  const polarisParams = (): { alt: number, az: number } => {
    const observer = { latitude: currentUserLocation.lat, longitude: currentUserLocation.lon };
    const target = { ra: convertHMSToDegreeFromString(Polaris.ra)!, dec: convertDMSToDegreeFromString(Polaris.dec)! };
    const { alt, az } = convertEquatorialToHorizontal(new Date(), observer, target);
    console.log('Altitude :', alt, 'Azimuth :', az);
    return { alt, az };
  }

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

  const calculatePolarisPosition = (alt: number, az: number, innerRadius: number, outerRadius: number) => {
    const totalAngle = 180 - az; // Adjust the angle for SVG coordinate system
    const angleInRadians = (totalAngle - 90) * Math.PI / 180; // Convert to radians
    const radius = innerRadius + (outerRadius - innerRadius) * (alt / 90); // Scale altitude to fit between the inner and outer circles
    const x = centerX + radius * Math.cos(angleInRadians);
    const y = centerY + radius * Math.sin(angleInRadians);
    return { x, y };
  };

  return (
    <View>
      <View style={scopeAlignmentStyles.content.dataContainer}>
        <Text style={scopeAlignmentStyles.content.dataContainer.title}>Longitude :</Text>
        <Text style={scopeAlignmentStyles.content.dataContainer.value}>{shortDmsCoord(currentUserLocation.dms?.dms_lon)}</Text>
      </View>

      <View style={scopeAlignmentStyles.content.dataContainer}>
        <Text style={scopeAlignmentStyles.content.dataContainer.title}>Heure locale :</Text>
        <Text style={scopeAlignmentStyles.content.dataContainer.value}>{dayjs().format('HH:mm').replace(':', 'h')}</Text>
      </View>

      <View style={scopeAlignmentStyles.content.dataContainer}>
        <Text style={scopeAlignmentStyles.content.dataContainer.title}>Temps local sidéral (LST) :</Text>
        <Text style={scopeAlignmentStyles.content.dataContainer.value}></Text>
      </View>

      <View style={scopeAlignmentStyles.content.dataContainer}>
        <Text style={scopeAlignmentStyles.content.dataContainer.title}>Position polaire :</Text>
        <Text style={scopeAlignmentStyles.content.dataContainer.value}></Text>
      </View>

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
          <Circle cx={polarisX} cy={polarisY} r={pointRadius} fill={app_colors.white_eighty} />
        </Svg>
      </View>
    </View>
  )
}