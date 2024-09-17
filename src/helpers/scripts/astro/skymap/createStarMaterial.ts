import ExpoTHREE from "expo-three";
import * as THREE from "three";
import { Star } from "../../../types/Star";

function mapRange(value: number, inMin: number, inMax: number, outMin: number, outMax: number) {
  return outMin + ((value - inMin) * (outMax - outMin)) / (inMax - inMin);
}

const starMaterials: { [key: string]: THREE.PointsMaterial } = {};

const texturePaths: { [key: string]: string } = {
  M: require('../../../../../assets/images/planetarium/stars/M.png'),
  K: require('../../../../../assets/images/planetarium/stars/K.png'),
  G: require('../../../../../assets/images/planetarium/stars/G.png'),
  F: require('../../../../../assets/images/planetarium/stars/F.png'),
  A: require('../../../../../assets/images/planetarium/stars/A.png'),
  B: require('../../../../../assets/images/planetarium/stars/B.png'),
  O: require('../../../../../assets/images/planetarium/stars/O.png'),
};

// Function to get or create material based on star type
export const getStarMaterial = (star: Star): THREE.PointsMaterial => {
  const starType = star.sp_type ? star.sp_type[0] : 'A'; // Default to 'A' if type is missing
  const starOpacity = mapRange(star.V, 0, 6, 0.5, 1); // Map star magnitude to opacity

  // Check if material already exists for the star type in the cache
  if (!starMaterials[starType]) {
    // Get the texture path from the mapping, or default to 'A' texture
    const texturePath = texturePaths[starType] || texturePaths['A'];

    // Create and cache the material
    starMaterials[starType] = new THREE.PointsMaterial({
      map: new ExpoTHREE.TextureLoader().load(texturePath),
      color: "white", 
      vertexColors: false,
      size: 0.05, 
      sizeAttenuation: true, 
      transparent: true, 
      blending: THREE.NormalBlending, 
      depthTest: false, 
      opacity: starOpacity, 
    });
  }

  return starMaterials[starType];
};