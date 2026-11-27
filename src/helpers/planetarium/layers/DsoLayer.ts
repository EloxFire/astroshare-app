import * as THREE from "three";
import { PixelRatio } from "react-native";
import { raDecToVec3 } from "../utils/coordinates";
import { LAYER_NAMES, RENDER_ORDER } from "../utils/renderOrders";
import type { CatalogObjectCategory, CatalogObjectSummary } from "../../../types/catalog/CatalogObject";

// Phase 4 du plan : objets du ciel profond en points colorés PAR CATÉGORIE (pas d'image réelle
// disponible, notamment pour les DSO — demande explicite de l'utilisateur) — couleur ET taille de
// base selon `category`, la magnitude ne joue que sur la luminosité/le seuil d'apparition au
// crépuscule (même mécanique que StarsLayer, voir son commentaire).
const CATEGORY_STYLE: Record<CatalogObjectCategory | "other", { color: [number, number, number]; baseSize: number }> = {
  // Galaxies : jaune-brun chaud (convention des atlas du ciel).
  galaxy: { color: [0.92, 0.82, 0.55], baseSize: 7 },
  // Nébuleuses : rose-rouge (émission), seule catégorie générique disponible côté catalogue.
  nebula: { color: [0.88, 0.35, 0.5], baseSize: 7 },
  // Amas (ouverts/globulaires confondus, catégorie générique) : cyan pâle.
  cluster: { color: [0.55, 0.85, 0.92], baseSize: 6 },
  // Étoile seule cataloguée en DSO (rare, ex. étoile double) ou catégorie non reconnue : neutre.
  star: { color: [0.85, 0.85, 0.85], baseSize: 4 },
  solar_system: { color: [0.85, 0.85, 0.85], baseSize: 4 },
  other: { color: [0.78, 0.78, 0.78], baseSize: 4 },
};

const styleForCategory = (category: CatalogObjectCategory | (string & {})): { color: [number, number, number]; baseSize: number } =>
  CATEGORY_STYLE[category as CatalogObjectCategory] ?? CATEGORY_STYLE.other;

// La sélection par appui (phase 5) ne raycaste pas ce nuage : elle recherche le point projeté à
// l'écran le plus proche du tap (voir selection/ObjectPicker.ts), d'où l'absence de callback `onTap`
// ici (même choix que StarsLayer).
export const createDsoLayer = (dsoObjects: CatalogObjectSummary[]): THREE.Points => {
  const count = dsoObjects.length;
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  const sizes = new Float32Array(count);
  const brightness = new Float32Array(count);
  const magnitudes = new Float32Array(count);
  const pixelRatio = PixelRatio.get();

  for (let i = 0; i < count; i++) {
    const dso = dsoObjects[i];
    const position = dso.position;
    if (!position) continue;
    const pos = raDecToVec3(position.ra, position.dec, 10);
    const i3 = i * 3;
    positions[i3] = pos.x;
    positions[i3 + 1] = pos.y;
    positions[i3 + 2] = pos.z;

    const style = styleForCategory(dso.category);
    colors[i3] = style.color[0];
    colors[i3 + 1] = style.color[1];
    colors[i3 + 2] = style.color[2];

    const mag = dso.magnitude ?? 10;
    sizes[i] = style.baseSize * pixelRatio;
    brightness[i] = THREE.MathUtils.clamp((10 - mag) / 10, 0.25, 1.0);
    magnitudes[i] = mag;
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute("aColor", new THREE.BufferAttribute(colors, 3));
  geometry.setAttribute("aSize", new THREE.BufferAttribute(sizes, 1));
  geometry.setAttribute("aBrightness", new THREE.BufferAttribute(brightness, 1));
  geometry.setAttribute("aMagnitude", new THREE.BufferAttribute(magnitudes, 1));

  const material = new THREE.ShaderMaterial({
    uniforms: {
      uSunAlt: { value: -100.0 },
      uFovScale: { value: 1.0 },
    },
    vertexShader: `
      attribute float aSize;
      attribute vec3  aColor;
      attribute float aBrightness;
      attribute float aMagnitude;
      varying   vec3  vColor;
      varying   float vBrightness;
      varying   float vMagnitude;
      uniform   float uFovScale;

      void main() {
        vColor      = aColor;
        vBrightness = aBrightness;
        vMagnitude  = aMagnitude;
        gl_PointSize = aSize * uFovScale;
        gl_Position  = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      precision mediump float;
      varying vec3  vColor;
      varying float vBrightness;
      varying float vMagnitude;
      uniform float uSunAlt;

      void main() {
        vec2  coord = gl_PointCoord - vec2(0.5);
        float d     = length(coord);
        float shape = exp(-d * d * 6.0);

        // Même seuil de crépuscule que les étoiles (voir StarsLayer) : les DSO les plus brillants
        // apparaissent dès le coucher, les plus faibles attendent le crépuscule astronomique.
        float relMag    = clamp((vMagnitude + 1.5) / 11.5, 0.0, 1.0);
        float threshold = -relMag * 8.5;
        float appear    = smoothstep(threshold + 1.5, threshold - 1.5, uSunAlt);

        float alpha = shape * appear * vBrightness;
        if (alpha < 0.02) discard;
        gl_FragColor = vec4(vColor, alpha);
      }
    `,
    depthWrite: false,
    depthTest: true,
    transparent: true,
  });

  const points = new THREE.Points(geometry, material);
  points.frustumCulled = false;
  points.renderOrder = RENDER_ORDER.dso;
  points.name = LAYER_NAMES.dso;

  return points;
};

export const updateDsoFovScale = (cloud: THREE.Points, currentFov: number, baseFov = 75): void => {
  const material = cloud.material as THREE.ShaderMaterial;
  if (material.uniforms?.uFovScale) material.uniforms.uFovScale.value = baseFov / Math.max(1, currentFov);
};

export const disposeDsoLayer = (points: THREE.Points): void => {
  points.geometry.dispose();
  (points.material as THREE.Material).dispose();
};
