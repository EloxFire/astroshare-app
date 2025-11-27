// LightPollutionMap.tsx
import { StatusBar } from 'expo-status-bar';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Image, Dimensions } from 'react-native';
import MapView, { MapViewProps, Marker, PROVIDER_GOOGLE, Region, UrlTile } from 'react-native-maps';
import { app_colors } from '../../helpers/constants';
import { lightPollutionMapStyles } from '../../styles/screens/lightpollution/map';
import PageTitle from '../../components/commons/PageTitle';
import { globalStyles } from '../../styles/global';
import { mapStyle } from '../../helpers/mapJsonStyle';
import { useSettings } from '../../contexts/AppSettingsContext';
import { LightPollutionData } from '../../helpers/types/lightpollution/LightPollutionData';
import { lightpollution_bortle_colors, lightpollution_bortle_descriptions } from '../../helpers/constants/lightpollution';
import getUnicodeFlagIcon from 'country-flag-icons/unicode'
import InputWithIcon from '../../components/forms/InputWithIcon';
import { getCityCoords } from '../../helpers/api/getCityCoords';
import { LocationObject } from '../../helpers/types/LocationObject';
import { convertDDtoDMS } from '../../helpers/scripts/convertDDtoDMSCoords';
import { useAuth } from '../../contexts/AuthContext';
import { useTranslation } from '../../hooks/useTranslation';
import { sendAnalyticsEvent } from '../../helpers/scripts/analytics';
import { eventTypes } from '../../helpers/constants/analytics';

const LIGHT_POLLUTION_TILE_URL =
  'https://bucket.astroshare.fr/lightpollution/tiles/{z}/{x}/{y}.webp';

const BORTLE_LEGEND = [
  { level: 1, label: 'Très faible', range: '>21.7', description: 'Ciel naturel' },
  { level: 2, label: 'Faible', range: '21.7 - 21.3', description: 'Ciel très sombre' },
  { level: 3, label: 'Rural', range: '21.3 - 20.8', description: 'Détails galactiques visibles' },
  { level: 4, label: 'Périurbain', range: '20.8 - 20.1', description: 'Halo urbain léger' },
  { level: 5, label: 'Transition urbaine', range: '20.1 - 19.5', description: 'Pollution lumineuse notable' },
  { level: 6, label: 'Banlieue lumineuse', range: '19.5 - 18.9', description: 'Ciel délavé' },
  { level: 7, label: 'Urbain', range: '18.9 - 18.0', description: 'Voie lactée à peine visible' },
  { level: 8, label: 'Centre urbain', range: '18.0 - 17.0', description: 'Objets faibles invisibles' },
  { level: 9, label: 'Hyper centre', range: '<17', description: 'Ciel très lumineux' },
];


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

  const { currentUserLocation } = useSettings()
  const { currentUser } = useAuth()
  const { currentLocale } = useTranslation()

  const mapRef = useRef<MapView | null>(null);
  const [showOverlay, setShowOverlay] = useState(true);
  const [region, setRegion] = useState<Region>(INITIAL_REGION);
  const [selectedPosition, setSelectedPosition] = useState<{ latitude: number; longitude: number } | null>(null);
  const [pollutionData, setPollutionData] = useState<LightPollutionData | null>(null);
  const colorScaleLevels = Object.keys(lightpollution_bortle_colors)
    .map(Number)
    .filter((level) => level <= 9)
    .sort((a, b) => a - b);
  const [detailedLegendVisible, setDetailedLegendVisible] = useState(false);
  const [searchVisible, setSearchVisible] = useState(false);
  const [searchString, setSearchString] = useState<string>('');

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

  const toggleLegend = () => {
    setDetailedLegendVisible(!detailedLegendVisible);
  }

  const handleSearch = async () => {
    if (searchString === '') {
      return
    }


    const cityCoords = await getCityCoords(searchString)
    if (cityCoords.length === 0) return;

    const city: LocationObject = {
      lat: cityCoords[0].lat,
      lon: cityCoords[0].lon,
      common_name: cityCoords[0].local_names.fr,
      country: cityCoords[0].country,
      state: cityCoords[0].state || '',
      dms: convertDDtoDMS(cityCoords[0].lat, cityCoords[0].lon)
    }

    fetchPollutionData(city.lat, city.lon);

    const region = {
      latitude: city.lat,
      longitude: city.lon,
      latitudeDelta: 10,
      longitudeDelta: 10,
    };
    setRegion(region);
    setSelectedPosition({ latitude: city.lat, longitude: city.lon });

    // Animer la carte vers la région de la ville recherchée
    mapRef.current?.animateToRegion(region, 1000);

    setSearchVisible(false);
    setSearchString('');
  }

  const fetchPollutionData = useCallback(async (lat: number, lon: number) => {
    // Exemple d'appel API fictif
    const apiUrl = `${process.env.EXPO_PUBLIC_ASTROSHARE_API_URL}/lightpollution?lat=${lat}&lon=${lon}`;

    try {
      const response = await fetch(apiUrl);
      const data = await response.json();
      console.log('Pollution data:', data);
      setPollutionData(data);
      // Traitez les données comme nécessaire
    } catch (error) {
      console.error('Error fetching pollution data:', error);
    }

    sendAnalyticsEvent(
      currentUser,
      currentUserLocation,
      'Fetched light pollution data',
      eventTypes.DATA_ACQUISITION,
      {searchString, latitude: lat, longitude: lon},
      currentLocale
    )
  }, []);

  useEffect(() => {
    if (selectedPosition) {
      fetchPollutionData(selectedPosition.latitude, selectedPosition.longitude);
    }
  }, [selectedPosition, fetchPollutionData]);

  useEffect(() => {
    sendAnalyticsEvent(
      currentUser,
      currentUserLocation,
      'Light Pollution Map screen view',
      eventTypes.SCREEN_VIEW,
      {},
      currentLocale
    )
  }, []);

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
              title={pollutionData ? pollutionData.location || 'Inconnu' : 'Position sélectionnée'}
              description={`Lat: ${selectedPosition.latitude.toFixed(4)}, Lon: ${selectedPosition.longitude.toFixed(4)}`}
            />
          )
        }
      </MapView>

      {/* Bouton ON/OFF pour l'overlay */}
      <View style={lightPollutionMapStyles.controlsContainer}>
        <View style={[lightPollutionMapStyles.controlsContainer.header, {justifyContent: selectedPosition ? 'space-between' : 'flex-end'}]}>
          {
            selectedPosition && pollutionData && !searchVisible && (
              <View style={[lightPollutionMapStyles.controlsContainer.header.infoBox]}>
                <Text style={lightPollutionMapStyles.controlsContainer.header.infoBox.subtitle}>{pollutionData.location ? pollutionData.location.slice(0, -4) : 'Inconnu'} {getUnicodeFlagIcon(pollutionData.location ? pollutionData.location.slice(-2) : 'ZZ')}</Text>
                <Text style={[lightPollutionMapStyles.controlsContainer.header.infoBox.title, {color: lightpollution_bortle_colors[pollutionData.bortle] === "#000000" ? "#FFFFFF" : lightpollution_bortle_colors[pollutionData.bortle]}]} >Bortle {pollutionData.bortle}</Text>
                {
                  pollutionData.mpsas !== "Infinity" && (
                    <Text style={lightPollutionMapStyles.controlsContainer.header.infoBox.subtitle}>{pollutionData.mpsas} mag/arcsec²</Text>
                  )
                }
                <Text style={lightPollutionMapStyles.controlsContainer.header.infoBox.source}>Source : {pollutionData.source}</Text>
              </View>
            )
          }
          {
            searchVisible && (
              <InputWithIcon
                placeholder="Rechercher une ville..."
                changeEvent={(text: string) => setSearchString(text)}
                type='text'
                value={searchString}
                icon={require('../../../assets/icons/FiSearch.png')}
                search={handleSearch}
                keyboardType='default'
                additionalStyles={lightPollutionMapStyles.controlsContainer.header.searchInput}
              />
            )
          }
          <View style={lightPollutionMapStyles.controlsContainer.header.buttons}>
            <TouchableOpacity style={lightPollutionMapStyles.controlsContainer.header.buttons.button} onPress={() => setSearchVisible(!searchVisible)}>
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
        
        <View style={lightPollutionMapStyles.controlsContainer.footer}>
          <TouchableOpacity onPress={toggleLegend} style={lightPollutionMapStyles.legend.container}>
            <View style={lightPollutionMapStyles.legend.header}>
              <Text style={lightPollutionMapStyles.legend.header.title}>Échelle de pollution lumineuse</Text>
              <Text style={lightPollutionMapStyles.legend.header.subtitle}>Bortle</Text>
            </View>
            <View style={lightPollutionMapStyles.legend.scaleRow}>
              {colorScaleLevels.map((level) => (
                <View
                  key={`scale-color-${level}`}
                  style={[lightPollutionMapStyles.legend.scaleRow.scaleBlock, { backgroundColor: lightpollution_bortle_colors[level] }]}
                />
              ))}
            </View>
            <View style={lightPollutionMapStyles.legend.scaleRow.scaleLabels}>
              {colorScaleLevels.map((level) => (
                <Text key={`scale-label-${level}`} style={lightPollutionMapStyles.legend.scaleRow.scaleLabel}>{level}</Text>
              ))}
            </View>
            {
              detailedLegendVisible && (
                <>
                  <View style={lightPollutionMapStyles.legend.list}>
                    {Object.entries(lightpollution_bortle_descriptions).map(([key, item]) => (
                      <View key={`legend-item-${key}`} style={lightPollutionMapStyles.legend.list.listItem}>
                        <View style={[lightPollutionMapStyles.legend.list.listColor, { backgroundColor: item.color }]} />
                        <View style={lightPollutionMapStyles.legend.list.listTexts}>
                          <Text style={lightPollutionMapStyles.legend.list.listTitle}>{item.title}</Text>
                          <Text style={lightPollutionMapStyles.legend.list.listSubtitle}>{item.description}</Text>
                        </View>
                      </View>
                    ))}
                  </View>
                  <Text style={lightPollutionMapStyles.legend.list.unit}>mag/arcsec²</Text>
                </>
              )
            }
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default LightPollutionMap;
