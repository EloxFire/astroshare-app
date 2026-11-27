import * as THREE from "three";
import { convertHorizontalToEquatorial, type GeographicCoordinate } from "@observerly/astrometry";
import { raDecToVec3 } from "../utils/coordinates";
import { LAYER_NAMES, RENDER_ORDER } from "../utils/renderOrders";

// Sphère pleine dont le shader "discard" tout fragment au-dessus de l'horizon local : la direction
// du zénith est passée en uniform, donc réorienter l'horizon (le temps/lieu changent) est un simple
// écriture d'uniform, pas de gymnastique de quaternion/lookAt. `BackSide` rend visible l'intérieur de
// la sphère : l'hémisphère sous l'horizon s'affiche comme un masque opaque noir.
export const createGroundLayer = (observer: GeographicCoordinate, date: Date): THREE.Mesh => {
  const zenithEq = convertHorizontalToEquatorial(date, observer, { alt: 90, az: 0 });
  const zenithVec = raDecToVec3(zenithEq.ra, zenithEq.dec, 1).normalize();

  const material = new THREE.ShaderMaterial({
    uniforms: { uZenith: { value: zenithVec.clone() } },
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
};

export const orientGroundToHorizon = (ground: THREE.Mesh, observer: GeographicCoordinate, date: Date): void => {
  const zenithEq = convertHorizontalToEquatorial(date, observer, { alt: 90, az: 0 });
  const zenithVec = raDecToVec3(zenithEq.ra, zenithEq.dec, 1).normalize();

  const material = ground.material as THREE.ShaderMaterial;
  if (material.uniforms?.uZenith) (material.uniforms.uZenith.value as THREE.Vector3).copy(zenithVec);
  ground.userData.zenithVec = zenithVec.clone();
};
