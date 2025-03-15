import React, { useEffect, useState } from "react";
import { ActivityIndicator, Text, View } from "react-native";
import { globalStyles } from "../../styles/global";
import { SolarEclipse } from "../../helpers/types/eclipses/SolarEclipse";
import { solarEclipseDetailsStyles } from "../../styles/screens/transits/solarEclipseDetails";
import MapView, { Polygon, Polyline, PROVIDER_GOOGLE } from "react-native-maps";
import { mapStyle } from "../../helpers/mapJsonStyle";
import { astroshareApi } from "../../helpers/api";
import { useSettings } from "../../contexts/AppSettingsContext";
import {solarEclipseTypes, solarEclipseVisibilityLinesColors} from "../../helpers/constants";
import DSOValues from "../../components/commons/DSOValues";
import dayjs from "dayjs";

export default function SolarEclipseDetails({ navigation, route }: any) {
  const { currentUserLocation } = useSettings();
  const routeEclipse: SolarEclipse = route.params.eclipse;

  const [eclipse, setEclipse] = useState<SolarEclipse | null>(null);

  useEffect(() => {
    if (!routeEclipse.visibilityLines || !routeEclipse.visibilityLines.features) {
      getFullDataEclipse();
    } else {
      setEclipse(routeEclipse);
    }
  }, []);

  const getFullDataEclipse = async () => {
    const eclipse = await astroshareApi.get('/eclipses/solar', { params: { year: routeEclipse.calendarDate } });
    console.log(JSON.stringify(eclipse.data[0]));
    setEclipse(eclipse.data[0]);
  };

  const extractVisibilityLinesCoordinates = (geometry: number[][][]) => {
    return geometry.map((coordSet: number[][]) =>
      coordSet.map((coord: number[]) => ({
        latitude: coord[1], // Latitude est le deuxième élément
        longitude: coord[0], // Longitude est le premier élément
      }))
    );
  };

  const extractVisibilityPathsCoordinates = (geometry: { coordinates: [number, number, number][][] }) => {
    const polygonCoordinates: {latitude: number, longitude: number}[] = [];
    geometry.coordinates[0][0].map((coord: any) => {
      const coordSet: {latitude: number, longitude: number} = {
        latitude: coord[1], // Latitude est le deuxième élément
        longitude: coord[0], // Longitude est le premier élément
      }

      polygonCoordinates.push(coordSet);
    })
    return polygonCoordinates;
  };

  return (
    <View style={[globalStyles.body, { paddingHorizontal: 0, paddingTop: 0 }]}>
      {!eclipse ? (
        <View style={solarEclipseDetailsStyles.content.loadingScreen}>
          <ActivityIndicator size="large" color="white" />
          <Text style={solarEclipseDetailsStyles.content.loadingScreen.text}>Chargement des données de l'éclipse</Text>
        </View>
      ) : (
        <>
          <MapView
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
            {/* Tracé de la zone de pénombre */}
            {eclipse.visibilityPaths!.features.map((path: any, pathIndex: number) => {
              const coordinates = extractVisibilityPathsCoordinates(path.geometry);
                return (
                  <Polygon
                    key={`path-${pathIndex}`}
                    coordinates={coordinates}
                    strokeColor="#0000FF"
                    fillColor="rgba(0, 0, 0, 0.5)"
                  />
                );
            })}

            {/* Tracé des lignes de visibilité */}
            {eclipse.visibilityLines!.features.map((feature: any, featureIndex: number) =>
              extractVisibilityLinesCoordinates(feature.geometry.coordinates).map((coordSet: any, index: number) => (
                <Polyline
                  key={`line-${featureIndex}-${index}-${feature.properties.name}`}
                  coordinates={coordSet}
                  strokeColor={solarEclipseVisibilityLinesColors[feature.properties.name]}
                  strokeWidth={2}
                />
              ))
            )}
          </MapView>
          <View style={solarEclipseDetailsStyles.content.overlay}>
            <Text style={solarEclipseDetailsStyles.content.overlay.title}>{solarEclipseTypes[eclipse.type]} du {eclipse.calendarDate}</Text>
            <DSOValues title={"Début (UTC)"} value={dayjs(eclipse.events.P1?.date).format('HH:mm:ss').replace(':', 'h').replace(':', 'm') + 's'}/>
            <DSOValues title={"Maximum (UTC)"} value={dayjs(eclipse.events.greatest?.date).format('HH:mm:ss').replace(':', 'h').replace(':', 'm') + 's'}/>
            <DSOValues title={"Fin (UTC)"} value={dayjs(eclipse.events.P4?.date).format('HH:mm:ss').replace(':', 'h').replace(':', 'm') + 's'}/>
          </View>
        </>
      )}
    </View>
  );
}
