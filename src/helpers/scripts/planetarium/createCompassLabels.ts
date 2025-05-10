import * as THREE from 'three';
import * as ExpoTHREE from 'expo-three';
import { LocationObject } from '../../types/LocationObject';
import {getGlobePosition} from "./utils/getGlobePosition";

/**
 * Crée les 4 lettres cardinales (N, E, S, O) sous forme de meshes avec images PNG.
 * @param radius Rayon du cercle d'horizon
 * @param location Position de l'utilisateur pour orienter les lettres
 */
export function createCompassLabels(
  radius: number = 10,
  location: LocationObject
): THREE.Group {
  const group = new THREE.Group();
  const loader = new ExpoTHREE.TextureLoader();

  const labels = [
    { letter: 'N', angle: 0, file: require('../../../../assets/images/planetarium/compass/N.png') },
    { letter: 'E', angle: Math.PI / 2, file: require('../../../../assets/images/planetarium/compass/E.png') },
    { letter: 'S', angle: Math.PI, file: require('../../../../assets/images/planetarium/compass/S.png') },
    { letter: 'O', angle: -Math.PI / 2, file: require('../../../../assets/images/planetarium/compass/W.png') },
  ];

  const lookAtVec = getGlobePosition(location.lat, location.lon);

  labels.forEach(({ letter, angle, file }) => {
    const texture = loader.load(file);
    const material = new THREE.MeshBasicMaterial({ map: texture, transparent: true });
    const geometry = new THREE.PlaneGeometry(1, 1);
    const mesh = new THREE.Mesh(geometry, material);

    mesh.position.set(
      Math.cos(angle) * radius,
      0.01,
      Math.sin(angle) * radius
    );

    // Utilise getGlobePosition pour orienter correctement la lettre
    mesh.lookAt(lookAtVec);

    group.add(mesh);
  });

  group.name = 'CompassLabelsPNG';
  return group;
}

