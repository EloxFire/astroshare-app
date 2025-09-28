import React, {useEffect, useRef, useState} from "react";
import {ActivityIndicator, Dimensions, Image, ScrollView, Text, TouchableOpacity, View} from "react-native";
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
import {SvgUri} from "react-native-svg";
import {useAuth} from "../../contexts/AuthContext";
import {useTranslation} from "../../hooks/useTranslation";
import {sendAnalyticsEvent} from "../../helpers/scripts/analytics";
import {eventTypes} from "../../helpers/constants/analytics";

export default function LunarEclipseDetails({ navigation, route }: any) {
  const {currentUserLocation} = useSettings()
  const {currentUser} = useAuth()
  const {currentLocale} = useTranslation()

  const routeEclipse: LunarEclipse = route.params.eclipse;

  const [eclipse, setEclipse] = useState<SolarEclipse | null>(null);
  const [localCircumstances, setLocalCircumstances] = useState<LunarEclipse | null>(null);
  const [eclipseNotVisible, setEclipseNotVisible] = useState<boolean>(false);
  const [selectedLocation, setSelectedLocation] = useState<{latitude: number, longitude: number} | null>(null);
  const [selectedLocationName, setSelectedLocationName] = useState<string>('');
  const [loadingCircumstances, setLoadingCircumstances] = useState<boolean>(false);
  const [loadingImage, setLoadingImage] = useState<boolean>(true);
  const [svgWidth, setSvgWidth] = useState<number>(200);
  const [svgHeight, setSvgHeight] = useState<number>(150);
  const [svgPressed, setSvgPressed] = useState<boolean>(false);

  const mapRef = useRef(null)

  useEffect(() => {
    sendAnalyticsEvent(currentUser, currentUserLocation, 'Lunar eclipse details screen view', eventTypes.SCREEN_VIEW, {
      eclipseType: routeEclipse.type,
      calendarDate: routeEclipse.calendarDate,
    }, currentLocale);
  }, []);

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


  const handleSvgMapPress = () => {
    if( svgPressed ) {
      setSvgPressed(false);
      setSvgWidth(200);
      setSvgHeight(150);
    }else{
      setSvgPressed(true);
      setSvgWidth(Dimensions.get('window').width - 20);
      setSvgHeight(Dimensions.get('window').height - 20);
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
      {/*<TouchableOpacity style={solarEclipseDetailsStyles.content.svgSettings} onPress={() => handleSvgMapPress()}>*/}
      {/*  {loadingImage && <ActivityIndicator size={"large"} color={"white"} />}*/}
      {/*  {!loadingImage && <Image source={require('../../../assets/icons/FiSearch.png')} style={{height: 30}} resizeMode={"contain"} />}*/}
      {/*</TouchableOpacity>*/}
      <SvgUri
        uri={routeEclipse.link.image + "&map-meridian-zenith=true&image-format=svg&map-projection=EPSG:3395&map-labels=fr&map-theme=land-medium"}
        style={solarEclipseDetailsStyles.content.svgMapOverlay}
        width={svgWidth}
        height={svgHeight}
        onLoad={() => setLoadingImage(false)}
        onPress={() => handleSvgMapPress()}
      />
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
            <Text style={solarEclipseDetailsStyles.content.overlay.noEclipse}>Appuyez sur la carte pour obtenir les circonstances locales.</Text>
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
