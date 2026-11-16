import { useRef, useState } from "react";
import { PanResponder, Text, View, type LayoutChangeEvent } from "react-native";
import { useTranslation } from "react-i18next";
import { rangeBandGaugeStyles } from "./RangeBandGauge.styles";

interface RangeBandGaugeProps {
  value: number;
  scaleMin: number;
  scaleMax: number;
  idealRangeStart: number;
  idealRangeEnd: number;
  labels: [string, string, string];
  // Rend le repère déplaçable au doigt : appelé à chaque mouvement (pas seulement au relâché),
  // avec la valeur cible correspondante, pour un retour immédiat côté appelant.
  onChange?: (value: number) => void;
}

const toPercent = (value: number, min: number, max: number) =>
  Math.min(Math.max(((value - min) / (max - min)) * 100, 0), 100);

// Jauge générique à 3 zones (trop faible / idéale / trop forte) : une piste claire pleine largeur,
// une bande blanche arrondie pour la zone idéale, un repère sur la valeur actuelle. Réutilisée par
// les visualisations du grossissement et de l'échantillonnage — seules les bornes et les légendes
// changent d'un calcul à l'autre (voir components/calculations/visualizations).
const RangeBandGauge = ({ value, scaleMin, scaleMax, idealRangeStart, idealRangeEnd, labels, onChange }: RangeBandGaugeProps) => {
  const { t } = useTranslation("tools/astroCalculations");
  const [dragPercent, setDragPercent] = useState<number | null>(null);

  // Toujours tenue à jour à chaque rendu, et lue depuis les callbacks du PanResponder (créé une
  // seule fois via useRef, pour ne pas perdre le geste en cours) : sans ça, ces callbacks ne
  // verraient que `value`/`scaleMin`/`scaleMax` du tout premier rendu (fermeture figée).
  const liveRef = useRef({ value, scaleMin, scaleMax, onChange, dragPercent, trackWidth: 0, startPercent: 0 });
  liveRef.current.value = value;
  liveRef.current.scaleMin = scaleMin;
  liveRef.current.scaleMax = scaleMax;
  liveRef.current.onChange = onChange;
  liveRef.current.dragPercent = dragPercent;

  const handleTrackLayout = (event: LayoutChangeEvent) => {
    liveRef.current.trackWidth = event.nativeEvent.layout.width;
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => liveRef.current.onChange != null,
      onMoveShouldSetPanResponder: () => liveRef.current.onChange != null,
      onPanResponderGrant: () => {
        const { value: currentValue, scaleMin: min, scaleMax: max, dragPercent: current } = liveRef.current;
        liveRef.current.startPercent = current ?? toPercent(currentValue, min, max);
      },
      onPanResponderMove: (_event, gestureState) => {
        const { trackWidth, startPercent, scaleMin: min, scaleMax: max, onChange: change } = liveRef.current;
        if (!trackWidth) return;
        const newPercent = Math.min(Math.max(startPercent + (gestureState.dx / trackWidth) * 100, 0), 100);
        setDragPercent(newPercent);
        change?.(min + (newPercent / 100) * (max - min));
      },
      onPanResponderRelease: () => setDragPercent(null),
      onPanResponderTerminate: () => setDragPercent(null),
    })
  ).current;

  const idealStartPercent = toPercent(idealRangeStart, scaleMin, scaleMax);
  const idealEndPercent = toPercent(idealRangeEnd, scaleMin, scaleMax);
  // Pendant un geste, le repère suit le doigt (dragPercent) plutôt que `value` : `value` ne revient
  // de l'appelant qu'après un aller-retour (recalcul du champ lié, puis du résultat), plus lent que
  // le geste lui-même.
  const valuePercent = dragPercent ?? toPercent(value, scaleMin, scaleMax);

  return (
    <View style={rangeBandGaugeStyles.container}>
      <View style={rangeBandGaugeStyles.container.track} onLayout={handleTrackLayout}>
        <View
          style={[
            rangeBandGaugeStyles.container.track.ideal,
            { left: `${idealStartPercent}%`, width: `${idealEndPercent - idealStartPercent}%` },
          ]}
        />
        <View
          style={[rangeBandGaugeStyles.container.track.marker, { left: `${valuePercent}%` }]}
          hitSlop={{ top: 14, bottom: 14, left: 14, right: 14 }}
          {...panResponder.panHandlers}
        />
      </View>

      <View style={rangeBandGaugeStyles.container.labels}>
        {labels.map((label, index) => (
          <Text key={index} style={rangeBandGaugeStyles.container.labels.text}>{label}</Text>
        ))}
      </View>

      {onChange && <Text style={rangeBandGaugeStyles.container.sliderHint}>{t("visualizations.sliderHint")}</Text>}
    </View>
  );
};

export default RangeBandGauge;
