import * as THREE from 'three';
import { GestureStateChangeEvent, TapGestureHandlerEventPayload } from 'react-native-gesture-handler';
import { pickObject } from '../selection/ObjectPicker';
import { positionSelectionCircle } from '../layers/SelectionCircle';

export function onTap(
  event: GestureStateChangeEvent<TapGestureHandlerEventPayload>,
  glViewWidth: number,
  glViewHeight: number,
  scene: THREE.Scene,
  camera: THREE.PerspectiveCamera,
  selectionCircle: THREE.Group,
  zenithVec: THREE.Vector3 | null,
  groundVisible: boolean,
  setSelectedObject: (obj: any) => void,
  fov?: number,
): void {
  const result = pickObject(event, glViewWidth, glViewHeight, scene, camera, zenithVec, groundVisible, fov);

  if (!result) {
    selectionCircle.visible = false;
    setSelectedObject(null);
    return;
  }

  const { type, object, index } = result;
  const family = type;

  if (type === 'star' && index != null) {
    object.userData.onTap(index);
    // Position the circle using point attribute
    const geom = (object as any).geometry as THREE.BufferGeometry;
    const attr = geom.getAttribute('position');
    if (attr) {
      const point = new THREE.Vector3(
        attr.getX(index),
        attr.getY(index),
        attr.getZ(index),
      );
      object.localToWorld(point);
      selectionCircle.position.copy(point);
      selectionCircle.userData.baseScale = { x: 0.22, y: 0.22, z: 0.22 };
      selectionCircle.scale.set(0.22, 0.22, 0.22);
      selectionCircle.lookAt(camera.position);
      selectionCircle.visible = true;
    }
  } else if (type === 'dso') {
    object.userData.onTap(object.userData.index);
    positionSelectionCircle(selectionCircle, object, camera, family);
  } else {
    object.userData.onTap();
    positionSelectionCircle(selectionCircle, object, camera, family);
  }
}
