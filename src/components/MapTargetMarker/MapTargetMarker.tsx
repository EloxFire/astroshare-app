import { Marker, MapMarkerProps } from "react-native-maps";
import { View } from "react-native";
import { app_colors, withOpacity } from "../../helpers/variables";
import { mapTargetMarkerStyles } from "./MapTargetMarker.styles";

interface MapTargetMarkerProps extends Omit<MapMarkerProps, "children"> {
  coordinate: { latitude: number; longitude: number };
  title?: string;
  // Jaune par défaut (voir les styles). Permet par exemple de colorer le marqueur selon l'échelle
  // de Bortle (app_colors.bortleScale) sur la carte de pollution lumineuse.
  color?: string;
}

const MapTargetMarker = ({ coordinate, title, color = app_colors.yellow.main, ...markerProps }: MapTargetMarkerProps) => {
  return (
    <Marker coordinate={coordinate} title={title} {...markerProps}>
      <View style={[mapTargetMarkerStyles.outer, { backgroundColor: withOpacity(color, 0.25) }]}>
        <View style={[mapTargetMarkerStyles.inner, { backgroundColor: color }]} />
      </View>
    </Marker>
  )
}

export default MapTargetMarker;
