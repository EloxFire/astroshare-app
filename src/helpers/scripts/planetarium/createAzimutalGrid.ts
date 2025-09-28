import { THREE } from 'expo-three';
import {drawCircle} from "./utils/drawCircle";
import {planetariumRenderOrders} from "./utils/planetariumSettings";

/**
 * Crée une grille azimutale (type horizontale) à plusieurs niveaux de détail.
 * @param color Couleur des lignes
 * @param radius Rayon de la sphère (par défaut : 1.2)
 */
export function createAzimuthalGrid(color: number, opacity: number = 1, radius: number = 1.2) {
  const grids = [new THREE.Group(), new THREE.Group(), new THREE.Group()];

  const levels = [
    { stepAlt: Math.PI / 18, stepAz: Math.PI / 18 },     // Grille grossière
    { stepAlt: Math.PI / 36, stepAz: Math.PI / 36 },     // Grille moyenne
    { stepAlt: Math.PI / 180, stepAz: Math.PI / 180 }    // Grille fine
  ];

  levels.forEach(({ stepAlt, stepAz }, index) => {
    const group = grids[index];

    // Lignes d'altitude (cercles horizontaux autour de Z)
    for (let alt = -Math.PI / 2 + stepAlt; alt < Math.PI / 2; alt += stepAlt) {
      const rVec = new THREE.Vector3(radius * Math.cos(alt), 0, 0);
      const pVec = new THREE.Vector3(0, 0, radius * Math.sin(alt));
      const axis = new THREE.Vector3(0, 0, 1);
      group.add(drawCircle(rVec, pVec, axis, color));
    }

    // Lignes d'azimut (demi-cercles verticaux, depuis le nadir vers le zénith)
    for (let az = -Math.PI / 2; az < Math.PI / 2; az += stepAz) {
      const rVec = new THREE.Vector3(0, 0, radius);
      const pVec = new THREE.Vector3(0, 0, 0);
      const axis = new THREE.Vector3(Math.cos(az), Math.sin(az), 0);
      group.add(drawCircle(rVec, pVec, axis, color));
    }
  });

  grids.forEach((grid) => {
    grid.renderOrder = planetariumRenderOrders.azGrid;
  })

  return {
    azGrid1: grids[0],
    azGrid2: grids[1],
    azGrid3: grids[2]
  };
}