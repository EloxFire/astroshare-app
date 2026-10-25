import { forwardRef, useImperativeHandle } from "react";
import { View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from "react-native-reanimated";
import { zoomableImageStyles } from "./ZoomableImage.styles";

const MIN_ZOOM = 1;
const MAX_ZOOM = 5;

export interface ZoomableImageHandle {
  reset: () => void;
}

interface ZoomableImageProps {
  uri: string;
}

// Pinch-to-zoom + pan. Pensé pour être monté/démonté à chaque ouverture/fermeture d'un modal plein
// écran (voir FullscreenImageModal) plutôt que de persister : ça remet le zoom à 1x à chaque
// ouverture, sans logique de reset explicite au montage. Double-tap (ou reset() via la ref) pour
// revenir instantanément à 1x.
//
// Nécessite un <GestureHandlerRootView> englobant — react-native-gesture-handler ne traverse pas la
// hiérarchie native séparée d'un <Modal> RN ; FullscreenImageModal en fournit un dédié.
const ZoomableImage = forwardRef<ZoomableImageHandle, ZoomableImageProps>(({ uri }, ref) => {
  const scale = useSharedValue(1);
  const savedScale = useSharedValue(1);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const savedTranslateX = useSharedValue(0);
  const savedTranslateY = useSharedValue(0);

  const reset = () => {
    "worklet";
    scale.value = withSpring(MIN_ZOOM);
    translateX.value = withSpring(0);
    translateY.value = withSpring(0);
    savedScale.value = MIN_ZOOM;
    savedTranslateX.value = 0;
    savedTranslateY.value = 0;
  };

  useImperativeHandle(ref, () => ({ reset }));

  const pinchGesture = Gesture.Pinch()
    .onUpdate((event) => {
      scale.value = Math.min(Math.max(savedScale.value * event.scale, MIN_ZOOM), MAX_ZOOM);
    })
    .onEnd(() => {
      savedScale.value = scale.value;
      if (scale.value <= MIN_ZOOM) reset();
    });

  // N'autorise le déplacement que quand on est effectivement zoomé — sinon un simple glissement
  // sur l'image à 1x la ferait traîner pour rien.
  const panGesture = Gesture.Pan()
    .onUpdate((event) => {
      if (savedScale.value <= MIN_ZOOM) return;
      translateX.value = savedTranslateX.value + event.translationX;
      translateY.value = savedTranslateY.value + event.translationY;
    })
    .onEnd(() => {
      savedTranslateX.value = translateX.value;
      savedTranslateY.value = translateY.value;
    });

  const doubleTapGesture = Gesture.Tap()
    .numberOfTaps(2)
    .onEnd(() => reset());

  const composedGesture = Gesture.Race(doubleTapGesture, Gesture.Simultaneous(pinchGesture, panGesture));

  const animatedImageStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { scale: scale.value },
    ],
  }));

  return (
    <GestureDetector gesture={composedGesture}>
      <View style={zoomableImageStyles.imageWrapper}>
        <Animated.Image
          source={{ uri }}
          style={[zoomableImageStyles.image, animatedImageStyle]}
          resizeMode="contain"
        />
      </View>
    </GestureDetector>
  );
});

export default ZoomableImage;
