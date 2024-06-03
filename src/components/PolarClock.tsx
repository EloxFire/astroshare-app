import React from 'react'
import { Dimensions, Image, StyleSheet, Text, View } from 'react-native'
import { Circle, Line, Svg, Text as SvgText } from 'react-native-svg';
import { convertHMSToDegreeFromString } from '../helpers/scripts/astro/HmsToDegree';
import { getLocalSiderealTime } from '@observerly/astrometry';
import { useSettings } from '../contexts/AppSettingsContext';
import { polarClockStyles } from '../styles/components/polarClock';

export default function PolarClock() {

  const {currentUserLocation} = useSettings()

  const polaris = {
    ra: "03:01:03.6",
    dec: "+89:21:50.4",
    degRa: 45.265,
    degDec: 89.364,
  }

  console.log(convertHMSToDegreeFromString(polaris.ra));
    
  const LST = getLocalSiderealTime(new Date(), currentUserLocation.lon)
  const HA = LST - 2.9667 // 2.9667 = 3h 01m 03.6s

  // Fonction pour convertir l'angle en coordonnées x, y
  const polarToCartesian = (centerX: number, centerY: number, radius: number, angleInDegrees: number) => {
    let angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;

    return {
      x: centerX + (radius * Math.cos(angleInRadians)),
      y: centerY + (radius * Math.sin(angleInRadians))
    };
  };

  const center = 150;
  const position = polarToCartesian(center, center, 10, HA);
  const hours = Array.from({ length: 24 }, (_, i) => i); // 24 heures
  

  return (
    <View style={polarClockStyles.container}>
      {/* <Image source={''} /> */}
    </View>
  )
}