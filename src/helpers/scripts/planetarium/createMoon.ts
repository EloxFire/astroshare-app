import * as THREE from 'three';
import * as ExpoTHREE from "expo-three";
import {convertSphericalToCartesian} from "./utils/convertSphericalToCartesian";
import {planetTextures} from "../../constants";
import {EquatorialCoordinate, HorizontalCoordinate} from "@observerly/astrometry";
import {meshGroupsNames, planetariumRenderOrders} from "./utils/planetariumSettings";
import {moonIcons} from "../loadImages";

export const createMoon = (
  moonCoords: (EquatorialCoordinate & HorizontalCoordinate & { phase: string, currentIconUrl?: string }),
  setUiInfos: React.Dispatch<any>,
) => {
  console.log("[GLView] Creating moon...")
  const { x, y, z } = convertSphericalToCartesian(9.8, moonCoords.ra, moonCoords.dec);
  const moonGeometry = new THREE.SphereGeometry(0.1, 32, 32);
  const moonTexture = new ExpoTHREE.TextureLoader().load(planetTextures.MOON);
  const moonNormalMap = new ExpoTHREE.TextureLoader().load(planetTextures.MOON_NORMAL);
  const moonMaterial = new THREE.MeshStandardMaterial({ map: moonTexture, normalMap: moonNormalMap });
  const moonMesh = new THREE.Mesh(moonGeometry, moonMaterial);
  moonMesh.position.set(x, y, z);

  moonMesh.userData = {
    type: 'moon',
    index: 'moon',
    onTap: () => {
      console.log(`[GLView] Moon tapped: ${moonCoords.phase}`);
      console.log(`[GLView] Moon image URL: ${moonCoords.currentIconUrl}`);
      
      setUiInfos({
        family: 'Moon',
        name: 'Moon',
        ra: moonCoords.ra,
        dec: moonCoords.dec,
        icon: moonCoords.currentIconUrl ? { uri: moonCoords.currentIconUrl } : moonIcons[moonCoords.phase] || moonIcons['Full'],
        phase: moonCoords.phase,
      });
    }
  };

  moonMesh.renderOrder = planetariumRenderOrders.moon;
  moonMesh.name = meshGroupsNames.moon;

  const moonGroup = new THREE.Group();
  moonGroup.add(moonMesh);
  moonGroup.name = meshGroupsNames.moon;

  console.log("[GLView] Moon created")
  return moonGroup;
}
