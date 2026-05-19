import * as THREE from 'three';
import {meshGroupsNames, planetariumRenderOrders} from "./utils/planetariumSettings";
import {PlanetariumLoadingReporter} from "./utils/loadingReporter";
import {loadBundledTextureAsync} from "./utils/loadBundledTextureAsync";

export const createBackground = async (reportLoading?: PlanetariumLoadingReporter): Promise<THREE.Mesh> => {
  console.log("[GLView] Creating MilkyWay background...");
  reportLoading?.({
    stepId: 'background',
    title: 'Background dome',
    detail: 'Loading Milky Way texture asset',
    status: 'active',
  });

  const texture = await loadBundledTextureAsync(require('../../../../assets/images/textures/milkyway.png'));
  reportLoading?.({
    stepId: 'background',
    title: 'Background dome',
    detail: 'Applying texture filters and transparency',
    status: 'active',
  });
  texture.flipY = false;
  texture.generateMipmaps = false;
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.anisotropy = 4; // ou maxAnisotropy si dispo
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.needsUpdate = true;

  const material = new THREE.MeshBasicMaterial({
    map: texture,
    color: 0xffffff,
    side: THREE.BackSide,
    transparent: true,
    opacity: 1,
    depthWrite: false,
  });
  material.needsUpdate = true;

  const geometry = new THREE.SphereGeometry(100, 64, 64);
  const milkyWay = new THREE.Mesh(geometry, material);

  milkyWay.quaternion.setFromAxisAngle(new THREE.Vector3(1, 0, 0), -Math.PI / 2);
  milkyWay.renderOrder = planetariumRenderOrders.background;
  milkyWay.name = meshGroupsNames.background;

  console.log("[GLView] MilkyWay background created");
  reportLoading?.({
    stepId: 'background',
    title: 'Background dome',
    detail: 'Background sphere ready',
    status: 'done',
  });
  return milkyWay;
}
