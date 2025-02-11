import * as THREE from 'three';
import {createPointerMaterial} from "../createPointerMaterial";

export const initPointer = () => {
  console.log('[initPointer] Creating point UI')

  const pointerGeometry = new THREE.BufferGeometry();
  pointerGeometry.setAttribute('position', new THREE.Float32BufferAttribute([0,1,0], 3));
  const pointermaterial = createPointerMaterial();
  const pointerUI = new THREE.Points(pointerGeometry, pointermaterial);
  pointerUI.visible = false;

  console.log('[initPointer] Pointer UI created')
  return pointerUI;
}
