import { useEffect, useRef } from "react";
import { Animated, Easing } from "react-native";
import { Circle, Defs, RadialGradient, Stop, Svg } from "react-native-svg";
import { app_colors } from "../../../../../helpers/variables";

export type SolarEclipseVariant = "partial" | "annular" | "total";
export type LunarEclipseVariant = "penumbral" | "partial" | "total";

interface EclipseTypeIconProps {
  kind: "solar" | "lunar";
  variant: SolarEclipseVariant | LunarEclipseVariant;
  size?: number;
}

// Même technique que le halo de pulsation de SatelliteGroundTrackMap : Animated (RN core, pas
// reanimated) piloté en JS (useNativeDriver: false), seule option pour animer des attributs SVG
// (rayon/opacité) plutôt qu'un style de View.
const AnimatedCircle = Animated.createAnimatedComponent(Circle);
const BREATH_DURATION_MS = 2200;

/**
 * Pictogramme Soleil/Lune "dessiné" par type d'éclipse — même langage visuel que l'outil web
 * astroshare-public-tools (EclipseTypeIcon.css), porté en react-native-svg : disque orangé mordu
 * d'un disque sombre (solaire partielle), disque sombre cerclé d'un fin anneau orangé (annulaire),
 * disque sombre avec un halo orangé diffus (totale) ; disque pâle teinté par un dégradé gris
 * (lunaire pénombrale/partielle) ou entièrement cuivré ("Lune de sang", lunaire totale). Soleil en
 * `app_colors.sun.main` plutôt que `yellow.main` : plus orangé, meilleur contraste sur fond clair.
 *
 * Chaque variante respire doucement (une seule valeur Animated par icône, assez légère pour tourner
 * dans une liste type EclipseRow) : un détail différent par type, pour suggérer sans surjouer le
 * phénomène propre à chacun (anneau de feu qui scintille, couronne/lueur qui pulse, disque qui
 * dérive légèrement comme en transit...).
 */
const EclipseTypeIcon = ({ kind, variant, size = 32 }: EclipseTypeIconProps) => {
  const center = size / 2;
  const radius = size / 2 - 2;
  const gradientId = `eclipse-type-icon-${kind}-${variant}`;

  const breath = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(breath, { toValue: 1, duration: BREATH_DURATION_MS, easing: Easing.inOut(Easing.sin), useNativeDriver: false }),
        Animated.timing(breath, { toValue: 0, duration: BREATH_DURATION_MS, easing: Easing.inOut(Easing.sin), useNativeDriver: false }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [breath]);

  if (kind === "solar") {
    if (variant === "annular") {
      // L'anneau de feu scintille : fin trait qui s'épaissit/s'éclaircit très légèrement.
      const ringWidth = breath.interpolate({ inputRange: [0, 1], outputRange: [1.6, 2.6] });
      const ringOpacity = breath.interpolate({ inputRange: [0, 1], outputRange: [0.75, 1] });
      return (
        <Svg width={size} height={size}>
          <Circle cx={center} cy={center} r={radius} fill={app_colors.primary.main} />
          <AnimatedCircle cx={center} cy={center} r={radius} fill="none" stroke={app_colors.sun.main} strokeWidth={ringWidth} strokeOpacity={ringOpacity} />
        </Svg>
      );
    }

    if (variant === "total") {
      // La couronne respire : un halo supplémentaire, sous le dégradé fixe, gonfle et s'estompe.
      const haloRadius = breath.interpolate({ inputRange: [0, 1], outputRange: [radius * 1.05, radius * 1.22] });
      const haloOpacity = breath.interpolate({ inputRange: [0, 1], outputRange: [0.4, 0.12] });
      return (
        <Svg width={size} height={size}>
          <Defs>
            <RadialGradient id={gradientId} cx="50%" cy="50%" r="65%">
              <Stop offset="60%" stopColor={app_colors.sun.main} stopOpacity={0.55} />
              <Stop offset="100%" stopColor={app_colors.sun.main} stopOpacity={0} />
            </RadialGradient>
          </Defs>
          <AnimatedCircle cx={center} cy={center} r={haloRadius} fill={app_colors.sun.main} fillOpacity={haloOpacity} />
          <Circle cx={center} cy={center} r={radius} fill={`url(#${gradientId})`} />
          <Circle cx={center} cy={center} r={radius * 0.72} fill={app_colors.primary.main} />
        </Svg>
      );
    }

    // "partial" : disque orangé mordu par un disque sombre décalé — ni la taille apparente du Soleil
    // ni celle de la Lune ne sont ici réduites l'une par rapport à l'autre (presque identiques
    // depuis la Terre), seul le décalage change. Le disque sombre dérive très légèrement, pour
    // suggérer le transit sans donner l'impression d'une donnée qui change.
    const moonDrift = breath.interpolate({ inputRange: [0, 1], outputRange: [0, radius * 0.06] });
    return (
      <Svg width={size} height={size}>
        <Circle cx={center} cy={center} r={radius} fill={app_colors.sun.main} />
        <AnimatedCircle cx={Animated.add(center - radius * 0.55, moonDrift)} cy={center - radius * 0.2} r={radius} fill={app_colors.primary.main} />
      </Svg>
    );
  }

  if (variant === "total") {
    // "Lune de sang" : une lueur cuivrée pulse doucement sous le disque, comme la lumière rasante de
    // l'atmosphère terrestre qui le teinte.
    const glowRadius = breath.interpolate({ inputRange: [0, 1], outputRange: [radius * 1.05, radius * 1.2] });
    const glowOpacity = breath.interpolate({ inputRange: [0, 1], outputRange: [0.35, 0.1] });
    return (
      <Svg width={size} height={size}>
        <Defs>
          <RadialGradient id={gradientId} cx="34%" cy="32%" r="75%">
            <Stop offset="0%" stopColor="#c9573a" />
            <Stop offset="100%" stopColor="#8a2a1c" />
          </RadialGradient>
        </Defs>
        <AnimatedCircle cx={center} cy={center} r={glowRadius} fill="#c9573a" fillOpacity={glowOpacity} />
        <Circle cx={center} cy={center} r={radius} fill={`url(#${gradientId})`} />
      </Svg>
    );
  }

  if (variant === "partial") {
    // La morsure sombre pulse très légèrement, pour suggérer l'ombre de la Terre qui progresse.
    const biteOpacity = breath.interpolate({ inputRange: [0, 1], outputRange: [0.85, 1] });
    return (
      <Svg width={size} height={size}>
        <Defs>
          <RadialGradient id={gradientId} cx="32%" cy="32%" r="70%">
            <Stop offset="0%" stopColor="#8899aa" stopOpacity={0.9} />
            <Stop offset="100%" stopColor="#d9d9de" />
          </RadialGradient>
        </Defs>
        <Circle cx={center} cy={center} r={radius} fill={`url(#${gradientId})`} />
        <AnimatedCircle cx={center - radius * 0.3} cy={center - radius * 0.1} r={radius * 0.55} fill="#a8402c" fillOpacity={biteOpacity} />
      </Svg>
    );
  }

  // "penumbral" : assombrissement doux, sans bord net, pas de teinte rouge (la Lune ne traverse que
  // la pénombre, pas l'ombre propre de la Terre) — l'animation reste à peine perceptible, cohérent
  // avec la discrétion du phénomène lui-même.
  const penumbraOpacity = breath.interpolate({ inputRange: [0, 1], outputRange: [1, 0.88] });
  return (
    <Svg width={size} height={size}>
      <Defs>
        <RadialGradient id={gradientId} cx="32%" cy="32%" r="80%">
          <Stop offset="38%" stopColor="#d9d9de" />
          <Stop offset="100%" stopColor="#8899aa" />
        </RadialGradient>
      </Defs>
      <AnimatedCircle cx={center} cy={center} r={radius} fill={`url(#${gradientId})`} fillOpacity={penumbraOpacity} />
    </Svg>
  );
};

export default EclipseTypeIcon;
