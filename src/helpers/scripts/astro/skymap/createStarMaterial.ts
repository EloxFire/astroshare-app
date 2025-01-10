import ExpoTHREE from "expo-three";
import * as THREE from "three";
import { Star } from "../../../types/Star";


export const texturePaths: { [key: string]: string } = {
  M: require('../../../../../assets/images/planetarium/stars/M.png'),
  K: require('../../../../../assets/images/planetarium/stars/K.png'),
  G: require('../../../../../assets/images/planetarium/stars/G.png'),
  F: require('../../../../../assets/images/planetarium/stars/F.png'),
  A: require('../../../../../assets/images/planetarium/stars/A.png'),
  B: require('../../../../../assets/images/planetarium/stars/B.png'),
  O: require('../../../../../assets/images/planetarium/stars/O.png'),
};


/**
 * Fonction pour grouper les étoiles par sp_type[0].
 * @param stars - Tableau d'étoiles.
 * @returns Objet où chaque clé est un sp_type[0], et la valeur est un tableau d'étoiles.
 */
export function groupStarsBySpectralType(stars: Star[]) {
  return stars.reduce((acc, star) => {
    const type = star.sp_type ? star.sp_type[0] : 'A'; // Default to 'A' if type is missing
    if (!acc[type]) {
      acc[type] = [];
    }
    acc[type].push(star);
    return acc;
  }, {} as { [key: string]: Star[] });
}

/**
 * Fonction pour regrouper un groupe d'étoiles par magnitude (V) par pas de 0.1.
 * @param stars - Tableau d'étoiles (groupe).
 * @returns Objet où chaque clé est un intervalle de magnitude, et la valeur est un tableau d'étoiles.
 */
export function groupStarsByMagnitude(stars: Star[]) {
  return stars.reduce((acc, star) => {
    const mag = Math.floor(star.V * 10) / 10;
    if (!acc[mag]) {
      acc[mag] = [];
    }
    acc[mag].push(star);
    return acc;
  }, {} as { [key: number]: Star[] });
}


export const getStarMaterial = (star: Star): THREE.PointsMaterial => {
  const starType = star.sp_type ? star.sp_type[0] : 'A'; // Default to 'A' if type is missing
  // const starOpacity = mapRange(star.V, 0, 6, 0.5, 1); // Map star magnitude to opacity
  const starOpacity = 1;
  const a=21;
  const b=0.05;
  const c=0.5;
  const d=12;
  const f=20;
  const StarSize = (a-d*Math.acos(-b*star.V+c))/f;

  // Check if material already exists for the star type in the cache

  // Get the texture path from the mapping, or default to 'A' texture
  const texturePath = texturePaths[starType] || texturePaths['A'];

  // Create and cache the material
  return new THREE.PointsMaterial({
    map: new ExpoTHREE.TextureLoader().load(texturePath),
    color: "white",
    vertexColors: false,
    size: StarSize,
    sizeAttenuation: true,
    transparent: true,
    blending: THREE.NormalBlending,
    depthTest: false,
    opacity: starOpacity,
  });
};