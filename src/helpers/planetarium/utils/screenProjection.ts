import type * as THREE from "three";
import { raDecToVec3 } from "./coordinates";

export type ScreenPoint = { x: number; y: number };

// Projette un point du ciel (RA/Dec) sur l'écran, en points LOGIQUES (pas pixels physiques — voir le
// commentaire sur glViewWidthLogicalRef dans ExploreScreen) — `null` s'il est derrière la caméra (pas
// la peine d'afficher une étiquette à cet endroit). Utilisé pour les étiquettes en recouvrement 2D
// (constellations, boussole) : la géométrie 3D (lignes, points) se projette toute seule via le
// rendu WebGL, seul le TEXTE (rendu en <Text> React Native, pas en mesh 3D — plus simple et net
// qu'un système de police bitmap) a besoin de cette projection manuelle.
export const projectRaDecToScreen = (
  camera: THREE.PerspectiveCamera,
  raDeg: number,
  decDeg: number,
  viewportWidth: number,
  viewportHeight: number
): ScreenPoint | null => {
  const world = raDecToVec3(raDeg, decDeg, 50);
  const ndc = world.project(camera);
  if (ndc.z > 1 || !Number.isFinite(ndc.x) || !Number.isFinite(ndc.y)) return null;

  const x = (ndc.x * 0.5 + 0.5) * viewportWidth;
  const y = (1 - (ndc.y * 0.5 + 0.5)) * viewportHeight;
  if (x < -40 || x > viewportWidth + 40 || y < -20 || y > viewportHeight + 20) return null;

  return { x, y };
};
