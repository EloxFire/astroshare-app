import * as THREE from "three";
import { constellations } from "@observerly/astrometry";
import { raDecToVec3 } from "../utils/coordinates";
import { LAYER_NAMES, RENDER_ORDER } from "../utils/renderOrders";

const LINE_RADIUS = 9.7;

export type ConstellationLabelDefinition = { key: string; raDeg: number; decDeg: number; text: string };

// Centre "circulaire" (moyenne des vecteurs unitaires, pas une moyenne arithmétique) d'un ensemble
// d'ascensions droites — nécessaire pour la même raison que raDelta (moyenner 359° et 1° doit
// donner 0°, pas 180°).
const circularMeanRa = (raDegrees: number[]): number => {
  const toRad = Math.PI / 180;
  const sinSum = raDegrees.reduce((sum, ra) => sum + Math.sin(ra * toRad), 0);
  const cosSum = raDegrees.reduce((sum, ra) => sum + Math.cos(ra * toRad), 0);
  return ((Math.atan2(sinSum, cosSum) * 180) / Math.PI + 360) % 360;
};

// Lignes des 88 constellations IAU, directement depuis @observerly/astrometry (même source que
// SkyPreview, pas de jeu de données bundlé séparé à maintenir) : un `THREE.Line` par polyligne du
// MultiLineString de chaque constellation.
export const createConstellationLines = (): THREE.Group => {
  const group = new THREE.Group();
  const material = new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.3 });

  constellations.forEach((constellation) => {
    for (const feature of constellation.feature.features) {
      if (feature.geometry.type !== "MultiLineString") continue;
      for (const line of feature.geometry.coordinates as [number, number][][]) {
        const points = line
          .filter(([ra, dec]) => Number.isFinite(ra) && Number.isFinite(dec))
          .map(([ra, dec]) => raDecToVec3(ra, dec, LINE_RADIUS));
        if (points.length < 2) continue;
        group.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(points), material));
      }
    }
  });

  group.renderOrder = RENDER_ORDER.constellations;
  group.name = LAYER_NAMES.constellations;
  return group;
};

// Position (centre "circulaire" du tracé) de l'étiquette de chaque constellation — calculée une
// seule fois (ne dépend pas de la date/l'heure, contrairement à la boussole) : voir
// ExploreScreen pour la projection à l'écran et le filtrage par visibilité.
export const getConstellationLabelDefinitions = (): ConstellationLabelDefinition[] => {
  const labels: ConstellationLabelDefinition[] = [];

  constellations.forEach((constellation) => {
    const points: { ra: number; dec: number }[] = [];
    for (const feature of constellation.feature.features) {
      if (feature.geometry.type !== "MultiLineString") continue;
      for (const line of feature.geometry.coordinates as [number, number][][]) {
        for (const [ra, dec] of line) {
          if (Number.isFinite(ra) && Number.isFinite(dec)) points.push({ ra, dec });
        }
      }
    }
    if (points.length === 0) return;

    const raDeg = circularMeanRa(points.map((p) => p.ra));
    const decDeg = points.reduce((sum, p) => sum + p.dec, 0) / points.length;
    labels.push({ key: constellation.name, raDeg, decDeg, text: constellation.abbreviation });
  });

  return labels;
};
