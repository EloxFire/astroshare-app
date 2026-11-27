import * as THREE from "three";
import { convertHorizontalToEquatorial, type GeographicCoordinate } from "@observerly/astrometry";
import { raDecToVec3 } from "../utils/coordinates";
import { LAYER_NAMES, RENDER_ORDER } from "../utils/renderOrders";

const GRID_RADIUS = 1.4;
const GRID_STEP_RAD = Math.PI / 18; // 10°

// Dessine un cercle (méridien ou parallèle) par rotation d'un vecteur "rayon" autour d'un axe —
// matrice de rotation de Rodrigues à la main (pas de dépendance à l'objet Euler/Quaternion de
// three.js ici, juste des points à calculer une fois).
const drawCircle = (radius: THREE.Vector3, position: THREE.Vector3, rotationAxis: THREE.Vector3, material: THREE.Material): THREE.Line => {
  const axis = rotationAxis.clone().normalize();
  const points: THREE.Vector3[] = [];

  for (let angle = 0; angle <= Math.PI * 2; angle += Math.PI / 64) {
    const c = Math.cos(angle);
    const s = Math.sin(angle);
    const { x, y, z } = axis;
    const m = [
      [x * x * (1 - c) + c, x * y * (1 - c) - z * s, x * z * (1 - c) + y * s],
      [x * y * (1 - c) + z * s, y * y * (1 - c) + c, y * z * (1 - c) - x * s],
      [x * z * (1 - c) - y * s, y * z * (1 - c) + x * s, z * z * (1 - c) + c],
    ];
    points.push(
      new THREE.Vector3(
        m[0][0] * radius.x + m[0][1] * radius.y + m[0][2] * radius.z + position.x,
        m[1][0] * radius.x + m[1][1] * radius.y + m[1][2] * radius.z + position.y,
        m[2][0] * radius.x + m[2][1] * radius.y + m[2][2] * radius.z + position.z
      )
    );
  }

  return new THREE.Line(new THREE.BufferGeometry().setFromPoints(points), material);
};

// Grille construite dans un repère "de référence" (pôle = Z, méridien de référence = X) — pour la
// grille équatoriale, ce repère EST le repère monde (pas de réorientation nécessaire). Pour la
// grille azimutale (voir orientAzGridToHorizon), le même repère sert de modèle local, réorienté en
// tournant tout le groupe (pas en recalculant les points).
const buildGrid = (color: number): THREE.Group => {
  const group = new THREE.Group();
  const material = new THREE.LineBasicMaterial({ color, transparent: true, opacity: 0.3 });

  // `isParallel` sur chaque ligne (voir utils/gridEdgeLabels.ts) : une fois projetée à l'écran, une
  // ligne de parallèle (lat constante) s'étiquette avec sa latitude, une ligne de méridien avec la
  // longitude DU POINT choisi comme ancrage (les points d'un même "méridien" tel que construit ici
  // n'ont pas tous la même longitude — c'est un cercle complet passant par les 2 pôles, qui couvre en
  // fait deux longitudes antipodales sur ses deux moitiés).
  for (let lat = -Math.PI / 2 + GRID_STEP_RAD; lat < Math.PI / 2; lat += GRID_STEP_RAD) {
    const line = drawCircle(
      new THREE.Vector3(GRID_RADIUS * Math.cos(lat), 0, 0),
      new THREE.Vector3(0, 0, GRID_RADIUS * Math.sin(lat)),
      new THREE.Vector3(0, 0, 1),
      material
    );
    line.userData.isParallel = true;
    group.add(line);
  }

  for (let lon = -Math.PI / 2; lon < Math.PI / 2; lon += GRID_STEP_RAD) {
    const line = drawCircle(
      new THREE.Vector3(0, 0, GRID_RADIUS),
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(Math.cos(lon), Math.sin(lon), 0),
      material
    );
    line.userData.isParallel = false;
    group.add(line);
  }

  return group;
};

export type GridLayerResult = { eqGrid: THREE.Group; azGrid: THREE.Group };

export const createGridLayer = (): GridLayerResult => {
  const eqGrid = buildGrid(0x4a90d9);
  eqGrid.renderOrder = RENDER_ORDER.eqGrid;
  eqGrid.name = LAYER_NAMES.eqGrid;
  eqGrid.visible = false;

  const azGrid = buildGrid(0x9d6ad9);
  azGrid.renderOrder = RENDER_ORDER.azGrid;
  azGrid.name = LAYER_NAMES.azGrid;
  azGrid.visible = false;

  return { eqGrid, azGrid };
};

// Réoriente la grille azimutale vers l'horizon réel : on ne recalcule PAS sa géométrie (fixe, voir
// buildGrid), on tourne le groupe entier pour que son "pôle" coïncide avec le zénith local et son
// "méridien de référence" avec le nord — à rappeler à chaque fois que le temps/lieu changent (même
// endroit que orientGroundToHorizon dans la boucle de rendu).
export const orientAzGridToHorizon = (azGrid: THREE.Group, observer: GeographicCoordinate, date: Date): void => {
  const zenithEq = convertHorizontalToEquatorial(date, observer, { alt: 90, az: 0 });
  const northEq = convertHorizontalToEquatorial(date, observer, { alt: 0, az: 0 });
  const zenithVec = raDecToVec3(zenithEq.ra, zenithEq.dec, 5);
  const northVec = raDecToVec3(northEq.ra, northEq.dec, 5).normalize();

  azGrid.up.copy(northVec);
  azGrid.lookAt(zenithVec);
};
