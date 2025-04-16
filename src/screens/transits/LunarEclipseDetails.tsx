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
  const [localCircumstances, setLocalCircumstances] = useState<LunarEclipse | null>(null);
  const [eclipseNotVisible, setEclipseNotVisible] = useState<boolean>(false);
  const [selectedLocation, setSelectedLocation] = useState<{latitude: number, longitude: number} | null>(null);
  const [selectedLocationName, setSelectedLocationName] = useState<string>('');
  const [loadingCircumstances, setLoadingCircumstances] = useState<boolean>(false);

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
      const response = await astroshareApi.get('/eclipses/lunar', { params: { year: routeEclipse?.calendarDate, observer } });
      const data = response.data[0];
      if (!data) {
        setLocalCircumstances(null)
        setEclipseNotVisible(true);
      } else {
        setLocalCircumstances(data);
        setEclipseNotVisible(false);
      }
    } catch (e) {
      console.log("Error while fetching lunar eclipse");
    } finally {
      setLoadingCircumstances(false);
    }
  }

  console.log(routeEclipse?.events.P2?.date)
  Object.keys(routeEclipse?.events || {}).forEach((event) => {
    const typedEvent = event as keyof typeof routeEclipse.events;
    console.log(typedEvent, routeEclipse?.events[typedEvent]?.date, routeEclipse?.events[typedEvent]?.zenith.type);
  });
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
                        value={dayjs(localCircumstances.events.P2?.date).format('HH:mm:ss').replace(':', 'h').replace(':', 'm') + 's'}
                        chipValue
                    />
                    <DSOValues
                        title={"Durée totale"}
                        value={localCircumstances.duration.penumbral?.replace(':', 'h').replace(':', 'm') + 's'}
                        chipValue
                    />
                    <DSOValues
                        title={"Type"}
                        value={localCircumstances.type}
                        chipValue
                    />

                </View>
            </ScrollView>
        }
      </View>
    </View>
  );
}
