import React, {useEffect, useRef, useState} from "react";
import {ActivityIndicator, ScrollView, Text, View} from "react-native";
import { globalStyles } from "../../styles/global";
import { SolarEclipse } from "../../helpers/types/eclipses/SolarEclipse";
import { solarEclipseDetailsStyles } from "../../styles/screens/transits/solarEclipseDetails";
import MapView, {MapPressEvent, Marker, Polygon, Polyline, PROVIDER_GOOGLE} from "react-native-maps";
import { mapStyle } from "../../helpers/mapJsonStyle";
import { astroshareApi } from "../../helpers/api";
import { useSettings } from "../../contexts/AppSettingsContext";
import {app_colors, solarEclipseTypes, solarEclipseVisibilityLinesColors} from "../../helpers/constants";
import DSOValues from "../../components/commons/DSOValues";
import dayjs from "dayjs";
import {getLocationName} from "../../helpers/api/getLocationFromCoords";
import SimpleButton from "../../components/commons/buttons/SimpleButton";
import {LunarEclipse} from "../../helpers/types/LunarEclipse";

export default function LunarEclipseDetails({ navigation, route }: any) {
  const { currentUserLocation } = useSettings();
  const routeEclipse: LunarEclipse = route.params.eclipse;

  const [eclipse, setEclipse] = useState<SolarEclipse | null>(null);
  const [localCircumstances, setLocalCircumstances] = useState<SolarEclipse | null>(null);
  const [eclipseNotVisible, setEclipseNotVisible] = useState<boolean>(false);
  const [selectedLocation, setSelectedLocation] = useState<{latitude: number, longitude: number} | null>(null);
  const [selectedLocationName, setSelectedLocationName] = useState<string>('');
  const [loadingCircumstances, setLoadingCircumstances] = useState<boolean>(false);

  console.log(JSON.stringify(routeEclipse))
  const mapRef = useRef(null)

  const handleMapPress = async (event?: MapPressEvent | null, location?: {latitude: number, longitude: number}) => {
    if (!event && !location) {
      console.log("No event or location to fetch eclipse data for");
      return;
    }

    setLoadingCircumstances(true);
    let observer = '';
    let coordinates = event ? event.nativeEvent.coordinate : location;

    if (coordinates) {
      const locationName = await getLocationName({ lat: coordinates.latitude, lon: coordinates.longitude });
      setSelectedLocation(coordinates);
      setSelectedLocationName(locationName.local_names.fr);
      observer = `${coordinates.latitude},${coordinates.longitude}`;
    }

    try {
      const response = await astroshareApi.get('/eclipses/lunar', { params: { year: eclipse?.calendarDate, observer } });
      const data = response.data[0];
      console.log(data);
      if (!data) {
        setLocalCircumstances(null)
        setEclipseNotVisible(true);
      } else {
        setLocalCircumstances(data);
        setEclipseNotVisible(false);
      }
    } catch (e) {
      console.log("Error while fetching solar eclipses");
    } finally {
      setLoadingCircumstances(false);
    }
  }

  return (
    <View style={[globalStyles.body, { paddingHorizontal: 0, paddingTop: 0 }]}>
      <MapView
        ref={mapRef}
        onPress={(e) => handleMapPress(e)}
        provider={PROVIDER_GOOGLE}
        style={solarEclipseDetailsStyles.map}
        customMapStyle={mapStyle}
        initialRegion={{
          latitude: currentUserLocation.lat || 0,
          longitude: currentUserLocation.lon || 0,
          latitudeDelta: 10, // Ajustez cette valeur selon vos besoins
          longitudeDelta: 10, // Ajustez cette valeur selon vos besoins
        }}
        rotateEnabled={false}
        cameraZoomRange={{ minCenterCoordinateDistance: 1000 }}
      >
        {/*Tracé des zones de pénombre*/}
        {/* Zone de pénombre (P1 → P2) */}
        <Polygon
          coordinates={[
            {
              latitude: routeEclipse.events.P1?.zenith.geometry.coordinates[1],
              longitude: routeEclipse.events.P1?.zenith.geometry.coordinates[0]
            },
            {
              latitude: routeEclipse.events.P2?.zenith.geometry.coordinates[1],
              longitude: routeEclipse.events.P2?.zenith.geometry.coordinates[0]
            },
          ]}
          fillColor="rgba(255, 255, 200, 0.2)"
          strokeColor="rgba(255, 255, 150, 0.4)"
          strokeWidth={1}
        />

        {/* Zone de totalité (U1 → U4) */}
        <Polygon
          coordinates={[
            {
              latitude: routeEclipse.events.U1?.zenith.geometry.coordinates[1],
              longitude: routeEclipse.events.U1?.zenith.geometry.coordinates[0]
            },
            {
              latitude: routeEclipse.events.U4?.zenith.geometry.coordinates[1],
              longitude: routeEclipse.events.U4?.zenith.geometry.coordinates[0]
            },
          ]}
          fillColor="rgba(150, 150, 255, 0.3)"
          strokeColor="rgba(100, 100, 255, 0.6)"
          strokeWidth={1}
        />

        {/* Ligne de totalité : U2 → greatest → U3 */}
        <Polyline
          coordinates={[
            {
              latitude: routeEclipse.events.U2?.zenith.geometry.coordinates[1],
              longitude: routeEclipse.events.U2?.zenith.geometry.coordinates[0]
            },
            {
              latitude: routeEclipse.events.greatest?.zenith.geometry.coordinates[1],
              longitude: routeEclipse.events.greatest?.zenith.geometry.coordinates[0]
            },
            {
              latitude: routeEclipse.events.U3?.zenith.geometry.coordinates[1],
              longitude: routeEclipse.events.U3?.zenith.geometry.coordinates[0]
            },
          ]}
          strokeColor="red"
          strokeWidth={2}
        />


        {/* Marqueurs pour les points clés */}
        {['P1', 'P2', 'U1', 'U2', 'U3', 'U4', 'greatest'].map(key => {
          const coords = routeEclipse.events[key].zenith.geometry.coordinates;
          return (
            <Marker
              key={key}
              coordinate={{ latitude: coords[1], longitude: coords[0] }}
              title={key}
              pinColor={key === 'greatest' ? 'red' : 'blue'}
            />
          );
        })}


        {
          selectedLocation &&
            <Marker
                coordinate={selectedLocation}
                title={selectedLocationName}
                image={require('../../../assets/icons/FiPinMap.png')}
                anchor={{ x: 0.5, y: 1 }}
                centerOffset={{ x: 0.5, y: 1 }}
            />
        }
      </MapView>
      <View style={solarEclipseDetailsStyles.content.overlay.backButton}>
        <SimpleButton
          text={"Retour"}
          icon={require('../../../assets/icons/FiChevronLeft.png')}
          onPress={() => navigation.goBack()}
          backgroundColor={app_colors.black}
          textColor={app_colors.white}
          active
          activeBorderColor={app_colors.white_twenty}
        />
      </View>
      <View style={solarEclipseDetailsStyles.content.overlay}>
        <Text style={solarEclipseDetailsStyles.content.overlay.title}>{dayjs(routeEclipse.calendarDate).format('dddd DD MMMM YYYY')}</Text>
        <Text style={solarEclipseDetailsStyles.content.overlay.subtitle}>{solarEclipseTypes[routeEclipse.type]}</Text>
        {
          !selectedLocation && !loadingCircumstances &&
            <Text style={solarEclipseDetailsStyles.content.overlay.noEclipse}>Appuyez sur la carte pour obtenir les circonstances locales</Text>
        }
        {
          eclipseNotVisible && !loadingCircumstances &&
            <Text style={solarEclipseDetailsStyles.content.overlay.noEclipse}>L'éclipse n'est pas visible à cet endroit</Text>
        }
        {
          loadingCircumstances &&
            <ActivityIndicator size="small" color="white" />
        }
        {
          localCircumstances && !loadingCircumstances &&
            <ScrollView style={solarEclipseDetailsStyles.content.overlay.circumstances}>
                <Text style={solarEclipseDetailsStyles.content.overlay.circumstances.title}>Circonstances locales</Text>
                <View style={{display: 'flex', flexDirection: 'column', gap: 0}}>
                    <DSOValues
                        title={"Position"}
                        value={selectedLocationName}
                        chipValue
                    />
                    <DSOValues
                        title={"Début"}
                        value={dayjs(localCircumstances.events.P1?.date).format('HH:mm:ss').replace(':', 'h').replace(':', 'm') + 's'}
                        chipValue
                    />
                    <DSOValues
                        title={"Maximum"}
                        value={dayjs(localCircumstances.events.greatest?.date).format('HH:mm:ss').replace(':', 'h').replace(':', 'm') + 's'}
                        chipValue
                    />
                    <DSOValues
                        title={"Fin"}
                        value={dayjs(localCircumstances.events.P4?.date).format('HH:mm:ss').replace(':', 'h').replace(':', 'm') + 's'}
                        chipValue
                    />
                    <DSOValues
                        title={"Durée totale"}
                        value={localCircumstances.duration.penumbral.replace(':', 'h').replace(':', 'm') + 's'}
                        chipValue
                    />
                    <DSOValues
                        title={"Obscuration"}
                        value={localCircumstances.obscuration + "%"}
                        chipValue
                    />

                </View>
            </ScrollView>
        }
      </View>
    </View>
  );
}
