import type { GestureTouchEvent } from "react-native-gesture-handler";
import type { CameraController } from "../core/CameraController";

// Distance entre les 2 doigts à l'amorce du pincement — état module (pas un ref React, cette
// fonction est appelée depuis un callback de geste, pas un composant).
let startDistance = 0;

const getDistance = (event: GestureTouchEvent): number => {
  if (event.numberOfTouches !== 2 || event.allTouches?.length < 2) return 0;
  const [a, b] = event.allTouches;
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  return Math.sqrt(dx * dx + dy * dy);
};

export const onPinchDown = (event: GestureTouchEvent): void => {
  startDistance = getDistance(event);
};

export const onPinchMove = (event: GestureTouchEvent, controller: CameraController): void => {
  const currentDistance = getDistance(event);
  if (startDistance <= 0 || currentDistance <= 0) return;
  controller.applyZoom(startDistance / currentDistance);
  startDistance = currentDistance;
};
