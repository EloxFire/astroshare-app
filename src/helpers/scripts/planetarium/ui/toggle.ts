import * as THREE from 'three';
import {meshGroupsNames} from "../utils/planetariumSettings";

export const onShowEqGrid = (scene: THREE.Scene) => {
  console.log('[Planetarium] Toggling equatorial grid...');
  const eqGrid = scene.getObjectByName(meshGroupsNames.eqGrid);
  if (eqGrid) {
    const currentStatus = eqGrid.visible
    eqGrid.visible = !currentStatus;
  } else {
    console.warn('Equatorial grid not found in the scene.');
  }
}

export const onShowAzGrid = (scene: THREE.Scene) => {
  console.log('[Planetarium] Toggling azimuthal grid...');
  const azGrid = scene.getObjectByName(meshGroupsNames.azGrid);
  if (azGrid) {
    const currentStatus = azGrid.visible
    azGrid.visible = !currentStatus;
  } else {
    console.warn('Azimuthal grid not found in the scene.');
  }
}

export const onShowConstellations = (scene: THREE.Scene) => {
  console.log('[Planetarium] Toggling constellations...');
  const constellations = scene.getObjectByName(meshGroupsNames.constellations);
  if (constellations) {
    const currentStatus = constellations.visible
    constellations.visible = !currentStatus;
  } else {
    console.warn('Constellations not found in the scene.');
  }
}

export const onShowGround = (scene: THREE.Scene) => {
  console.log('[Planetarium] Toggling ground...');
  const ground = scene.getObjectByName(meshGroupsNames.ground);
  if (ground) {
    const currentStatus = ground.visible
    ground.visible = !currentStatus;
  } else {
    console.warn('Ground not found in the scene.');
  }
}

export const onShowAtmosphere = (scene: THREE.Scene) => {
  console.log('[Planetarium] Toggling atmosphere...');
  const atmosphere = scene.getObjectByName(meshGroupsNames.atmosphere);
  if (atmosphere) {
    const currentStatus = atmosphere.visible
    atmosphere.visible = !currentStatus;
  } else {
    console.warn('Atmosphere not found in the scene.');
  }
}

export const onShowPlanets = (scene: THREE.Scene) => {
  console.log('[Planetarium] Toggling planets...');
  const planets = scene.getObjectByName(meshGroupsNames.planets);
  if (planets) {
    const currentStatus = planets.visible
    planets.visible = !currentStatus;
  } else {
    console.warn('Planets not found in the scene.');
  }
}

export const onShowMoon = (scene: THREE.Scene) => {
  console.log('[Planetarium] Toggling moon...');
  const moon = scene.getObjectByName(meshGroupsNames.moon);
  if (moon) {
    const currentStatus = moon.visible
    moon.visible = !currentStatus;
  } else {
    console.warn('Moon not found in the scene.');
  }
}

export const onShowStars = (scene: THREE.Scene) => {
  console.log('[Planetarium] Toggling stars...');
  const stars = scene.getObjectByName(meshGroupsNames.stars);
  if (stars) {
    const currentStatus = stars.visible
    stars.visible = !currentStatus;
  } else {
    console.warn('Stars not found in the scene.');
  }
}

export const onShowDSO = (scene: THREE.Scene) => {
  console.log('[Planetarium] Toggling DSO...');
  const dso = scene.getObjectByName(meshGroupsNames.dso);
  if (dso) {
    const currentStatus = dso.visible
    dso.visible = !currentStatus;
  } else {
    console.warn('DSO not found in the scene.');
  }
}