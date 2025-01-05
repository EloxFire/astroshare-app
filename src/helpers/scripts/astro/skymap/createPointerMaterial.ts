import ExpoTHREE from "expo-three";
import * as THREE from "three";


export const createPointerMaterial = () => {
  const texture1 = new ExpoTHREE.TextureLoader().load(require('../../../../../assets/images/planetarium/pointer/StarPointer.png'));
  
  const pointerMaterial = new THREE.PointsMaterial({
    map: texture1,
    color: "white",
    vertexColors: false,
    size: 0.03,
    sizeAttenuation: true,
    transparent: true,
    blending: THREE.NormalBlending,
    depthTest: false,
    opacity: 1,
  });

  return pointerMaterial ;
};