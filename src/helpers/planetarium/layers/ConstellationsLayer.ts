import * as THREE from 'three';
import { constellationsAsterisms } from '../../scripts/astro/constellationsAsterisms';
import { constellationsImages, constellationsLabelImages } from '../../scripts/loadImages';
import { raDecToVec3 } from '../utils/coordinates';
import { loadBundledTextureAsync } from '../utils/loadBundledTextureAsync';
import { LAYER_NAMES, RENDER_ORDER } from '../utils/renderOrders';
import { PlanetariumLoadingReporter } from '../utils/loadingReporter';

const LINE_RADIUS = 9.7;
const LABEL_RADIUS = 9.65;
const DEFAULT_BASE_FOV = 75;
const DEFAULT_LABEL_HEIGHT = 0.10;

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
  group.userData.baseFov = DEFAULT_BASE_FOV;
  group.visible = false;

  const total = (constellationsAsterisms as any[]).length;
  reporter?.({ stepId: 'constellations', title: 'Constellation overlays', detail: `Loading ${total} constellation labels`, status: 'active' });

  for (let i = 0; i < (constellationsAsterisms as any[]).length; i++) {
    const c = (constellationsAsterisms as any[])[i];
    if (!c?.feature?.features?.[0]) continue;

    const centrum = c.feature.features[0].properties?.centrum;
    if (typeof centrum?.ra !== 'number' || typeof centrum?.dec !== 'number') continue;

    const abbr = `${c.abbreviation ?? ''}`.trim();
    if (i === 0 || i === total - 1 || (i + 1) % 12 === 0) {
      reporter?.({ stepId: 'constellations', title: 'Constellation overlays', detail: `Label ${i + 1}/${total} (${abbr || '?'})`, status: 'active' });
    }

    const source = constellationsLabelImages[abbr] ?? constellationsImages.OTHER;
    const texture = await loadBundledTextureAsync(source);
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;

    const sprite = new THREE.Sprite(new THREE.SpriteMaterial({
      map: texture,
      transparent: true,
      depthTest: false,
      depthWrite: false,
      opacity: 0.9,
      sizeAttenuation: false,
    }));

    const pos = raDecToVec3(centrum.ra, centrum.dec, LABEL_RADIUS);
    const aspect = texture.image?.width && texture.image?.height
      ? texture.image.width / texture.image.height
      : 1.8;
    const height = DEFAULT_LABEL_HEIGHT;
    const width  = height * aspect;

    sprite.position.copy(pos);
    sprite.scale.set(width, height, 1);
    sprite.userData.baseScale = new THREE.Vector3(width, height, 1);
    sprite.renderOrder = RENDER_ORDER.labels;
    group.add(sprite);
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

  const baseFov = group.userData?.baseFov ?? DEFAULT_BASE_FOV;
  const baseTan = Math.tan(THREE.MathUtils.degToRad(0.5 * baseFov));
  const curTan  = Math.tan(THREE.MathUtils.degToRad(0.5 * camera.fov));
  if (!Number.isFinite(baseTan) || baseTan === 0) return;

  const scale = curTan / baseTan;
  const shouldCull = groundVisible && zenithVec != null;
  const zenith = shouldCull ? zenithVec!.clone().normalize() : null;

  group.children.forEach((child) => {
    if (!(child instanceof THREE.Sprite)) return;
    const base = child.userData?.baseScale as THREE.Vector3 | undefined;
    if (!base) return;
    child.scale.set(base.x * scale, base.y * scale, 1);
    if (zenith) {
      child.visible = group.visible && child.position.clone().normalize().dot(zenith) >= 0;
    } else {
      child.visible = group.visible;
    }
  });
}
