import React, { useEffect, useState } from 'react'
import { View } from 'react-native'
import dayjs from 'dayjs';
import { Circle, Line, Svg, Text as SvgText } from 'react-native-svg';
import { app_colors } from '../../helpers/constants';
import { convertDecimalHoursToTime } from '../../helpers/scripts/astro/decimalHourToTime';
import DSOValues from '../commons/DSOValues';
import { shortDmsCoord } from '../../helpers/scripts/shortenDmsCoord';
import { getHourAngle, getLocalSiderealTime } from '@observerly/astrometry';
import { useSettings } from '../../contexts/AppSettingsContext';
import { i18n } from '../../helpers/scripts/i18n';

interface Position {
  x: number;
  y: number;
}

export default function NorthenPolarScope() {
  const { currentUserLocation } = useSettings()
  const [hourAngle, setHourAngle] = useState<number>(0);
  const [localSiderialTime, setLocalSiderialTime] = useState<number>(0);
  const [polaris, setPolaris] = useState<Position>({ x: 0, y: 0 });


  const degreesToRadians = (degrees: number) => (degrees * Math.PI) / 180;

  const getData = () => {
    const now = new Date()
    const LST = getLocalSiderealTime(now, currentUserLocation.lon) // Local sidereal time en dégrés
    const HA = getHourAngle(now, currentUserLocation.lon, 45.27) // Hour angle en degrés
    setHourAngle(HA)
    setLocalSiderialTime(LST)
    const polarisPosition = calculatePolarPosition(LST, HA, radius)
    setPolaris(polarisPosition)
  }

  const calculatePolarPosition = (lst: number, ha: number, radius: number): Position => {
    // Convertir l'angle horaire en radians
    const haRad = degreesToRadians(ha);

    // Calcul des coordonnées polaires (en supposant un cadrant de rayon 1)
    const x = (radius - 5) * Math.cos(haRad);
    const y = (radius - 5) * Math.sin(haRad);

    return { x, y };
  };

  useEffect(() => {
    getData()
    const update = setInterval(() => {
      getData()
    }, 1000)

    return () => clearInterval(update)
  }, [])


  // SVG dimensions
  const svgWidth = 300;
  const svgHeight = 300;
  const centerX = svgWidth / 2;
  const centerY = svgHeight / 2;
  const radius = (svgWidth / 2) - 30;
  const strokeColor = app_colors.red_eighty;

  return (
    <>
      <View style={{ width: '100%' }}>
        <DSOValues title={i18n.t('scopeAlignment.polarClock.longitude')} chipValue chipColor={app_colors.grey} value={shortDmsCoord(currentUserLocation.dms.dms_lon)} />
        <DSOValues title={i18n.t('scopeAlignment.polarClock.local_time')} chipValue chipColor={app_colors.grey} value={dayjs(new Date()).format('HH:mm:ss').replace(':', 'h ').replace(':', 'm ') + 's'} />
        <DSOValues title={i18n.t('scopeAlignment.polarClock.local_sidereal_time')} chipValue chipColor={app_colors.grey} value={convertDecimalHoursToTime(localSiderialTime).replace(':', 'h ').replace(':', 'm ') + 's'} />
        <DSOValues title={i18n.t('scopeAlignment.polarClock.hour_angle')} chipValue chipColor={app_colors.grey} value={hourAngle.toFixed(2)} />
      </View>
      <Svg style={{ backgroundColor: 'transparent' }} height={svgHeight} width={svgWidth}>
        {/* Cercle principal */}
        <Circle cx={centerX} cy={centerY} r={radius} stroke={strokeColor} strokeWidth="1" fill="none" />
        <Circle cx={centerX} cy={centerY} r={radius - 12} stroke={strokeColor} strokeWidth="1" fill="none" />

        {/* Heures principales */}
        <SvgText x={centerX} y={centerY - (radius + 15)} fontSize={20} fill={strokeColor} textAnchor="middle">0</SvgText>
        <SvgText x={centerX + (radius + 20)} y={centerY + 7} fontSize={20} fill={strokeColor} textAnchor="middle">3</SvgText>
        <SvgText x={centerX} y={centerY + (radius + 30)} fontSize={20} fill={strokeColor} textAnchor="middle">6</SvgText>
        <SvgText x={centerX - (radius + 20)} y={centerY + 7} fontSize={20} fill={strokeColor} textAnchor="middle">9</SvgText>

        {/* Lignes des heures */}
        {[...Array(12)].map((_, i) => {
          const mainHourIndices = [0, 3, 6, 9];

          if (mainHourIndices.includes(i % 12)) {
            return null; // Ne pas afficher les lignes aux heures principales
          }
          return (
            <Line
              key={i}
              x1={centerX}
              y1={centerY - radius - 20} // Longueur différente pour les heures principales
              x2={centerX}
              y2={centerY - radius + 30}
              stroke={strokeColor}
              strokeWidth="1"
              transform={`rotate(${(i * 360) / 12}, ${centerX}, ${centerY})`}
            />
          )
        })}

        {[...Array(72)].map((_, i) => {
          const mainHourIndices = [0, 6, 12, 18, 24, 30, 36, 42, 48, 54, 60, 66, 72];

          if (mainHourIndices.includes(i % 60)) {
            return null; // Ne pas afficher les lignes aux heures principales
          }
          return (
            <Line
              key={i}
              x1={centerX}
              y1={centerY - radius - 5} // Longueur différente pour les heures principales
              x2={centerX}
              y2={centerY - radius + 20}
              stroke={strokeColor}
              strokeWidth="1"
              transform={`rotate(${(i * 360) / 72}, ${centerX}, ${centerY})`}
            />
          )
        })}
        <Circle cx={centerX} cy={centerY} r={radius - 6} stroke={"black"} strokeWidth="12" fill="none" />
        <Circle cx={centerX} cy={centerY} r={radius - 6} stroke={strokeColor} strokeWidth="1" fill="none" />
        {/* Lignes verticales et horizontales */}
        <Line x1={centerX} y1={centerY - radius - 10} x2={centerX} y2={centerY + radius + 10} stroke={strokeColor} strokeWidth="2" />
        <Line x1={centerX - radius - 10} y1={centerY} x2={centerX + radius + 10} y2={centerY} stroke={strokeColor} strokeWidth="2" />
        {/* Position de l'étoile sur le cercle */}
        <Circle
          cx={centerX + polaris.x}
          cy={centerY - polaris.y}
          r={5} // Rayon du cercle représentant Polaris
          fill={app_colors.lightgrey} // Couleur du cercle
          transform={`rotate(+90, ${centerX}, ${centerY})`}
        />
      </Svg>
    </>
  )
}
