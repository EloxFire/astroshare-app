import { useMemo } from "react";
import Animated, { useAnimatedStyle, type SharedValue } from "react-native-reanimated";
import { app_colors } from "../../../helpers/variables";
import type { FieldOfView } from "../../../helpers/fieldSimulator/fieldOfView";

// FOV de référence (degrés verticaux) servant à calculer la taille de base du cadre, à l'échelle
// n'importe quelle valeur FIXE fonctionne (voir le commentaire sur `scale` plus bas) : doit juste
// rester cohérente entre le calcul de la taille de base et celui du facteur d'échelle en direct.
const BASELINE_FOV_DEG = 75;

interface FieldOfViewOverlayProps {
  fieldOfView: FieldOfView | null;
  cameraFovDeg: SharedValue<number>;
  viewportWidth: number;
  viewportHeight: number;
}

/**
 * Cadre de champ (simulateur de champ, phase additionnelle) : cercle (oculaire) ou rectangle
 * (capteur caméra) centré à l'écran, à l'échelle réelle du cadrage courant — grossit/rétrécit avec
 * le zoom (pinch) exactement comme le reste du ciel. Toujours centré sur l'écran (pas sur un point du
 * ciel) : c'est la direction de visée courante qui sert de "viseur", pas un objet précis.
 *
 * Taille de base calculée UNE FOIS (à `BASELINE_FOV_DEG`) via un `useMemo` React classique — ne
 * change que quand l'utilisateur choisit un autre matériel, pas à chaque frame — puis mise à
 * l'échelle en direct via un simple `transform: scale` piloté par une SharedValue (`cameraFovDeg`,
 * écrite à 60 fps par la boucle RAF) : un `transform` est pur GPU (pas de recalcul de mise en page à
 * chaque frame de zoom), contrairement à animer `width`/`height` directement.
 */
const FieldOfViewOverlay = ({ fieldOfView, cameraFovDeg, viewportWidth, viewportHeight }: FieldOfViewOverlayProps) => {
  const base = useMemo(() => {
    if (!fieldOfView) return null;
    const pxPerDeg = viewportHeight / BASELINE_FOV_DEG;
    const width = fieldOfView.shape === "circle" ? fieldOfView.diameterDegrees * pxPerDeg : fieldOfView.widthDegrees * pxPerDeg;
    const height = fieldOfView.shape === "circle" ? width : fieldOfView.heightDegrees * pxPerDeg;
    return { width, height, borderRadius: fieldOfView.shape === "circle" ? width / 2 : 10 };
  }, [fieldOfView, viewportHeight]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: BASELINE_FOV_DEG / Math.max(1, cameraFovDeg.value) }],
  }));

  if (!base) return null;

  return (
    <Animated.View
      pointerEvents="none"
      style={[
        {
          position: "absolute",
          left: viewportWidth / 2 - base.width / 2,
          top: viewportHeight / 2 - base.height / 2,
          width: base.width,
          height: base.height,
          borderRadius: base.borderRadius,
          borderWidth: 1.5,
          borderColor: app_colors.accent.main,
        },
        animatedStyle,
      ]}
    />
  );
};

export default FieldOfViewOverlay;
