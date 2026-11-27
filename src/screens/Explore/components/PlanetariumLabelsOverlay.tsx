import { memo } from "react";
import { Text, View } from "react-native";
import { app_colors, withOpacity } from "../../../helpers/variables";

export type PlanetariumLabelVariant = "constellation" | "compass" | "solarSystem" | "eqGridCoordinate" | "azGridCoordinate";

export type PlanetariumOverlayLabel = {
  key: string;
  x: number;
  y: number;
  text: string;
  variant: PlanetariumLabelVariant;
};

// Couleur des étiquettes de coordonnées alignée sur celle de leur grille (voir GridLayer : 0x4a90d9
// bleu pour l'équatoriale, 0x9d6ad9 violet pour l'azimutale) — association visuelle directe entre un
// repère et son chiffre, sans avoir besoin d'une légende séparée.
const VARIANT_STYLES: Record<PlanetariumLabelVariant, { fontSize: number; color: string; fontFamily: string; width: number }> = {
  constellation: { fontSize: 10, color: withOpacity(app_colors.white, 0.5), fontFamily: "DMMonoRegular", width: 60 },
  compass: { fontSize: 13, color: app_colors.white, fontFamily: "ZTNatureBold", width: 60 },
  solarSystem: { fontSize: 10.5, color: withOpacity(app_colors.white, 0.85), fontFamily: "DMMonoRegular", width: 60 },
  eqGridCoordinate: { fontSize: 9.5, color: "#8fc1f0", fontFamily: "DMMonoRegular", width: 36 },
  azGridCoordinate: { fontSize: 9.5, color: "#cda8f0", fontFamily: "DMMonoRegular", width: 36 },
};

/**
 * Recouvrement 2D (par-dessus la GLView) pour tout texte du planétarium — étiquettes de
 * constellations, points cardinaux, noms Soleil/Lune/planètes, coordonnées de grille en bordure
 * d'écran. Volontairement du texte React Native normal plutôt qu'un système de police bitmap en mesh
 * 3D (plus simple, plus net, réutilise les polices déjà chargées par l'app) : la contrepartie est que
 * la position (x,y) de chaque étiquette doit être recalculée à la main (voir utils/screenProjection.ts
 * et utils/gridEdgeLabels.ts) à chaque fois que la caméra bouge, ce que fait l'écran appelant à un
 * rythme limité (pas à 60 fps, un repositionnement de texte n'a pas besoin d'autant de fluidité qu'un
 * rendu 3D).
 */
const PlanetariumLabelsOverlay = ({ labels }: { labels: PlanetariumOverlayLabel[] }) => (
  <View style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }} pointerEvents="none">
    {labels.map((label) => {
      const variantStyle = VARIANT_STYLES[label.variant];
      return (
        <Text
          key={label.key}
          style={[
            { position: "absolute", left: label.x - variantStyle.width / 2, top: label.y - 7, width: variantStyle.width, textAlign: "center" as const },
            variantStyle,
          ]}
          numberOfLines={1}
        >
          {label.text}
        </Text>
      );
    })}
  </View>
);

export default memo(PlanetariumLabelsOverlay);
