import * as THREE from 'three';
import { RENDER_ORDER } from '../utils/renderOrders';
import { raDecToVec3 } from '../utils/coordinates';

export function createSelectionCircle(color = 0xff4444): THREE.Group {
  const mat = new THREE.LineBasicMaterial({
    color,
    transparent: true,
    opacity: 0.95,
    depthTest: false,
  });

  const ring = new THREE.LineSegments(
    new THREE.EdgesGeometry(new THREE.RingGeometry(0.9, 1, 64)),
    mat,
  );
  ring.renderOrder = RENDER_ORDER.selectionCircle;

  const lenOuter = 1.1;
  const lenInner = 0.35;
  const crosshairBuf = new Float32Array([
    -lenOuter, 0, 0,  -lenInner, 0, 0,
     lenOuter, 0, 0,   lenInner, 0, 0,
    0, -lenOuter, 0,  0, -lenInner, 0,
    0,  lenOuter, 0,  0,  lenInner, 0,
  ]);
  const crosshairGeom = new THREE.BufferGeometry();
  crosshairGeom.setAttribute('position', new THREE.BufferAttribute(crosshairBuf, 3));
  const crosshair = new THREE.LineSegments(crosshairGeom, mat);
  crosshair.renderOrder = RENDER_ORDER.selectionCircle;

  const group = new THREE.Group();
  group.add(ring, crosshair);
  group.visible = false;
  group.userData.baseScale = { x: 1, y: 1, z: 1 };
  return group;
}

export function positionSelectionCircle(
  circle: THREE.Group,
  target: THREE.Object3D,
  camera: THREE.PerspectiveCamera,
  family: string,
): void {
  const point = new THREE.Vector3();
  target.getWorldPosition(point);

  const setScale = (x: number, y: number, z: number) => {
    circle.userData.baseScale = { x, y, z };
    circle.scale.set(x, y, z);
  };

  if (family === 'star') {
    circle.position.copy(point);
    setScale(0.22, 0.22, 0.22);
    circle.lookAt(camera.position);
    circle.visible = true;
    return;
  }

  if (family === 'dso' && target.userData?.corners?.length === 4) {
    const corners: THREE.Vector3[] = target.userData.corners;
    const center = new THREE.Vector3();
    corners.forEach((c) => center.add(c));
    center.divideScalar(4);
    const major = new THREE.Vector3().subVectors(corners[2], corners[0]).length() / 2;
    const minor = new THREE.Vector3().subVectors(corners[1], corners[0]).length() / 2;
    circle.position.copy(center);
    setScale(major * 1.1, minor * 1.1, 1);
    circle.lookAt(camera.position);
    circle.visible = true;
    return;
  }

  let radius = 0.4;
  const mesh = target as any;
  if (mesh.geometry?.computeBoundingSphere) {
    mesh.geometry.computeBoundingSphere();
    if (mesh.geometry.boundingSphere?.radius) {
      const s = mesh.scale ? Math.max(mesh.scale.x, mesh.scale.y, mesh.scale.z) : 1;
      radius = mesh.geometry.boundingSphere.radius * s;
    }
  }

  const padding = (family === 'planet' || family === 'sun' || family === 'moon') ? 2.2 : 1.6;
  const base = Math.max(0.25, radius * padding);
  circle.position.copy(point);
  setScale(base, base, base);
  circle.lookAt(camera.position);
  circle.visible = true;
}

/**
 * Position the selection circle directly from equatorial coordinates.
 * Used when an object is selected without a tap (e.g. from search results).
 * apparentSizeArcmin: DSO angular diameter in arcminutes (optional, for scaling).
 */
export function positionSelectionCircleAtRaDec(
  circle: THREE.Group,
  ra: number,
  dec: number,
  camera: THREE.PerspectiveCamera,
  family: string,
  apparentSizeArcmin?: number,
): void {
  const SPHERE_R = 9.5;
  const pos = raDecToVec3(ra, dec, SPHERE_R);

  let scale: number;
  const fam = family.toLowerCase();
  if (fam === 'star') {
    scale = 0.22;
  } else if (fam === 'planet' || fam === 'sun' || fam === 'moon') {
    scale = 0.5;
  } else if (fam === 'dso') {
    if (apparentSizeArcmin && apparentSizeArcmin > 0) {
      const angRad = (apparentSizeArcmin / 60) * (Math.PI / 180);
      scale = Math.max(0.22, Math.min(3.0, SPHERE_R * angRad * 0.65));
    } else {
      scale = 0.35;
    }
  } else {
    scale = 0.35;
  }

  circle.position.copy(pos);
  circle.userData.baseScale = { x: scale, y: scale, z: scale };
  circle.scale.set(scale, scale, scale);
  circle.lookAt(camera.position);
  circle.visible = true;
}

export function tickSelectionCirclePulse(circle: THREE.Group): void {
  if (!circle.visible || !circle.userData?.baseScale) return;
  const pulse = 1 + 0.06 * Math.sin(performance.now() * 0.006);
  const { x, y, z } = circle.userData.baseScale;
  circle.scale.set(x * pulse, y * pulse, z * pulse);
}
