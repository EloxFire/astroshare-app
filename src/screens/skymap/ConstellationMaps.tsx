import React, { useMemo, useState } from "react";
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { Polygon, Polyline, Rect, Svg, Text as SvgText, Circle, G } from "react-native-svg";
import { constellations } from "@observerly/astrometry";
import PageTitle from "../../components/commons/PageTitle";
import { i18n } from "../../helpers/scripts/i18n";
import { globalStyles } from "../../styles/global";
import { useStarCatalog } from "../../contexts/StarsContext";
import { Star } from "../../helpers/types/Star";

const MAP_PADDING = 24;
const MAX_STARS = 400;
const STAR_LABEL_MAG_LIMIT = 3.8;
const BACKGROUND_COLOR = "#f4f0cc";
const BOUNDARY_FILL = "#e7dfb4";
const BOUNDARY_STROKE = "#4a4633";
const ASTERISM_STROKE = "#2a2620";
const CONSTELLATION_LABEL_COLOR = "#5f1c16";

const CONSTELLATION_NAMES = Array.from(constellations.keys()).sort((a, b) =>
  a.localeCompare(b)
);

type ProjectedPoint = { x: number; y: number };
type MapStarPoint = {
  id: string;
  x: number;
  y: number;
  radius: number;
  color: string;
  label?: string;
};

const spectralTypeColors: Record<string, string> = {
  O: "#99ccff",
  B: "#98c5ff",
  A: "#d0ddff",
  F: "#ffe8b5",
  G: "#ffd27f",
  K: "#ffad66",
  M: "#ff6b5a"
};

const getStarColorFromSpectralType = (spectralType?: string) => {
  if (!spectralType) return "#ffffff";
  const type = spectralType.trim().charAt(0).toUpperCase();
  return spectralTypeColors[type] ?? "#ffffff";
};

const getStarLabel = (ids: string) => {
  if (!ids) return "";
  const parts = ids
    .split("|")
    .map((part) => part.trim())
    .filter(Boolean);

  const properName = parts.find((part) => part.startsWith("NAME "));
  if (properName) {
    return properName.replace("NAME ", "");
  }

  const bayer = parts.find((part) => /^[a-z]{1,3}\s/i.test(part));
  if (bayer) return bayer;

  const flamsteed = parts.find((part) => /^\d+\s/.test(part));
  if (flamsteed) return flamsteed;

  const hip = parts.find((part) => part.startsWith("HIP "));
  if (hip) return hip;

  return parts[0] ?? "";
};

const magnitudeToRadius = (magnitude: number) => {
  if (Number.isNaN(magnitude)) return 1.2;
  return Math.max(1, 4.4 - magnitude * 0.6);
};

const toRadians = (value: number) => (value * Math.PI) / 180;

const shortestAngleDiff = (value: number, center: number) => {
  let diff = value - center;
  while (diff <= -180) diff += 360;
  while (diff > 180) diff -= 360;
  return diff;
};

export default function ConstellationMaps({ navigation }: any) {
  const { starsCatalog, starCatalogLoading } = useStarCatalog();
  const [selectedConstellationName, setSelectedConstellationName] = useState<string>(
    CONSTELLATION_NAMES[0] ?? ""
  );

  const screenWidth = Dimensions.get("window").width;
  const mapSize = Math.min(screenWidth - 40, 360);

  const selectedConstellation = useMemo(() => {
    if (!selectedConstellationName) return null;
    return constellations.get(selectedConstellationName) ?? null;
  }, [selectedConstellationName]);

  const mapGeometry = useMemo(() => {
    if (!selectedConstellation) return null;

    const features = selectedConstellation.feature?.features ?? [];
    const pathFeature = features.find((feature: any) => feature?.geometry?.type === "MultiLineString");
    const boundaryFeature = features.find((feature: any) => feature?.geometry?.type === "Polygon");
    const centrum = pathFeature?.properties?.centrum;
    const segments: number[][][] = pathFeature?.geometry?.coordinates ?? [];
    const boundaryCoordinates: number[][] = boundaryFeature?.geometry?.coordinates?.[0] ?? [];

    if (!centrum || boundaryCoordinates.length === 0) return null;

    const centerRa = centrum.ra;
    const centerDec = centrum.dec;
    const cosCenterDec = Math.cos(toRadians(centerDec));

    const project = (ra: number, dec: number): ProjectedPoint => {
      const deltaRa = shortestAngleDiff(ra, centerRa);
      return {
        x: deltaRa * cosCenterDec,
        y: dec - centerDec
      };
    };

    const projectedBoundary = boundaryCoordinates.map(([ra, dec]) => project(ra, dec));
    const projectedSegments = segments.map((segment) =>
      segment.map(([ra, dec]) => project(ra, dec))
    );

    const boundaryPointsForBounds = projectedBoundary.length > 0 ? projectedBoundary : [project(centrum.ra, centrum.dec)];
    const allPoints = [
      ...boundaryPointsForBounds,
      ...projectedSegments.flat(),
      { x: 0, y: 0 }
    ];

    const xs = allPoints.map((point) => point.x);
    const ys = allPoints.map((point) => point.y);
    const minX = Math.min(...xs);
    const maxX = Math.max(...xs);
    const minY = Math.min(...ys);
    const maxY = Math.max(...ys);
    const extent = Math.max(maxX - minX, maxY - minY, 1);
    const centerX = (maxX + minX) / 2;
    const centerY = (maxY + minY) / 2;
    const paddedExtent = extent * 1.4;
    const normalizedMinX = centerX - paddedExtent / 2;
    const normalizedMinY = centerY - paddedExtent / 2;
    const viewSize = mapSize - 2 * MAP_PADDING;

    const toViewSpace = (point: ProjectedPoint): ProjectedPoint => {
      const normalizedX = (point.x - normalizedMinX) / paddedExtent;
      const normalizedY = (point.y - normalizedMinY) / paddedExtent;

      return {
        x: MAP_PADDING + normalizedX * viewSize,
        y: MAP_PADDING + (1 - normalizedY) * viewSize
      };
    };

    const boundaryPath = projectedBoundary.map(toViewSpace);
    const segmentPaths = projectedSegments.map((segment) =>
      segment.map(toViewSpace)
    );

    return {
      centerRa,
      centerDec,
      projectedBoundary,
      boundaryPath,
      segmentPaths,
      project,
      toViewSpace,
      viewBounds: {
        minX: normalizedMinX,
        maxX: normalizedMinX + paddedExtent,
        minY: normalizedMinY,
        maxY: normalizedMinY + paddedExtent
      }
    };
  }, [selectedConstellation, mapSize]);

  const starsOnMap = useMemo((): MapStarPoint[] => {
    if (!mapGeometry || !selectedConstellation) return [];
    if (!starsCatalog || starsCatalog.length === 0) return [];

    const eligibleStars = starsCatalog.filter((star: Star) => {
      if (typeof star.V !== "number") return false;
      // Keep bright stars for readability
      return star.V <= 6.5;
    });

    const points: MapStarPoint[] = [];
    for (const star of eligibleStars) {
      const projected = mapGeometry.project(star.ra, star.dec);
      if (
        projected.x < mapGeometry.viewBounds.minX ||
        projected.x > mapGeometry.viewBounds.maxX ||
        projected.y < mapGeometry.viewBounds.minY ||
        projected.y > mapGeometry.viewBounds.maxY
      ) {
        continue;
      }
      const viewPoint = mapGeometry.toViewSpace(projected);
      const radius = magnitudeToRadius(star.V);
      const labelCandidate =
        star.V <= STAR_LABEL_MAG_LIMIT ? getStarLabel(star.ids) : "";
      points.push({
        id: star.ids,
        x: viewPoint.x,
        y: viewPoint.y,
        radius,
        color: getStarColorFromSpectralType(star.sp_type),
        label: labelCandidate || undefined
      });
      if (points.length >= MAX_STARS) break;
    }

    return points;
  }, [mapGeometry, selectedConstellation, starsCatalog]);

  const meaning = selectedConstellation?.meaning ?? "";

  return (
    <View style={globalStyles.body}>
      <PageTitle
        navigation={navigation}
        title={i18n.t("skymap.buttons.constellations.title")}
        subtitle={i18n.t("skymap.buttons.constellations.subtitle")}
      />
      <View style={globalStyles.screens.separator} />

      <ScrollView>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.selectorContainer}
          contentContainerStyle={styles.selectorContent}
        >
          {CONSTELLATION_NAMES.map((name) => {
            const isActive = selectedConstellationName === name;
            return (
              <TouchableOpacity
                key={name}
                onPress={() => setSelectedConstellationName(name)}
                style={[
                  styles.selectorChip,
                  isActive ? styles.selectorChipActive : null
                ]}
              >
                <Text
                  style={[
                    styles.selectorText,
                    isActive ? styles.selectorTextActive : null
                  ]}
                >
                  {name}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        <View style={styles.mapContainer}>
          <Svg width={mapSize} height={mapSize}>
            <Rect
              x={0}
              y={0}
              width={mapSize}
              height={mapSize}
              fill={BACKGROUND_COLOR}
              stroke={BOUNDARY_STROKE}
              strokeWidth={1}
              rx={12}
            />
            {mapGeometry ? (
              <G>
                <Polygon
                  points={mapGeometry.boundaryPath
                    .map((point) => `${point.x},${point.y}`)
                    .join(" ")}
                  fill={BOUNDARY_FILL}
                  stroke={BOUNDARY_STROKE}
                  strokeWidth={1}
                />
                {mapGeometry.segmentPaths.map((segment, index) => {
                  if (segment.length < 2) return null;
                  return (
                    <Polyline
                      key={`segment-${index}`}
                      points={segment
                        .map((point) => `${point.x},${point.y}`)
                        .join(" ")}
                      stroke={ASTERISM_STROKE}
                      strokeWidth={1.2}
                      fill="none"
                    />
                  );
                })}
                {starsOnMap.map((star) => (
                  <G key={star.id}>
                    <Circle
                      cx={star.x}
                      cy={star.y}
                      r={star.radius}
                      fill={star.color}
                      stroke="#221e18"
                      strokeWidth={star.radius > 2.4 ? 0.4 : 0.2}
                      opacity={0.95}
                    />
                    {star.label && (
                      <SvgText
                        x={star.x + star.radius + 4}
                        y={star.y + 3}
                        fill="#2f2619"
                        fontSize={9}
                        fontWeight="500"
                      >
                        {star.label}
                      </SvgText>
                    )}
                  </G>
                ))}
                <SvgText
                  x={mapSize / 2}
                  y={MAP_PADDING - 6}
                  fill={CONSTELLATION_LABEL_COLOR}
                  fontSize={16}
                  fontWeight="600"
                  textAnchor="middle"
                >
                  {selectedConstellation?.name?.toUpperCase()}
                </SvgText>
                {meaning && (
                  <SvgText
                    x={mapSize / 2}
                    y={MAP_PADDING + 12}
                    fill={CONSTELLATION_LABEL_COLOR}
                    fontSize={10}
                    textAnchor="middle"
                  >
                    {meaning}
                  </SvgText>
                )}
              </G>
            ) : (
              <SvgText
                x={mapSize / 2}
                y={mapSize / 2}
                fill={BOUNDARY_STROKE}
                fontSize={12}
                textAnchor="middle"
              >
                {starCatalogLoading
                  ? i18n.t("skymap.flatmap.mapLoading")
                  : i18n.t("skymap.flatmap.constellations")}
              </SvgText>
            )}
          </Svg>
        </View>

        {!!meaning && (
          <Text style={styles.meaningText}>
            {meaning}
          </Text>
        )}

        {starCatalogLoading && (
          <Text style={styles.loadingText}>
            {i18n.t("skymap.flatmap.mapLoading")}
          </Text>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  selectorContainer: {
    marginTop: 12
  },
  selectorContent: {
    paddingHorizontal: 4,
    paddingBottom: 4
  },
  selectorChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: BOUNDARY_STROKE,
    marginHorizontal: 4,
    marginBottom: 6,
    backgroundColor: "#efe6b5"
  },
  selectorChipActive: {
    backgroundColor: BOUNDARY_STROKE,
    borderColor: BOUNDARY_STROKE
  },
  selectorText: {
    color: BOUNDARY_STROKE,
    fontSize: 12
  },
  selectorTextActive: {
    color: BACKGROUND_COLOR,
    fontWeight: "600"
  },
  mapContainer: {
    marginTop: 16,
    alignItems: "center"
  },
  meaningText: {
    marginHorizontal: 20,
    marginTop: 16,
    color: CONSTELLATION_LABEL_COLOR,
    fontSize: 14,
    textAlign: "center"
  },
  loadingText: {
    marginTop: 16,
    textAlign: "center",
    color: BOUNDARY_STROKE
  }
});
