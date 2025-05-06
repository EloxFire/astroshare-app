import { THREE } from 'expo-three';
import {drawCircle} from "./utils/drawCircle";
import {planetariumRenderOrders} from "./utils/planetariumSettings";

/**
 * Crée une grille équatoriale sphérique à plusieurs niveaux de détail.
 * @param color Couleur des lignes
 * @param radius Rayon de la sphère (par défaut : 1.2)
 */
export function createEquatorialGrid(color: number, radius: number = 1.2) {
  const grids = [new THREE.Group(), new THREE.Group(), new THREE.Group()];

  const levels = [
    { stepLat: Math.PI / 18, stepLon: Math.PI / 12 },     // Grille grossière
    { stepLat: Math.PI / 36, stepLon: Math.PI / 24 },     // Grille moyenne
    { stepLat: Math.PI / 180, stepLon: Math.PI / (12 * 6) } // Grille fine
  ];

  levels.forEach(({ stepLat, stepLon }, index) => {
    const group = grids[index];

    // Lignes de latitude (cercles parallèles)
    for (let lat = -Math.PI / 2 + stepLat; lat < Math.PI / 2; lat += stepLat) {
      const rVec = new THREE.Vector3(radius * Math.cos(lat), 0, 0);
      const pVec = new THREE.Vector3(0, 0, radius * Math.sin(lat));
      const axis = new THREE.Vector3(0, 0, 1); // rotation autour de Z
      group.add(drawCircle(rVec, pVec, axis, color));
    }

    // Lignes de longitude (demi-cercles du pôle nord au pôle sud)
    for (let lon = -Math.PI / 2; lon < Math.PI / 2; lon += stepLon) {
      const rVec = new THREE.Vector3(0, 0, radius);
      const pVec = new THREE.Vector3(0, 0, 0);
      const axis = new THREE.Vector3(Math.cos(lon), Math.sin(lon), 0);
      group.add(drawCircle(rVec, pVec, axis, color));
    }
  });

  grids.forEach((grid) => {
    grid.renderOrder = planetariumRenderOrders.eqGrid;
  })

  return {
    eqGrid1: grids[0],
    eqGrid2: grids[1],
    eqGrid3: grids[2],
  };
}