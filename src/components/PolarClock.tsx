import React, { useEffect, useState } from 'react'
import { Dimensions, Text, View } from 'react-native'
import { Circle, Line, Svg, Text as SvgText } from 'react-native-svg';
import { useSettings } from '../contexts/AppSettingsContext';
import { polarClockStyles } from '../styles/components/polarClock';
import { Polaris, app_colors } from '../helpers/constants';
import { scopeAlignmentStyles } from '../styles/screens/scopeAlignment';
import { shortDmsCoord } from '../helpers/scripts/shortenDmsCoord';
import dayjs from 'dayjs';
import { convertEquatorialToHorizontal, getLocalSiderealTime } from '@observerly/astrometry';
import { convertHMSToDegreeFromString } from '../helpers/scripts/astro/HmsToDegree';
import { convertDMSToDegreeFromString } from '../helpers/scripts/astro/DmsToDegree';

const { width } = Dimensions.get('window');

export default function PolarClock() {

  const { currentUserLocation } = useSettings()

  const now = new Date()
  const LST = getLocalSiderealTime(now, currentUserLocation.lon) // Local sidereal time en dégrés

  const calculatePolarisPosition = (lst: number, ra: number, dec: number, lat: number): number => {
    const lstRad = (lst * Math.PI) / 180;
    const raRad = (ra * Math.PI) / 180;
    const decRad = (dec * Math.PI) / 180;
    const latRad = (lat * Math.PI) / 180;

    const ha = lstRad - raRad;
    const x = Math.cos(decRad) * Math.sin(ha);
    const y = Math.sin(decRad) * Math.cos(latRad) - Math.cos(decRad) * Math.cos(ha) * Math.sin(latRad);

    const angle = Math.atan2(y, x) * (12 / Math.PI);
    return angle;
  }


  return (
    <View>
    </View>
  )
}