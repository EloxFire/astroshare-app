import { Marker, MapMarkerProps } from "react-native-maps";
import { View } from "react-native";
import { mapTargetMarkerStyles } from "./MapTargetMarker.styles";

interface MapTargetMarkerProps extends Omit<MapMarkerProps, "children"> {
  coordinate: { latitude: number; longitude: number };
  title?: string;
}

const MapTargetMarker = ({ coordinate, title, ...markerProps }: MapTargetMarkerProps) => {
  return (
    <Marker coordinate={coordinate} title={title} {...markerProps}>
      <View style={mapTargetMarkerStyles.outer}>
        <View style={mapTargetMarkerStyles.inner} />
      </View>
    </Marker>
  )
}

export default MapTargetMarker;
