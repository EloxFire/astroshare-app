import * as THREE from 'three';
import { loadBundledTextureAsync } from '../utils/loadBundledTextureAsync';
import { LAYER_NAMES, RENDER_ORDER } from '../utils/renderOrders';
import { PlanetariumLoadingReporter } from '../utils/loadingReporter';

export async function createBackgroundLayer(
  reporter?: PlanetariumLoadingReporter,
): Promise<THREE.Mesh> {
  reporter?.({ stepId: 'background', title: 'Background dome', detail: 'Loading Milky Way texture', status: 'active' });

  const texture = await loadBundledTextureAsync(
    require('../../../../assets/images/textures/milkyway.png'),
  );
  texture.flipY = false;
  texture.generateMipmaps = false;
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.needsUpdate = true;

  const material = new THREE.MeshBasicMaterial({
    map: texture,
    side: THREE.BackSide,
    transparent: true,
    opacity: 1,
    depthWrite: false,
  });

  const mesh = new THREE.Mesh(new THREE.SphereGeometry(100, 64, 64), material);
  // Rotate so that the galactic plane aligns with the equatorial sphere
  mesh.quaternion.setFromAxisAngle(new THREE.Vector3(1, 0, 0), -Math.PI / 2);
  mesh.renderOrder = RENDER_ORDER.background;
  mesh.name = LAYER_NAMES.background;

  reporter?.({ stepId: 'background', title: 'Background dome', detail: 'Milky Way dome ready', status: 'done' });
  return mesh;
}
