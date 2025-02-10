import * as THREE from 'three';
import {EquatorialCoordinate, HorizontalCoordinate} from "@observerly/astrometry";
import {convertSphericalToCartesian} from "../convertSphericalToCartesian";
import ExpoTHREE from "expo-three";
import {planetTextures} from "../../../../constants";

export const initMoon = (scene: THREE.Scene, moon: (EquatorialCoordinate & HorizontalCoordinate & { phase: string })) => {
  console.log('[Planetarium] Initializing moon...')

  const { x, y, z } = convertSphericalToCartesian(5, moon.ra, moon.dec);
  const moonGeometry = new THREE.SphereGeometry(0.1, 32, 32);
  const moonTexture = new ExpoTHREE.TextureLoader().load(planetTextures.MOON);
  const moonNormalMap = new ExpoTHREE.TextureLoader().load(planetTextures.MOON_NORMAL);
  const moonMaterial = new THREE.MeshStandardMaterial({ map: moonTexture, normalMap: moonNormalMap });
  const moonMesh = new THREE.Mesh(moonGeometry, moonMaterial);
  moonMesh.position.set(x, y, z);
  scene.add(moonMesh);

  console.log('[Planetarium] Moon initialized and added to scene.')
  return moonMesh;
}