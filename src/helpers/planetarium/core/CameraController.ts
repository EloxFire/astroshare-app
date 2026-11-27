import * as THREE from "three";
import { getCameraUp, raDecToVec3, vec3ToRaDec } from "../utils/coordinates";

const PAN_SENSITIVITY_SCALE = 0.65;
const FRICTION = 0.72;
const MAX_INERTIA_VELOCITY = 500;
const MIN_INERTIA_SPEED = 100;
const MIN_FOV = 0.5;
const MAX_FOV = 120;
const MIN_DEC = -89.9;
const MAX_DEC = 89.9;
const INERTIA_STOP_THRESHOLD = 0.2;

// sin(88°) : l'inertie s'arrête quand la direction de visée approche à ce point du zénith — au-delà,
// le repère alt/az est dégénéré, laisser l'inertie continuer ferait tourner la caméra sur elle-même.
const ZENITH_INERTIA_DOT = Math.sin((88 * Math.PI) / 180);

/**
 * Caméra du planétarium, pilotée en RA/Dec (pas en quaternion/euler trois) : `lookRa`/`lookDec`
 * fixent la direction de visée, `fov` le niveau de zoom. Gère elle-même l'inertie du pan, l'easing
 * du zoom et une animation de "vol" fluide vers une cible — le composant appelant se contente
 * d'appeler `applyPanDelta`/`applyZoom`/`animateTo` depuis les gestes et `tick*()`/`applyToCamera`
 * depuis la boucle de rendu.
 */
export class CameraController {
  lookRa: number;
  lookDec: number;
  fov: number;
  private targetFov: number;

  // Vitesse d'inertie (px/s, fournie par le gestionnaire de gestes)
  private vX = 0;
  private vY = 0;
  private inertiaActive = false;

  private animTarget: { ra: number; dec: number } | null = null;
  private animStep = 0;
  private animTotalSteps = 60;
  private animCallback: (() => void) | null = null;

  // Direction du zénith local, en coordonnées équatoriales monde — garde l'horizon horizontal.
  private zenithVec: THREE.Vector3 | null = null;

  // Dernier "up" appliqué à la caméra : repère stable utilisé par getCameraUp près du zénith.
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
    const sensitivity = ((this.fov * Math.PI) / 180 / Math.max(1, glViewWidth)) * PAN_SENSITIVITY_SCALE;
    const lookVec = raDecToVec3(this.lookRa, this.lookDec, 1).normalize();
    const upVec = getCameraUp(this.lookRa, this.lookDec, this.zenithVec ?? undefined, this.lastUpVec ?? undefined);
    const rightVec = new THREE.Vector3().crossVectors(lookVec, upVec).normalize();

    // Les deux axes sont inversés par rapport au doigt (glissement "naturel", comme Stellarium) :
    // glisser à droite (deltaX > 0) → regarder à gauche ; glisser vers le haut (deltaY < 0) →
    // regarder vers le bas.
    const newLook = lookVec
      .clone()
      .sub(rightVec.multiplyScalar(deltaX * sensitivity))
      .add(upVec.clone().multiplyScalar(deltaY * sensitivity))
      .normalize();

    const { ra, dec } = vec3ToRaDec(newLook);
    this.lookRa = ra;
    this.lookDec = Math.max(MIN_DEC, Math.min(MAX_DEC, dec));
    this.lastUpVec = upVec.clone();
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

    // Vitesse px/s → delta par frame (~60 fps), échelle quadratique : inertie pleine à FOV=75°,
    // quasi nulle une fois très zoomé (sinon un petit mouvement de doigt envoie la caméra très loin
    // dans le ciel une fois zoomé).
    const fovScale = Math.pow(Math.min(1, this.fov / 75), 2);
    const dt = 1 / 60;
    this.applyPanDelta(this.vX * dt * fovScale, this.vY * dt * fovScale, glViewWidth);

    // Arrête l'inertie si la caméra dérive trop près du zénith/nadir (repère alt/az dégénéré à cet
    // endroit, la laisser continuer ferait tourner la caméra sur elle-même).
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
    const target = raDecToVec3(this.animTarget.ra, this.animTarget.dec, 1).normalize();
    const interp = current.clone().lerp(target, eased).normalize();
    const { ra, dec } = vec3ToRaDec(interp);
    this.lookRa = ra;
    this.lookDec = Math.max(MIN_DEC, Math.min(MAX_DEC, dec));

    if (this.animStep >= this.animTotalSteps) {
      this.lookRa = this.animTarget.ra;
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
