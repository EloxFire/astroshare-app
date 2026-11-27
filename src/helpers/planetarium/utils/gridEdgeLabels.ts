import * as THREE from "three";
import { vec3ToRaDec } from "./coordinates";

export type GridEdgeLabel = { key: string; x: number; y: number; text: string };

// Marge (points logiques) depuis le bord de l'écran en-deçà de laquelle un point de grille sert
// d'ancrage d'étiquette — au-delà, le point est "trop au centre" pour servir de repère de bordure.
const EDGE_MARGIN = 18;

// Sous-échantillonnage des points de chaque ligne (128 points/cercle, voir GridLayer.drawCircle) :
// inutile de tous les tester pour un simple repère textuel, un point tous les ~17° suffit largement
// à détecter qu'une ligne traverse un bord.
const POINT_STRIDE = 6;

const normalizeDeg = (deg: number): number => ((deg % 360) + 360) % 360;

const formatParallel = (latDeg: number, isAzimuthal: boolean): string => {
  const rounded = Math.round(latDeg);
  // Grille équatoriale : déclinaison signée (+/-). Grille azimutale : altitude, déjà de signe
  // parlant (au-dessus/en-dessous de l'horizon), même convention adoptée.
  return isAzimuthal ? `${rounded}°` : `${rounded >= 0 ? "+" : ""}${rounded}°`;
};

const formatMeridian = (lonDeg: number, isAzimuthal: boolean): string => {
  if (isAzimuthal) return `${Math.round(normalizeDeg(lonDeg))}°`;
  // Ascension droite en heures sidérales (convention standard), pas en degrés — cohérent avec le
  // reste de l'app (ex. fiche objet).
  return `${Math.round(normalizeDeg(lonDeg) / 15)}h`;
};

// Étiquette de coordonnée en bordure d'écran pour une grille (équatoriale ou azimutale) : pour
// chaque ligne visible à l'écran, un seul point d'ancrage — le plus proche d'un bord du cadrage
// parmi un sous-échantillon de ses points. `isAzimuthal` choisit le format d'affichage (degrés plein
// cercle + altitude signée, vs heures sidérales + déclinaison signée).
//
// Les points de géométrie de chaque ligne sont dans le repère LOCAL du groupe (avant toute rotation
// — voir GridLayer.buildGrid, qui ne positionne jamais les `THREE.Line` eux-mêmes, seulement leur
// géométrie) : `vec3ToRaDec` s'y applique directement pour retrouver la vraie valeur (RA/Dec pour la
// grille équatoriale qui EST le repère monde, Az/Alt pour la grille azimutale construite avec la
// même convention). Seule la projection à l'écran a besoin du point MONDE (via `group.matrixWorld`,
// que l'appelant doit avoir rafraîchi avec `updateMatrixWorld()` cette frame).
export const getGridEdgeLabels = (
  group: THREE.Group,
  camera: THREE.PerspectiveCamera,
  width: number,
  height: number,
  isAzimuthal: boolean
): GridEdgeLabel[] => {
  if (!group.visible) return [];

  const labels: GridEdgeLabel[] = [];
  const worldPoint = new THREE.Vector3();

  group.children.forEach((child, lineIndex) => {
    if (!(child instanceof THREE.Line)) return;
    const position = child.geometry.getAttribute("position") as THREE.BufferAttribute | undefined;
    if (!position) return;

    let best: { x: number; y: number; edgeDist: number; lx: number; ly: number; lz: number } | null = null;

    for (let i = 0; i < position.count; i += POINT_STRIDE) {
      const lx = position.getX(i);
      const ly = position.getY(i);
      const lz = position.getZ(i);
      worldPoint.set(lx, ly, lz).applyMatrix4(group.matrixWorld);
      const ndc = worldPoint.project(camera);
      if (ndc.z > 1 || !Number.isFinite(ndc.x) || !Number.isFinite(ndc.y)) continue;

      const x = (ndc.x * 0.5 + 0.5) * width;
      const y = (1 - (ndc.y * 0.5 + 0.5)) * height;
      if (x < 0 || x > width || y < 0 || y > height) continue; // hors cadre : pas un bon ancrage

      const edgeDist = Math.min(x, width - x, y, height - y);
      if (edgeDist > EDGE_MARGIN) continue; // pas assez près d'un bord
      if (!best || edgeDist < best.edgeDist) best = { x, y, edgeDist, lx, ly, lz };
    }

    if (!best) return;
    const { ra: lonDeg, dec: latDeg } = vec3ToRaDec(new THREE.Vector3(best.lx, best.ly, best.lz));
    const text = child.userData.isParallel ? formatParallel(latDeg, isAzimuthal) : formatMeridian(lonDeg, isAzimuthal);
    labels.push({ key: `grid-${isAzimuthal ? "az" : "eq"}-${lineIndex}`, x: best.x, y: best.y, text });
  });

  return labels;
};
