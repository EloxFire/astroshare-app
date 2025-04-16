import React, { useEffect, useState } from "react";
import { View } from "react-native";
import { Svg, Circle, Line, Text as SvgText, Image } from "react-native-svg";
import { getPlanetaryPositions } from "@observerly/astrometry";
import { useSettings } from "../../contexts/AppSettingsContext";
import { useStarCatalog } from "../../contexts/StarsContext";
import { Star } from "../../helpers/types/Star";
import { constellationsAsterisms } from "../../helpers/scripts/astro/constellationsAsterisms";
import { app_colors } from "../../helpers/constants";
import { astroImages } from "../../helpers/scripts/loadImages";
import {convertDegreesRaToHMS} from "../../helpers/scripts/astro/coords/convertDegreesRaToHMS";
import {getObjectName} from "../../helpers/scripts/astro/objects/getObjectName";
import {GlobalPlanet} from "../../helpers/types/GlobalPlanet";
import planetariumImages from "../../helpers/planetarium_images.json";
import {getBrightStarName} from "../../helpers/scripts/astro/objects/getBrightStarName";

interface PlanetaryConjunctionMapProps {
  ra: number; // Ascension droite centrale
  dec: number; // Déclinaison centrale
  width: number; // Largeur de la carte
  height: number; // Hauteur de la carte
  conjunctionDate: Date; // Date de la conjonction
  targetNames: string[]; // Noms des astres en conjonction
}

export default function PlanetaryConjunctionMap({ra, dec, width, height, conjunctionDate, targetNames,}: PlanetaryConjunctionMapProps) {
  const { currentUserLocation } = useSettings();
  const { starsCatalog } = useStarCatalog();
  const [positions, setPositions] = useState<any[]>([]);

  useEffect(() => {
    if (currentUserLocation) {
      fetchPlanetaryPositions();
    }
  }, [currentUserLocation]);

  const fetchPlanetaryPositions = async () => {
    const allPositions = getPlanetaryPositions(conjunctionDate, {
      latitude: currentUserLocation.lat,
      longitude: currentUserLocation.lon,
    });
    const conjunctionTargets = allPositions.filter((planet: any) =>
      targetNames.includes(planet.name)
    );
    setPositions(conjunctionTargets);
  };

  const transformPoint = (x: number, y: number, angle: number) => {
    const cx = width / 2;
    const cy = height / 2;
    const mirroredY = height - y;
    const radians = (Math.PI / 180) * angle;
    const rotatedX = Math.cos(radians) * (x - cx) - Math.sin(radians) * (mirroredY - cy) + cx;
    const rotatedY = Math.sin(radians) * (x - cx) + Math.cos(radians) * (mirroredY - cy) + cy;

    return { x: rotatedX, y: rotatedY };
  };

  const getPosition = (starRa: number, starDec: number) => {
    const x = width / 2 + ((starRa - ra) * width) / 20;
    const y = height / 2 - ((starDec - dec) * height) / 20;
    return transformPoint(x, y, 194);
  };

  const adjustPositionWithinBounds = (x: number, y: number, margin = 20) => {
    let adjustedX = x;
    let adjustedY = y;

    if (x < margin) adjustedX = margin;
    if (x > width - margin) adjustedX = width - margin;
    if (y < margin) adjustedY = margin;
    if (y > height - margin) adjustedY = height - margin;

    return { x: adjustedX, y: adjustedY };
  };

  const generateEquatorialGrid = (ra: number, dec: number) => {
    const grid = {
      declinations: [] as { start: { ra: number; dec: number }; end: { ra: number; dec: number } }[],
      rightAscensions: [] as { start: { ra: number; dec: number }; end: { ra: number; dec: number } }[],
    };

    for (let d = -90; d <= 90; d += 10) {
      grid.declinations.push({
        start: { ra: ra - 180, dec: d },
        end: { ra: ra + 180, dec: d },
      });
    }

    for (let r = ra - 180; r <= ra + 180; r += 5) {
      grid.rightAscensions.push({
        start: { ra: r, dec: -90 },
        end: { ra: r, dec: 90 },
      });
    }

    return grid;
  };

  const preRenderMap = () => {
    const elements: JSX.Element[] = [];

    // 1. Dessiner la grille équatoriale
    const grid = generateEquatorialGrid(ra, dec);

    grid.declinations.forEach((line, index) => {
      const startCoords = getPosition(line.start.ra, line.start.dec);
      const endCoords = getPosition(line.end.ra, line.end.dec);

      elements.push(
        <Line
          key={`declination-${index}`}
          x1={startCoords.x}
          y1={startCoords.y}
          x2={endCoords.x}
          y2={endCoords.y}
          stroke={app_colors.white_sixty}
          strokeWidth="0.5"
          opacity={0.5}
        />
      );

      // Afficher les valeurs de déclinaison au bord gauche et droit
      // if (startCoords.x <= 0 || endCoords.x <= 0) {
      //   const y = startCoords.x <= 0 ? startCoords.y : endCoords.y;
      //   if (y >= 0 && y <= height) {
      //     elements.push(
      //       <SvgText
      //         key={`declination-value-left-${index}`}
      //         x={10}
      //         y={y}
      //         fill={app_colors.white}
      //         fontSize="8"
      //         textAnchor="start"
      //         opacity={0.8}
      //       >
      //         {line.start.dec}°
      //       </SvgText>
      //     );
      //   }
      // }
      //
      // if (startCoords.x >= width || endCoords.x >= width) {
      //   const y = startCoords.x >= width ? startCoords.y : endCoords.y;
      //   if (y >= 0 && y <= height) {
      //     elements.push(
      //       <SvgText
      //         key={`declination-value-right-${index}`}
      //         x={width - 10}
      //         y={y}
      //         fill={app_colors.white}
      //         fontSize="8"
      //         textAnchor="end"
      //         opacity={0.8}
      //       >
      //         {line.start.dec}°sss
      //       </SvgText>
      //     );
      //   }
      // }
    });

    grid.rightAscensions.forEach((line, index) => {
      const startCoords = getPosition(line.start.ra, line.start.dec);
      const endCoords = getPosition(line.end.ra, line.end.dec);

      elements.push(
        <Line
          key={`rightAscension-${index}`}
          x1={startCoords.x}
          y1={startCoords.y}
          x2={endCoords.x}
          y2={endCoords.y}
          stroke={app_colors.white_sixty}
          strokeWidth="0.5"
          opacity={0.5}
        />
      );

      // // Afficher les valeurs d'ascension droite en haut et en bas
      // if (startCoords.y <= 0 || endCoords.y <= 0) {
      //   const x = startCoords.y <= 0 ? startCoords.x : endCoords.x;
      //   if (x >= 0 && x <= width) {
      //     elements.push(
      //       <SvgText
      //         key={`rightAscension-value-top-${index}`}
      //         x={x}
      //         y={10}
      //         fill={app_colors.white}
      //         fontSize="8"
      //         textAnchor="middle"
      //         opacity={0.8}
      //       >
      //         {convertDegreesRaToHMS(line.start.ra).slice(3)}
      //       </SvgText>
      //     );
      //   }
      // }
      //
      // if (startCoords.y >= height || endCoords.y >= height) {
      //   const x = startCoords.y >= height ? startCoords.x : endCoords.x;
      //   if (x >= 0 && x <= width) {
      //     elements.push(
      //       <SvgText
      //         key={`rightAscension-value-bottom-${index}`}
      //         x={x}
      //         y={height - 10}
      //         fill={app_colors.white}
      //         fontSize="8"
      //         textAnchor="middle"
      //         opacity={0.8}
      //       >
      //         {convertDegreesRaToHMS(line.start.ra).slice(3)}
      //       </SvgText>
      //     );
      //   }
      // }
    });

    // 2. Dessiner les constellations
    constellationsAsterisms.forEach((constellation: any, constellationIndex: number) => {
      if (!constellation || !constellation.feature.features[0]) return;

      let visibleSegments = 0;
      let totalX = 0;
      let totalY = 0;

      constellation.feature.features[0].geometry.coordinates.forEach(
        (segment: any, segmentIndex: any) => {
          if (segment.length < 2) return;

          const start = segment[0];
          const end = segment[1];

          const startCoords = getPosition(start[0], start[1]);
          const endCoords = getPosition(end[0], end[1]);

          const isSegmentVisible =
            (startCoords.x >= 0 && startCoords.x <= width && startCoords.y >= 0 && startCoords.y <= height) ||
            (endCoords.x >= 0 && endCoords.x <= width && endCoords.y >= 0 && endCoords.y <= height);

          if (isSegmentVisible) {
            visibleSegments++;
            totalX += startCoords.x + endCoords.x;
            totalY += startCoords.y + endCoords.y;

            elements.push(
              <Line
                key={`constellation-${constellationIndex}-${segmentIndex}`}
                x1={startCoords.x}
                y1={startCoords.y}
                x2={endCoords.x}
                y2={endCoords.y}
                stroke={app_colors.red}
                strokeWidth="0.5"
                opacity={0.8}
              />
            );
          }
        }
      );

      if (visibleSegments > 0) {
        const centerX = totalX / (visibleSegments * 2);
        const centerY = totalY / (visibleSegments * 2);

        const { x: adjustedX, y: adjustedY } = adjustPositionWithinBounds(centerX, centerY);

        elements.push(
          <SvgText
            key={`constellation-name-${constellationIndex}`}
            x={adjustedX}
            y={adjustedY}
            fill={app_colors.white}
            fontSize="10"
            textAnchor="middle"
            opacity={0.8}
          >
            {constellation.name}
          </SvgText>
        );
      }
    });

    // 3. Dessiner les planètes et leurs noms
    positions.forEach((target, index) => {
      const { x, y } = getPosition(target.ra, target.dec);

      elements.push(
        <Image
          href={astroImages[target.name.toUpperCase()]}
          key={`planet-${index}`}
          x={x - 7.5}
          y={y - 7.5}
          width={15}
          height={15}
        />
      );

      const { x: textX, y: textY } = adjustPositionWithinBounds(x, y + 20);

      elements.push(
        <SvgText
          key={`name-planet-${target.name}`}
          x={textX}
          y={textY}
          fill={app_colors.white}
          fontSize="10"
          textAnchor="middle"
        >
          {getObjectName(target as GlobalPlanet, 'all', true)}
        </SvgText>
      );
    });

    // 4. Ajouter le nom des étoiles brillantes (mag < 2)
    starsCatalog.slice(0, 1000).forEach((star: Star, index: number) => {
      if (star.V < 3) {
        const { x, y } = getPosition(star.ra, star.dec);

        if (x >= 0 && x <= width && y >= 0 && y <= height) {
          elements.push(
            <SvgText
              key={`bright-star-name-${index}`}
              x={x}
              y={y - 10}
              fill={app_colors.white}
              fontSize="10"
              textAnchor="middle"
            >
              {getBrightStarName(star.ids)}
            </SvgText>
          );
        }
      }
    });

    return elements;
  };

  return (
    <View style={{ borderRadius: 10, overflow: "hidden", borderWidth: 1, borderColor: app_colors.white_twenty }}>
      <Svg width={width} height={height} style={{ backgroundColor: "black" }}>
        {starsCatalog.slice(0, 10000).map((star: Star, index: number) => {
          const { x, y } = getPosition(star.ra, star.dec);

          if (!isNaN(x) && !isNaN(y) && x >= 0 && x <= width && y >= 0 && y <= height) {
            return (
              <Circle
                key={`star-${index}`}
                cx={x}
                cy={y}
                r={Math.max(0.5, 6 - star.V)}
                fill="white"
                opacity={0.8}
              />
            );
          }

          return null;
        })}
        {preRenderMap()}
      </Svg>
    </View>
  );
}
