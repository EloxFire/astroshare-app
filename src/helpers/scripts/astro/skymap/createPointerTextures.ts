import ExpoTHREE from "expo-three";
import * as THREE from "three";

const textures :any = [];

export const createPointerTextures = () => {
  for (let i=0; i<=45;i++){
    const texture = new ExpoTHREE.TextureLoader().load(require('../../../../../assets/images/planetarium/pointer/StarPointer.png'));
    texture.center = new THREE.Vector2(0.5,0.5);
    texture.rotation = Math.PI*i/45
    textures[i]=texture;
  }
  
  return textures;
};