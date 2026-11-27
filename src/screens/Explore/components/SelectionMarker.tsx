import Animated, { useAnimatedStyle, type SharedValue } from "react-native-reanimated";
import { app_colors } from "../../../helpers/variables";

const SIZE = 34;

export type SelectionMarkerPoint = { x: number; y: number; visible: boolean };

/**
 * Anneau de sélection 2D positionné sur la projection écran de l'objet sélectionné — recalculé à
 * CHAQUE frame par ExploreScreen (voir sa boucle RAF), pas une géométrie 3D (ni billboard three.js) :
 * même choix d'architecture que PlanetariumLabelsOverlay, pour les mêmes raisons (plus simple, traits
 * toujours nets quel que soit le FOV).
 *
 * Position portée par une SharedValue Reanimated plutôt qu'un `useState` : à ce rythme (60 fois par
 * seconde dès qu'un objet est sélectionné, voir ExploreScreen), un `setState` React fait repasser par
 * le pont JS↔UI et la réconciliation à chaque frame — visible comme un repositionnement saccadé
 * (retour utilisateur). Écrire `.value` depuis la boucle RAF (thread JS, pas un worklet — une
 * affectation simple y est explicitement supportée par Reanimated) anime directement sur le thread UI.
 */
const SelectionMarker = ({ point }: { point: SharedValue<SelectionMarkerPoint> }) => {
  const style = useAnimatedStyle(() => ({
    opacity: point.value.visible ? 1 : 0,
    transform: [{ translateX: point.value.x - SIZE / 2 }, { translateY: point.value.y - SIZE / 2 }],
  }));

  return (
    <Animated.View
      pointerEvents="none"
      style={[
        {
          position: "absolute",
          width: SIZE,
          height: SIZE,
          borderRadius: SIZE / 2,
          borderWidth: 1.5,
          borderColor: app_colors.accent.main,
        },
        style,
      ]}
    />
  );
};

export default SelectionMarker;
