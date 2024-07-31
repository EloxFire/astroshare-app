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
import * as satellite from 'satellite.js';
import { useSettings } from '../contexts/AppSettingsContext'

export default function SatelliteTracker({ navigation }: any) {

  const { currentUserLocation } = useSettings()

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
    (async () => {
      const TLE = await axios.get(`${process.env.EXPO_PUBLIC_ASTROSHARE_API_URL}/iss/tle`)

      const issPasses = calculatePasses(currentUserLocation.lat, currentUserLocation.lon, 48, TLE.data.data.line1, TLE.data.data.line2)
      console.log("ISS passes :", issPasses)

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

  const calculatePasses = (latitude: number, longitude: number, durationHours: number = 48, TLE_L1: string, TLE_L2: string) => {
    const satrec = satellite.twoline2satrec(TLE_L1, TLE_L2);
    const now = new Date();
    const endTime = new Date(now.getTime() + durationHours * 60 * 60 * 1000);
    const passes = [];

    while (now <= endTime) {
      const positionAndVelocity = satellite.propagate(satrec, now);
      const positionEci = positionAndVelocity.position;
      if (positionEci) {
        const gmst = satellite.gstime(now);
        const positionGd = satellite.eciToGeodetic(positionEci as any, gmst);
        const latitudeDeg = satellite.degreesLat(positionGd.latitude);
        const longitudeDeg = satellite.degreesLong(positionGd.longitude);

        // Check if ISS is above the horizon
        const observerGd = {
          longitude: satellite.degreesToRadians(longitude),
          latitude: satellite.degreesToRadians(latitude),
          height: 0
        };

        const lookAngles = satellite.ecfToLookAngles(observerGd, positionEci as any);
        if (lookAngles.elevation > 0) {
          passes.push({
            time: new Date(now),
            elevation: lookAngles.elevation,
            azimuth: lookAngles.azimuth,
          });
        }
      }
      now.setMinutes(now.getMinutes() + 1);
    }

    return passes;
  };

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
        <PageTitle title='ISS tracker' navigation={navigation} subtitle="// Position de l'ISS en temps réel" />
      </View>
      <TouchableOpacity style={satelliteTrackerStyles.button} onPress={() => setIssInfosModalVisible(!issInfosModalVisible)}>
        <Image source={require('../../assets/icons/FiInfo.png')} style={{ width: 24, height: 24 }} />
      </TouchableOpacity>
      <TouchableOpacity style={[satelliteTrackerStyles.button, satelliteTrackerStyles.button.centerIss]} onPress={() => centerIss()}>
        <Image source={require('../../assets/icons/FiIss.png')} style={{ width: 24, height: 24 }} />
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
    </View>
  )
}