import React, { useEffect, useState } from 'react'
import { Dimensions, ScrollView, Text, View } from 'react-native'
import { globalStyles } from '../../styles/global'
import { Star } from '../../helpers/types/Star'
import { useSettings } from '../../contexts/AppSettingsContext'
import { calculateHorizonAngle } from '../../helpers/scripts/astro/calculateHorizonAngle'
import { convertEquatorialToHorizontal, isBodyAboveHorizon, hercules, lyra, draco, cepheus, getPlanetaryPositions } from '@observerly/astrometry'
import { Circle, G, Image, Line, Mask, Polyline, Rect, Svg, Text as SvgText } from 'react-native-svg';
import { constellationsAsterisms } from '../helpers/scripts/astro/constellationsAsterisms'
import { app_colors } from '../helpers/constants'
import { i18n } from '../helpers/scripts/i18n'
import { useSolarSystem } from '../contexts/SolarSystemContext'
import { GlobalPlanet } from '../helpers/types/GlobalPlanet'
import { astroImages, moonIcons } from '../helpers/scripts/loadImages'
import PageTitle from '../components/commons/PageTitle'
import DSOValues from '../components/commons/DSOValues'
import ToggleButton from '../components/commons/buttons/ToggleButton'
import dayjs from 'dayjs'
import axios from 'axios'


export default function SkyMapGenerator({ navigation }: any) {

  const { currentUserLocation } = useSettings()
  const { planets, moonCoords } = useSolarSystem()

  const [starCatalog, setStarCatalog] = useState<Star[]>([])
  const [starCatalogLoading, setStarCatalogLoading] = useState(true)
  const [currentTime, setCurrentTime] = useState(new Date())

  const [showConstellations, setShowConstellations] = useState(true)
  const [showConstellationsName, setShowConstellationsName] = useState(false)
  const [showStarsName, setShowStarsName] = useState(false)
  const [showPlanets, setShowPlanets] = useState(true)

  const [moonX, setMoonX] = useState(0)
  const [moonY, setMoonY] = useState(0)

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

  useEffect(() => {
    calculateMoonPosition()
  }, [moonCoords])

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
    stars.forEach((star: Star) => {

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

  const calculateMoonPosition = () => {
    if (!currentUserLocation) return;
    const r = radius * (1 - moonCoords.alt / 90);
    const theta = moonCoords.az * (Math.PI / 180);
    const x = (screenWidth / 2) + r * Math.sin(theta);
    const y = (screenWidth / 2) + r * Math.cos(theta); // Remarquez le signe moins ici


    console.log('Moon coords', x, y);


    setMoonX(x)
    setMoonY(y)
  }


  // SVG dimensions
  const radius = 170;
  const screenWidth = Dimensions.get('window').width - 20;

  return (
    <View style={globalStyles.body}>
      <View style={{ zIndex: 10 }}>
        <PageTitle navigation={navigation} title={i18n.t('home.buttons.skymap_generator.title')} subtitle={i18n.t('home.buttons.skymap_generator.subtitle')} />
        <View style={globalStyles.screens.separator} />
      </View>

      <Text style={{ color: app_colors.red_eighty, textAlign: 'center', fontSize: 20 }}>N</Text>
      <Svg height={screenWidth} width={screenWidth} transform={`rotate(180, ${screenWidth / 2}, ${screenWidth / 2})`}>
        <Mask id="circleMask">
          <Rect x="0" y="0" width={screenWidth} height={screenWidth} fill="black" />
          <Circle cx={screenWidth / 2} cy={screenWidth / 2} r={radius} fill="white" />
        </Mask>

        <Circle cx={screenWidth / 2} cy={screenWidth / 2} r={radius} stroke={app_colors.white_forty} strokeWidth="1" fill={app_colors.black} />

        <G mask='url(#circleMask)'>

          {
            starCatalogLoading && starsToDisplay.length === 0 &&
            <SvgText transform={`rotate(180, ${screenWidth / 2}, ${screenWidth / 2})`} x={screenWidth / 2} y={screenWidth / 2} textAnchor="middle" fontSize="12" fill={app_colors.white_eighty}>{i18n.t('skymap.flatmap.mapLoading')}</SvgText>
          }

          {
            starsToDisplay.length > 0 && showConstellations &&
            constellationsAsterisms.flatMap((constellation, constellationIndex) => {
              // @ts-ignore
              return constellation.features[0].geometry.coordinates.map((segment: any, segmentIndex: any) => {
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
                  <Line key={`constellation-${constellationIndex}-${segmentIndex}`} x1={startX} y1={startY} x2={endX} y2={endY} stroke={app_colors.red_eighty} strokeWidth="1" fill="none" />
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
                <View key={index} >
                  <Circle key={`star-${index}`} cx={x} cy={y} r="0.5" fill={app_colors.white_eighty} />
                  {
                    showStarsName && star.V < 3 &&
                    <SvgText
                      key={`star-${star.ids}`}
                      x={x + 10}
                      y={y}
                      fill={app_colors.turquoise_sixty}
                      fontSize="5"
                      textAnchor="middle"
                      transform={`rotate(180, ${x}, ${y})`}
                    >
                      {star.ids.split('|').filter(id => id.includes('NAME'))}
                    </SvgText>
                  }
                </View>
              );
            })
          }

          {
            starsToDisplay.length > 0 && showConstellations && showConstellationsName &&
            constellationsAsterisms.map((constellation, constellationIndex) => {
              const centrum = constellation.features[0].properties?.centrum;
              if (!centrum) return null;

              const coords = convertEquatorialToHorizontal(currentTime, { latitude: currentUserLocation.lat, longitude: currentUserLocation.lon }, { ra: centrum.ra, dec: centrum.dec });
              const centerR = radius * (1 - coords.alt / 90);
              const centerTheta = coords.az * (Math.PI / 180);
              const centerX = (screenWidth / 2) + centerR * Math.sin(centerTheta);
              const centerY = (screenWidth / 2) + centerR * Math.cos(centerTheta);

              const name = constellation.features[0].properties?.name || `Constellation ${constellationIndex}`;

              return (
                <SvgText
                  key={`name-${constellationIndex}-${name}`}
                  x={centerX}
                  y={centerY}
                  fill={app_colors.white}
                  fontSize="8"
                  textAnchor="middle"
                  transform={`rotate(180, ${centerX}, ${centerY})`}
                >
                  {name}
                </SvgText>
              );
            }).filter(Boolean)
          }

          {
            (planets.length > 0 && showPlanets && !starCatalogLoading) &&
            planets.map((planet: GlobalPlanet, index: number) => {
              if (planet.name === 'Earth') return null;
              const coords = convertEquatorialToHorizontal(currentTime, { latitude: currentUserLocation.lat, longitude: currentUserLocation.lon }, { ra: planet.ra, dec: planet.dec })
              const r = radius * (1 - coords.alt / 90);
              const theta = coords.az * (Math.PI / 180);
              const x = (screenWidth / 2) + r * Math.sin(theta);
              const y = (screenWidth / 2) + r * Math.cos(theta); // Remarquez le signe moins ici

              return (
                <View key={index}>
                  <Image href={astroImages[planet.name.toUpperCase()]} key={`planet-${index}`} x={x} y={y} width={15} height={15} />
                  <SvgText
                    key={`name-planet-${planet.name}`}
                    x={x - 5}
                    y={y + 10}
                    fill={app_colors.white}
                    fontSize="8"
                    textAnchor="middle"
                    transform={`rotate(180, ${x}, ${y})`}
                  >
                    {planet.name}
                  </SvgText>
                </View>
              );
            })
          }
          {
            (showPlanets && moonCoords && !starCatalogLoading) && (
              <View>
                <Image href={moonIcons[moonCoords.phase]} x={moonX} y={moonY} width={12} height={12} />
                <SvgText
                  key={`the-moon`}
                  x={moonX - 5}
                  y={moonY + 10}
                  fill={app_colors.white}
                  fontSize="8"
                  textAnchor="middle"
                  transform={`rotate(180, ${moonX}, ${moonY})`}
                >
                  {i18n.t('common.planets.Moon')}
                </SvgText>
              </View>
            )
          }
        </G>
      </Svg>
      <Text style={{ color: app_colors.red_eighty, textAlign: 'center', fontSize: 20 }}>S</Text>

      <View style={{ marginTop: 20 }}>
        <DSOValues title={i18n.t('skymap.flatmap.localTime')} chipValue chipColor={app_colors.grey} value={dayjs(currentTime).format('HH:mm:ss').replace(':', 'h').replace(':', 'm') + "s"} />
        <ScrollView style={{ marginTop: 10, borderTopWidth: 1, borderColor: app_colors.white_forty, paddingTop: 10 }}>
          <ToggleButton title={i18n.t('skymap.flatmap.constellations')} onToggle={() => setShowConstellations(!showConstellations)} toggled={showConstellations} />
          <ToggleButton title={i18n.t('skymap.flatmap.constellationsName')} onToggle={() => setShowConstellationsName(!showConstellationsName)} toggled={showConstellationsName} />
          <ToggleButton title={i18n.t('skymap.flatmap.planets')} onToggle={() => setShowPlanets(!showPlanets)} toggled={showPlanets} />
          {/* <Text style={{ color: 'white' }}>{constellationsAsterisms[0].features[0].properties?.name}</Text> */}
          {/* <Text style={{ color: 'white' }}>{JSON.stringify(constellationsAsterisms[0].features[0].properties?.centrum)}</Text> */}
        </ScrollView>
      </View>
    </View>
  )
}
