import React, { useEffect, useState } from 'react'
import { ScrollView, View } from 'react-native'
import { globalStyles } from '../styles/global'
import PageTitle from '../components/commons/PageTitle'
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps'
import axios from 'axios'
import { satelliteTrackerStyles } from '../styles/screens/satelliteTracker'
import { customMapStyle } from '../helpers/mapJsonStyle'

export default function SatelliteTracker({ navigation }: any) {

  const [issPosition, setIssPosition] = useState<any>(null)

  useEffect(() => {
    getIssPosition()
    const update = setInterval(() => {
      getIssPosition()
    }, 5000)

    return () => clearInterval(update)
  }, [])

  const getIssPosition = async () => {
    try {
      const data = await axios.get(`${process.env.EXPO_PUBLIC_ASTROSHARE_API_URL}/iss`)
      setIssPosition(data.data.data)
    } catch (error) {
      console.log(error)
    }
  }

  const mapStyle = [
    {
      elementType: "geometry",
      stylers: [
        {
          color: "#212121",
        },
      ],
    },
    {
      elementType: "geometry.fill",
      stylers: [
        {
          saturation: -5,
        },
        {
          lightness: -5,
        },
      ],
    },
    {
      elementType: "labels.icon",
      stylers: [
        {
          visibility: "off",
        },
      ],
    },
    {
      elementType: "labels.text.fill",
      stylers: [
        {
          color: "#757575",
        },
      ],
    },
    {
      elementType: "labels.text.stroke",
      stylers: [
        {
          color: "#212121",
        },
      ],
    },
    {
      featureType: "administrative",
      elementType: "geometry",
      stylers: [
        {
          color: "#757575",
        },
      ],
    },
    {
      featureType: "administrative.country",
      elementType: "labels.text.fill",
      stylers: [
        {
          color: "#9E9E9E",
        },
      ],
    },
    {
      featureType: "administrative.land_parcel",
      stylers: [
        {
          visibility: "off",
        },
      ],
    },
    {
      featureType: "administrative.locality",
      elementType: "labels.text.fill",
      stylers: [
        {
          color: "#BDBDBD",
        },
      ],
    },
    {
      featureType: "poi",
      elementType: "labels.text.fill",
      stylers: [
        {
          color: "#757575",
        },
      ],
    },
    {
      featureType: "poi.business",
      stylers: [
        {
          visibility: "off",
        },
      ],
    },
    {
      featureType: "poi.park",
      elementType: "geometry",
      stylers: [
        {
          color: "#181818",
        },
      ],
    },
    {
      featureType: "poi.park",
      elementType: "labels.text",
      stylers: [
        {
          visibility: "off",
        },
      ],
    },
    {
      featureType: "poi.park",
      elementType: "labels.text.fill",
      stylers: [
        {
          color: "#616161",
        },
      ],
    },
    {
      featureType: "poi.park",
      elementType: "labels.text.stroke",
      stylers: [
        {
          color: "#1B1B1B",
        },
      ],
    },
    {
      featureType: "road",
      stylers: [
        {
          visibility: "off",
        },
      ],
    },
    {
      featureType: "road",
      elementType: "geometry.fill",
      stylers: [
        {
          color: "#2C2C2C",
        },
      ],
    },
    {
      featureType: "road",
      elementType: "labels.text.fill",
      stylers: [
        {
          color: "#8A8A8A",
        },
      ],
    },
    {
      featureType: "road.arterial",
      elementType: "geometry",
      stylers: [
        {
          color: "#373737",
        },
      ],
    },
    {
      featureType: "road.highway",
      elementType: "geometry",
      stylers: [
        {
          color: "#3C3C3C",
        },
      ],
    },
    {
      featureType: "road.highway.controlled_access",
      elementType: "geometry",
      stylers: [
        {
          color: "#4E4E4E",
        },
      ],
    },
    {
      featureType: "road.local",
      elementType: "labels.text.fill",
      stylers: [
        {
          color: "#616161",
        },
      ],
    },
    {
      featureType: "transit",
      elementType: "labels.text.fill",
      stylers: [
        {
          color: "#757575",
        },
      ],
    },
    {
      featureType: "water",
      elementType: "geometry",
      stylers: [
        {
          color: "#000000",
        },
      ],
    },
    {
      featureType: "water",
      elementType: "labels.text.fill",
      stylers: [
        {
          color: "#3D3D3D",
        },
      ],
    },
  ];

  return (
    <View style={globalStyles.body}>
      <PageTitle navigation={navigation} title="ISS Tracker" subtitle="// Ou se trouve l'ISS en temps réel" />
      <View style={globalStyles.screens.separator} />
      <ScrollView>
        <View style={satelliteTrackerStyles.mapContainer}>
          {
            issPosition &&
            <MapView
              initialRegion={{
                latitude: issPosition.latitude,
                longitude: issPosition.longitude,
                latitudeDelta: 120,
                longitudeDelta: 120,
              }}
              region={{
                latitude: issPosition.latitude,
                longitude: issPosition.longitude,
                latitudeDelta: 120,
                longitudeDelta: 120,
              }}
              style={satelliteTrackerStyles.mapContainer.map}
              customMapStyle={mapStyle}
              provider={PROVIDER_GOOGLE}
            >
              <Marker
                coordinate={{
                  latitude: issPosition.latitude,
                  longitude: issPosition.longitude,
                }}
                title="ISS"
                description="Station Spatiale Internationale"
                image={require('../../assets/icons/FiIss.png')}
                style={{ width: 50, height: 50 }}
              />
            </MapView>
          }
        </View>
      </ScrollView>
    </View>
  )
}
