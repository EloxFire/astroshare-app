import { useState } from "react";
import { View, Text } from "react-native";
import { useTranslation } from "react-i18next";
import Svg, { Circle, Defs, Path, Pattern } from "react-native-svg";
import { satelliteGroundTrackMapStyles } from "./SatelliteGroundTrackMap.styles";
import { app_colors, withOpacity } from "../../../helpers/variables";
import { WORLD_LAND_PATH_D, WORLD_LAND_PATH_VIEWBOX } from "../../../helpers/satellites/worldLandPath";
import type { GroundTrackPoint } from "../../../helpers/satellites/propagation";

interface SatelliteGroundTrackMapProps {
  trackPoints: GroundTrackPoint[];
  currentPosition?: { latitude: number; longitude: number } | null;
  observer?: { latitude: number; longitude: number; label?: string } | null;
}

const { width: VB_WIDTH, height: VB_HEIGHT } = WORLD_LAND_PATH_VIEWBOX;

// Projection équirectangulaire — même formule que celle utilisée pour générer WORLD_LAND_PATH_D
// (voir ce fichier) : les deux doivent rester dans le même repère pour que la trace tombe au bon
// endroit par rapport aux continents.
const project = (latitude: number, longitude: number) => ({
  x: ((longitude + 180) / 360) * VB_WIDTH,
  y: ((90 - latitude) / 180) * VB_HEIGHT,
});

// Découpe les points en tronçons continus, en coupant quand la longitude "saute" (passage de la
// ligne de changement de date à ±180°) : sans ça, une trace qui franchit l'antiméridien tracerait
// un trait horizontal parasite sur toute la largeur de la carte au lieu de sortir d'un bord et
// rentrer par l'autre.
const buildRuns = (points: GroundTrackPoint[]): { x: number; y: number }[][] => {
  const runs: { x: number; y: number }[][] = [];
  let current: { x: number; y: number }[] = [];

  points.forEach((point, index) => {
    const projected = project(point.latitude, point.longitude);
    const previous = points[index - 1];
    const wraps = previous && Math.abs(point.longitude - previous.longitude) > 180;
    if (wraps && current.length > 0) {
      runs.push(current);
      current = [];
    }
    current.push(projected);
  });
  if (current.length > 0) runs.push(current);
  return runs;
};

const pathFromRun = (run: { x: number; y: number }[]): string =>
  "M" + run.map(({ x, y }, i) => (i === 0 ? `${x},${y}` : `L${x},${y}`)).join(" ");

const DOT_PATTERN_SIZE = 7;

/**
 * <SatelliteGroundTrackMap trackPoints={points} currentPosition={{latitude, longitude}} observer={location} />
 *
 * Carte du monde stylisée (continents en pointillés, projection équirectangulaire) avec la trace au
 * sol d'un satellite : tronçon passé en pointillés, tronçon à venir en trait plein, repère de
 * l'observateur et position actuelle. Fond sombre dédié — voir SatelliteGroundTrackMap.styles.ts.
 */
const SatelliteGroundTrackMap = ({ trackPoints, currentPosition, observer }: SatelliteGroundTrackMapProps) => {
  const { t } = useTranslation("tools/satelliteTracker");
  const [width, setWidth] = useState(0);
  const height = width / (VB_WIDTH / VB_HEIGHT);

  const pastRuns = buildRuns(trackPoints.filter((p) => p.relative === "past"));
  // Le dernier point "passé" est repris en tête du futur, pour que les deux tronçons se rejoignent
  // visuellement sans trou à l'instant présent.
  const lastPast = trackPoints.filter((p) => p.relative === "past").slice(-1);
  const futureRuns = buildRuns([...lastPast, ...trackPoints.filter((p) => p.relative === "future")]);

  const current = currentPosition ? project(currentPosition.latitude, currentPosition.longitude) : null;
  const observerPoint = observer ? project(observer.latitude, observer.longitude) : null;

  return (
    <View style={satelliteGroundTrackMapStyles.container}>
      <View style={satelliteGroundTrackMapStyles.map} onLayout={(e) => setWidth(e.nativeEvent.layout.width)}>
        {width > 0 && (
          <Svg width={width} height={height} viewBox={`0 0 ${VB_WIDTH} ${VB_HEIGHT}`}>
            <Defs>
              <Pattern id="landDots" width={DOT_PATTERN_SIZE} height={DOT_PATTERN_SIZE} patternUnits="userSpaceOnUse">
                <Circle cx={1.1} cy={1.1} r={1.1} fill={withOpacity(app_colors.white, 0.35)} />
              </Pattern>
            </Defs>

            <Path d={WORLD_LAND_PATH_D} fill="url(#landDots)" stroke="none" />

            {pastRuns.map((run, index) => (
              <Path
                key={`past-${index}`}
                d={pathFromRun(run)}
                fill="none"
                stroke={withOpacity(app_colors.white, 0.55)}
                strokeWidth={2}
                strokeDasharray="4,5"
                strokeLinecap="round"
              />
            ))}

            {futureRuns.map((run, index) => (
              <Path
                key={`future-${index}`}
                d={pathFromRun(run)}
                fill="none"
                stroke={app_colors.yellow.main}
                strokeWidth={2.5}
                strokeLinecap="round"
              />
            ))}

            {observerPoint && (
              <Circle cx={observerPoint.x} cy={observerPoint.y} r={5} fill={app_colors.accent.main} stroke={app_colors.white} strokeWidth={1.5} />
            )}

            {current && (
              <>
                <Circle cx={current.x} cy={current.y} r={9} fill={withOpacity(app_colors.yellow.main, 0.25)} />
                <Circle cx={current.x} cy={current.y} r={4.5} fill={app_colors.yellow.main} stroke={app_colors.primary.main} strokeWidth={1.5} />
              </>
            )}
          </Svg>
        )}
      </View>

      <View style={satelliteGroundTrackMapStyles.legend}>
        <View style={satelliteGroundTrackMapStyles.legend.item}>
          <View style={[satelliteGroundTrackMapStyles.legend.item.swatch, { backgroundColor: withOpacity(app_colors.white, 0.55) }]} />
          <Text style={satelliteGroundTrackMapStyles.legend.item.label}>{t("groundTrack.past")}</Text>
        </View>
        <View style={satelliteGroundTrackMapStyles.legend.item}>
          <View style={[satelliteGroundTrackMapStyles.legend.item.swatch, { backgroundColor: app_colors.yellow.main }]} />
          <Text style={satelliteGroundTrackMapStyles.legend.item.label}>{t("groundTrack.future")}</Text>
        </View>
      </View>
    </View>
  );
};

export default SatelliteGroundTrackMap;
