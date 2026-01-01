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

export const onShowConstellationLabels = (scene: THREE.Scene) => {
  console.log('[Planetarium] Toggling constellation labels...');
  const constellationLabels = scene.getObjectByName(meshGroupsNames.constellationLabels);
  if (constellationLabels) {
    constellationLabels.visible = !constellationLabels.visible;
  } else {
    console.warn('Constellation labels not found in the scene.');
  }
}

export const onShowGround = (scene: THREE.Scene) => {
  console.log('[Planetarium] Toggling ground...');
  const ground = scene.getObjectByName(meshGroupsNames.ground);
  if (ground) {
    const nextVisible = !ground.visible;
    ground.visible = nextVisible;
  } else {
    console.warn('Ground not found in the scene.');
  }
}

export const onShowCompassLabels = (scene: THREE.Scene) => {
  console.log('[Planetarium] Toggling compass labels...');
  const compassLabels = scene.getObjectByName(meshGroupsNames.compassLabels);
  if (compassLabels) {
    compassLabels.visible = !compassLabels.visible;
  } else {
    console.warn('Compass labels not found in the scene.');
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
  const targets = [
    meshGroupsNames.planets,
    meshGroupsNames.moon,
    meshGroupsNames.sun,
  ];

  targets.forEach((name) => {
    const object = scene.getObjectByName(name);
    if (object) {
      const currentStatus = object.visible;
      object.visible = !currentStatus;
    } else {
      console.warn(`${name} not found in the scene.`);
    }
  });
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
