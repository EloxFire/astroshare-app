import React, { useMemo } from "react";
import { Dimensions, View } from "react-native";
import { Circle, G, Polygon, Polyline, Rect, Svg, Text as SvgText } from "react-native-svg";
import { getConstellation } from "@observerly/astrometry";
import { constellationsAsterisms } from "../../helpers/scripts/astro/constellationsAsterisms";
import { useStarCatalog } from "../../contexts/StarsContext";
import { Star } from "../../helpers/types/Star";
import { app_colors } from "../../helpers/constants";

type ProjectedPoint = { x: number; y: number };

type ConstellationObjectMapProps = {
  ra: number;
  dec: number;
  objectName: string;
  constellationAbbreviation?: string;
  size?: number;
};

const MAP_PADDING = 8;
const MAX_STARS = 40;

const toRadians = (value: number) => (value * Math.PI) / 180;

const shortestAngleDiff = (value: number, center: number) => {
  let diff = value - center;
  while (diff <= -180) diff += 360;
  while (diff > 180) diff -= 360;
  return diff;
};

const magnitudeToRadius = (magnitude: number) => {
  if (Number.isNaN(magnitude)) return 1;
  return Math.max(0.8, 3.2 - magnitude * 0.45);
};

export default function ConstellationObjectMap({
  ra,
  dec,
  objectName,
  constellationAbbreviation,
  size
}: ConstellationObjectMapProps) {
  const { starsCatalog, starCatalogLoading } = useStarCatalog();
  const screenWidth = Dimensions.get("window").width;
  const mapSize = size ?? Math.max(screenWidth - 24, 240);

  const targetConstellation = useMemo(() => {
    const guessed = getConstellation({ ra, dec });
    const abbr = constellationAbbreviation || guessed?.abbreviation;

    if (!abbr) return null;

    return (
      constellationsAsterisms.find(
        (constellation: any) =>
          constellation?.abbreviation?.toLowerCase() === abbr.toLowerCase()
      ) || null
    );
  }, [ra, dec, constellationAbbreviation]);

  const mapGeometry = useMemo(() => {
    if (!targetConstellation) return null;

    const features = targetConstellation.feature?.features ?? [];
    const pathFeature = features.find(
      (feature: any) => feature?.geometry?.type === "MultiLineString"
    );
    const boundaryFeature = features.find(
      (feature: any) => feature?.geometry?.type === "Polygon"
    );
    const centrum = pathFeature?.properties?.centrum;
    const segments: number[][][] = pathFeature?.geometry?.coordinates ?? [];
    const boundaryCoordinates: number[][] = boundaryFeature?.geometry?.coordinates?.[0] ?? [];

    if (!centrum || boundaryCoordinates.length === 0) return null;

    const centerRa = centrum.ra;
    const centerDec = centrum.dec;
    const cosCenterDec = Math.cos(toRadians(centerDec));

    const project = (pointRa: number, pointDec: number): ProjectedPoint => {
      const deltaRa = shortestAngleDiff(pointRa, centerRa);
      return {
        // Flip RA to match sky orientation (east left, west right)
        x: -deltaRa * cosCenterDec,
        y: pointDec - centerDec
      };
    };

    const projectedBoundary = boundaryCoordinates.map(([pointRa, pointDec]) =>
      project(pointRa, pointDec)
    );
    const projectedSegments = segments.map((segment) =>
      segment.map(([pointRa, pointDec]) => project(pointRa, pointDec))
    );

    const boundaryPointsForBounds =
      projectedBoundary.length > 0 ? projectedBoundary : [project(centrum.ra, centrum.dec)];
    const allPoints = [...boundaryPointsForBounds, ...projectedSegments.flat(), { x: 0, y: 0 }];

    const xs = allPoints.map((point) => point.x);
    const ys = allPoints.map((point) => point.y);
    const minX = Math.min(...xs);
    const maxX = Math.max(...xs);
    const minY = Math.min(...ys);
    const maxY = Math.max(...ys);
    const extent = Math.max(maxX - minX, maxY - minY, 1);
    const centerX = (maxX + minX) / 2;
    const centerY = (maxY + minY) / 2;
    const paddedExtent = Math.max(extent * 1.05, 1);
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
    const segmentPaths = projectedSegments.map((segment) => segment.map(toViewSpace));

    return {
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
  }, [targetConstellation, mapSize]);

  const starsOnMap = useMemo(() => {
    if (!mapGeometry || !targetConstellation) return [];
    if (!starsCatalog || starsCatalog.length === 0) return [];

    const eligibleStars = starsCatalog.filter((star: Star) => {
      if (typeof star.V !== "number") return false;
      return star.V <= 4;
    });

    const points = [];
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
      points.push({
        id: star.ids,
        x: viewPoint.x,
        y: viewPoint.y,
        radius: magnitudeToRadius(star.V),
        color: app_colors.white,
      });

      if (points.length >= MAX_STARS) break;
    }

    return points;
  }, [mapGeometry, targetConstellation, starsCatalog]);

  const objectPoint = useMemo(() => {
    if (!mapGeometry) return null;
    return mapGeometry.toViewSpace(mapGeometry.project(ra, dec));
  }, [mapGeometry, ra, dec]);

  return (
    <View style={{ width: "100%", borderRadius: 10, overflow: "hidden", borderWidth: 1, borderColor: app_colors.white_twenty }}>
      <Svg width="100%" height={mapSize} viewBox={`0 0 ${mapSize} ${mapSize}`} style={{ backgroundColor: app_colors.black }}>
        <Rect x={0} y={0} width={mapSize} height={mapSize} fill={app_colors.black} />

        {mapGeometry ? (
          <G>
            <Polygon
              points={mapGeometry.boundaryPath.map((point) => `${point.x},${point.y}`).join(" ")}
              fill={app_colors.black_skymap}
              stroke={app_colors.white_twenty}
              strokeWidth={1}
            />

            {mapGeometry.segmentPaths.map((segment, index) => {
              if (segment.length < 2) return null;
              return (
                <Polyline
                  key={`segment-${index}`}
                  points={segment.map((point) => `${point.x},${point.y}`).join(" ")}
                  stroke={app_colors.white_sixty}
                  strokeWidth={1}
                  fill="none"
                  opacity={0.9}
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
                  stroke={app_colors.white_twenty}
                  strokeWidth={0.4}
                  opacity={0.9}
                />
              </G>
            ))}

            {objectPoint && (
              <G>
                <Circle cx={objectPoint.x} cy={objectPoint.y} r={5} fill={app_colors.red} opacity={0.9} />
                <Circle cx={objectPoint.x} cy={objectPoint.y} r={9} stroke={app_colors.red_twenty} strokeWidth={1.5} fill="none" />
                <SvgText
                  x={objectPoint.x}
                  y={objectPoint.y - 12}
                  fill={app_colors.white}
                  fontSize={10}
                  fontWeight="600"
                  textAnchor="middle"
                >
                  {objectName}
                </SvgText>
              </G>
            )}

            {targetConstellation?.name && (
              <SvgText
                x={mapSize / 2}
                y={MAP_PADDING + 12}
                fill={app_colors.white}
                fontSize={12}
                fontWeight="600"
                textAnchor="middle"
                opacity={0.8}
              >
                {targetConstellation.name.toUpperCase()}
              </SvgText>
            )}
          </G>
        ) : (
          <SvgText
            x={mapSize / 2}
            y={mapSize / 2}
            fill={app_colors.white}
            fontSize={12}
            textAnchor="middle"
          >
            {starCatalogLoading ? "Chargement de la carte..." : "Constellation indisponible"}
          </SvgText>
        )}
      </Svg>
    </View>
  );
}
