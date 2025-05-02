import * as THREE from 'three';
import * as ExpoTHREE from "expo-three";
import {GlobalPlanet} from "../../types/GlobalPlanet";
import {planetTextures} from "../../constants";
import {convertSphericalToCartesian} from "../astro/skymap/convertSphericalToCartesian";


export const createPlanets = (planets: GlobalPlanet[]) => {
  console.log("[GLView] Creating planets...")

  const meshes: THREE.Mesh[] = [];

  planets.forEach((planet: GlobalPlanet) => {
    const { x, y, z } = convertSphericalToCartesian(10, planet.ra, planet.dec);
    const geometry = new THREE.SphereGeometry(0.1, 32, 32);
    const texture = new ExpoTHREE.TextureLoader().load(planetTextures[planet.name.toUpperCase()]);
    const material = new THREE.MeshBasicMaterial({ map: texture});
    const planetMesh = new THREE.Mesh(geometry, material);
    planetMesh.position.set(x, y, z);
    planetMesh.name = planet.name;

    planetMesh.geometry.computeBoundingSphere();
    planetMesh.geometry.boundingSphere!.radius *= 1.5; // augmente la tolérance au clic

    planetMesh.userData = {
      type: 'planet',
      index: planet.name,
      onTap: () => {
        console.log(`[GLView] Planet tapped: ${planet.name}`);
      }
    };

    meshes.push(planetMesh);
  })

  console.log("[GLView] Planets created")
  return meshes;
}