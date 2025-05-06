import {
  GestureTouchEvent,
  GestureUpdateEvent,
  PinchGestureChangeEventPayload,
  PinchGestureHandlerEventPayload,
} from "react-native-gesture-handler";
import {getEffectiveAngularResolution} from "./utils/getEffectiveAngularResolution";
import {getEuclideanDistance} from "./utils/getEuclideanDistance";
import {THREE} from "expo-three";
import {getFovFromAngularResolution} from "./utils/getFovFromAngularResolution";

let startAngle: number = 0;

export const handlePinchTouchDown = (event: GestureTouchEvent, cameraRef: React.MutableRefObject<THREE.PerspectiveCamera | null>, cameraWidth: number) => {
  const camera: THREE.PerspectiveCamera | null = cameraRef.current;
  if (!camera) return;

  if (event.numberOfTouches === 2 && event.allTouches?.length === 2) {
    const d = getEuclideanDistance(
      event.allTouches[0].x,
      event.allTouches[0].y,
      event.allTouches[1].x,
      event.allTouches[1].y
    );
    startAngle = d * getEffectiveAngularResolution(camera.getEffectiveFOV(), cameraWidth);
  }
}

export const handlePinchTouchMove = (event: GestureTouchEvent, cameraRef: React.MutableRefObject<THREE.PerspectiveCamera | null>, cameraWidth: number) => {
  const camera = cameraRef.current;
  if (!camera) return;

  if (event.numberOfTouches === 2 && event.allTouches?.length === 2) {
    const currentDistance = getEuclideanDistance(
      event.allTouches[0].x,
      event.allTouches[0].y,
      event.allTouches[1].x,
      event.allTouches[1].y
    );

    let newAngularResolution = startAngle / currentDistance;
    let newFOV = getFovFromAngularResolution(newAngularResolution, cameraWidth);

    newFOV = Math.max(0.01, Math.min(120, newFOV));

    camera.fov = newFOV;
    camera.updateProjectionMatrix();
  }
}