import * as THREE from 'three';
import {planetariumRenderOrders} from "./utils/planetariumSettings";

/**
 * Selection marker with ring + crosshair style.
 */
export function createSelectionCircle(radius: number = 1, color: number = 0xff0000): THREE.Group {
  const material = new THREE.LineBasicMaterial({
    color,
    transparent: true,
    opacity: 0.95,
    depthTest: false,
  });

  const ringGeometry = new THREE.RingGeometry(radius * 0.9, radius, 64);
  const edgeGeometry = new THREE.EdgesGeometry(ringGeometry);
  const ring = new THREE.LineSegments(edgeGeometry, material);
  ring.renderOrder = planetariumRenderOrders.selectionCircle;

  const crosshairGeom = new THREE.BufferGeometry();
  const lenOuter = 1.1;
  const lenInner = 0.35;
  const vertices = new Float32Array([
    -lenOuter, 0, 0, -lenInner, 0, 0,
     lenOuter, 0, 0,  lenInner, 0, 0,
    0, -lenOuter, 0, 0, -lenInner, 0,
    0,  lenOuter, 0, 0,  lenInner, 0,
  ]);
  crosshairGeom.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
  const crosshair = new THREE.LineSegments(crosshairGeom, material);
  crosshair.renderOrder = planetariumRenderOrders.selectionCircle;

  const group = new THREE.Group();
  group.add(ring, crosshair);
  group.visible = false;
  group.userData.baseScale = { x: 1, y: 1, z: 1 };

  return group;
}
