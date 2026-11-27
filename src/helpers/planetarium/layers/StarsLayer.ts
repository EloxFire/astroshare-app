import * as THREE from "three";
import { PixelRatio } from "react-native";
import { raDecToVec3 } from "../utils/coordinates";
import { LAYER_NAMES, RENDER_ORDER } from "../utils/renderOrders";
import type { CatalogObjectSummary } from "../../../types/catalog/CatalogObject";

// Construit (ou reconstruit) le nuage de points des étoiles à partir d'une page du catalogue — pas
// de couleur par type spectral pour l'instant (CatalogObjectStarDetails n'est pas encore typé côté
// API, voir types/catalog/CatalogObject.ts), toutes blanches, seules taille/luminosité varient selon
// la magnitude. La sélection par appui (phase 5) ne raycaste pas ce nuage : elle recherche le point
// projeté à l'écran le plus proche du tap (voir selection/ObjectPicker.ts), d'où l'absence de
// callback `onTap` ici.
export const createStarsLayer = (stars: CatalogObjectSummary[]): THREE.Points => {
  const count = stars.length;
  const positions = new Float32Array(count * 3);
  const sizes = new Float32Array(count);
  const brightness = new Float32Array(count);
  const magnitudes = new Float32Array(count);
  const pixelRatio = PixelRatio.get();

  for (let i = 0; i < count; i++) {
    const star = stars[i];
    const position = star.position;
    if (!position) continue;
    const pos = raDecToVec3(position.ra, position.dec, 10);
    const i3 = i * 3;
    positions[i3] = pos.x;
    positions[i3 + 1] = pos.y;
    positions[i3 + 2] = pos.z;

    const mag = star.magnitude ?? 6;
    sizes[i] = Math.max(1.5, (6.5 - mag) * 2.8) * pixelRatio;
    brightness[i] = THREE.MathUtils.clamp((6.5 - mag) / 6.5, 0.05, 1.0);
    magnitudes[i] = mag;
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute("aSize", new THREE.BufferAttribute(sizes, 1));
  geometry.setAttribute("aBrightness", new THREE.BufferAttribute(brightness, 1));
  geometry.setAttribute("aMagnitude", new THREE.BufferAttribute(magnitudes, 1));

  const material = new THREE.ShaderMaterial({
    uniforms: {
      // Altitude du Soleil en degrés : > 0 plein jour (étoiles cachées), -10 toutes visibles, -100
      // "toujours visibles" (utilisé tant que l'atmosphère n'a pas encore tourné une frame).
      uSunAlt: { value: -100.0 },
      uFovScale: { value: 1.0 },
    },
    vertexShader: `
      attribute float aSize;
      attribute float aBrightness;
      attribute float aMagnitude;
      varying   float vBrightness;
      varying   float vMagnitude;
      uniform   float uFovScale;

      void main() {
        vBrightness = aBrightness;
        vMagnitude  = aMagnitude;
        gl_PointSize = aSize * uFovScale;
        gl_Position  = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      precision mediump float;
      varying   float vBrightness;
      varying   float vMagnitude;
      uniform   float uSunAlt;

      void main() {
        vec2  coord = gl_PointCoord - vec2(0.5);
        float d     = length(coord);

        // Disque d'Airy net (cœur) + léger halo de diffraction.
        float core  = exp(-d * d * 40.0);
        float halo  = exp(-d * d * 9.0) * 0.12;
        float shape = core + halo;

        // Seuil de crépuscule propre à chaque étoile (plus brillant = apparaît plus tôt) : Sirius
        // (-1.5) dès le coucher, la limite (6.5) pleinement visible à -10°.
        float relMag    = clamp((vMagnitude + 1.5) / 8.0, 0.0, 1.0);
        float threshold = -relMag * 8.5;
        float appear    = smoothstep(threshold + 1.5, threshold - 1.5, uSunAlt);

        float alpha = shape * appear * vBrightness;
        if (alpha < 0.01) discard;
        gl_FragColor = vec4(vec3(1.0) * shape, alpha);
      }
    `,
    depthWrite: false,
    depthTest: true,
    transparent: true,
    blending: THREE.AdditiveBlending,
  });

  const points = new THREE.Points(geometry, material);
  points.frustumCulled = false;
  points.renderOrder = RENDER_ORDER.stars;
  points.name = LAYER_NAMES.stars;

  return points;
};

// Fait varier la taille apparente des étoiles inversement au zoom (sinon elles grossissent à l'écran
// en zoomant, comme un objet physique, alors qu'une étoile reste un point quel que soit le zoom).
export const updateStarFovScale = (cloud: THREE.Points, currentFov: number, baseFov = 75): void => {
  const material = cloud.material as THREE.ShaderMaterial;
  if (material.uniforms?.uFovScale) material.uniforms.uFovScale.value = baseFov / Math.max(1, currentFov);
};

// Libère la géométrie/le matériau GPU avant de reconstruire le nuage (ex: nouveau filtre de
// magnitude) — sans ça, chaque reconstruction fuit la mémoire GPU de l'ancien nuage.
export const disposeStarsLayer = (points: THREE.Points): void => {
  points.geometry.dispose();
  (points.material as THREE.Material).dispose();
};
