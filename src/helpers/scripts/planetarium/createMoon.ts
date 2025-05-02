import * as THREE from 'three';
import * as ExpoTHREE from "expo-three";
import {convertSphericalToCartesian} from "../astro/skymap/convertSphericalToCartesian";
import {planetTextures} from "../../constants";
import {EquatorialCoordinate, HorizontalCoordinate} from "@observerly/astrometry";

export const createMoon = (moonCoords: (EquatorialCoordinate & HorizontalCoordinate & { phase: string })) => {
  console.log("[GLView] Creating moon...")
  const { x, y, z } = convertSphericalToCartesian(10, moonCoords.ra, moonCoords.dec);
  const moonGeometry = new THREE.SphereGeometry(0.1, 32, 32);
  const moonTexture = new ExpoTHREE.TextureLoader().load(planetTextures.MOON);
  const moonNormalMap = new ExpoTHREE.TextureLoader().load(planetTextures.MOON_NORMAL);
  const moonMaterial = new THREE.MeshStandardMaterial({ map: moonTexture, normalMap: moonNormalMap });
  const moonMesh = new THREE.Mesh(moonGeometry, moonMaterial);
  moonMesh.position.set(x, y, z);

  moonMesh.userData = {
    type: 'planet',
    index: 'moon',
    onTap: () => {
      console.log(`[GLView] Moon tapped: ${moonCoords.phase}`);
    }
  };

  console.log("[GLView] Moon created")
  return moonMesh;
}