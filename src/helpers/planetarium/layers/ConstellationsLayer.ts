import * as THREE from 'three';
import { constellationsAsterisms } from '../../scripts/astro/constellationsAsterisms';
import { raDecToVec3 } from '../utils/coordinates';
import { BitmapFont, buildTextMesh } from '../utils/BitmapText';
import { loadBitmapFont } from '../utils/BitmapText';
import { LAYER_NAMES, RENDER_ORDER } from '../utils/renderOrders';
import { PlanetariumLoadingReporter } from '../utils/loadingReporter';
import { doesStarHaveName } from '../../scripts/astro/objects/doesStarHaveName';
import { getBrightStarName } from '../../scripts/astro/objects/getBrightStarName';
import { Star } from '../../types/Star';

const LINE_RADIUS  = 9.7;
const LABEL_RADIUS = 9.65;
// Base size at REF_FOV (75°). The update functions apply tan(fov/2) scaling so
// the label subtends a constant angle on screen regardless of zoom level.
const LABEL_PIXEL_SCALE = 0.005;
const REF_FOV           = 75; // degrees — the design FOV

const STAR_LABEL_RADIUS     = 9.72;
const STAR_LABEL_PIXEL_SCALE = 0.004;

export function createConstellationLines(): THREE.Group {
  const group = new THREE.Group();
  const material = new THREE.LineBasicMaterial({ color: 'white', transparent: true, opacity: 0.5 });

  (constellationsAsterisms as any[]).forEach((constellation) => {
    const rawCoords: unknown[] =
      constellation?.feature?.features?.[0]?.geometry?.coordinates ?? [];

    rawCoords.forEach((seg) => {
      if (!Array.isArray(seg) || seg.length < 2) return;

      const p0 = seg[0];
      const p1 = seg[1];
      // Skip if either point is not a [number, number] array (guards against
      // LineString vs MultiLineString format mismatches and undefined values).
      if (!Array.isArray(p0) || !Array.isArray(p1)) return;
      const [ra0, dec0] = p0 as number[];
      const [ra1, dec1] = p1 as number[];
      if (!isFinite(ra0) || !isFinite(dec0) || !isFinite(ra1) || !isFinite(dec1)) return;

      const start = raDecToVec3(ra0, dec0, LINE_RADIUS);
      const end   = raDecToVec3(ra1, dec1, LINE_RADIUS);
      if (!isFinite(start.x) || !isFinite(end.x)) return;

      const geometry = new THREE.BufferGeometry().setFromPoints([start, end]);
      // Pre-compute bounding sphere synchronously so THREE.js never does it
      // lazily on an unvalidated buffer at render time.
      geometry.computeBoundingSphere();

      group.add(new THREE.Line(geometry, material));
    });
  });

  group.renderOrder = RENDER_ORDER.constellations;
  group.name = LAYER_NAMES.constellations;
  return group;
}

export async function createConstellationLabels(
  reporter?: PlanetariumLoadingReporter,
): Promise<THREE.Group> {
  const group = new THREE.Group();
  group.name = LAYER_NAMES.constellationLabels;
  group.visible = false;

  const constellations = constellationsAsterisms as any[];
  const total = constellations.length;
  reporter?.({ stepId: 'constellations', title: 'Constellation overlays', detail: 'Loading font atlas', status: 'active' });

  const { texture, metrics } = await loadBitmapFont();

  reporter?.({ stepId: 'constellations', title: 'Constellation overlays', detail: `Building ${total} labels`, status: 'active' });

  for (let i = 0; i < constellations.length; i++) {
    const c = constellations[i];
    if (!c?.feature?.features?.[0]) continue;

    const centrum = c.feature.features[0].properties?.centrum;
    if (typeof centrum?.ra !== 'number' || typeof centrum?.dec !== 'number') continue;

    const label: string = c.abbreviation ?? c.name ?? '';
    if (!label) continue;

    const mesh = buildTextMesh(label, texture, metrics, {
      opacity: 0.85,
      pixelScale: LABEL_PIXEL_SCALE,
    });

    const pos = raDecToVec3(centrum.ra, centrum.dec, LABEL_RADIUS);
    mesh.position.copy(pos);
    mesh.renderOrder = RENDER_ORDER.labels;
    group.add(mesh);
  }

  reporter?.({ stepId: 'constellations', title: 'Constellation overlays', detail: `${group.children.length} labels ready`, status: 'done' });
  return group;
}

// Scale factor that keeps labels at a fixed angular size on screen.
// tan(fov/2) / tan(refFov/2) compensates for the perspective projection change
// so that labels neither grow huge when zoomed in nor shrink away when zoomed out.
function fovLabelScale(camera: THREE.PerspectiveCamera): number {
  return (
    Math.tan(THREE.MathUtils.degToRad(camera.fov * 0.5)) /
    Math.tan(THREE.MathUtils.degToRad(REF_FOV * 0.5))
  );
}

export function updateConstellationLabelSizes(
  group: THREE.Group,
  camera: THREE.PerspectiveCamera,
  zenithVec: THREE.Vector3 | null,
  groundVisible: boolean,
): void {
  if (!group.children.length) return;

  const shouldCull = groundVisible && zenithVec != null;
  const zenith     = shouldCull ? zenithVec!.clone().normalize() : null;
  const fovScale   = fovLabelScale(camera);

  group.children.forEach((child) => {
    if (!(child instanceof THREE.Mesh)) return;

    // Mirror the camera quaternion so the text always faces the screen.
    child.quaternion.copy(camera.quaternion);
    // Shrink label proportionally as the user zooms in to prevent it from
    // filling the entire viewport at narrow FOV.
    child.scale.setScalar(fovScale);

    if (zenith) {
      child.visible = group.visible && child.position.clone().normalize().dot(zenith) >= 0;
    } else {
      child.visible = group.visible;
    }
  });
}

// ─── Star name labels ─────────────────────────────────────────────────────────

/**
 * Creates billboard text labels for bright named stars (V ≤ 1.45).
 * Requires a pre-loaded BitmapFont (from loadBitmapFont()).
 * Returns a group that is hidden by default.
 */
export function createStarLabels(
  stars: Star[],
  font: BitmapFont,
): THREE.Group {
  const group = new THREE.Group();
  group.name = LAYER_NAMES.starLabels;
  group.visible = true;

  const namedBright = stars.filter((s) => s.V <= 1.45 && doesStarHaveName(s.ids));

  for (const star of namedBright) {
    const name = getBrightStarName(star.ids);
    if (!name) continue;

    const mesh = buildTextMesh(name, font.texture, font.metrics, {
      color: 0xffd27f,
      opacity: 0.9,
      pixelScale: STAR_LABEL_PIXEL_SCALE,
    });

    // Offset label slightly "north" (NCP direction perpendicular to radial)
    const radial = raDecToVec3(star.ra, star.dec, 1).normalize();
    const ncp = new THREE.Vector3(0, 0, 1);
    const offsetDir = ncp.clone().sub(radial.clone().multiplyScalar(ncp.dot(radial)));
    if (offsetDir.lengthSq() > 1e-6) offsetDir.normalize();
    else offsetDir.set(1, 0, 0);

    const pos = raDecToVec3(star.ra, star.dec, STAR_LABEL_RADIUS).add(offsetDir.multiplyScalar(0.15));
    mesh.position.copy(pos);
    mesh.renderOrder = RENDER_ORDER.labels;
    group.add(mesh);
  }

  return group;
}

/**
 * Updates star label billboards each RAF frame (same pattern as constellation labels).
 */
export function updateStarLabelSizes(
  group: THREE.Group,
  camera: THREE.PerspectiveCamera,
  zenithVec: THREE.Vector3 | null,
  groundVisible: boolean,
): void {
  if (!group.children.length) return;

  const shouldCull = groundVisible && zenithVec != null;
  const zenith     = shouldCull ? zenithVec!.clone().normalize() : null;
  const fovScale   = fovLabelScale(camera);

  group.children.forEach((child) => {
    if (!(child instanceof THREE.Mesh)) return;
    child.quaternion.copy(camera.quaternion);
    child.scale.setScalar(fovScale);
    if (zenith) {
      child.visible = group.visible && child.position.clone().normalize().dot(zenith) >= 0;
    } else {
      child.visible = group.visible;
    }
  });
}
