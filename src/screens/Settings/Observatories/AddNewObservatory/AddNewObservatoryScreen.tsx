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

const AddNewObservatoryScreen = () => {

  const mapRef = useRef<MapView>(null);
  const currentUserLocation = useCurrentGpsPosition(true, { withLocationName: true, withLightPollution: true });

  const [searchQuery, setSearchQuery] = useState<string>("");
  const [submittedQuery, setSubmittedQuery] = useState<string>("");
  const [userActiveLocation, setUserActiveLocation] = useState<GpsPosition | null>(null);
  const { results, isLoading, isError, error } = useLocationSearch(submittedQuery);

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
    if (currentUserLocation.position) {
      mapRef.current?.animateToRegion({
        latitude: currentUserLocation.position.latitude,
        longitude: currentUserLocation.position.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      }, 500);
    }
  }, [currentUserLocation.position]);

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
      <ScreenHeader title="Nouveau lieu" main={false} subtitle="Étape 1/2 - Emplacement" />

      <View style={globalStyles.content}>
        <Text style={globalStyles.categoryTitle}>Recherchez ou appuyez sur la carte</Text>
        <View style={{display: "flex", flexDirection: "row", alignItems: "center", gap: 5, marginBottom: 10}}>
          <InputWithIcon
            icon={Search}
            placeholder="Aix-en-Provence"
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
            onMapReady={() => {console.log("Map is ready");}}

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
                  title="Selected Location"

                />
              )
            }
          </MapView>
        </View>

        <View style={globalStyles.content.heroCard}>
          <View style={[globalStyles.content.heroCard.item, globalStyles.content.heroCard.item.withBorder]}>
            <Text style={globalStyles.content.heroCard.item.title}>Latitude</Text>
            <Text style={globalStyles.content.heroCard.item.value}>
              {currentUserLocation.position ? convertDecimalLatitudeToDMS(currentUserLocation.position.latitude) : "..."}
            </Text>
          </View>
          <View style={[globalStyles.content.heroCard.item, globalStyles.content.heroCard.item.withBorder]}>
            <Text style={globalStyles.content.heroCard.item.title}>Longitude</Text>
            <Text style={globalStyles.content.heroCard.item.value}>
              {currentUserLocation.position ? convertDecimalLongitudeToDMS(currentUserLocation.position.longitude) : "..."}
            </Text>
          </View>
          <View style={globalStyles.content.heroCard.item}>
            <Text style={globalStyles.content.heroCard.item.title}>Altitude</Text>
            <Text style={globalStyles.content.heroCard.item.value}>
              {currentUserLocation.position ? `${Math.round(currentUserLocation.position.elevation)} m` : "..."}
            </Text>
          </View>
        </View>
      </View>
    </View>
  )
}

export default AddNewObservatoryScreen