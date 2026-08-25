import { Platform, View } from "react-native"
import { useRef } from "react";
import MapView, { PROVIDER_GOOGLE } from "react-native-maps";
import { observatoriesScreenStyles } from "./ObservatoriesScreen.styles";
import { ScreenHeader } from "../../../components/ScreenHeader/ScreenHeader";

const ObservatoriesScreen = () => {

  const mapRef = useRef<MapView>(null);

  return (
    <View style={observatoriesScreenStyles.screen}>
      <ScreenHeader title="Vos observatoires" main={false} />
      <View style={observatoriesScreenStyles.content}>
        <View style={observatoriesScreenStyles.mapContainer}>
          <MapView
            ref={mapRef}
            style={observatoriesScreenStyles.mapContainer.map}
            provider={Platform.OS === 'android' ? PROVIDER_GOOGLE : undefined}

            initialRegion={{
              latitude: 0,
              longitude: 0,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }}

            mapType="standard"
          >

          </MapView>
        </View>
      </View>
    </View>
  )
}

export default ObservatoriesScreen;