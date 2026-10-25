import { StyleProp, ViewStyle } from "react-native";
import { useVideoPlayer, VideoView } from "expo-video";

interface SunAnimationPlayerProps {
  uri: string;
  style?: StyleProp<ViewStyle>;
}

// Composant à part car useVideoPlayer est un hook : il ne doit être monté que lorsque l'animation
// est effectivement affichée, pas à chaque rendu de l'écran parent — même principe que
// ApodVideoPlayer dans ApodScreen.tsx. Boucle et muet (contrairement à Apod, qui a du son) : ces
// animations sont pensées comme une version "vivante" d'une image statique, pas un média à écouter.
const SunAnimationPlayer = ({ uri, style }: SunAnimationPlayerProps) => {
  const player = useVideoPlayer(uri, (player) => {
    player.loop = true;
    player.muted = true;
    player.play();
  });

  return <VideoView player={player} style={style} nativeControls={false} contentFit="cover" />;
};

export default SunAnimationPlayer;
