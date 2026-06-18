import { GestureTouchEvent } from 'react-native-gesture-handler';
import { CameraController } from '../core/CameraController';

let _startDistance = 0;

function getDistance(event: GestureTouchEvent): number {
  if (event.numberOfTouches !== 2 || event.allTouches?.length < 2) return 0;
  const [a, b] = event.allTouches;
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  return Math.sqrt(dx * dx + dy * dy);
}

export function onPinchDown(
  event: GestureTouchEvent,
  _controller: CameraController,
): void {
  _startDistance = getDistance(event);
}

export function onPinchMove(
  event: GestureTouchEvent,
  controller: CameraController,
): void {
  const currentDistance = getDistance(event);
  if (_startDistance <= 0 || currentDistance <= 0) return;

  const ratio = _startDistance / currentDistance;
  controller.applyZoom(ratio);
  _startDistance = currentDistance;
}
