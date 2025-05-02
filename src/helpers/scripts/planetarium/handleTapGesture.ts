import {
  GestureStateChangeEvent,
  TapGestureHandlerEventPayload,
} from "react-native-gesture-handler";
import { THREE } from "expo-three";
import {createEllipseFromCorners} from "./createEllipseFromCorners";

export const handleTapStart = (
  event: GestureStateChangeEvent<TapGestureHandlerEventPayload>,
  sceneRef: React.MutableRefObject<THREE.Scene | null>,
  cameraRef: React.MutableRefObject<THREE.PerspectiveCamera | null>,
  selectionCircle: React.MutableRefObject<THREE.Line | null>,
) => {
  console.log("[GLView] Tap gesture started");

  const camera = cameraRef.current;
  const scene = sceneRef.current;
  const selectionCircleObject = selectionCircle.current!;

  if (!camera || !scene) return;

  const raycaster = new THREE.Raycaster();
  raycaster.near = 9;
  raycaster.far = 20;
  raycaster.params.Points.threshold = 0.008 * camera.getEffectiveFOV();

  const pointer = new THREE.Vector2(
    (event.x / window.innerWidth) * 2 - 1,
    -(event.y / window.innerHeight) * 2 + 1
  );
  raycaster.setFromCamera(pointer, camera);

  const intersects = raycaster.intersectObjects(scene.children, true);

  if (intersects.length === 0) {
    console.log("[GLView] No intersection found");
    selectionCircleObject.visible = false;
    return;
  }

  const priority = ["dso", "star", "planet"];
  for (const type of priority) {
    const target = intersects.find((i) => i.object.userData?.type === type);
    if (!target || !target.object.userData?.onTap) continue;

    // Appel du comportement
    if (type === "star" && target.index != null) {
      target.object.userData.onTap(target.index);
    } else if (type === "dso" && target.index != null) {
      target.object.userData.onTap(target.index);
    } else {
      target.object.userData.onTap();
    }

    // Pour les étoiles et planètes
    const point = new THREE.Vector3();

    if (
      (type === "star") &&
      target.index != null &&
      "geometry" in target.object
    ) {
      const geometry = target.object.geometry as THREE.BufferGeometry;
      const attr = geometry.getAttribute("position");

      point.set(
        attr.getX(target.index),
        attr.getY(target.index),
        attr.getZ(target.index)
      );
      target.object.localToWorld(point);
    } else {
      target.object.getWorldPosition(point);
    }

    // Rayon
    let radius = 0.5;
    if (type === "star") {
      radius = 0.2;
    } else if ("geometry" in target.object) {
      const geometry = target.object.geometry as THREE.BufferGeometry;
      geometry.computeBoundingSphere();
      radius =
        (geometry.boundingSphere?.radius || 1) * target.object.scale.x;
    }

    // Affichage du cercle
    selectionCircleObject.position.copy(point);
    selectionCircleObject.scale.set(radius, radius, radius);
    selectionCircleObject.lookAt(camera.position);
    selectionCircleObject.visible = true;

    return;
  }

  console.log("[GLView] No relevant object found");
  selectionCircleObject.visible = false;
};
