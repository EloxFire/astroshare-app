import * as THREE from "three";
import {convertSphericalToCartesian} from "../../../convertSphericalToCartesian";
import {Star} from "../../../../../../types/Star";
import {GestureStateChangeEvent, TapGesture, TapGestureHandlerEventPayload} from "react-native-gesture-handler";
import {getBrightStarName} from "../../../../objects/getBrightStarName";

export const handleStartTap = (
  camera: THREE.PerspectiveCamera | null,
  scene: THREE.Scene | null,
  starsCatalog: Star[],
  event: GestureStateChangeEvent<TapGestureHandlerEventPayload> | null,
  pointerUI: THREE.Points | null,
) => {

  if(!camera || !scene || !event || !pointerUI) {
    console.error('[handleTap] Camera or scene or tap event or pointer UI mesh missing');
    return;
  }

  console.log('[handleTap] Handling tap event');

  const raycaster = new THREE.Raycaster();
  raycaster.near = 9;
  raycaster.params.Points.threshold = 0.0015 * camera.getEffectiveFOV();
  raycaster.far = 10;
  const pointer = new THREE.Vector2();
  // console.log('Single tap!');
  pointer.x = (event.x / window.innerWidth) * 2 - 1;
  pointer.y = - (event.y / window.innerHeight) * 2 + 1;
  raycaster.setFromCamera(pointer, camera);
  const intersects = raycaster.intersectObjects(scene.children);
  let Vmin = 30.0;
  let index = '0';
  if (typeof intersects[0] !== 'undefined') {
  console.log('Intersects: ', intersects[0].object);
    intersects.forEach((value, i) => {
      // @ts-ignore
      if (Vmin > parseFloat(starsCatalog[intersects[i].index?.toString()].V)) {
        index = intersects[i].index!.toString();
        // @ts-ignore
        Vmin = parseFloat(starsCatalog[intersects[i].index?.toString()].V);
      }
    })
    let pointerCoos = convertSphericalToCartesian(0.5, parseFloat(String(starsCatalog[parseInt(index)].ra)), parseFloat(String(starsCatalog[parseInt(index)].dec)));
    let g = pointerUI.geometry;
    let p = g.getAttribute('position');
    p.setXYZ(0, pointerCoos.x, pointerCoos.y, pointerCoos.z);
    p.needsUpdate = true;
    pointerUI.visible = true;
    console.log('Star name: ', getBrightStarName(starsCatalog[parseInt(index)].ids));
    // setCurrentTapInfos(starsCatalog[index]);
    camera.updateProjectionMatrix();
  }
}
