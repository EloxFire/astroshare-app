import React, { useEffect, useState } from 'react'
import { ScrollView, Text, View } from 'react-native'
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

  useEffect(() => {
    getIssData()
    const update = setInterval(() => {
      getIssData()
    }, 5000)

    return () => clearInterval(update)
  }, [])

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

  return (
    <View style={globalStyles.body}>
      <PageTitle navigation={navigation} title="ISS Tracker" subtitle="// Ou se trouve l'ISS en temps réel" />
      <View style={globalStyles.screens.separator} />
      <ScrollView style={{ marginBottom: 50 }}>
        <View pointerEvents='none' style={satelliteTrackerStyles.mapContainer}>
          {
            loading ?
              <View style={{ flex: 1 }}>
                <Image style={{ flex: 1 }} source={require('../../assets/images/issTrackerPlaceholder.png')} />
              </View>
              :
              issPosition ?
                <MapView
                  initialRegion={{
                    latitude: issPosition.latitude,
                    longitude: issPosition.longitude,
                    latitudeDelta: 0,
                    longitudeDelta: 100,
                  }}
                  region={{
                    latitude: issPosition.latitude,
                    longitude: issPosition.longitude,
                    latitudeDelta: 0,
                    longitudeDelta: 100,
                  }}
                  style={satelliteTrackerStyles.mapContainer.map}
                  customMapStyle={mapStyle}
                  provider={PROVIDER_GOOGLE}
                  zoomControlEnabled={false}
                >
                  {
                    trajectoryPoints &&
                    <Polyline
                      coordinates={trajectoryPoints}
                      strokeColor={app_colors.red_eighty}
                      strokeWidth={1}
                      geodesic
                    />
                  }
                  <Marker
                    coordinate={{
                      latitude: issPosition.latitude,
                      longitude: issPosition.longitude,
                    }}
                    title="ISS"
                    description="Station Spatiale Internationale"
                    image={require('../../assets/icons/FiIss.png')}
                    anchor={{ x: 0.5, y: 0.5 }}
                    centerOffset={{ x: 0.5, y: 0.5 }}
                  />
                  <Circle
                    center={{
                      latitude: issPosition.latitude,
                      longitude: issPosition.longitude,
                    }}
                    radius={1200000}
                    fillColor={app_colors.white_twenty}
                    strokeColor={app_colors.white_forty}
                  />
                </MapView>
                :
                <View>
                  <Text>Erreur lors du chargement des données</Text>
                </View>
          }
        </View>
        <View style={{ marginTop: 20 }}>
          <DSOValues title='Latitude' value={issPosition ? issPosition.dsm_lat : 'Chargement'} chipValue chipColor={app_colors.grey} />
          <DSOValues title='Longitude' value={issPosition ? issPosition.dsm_lon : 'Chargement'} chipValue chipColor={app_colors.grey} />
          <DSOValues title='Altitude' value={issPosition ? `${issPosition.altitude.toFixed(2)} Km` : 'Chargement'} chipValue chipColor={app_colors.grey} />
          <DSOValues title='Vitesse' value={issPosition ? `${issPosition.velocity.toFixed(2)} Km/h` : 'Chargement'} chipValue chipColor={app_colors.grey} />
          <DSOValues title='Pays (survol)' value={issPosition ? getCountryByCode(issPosition.country) : 'Chargement'} chipValue chipColor={app_colors.grey} />
          <View style={globalStyles.screens.separator} />
        </View>
        <View style={satelliteTrackerStyles.flyoversContainer}>
          <Text style={satelliteTrackerStyles.flyoversContainer.title}>Prochains passages (5j)</Text>
          <View style={satelliteTrackerStyles.flyoversContainer.flyovers}>
          </View>
        </View>
      </ScrollView>
    </View>
  )
}
