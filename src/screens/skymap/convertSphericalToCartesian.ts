import * as THREE from 'three';

export const convertSphericalToCartesian = (r: number, theta: number, phi: number) => {
  let x = r * Math.cos((theta * Math.PI) / 180) * Math.cos((phi * Math.PI) / 180); //Mapping de la coos sphérique sur l'axe x

  let y = r * Math.sin((theta * Math.PI) / 180) * Math.cos((phi * Math.PI) / 180); //Mapping de la coos sphérique sur l'axe y

  let z = r * Math.sin((phi * Math.PI) / 180); //Mapping de la coos sphérique sur l'axe z

  return new THREE.Vector3(x, y, z); //retourne le vecteur 3D correspondant. L'axe x est l'axe pour lequel theta=phi=0 (point vernal de la sphère céleste)
}