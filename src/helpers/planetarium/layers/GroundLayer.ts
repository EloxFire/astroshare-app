import * as THREE from 'three';
import { convertHorizontalToEquatorial } from '@observerly/astrometry';
import { LocationObject } from '../../types/LocationObject';
import { raDecToVec3 } from '../utils/coordinates';
import { LAYER_NAMES, RENDER_ORDER } from '../utils/renderOrders';

/**
 * Creates a full sphere with a shader that discards every fragment above the
 * local horizon.  The zenith direction is passed as a uniform, so updating the
 * horizon is a simple uniform write — no quaternion/lookAt gymnastics needed.
 * BackSide makes the inside of the sphere visible, rendering the sub-horizon
 * hemisphere as an opaque black mask.
 */
export function createGroundLayer(location: LocationObject, date: Date): THREE.Mesh {
  const observer = { latitude: location.lat, longitude: location.lon };
  const zenithEq = convertHorizontalToEquatorial(date, observer, { alt: 90, az: 0 });
  const zenithVec = raDecToVec3(zenithEq.ra, zenithEq.dec, 1).normalize();

  const material = new THREE.ShaderMaterial({
    uniforms: {
      uZenith: { value: zenithVec.clone() },
    },
    vertexShader: `
      varying vec3 vWorldDir;
      void main() {
        vec4 wp = modelMatrix * vec4(position, 1.0);
        vWorldDir = normalize(wp.xyz);
        gl_Position = projectionMatrix * viewMatrix * wp;
      }
    `,
    fragmentShader: `
      precision mediump float;
      uniform vec3 uZenith;
      varying vec3 vWorldDir;
      void main() {
        // Discard everything above the horizon (dot > 0 means above zenith plane)
        if (dot(vWorldDir, normalize(uZenith)) > 0.005) discard;
        gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
      }
    `,
    side: THREE.BackSide,
    depthWrite: true,
    depthTest: true,
    transparent: false,
  });

  const mesh = new THREE.Mesh(new THREE.SphereGeometry(1, 64, 32), material);
  mesh.renderOrder = RENDER_ORDER.ground;
  mesh.name = LAYER_NAMES.ground;
  mesh.userData.zenithVec = zenithVec.clone();
  return mesh;
}

export function orientGroundToHorizon(
  ground: THREE.Mesh,
  location: LocationObject,
  date: Date,
): void {
  const observer = { latitude: location.lat, longitude: location.lon };
  const zenithEq = convertHorizontalToEquatorial(date, observer, { alt: 90, az: 0 });
  const zenithVec = raDecToVec3(zenithEq.ra, zenithEq.dec, 1).normalize();

  const mat = ground.material as THREE.ShaderMaterial;
  if (mat.uniforms?.uZenith) {
    (mat.uniforms.uZenith.value as THREE.Vector3).copy(zenithVec);
  }
  ground.userData.zenithVec = zenithVec.clone();
}
