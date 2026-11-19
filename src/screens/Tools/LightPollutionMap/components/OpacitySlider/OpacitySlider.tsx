import { useMemo, useState } from "react";
import { PanResponder, View, type GestureResponderEvent } from "react-native";
import { opacitySliderStyles } from "./OpacitySlider.styles";

interface OpacitySliderProps {
  value: number; // 0 à 1
  onChange: (value: number) => void;
}

/**
 * <OpacitySlider value={tileOpacity} onChange={setTileOpacity} />
 *
 * Piste glissable 0-1, même technique qu'en Météo (WeatherRadarMap : PanResponder natif sur une
 * piste mesurée au onLayout, pas de librairie de slider dédiée dans le projet) — ici en continu
 * plutôt que calé sur des frames discrètes.
 */
const OpacitySlider = ({ value, onChange }: OpacitySliderProps) => {
  const [trackWidth, setTrackWidth] = useState(0);

  const scrubToValue = (x: number, width: number) => {
    if (width === 0) return;
    onChange(Math.min(Math.max(x / width, 0), 1));
  };

  const panResponder = useMemo(() => PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderGrant: (event: GestureResponderEvent) => scrubToValue(event.nativeEvent.locationX, trackWidth),
    onPanResponderMove: (event: GestureResponderEvent) => scrubToValue(event.nativeEvent.locationX, trackWidth),
  }), [trackWidth]);

  return (
    <View
      style={opacitySliderStyles.touchArea}
      onLayout={(event) => setTrackWidth(event.nativeEvent.layout.width)}
      {...panResponder.panHandlers}
    >
      <View style={opacitySliderStyles.track}>
        <View style={[opacitySliderStyles.track.fill, { width: `${value * 100}%` }]} />
      </View>
      <View style={[opacitySliderStyles.thumb, { left: `${value * 100}%` }]} />
    </View>
  );
};

export default OpacitySlider;
