import * as THREE from 'three';
import * as ExpoTHREE from 'expo-three';
import { constellationsAsterisms } from '../astro/constellationsAsterisms';
import { convertSphericalToCartesian } from './utils/convertSphericalToCartesian';
import { constellationsImages, constellationsLabelImages } from '../loadImages';
import { meshGroupsNames, planetariumRenderOrders } from './utils/planetariumSettings';
import {PlanetariumLoadingReporter} from './utils/loadingReporter';

const DEFAULT_BASE_FOV = 75;
const DEFAULT_LABEL_HEIGHT = 0.10;

export const createConstellationLabels = async (
  radius: number = 9.65,
  baseFov: number = DEFAULT_BASE_FOV,
  reportLoading?: PlanetariumLoadingReporter
): Promise<THREE.Group> => {
  const group = new THREE.Group();
  group.userData.baseFov = baseFov;
  const totalConstellations = constellationsAsterisms.length;

  reportLoading?.({
    stepId: 'constellations',
    title: 'Constellation overlays',
    detail: `Loading ${totalConstellations} constellation label textures`,
    status: 'active',
  });

  for (let index = 0; index < constellationsAsterisms.length; index++) {
    const constellation = constellationsAsterisms[index];
    if (!constellation || !constellation.feature?.features?.[0]) continue;

    const centrum = constellation.feature.features[0].properties?.centrum;
    if (!centrum || typeof centrum.ra !== 'number' || typeof centrum.dec !== 'number') continue;

    const abbreviation = `${constellation.abbreviation ?? ''}`.trim();
    if (index === 0 || index === totalConstellations - 1 || (index + 1) % 12 === 0) {
      reportLoading?.({
        stepId: 'constellations',
        title: 'Constellation overlays',
        detail: `Loading label ${index + 1}/${totalConstellations} (${abbreviation || 'other'})`,
        status: 'active',
      });
    }
    const textureSource = constellationsLabelImages[abbreviation] ?? constellationsImages.OTHER;

    const texture = await ExpoTHREE.loadAsync(textureSource);
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;

    const material = new THREE.SpriteMaterial({
      map: texture,
      transparent: true,
      depthTest: false,
      depthWrite: false,
      opacity: 0.9,
      sizeAttenuation: false,
    });

    const sprite = new THREE.Sprite(material);
    const { x, y, z } = convertSphericalToCartesian(radius, centrum.ra, centrum.dec);
    const aspect = texture.image?.width && texture.image?.height ? texture.image.width / texture.image.height : 1.8;
    const height = DEFAULT_LABEL_HEIGHT;
    const width = height * aspect;

    sprite.position.set(x, y, z);
    sprite.scale.set(width, height, 1);
    sprite.userData.baseScale = new THREE.Vector3(width, height, 1);
    sprite.renderOrder = planetariumRenderOrders.labels;

    group.add(sprite);
  }

  group.name = meshGroupsNames.constellationLabels;
  group.visible = false;
  reportLoading?.({
    stepId: 'constellations',
    title: 'Constellation overlays',
    detail: `Constellation lines and labels ready (${group.children.length} labels)`,
    status: 'done',
  });
  return group;
};

export const updateConstellationLabelSizes = (
  group: THREE.Group | null,
  camera: THREE.PerspectiveCamera | null,
  options?: {
    zenithDirection?: THREE.Vector3 | null;
    groundVisible?: boolean;
  }
) => {
  if (!group || !camera) return;

  const normalizedZenith = options?.zenithDirection ? options.zenithDirection.clone().normalize() : null;
  const shouldCullBelowGround = !!options?.groundVisible && !!normalizedZenith;

  const baseFov: number = group.userData?.baseFov ?? DEFAULT_BASE_FOV;
  const baseFovTan = Math.tan(THREE.MathUtils.degToRad(0.5 * baseFov));
  const currentFovTan = Math.tan(THREE.MathUtils.degToRad(0.5 * camera.fov));

  if (!Number.isFinite(baseFovTan) || baseFovTan === 0 || !Number.isFinite(currentFovTan)) return;

  const scaleFactor = currentFovTan / baseFovTan;

  group.children.forEach((child) => {
    if (!(child instanceof THREE.Sprite)) return;
    const baseScale = child.userData?.baseScale as THREE.Vector3 | undefined;
    if (!baseScale) return;
    child.scale.set(baseScale.x * scaleFactor, baseScale.y * scaleFactor, baseScale.z ?? 1);

    if (shouldCullBelowGround) {
      const direction = child.position.clone().normalize();
      const aboveHorizon = direction.dot(normalizedZenith!) >= 0;
      child.visible = group.visible && aboveHorizon;
    } else {
      child.visible = group.visible;
    }
  });
};
