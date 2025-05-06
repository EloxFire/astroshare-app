import * as THREE from "three";
import {planetariumRenderOrders} from "./utils/renderOrders";

export const createAtmosphere = () => {
  const atmosphereMaterial = new THREE.ShaderMaterial({
    uniforms: {
      uColorNight: { value: new THREE.Color(0x001b3a) }, // bleu nuit
    },
    vertexShader: `
      varying vec3 vWorldPosition;
      void main() {
        vec4 worldPosition = modelMatrix * vec4(position, 1.0);
        vWorldPosition = worldPosition.xyz;
        gl_Position = projectionMatrix * viewMatrix * worldPosition;
      }
    `,
    fragmentShader: `
      precision mediump float;
      uniform vec3 uColorNight;

      void main() {
        gl_FragColor = vec4(uColorNight, 0.5); // ajuster 0.5 pout la transparence pour voir la voie lactée
      }
    `,
    side: THREE.BackSide,
    transparent: true,
    depthWrite: false,
  });

  const geometry = new THREE.SphereGeometry(70, 128, 128);
  const atmosphere = new THREE.Mesh(geometry, atmosphereMaterial);
  atmosphere.renderOrder = planetariumRenderOrders.atmosphere;

  return atmosphere;
};