import * as THREE from 'three';
import * as ExpoTHREE from "expo-three";

export const createBackground = () => {
  console.log("[GLView] Creating MilkyWay background...");

  const texture = new ExpoTHREE.TextureLoader().load(require('../../../../assets/images/textures/milkyway.png'));
  texture.flipY = false;
  texture.generateMipmaps = false;
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.anisotropy = 4; // ou maxAnisotropy si dispo

  const material = new THREE.MeshBasicMaterial({
    map: texture,
    side: THREE.BackSide,
  });

  const geometry = new THREE.SphereGeometry(100, 64, 64);
  const milkyWay = new THREE.Mesh(geometry, material);
  milkyWay.renderOrder = 0;

  milkyWay.quaternion.setFromAxisAngle(new THREE.Vector3(1, 0, 0), -Math.PI / 2);
  milkyWay.renderOrder = -1;

  console.log("[GLView] MilkyWay background created");
  return milkyWay;
}