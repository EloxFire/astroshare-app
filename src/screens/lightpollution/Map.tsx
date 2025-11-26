// LightPollutionMap.tsx
import { StatusBar } from 'expo-status-bar';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Image } from 'react-native';
import MapView, { MapViewProps, Marker, PROVIDER_GOOGLE, Region, UrlTile } from 'react-native-maps';
import { app_colors } from '../../helpers/constants';
import { lightPollutionMapStyles } from '../../styles/screens/lightpollution/map';
import PageTitle from '../../components/commons/PageTitle';
import { globalStyles } from '../../styles/global';
import { mapStyle } from '../../helpers/mapJsonStyle';
import { useSettings } from '../../contexts/AppSettingsContext';

const LIGHT_POLLUTION_TILE_URL =
  'https://bucket.astroshare.fr/lightpollution/tiles/{z}/{x}/{y}.webp';



const LightPollutionMap: React.FC = ({navigation}: any) => {

  // Limites de zoom (cohérentes avec tes tuiles 0–9)
  const MIN_ZOOM_LEVEL = 0;
  const MAX_ZOOM_LEVEL = 9;

  // Région initiale (vue globale)
  const INITIAL_REGION: Region = {
    latitude: 0,
    longitude: 0,
    latitudeDelta: 120,
    longitudeDelta: 360,
  };

  const {currentUserLocation} = useSettings();

  const mapRef = useRef<MapView | null>(null);
  const [showOverlay, setShowOverlay] = useState(true);
  const [region, setRegion] = useState<Region>(INITIAL_REGION);
  const [selectedPosition, setSelectedPosition] = useState<{ latitude: number; longitude: number } | null>(null);

  useEffect(() => {
    if (currentUserLocation) {
      const region = {
        latitude: currentUserLocation.lat,
        longitude: currentUserLocation.lon,
        latitudeDelta: 40,
        longitudeDelta: 40,
      };
      setRegion(region);

      // Animer la carte vers la région de l'utilisateur
      mapRef.current?.animateToRegion(region, 1000);
      }
  }, [])

  const toggleOverlay = () => {
    setShowOverlay(!showOverlay);
  }

  const handlePressMap = (event: any) => {
    const coordinate = event.nativeEvent.coordinate;
    console.log('Map pressed at coordinate:', coordinate);
    setSelectedPosition(coordinate);
  }

  return (
    <View style={[globalStyles.body, {paddingHorizontal: 0}]}>
      <PageTitle
        title="Pollution lumineuse"
        subtitle="Visualisez la pollution lumineuse mondiale"
        navigation={navigation}
      />
      <View style={[globalStyles.screens.separator, {marginBottom: 0}]} />
      <MapView
        ref={mapRef}
        style={lightPollutionMapStyles.map}
        customMapStyle={mapStyle}
        provider={PROVIDER_GOOGLE}
        initialRegion={INITIAL_REGION}
        region={region}
        showsUserLocation
        showsMyLocationButton={false}
        rotateEnabled={false}
        minZoomLevel={MIN_ZOOM_LEVEL}
        maxZoomLevel={MAX_ZOOM_LEVEL}
        mapType="standard" // ou "standard" / "hybrid" selon ton besoin
        onPress={handlePressMap}
      >
        {showOverlay && (
          <UrlTile
            urlTemplate={LIGHT_POLLUTION_TILE_URL}
            maximumZ={MAX_ZOOM_LEVEL}
            minimumZ={MIN_ZOOM_LEVEL}
            zIndex={10}
            opacity={0.6}
            flipY={true} // important avec gdal2tiles
          />
        )}

        {
          selectedPosition && (
            <Marker
              coordinate={selectedPosition}
              title="Position sélectionnée"
              description={`Lat: ${selectedPosition.latitude.toFixed(4)}, Lon: ${selectedPosition.longitude.toFixed(4)}`}
            />
          )
        }
      </MapView>

      {/* Bouton ON/OFF pour l'overlay */}
      <View style={lightPollutionMapStyles.controlsContainer}>
        <View style={[lightPollutionMapStyles.controlsContainer.header, {justifyContent: selectedPosition ? 'space-between' : 'flex-end'}]}>
          {
            selectedPosition && (
              <View style={lightPollutionMapStyles.controlsContainer.header.infoBox}>
                <Text style={lightPollutionMapStyles.controlsContainer.header.infoBox.title}>Carte de pollution lumineuse</Text>
                <Text style={{color: app_colors.white}}>Appuyez sur la carte pour sélectionner une position.</Text>
              </View>
            )
          }
          <View style={lightPollutionMapStyles.controlsContainer.header.buttons}>
            <TouchableOpacity style={lightPollutionMapStyles.controlsContainer.header.buttons.button} onPress={() => setShowOverlay(!showOverlay)}>
              <Image source={require('../../../assets/icons/FiSearch.png')} style={lightPollutionMapStyles.controlsContainer.header.buttons.button.icon} />
            </TouchableOpacity>

            <TouchableOpacity style={lightPollutionMapStyles.controlsContainer.header.buttons.button} onPress={toggleOverlay}>
              <Image source={require('../../../assets/icons/FiLayers.png')} style={lightPollutionMapStyles.controlsContainer.header.buttons.button.icon} />
            </TouchableOpacity>

            {
              selectedPosition && (
                <TouchableOpacity style={lightPollutionMapStyles.controlsContainer.header.buttons.button} onPress={() => setSelectedPosition(null)}>
                  <Image source={require('../../../assets/icons/FiRepeat.png')} style={lightPollutionMapStyles.controlsContainer.header.buttons.button.icon} />
                </TouchableOpacity>
              )
            }
          </View>
        </View>
      </View>
    </View>
  );
};

export default LightPollutionMap;
