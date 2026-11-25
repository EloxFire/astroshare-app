import { forwardRef, type ReactNode } from "react";
import { View } from "react-native";
import MapView, { PROVIDER_GOOGLE, Polygon, Polyline, type MapPressEvent, type Region } from "react-native-maps";
import { DARK_MAP_STYLE } from "../../../../../helpers/map/darkMapStyle";
import { hexToRgb } from "../../../../../helpers/variables";
import { firstPolygonOuterRing, multiLineStringToPolylines, multiPolygonToPolygons, type LatLng } from "../../../../../helpers/eclipses/geojson";
import type { EclipseVisibilityLines, EclipseVisibilityPaths } from "../../../../../types/eclipses/Eclipse";
import { eclipseVisibilityMapStyles } from "./EclipseVisibilityMap.styles";

// Englobe le monde entier (±180° de longitude, Web Mercator ne va pas au-delà de ±85° de latitude)
// — anneau extérieur des masques "assombrir tout sauf..." ci-dessous.
const WORLD_BOUNDS: LatLng[] = [
  { latitude: -85, longitude: -180 },
  { latitude: -85, longitude: 180 },
  { latitude: 85, longitude: 180 },
  { latitude: 85, longitude: -180 },
];

export type EclipseLineStyle = { color: string; dashed?: boolean };
export type EclipsePathStyle = { fillColor: string; fillOpacity: number; strokeColor?: string; strokeWidth?: number };

interface EclipseVisibilityMapProps {
  visibilityLines?: EclipseVisibilityLines;
  visibilityPaths?: EclipseVisibilityPaths;
  lineStyles: Record<string, EclipseLineStyle>;
  pathStyles: Record<string, EclipsePathStyle>;
  // Noms de features de `visibilityPaths` à utiliser comme "trou" d'un masque sombre couvrant le
  // reste du monde — un masque par nom (superposés, pas fusionnés) : pour le solaire, une seule
  // entrée ("penumbra") ; pour le lunaire, deux ("beginPenumbralEclipse"/"endPenumbralEclipse"),
  // dont le recouvrement forme naturellement le dégradé à 3 niveaux (visible en entier/partiellement
  // /pas du tout), même technique que astroshare-public-tools (addition d'opacité, pas de découpe
  // de polygones).
  maskHoleFeatureNames?: string[];
  // Opacité du masque sombre (0-1) — assez faible pour que le fond de carte (déjà sombre,
  // DARK_MAP_STYLE) reste lisible dessous : un premier essai à 0.35 rendait la zone non visible
  // presque entièrement noire une fois empilé sur ce fond déjà sombre (retour utilisateur).
  maskOpacity?: number;
  initialRegion: Region;
  onPress?: (coordinate: LatLng) => void;
  children?: ReactNode;
}

/**
 * Carte de visibilité partagée solaire/lunaire : même style de fond que LightPollutionMapScreen
 * (pas de rendu "pixelisé" maison, demande explicite), lignes/bandes de visibilité tracées depuis le
 * GeoJSON renvoyé par l'API (voir geojson.ts). Stylée par nom de feature plutôt que codée en dur,
 * pour rester le même composant des deux côtés (solaire/lunaire) — seules les tables de styles
 * passées en props diffèrent.
 */
const EclipseVisibilityMap = forwardRef<MapView, EclipseVisibilityMapProps>(
  ({ visibilityLines, visibilityPaths, lineStyles, pathStyles, maskHoleFeatureNames, maskOpacity = 0.18, initialRegion, onPress, children }, ref) => {
    const handlePress = (event: MapPressEvent) => onPress?.(event.nativeEvent.coordinate);
    const maskFillColor = `rgba(0, 0, 0, ${maskOpacity})`;

    return (
      <View style={eclipseVisibilityMapStyles.container}>
        <MapView
          ref={ref}
          style={eclipseVisibilityMapStyles.map}
          provider={PROVIDER_GOOGLE}
          mapType="standard"
          customMapStyle={DARK_MAP_STYLE}
          initialRegion={initialRegion}
          rotateEnabled={false}
          pitchEnabled={false}
          onPress={handlePress}
        >
          {maskHoleFeatureNames?.map((name) => {
            const feature = visibilityPaths?.features.find((candidate) => candidate.properties?.name === name);
            const hole = feature ? firstPolygonOuterRing(feature.geometry) : null;
            if (!hole) return null;
            return (
              <Polygon
                key={`mask-${name}`}
                coordinates={WORLD_BOUNDS}
                holes={[hole]}
                fillColor={maskFillColor}
                strokeColor="transparent"
                tappable={false}
              />
            );
          })}

          {visibilityPaths?.features.map((feature) => {
            const style = pathStyles[feature.properties?.name ?? ""];
            if (!style) return null;
            // `<Polygon>` de react-native-maps n'a pas de prop `fillOpacity` séparée (seulement
            // `fillColor`, voir MapPolygon.types.d.ts) — sans cette conversion, `style.fillOpacity`
            // était silencieusement ignoré et chaque bande (pénombre/ombre) s'affichait en couleur
            // PLEINE OPACITÉ, masquant entièrement la carte en dessous (retour utilisateur : "la zone
            // de visibilité est toujours opaque").
            const [r, g, b] = hexToRgb(style.fillColor);
            const fillColor = `rgba(${r}, ${g}, ${b}, ${style.fillOpacity})`;
            return multiPolygonToPolygons(feature.geometry).map(({ outer, holes }, index) => (
              <Polygon
                key={`path-${feature.properties.name}-${index}`}
                coordinates={outer}
                holes={holes}
                fillColor={fillColor}
                strokeColor={style.strokeColor ?? "transparent"}
                strokeWidth={style.strokeWidth ?? 0}
              />
            ));
          })}

          {visibilityLines?.features.map((feature) => {
            const style = lineStyles[feature.properties.name];
            if (!style) return null;
            return multiLineStringToPolylines(feature.geometry).map((coordinates, index) => (
              <Polyline
                key={`line-${feature.properties.name}-${index}`}
                coordinates={coordinates}
                strokeColor={style.color}
                strokeWidth={feature.properties.name === "central" || feature.properties.name === "maximumEclipse" ? 2 : 1.5}
                lineDashPattern={style.dashed ? [5, 5] : undefined}
              />
            ));
          })}

          {children}
        </MapView>
      </View>
    );
  }
);

export default EclipseVisibilityMap;
