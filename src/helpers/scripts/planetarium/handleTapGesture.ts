import {
  GestureStateChangeEvent,
  TapGestureHandlerEventPayload,
} from "react-native-gesture-handler";
import { THREE } from "expo-three";
import { computeObject } from "../astro/objects/computeObject";

export const handleTapStart = (
  event: GestureStateChangeEvent<TapGestureHandlerEventPayload>,
  sceneRef: React.MutableRefObject<THREE.Scene | null>,
  cameraRef: React.MutableRefObject<THREE.PerspectiveCamera | null>,
  selectionCircle: React.MutableRefObject<THREE.Object3D | null>,
  setObjectInfos: React.Dispatch<any>
) => {
  console.log("[GLView] Tap gesture started");

  const camera = cameraRef.current;
  const scene = sceneRef.current;
  const selectionCircleObject = selectionCircle.current!;

  if (!camera || !scene) return;

  const setSelectionScale = (x: number, y: number, z: number) => {
    selectionCircleObject.scale.set(x, y, z);
    selectionCircleObject.userData.baseScale = { x, y, z };
  };

  const raycaster = new THREE.Raycaster();
  raycaster.near = 9;
  raycaster.far = 20;
  raycaster.params.Points.threshold = 0.08;

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

  const priority = ["planet", "sun", "moon", "star", "dso"];
  for (const type of priority) {
    const target = intersects.find((i) => i.object.userData?.type === type);
    if (!target || !target.object.userData?.onTap) continue;

    // Appel du comportement
    if (type === "star" && target.index != null) {
      console.log(`[handleTap] Taping Star : ${target.index}`);
      target.object.userData.onTap(target.index);
    } else if (type === "dso") {
      console.log(`[handleTap] Taping DSO : ${target.object.userData.index}`);
      target.object.userData.onTap(target.object.userData.index);
    } else if (type === "planet") {
      console.log(`[handleTap] Taping Planet : ${target.object.userData.name}`);
      target.object.userData.onTap();
    } else if (type === "sun" || type === "moon") {
      console.log(`[handleTap] Taping ${type}`);
      target.object.userData.onTap();
    }

    const point = new THREE.Vector3();

    if (type === "star" && target.index != null && "geometry" in target.object) {
      const geometry = target.object.geometry as THREE.BufferGeometry;
      const attr = geometry.getAttribute("position");

      point.set(
        attr.getX(target.index),
        attr.getY(target.index),
        attr.getZ(target.index)
      );
      target.object.localToWorld(point);

      selectionCircleObject.position.copy(point);
      setSelectionScale(0.200, 0.200, 0.200);
      selectionCircleObject.lookAt(camera.position);
      selectionCircleObject.visible = true;

    }else if (type === "moon"){
      target.object.getWorldPosition(point);

      selectionCircleObject.position.copy(point);
      setSelectionScale(1, 1, 1);
      selectionCircleObject.lookAt(camera.position);
      selectionCircleObject.visible = true;
    } else if (type === "planet" || type === "sun") {
      target.object.getWorldPosition(point);

      selectionCircleObject.position.copy(point);
      setSelectionScale(1, 1, 1);
      selectionCircleObject.lookAt(camera.position);
      selectionCircleObject.visible = true;

    } else if (type === "dso") {
      const corners: THREE.Vector3[] = target.object.userData.corners;

      if (corners && corners.length === 4) {
        // Calcul du centre de l'image
        const center = new THREE.Vector3();
        for (const corner of corners) {
          center.add(corner);
        }
        center.divideScalar(4);

        // Calcul des axes de l'ellipse
        const majorAxis = new THREE.Vector3().subVectors(corners[2], corners[0]).length() / 2;
        const minorAxis = new THREE.Vector3().subVectors(corners[1], corners[0]).length() / 2;

        // Mise à jour du cercle
        selectionCircleObject.position.copy(center);
        setSelectionScale(majorAxis, minorAxis, 1);
        selectionCircleObject.lookAt(camera.position);
        selectionCircleObject.visible = true;
      } else {
        console.warn("[handleTap] Corners not found for DSO");
        selectionCircleObject.visible = false;
      }
    }

    return;
  }

  console.log("[GLView] No relevant object found");
  selectionCircleObject.visible = false;
  setObjectInfos(null); // Clear object info if no relevant object found
};
