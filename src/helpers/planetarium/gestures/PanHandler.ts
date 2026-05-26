import {
  GestureStateChangeEvent,
  GestureUpdateEvent,
  PanGestureChangeEventPayload,
  PanGestureHandlerEventPayload,
} from 'react-native-gesture-handler';
import { CameraController } from '../core/CameraController';

export function onPanStart(
  _event: GestureStateChangeEvent<PanGestureHandlerEventPayload>,
  controller: CameraController,
): void {
  controller.stopInertia();
}

export function onPanChange(
  event: GestureUpdateEvent<PanGestureHandlerEventPayload & PanGestureChangeEventPayload>,
  controller: CameraController,
  glViewWidth: number,
  prevTranslation: { x: number; y: number },
): void {
  const deltaX = event.translationX - prevTranslation.x;
  const deltaY = event.translationY - prevTranslation.y;
  controller.applyPanDelta(deltaX, deltaY, glViewWidth);
  prevTranslation.x = event.translationX;
  prevTranslation.y = event.translationY;
}

export function onPanEnd(
  event: GestureStateChangeEvent<PanGestureHandlerEventPayload>,
  controller: CameraController,
): void {
  controller.startInertia(event.velocityX, event.velocityY);
}
