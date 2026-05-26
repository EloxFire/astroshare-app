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
  texture.generateMipmaps = false;
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.needsUpdate = true;

  const material = new THREE.MeshBasicMaterial({
    map: texture,
    side: THREE.BackSide,
    transparent: false,
    depthWrite: false,
    // Multiply texture RGB by this color — effective brightness/opacity without
    // using the transparent queue (which would render after opaque stars and fail depth test).
    color: new THREE.Color(0.5, 0.5, 0.5),
  });

  const mesh = new THREE.Mesh(new THREE.SphereGeometry(99, 64, 32), material);
  // +PI/2 around X maps Three.js +Y (sphere top) → +Z (NCP in our equatorial system)
  mesh.quaternion.setFromAxisAngle(new THREE.Vector3(1, 0, 0), Math.PI / 2);
  mesh.renderOrder = RENDER_ORDER.background;
  mesh.name = LAYER_NAMES.background;

  reporter?.({ stepId: 'background', title: 'Background dome', detail: 'Milky Way dome ready', status: 'done' });
  return mesh;
}
