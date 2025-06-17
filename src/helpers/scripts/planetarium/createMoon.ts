import * as THREE from 'three';
import * as ExpoTHREE from "expo-three";
import {convertSphericalToCartesian} from "./utils/convertSphericalToCartesian";
import {planetTextures} from "../../constants";
import {EquatorialCoordinate, HorizontalCoordinate} from "@observerly/astrometry";
import {meshGroupsNames, planetariumRenderOrders} from "./utils/planetariumSettings";
import {createTextLabel} from "./createLabel";

export const createMoon = (
  moonCoords: (EquatorialCoordinate & HorizontalCoordinate & { phase: string }),
  setUiInfos: React.Dispatch<any>,
  groundQuaternion: THREE.Quaternion,
  camera: THREE.PerspectiveCamera,
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
      const { x, y, z } = convertSphericalToCartesian(10, moonCoords.ra, moonCoords.dec);
      setUiInfos({
        object: moonCoords,
        meshPosition: new THREE.Vector3(x, y, z),
      });
    }
  };

  const moonLabel = createTextLabel("Lune", moonMesh.position, groundQuaternion, camera);

  moonMesh.renderOrder = planetariumRenderOrders.moon;
  moonMesh.name = meshGroupsNames.planets;
  moonLabel.renderOrder = planetariumRenderOrders.moon;
  moonLabel.name = meshGroupsNames.labels.moon;

  const moonGroup = new THREE.Group();
  moonGroup.add(moonMesh, moonLabel);

  console.log("[GLView] Moon created")
  return moonGroup;
}