import { LocateFixedIcon, Search } from "lucide-react-native"
import { InputWithIcon } from "../../../../components/InputWithIcon/InputWithIcon"
import { ScreenHeader } from "../../../../components/ScreenHeader/ScreenHeader"
import { globalStyles } from "../../../../helpers/globalStyles"
import { Text, TouchableOpacity, View } from "react-native"
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps"
import { useEffect, useRef, useState } from "react"
import { adddNewObservatoryScreenStyles } from "./addNewObservatoryScreen.styles"
import { convertDecimalLatitudeToDMS, convertDecimalLongitudeToDMS } from "../../../../helpers/location/convert"
import { useLocationSearch } from "../../../../hooks/useLocationSearch"
import { useCurrentGpsPosition } from "../../../../hooks/useCurrentGpsPosition"
import { GpsPosition } from "../../../../types/gpsLocation"
import { app_colors } from "../../../../helpers/variables"
import { useTranslation } from "react-i18next"

const AddNewObservatoryScreen = () => {
  const { t } = useTranslation("settings");

  const mapRef = useRef<MapView>(null);
  // Nécessaire depuis que la position GPS est préchargée au démarrage (app/_layout.tsx) :
  // elle peut être déjà en cache quand cet écran se monte, avant même que la vue native de
  // la carte soit prête (mapRef.current encore null) — sans ça, le centrage échoue
  // silencieusement une fois et ne se redéclenche jamais (position ne change plus après).
  const [isMapReady, setIsMapReady] = useState(false);
  const currentUserLocation = useCurrentGpsPosition(true, { withLocationName: true, withLightPollution: true });

  const [searchQuery, setSearchQuery] = useState<string>("");
  const [submittedQuery, setSubmittedQuery] = useState<string>("");
  const [userActiveLocation, setUserActiveLocation] = useState<GpsPosition | null>(null);
  const { results } = useLocationSearch(submittedQuery);

  const handleSearchCurrentLocation = () => {
    if (currentUserLocation.position) {
      setUserActiveLocation(currentUserLocation.position);
      mapRef.current?.animateToRegion({
        latitude: currentUserLocation.position.latitude,
        longitude: currentUserLocation.position.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      }, 1000);
    }
  }

  const handleSearchLocation = () => {
    console.log("Searching for location:", searchQuery);
    setSubmittedQuery(searchQuery);
  }

  // const handleMapPress = (event) => {
  //   const { latitude, longitude } = event.nativeEvent.coordinate;
  //   console.log("Map pressed at:", latitude, longitude);
  //   setUserActiveLocation({ latitude, longitude, elevation: 0 });
  // }

  useEffect(() => {
    if (isMapReady && currentUserLocation.position) {
      mapRef.current?.animateToRegion({
        latitude: currentUserLocation.position.latitude,
        longitude: currentUserLocation.position.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      }, 500);
    }
  }, [isMapReady, currentUserLocation.position]);

  useEffect(() => {
    if (results && results.length > 0) {
      const firstResult = results[0];
      if (firstResult.lat && firstResult.lon) {
        setUserActiveLocation({ latitude: firstResult.lat, longitude: firstResult.lon, elevation: 0 });
        mapRef.current?.animateToRegion({
          latitude: firstResult.lat,
          longitude: firstResult.lon,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }, 1000);
      }
    }
  }, [results]);


  return (
    <View style={globalStyles.screen}>
      <ScreenHeader title={t("addObservatory.screenTitle")} main={false} subtitle={t("addObservatory.screenSubtitle")} />

      <View style={globalStyles.content}>
        <Text style={globalStyles.categoryTitle}>{t("addObservatory.searchPrompt")}</Text>
        <View style={{display: "flex", flexDirection: "row", alignItems: "center", gap: 5, marginBottom: 10}}>
          <InputWithIcon
            icon={Search}
            placeholder={t("addObservatory.searchPlaceholder")}
            value={searchQuery}
            onChangeText={setSearchQuery}
            action={handleSearchLocation}
            // suggestions={results?.map((result) => result.name) || []}
            // onSuggestionPress={(suggestion) => {
            //   setSearchQuery(suggestion);
            //   setSubmittedQuery(suggestion);
            // }}
          />
          <TouchableOpacity
            onPress={handleSearchCurrentLocation}
            style={{ marginLeft: 10, padding: 10, backgroundColor: app_colors.primary.main, borderRadius: 5 }}
          >
            <LocateFixedIcon color="white" size={20} />
          </TouchableOpacity>
        </View>

        <View style={adddNewObservatoryScreenStyles.mapContainer}>
          <MapView
            ref={mapRef}
            style={adddNewObservatoryScreenStyles.mapContainer.map}
            provider={PROVIDER_GOOGLE}
            onMapReady={() => setIsMapReady(true)}

            initialRegion={{
              latitude: 0,
              longitude: 0,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }}

            mapType="standard"
            showsUserLocation
            // onPress={handleMapPress}
          >
            {
              userActiveLocation && (
                <Marker
                  coordinate={{
                    latitude: userActiveLocation.latitude,
                    longitude: userActiveLocation.longitude,
                  }}
                  title={t("addObservatory.selectedLocationMarker")}
                />
              )
            }
          </MapView>
        </View>

        <View style={globalStyles.content.heroCard}>
          <View style={[globalStyles.content.heroCard.item, globalStyles.content.heroCard.item.withBorder]}>
            <Text style={globalStyles.content.heroCard.item.title}>{t("addObservatory.latitude")}</Text>
            <Text style={globalStyles.content.heroCard.item.value}>
              {currentUserLocation.position ? convertDecimalLatitudeToDMS(currentUserLocation.position.latitude) : "..."}
            </Text>
          </View>
          <View style={[globalStyles.content.heroCard.item, globalStyles.content.heroCard.item.withBorder]}>
            <Text style={globalStyles.content.heroCard.item.title}>{t("addObservatory.longitude")}</Text>
            <Text style={globalStyles.content.heroCard.item.value}>
              {currentUserLocation.position ? convertDecimalLongitudeToDMS(currentUserLocation.position.longitude) : "..."}
            </Text>
          </View>
          <View style={globalStyles.content.heroCard.item}>
            <Text style={globalStyles.content.heroCard.item.title}>{t("addObservatory.altitude")}</Text>
            <Text style={globalStyles.content.heroCard.item.value}>
              {currentUserLocation.position ? t("common:units.meters", { value: Math.round(currentUserLocation.position.elevation) }) : "..."}
            </Text>
          </View>
        </View>
      </View>
    </View>
  )
}

export default AddNewObservatoryScreen