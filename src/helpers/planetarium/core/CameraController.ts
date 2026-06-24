import * as THREE from 'three';
import { raDecToVec3, vec3ToRaDec, getCameraUp } from '../utils/coordinates';

const PAN_SENSITIVITY_SCALE = 0.65;
const FRICTION = 0.72;
const MAX_INERTIA_VELOCITY = 500;
const MIN_INERTIA_SPEED = 100;
const MIN_FOV = 0.5;
const MAX_FOV = 120;
const MIN_DEC = -89.9;
const MAX_DEC = 89.9;
const INERTIA_STOP_THRESHOLD = 0.2;

// sin(88°): inertia stops when the look direction gets this close to the zenith.
// Above this threshold the alt/az coordinate system is degenerate; preventing
// inertia from drifting into this zone avoids the spinning altogether.
const ZENITH_INERTIA_DOT = Math.sin(88 * Math.PI / 180); // ≈ 0.9994

export class CameraController {
  lookRa: number;
  lookDec: number;
  fov: number;
  private targetFov: number;

  // Inertia velocity (pixels/s from gesture handler, scaled on tick)
  private vX = 0;
  private vY = 0;
  private inertiaActive = false;

  private animTarget: { ra: number; dec: number } | null = null;
  private animStep = 0;
  private animTotalSteps = 60;
  private animCallback: (() => void) | null = null;

  // Local zenith direction in equatorial world space.
  // When set, keeps the horizon visually horizontal.
  private zenithVec: THREE.Vector3 | null = null;

  // Last up vector applied to the camera, used as a stable reference when the
  // camera is near the zenith so the up vector doesn't suddenly rotate.
  private lastUpVec: THREE.Vector3 | null = null;

  constructor(initialRa = 0, initialDec = 45, initialFov = 75) {
    this.lookRa = initialRa;
    this.lookDec = initialDec;
    this.fov = initialFov;
    this.targetFov = initialFov;
  }

  setZenith(v: THREE.Vector3): void {
    this.zenithVec = v.clone().normalize();
  }

  applyPanDelta(deltaX: number, deltaY: number, glViewWidth: number): void {
    const sensitivity = (this.fov * (Math.PI / 180)) / Math.max(1, glViewWidth) * PAN_SENSITIVITY_SCALE;
    const lookVec = raDecToVec3(this.lookRa, this.lookDec, 1).normalize();
    // Use the previous frame's up so the pan axes stay stable near the zenith.
    const upVec = getCameraUp(this.lookRa, this.lookDec, this.zenithVec ?? undefined, this.lastUpVec ?? undefined);
    const rightVec = new THREE.Vector3().crossVectors(lookVec, upVec).normalize();

    // Both axes inverted relative to finger (natural drag, like Stellarium):
    //   swipe right  (deltaX > 0) → look left  → sub rightVec × deltaX
    //   swipe up     (deltaY < 0) → look down  → add upVec × deltaY
    const newLook = lookVec.clone()
      .sub(rightVec.multiplyScalar(deltaX * sensitivity))
      .add(upVec.clone().multiplyScalar(deltaY * sensitivity))
      .normalize();

    const { ra, dec } = vec3ToRaDec(newLook);
    this.lookRa = ra;
    this.lookDec = Math.max(MIN_DEC, Math.min(MAX_DEC, dec));

    // Keep lastUpVec current through the pan so each sub-step inherits a stable up.
    this.lastUpVec = upVec.clone();
    // NOTE: do NOT touch this.vX / this.vY here — those belong to inertia only.
  }

  startInertia(velocityX: number, velocityY: number): void {
    const speed = Math.sqrt(velocityX * velocityX + velocityY * velocityY);
    if (speed < MIN_INERTIA_SPEED) {
      this.inertiaActive = false;
      this.vX = 0;
      this.vY = 0;
      return;
    }
    this.vX = Math.max(-MAX_INERTIA_VELOCITY, Math.min(MAX_INERTIA_VELOCITY, velocityX));
    this.vY = Math.max(-MAX_INERTIA_VELOCITY, Math.min(MAX_INERTIA_VELOCITY, velocityY));
    this.inertiaActive = true;
  }

  stopInertia(): void {
    this.inertiaActive = false;
    this.vX = 0;
    this.vY = 0;
  }

  tickInertia(glViewWidth: number): boolean {
    if (!this.inertiaActive) return false;
    if (Math.abs(this.vX) < INERTIA_STOP_THRESHOLD && Math.abs(this.vY) < INERTIA_STOP_THRESHOLD) {
      this.inertiaActive = false;
      return false;
    }

    // Convert px/s velocity to a per-frame delta (assuming ~60 fps → divide by 60).
    // Quadratic scale: full inertia at 75° FOV, near-zero when zoomed in.
    const fovScale = Math.pow(Math.min(1, this.fov / 75), 2);
    const dt = 1 / 60;
    this.applyPanDelta(this.vX * dt * fovScale, this.vY * dt * fovScale, glViewWidth);

    // Stop inertia as soon as the camera drifts too close to the zenith/nadir.
    // Beyond this point the alt/az system is degenerate — letting inertia carry
    // the camera further would cause the coordinate-singularity spinning.
    if (this.zenithVec) {
      const look = raDecToVec3(this.lookRa, this.lookDec, 1).normalize();
      if (Math.abs(look.dot(this.zenithVec)) > ZENITH_INERTIA_DOT) {
        this.inertiaActive = false;
        this.vX = 0;
        this.vY = 0;
        return false;
      }
    }

    this.vX *= FRICTION;
    this.vY *= FRICTION;
    return true;
  }

  applyZoom(scaleFactor: number): void {
    this.targetFov = Math.max(MIN_FOV, Math.min(MAX_FOV, this.targetFov * scaleFactor));
  }

  setFov(fov: number): void {
    this.targetFov = Math.max(MIN_FOV, Math.min(MAX_FOV, fov));
  }

  tickFov(): void {
    const diff = this.targetFov - this.fov;
    if (Math.abs(diff) < 0.05) {
      this.fov = this.targetFov;
      return;
    }
    this.fov += diff * 0.2;
  }

  setLook(ra: number, dec: number): void {
    this.lookRa = ra;
    this.lookDec = Math.max(MIN_DEC, Math.min(MAX_DEC, dec));
  }

  animateTo(targetRa: number, targetDec: number, steps = 60, onDone?: () => void): void {
    this.animTarget = { ra: targetRa, dec: Math.max(MIN_DEC, Math.min(MAX_DEC, targetDec)) };
    this.animStep = 0;
    this.animTotalSteps = steps;
    this.animCallback = onDone ?? null;
    this.stopInertia();
  }

  tickAnimation(): boolean {
    if (!this.animTarget) return false;

    this.animStep++;
    const t = this.animStep / this.animTotalSteps;
    const eased = 0.5 - 0.5 * Math.cos(Math.PI * t);

    const current = raDecToVec3(this.lookRa, this.lookDec, 1).normalize();
    const target  = raDecToVec3(this.animTarget.ra, this.animTarget.dec, 1).normalize();
    const interp  = current.clone().lerp(target, eased).normalize();
    const { ra, dec } = vec3ToRaDec(interp);
    this.lookRa  = ra;
    this.lookDec = Math.max(MIN_DEC, Math.min(MAX_DEC, dec));

    if (this.animStep >= this.animTotalSteps) {
      this.lookRa  = this.animTarget.ra;
      this.lookDec = this.animTarget.dec;
      this.animTarget = null;
      this.animCallback?.();
      this.animCallback = null;
      return false;
    }
    return true;
  }

  get isAnimating(): boolean {
    return this.animTarget !== null;
  }

  applyToCamera(camera: THREE.PerspectiveCamera): void {
    const target = raDecToVec3(this.lookRa, this.lookDec, 100);
    const up = getCameraUp(this.lookRa, this.lookDec, this.zenithVec ?? undefined, this.lastUpVec ?? undefined);
    this.lastUpVec = up.clone();
    camera.up.copy(up);
    camera.fov = this.fov;
    camera.lookAt(target);
    camera.updateProjectionMatrix();
  }
}
