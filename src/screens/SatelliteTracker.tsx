import React, { useEffect, useRef, useState } from 'react'
import { ScrollView, Text, TouchableOpacity, View } from 'react-native'
import { globalStyles } from '../styles/global'
import PageTitle from '../components/commons/PageTitle'
import MapView, { Circle, Marker, PROVIDER_GOOGLE, Polyline } from 'react-native-maps'
import axios from 'axios'
import { satelliteTrackerStyles } from '../styles/screens/satelliteTracker'
import { mapStyle } from '../helpers/mapJsonStyle'
import { app_colors } from '../helpers/constants'
import DSOValues from '../components/commons/DSOValues'
import { convertDDtoDMS } from '../helpers/scripts/convertDDtoDMSCoords'
import { getLocationName } from '../helpers/api/getLocationFromCoords'
import { getCountryByCode } from '../helpers/scripts/utils/getCountryByCode'
import { Image } from 'expo-image'

export default function SatelliteTracker({ navigation }: any) {

  const [issPosition, setIssPosition] = useState<any>(null)
  const [trajectoryPoints, setTrajectoryPoints] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [issInfosModalVisible, setIssInfosModalVisible] = useState(false)

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
        <PageTitle title='Satellite tracker' navigation={navigation} subtitle="// Informations ISS et Starlink" />
      </View>
      <View style={satelliteTrackerStyles.tools}>
        <TouchableOpacity style={satelliteTrackerStyles.tools.button} onPress={() => centerIss()}>
          <View style={{ padding: 10, backgroundColor: app_colors.white_twenty, borderRadius: 10 }}>
            <Image source={require('../../assets/icons/FiIss.png')} style={satelliteTrackerStyles.tools.button.icon} />
          </View>
          <Text style={satelliteTrackerStyles.tools.button.label}>ISS</Text>
        </TouchableOpacity>
        <TouchableOpacity style={satelliteTrackerStyles.tools.button} onPress={() => centerIss()}>
          <View style={{ padding: 10, backgroundColor: app_colors.white_twenty, borderRadius: 10 }}>
            <Image source={require('../../assets/icons/FiStarlink.png')} style={satelliteTrackerStyles.tools.button.icon} />
          </View>
          <Text style={satelliteTrackerStyles.tools.button.label}>Starlink</Text>
        </TouchableOpacity>
      </View>
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
    </View>
  )
}