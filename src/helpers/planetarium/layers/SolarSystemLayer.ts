import * as THREE from "three";
import type { TFunction } from "i18next";
import {
  getLunarEquatorialCoordinate,
  getPlanetaryPositions,
  getSolarEquatorialCoordinate,
  type GeographicCoordinate,
} from "@observerly/astrometry";
import { raDecToVec3 } from "../utils/coordinates";
import { LAYER_NAMES, RENDER_ORDER } from "../utils/renderOrders";
import { app_colors } from "../../variables";

// Phase 3 du plan : Soleil/Lune/planètes en points colorés (pas de sphère texturée — voir le plan,
// réservé à une phase ultérieure si des textures sont fournies). Taille FIXE par corps (pas la vraie
// taille angulaire, qui serait de toute façon sous-pixel à l'échelle d'un point à ce stade — voir
// SolarSystemLayer de `main`, qui a besoin d'un calcul de distance géocentrique complet rien que pour
// ça) : juste de quoi distinguer visuellement les corps les uns des autres, comme demandé.
export const SOLAR_SYSTEM_BODY_IDS = ["sun", "moon", "mercury", "venus", "mars", "jupiter", "saturn", "uranus", "neptune"] as const;
export type SolarSystemBodyId = (typeof SOLAR_SYSTEM_BODY_IDS)[number];

// Identifiant catalogue stable de chaque corps (voir CatalogObjectKind: "solar_system", ids du type
// "SS-MARS") — utilisé par la sélection (phase 5) pour aller chercher ses `facts`/désignations via
// getObjectById, jamais pour sa position (toujours calculée en local, voir plus haut).
export const SOLAR_SYSTEM_CATALOG_ID: Record<SolarSystemBodyId, string> = {
  sun: "SS-SUN",
  moon: "SS-MOON",
  mercury: "SS-MERCURY",
  venus: "SS-VENUS",
  mars: "SS-MARS",
  jupiter: "SS-JUPITER",
  saturn: "SS-SATURN",
  uranus: "SS-URANUS",
  neptune: "SS-NEPTUNE",
};

// [r, g, b] 0-1, et taille de point (avant mise à l'échelle par PixelRatio) — Soleil et Lune nettement
// plus gros (ce sont les deux objets dont la taille apparente réelle est comparable, ~0,5°), les
// planètes dans l'ordre décroissant de leur éclat typique.
const BODY_STYLE: Record<SolarSystemBodyId, { color: [number, number, number]; size: number }> = {
  sun: { color: hexToUnitRgb(app_colors.sun.main), size: 26 },
  moon: { color: [0.82, 0.82, 0.86], size: 22 },
  venus: { color: [0.96, 0.93, 0.78], size: 10 },
  jupiter: { color: [0.86, 0.76, 0.6], size: 9 },
  saturn: { color: [0.9, 0.82, 0.6], size: 8 },
  mars: { color: [0.8, 0.42, 0.28], size: 6 },
  mercury: { color: [0.65, 0.63, 0.6], size: 5 },
  uranus: { color: [0.65, 0.88, 0.9], size: 5 },
  neptune: { color: [0.45, 0.55, 0.88], size: 5 },
};

function hexToUnitRgb(hex: string): [number, number, number] {
  const sanitized = hex.replace("#", "");
  return [
    parseInt(sanitized.slice(0, 2), 16) / 255,
    parseInt(sanitized.slice(2, 4), 16) / 255,
    parseInt(sanitized.slice(4, 6), 16) / 255,
  ];
}

// Sens inverse de SOLAR_SYSTEM_CATALOG_ID (ex: "SS-MARS" → "mars") — utilisé par la recherche (phase
// 6) : un résultat `kind: "solar_system"` n'a qu'un id catalogue, il faut retrouver le corps pour lire
// sa position courante dans le snapshot (le catalogue ne la donne jamais, voir plus haut).
const CATALOG_ID_TO_BODY: Record<string, SolarSystemBodyId> = Object.fromEntries(
  SOLAR_SYSTEM_BODY_IDS.map((body) => [SOLAR_SYSTEM_CATALOG_ID[body], body])
);
export const getSolarSystemBodyIdForCatalogId = (catalogId: string): SolarSystemBodyId | null =>
  CATALOG_ID_TO_BODY[catalogId] ?? null;

export type SolarSystemSnapshot = Partial<Record<SolarSystemBodyId, { ra: number; dec: number }>>;

// Positions RA/Dec de tout le système solaire visible (Soleil, Lune, 7 planètes) à un instant donné —
// calculées EN LOCAL via @observerly/astrometry, jamais via le catalogue (qui ne donne ni position ni
// magnitude pour `kind: "solar_system"`, voir CatalogObjectSolarSystemDetails). Le catalogue ne sert
// qu'au moment où l'utilisateur sélectionne un de ces objets (phase 5), pour ses infos/`facts`.
export const computeSolarSystemSnapshot = (date: Date, observer: GeographicCoordinate): SolarSystemSnapshot => {
  const snapshot: SolarSystemSnapshot = {};

  const sun = getSolarEquatorialCoordinate(date);
  snapshot.sun = { ra: sun.ra, dec: sun.dec };

  const moon = getLunarEquatorialCoordinate(date);
  snapshot.moon = { ra: moon.ra, dec: moon.dec };

  for (const planet of getPlanetaryPositions(date, observer)) {
    const key = planet.name.toLowerCase() as SolarSystemBodyId;
    if (key === ("earth" as SolarSystemBodyId)) continue;
    if (!SOLAR_SYSTEM_BODY_IDS.includes(key)) continue;
    snapshot[key] = { ra: planet.ra, dec: planet.dec };
  }

  return snapshot;
};

export const createSolarSystemLayer = (snapshot: SolarSystemSnapshot): THREE.Points => {
  const bodies = SOLAR_SYSTEM_BODY_IDS;
  const count = bodies.length;
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  const sizes = new Float32Array(count);

  bodies.forEach((body, index) => {
    const coord = snapshot[body];
    const style = BODY_STYLE[body];
    const pos = coord ? raDecToVec3(coord.ra, coord.dec, 10) : new THREE.Vector3(0, 0, 0);
    const i3 = index * 3;
    positions[i3] = pos.x;
    positions[i3 + 1] = pos.y;
    positions[i3 + 2] = pos.z;
    colors[i3] = style.color[0];
    colors[i3 + 1] = style.color[1];
    colors[i3 + 2] = style.color[2];
    // Taille nulle (invisible) tant que la position n'est pas encore connue (coord absent) : évite
    // d'afficher un point à l'origine de la scène le temps du tout premier calcul.
    sizes[index] = coord ? style.size : 0;
  });

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute("aColor", new THREE.BufferAttribute(colors, 3));
  geometry.setAttribute("aSize", new THREE.BufferAttribute(sizes, 1));

  const material = new THREE.ShaderMaterial({
    uniforms: { uFovScale: { value: 1.0 } },
    vertexShader: `
      attribute float aSize;
      attribute vec3  aColor;
      varying   vec3  vColor;
      uniform   float uFovScale;
      void main() {
        vColor = aColor;
        gl_PointSize = aSize * uFovScale;
        gl_Position  = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      precision mediump float;
      varying vec3 vColor;
      void main() {
        vec2  coord = gl_PointCoord - vec2(0.5);
        float d     = length(coord);
        float shape = exp(-d * d * 10.0);
        if (shape < 0.03) discard;
        gl_FragColor = vec4(vColor, shape);
      }
    `,
    depthWrite: false,
    depthTest: true,
    transparent: true,
  });

  const points = new THREE.Points(geometry, material);
  points.frustumCulled = false;
  points.renderOrder = RENDER_ORDER.solarSystem;
  points.name = LAYER_NAMES.solarSystem;
  points.userData = { bodyIds: bodies, snapshot };
  return points;
};

// Met à jour les positions en place (pas de reconstruction de géométrie, contrairement aux étoiles
// qui changent de page de catalogue) : appelé à chaque tick d'éphéméride throttlé.
export const updateSolarSystemLayer = (points: THREE.Points, snapshot: SolarSystemSnapshot): void => {
  const positionAttr = points.geometry.getAttribute("position") as THREE.BufferAttribute;
  const sizeAttr = points.geometry.getAttribute("aSize") as THREE.BufferAttribute;

  SOLAR_SYSTEM_BODY_IDS.forEach((body, index) => {
    const coord = snapshot[body];
    if (!coord) return;
    const pos = raDecToVec3(coord.ra, coord.dec, 10);
    positionAttr.setXYZ(index, pos.x, pos.y, pos.z);
    sizeAttr.setX(index, BODY_STYLE[body].size);
  });

  positionAttr.needsUpdate = true;
  sizeAttr.needsUpdate = true;
  points.userData.snapshot = snapshot;
};

export const updateSolarSystemFovScale = (points: THREE.Points, currentFov: number, baseFov = 75): void => {
  const material = points.material as THREE.ShaderMaterial;
  if (material.uniforms?.uFovScale) material.uniforms.uFovScale.value = baseFov / Math.max(1, currentFov);
};

// `t` vient du namespace "explore" (voir ExploreScreen) — noms traduits, pas de dur-codage en
// français (CLAUDE.md §i18n) comme c'était le cas avant la phase 5.
export const getSolarSystemBodyLabel = (body: SolarSystemBodyId, t: TFunction): string => t(`bodies.${body}`);

export const disposeSolarSystemLayer = (points: THREE.Points): void => {
  points.geometry.dispose();
  (points.material as THREE.Material).dispose();
};
