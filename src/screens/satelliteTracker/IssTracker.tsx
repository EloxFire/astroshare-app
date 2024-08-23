import React, { useEffect, useRef, useState } from 'react'
import { Dimensions, ScrollView, Text, TouchableOpacity, View } from 'react-native'
import { satelliteTrackerStyles } from '../../styles/screens/satelliteTracker'
import { mapStyle } from '../../helpers/mapJsonStyle'
import { app_colors } from '../../helpers/constants'
import { convertDDtoDMS } from '../../helpers/scripts/convertDDtoDMSCoords'
import { getLocationName } from '../../helpers/api/getLocationFromCoords'
import { getCountryByCode } from '../../helpers/scripts/utils/getCountryByCode'
import { Image } from 'expo-image'
import PageTitle from '../../components/commons/PageTitle'
import MapView, { Circle, Marker, PROVIDER_GOOGLE, Polyline } from 'react-native-maps'
import axios from 'axios'
import DSOValues from '../../components/commons/DSOValues'
import YoutubePlayer from "react-native-youtube-iframe";
import { i18n } from '../../helpers/scripts/i18n'
import { issFeedImages } from '../../helpers/scripts/loadImages'
import { useTranslation } from '../../hooks/useTranslation'

export default function IssTracker({ navigation }: any) {

  const { currentLocale } = useTranslation()

  const [issPosition, setIssPosition] = useState<any>(null)
  const [trajectoryPoints, setTrajectoryPoints] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [issInfosModalVisible, setIssInfosModalVisible] = useState(false)
  const [liveFeedModalVisible, setLiveFeedModalVisible] = useState(false)
  const [issFeedError, setIssFeedError] = useState(false)

  const mapRef = useRef(null)
  const youtubePlayerRef = useRef(null)


  useEffect(() => {
    getIssData()
    const update = setInterval(() => {
      getIssData()
    }, 5000)

    return () => clearInterval(update)
  }, [])

  useEffect(() => {
    (async () => {
      const TLE = await axios.get(`${process.env.EXPO_PUBLIC_ASTROSHARE_API_URL}/iss/tle`)
    })()
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

      let name = await getLocationName({ lat: position.data.data.latitude, lon: position.data.data.longitude });

      const iss = {
        ...position.data.data,
        dsm_lat: convertDDtoDMS(position.data.data.latitude, position.data.data.latitude).dms_lat,
        dsm_lon: convertDDtoDMS(position.data.data.longitude, position.data.data.longitude).dms_lon,
        country: name.country,
      }
      setIssPosition(iss)
      setTrajectoryPoints(trajectoryPoints.data.data)
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

  const handleLiveFeedDisplay = () => {
    setIssInfosModalVisible(false)
    setLiveFeedModalVisible(!liveFeedModalVisible)
  }

  return (
    <View>
      <MapView
        ref={mapRef}
        provider={PROVIDER_GOOGLE}
        style={satelliteTrackerStyles.map}
        customMapStyle={mapStyle}
        initialRegion={{
          latitude: issPosition ? issPosition.latitude : 0,
          longitude: issPosition ? issPosition.longitude : 0,
          latitudeDelta: 0,
          longitudeDelta: 100,
        }}
        rotateEnabled={false}
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
      <View style={satelliteTrackerStyles.pageControls}>
        <PageTitle title={i18n.t('home.buttons.satellite_tracker.title')} navigation={navigation} subtitle={i18n.t('home.buttons.satellite_tracker.subtitle')} />
      </View>
      <View style={satelliteTrackerStyles.buttons}>
        <TouchableOpacity style={satelliteTrackerStyles.buttons.button} onPress={() => { setLiveFeedModalVisible(false); setIssInfosModalVisible(!issInfosModalVisible) }}>
          <Image source={require('../../../assets/icons/FiInfo.png')} style={{ width: 18, height: 18 }} />
          <Text style={satelliteTrackerStyles.buttons.button.text}>{i18n.t('satelliteTracker.issTracker.buttons.infos')}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={satelliteTrackerStyles.buttons.button} onPress={() => centerIss()}>
          <Image source={require('../../../assets/icons/FiIss.png')} style={{ width: 18, height: 18 }} />
          <Text style={satelliteTrackerStyles.buttons.button.text}>{i18n.t('satelliteTracker.issTracker.buttons.center')}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={satelliteTrackerStyles.buttons.button} onPress={() => handleLiveFeedDisplay()}>
          {
            !liveFeedModalVisible ?
              <Image source={require('../../../assets/icons/FiPlayCircle.png')} style={{ width: 18, height: 18 }} />
              :
              <Image source={require('../../../assets/icons/FiStopCircle.png')} style={{ width: 18, height: 18 }} />
          }
          <Text style={satelliteTrackerStyles.buttons.button.text}>{i18n.t('satelliteTracker.issTracker.buttons.feed')}</Text>
        </TouchableOpacity>
      </View>
      {
        issInfosModalVisible &&
        <View style={satelliteTrackerStyles.issModal}>
          <ScrollView>
            <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 }}>
              <View>
                <Text style={satelliteTrackerStyles.issModal.title}>{i18n.t('satelliteTracker.issTracker.infosModal.title')}</Text>
                <Text style={satelliteTrackerStyles.issModal.subtitle}>{i18n.t('satelliteTracker.issTracker.infosModal.subtitle')}</Text>
              </View>
              <Image source={require('../../../assets/icons/FiIss.png')} style={{ width: 50, height: 50 }} />
            </View>
            <DSOValues title={i18n.t('satelliteTracker.issTracker.infosModal.latitude')} value={issPosition ? issPosition.dsm_lat : i18n.t('common.loadings.simple')} chipValue chipColor={app_colors.grey} />
            <DSOValues title={i18n.t('satelliteTracker.issTracker.infosModal.longitude')} value={issPosition ? issPosition.dsm_lon : i18n.t('common.loadings.simple')} chipValue chipColor={app_colors.grey} />
            <DSOValues title={i18n.t('satelliteTracker.issTracker.infosModal.altitude')} value={issPosition ? `${issPosition.altitude.toFixed(2)} Km` : i18n.t('common.loadings.simple')} chipValue chipColor={app_colors.grey} />
            <DSOValues title={i18n.t('satelliteTracker.issTracker.infosModal.speed')} value={issPosition ? `${issPosition.velocity.toFixed(2)} Km/h` : i18n.t('common.loadings.simple')} chipValue chipColor={app_colors.grey} />
            <DSOValues title={i18n.t('satelliteTracker.issTracker.infosModal.country')} value={issPosition ? getCountryByCode(issPosition.country) : i18n.t('common.loadings.simple')} chipValue chipColor={app_colors.grey} />
          </ScrollView>
        </View>
      }

      {
        liveFeedModalVisible &&
        <View style={satelliteTrackerStyles.issModal}>
          <ScrollView>
            <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
              <View style={satelliteTrackerStyles.issModal.liveDot} />
              <Text style={satelliteTrackerStyles.issModal.title}>{i18n.t('satelliteTracker.issTracker.liveModal.title')}</Text>
            </View>
            <Text style={[satelliteTrackerStyles.issModal.subtitle, { marginBottom: 10, fontFamily: 'GilroyRegular', opacity: .5 }]}>{i18n.t('satelliteTracker.issTracker.liveModal.subtitle')}</Text>
            {
              issFeedError ?
                <Image source={issFeedImages[currentLocale]} style={{ width: '100%', height: 220, borderRadius: 10, borderWidth: 1, borderColor: app_colors.white_twenty }} />
                :
                <YoutubePlayer
                  width={Dimensions.get('screen').width - 20}
                  height={(Dimensions.get('screen').width - 20) / (16 / 9)}
                  play
                  ref={youtubePlayerRef}
                  videoId={"bZ4nAEhwoCI"}
                  onError={() => setIssFeedError(true)}
                />
            }
          </ScrollView>
        </View>
      }
    </View>
  )
}