// LightPollutionMap.tsx
import React from 'react';
import { StyleSheet, View } from 'react-native';
import MapView, { UrlTile, PROVIDER_GOOGLE } from 'react-native-maps';

const LIGHT_POLLUTION_TILE_URL =
  'https://bucket.astroshare.fr/lightpollution/tiles/{z}/{x}/{y}.webp';

export const LightPollutionMap = () => {
  return (
    <View style={styles.container}>
      <MapView
        style={StyleSheet.absoluteFillObject}
        provider={PROVIDER_GOOGLE}
        initialRegion={{
          latitude: 0,
          longitude: 0,
          latitudeDelta: 120,
          longitudeDelta: 360,
        }}
        mapType="satellite" // ou "standard" / "hybrid" selon ton goût
      >
        <UrlTile
          urlTemplate={LIGHT_POLLUTION_TILE_URL}
          maximumZ={5}      // ton max = dernier dossier z (5 dans ton arbo)
          minimumZ={0}
          zIndex={10}       // devant le fond de carte
          opacity={0.6}     // à ajuster pour laisser voir le fond
          flipY={false}     // MapTiler génère du XYZ, donc pas besoin d’inverser
        />
      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default LightPollutionMap;