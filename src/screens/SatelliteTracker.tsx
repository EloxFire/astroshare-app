import React, { useEffect, useState } from 'react'
import { ScrollView, Text, View } from 'react-native'
import { globalStyles } from '../styles/global'
import PageTitle from '../components/commons/PageTitle'
import MapView, { Marker, PROVIDER_GOOGLE, Polyline } from 'react-native-maps'
import axios from 'axios'
import { satelliteTrackerStyles } from '../styles/screens/satelliteTracker'
import { mapStyle } from '../helpers/mapJsonStyle'
import { app_colors } from '../helpers/constants'
import DSOValues from '../components/commons/DSOValues'
import { convertDDtoDMS } from '../helpers/scripts/convertDDtoDMSCoords'

export default function SatelliteTracker({ navigation }: any) {

  const [issPosition, setIssPosition] = useState<any>(null)
  const [trajectoryPoints, setTrajectoryPoints] = useState<any>([])
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

      const iss = {
        ...position.data.data,
        dsm_lat: convertDDtoDMS(position.data.data.latitude, position.data.data.latitude).dms_lat,
        dsm_lon: convertDDtoDMS(position.data.data.longitude, position.data.data.longitude).dms_lon
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
      <ScrollView>
        <View pointerEvents='none' style={satelliteTrackerStyles.mapContainer}>
          {
            loading ?
              <View>
                <Text>Chargement...</Text>
              </View>
              :
              issPosition ?
                <MapView
                  initialRegion={{
                    latitude: issPosition.latitude,
                    longitude: issPosition.longitude,
                    latitudeDelta: 0,
                    longitudeDelta: 200,
                  }}
                  region={{
                    latitude: issPosition.latitude,
                    longitude: issPosition.longitude,
                    latitudeDelta: 0,
                    longitudeDelta: 200,
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
        </View>
      </ScrollView>
    </View>
  )
}
