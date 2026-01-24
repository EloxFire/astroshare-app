import * as THREE from 'three';
import * as ExpoTHREE from "expo-three";
import {meshGroupsNames, planetariumRenderOrders} from "./utils/planetariumSettings";

export const createBackground = async (): Promise<THREE.Mesh> => {
  console.log("[GLView] Creating MilkyWay background...");

  const texture = await ExpoTHREE.loadAsync(require('../../../../assets/images/textures/milkyway.png'));
  texture.flipY = false;
  texture.generateMipmaps = false;
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.anisotropy = 4; // ou maxAnisotropy si dispo

  const material = new THREE.MeshBasicMaterial({
    map: texture,
    side: THREE.BackSide,
    transparent: true,
    opacity: 1,
  });

  const geometry = new THREE.SphereGeometry(100, 64, 64);
  const milkyWay = new THREE.Mesh(geometry, material);

  milkyWay.quaternion.setFromAxisAngle(new THREE.Vector3(1, 0, 0), -Math.PI / 2);
  milkyWay.renderOrder = planetariumRenderOrders.background;
  milkyWay.name = meshGroupsNames.background;

  console.log("[GLView] MilkyWay background created");
  return milkyWay;
}
