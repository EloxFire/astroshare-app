import * as THREE from 'three';
import { GestureStateChangeEvent, TapGestureHandlerEventPayload } from 'react-native-gesture-handler';

export type PickResult = {
  type: string;
  object: THREE.Object3D;
  index?: number;
};

const TAP_PRIORITY = ['planet', 'sun', 'moon', 'star', 'dso'];

/**
 * Raycasts from the tap position and returns the highest-priority hit.
 * Uses the actual GL view dimensions (not window.innerWidth) for correct NDC computation on all devices.
 */
export function pickObject(
  event: GestureStateChangeEvent<TapGestureHandlerEventPayload>,
  glViewWidth: number,
  glViewHeight: number,
  scene: THREE.Scene,
  camera: THREE.PerspectiveCamera,
  zenithVec: THREE.Vector3 | null,
  groundVisible: boolean,
  fov = 75,
): PickResult | null {
  if (!glViewWidth || !glViewHeight) return null;

  const ndcX =  (event.x / glViewWidth)  * 2 - 1;
  const ndcY = -(event.y / glViewHeight) * 2 + 1;

  // Scale the point-cloud hit threshold with FOV: wider view = smaller apparent
  // star size = need a larger pick radius to compensate.
  const threshold = Math.max(0.05, fov * 0.0025);

  const raycaster = new THREE.Raycaster();
  raycaster.near = 9;
  raycaster.far = 20;
  raycaster.params.Points = { threshold };
  raycaster.setFromCamera(new THREE.Vector2(ndcX, ndcY), camera);

  let hits = raycaster.intersectObjects(scene.children, true);

  if (groundVisible && zenithVec) {
    const zenith = zenithVec.clone().normalize();
    hits = hits.filter((hit) => {
      const dir = hit.point.clone().normalize();
      return dir.lengthSq() > 0 && dir.dot(zenith) >= 0;
    });
  }

  if (hits.length === 0) return null;

  for (const type of TAP_PRIORITY) {
    const hit = hits.find((h) => h.object.userData?.type === type);
    if (!hit || !hit.object.userData?.onTap) continue;

    return {
      type,
      object: hit.object,
      index: hit.index,
    };
  }

  return null;
}
