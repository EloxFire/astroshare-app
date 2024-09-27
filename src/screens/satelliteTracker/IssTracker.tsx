import React, { useEffect, useRef, useState } from 'react'
import { ActivityIndicator, ScrollView, Text, View } from 'react-native'
import { convertDDtoDMS } from '../../helpers/scripts/convertDDtoDMSCoords'
import { getLocationName } from '../../helpers/api/getLocationFromCoords'
import { getCountryByCode } from '../../helpers/scripts/utils/getCountryByCode'
import { i18n } from '../../helpers/scripts/i18n'
import { useTranslation } from '../../hooks/useTranslation'
import { globalStyles } from '../../styles/global'
import { Gesture, GestureDetector, GestureHandlerRootView } from 'react-native-gesture-handler'
import { starlinkTrackerStyles } from '../../styles/screens/satelliteTracker/starlinkTracker'
import { ExpoWebGLRenderingContext, GLView } from 'expo-gl'
import * as THREE from 'three'
import * as ExpoTHREE from 'expo-three'
import axios from 'axios'
import PageTitle from '../../components/commons/PageTitle'
import { app_colors } from '../../helpers/constants'
import { getSatelliteCoordsFromTLE } from '../../helpers/scripts/astro/coords/getSatelliteCoordsFromTLE'
import { degToRad } from 'three/src/math/MathUtils'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import ToggleButton from '../../components/commons/buttons/ToggleButton'
import { issTrackerStyles } from '../../styles/screens/satelliteTracker/issTracker'
import DSOValues from '../../components/commons/DSOValues'
import { shortDmsCoord } from '../../helpers/scripts/shortenDmsCoord'
import getCountryFlag from 'country-flag-icons/unicode'
import MapView, { Circle, Marker, PROVIDER_GOOGLE, Polyline } from 'react-native-maps'
import { mapStyle } from '../../helpers/mapJsonStyle'
import SimpleButton from '../../components/commons/buttons/SimpleButton'

export default function IssTracker({ navigation }: any) {

  const {currentLocale} = useTranslation()

  const [issPosition, setIssPosition] = useState<any>(null)
  const [trajectoryPoints, setTrajectoryPoints] = useState<any>(null)
  const [issTle, setIssTle] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  const mapRef = useRef(null)


  useEffect(() => {
    getIssData()
    const update = setInterval(() => {
      getIssData()
    }, 5000)

    return () => clearInterval(update)
  }, [])

  useEffect(() => {
    if (!mapRef.current) return
    // @ts-ignore
    mapRef.current.animateToRegion({
      latitude: issPosition ? issPosition.latitude : 0,
      longitude: issPosition ? issPosition.longitude : 0,
      latitudeDelta: 0,
      longitudeDelta: 100,
    })
  }, [loading])

  const getIssData = async () => {
    try {
      const position = await axios.get(`${process.env.EXPO_PUBLIC_ASTROSHARE_API_URL}/iss`)
      const trajectoryPoints = await axios.get(`${process.env.EXPO_PUBLIC_ASTROSHARE_API_URL}/iss/trajectory`)
      const name = await getLocationName({ lat: position.data.data.latitude, lon: position.data.data.longitude });
      const tle = await axios.get(`${process.env.EXPO_PUBLIC_ASTROSHARE_API_URL}/iss/tle`)

      const iss = {
        ...position.data.data,
        dms_lat: convertDDtoDMS(position.data.data.latitude, position.data.data.latitude).dms_lat,
        dms_lon: convertDDtoDMS(position.data.data.longitude, position.data.data.longitude).dms_lon,
        country: name.country
      }

      setIssPosition(iss)
      setTrajectoryPoints(trajectoryPoints.data.data)
      const fortmatedTle = [tle.data.data.header.trim(), tle.data.data.line1.trim(), tle.data.data.line2.trim()]
      setIssTle(fortmatedTle)
      setLoading(false)
    } catch (error) {
      console.log(error)
      setLoading(false)
    }
  }

  const centerIss = () => {
    if (!mapRef.current) return
    // @ts-ignore
    mapRef.current.animateToRegion({
      latitude: issPosition ? issPosition.latitude : 0,
      longitude: issPosition ? issPosition.longitude : 0,
      latitudeDelta: 0,
      longitudeDelta: 100,
    })
  }
  return (
    <GestureHandlerRootView>
      <View style={globalStyles.body}>
        <PageTitle
          navigation={navigation}
          title={i18n.t('satelliteTracker.home.buttons.issTracker.title')}
          subtitle={i18n.t('satelliteTracker.home.buttons.issTracker.subtitle')}
        />
          <View style={globalStyles.screens.separator} />
          <ScrollView>
            <View style={issTrackerStyles.content}>
              <View style={issTrackerStyles.content.liveStats}>
                <Text style={issTrackerStyles.content.liveStats.title}>{i18n.t('satelliteTracker.issTracker.stats.title')}</Text>
                <DSOValues title={i18n.t('satelliteTracker.issTracker.stats.latitude')} value={issPosition ? shortDmsCoord(issPosition.dms_lat) : <ActivityIndicator size={'small'} color={app_colors.white} animating />} />
                <DSOValues title={i18n.t('satelliteTracker.issTracker.stats.longitude')} value={issPosition ? shortDmsCoord(issPosition.dms_lon) : <ActivityIndicator size={'small'} color={app_colors.white} animating />} />
                <DSOValues title={i18n.t('satelliteTracker.issTracker.stats.altitude')} value={issPosition ? `${issPosition.altitude.toFixed(2)} Km` : <ActivityIndicator size={'small'} color={app_colors.white} animating />} />
                <DSOValues title={i18n.t('satelliteTracker.issTracker.stats.speed')} value={issPosition ? `${issPosition.velocity.toFixed(2)} Km/h` : <ActivityIndicator size={'small'} color={app_colors.white} animating />} />
                <DSOValues title={i18n.t('satelliteTracker.issTracker.stats.country')} value={issPosition ? `${getCountryByCode(issPosition.country, currentLocale)} - ${getCountryFlag(issPosition.country === i18n.t('satelliteTracker.issTracker.stats.unknown') ? 'ZZ' : issPosition.country )}` : <ActivityIndicator size={'small'} color={app_colors.white} animating />} />
              </View>
              <View style={issTrackerStyles.content.mapContainer}>
                <Text style={issTrackerStyles.content.liveStats.title}>{i18n.t('satelliteTracker.issTracker.2dMap.title')}</Text>
                <View style={{display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
                  <SimpleButton text={i18n.t('satelliteTracker.issTracker.2dMap.button')} onPress={centerIss} icon={require('../../../assets/icons/FiIss.png')} />
                </View>
                <MapView
                  ref={mapRef}
                  provider={PROVIDER_GOOGLE}
                  style={issTrackerStyles.content.mapContainer.map}
                  customMapStyle={mapStyle}
                  initialRegion={{
                    latitude: issPosition ? issPosition.latitude : 0,
                    longitude: issPosition ? issPosition.longitude : 0,
                    latitudeDelta: 0,
                    longitudeDelta: 1000,
                  }}
                  rotateEnabled={false}
                  cameraZoomRange={{ minCenterCoordinateDistance: 1000 }}
                >
                  {
                    issPosition &&
                    <Marker
                      coordinate={{
                        latitude: issPosition.latitude,
                        longitude: issPosition.longitude,
                      }}
                      title='ISS'
                      description="Position de l'ISS en temps réel"
                      image={require('../../../assets/icons/FiIssSmall.png')}
                      anchor={{ x: 0.5, y: 0.5 }}
                      centerOffset={{ x: 0.5, y: 0.5 }}
                    />

                  }
                  {
                    issPosition &&
                    <Circle
                      center={{
                        latitude: issPosition.latitude,
                        longitude: issPosition.longitude,
                      }}
                      radius={1200000}
                      fillColor={app_colors.white_twenty}
                      strokeColor={app_colors.white_forty}
                    />
                  }
                  {
                    trajectoryPoints &&
                    <Polyline
                      coordinates={trajectoryPoints}
                      strokeColor={app_colors.red}
                      strokeWidth={1}
                      geodesic
                    />
                  }
                </MapView>
              </View>
            </View>
          </ScrollView>
        </View>
    </GestureHandlerRootView>
  )
}