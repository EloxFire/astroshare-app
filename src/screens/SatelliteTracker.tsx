import React, { useEffect, useRef, useState } from 'react'
import { Dimensions, ScrollView, Text, TouchableOpacity, View } from 'react-native'
import { satelliteTrackerStyles } from '../styles/screens/satelliteTracker'
import { mapStyle } from '../helpers/mapJsonStyle'
import { app_colors } from '../helpers/constants'
import { convertDDtoDMS } from '../helpers/scripts/convertDDtoDMSCoords'
import { getLocationName } from '../helpers/api/getLocationFromCoords'
import { getCountryByCode } from '../helpers/scripts/utils/getCountryByCode'
import { Image } from 'expo-image'
import PageTitle from '../components/commons/PageTitle'
import MapView, { Circle, Marker, PROVIDER_GOOGLE, Polyline } from 'react-native-maps'
import axios from 'axios'
import DSOValues from '../components/commons/DSOValues'
import WebView from 'react-native-webview'

export default function SatelliteTracker({ navigation }: any) {

  const [issPosition, setIssPosition] = useState<any>(null)
  const [trajectoryPoints, setTrajectoryPoints] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [issInfosModalVisible, setIssInfosModalVisible] = useState(false)
  const [liveFeedModalVisible, setLiveFeedModalVisible] = useState(false)

  const mapRef = useRef(null)

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
            image={require('../../assets/icons/FiIss.png')}
            style={{ width: 50, height: 50 }}
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
        <PageTitle title='ISS tracker' navigation={navigation} subtitle="// Position de l'ISS en temps réel" />
      </View>
      <TouchableOpacity style={satelliteTrackerStyles.button} onPress={() => setIssInfosModalVisible(!issInfosModalVisible)}>
        <Image source={require('../../assets/icons/FiInfo.png')} style={{ width: 24, height: 24 }} />
      </TouchableOpacity>
      <TouchableOpacity style={[satelliteTrackerStyles.button, satelliteTrackerStyles.button.centerIss]} onPress={() => centerIss()}>
        <Image source={require('../../assets/icons/FiIss.png')} style={{ width: 24, height: 24 }} />
      </TouchableOpacity>
      <TouchableOpacity style={[satelliteTrackerStyles.button, satelliteTrackerStyles.button.liveFeed]} onPress={() => handleLiveFeedDisplay()}>
        {
          !liveFeedModalVisible ?
            <Image source={require('../../assets/icons/FiPlayCircle.png')} style={{ width: 24, height: 24 }} />
            :
            <Image source={require('../../assets/icons/FiStopCircle.png')} style={{ width: 24, height: 24 }} />
        }
      </TouchableOpacity>
      {
        issInfosModalVisible &&
        <View style={satelliteTrackerStyles.issModal}>
          <ScrollView>
            <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 }}>
              <View>
                <Text style={satelliteTrackerStyles.issModal.title}>Station Spatiale Internationale</Text>
                <Text style={satelliteTrackerStyles.issModal.subtitle}>(ISS)</Text>
              </View>
              <Image source={require('../../assets/icons/FiIss.png')} style={{ width: 50, height: 50 }} />
            </View>
            <DSOValues title='Latitude' value={issPosition ? issPosition.dsm_lat : 'Chargement'} chipValue chipColor={app_colors.grey} />
            <DSOValues title='Longitude' value={issPosition ? issPosition.dsm_lon : 'Chargement'} chipValue chipColor={app_colors.grey} />
            <DSOValues title='Altitude' value={issPosition ? `${issPosition.altitude.toFixed(2)} Km` : 'Chargement'} chipValue chipColor={app_colors.grey} />
            <DSOValues title='Vitesse' value={issPosition ? `${issPosition.velocity.toFixed(2)} Km/h` : 'Chargement'} chipValue chipColor={app_colors.grey} />
            <DSOValues title='Pays (survol)' value={issPosition ? getCountryByCode(issPosition.country) : 'Chargement'} chipValue chipColor={app_colors.grey} />
          </ScrollView>
        </View>
      }

      {
        liveFeedModalVisible &&
        <View style={satelliteTrackerStyles.issModal}>
          <ScrollView>
            <Text style={satelliteTrackerStyles.issModal.title}>Vidéo en direct</Text>
            <Text style={[satelliteTrackerStyles.issModal.subtitle, { marginBottom: 10, fontFamily: 'GilroyRegular' }]}>La station à une période de 45 minutes dans le noir a chaque orbite</Text>
            <WebView
              style={{ width: Dimensions.get('screen').width - 20, height: (Dimensions.get('screen').width - 20) / (16 / 9), borderRadius: 10 }}
              javaScriptEnabled={true}
              source={{ uri: "https://www.youtube.com/embed/P9C25Un7xaM?si=AjWGfqmH5nZ8OOEB&amp;controls=0" }}
              allowsFullscreenVideo
            />
          </ScrollView>
        </View>
      }
    </View>
  )
}