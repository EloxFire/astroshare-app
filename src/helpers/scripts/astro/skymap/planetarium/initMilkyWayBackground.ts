import * as THREE from "three";
import ExpoTHREE from "expo-three";

export const initMilkyWayBackground = (scene: THREE.Scene) => {
  console.log('[Planetarium] Generating Milky Way background...')
  const loader = new ExpoTHREE.TextureLoader();
  const texture = loader.load(require('../../../../../../assets/images/textures/milkyway.png'));

  const milkyWayGeometry = new THREE.SphereGeometry(100, 64, 64);
  const milkyWayMaterial = new THREE.MeshBasicMaterial({ map: texture, side: THREE.BackSide });
  const milkyWayMesh = new THREE.Mesh(milkyWayGeometry, milkyWayMaterial);

  milkyWayMesh.position.set(0, 0, 0);
  if(milkyWayMaterial.map){
    milkyWayMaterial.map.flipY = false;
  }

  milkyWayMesh.setRotationFromQuaternion(new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), -Math.PI / 2));
  milkyWayMesh.renderOrder = -1
  scene.add(milkyWayMesh);

  console.log('[Planetarium] Milky Way background generated and added to scene.')
  return milkyWayMesh;
}