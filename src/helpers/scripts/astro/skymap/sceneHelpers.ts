import * as THREE from "three";
import {Star} from "../../../types/Star";
import {getStarColor, getStarMaterial} from "./createStarMaterial";
import {convertSphericalToCartesian} from "./convertSphericalToCartesian";
import {createPointerMaterial} from "./createPointerMaterial";
import {createPointerTextures} from "./createPointerTextures";
import {createEquatorialGrid} from "./createEquatorialGrid";
import {createAzimuthalGrid} from "./createAzimuthalGrid";
import {getGlobePosition} from "./getGlobePosition";
import {drawConstellations} from "./drawConstellations";
import {createGround as groundCreator} from "./createGround";
import {LocationObject} from "../../../types/LocationObject";

export function createStarsGeometry(starsCatalog: Star[]): THREE.Points {
  const stars: number[] = [];
  const starSize: number[] = [];
  const starColor: number[] = [];
  const geometry = new THREE.BufferGeometry();
  const material = getStarMaterial();

  starsCatalog.forEach((star: Star) => {
    const { x, y, z } = convertSphericalToCartesian(10, star.ra, star.dec);
    stars.push(x, y, z);
    starSize.push(300 * Math.exp(-star.V / 3));
    const indice = getStarColor(star.sp_type);
    starColor.push(
      2 * indice ** 2,
      0.5 / (100 * (indice - 0.5) ** 2 + 1),
      2 * (indice - 1) ** 2,
      1.0
    );
  });

  geometry.setAttribute('position', new THREE.Float32BufferAttribute(stars, 3));
  geometry.setAttribute('size', new THREE.Float32BufferAttribute(starSize, 1));
  geometry.setAttribute('color', new THREE.Float32BufferAttribute(starColor, 4));

  const starsCloud = new THREE.Points(geometry, material);
  starsCloud.frustumCulled = false;
  starsCloud.renderOrder = 0;

  return starsCloud;
}

export function createSkySphere(): THREE.Mesh {
  const textureLoader = new THREE.TextureLoader();
  const skyTexture = textureLoader.load(
    require("../../../../../assets/images/textures/milkyway.png")
  );

  const skyGeometry = new THREE.SphereGeometry(1000, 64, 64);
  const skyMaterial = new THREE.MeshBasicMaterial({
    map: skyTexture,
    side: THREE.BackSide,
  });

  const skySphere = new THREE.Mesh(skyGeometry, skyMaterial);
  skySphere.renderOrder = -1;

  return skySphere;
}

export function createPointerUI(): THREE.Points {
  const pointerUICoos = [0, 1, 0];
  const pointergeometry = new THREE.BufferGeometry();
  pointergeometry.setAttribute('position', new THREE.Float32BufferAttribute(pointerUICoos, 3));

  const pointermaterial = createPointerMaterial();
  const pointerUI = new THREE.Points(pointergeometry, pointermaterial);

  const pointerTextures = createPointerTextures();
  pointerUI.material.map = pointerTextures[0];
  pointerUI.frustumCulled = false;
  pointerUI.renderOrder = 1;
  pointerUI.visible = false;

  return pointerUI;
}

export function createGrids(location: LocationObject) {
  const equatorialGrid = createEquatorialGrid(0x337eff);
  equatorialGrid.grid2.visible = false;
  equatorialGrid.grid3.visible = false;

  const azimuthalGrid = createAzimuthalGrid(0x4b33ff);
  azimuthalGrid.grid2.visible = false;
  azimuthalGrid.grid3.visible = false;

  Object.keys(azimuthalGrid).forEach((key) => {
    // @ts-ignore
    azimuthalGrid[key].lookAt(getGlobePosition(location.lat, location.lon));
  });

  return { equatorialGrid, azimuthalGrid };
}

export function createConstellations(): THREE.Object3D {
  const constellations = drawConstellations();
  constellations.renderOrder = 2;
  return constellations;
}

export function createGround(location: LocationObject): THREE.Object3D {
  const ground = groundCreator();
  ground.lookAt(getGlobePosition(location.lat, location.lon));
  ground.renderOrder = 100;
  return ground;
}

// export function updateSceneElements(
//   sceneElements: {
//     ground: THREE.Object3D,
//     azimuthalGrid: Record<string, THREE.Object3D>,
//     pointerUI: THREE.Points
//   },
//   location: { lat: number, lon: number },
//   pointerTextures: THREE.Texture[]
// ) {
//   let textureIndex = 0;
//
//   // Update ground orientation
//   sceneElements.ground.lookAt(getGlobePosition(location.lat, location.lon));
//
//   // Update azimuthal grid orientation
//   Object.keys(sceneElements.azimuthalGrid).forEach((key) => {
//     sceneElements.azimuthalGrid[key].lookAt(
//       getGlobePosition(location.lat, location.lon)
//     );
//   });
//
//   // Cycle through pointer textures
//   textureIndex = (textureIndex + 1) % pointerTextures.length;
//   sceneElements.pointerUI.material.map = pointerTextures[textureIndex];
//
//   return textureIndex;
// }