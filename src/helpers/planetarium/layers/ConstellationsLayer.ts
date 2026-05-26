import * as THREE from 'three';
import { constellationsAsterisms } from '../../scripts/astro/constellationsAsterisms';
import { raDecToVec3 } from '../utils/coordinates';
import { loadBitmapFont, buildTextMesh } from '../utils/BitmapText';
import { LAYER_NAMES, RENDER_ORDER } from '../utils/renderOrders';
import { PlanetariumLoadingReporter } from '../utils/loadingReporter';

const LINE_RADIUS  = 9.7;
const LABEL_RADIUS = 9.65;
// Target ~5% screen height for the cap at FOV 75, sphere radius 9.65
const LABEL_PIXEL_SCALE = 0.008;

export function createConstellationLines(): THREE.Group {
  const group = new THREE.Group();
  const material = new THREE.LineBasicMaterial({ color: 'white', transparent: true, opacity: 0.5 });

  (constellationsAsterisms as any[]).forEach((constellation) => {
    const segments = constellation?.feature?.features?.[0]?.geometry?.coordinates ?? [];
    segments.forEach((segment: [number, number][]) => {
      if (segment.length < 2) return;
      const start = raDecToVec3(segment[0][0], segment[0][1], LINE_RADIUS);
      const end   = raDecToVec3(segment[1][0], segment[1][1], LINE_RADIUS);
      const geometry = new THREE.BufferGeometry().setFromPoints([start, end]);
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

export function updateConstellationLabelSizes(
  group: THREE.Group,
  camera: THREE.PerspectiveCamera,
  zenithVec: THREE.Vector3 | null,
  groundVisible: boolean,
): void {
  if (!group.children.length) return;

  const shouldCull = groundVisible && zenithVec != null;
  const zenith = shouldCull ? zenithVec!.clone().normalize() : null;

  group.children.forEach((child) => {
    if (!(child instanceof THREE.Mesh)) return;

    // Mirror the camera's own quaternion so the mesh XY plane stays parallel to
    // the camera's image plane — identical to how THREE.Sprite works internally.
    // This guarantees the text is always upright and readable regardless of where
    // the camera is pointing, with no degenerate cases at the celestial poles.
    child.quaternion.copy(camera.quaternion);

    if (zenith) {
      child.visible = group.visible && child.position.clone().normalize().dot(zenith) >= 0;
    } else {
      child.visible = group.visible;
    }
  });
}
