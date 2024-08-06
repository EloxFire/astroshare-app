import React, { useEffect, useState } from 'react'
import { Dimensions, Text, View } from 'react-native'
import { globalStyles } from '../styles/global'
import { Star } from '../helpers/types/Star'
import { useSettings } from '../contexts/AppSettingsContext'
import { calculateHorizonAngle } from '../helpers/scripts/astro/calculateHorizonAngle'
import { convertEquatorialToHorizontal, isBodyAboveHorizon, hercules, lyra, draco, cepheus } from '@observerly/astrometry'
import { Circle, G, Line, Mask, Polyline, Rect, Svg, Text as SvgText } from 'react-native-svg';
import { constellationsAsterisms } from '../helpers/scripts/astro/constellationsAsterisms'
import { app_colors } from '../helpers/constants'
import PageTitle from '../components/commons/PageTitle'
import DSOValues from '../components/commons/DSOValues'
import ToggleButton from '../components/commons/buttons/ToggleButton'
import dayjs from 'dayjs'
import axios from 'axios'


export default function SkyMapGenerator({ navigation }: any) {

  const { currentUserLocation } = useSettings()

  const [starCatalog, setStarCatalog] = useState<Star[]>([])
  const [starCatalogLoading, setStarCatalogLoading] = useState(true)
  const [currentTime, setCurrentTime] = useState(new Date())

  const [showConstellations, setShowConstellations] = useState(true)

  const [starsToDisplay, setStarsToDisplay] = useState<Star[]>([])

  useEffect(() => {
    getStarCatalog()
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      updateDate()
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      getStarsAboveHorizon(starCatalog)
    }, 60000)

    return () => clearInterval(interval)
  }, [])

  const updateDate = () => {
    setCurrentTime(new Date())
  }

  const getStarCatalog = async () => {
    const stars = await axios.get(`${process.env.EXPO_PUBLIC_ASTROSHARE_API_URL}/stars`);
    setStarCatalog(stars.data.data)
    setStarCatalogLoading(false)

    getStarsAboveHorizon(stars.data.data)
  }

  const getStarsAboveHorizon = (stars: Star[]) => {
    if (stars.length === 0) return;

    const candidates: Star[] = []
    stars.forEach((star: Star, index: number) => {

      const { ra, dec } = star
      const { lat, lon } = currentUserLocation
      const horizonAngle = calculateHorizonAngle(341)

      const isAboveHorizon = isBodyAboveHorizon(new Date(), { latitude: lat, longitude: lon }, { ra: ra, dec: dec }, horizonAngle)
      // if ((isAboveHorizon && star.V > 5.7) || star.ids.includes('alf UMi')) {
      if ((isAboveHorizon && star.V < 4.8 && star.V > 0) || star.ids.includes('alf UMi')) {
        candidates.push(star)
      }
    })

    setStarsToDisplay(candidates)
  }


  // SVG dimensions
  const radius = 185;
  const screenWidth = Dimensions.get('window').width - 20;

  return (
    <View style={globalStyles.body}>
      <PageTitle navigation={navigation} title="Carte du ciel" subtitle="// Carte du ciel en direct" />
      <View style={globalStyles.screens.separator} />

      <Text style={{ color: app_colors.red_eighty, textAlign: 'center', fontSize: 20 }}>N</Text>
      <Svg height={screenWidth} width={screenWidth} transform={`rotate(180, ${screenWidth / 2}, ${screenWidth / 2})`}>
        <Mask id="circleMask">
          <Rect x="0" y="0" width={screenWidth} height={screenWidth} fill="black" />
          <Circle cx={screenWidth / 2} cy={screenWidth / 2} r={radius} fill="white" />
        </Mask>

        <Circle cx={screenWidth / 2} cy={screenWidth / 2} r={radius} stroke={app_colors.white_forty} strokeWidth="1" fill={app_colors.black} />

        <G mask='url(#circleMask)'>
          {
            starsToDisplay.length > 0 && showConstellations &&
            constellationsAsterisms.flatMap((constellation, constellationIndex) => {
              return constellation.map((segment: any, segmentIndex: any) => {
                if (segment.length < 2) return null;

                const start = segment[0];
                const end = segment[1];

                const startCoords = convertEquatorialToHorizontal(currentTime, { latitude: currentUserLocation.lat, longitude: currentUserLocation.lon }, { ra: start[0], dec: start[1] });
                const startR = radius * (1 - startCoords.alt / 90);
                const startTheta = startCoords.az * (Math.PI / 180);
                const startX = (screenWidth / 2) + startR * Math.sin(startTheta);
                const startY = (screenWidth / 2) + startR * Math.cos(startTheta);

                const endCoords = convertEquatorialToHorizontal(currentTime, { latitude: currentUserLocation.lat, longitude: currentUserLocation.lon }, { ra: end[0], dec: end[1] });
                const endR = radius * (1 - endCoords.alt / 90);
                const endTheta = endCoords.az * (Math.PI / 180);
                const endX = (screenWidth / 2) + endR * Math.sin(endTheta);
                const endY = (screenWidth / 2) + endR * Math.cos(endTheta);

                return (
                  <Line key={`${constellationIndex}-${segmentIndex}`} x1={startX} y1={startY} x2={endX} y2={endY} stroke={app_colors.red_forty} strokeWidth="1" fill="none" />
                );
              }).filter(Boolean); // Filter out any null values
            })
          }

          {
            starsToDisplay.length > 0 &&
            starsToDisplay.map((star: Star, index: number) => {
              const coords = convertEquatorialToHorizontal(currentTime, { latitude: currentUserLocation.lat, longitude: currentUserLocation.lon }, { ra: star.ra, dec: star.dec })
              const r = radius * (1 - coords.alt / 90);
              const theta = coords.az * (Math.PI / 180);
              const x = (screenWidth / 2) + r * Math.sin(theta);
              const y = (screenWidth / 2) + r * Math.cos(theta); // Remarquez le signe moins ici

              if (star.ids.includes('alf UMi')) {
                return (
                  <Circle key={index} cx={x} cy={y} r="1" fill={app_colors.red} />
                )
              }

              return (
                <Circle key={index} cx={x} cy={y} r="0.5" fill={app_colors.white_eighty} />
              );
            })
          }
        </G>
      </Svg>
      <Text style={{ color: app_colors.red_eighty, textAlign: 'center', fontSize: 20 }}>S</Text>

      <View style={{ marginTop: 20 }}>
        <DSOValues title='Heure locale' chipValue chipColor={app_colors.grey} value={dayjs(currentTime).format('HH:mm:ss').replace(':', 'h').replace(':', 'm ')} />
        <View style={{ marginTop: 10, borderTopWidth: 1, borderColor: app_colors.white_forty, paddingTop: 10 }}>
          <ToggleButton title='Constellations' onToggle={() => setShowConstellations(!showConstellations)} toggled={showConstellations} />
        </View>
      </View>
    </View>
  )
}
