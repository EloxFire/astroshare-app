import * as THREE from "three";
import {GlobalPlanet} from "../../../../types/GlobalPlanet";
import {convertSphericalToCartesian} from "../convertSphericalToCartesian";
import * as ExpoTHREE from "expo-three";
import {planetTextures} from "../../../../constants";

export const initPlanets = (scene: THREE.Scene, planets: GlobalPlanet[]) => {
  console.log('[Planetarium] Initializing planets...');

  const allPlanets = new THREE.Group()
  planets.forEach((planet: GlobalPlanet) => {
    const { x, y, z } = convertSphericalToCartesian(5, planet.ra, planet.dec);
    const geometry = new THREE.SphereGeometry(0.1, 32, 32);
    const texture: THREE.Texture = new ExpoTHREE.TextureLoader().load(planetTextures[planet.name.toUpperCase()]);
    const material = new THREE.MeshBasicMaterial({ map: texture});
    const planetMesh = new THREE.Mesh(geometry, material);
    planetMesh.position.set(x, y, z);
    allPlanets.add(planetMesh);
  })

  scene.add(allPlanets);

  console.log('[Planetarium] Planets initialized and added to scene.')
  return allPlanets;
}